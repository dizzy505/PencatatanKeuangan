export interface Transaction {
  id: string
  tanggal: string
  kategori: string
  keterangan: string
  nominal: number
  tipe: "Pemasukan" | "Pengeluaran"
  is_recurring: boolean
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly" | null
  recurring_end_date?: string | null
  created_at: string
  updated_at: string
}
