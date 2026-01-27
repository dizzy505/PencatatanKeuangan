import { PieChart } from "lucide-react";
import { Transaction } from "../lib/supabase";
import { getCategoryBreakdown } from "../lib/utils";

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

  const colors = [
    "bg-red-100",
    "bg-orange-100",
    "bg-yellow-100",
    "bg-pink-100",
    "bg-purple-100",
  ];

  const CategoryList = ({
    title,
    data,
    type,
  }: {
    title: string;
    data: typeof pengeluaranWithPercentage;
    type: "Pengeluaran" | "Pemasukan";
  }) => (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada data</p>
      ) : (
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div key={item.kategori}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${colors[idx % colors.length]}`}
                  ></div>
                  <span className="text-sm text-gray-700">{item.kategori}</span>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    type === "Pengeluaran" ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PieChart size={24} className="text-blue-600" />
        Breakdown Kategori
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryList
          title="Pengeluaran Berdasarkan Kategori"
          data={pengeluaranWithPercentage}
          type="Pengeluaran"
        />
        <CategoryList
          title="Pemasukan Berdasarkan Kategori"
          data={pemasukanWithPercentage}
          type="Pemasukan"
        />
      </div>
    </div>
  );
}
