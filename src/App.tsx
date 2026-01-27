import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { supabase, Transaction } from "./lib/supabase";
import { getCurrentUser, logout, User } from "./lib/auth";
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
import { filterTransactions } from "./lib/utils";

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

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("tanggal", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
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
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
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
      const { error } = await supabase
        .from("transactions")
        .update({
          ...updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTransaction.id);

      if (error) throw error;
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
      const { error } = await supabase
        .from("transactions")
        .insert(transactions);

      if (error) throw error;
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
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <BookOpen size={32} className="text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Pencatatan Keuangan</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Masuk sebagai <strong>{user.username}</strong></span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Keluar
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-center">
            Kelola pemasukan dan pengeluaran Anda dengan mudah
          </p>
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
            <div className="lg:col-span-1">
              <TransactionForm onSuccess={fetchTransactions} />
            </div>
            <div className="lg:col-span-2">
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
