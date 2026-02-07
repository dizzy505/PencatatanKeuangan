import { BarChart3 } from "lucide-react";
import { Transaction } from "../lib/supabase.ts";
import { getCategoryBreakdown } from "../lib/utils.ts";

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export function CategoryBreakdown({ transactions }: CategoryBreakdownProps) {
  const pengeluaranBreakdown = getCategoryBreakdown(
    transactions,
    "Pengeluaran",
  );
  const pemasukanBreakdown = getCategoryBreakdown(transactions, "Pemasukan");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculatePercentages = (data: typeof pengeluaranBreakdown) => {
    const total = data.reduce((sum, item) => sum + item.total, 0);
    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.total / total) * 100) : 0,
    }));
  };

  const pengeluaranWithPercentage = calculatePercentages(pengeluaranBreakdown);
  const pemasukanWithPercentage = calculatePercentages(pemasukanBreakdown);

  const ColumnChart = ({
    title,
    data,
    type,
  }: {
    title: string;
    data: typeof pengeluaranWithPercentage;
    type: "Pengeluaran" | "Pemasukan";
  }) => {
    const maxValueRaw = Math.max(...data.map((item) => item.total), 1);
    const maxBarHeight = 160; // Further reduced for better proportions

    const formatAxisCurrency = (amount: number) => {
      if (amount >= 1_000_000_000) {
        const v = amount / 1_000_000_000;
        return `Rp ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)} m`;
      }
      if (amount >= 1_000_000) {
        const v = amount / 1_000_000;
        return `Rp ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)} jt`;
      }
      if (amount >= 1_000) {
        const v = amount / 1_000;
        return `Rp ${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)} rb`;
      }
      return `Rp ${Math.round(amount)}`;
    };

    const getNiceTicks = (maxValue: number, steps: number) => {
      const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
      const normalized = maxValue / magnitude;
      const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
      const niceMax = niceNormalized * magnitude;
      const step = niceMax / steps;
      return Array.from({ length: steps + 1 }).map((_, i) => niceMax - i * step);
    };

    const steps = 4;
    const ticks = getNiceTicks(maxValueRaw, steps);
    const maxValue = ticks[0];
    
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-6 text-center text-xl">{title}</h3>
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">Tidak ada data</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart container */}
            <div className="relative h-40">
              {/* Y-axis labels */}
              <div className="absolute -left-4 sm:-left-6 top-0 bottom-0 w-16 sm:w-20 flex flex-col justify-between py-1 text-[10px] sm:text-sm text-gray-600 pr-2 tabular-nums">
                {ticks.map((value, i) => (
                  <div key={i} className="text-right leading-none">
                    {formatAxisCurrency(value)}
                  </div>
                ))}
              </div>
              
              {/* Chart area */}
              <div className="ml-16 sm:ml-20 mr-2 relative h-full border-l-2 border-b-2 border-gray-300 bg-gray-50/30">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Array.from({ length: steps + 1 }).map((_, i) => (
                    <div key={i} className="border-t border-gray-200/50 border-dashed"></div>
                  ))}
                </div>
                
                {/* Bars */}
                <div className="absolute inset-0 overflow-x-auto sm:overflow-visible">
                  <div className="h-full flex items-end gap-3 sm:gap-0 sm:justify-around px-2 pb-2 w-max sm:w-full">
                    {data.map((item) => {
                      const barHeight = (item.total / maxValue) * maxBarHeight;
                      return (
                        <div
                          key={item.kategori}
                          className="flex flex-col items-center flex-none w-10 sm:flex-1 sm:max-w-10 sm:mx-1"
                        >
                          <div className="relative w-full h-full flex flex-col items-center justify-end">
                            <div
                              className="absolute left-1/2 -translate-x-1/2 text-[11px] sm:text-sm font-semibold text-gray-700 bg-white/90 px-2 py-0.5 rounded shadow-sm whitespace-nowrap"
                              style={{ bottom: `${Math.max(barHeight, 3) + 6}px` }}
                            >
                              {item.percentage}%
                            </div>

                            {/* Bar */}
                            <div
                              className={`w-full rounded-t-md transition-all duration-300 hover:opacity-85 hover:shadow-lg ${
                                type === "Pengeluaran" ? "bg-gradient-to-t from-red-600 to-red-500" : "bg-gradient-to-t from-green-600 to-green-500"
                              }`}
                              style={{ height: `${Math.max(barHeight, 3)}px` }}
                              title={`${item.kategori}: ${formatCurrency(item.total)} (${item.percentage}%)`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="ml-16 sm:ml-20 mr-2 overflow-x-auto sm:overflow-visible">
              <div className="flex gap-3 sm:gap-0 sm:justify-around px-2 w-max sm:w-full">
                {data.map((item) => (
                  <div
                    key={item.kategori}
                    className="flex flex-col items-center flex-none w-10 sm:flex-1 sm:max-w-10 sm:mx-1"
                  >
                    <div className="text-[10px] text-gray-700 text-center font-semibold truncate w-full leading-none mb-1">
                      {item.kategori}
                    </div>
                    <div className="text-[10px] text-gray-600 text-center leading-none">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
        <BarChart3 size={28} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Breakdown Kategori</h2>
      </div>

      <div className="space-y-8">
        <ColumnChart
          title="Pengeluaran Berdasarkan Kategori"
          data={pengeluaranWithPercentage}
          type="Pengeluaran"
        />
        <ColumnChart
          title="Pemasukan Berdasarkan Kategori"
          data={pemasukanWithPercentage}
          type="Pemasukan"
        />
      </div>
    </div>
  );
}
