/*
  # Create transactions table for financial tracking

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `tanggal` (date) - Transaction date
      - `kategori` (text) - Category (e.g., Makanan, Transport, Gaji, etc.)
      - `keterangan` (text) - Description/notes
      - `nominal` (numeric) - Amount
      - `tipe` (text) - Type: 'Pemasukan' or 'Pengeluaran' (Income or Expense)
      - `created_at` (timestamptz) - Record creation timestamp
      
  2. Security
    - Enable RLS on `transactions` table
    - Add policies for public access (can be restricted later with auth)
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  kategori text NOT NULL,
  keterangan text DEFAULT '',
  nominal numeric NOT NULL CHECK (nominal > 0),
  tipe text NOT NULL CHECK (tipe IN ('Pemasukan', 'Pengeluaran')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON transactions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert access"
  ON transactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON transactions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON transactions
  FOR DELETE
  TO anon, authenticated
  USING (true);