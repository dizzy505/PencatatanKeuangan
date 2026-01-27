import { useState } from "react";
import { Plus } from "lucide-react";
import { storageService } from "../lib/storage.ts";
import { validateTransaction, validateRecurringDate } from "../lib/validation.ts";

interface TransactionFormProps {
  onSuccess: () => void;
}

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

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [tipe, setTipe] = useState<"Pemasukan" | "Pengeluaran">("Pengeluaran");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [kategori, setKategori] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [nominal, setNominal] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("");
  const [recurringEndDate, setRecurringEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const kategoris =
    tipe === "Pemasukan" ? KATEGORI_PEMASUKAN : KATEGORI_PENGELUARAN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateTransaction({
      tanggal,
      kategori,
      nominal,
      keterangan,
    });

    if (isRecurring) {
      validationErrors.push(
        ...validateRecurringDate(recurringEndDate || null, tanggal),
      );
    }

    if (validationErrors.length > 0) {
      const errorMap: { [key: string]: string } = {};
      validationErrors.forEach((e) => {
        errorMap[e.field] = e.message;
      });
      setErrors(errorMap);
      return;
    }

    setLoading(true);

    try {
      storageService.saveTransaction({
        tipe,
        tanggal,
        kategori,
        keterangan,
        nominal: parseFloat(nominal),
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? (recurringFrequency as "daily" | "weekly" | "monthly" | "yearly") : null,
        recurring_end_date: isRecurring ? recurringEndDate : null,
      });

      setKategori("");
      setKeterangan("");
      setNominal("");
      setIsRecurring(false);
      setRecurringFrequency("");
      setRecurringEndDate("");
      setTanggal(new Date().toISOString().split("T")[0]);
      onSuccess();
    } catch (error) {
      console.error("Error adding transaction:", error);
      setErrors({ submit: "Gagal menambahkan transaksi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Tambah Transaksi</h2>

      <div className="flex gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="Pemasukan"
            checked={tipe === "Pemasukan"}
            onChange={(e) => {
              setTipe(e.target.value as "Pemasukan");
              setKategori("");
            }}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-gray-700">Pemasukan</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            value="Pengeluaran"
            checked={tipe === "Pengeluaran"}
            onChange={(e) => {
              setTipe(e.target.value as "Pengeluaran");
              setKategori("");
            }}
            className="w-4 h-4 text-red-600"
          />
          <span className="text-gray-700">Pengeluaran</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal
        </label>
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.tanggal ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.tanggal && (
          <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kategori
        </label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.kategori ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Pilih Kategori</option>
          {kategoris.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
        {errors.kategori && (
          <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nominal (Rp)
        </label>
        <input
          type="number"
          value={nominal}
          onChange={(e) => setNominal(e.target.value)}
          required
          min="0"
          step="0.01"
          placeholder="0"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nominal ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.nominal && (
          <p className="text-red-500 text-sm mt-1">{errors.nominal}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Keterangan
        </label>
        <input
          type="text"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          placeholder="Opsional"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.keterangan ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.keterangan && (
          <p className="text-red-500 text-sm mt-1">{errors.keterangan}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Transaksi Berulang
          </span>
        </label>
      </div>

      {isRecurring && (
        <div className="space-y-4 bg-blue-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frekuensi
            </label>
            <select
              value={recurringFrequency}
              onChange={(e) => setRecurringFrequency(e.target.value)}
              required={isRecurring}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Frekuensi</option>
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir (Opsional)
            </label>
            <input
              type="date"
              value={recurringEndDate}
              onChange={(e) => setRecurringEndDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.recurring_end_date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.recurring_end_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.recurring_end_date}
              </p>
            )}
          </div>
        </div>
      )}

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={20} />
        {loading ? "Menyimpan..." : "Tambah Transaksi"}
      </button>
    </form>
  );
}
