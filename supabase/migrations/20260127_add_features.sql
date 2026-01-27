-- Add new columns for edit tracking and recurring transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_frequency text CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly', NULL));
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_end_date date DEFAULT NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_tanggal ON transactions(tanggal);
CREATE INDEX IF NOT EXISTS idx_transactions_tipe ON transactions(tipe);
CREATE INDEX IF NOT EXISTS idx_transactions_kategori ON transactions(kategori);
