import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "../lib/supabase";
import { getStatistics } from "../lib/utils";

interface StatisticsPanelProps {
  transactions: Transaction[];
}

export function StatisticsPanel({ transactions }: StatisticsPanelProps) {
  const stats = getStatistics(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <BarChart3 size={24} className="text-blue-600" />
        Statistik
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalTransactions}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.totalPemasukan)}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.totalPengeluaran)}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Rata-rata Transaksi</p>
          <p className="text-lg font-bold text-purple-600">
            {formatCurrency((stats.avgPemasukan + stats.avgPengeluaran) / 2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-green-600" />
            <p className="text-sm font-medium text-gray-700">
              Rata-rata Pemasukan
            </p>
          </div>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(stats.avgPemasukan)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Max: {formatCurrency(stats.maxPemasukan)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-red-600" />
            <p className="text-sm font-medium text-gray-700">
              Rata-rata Pengeluaran
            </p>
          </div>
          <p className="text-lg font-bold text-red-600">
            {formatCurrency(stats.avgPengeluaran)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Max: {formatCurrency(stats.maxPengeluaran)}
          </p>
        </div>
      </div>
    </div>
  );
}
