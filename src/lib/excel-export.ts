import { Transaction } from "./supabase";

export const createExcelTemplate = () => {
  // Create CSV format for template
  const headers = ["tanggal", "kategori", "nominal", "tipe", "keterangan"];

  const templateData = [
    ["2026-01-27", "Makanan", "50000", "Pengeluaran", "Makan siang"],
    ["2026-01-27", "Gaji", "5000000", "Pemasukan", "Gaji bulan 1"],
    ["2026-01-26", "Transport", "25000", "Pengeluaran", "Grab"],
  ];

  const csvContent = [
    headers.join(","),
    ...templateData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `template-transaksi-${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createExcelFromTransactions = (transactions: Transaction[]) => {
  const headers = ["tanggal", "kategori", "nominal", "tipe", "keterangan"];

  const rows = transactions.map((t) => [
    t.tanggal,
    t.kategori,
    t.nominal.toString(),
    t.tipe,
    t.keterangan || "",
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
