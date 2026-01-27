import { Calendar } from "lucide-react";
import { Transaction } from "../lib/supabase";
import { getMonthlySummary } from "../lib/utils";

interface MonthlySummaryProps {
  transactions: Transaction[];
}

export function MonthlySummary({ transactions }: MonthlySummaryProps) {
  const summary = getMonthlySummary(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  if (summary.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Belum ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar size={24} className="text-blue-600" />
        Ringkasan Bulanan
      </h2>

      <div className="space-y-3">
        {summary.map((item) => (
          <div
            key={item.month}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-800">
                {formatMonth(item.month)}
              </p>
              <div className="flex gap-4 text-sm mt-1">
                <span className="text-green-600">
                  + {formatCurrency(item.pemasukan)}
                </span>
                <span className="text-red-600">
                  - {formatCurrency(item.pengeluaran)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-bold ${item.saldo >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(item.saldo)}
              </p>
              <p className="text-xs text-gray-500">Saldo</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
