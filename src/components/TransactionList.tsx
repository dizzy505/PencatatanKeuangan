import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Edit2,
  Download,
  Upload,
} from "lucide-react";
import { Transaction } from "../lib/supabase.ts";
import { exportToCSV } from "../lib/utils.ts";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onImportClick?: () => void;
}

export function TransactionList({
  transactions,
  onDelete,
  onEdit,
  onImportClick,
}: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Daftar Transaksi</h2>
        <div className="flex gap-2">
          <button
            onClick={onImportClick}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
            title="Import dari Excel"
          >
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={() => exportToCSV(transactions)}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export sebagai CSV"
            disabled={transactions.length === 0}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-500 flex-1 flex items-center justify-center">
          Belum ada transaksi. Tambahkan transaksi pertama Anda atau gunakan
          tombol Import di atas!
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.tipe === "Pemasukan"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.tipe === "Pemasukan" ? (
                      <TrendingUp size={20} />
                    ) : (
                      <TrendingDown size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {transaction.kategori}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(transaction.tanggal)}
                      </span>
                    </div>
                    {transaction.keterangan && (
                      <p className="text-sm text-gray-600 truncate">
                        {transaction.keterangan}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`font-semibold text-lg ${
                      transaction.tipe === "Pemasukan"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.tipe === "Pemasukan" ? "+" : "-"}{" "}
                    {formatCurrency(transaction.nominal)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit transaksi"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Hapus transaksi"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
