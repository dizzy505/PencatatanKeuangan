import { Transaction } from "./supabase.ts";
import * as XLSX from 'xlsx';

export const createExcelTemplate = () => {
  // Create Excel format for template
  const headers = ["Tanggal", "Jenis Transaksi", "Kategori", "Nominal"];

  const templateData = [
    ["27/01/2026", "Pengeluaran", "Makanan", "50000"],
    ["27/01/2026", "Pemasukan", "Gaji", "5000000"],
    ["26/01/2026", "Pengeluaran", "Transport", "25000"],
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...templateData]);
  
  // Set column widths
  ws['!cols'] = [
    { width: 15 }, // Tanggal
    { width: 20 }, // Jenis Transaksi
    { width: 20 }, // Kategori
    { width: 15 }, // Nominal
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, "Template Transaksi");
  
  // Generate and download file
  XLSX.writeFile(wb, `template-transaksi-${new Date().toISOString().split("T")[0]}.xlsx`);
};

export const createExcelFromTransactions = (transactions: Transaction[]) => {
  const headers = ["Tanggal", "Jenis Transaksi", "Kategori", "Nominal"];

  const rows = transactions.map((t) => [
    // Convert YYYY-MM-DD to DD/MM/YYYY
    t.tanggal.split("-").reverse().join("/"),
    t.tipe,
    t.kategori,
    t.nominal.toString(),
  ]);

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Set column widths
  ws['!cols'] = [
    { width: 15 }, // Tanggal
    { width: 20 }, // Jenis Transaksi
    { width: 20 }, // Kategori
    { width: 15 }, // Nominal
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, "Data Transaksi");
  
  // Generate and download file
  XLSX.writeFile(wb, `transaksi-${new Date().toISOString().split("T")[0]}.xlsx`);
};
