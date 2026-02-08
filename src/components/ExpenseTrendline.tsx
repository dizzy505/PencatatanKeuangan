import { TrendingDown } from "lucide-react";
import { Transaction } from "../lib/supabase.ts";
import { getMonthlySummary } from "../lib/utils.ts";

interface ExpenseTrendlineProps {
  transactions: Transaction[];
}

export function ExpenseTrendline({ transactions }: ExpenseTrendlineProps) {
  const summary = getMonthlySummary(transactions)
    .slice()
    .reverse();

  const points = summary.map((s) => ({
    month: s.month,
    value: s.pengeluaran,
  }));

  const maxValueRaw = Math.max(...points.map((p) => p.value), 1);
  const minValueRaw = Math.min(...points.map((p) => p.value), 0);

  const formatCurrencyShort = (amount: number) => {
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

  const formatMonthShort = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("id-ID", { month: "short" });
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
  const minValue = Math.min(minValueRaw, 0);

  const height = 220;
  const padding = { top: 18, right: 18, bottom: 34, left: 56 };
  const minWidth = 720;
  const widthPerPoint = 56;
  const width = Math.max(minWidth, padding.left + padding.right + Math.max(points.length - 1, 1) * widthPerPoint);

  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xForIndex = (i: number) => {
    if (points.length <= 1) return padding.left + innerW / 2;
    return padding.left + (i / (points.length - 1)) * innerW;
  };

  const yForValue = (v: number) => {
    const range = Math.max(maxValue - minValue, 1);
    const normalized = (v - minValue) / range;
    return padding.top + (1 - normalized) * innerH;
  };

  const pathD = points
    .map((p, i) => {
      const x = xForIndex(i);
      const y = yForValue(p.value);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  if (summary.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Belum ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingDown size={24} className="text-red-600" />
        <h2 className="text-xl font-bold text-gray-800">Trend Pengeluaran</h2>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          role="img"
        >
          {ticks.map((t) => {
            const y = yForValue(t);
            return (
              <g key={t}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6B7280"
                  className="tabular-nums"
                >
                  {formatCurrencyShort(t)}
                </text>
              </g>
            );
          })}

          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#D1D5DB"
            strokeWidth={2}
          />
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#D1D5DB"
            strokeWidth={2}
          />

          <path d={pathD} fill="none" stroke="#EF4444" strokeWidth={3} />

          {points.map((p, i) => {
            const x = xForIndex(i);
            const y = yForValue(p.value);
            return (
              <g key={p.month}>
                <circle cx={x} cy={y} r={4} fill="#EF4444">
                  <title>
                    {formatMonthShort(p.month)}: {formatCurrencyShort(p.value)}
                  </title>
                </circle>
                <text
                  x={x}
                  y={height - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                >
                  {formatMonthShort(p.month)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        Menampilkan {summary.length} bulan
      </div>
    </div>
  );
}
