import { X } from "lucide-react";
import { useState } from "react";
import { Transaction } from "../lib/supabase";
import { validateTransaction, validateRecurringDate } from "../lib/validation";

interface EditTransactionModalProps {
  transaction: Transaction;
  kategoris: string[];
  onSave: (transaction: Partial<Transaction>) => Promise<void>;
  onClose: () => void;
}

export function EditTransactionModal({
  transaction,
  kategoris,
  onSave,
  onClose,
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState({
    tanggal: transaction.tanggal,
    kategori: transaction.kategori,
    keterangan: transaction.keterangan,
    nominal: transaction.nominal.toString(),
    is_recurring: transaction.is_recurring,
    recurring_frequency: transaction.recurring_frequency || "",
    recurring_end_date: transaction.recurring_end_date || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateTransaction({
      tanggal: formData.tanggal,
      kategori: formData.kategori,
      nominal: formData.nominal,
      keterangan: formData.keterangan,
    });

    if (formData.is_recurring) {
      validationErrors.push(
        ...validateRecurringDate(
          formData.recurring_end_date || null,
          formData.tanggal,
        ),
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
      await onSave({
        tanggal: formData.tanggal,
        kategori: formData.kategori,
        keterangan: formData.keterangan,
        nominal: parseFloat(formData.nominal),
        is_recurring: formData.is_recurring,
        recurring_frequency: (formData.is_recurring
          ? formData.recurring_frequency
          : null) as "daily" | "weekly" | "monthly" | "yearly" | null,
        recurring_end_date: formData.is_recurring
          ? formData.recurring_end_date
          : null,
      });
      onClose();
    } catch {
      setErrors({ submit: "Gagal menyimpan perubahan" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Transaksi</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
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
              value={formData.kategori}
              onChange={(e) =>
                setFormData({ ...formData, kategori: e.target.value })
              }
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
              value={formData.nominal}
              onChange={(e) =>
                setFormData({ ...formData, nominal: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nominal ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
              step="0.01"
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
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
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
                checked={formData.is_recurring}
                onChange={(e) =>
                  setFormData({ ...formData, is_recurring: e.target.checked })
                }
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Transaksi Berulang
              </span>
            </label>
          </div>

          {formData.is_recurring && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frekuensi
                </label>
                <select
                  value={formData.recurring_frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurring_frequency: e.target.value,
                    })
                  }
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
                  value={formData.recurring_end_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      recurring_end_date: e.target.value,
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.recurring_end_date
                      ? "border-red-500"
                      : "border-gray-300"
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

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
