import { Transaction } from "./supabase.ts";
import * as XLSX from 'xlsx';

export interface ImportedRow {
  tanggal?: string;
  kategori?: string;
  keterangan?: string;
  nominal?: number | string;
  tipe?: string;
  [key: string]: string | number | undefined;
}

export interface ImportResult {
  valid: ImportedRow[];
  errors: Array<{
    row: number;
    message: string;
  }>;
}

// Simple CSV parser
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let current: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      current.push(currentField.trim());
      currentField = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentField || current.length > 0) {
        current.push(currentField.trim());
        if (current.some((f) => f)) {
          rows.push(current);
        }
        current = [];
        currentField = "";
      }
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      currentField += char;
    }
  }

  if (currentField || current.length > 0) {
    current.push(currentField.trim());
    if (current.some((f) => f)) {
      rows.push(current);
    }
  }

  return rows;
};

export const parseExcelFile = (file: File): Promise<ImportedRow[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        let rows: string[][] = [];
        
        // Check if it's an Excel file (.xlsx)
        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          rows = jsonData;
        } else {
          // Handle as CSV
          const text = result as string;
          rows = parseCSV(text);
        }

        if (rows.length === 0) {
          reject(new Error("File kosong"));
          return;
        }

        // Get headers from first row
        const headers = rows[0].map((h) => normalizeColumnName(h));
        const importData: ImportedRow[] = [];

        // Parse data rows
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const obj: ImportedRow = {};

          for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = row[j];
            if (header && value) {
              obj[header] = value;
            }
          }

          if (Object.keys(obj).length > 0) {
            importData.push(obj);
          }
        }

        resolve(importData);
      } catch (error) {
        reject(new Error("Gagal membaca file"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Gagal membaca file"));
    };
    
    // Read as binary for Excel files, text for CSV
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  });
};

export const normalizeColumnName = (name: string): string => {
  const normalized = name.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^\w]/g, "");
  
  // Exact mappings for the format in the image
  const columnMappings: Record<string, string> = {
    "tanggal": "tanggal",
    "jenis_transaksi": "jenis_transaksi",
    "jenistransaksi": "jenis_transaksi",
    "kategori": "kategori",
    "nominal": "nominal",
    "tipe": "jenis_transaksi", // For backward compatibility
  };
  
  return columnMappings[normalized] || normalized;
};

export const convertDateFormat = (dateStr: string): string => {
  // Handle DD/MM/YYYY format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  // Handle DD-MM-YYYY format
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  // Already YYYY-MM-DD
  return dateStr;
};

export const convertTransactionType = (typeStr: string): string => {
  const normalized = String(typeStr).toLowerCase().trim();

  if (
    normalized.includes("masuk") ||
    normalized.includes("income") ||
    normalized.includes("pemasukan")
  ) {
    return "Pemasukan";
  }
  if (
    normalized.includes("keluar") ||
    normalized.includes("expense") ||
    normalized.includes("pengeluaran")
  ) {
    return "Pengeluaran";
  }

  return typeStr; // Return as-is if can't determine
};

export const cleanNominal = (nominalStr: string | number): number => {
  // Remove Rp, spaces, dots, and commas
  const str = String(nominalStr)
    .replace(/[Rp]/gi, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .trim();

  return parseFloat(str);
};

export const validateImportData = (rows: ImportedRow[]): ImportResult => {
  const valid: ImportedRow[] = [];
  const errors: Array<{ row: number; message: string }> = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const errors_: string[] = [];

    // Normalize keys
    const normalized: ImportedRow = {};
    Object.entries(row).forEach(([key, value]) => {
      const normalizedKey = normalizeColumnName(key);
      normalized[normalizedKey] = value;
    });

    // Check tanggal
    if (!normalized.tanggal) {
      errors_.push('Kolom "Tanggal" tidak boleh kosong');
    } else {
      try {
        const convertedDate = convertDateFormat(String(normalized.tanggal));
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(convertedDate)) {
          errors_.push("Format tanggal tidak valid (gunakan DD/MM/YYYY)");
        } else {
          normalized.tanggal = convertedDate;
        }
      } catch {
        errors_.push("Format tanggal tidak valid (gunakan DD/MM/YYYY)");
      }
    }

    // Check jenis_transaksi
    if (!normalized.jenis_transaksi) {
      errors_.push('Kolom "Jenis Transaksi" tidak boleh kosong');
    } else {
      const convertedType = convertTransactionType(String(normalized.jenis_transaksi));
      const validTypes = ["Pemasukan", "Pengeluaran"];
      if (!validTypes.includes(convertedType)) {
        errors_.push(
          'Jenis Transaksi harus "Pemasukan" atau "Pengeluaran"',
        );
      } else {
        normalized.tipe = convertedType;
      }
    }

    // Check kategori
    if (!normalized.kategori) {
      errors_.push('Kolom "Kategori" tidak boleh kosong');
    }

    // Check nominal
    if (!normalized.nominal) {
      errors_.push('Kolom "Nominal" tidak boleh kosong');
    } else {
      try {
        const amount = cleanNominal(normalized.nominal);
        if (isNaN(amount) || amount <= 0) {
          errors_.push("Nominal harus berupa angka lebih dari 0");
        } else {
          normalized.nominal = amount;
        }
      } catch {
        errors_.push("Nominal tidak valid");
      }
    }

    if (errors_.length > 0) {
      errors.push({
        row: rowNumber,
        message: errors_.join("; "),
      });
    } else {
      valid.push(normalized);
    }
  });

  return { valid, errors };
};

export const prepareTransactionsForInsert = (
  rows: ImportedRow[],
): Partial<Transaction>[] => {
  return rows.map((row) => ({
    tanggal: String(row.tanggal),
    kategori: String(row.kategori),
    keterangan: "", // Keterangan tidak ada di format baru
    nominal: parseFloat(String(row.nominal)),
    tipe: String(row.tipe) as "Pemasukan" | "Pengeluaran",
    is_recurring: false,
  }));
};
