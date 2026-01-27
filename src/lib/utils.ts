import { Transaction } from "./supabase";

export const exportToCSV = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    alert("Tidak ada data untuk diexport");
    return;
  }

  const headers = [
    "Tanggal",
    "Kategori",
    "Tipe",
    "Nominal",
    "Keterangan",
    "Dibuat",
  ];
  const rows = transactions.map((t) => [
    t.tanggal,
    t.kategori,
    t.tipe,
    t.nominal.toString(),
    t.keterangan || "",
    t.created_at,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `transaksi-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const filterTransactions = (
  transactions: Transaction[],
  filters: {
    startDate?: string;
    endDate?: string;
    kategori?: string;
    tipe?: "Pemasukan" | "Pengeluaran" | "";
    searchQuery?: string;
  },
): Transaction[] => {
  return transactions.filter((t) => {
    if (filters.startDate && t.tanggal < filters.startDate) return false;
    if (filters.endDate && t.tanggal > filters.endDate) return false;
    if (filters.kategori && t.kategori !== filters.kategori) return false;
    if (filters.tipe && t.tipe !== filters.tipe) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesKeterangan = String(t.keterangan || "").toLowerCase().includes(query);
      const matchesKategori = t.kategori.toLowerCase().includes(query);
      if (!matchesKeterangan && !matchesKategori) return false;
    }
    return true;
  });
};

export const getCategoryBreakdown = (
  transactions: Transaction[],
  tipe: "Pemasukan" | "Pengeluaran",
) => {
  const breakdown: { [key: string]: number } = {};

  transactions
    .filter((t) => t.tipe === tipe)
    .forEach((t) => {
      breakdown[t.kategori] = (breakdown[t.kategori] || 0) + t.nominal;
    });

  return Object.entries(breakdown)
    .map(([kategori, total]) => ({
      kategori,
      total,
      percentage: 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getMonthlySummary = (transactions: Transaction[]) => {
  const summary: {
    [key: string]: { pemasukan: number; pengeluaran: number };
  } = {};

  transactions.forEach((t) => {
    const [year, month] = t.tanggal.split("-");
    const monthKey = `${year}-${month}`;

    if (!summary[monthKey]) {
      summary[monthKey] = { pemasukan: 0, pengeluaran: 0 };
    }

    if (t.tipe === "Pemasukan") {
      summary[monthKey].pemasukan += t.nominal;
    } else {
      summary[monthKey].pengeluaran += t.nominal;
    }
  });

  return Object.entries(summary)
    .map(([month, data]) => ({
      month,
      ...data,
      saldo: data.pemasukan - data.pengeluaran,
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
};

export const getStatistics = (transactions: Transaction[]) => {
  const pemasukan = transactions.filter((t) => t.tipe === "Pemasukan");
  const pengeluaran = transactions.filter((t) => t.tipe === "Pengeluaran");

  const totalPemasukanAmount = pemasukan.reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaranAmount = pengeluaran.reduce((sum, t) => sum + t.nominal, 0);

  const avgPemasukan = pemasukan.length > 0 ? totalPemasukanAmount / pemasukan.length : 0;

  const avgPengeluaran = pengeluaran.length > 0 ? totalPengeluaranAmount / pengeluaran.length : 0;

  const maxPemasukan = Math.max(0, ...pemasukan.map((t) => t.nominal));
  const maxPengeluaran = Math.max(0, ...pengeluaran.map((t) => t.nominal));

  return {
    totalTransactions: transactions.length,
    totalPemasukan: totalPemasukanAmount,
    totalPengeluaran: totalPengeluaranAmount,
    avgPemasukan,
    avgPengeluaran,
    maxPemasukan,
    maxPengeluaran,
  };
};
