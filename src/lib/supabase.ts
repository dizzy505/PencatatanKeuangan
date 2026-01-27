import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [
    !supabaseUrl ? "VITE_SUPABASE_URL" : null,
    !supabaseAnonKey ? "VITE_SUPABASE_ANON_KEY" : null,
  ]
    .filter(Boolean)
    .join(", ");
  throw new Error(
    `Supabase env vars missing: ${missing}. Please define them in .env (VITE_*) and restart the dev server.`,
  );
}

export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);

export interface Transaction {
  id: string;
  tanggal: string;
  kategori: string;
  keterangan: string;
  nominal: number;
  tipe: "Pemasukan" | "Pengeluaran";
  created_at: string;
  updated_at: string;
  is_recurring: boolean;
  recurring_frequency?: "daily" | "weekly" | "monthly" | "yearly" | null;
  recurring_end_date?: string | null;
}
