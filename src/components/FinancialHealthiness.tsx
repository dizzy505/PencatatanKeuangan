import { HeartPulse } from "lucide-react";
import { Transaction } from "../lib/supabase.ts";
import { getStatistics } from "../lib/utils.ts";

interface FinancialHealthinessProps {
  transactions: Transaction[];
}

export function FinancialHealthiness({ transactions }: FinancialHealthinessProps) {
  const stats = getStatistics(transactions);

  const pemasukan = stats.totalPemasukan;
  const pengeluaran = stats.totalPengeluaran;

  const tabunganTransfer = transactions
    .filter((t) => t.tipe === "Pengeluaran" && t.kategori.toLowerCase() === "tabungan")
    .reduce((sum, t) => sum + t.nominal, 0);

  const pengeluaranKonsumsi = Math.max(pengeluaran - tabunganTransfer, 0);

  const savings = pemasukan - pengeluaranKonsumsi;
  const savingsRate = pemasukan > 0 ? savings / pemasukan : 0;
  const expenseRatio = pemasukan > 0 ? pengeluaranKonsumsi / pemasukan : 1;

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  // Score model (simple, explainable):
  // - Base on savings rate (most important)
  // - Penalize if expenses exceed income
  // - Penalize if there is no income
  let score = 0;
  if (pemasukan <= 0) {
    score = 0;
  } else {
    // savingsRate in [-inf, 1]
    const srScore = clamp((savingsRate + 0.2) / 0.7, 0, 1) * 70; // >=20% savings -> near max
    const erPenalty = clamp((expenseRatio - 0.8) / 0.6, 0, 1) * 30; // >80% spending starts penalty
    score = clamp(Math.round(srScore - erPenalty + 30), 0, 100);
  }

  const getStatus = (s: number) => {
    if (s >= 80) return { label: "Sangat Sehat", color: "text-green-700", bg: "bg-green-50", bar: "bg-green-600", border: "border-green-200" };
    if (s >= 60) return { label: "Sehat", color: "text-emerald-700", bg: "bg-emerald-50", bar: "bg-emerald-600", border: "border-emerald-200" };
    if (s >= 40) return { label: "Cukup", color: "text-yellow-700", bg: "bg-yellow-50", bar: "bg-yellow-500", border: "border-yellow-200" };
    return { label: "Perlu Perhatian", color: "text-red-700", bg: "bg-red-50", bar: "bg-red-600", border: "border-red-200" };
  };

  const status = getStatus(score);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border ${status.border}`}>
      <div className="flex items-center gap-2 mb-4">
        <HeartPulse size={24} className={status.color} />
        <h2 className="text-xl font-bold text-gray-800">Financial Healthiness</h2>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-gray-700">Skor</div>
          <div className={`text-4xl font-extrabold leading-tight ${status.color}`}>{score}</div>
          <div className={`text-sm font-semibold ${status.color}`}>{status.label}</div>
        </div>

        <div className="flex-1">
          <div className="h-3 bg-white/70 rounded-full overflow-hidden border border-gray-200">
            <div className={`h-full ${status.bar}`} style={{ width: `${score}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="flex items-center justify-between bg-white/60 border border-gray-200 rounded-md px-3 py-2">
              <span>Pemasukan</span>
              <span className="font-semibold">{formatCurrency(pemasukan)}</span>
            </div>
            <div className="flex items-center justify-between bg-white/60 border border-gray-200 rounded-md px-3 py-2">
              <span>Pengeluaran (Konsumsi)</span>
              <span className="font-semibold">{formatCurrency(pengeluaranKonsumsi)}</span>
            </div>
            <div className="flex items-center justify-between bg-white/60 border border-gray-200 rounded-md px-3 py-2">
              <span>Tabungan (Transfer)</span>
              <span className="font-semibold">{formatCurrency(tabunganTransfer)}</span>
            </div>
            <div className="flex items-center justify-between bg-white/60 border border-gray-200 rounded-md px-3 py-2">
              <span>Savings Rate</span>
              <span className="font-semibold">{pemasukan > 0 ? formatPercent(savingsRate) : "0%"}</span>
            </div>
            <div className="flex items-center justify-between bg-white/60 border border-gray-200 rounded-md px-3 py-2">
              <span>Expense Ratio</span>
              <span className="font-semibold">{pemasukan > 0 ? formatPercent(expenseRatio) : "0%"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        {pemasukan <= 0 ? (
          <span>
            Tambahkan data pemasukan agar skor bisa dihitung dengan lebih akurat.
          </span>
        ) : (
          <span>
            Perhitungan: <strong>Tabungan</strong> yang tercatat sebagai kategori pengeluaran <strong>"Tabungan"</strong> dianggap sebagai transfer savings (bukan konsumsi).
            Target umum: <strong>Savings Rate</strong> minimal 20% dan <strong>Expense Ratio</strong> di bawah 80%.
          </span>
        )}
      </div>
    </div>
  );
}
