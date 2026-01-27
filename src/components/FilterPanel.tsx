import { Search, X } from "lucide-react";
import { useState } from "react";

interface FilterPanelProps {
  onFilter: (filters: {
    startDate?: string;
    endDate?: string;
    kategori?: string;
    tipe?: "Pemasukan" | "Pengeluaran" | "";
    searchQuery?: string;
  }) => void;
  categories: string[];
}

export function FilterPanel({ onFilter, categories }: FilterPanelProps) {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    kategori: "",
    tipe: "" as "Pemasukan" | "Pengeluaran" | "",
    searchQuery: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      startDate: "",
      endDate: "",
      kategori: "",
      tipe: "" as const,
      searchQuery: "",
    };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const hasActiveFilters =
    filters.startDate ||
    filters.endDate ||
    filters.kategori ||
    filters.tipe ||
    filters.searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-gray-800 font-semibold">
          <Search size={20} />
          Filter & Cari
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
          >
            <X size={16} />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cari Transaksi
          </label>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            placeholder="Cari kategori atau keterangan..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipe
          </label>
          <select
            value={filters.tipe}
            onChange={(e) => handleFilterChange("tipe", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Tipe</option>
            <option value="Pemasukan">Pemasukan</option>
            <option value="Pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={filters.kategori}
            onChange={(e) => handleFilterChange("kategori", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
