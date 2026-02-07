import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Transaction } from "./lib/supabase.ts";
import { getCurrentUser, logout, User } from "./lib/auth.ts";
import { storageService } from "./lib/storage.ts";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { FilterPanel } from "./components/FilterPanel";
import { StatisticsPanel } from "./components/StatisticsPanel";
import { MonthlySummary } from "./components/MonthlySummary";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { EditTransactionModal } from "./components/EditTransactionModal";
import { ImportTransactionModal } from "./components/ImportTransactionModal";
import { filterTransactions } from "./lib/utils.ts";

function App() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    kategori: "",
    tipe: "" as "Pemasukan" | "Pengeluaran" | "",
    searchQuery: "",
  });

  const fetchTransactions = () => {
    try {
      const data = storageService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchTransactions();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setTransactions([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    try {
      const success = storageService.deleteTransaction(id);
      if (!success) {
        throw new Error("Transaksi tidak ditemukan");
      }
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Gagal menghapus transaksi");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleFilterChange = (newFilters: {
    startDate?: string;
    endDate?: string;
    kategori?: string;
    tipe?: "Pemasukan" | "Pengeluaran" | "";
    searchQuery?: string;
  }) => {
    setFilters((prev) => ({
      startDate: newFilters.startDate ?? prev.startDate,
      endDate: newFilters.endDate ?? prev.endDate,
      kategori: newFilters.kategori ?? prev.kategori,
      tipe: newFilters.tipe ?? prev.tipe,
      searchQuery: newFilters.searchQuery ?? prev.searchQuery,
    }));
  };

  const handleSaveEdit = async (updatedData: Partial<Transaction>) => {
    if (!editingTransaction) return;

    try {
      const success = storageService.updateTransaction(editingTransaction.id, updatedData);
      if (!success) {
        throw new Error("Transaksi tidak ditemukan");
      }
      setEditingTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  };

  const handleImportTransactions = async (
    transactions: Partial<Transaction>[],
  ) => {
    try {
      // Convert partial transactions to full transactions
      const fullTransactions: Transaction[] = transactions.map((t) => ({
        id: storageService.generateId(),
        tanggal: t.tanggal || new Date().toISOString().split('T')[0],
        kategori: t.kategori || '',
        keterangan: t.keterangan || '',
        nominal: t.nominal || 0,
        tipe: t.tipe || 'Pengeluaran',
        is_recurring: t.is_recurring || false,
        recurring_frequency: t.recurring_frequency || null,
        recurring_end_date: t.recurring_end_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      // Get existing transactions and add new ones
      const existingTransactions = storageService.getTransactions();
      const allTransactions = [...existingTransactions, ...fullTransactions];
      storageService.saveTransactions(allTransactions);
      fetchTransactions();
    } catch (error) {
      console.error("Error importing transactions:", error);
      throw error;
    }
  };

  const filteredTransactions = filterTransactions(transactions, filters);

  const allCategories = Array.from(
    new Set(transactions.map((t) => t.kategori)),
  ).sort();

  const KATEGORI_PEMASUKAN = [
    "Gaji",
    "Transfer",
    "Tabungan",
    "Lainnya",
  ];
  const KATEGORI_PENGELUARAN = [
    "Mama",
    "Transport",
    "Jajan",
    "Admin",
    "Hadiah",
    "Bensin",
    "Makan",
    "Kuota",
    "Pakaian",
    "Tabungan",
    "Lainnya",
    "Paket",
  ];
  const editingKategoris =
    editingTransaction?.tipe === "Pemasukan"
      ? KATEGORI_PEMASUKAN
      : KATEGORI_PENGELUARAN;

  if (!user) {
    return <Login onSuccess={() => setUser(getCurrentUser())} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="sticky top-0 z-40 -mx-4 px-4 pt-4 pb-4 mb-6 bg-gradient-to-br from-blue-50/80 to-gray-100/80 backdrop-blur border-b border-gray-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/80 shadow-sm border border-gray-200">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                  Pencatatan Keuangan
                </h1>
                <p className="text-sm text-gray-600">
                  Kelola pemasukan dan pengeluaran Anda dengan mudah
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-sm text-gray-700">
                Masuk sebagai <strong className="font-semibold">{user.username}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-sm transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Dashboard transactions={filteredTransactions} />

          <FilterPanel
            onFilter={handleFilterChange}
            categories={allCategories}
          />

          <StatisticsPanel transactions={filteredTransactions} />

          <CategoryBreakdown transactions={filteredTransactions} />

          <MonthlySummary transactions={filteredTransactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-[720px]">
              <TransactionForm onSuccess={fetchTransactions} />
            </div>
            <div className="lg:col-span-2 h-[720px]">
              <TransactionList
                transactions={filteredTransactions}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onImportClick={() => setShowImportModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          kategoris={editingKategoris}
          onSave={handleSaveEdit}
          onClose={() => setEditingTransaction(null)}
        />
      )}

      {showImportModal && (
        <ImportTransactionModal
          onSuccess={(count) => {
            setShowImportModal(false);
            alert(`Berhasil mengimport ${count} transaksi!`);
          }}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportTransactions}
        />
      )}
    </div>
  );
}

export default App;
