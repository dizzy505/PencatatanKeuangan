# Fitur Import Data dari Excel

Aplikasi Pencatatan Keuangan sekarang mendukung import data transaksi dari file Excel (.xlsx, .xls) atau CSV!

## Cara Menggunakan Import Excel

### 1. **Klik Tombol Import**

Pada halaman Daftar Transaksi, klik tombol **"Import"** di bagian atas kanan.

### 2. **Download Template (Opsional)**

Jika Anda belum memiliki file Excel, klik **"Download Template Excel"** untuk mendapatkan template dengan format yang benar.

### 3. **Pilih File**

- Klik area upload atau drag-drop file Excel/CSV Anda
- File akan otomatis ditampilkan sebagai "File dipilih"

### 4. **Validasi Data**

Klik tombol **"Validasi & Preview"** untuk:

- Membaca data dari file
- Memvalidasi setiap baris data
- Menampilkan preview data yang akan diimport
- Menampilkan error jika ada data yang tidak valid

### 5. **Review Hasil Validasi**

Akan ditampilkan:

- ✅ **Data Valid** (berwarna hijau) - Baris yang siap diimport
- ❌ **Error** (berwarna merah) - Baris yang memiliki masalah beserta penjelasannya

### 6. **Import Data**

Jika semua data valid, klik **"Import [jumlah] Transaksi"** untuk memasukkan data ke database.

## Format File yang Benar

### Kolom Wajib (HARUS ADA):

1. **tanggal** - Format: YYYY-MM-DD (contoh: 2026-01-27)
2. **kategori** - Kategori transaksi (contoh: Makanan, Gaji, dll)
3. **nominal** - Jumlah uang (angka positif, contoh: 50000)
4. **tipe** - "Pemasukan" atau "Pengeluaran" (case-sensitive!)

### Kolom Opsional (BOLEH TIDAK ADA):

- **keterangan** - Deskripsi transaksi (contoh: Makan siang)

### Contoh Format Benar:

```
tanggal      | kategori   | nominal | tipe        | keterangan
-------------|-----------|---------|-----------|----------------
2026-01-27   | Makanan    | 50000   | Pengeluaran | Makan siang
2026-01-27   | Gaji       | 5000000 | Pemasukan   | Gaji bulan 1
2026-01-26   | Transport  | 25000   | Pengeluaran | Grab
```

## Aturan Validasi Data

Data akan ditolak jika:

- ❌ **Tanggal** tidak sesuai format YYYY-MM-DD
- ❌ **Kategori** kosong
- ❌ **Nominal** kosong atau bukan angka
- ❌ **Nominal** 0 atau negatif
- ❌ **Tipe** bukan "Pemasukan" atau "Pengeluaran"
- ❌ **Tipe** salah huruf (harus "Pemasukan" bukan "pemasukan")

## Kategori yang Disarankan

### Kategori Pemasukan:

- Gaji
- Bonus
- Investasi
- Lainnya

### Kategori Pengeluaran:

- Makanan
- Transport
- Belanja
- Tagihan
- Hiburan
- Kesehatan
- Lainnya

## Tips & Trik

1. **Mulai dari Template**
   - Download template dari aplikasi untuk memastikan format benar
   - Duplikat baris contoh untuk menambah data

2. **Bulk Import**
   - Anda bisa mengimport hingga ratusan transaksi sekaligus
   - Semua validasi dilakukan otomatis

3. **Error Handling**
   - Jika ada error, aplikasi akan memberitahu baris mana yang bermasalah
   - Anda bisa perbaiki file dan coba lagi
   - Hanya baris yang valid yang akan diimport

4. **Format File**
   - Gunakan Excel 2007+ (.xlsx) untuk kompatibilitas terbaik
   - Hindari format Excel lama (.xls) jika memungkinkan
   - CSV juga didukung dengan delimiter koma (,)

5. **Kolom Tambahan**
   - Jika file Anda punya kolom tambahan, tidak masalah
   - Aplikasi hanya akan membaca kolom: tanggal, kategori, nominal, tipe, keterangan
   - Kolom lain akan diabaikan

## Contoh Kasus Penggunaan

### 1. Import Data Historis

```
Anda punya catatan transaksi tahun lalu dalam Excel
→ Format sesuai panduan
→ Import semua sekaligus
→ Selesai! Data historis sudah tercatat
```

### 2. Bulk Input dari Laporan

```
Anda punya laporan keuangan bulan ini
→ Ubah format menjadi Excel sesuai panduan
→ Import dalam sekali klik
→ Tidak perlu input manual satu-satu
```

### 3. Pindahkan Data dari Sistem Lain

```
Data dari aplikasi keuangan lain
→ Export dari aplikasi lama
→ Sesuaikan format kolom
→ Import ke Pencatatan Keuangan
```

## Troubleshooting

### "File Excel Kosong"

- Pastikan file memiliki data di sheet pertama
- File template download juga dianggap memiliki data contoh

### "Gagal Membaca File"

- Gunakan format .xlsx atau .csv
- Jangan gunakan format Excel yang terlalu lama (.xls versi sangat lama)
- Pastikan file tidak corrupt

### "Format Tanggal Harus YYYY-MM-DD"

- Tanggal harus dalam format tahun-bulan-hari
- Contoh benar: 2026-01-27
- Contoh salah: 27/01/2026, 27-01-2026, 27 Januari 2026

### "Tipe Harus Pemasukan atau Pengeluaran"

- Perhatikan huruf besar/kecil dan spasi
- Benar: "Pemasukan", "Pengeluaran"
- Salah: "pemasukan", "PEMASUKAN", " Pemasukan " (ada spasi)

### "Nominal Harus Lebih Dari 0"

- Nominal tidak boleh 0, negatif, atau teks
- Pastikan menggunakan format angka di Excel

## Fitur Terkait

- **Export CSV** - Backup data transaksi ke CSV
- **Edit Transaksi** - Ubah transaksi yang sudah diimport
- **Delete Transaksi** - Hapus transaksi yang salah diimport
- **Filter & Search** - Cari transaksi yang diimport

---

Happy importing! 🎉
