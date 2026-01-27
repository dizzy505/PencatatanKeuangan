import { useState } from "react";
import { X, Upload, AlertCircle, CheckCircle, Download } from "lucide-react";
import {
  parseExcelFile,
  validateImportData,
  prepareTransactionsForInsert,
  ImportedRow,
} from "../lib/excel-import";
import { Transaction } from "../lib/supabase";
import { createExcelTemplate } from "../lib/excel-export";

interface ImportTransactionModalProps {
  onSuccess: (count: number) => void;
  onClose: () => void;
  onImport: (transactions: Partial<Transaction>[]) => Promise<void>;
}

export function ImportTransactionModal({
  onSuccess,
  onClose,
  onImport,
}: ImportTransactionModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: ImportedRow[];
    errors: Array<{ row: number; message: string }>;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
        setImportError("Hanya file CSV (.csv) yang didukung");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setValidationResult(null);
      setImportError(null);
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const rows = await parseExcelFile(file);
      if (rows.length === 0) {
        setImportError("File CSV kosong");
        setLoading(false);
        return;
      }

      const result = validateImportData(rows);
      setValidationResult(result);
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Gagal membaca file CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.valid.length) return;

    setLoading(true);
    try {
      const transactions = prepareTransactionsForInsert(validationResult.valid);
      await onImport(transactions);
      onSuccess(transactions.length);
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "Gagal mengimport data",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Import Data dari CSV
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {!validationResult ? (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Format CSV yang Didukung:
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p className="font-semibold">
                    Kolom Wajib (salah satu nama berikut OK):
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Tanggal:</strong> "tanggal", "date", "tgl"
                      <br />
                      <span className="ml-4 text-xs">
                        Format: DD/MM/YYYY atau YYYY-MM-DD
                      </span>
                    </li>
                    <li>
                      <strong>Kategori:</strong> "kategori", "category", "kat"
                    </li>
                    <li>
                      <strong>Nominal:</strong> "nominal", "amount", "jumlah"
                      <br />
                      <span className="ml-4 text-xs">
                        Format: 50000 atau Rp50.000
                      </span>
                    </li>
                    <li>
                      <strong>Tipe:</strong> "tipe", "type", "jenis transaksi"
                      <br />
                      <span className="ml-4 text-xs">
                        Nilai: "Pemasukan", "Uang Masuk", "Pengeluaran", "Uang
                        Keluar"
                      </span>
                    </li>
                  </ul>
                  <p className="font-semibold mt-2">Kolom Opsional:</p>
                  <p>
                    <strong>Keterangan:</strong> "keterangan", "deskripsi",
                    "desc", "note"
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="block cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Pilih file
                  </span>
                  <span className="text-gray-600"> atau drag and drop</span>
                </label>
                {file && (
                  <p className="text-sm text-gray-700 mt-2">
                    File dipilih: <strong>{file.name}</strong>
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={() => createExcelTemplate()}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto"
                >
                  <Download size={16} />
                  Download Template CSV
                </button>
              </div>

              {importError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">{importError}</p>
                </div>
              )}

              <button
                onClick={handleValidate}
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {loading ? "Memproses..." : "Validasi & Preview"}
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {validationResult.valid.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <h3 className="font-semibold text-green-900">
                        Data Valid: {validationResult.valid.length} baris
                      </h3>
                    </div>
                    <div className="text-sm text-green-800 max-h-48 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="p-1 text-left">Tanggal</th>
                            <th className="p-1 text-left">Kategori</th>
                            <th className="p-1 text-left">Tipe</th>
                            <th className="p-1 text-right">Nominal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validationResult.valid.map((row, idx) => (
                            <tr key={idx} className="border-t border-green-200">
                              <td className="p-1">{row.tanggal}</td>
                              <td className="p-1">{row.kategori}</td>
                              <td className="p-1">{row.tipe}</td>
                              <td className="p-1 text-right">{row.nominal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {validationResult.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={20} className="text-red-600" />
                      <h3 className="font-semibold text-red-900">
                        Error: {validationResult.errors.length} baris
                      </h3>
                    </div>
                    <div className="text-sm text-red-800 max-h-48 overflow-y-auto">
                      {validationResult.errors.map((error, idx) => (
                        <div
                          key={idx}
                          className="mb-2 pb-2 border-b border-red-200 last:border-0"
                        >
                          <strong>Baris {error.row}:</strong> {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {importError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle
                    size={20}
                    className="text-red-600 flex-shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">{importError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setValidationResult(null);
                    setFile(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  onClick={handleImport}
                  disabled={validationResult.valid.length === 0 || loading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
                >
                  {loading
                    ? "Mengimport..."
                    : `Import ${validationResult.valid.length} Transaksi`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
