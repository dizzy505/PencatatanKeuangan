# Template Import Excel - Pencatatan Keuangan

## Format File Excel yang Diperlukan

Untuk mengimport data transaksi, gunakan format Excel dengan kolom-kolom berikut:

### Kolom Wajib (Required):

1. **tanggal** - Tanggal transaksi dalam format YYYY-MM-DD (contoh: 2026-01-27)
2. **kategori** - Kategori transaksi (contoh: Makanan, Gaji, Transport, dll)
3. **nominal** - Jumlah uang (angka positif tanpa simbol, contoh: 50000)
4. **tipe** - Jenis transaksi: "Pemasukan" atau "Pengeluaran"

### Kolom Opsional (Optional):

- **keterangan** - Deskripsi transaksi (contoh: Makan siang, Pulsa, dll)

## Contoh Data:

| tanggal    | kategori  | nominal | tipe        | keterangan      |
| ---------- | --------- | ------- | ----------- | --------------- |
| 2026-01-27 | Makanan   | 50000   | Pengeluaran | Makan siang     |
| 2026-01-27 | Gaji      | 5000000 | Pemasukan   | Gaji bulan 1    |
| 2026-01-26 | Transport | 25000   | Pengeluaran | Grab            |
| 2026-01-25 | Belanja   | 200000  | Pengeluaran | Belanja bulanan |
| 2026-01-20 | Bonus     | 1000000 | Pemasukan   | Bonus tahunan   |

## Kategori yang Direkomendasikan:

### Pemasukan:

- Gaji
- Bonus
- Investasi
- Lainnya

### Pengeluaran:

- Makanan
- Transport
- Belanja
- Tagihan
- Hiburan
- Kesehatan
- Lainnya

## Cara Import:

1. Siapkan file Excel dengan format yang sesuai
2. Klik tombol "Import" di bagian Daftar Transaksi
3. Pilih file Excel Anda
4. Klik "Validasi & Preview" untuk melihat data yang akan diimport
5. Jika ada error, perbaiki file Excel dan coba lagi
6. Jika semuanya benar, klik "Import [jumlah] Transaksi"

## Aturan Validasi:

- Tanggal harus dalam format YYYY-MM-DD
- Nominal harus lebih dari 0
- Tipe harus tepat "Pemasukan" atau "Pengeluaran" (case-sensitive)
- Kategori tidak boleh kosong
- Tanggal tidak boleh kosong

## Tips:

- Jika ingin mengedit template, download Excel dari aplikasi dahulu (Export)
- Pastikan tidak ada baris kosong di tengah data
- Gunakan spreadsheet aplikasi (Excel, Google Sheets, LibreOffice) untuk membuat file
- Simpan file dalam format .xlsx atau .xls
