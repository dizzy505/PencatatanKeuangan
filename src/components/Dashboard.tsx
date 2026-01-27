import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "../lib/supabase";

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const totalPemasukan = transactions
    .filter((t) => t.tipe === "Pemasukan")
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.tipe === "Pengeluaran")
    .reduce((sum, t) => sum + Number(t.nominal), 0);

  const saldo = totalPemasukan - totalPengeluaran;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Saldo</h3>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Wallet size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(saldo)}</p>
        <p className="text-xs opacity-75 mt-1">Total saldo saat ini</p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Pemasukan</h3>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(totalPemasukan)}</p>
        <p className="text-xs opacity-75 mt-1">Total pemasukan</p>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-90">Pengeluaran</h3>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold">{formatCurrency(totalPengeluaran)}</p>
        <p className="text-xs opacity-75 mt-1">Total pengeluaran</p>
      </div>
    </div>
  );
}
