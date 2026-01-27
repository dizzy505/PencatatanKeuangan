# 📊 Cara Import Data Anda

Data Anda memiliki format seperti ini:

```
Tanggal      | Jenis Transaksi | Kategori   | Nominal
29/12/2025   | Uang Masuk       | Gaji       | Rp4.906.146
29/12/2025   | Uang Keluar      | Transfer   | Rp23.000
```

## ✅ KABAR BAIK!

Sistem import sudah diupdate untuk support **format data Anda**! Anda bisa langsung import file Excel Anda tanpa perlu mengubah apapun.

## 🚀 Cara Import Data Anda:

### 1. Buka Aplikasi

Buka aplikasi Pencatatan Keuangan di browser

### 2. Cari Tombol Import

Pergi ke halaman **"Daftar Transaksi"** (sudah terlihat saat dibuka)

Di bagian **atas kanan**, cari **2 tombol**:

- 🔵 **"Import"** (tombol biru) ← KLIK INI
- 🟢 **"Export"** (tombol hijau)

### 3. Upload File Anda

- Klik tombol Import (biru)
- Drag & drop file Excel Anda atau klik untuk browse
- Tunggu file terload

### 4. Validasi Data

- Klik tombol **"Validasi & Preview"**
- Sistem akan membaca dan mengecek data Anda
- Jika ada error, akan ditampilkan baris mana yang bermasalah

### 5. Review Preview

- Lihat preview data yang akan diimport
- Jika semua OK, klik **"Import [N] Transaksi"**
- Tunggu proses selesai

### 6. ✅ Selesai!

Data Anda sudah tersimpan! Refresh halaman untuk lihat data yang baru diimport.

## 📝 Format yang Sekarang Didukung:

Sistem sekarang support **SEMUA** format nama kolom berikut:

### Tanggal

✅ "Tanggal", "Date", "tgl", "tanggal"
✅ Format: **29/12/2025** atau 2026-01-27

### Jenis Transaksi / Tipe

✅ "Jenis Transaksi", "Tipe", "Type", "Jenis"
✅ Nilai yang didukung:

- "Uang Masuk" → Otomatis jadi "Pemasukan" ✓
- "Uang Keluar" → Otomatis jadi "Pengeluaran" ✓
- "Pemasukan" → Tetap "Pemasukan" ✓
- "Pengeluaran" → Tetap "Pengeluaran" ✓

### Kategori

✅ "Kategori", "Category", "Kat", "kategori"

### Nominal / Jumlah

✅ "Nominal", "Amount", "Jumlah", "nominal"
✅ Format yang didukung:

- Angka biasa: **50000** ✓
- Dengan Rp: **Rp50.000** ✓ (otomatis dihitung)
- Dengan titik: **50.000,00** ✓
- Semuanya bisa!

## ✨ Fitur Bonus:

1. **Otomatis Konversi Format**
   - Tanggal 29/12/2025 → otomatis jadi 2025-12-29
   - "Uang Masuk" → otomatis jadi "Pemasukan"
   - Rp4.906.146 → otomatis jadi 4906146

2. **Smart Column Detection**
   - Nama kolom tidak case-sensitive
   - Sistem otomatis mencari kolom yang sesuai
   - Tidak perlu eksak seperti template

3. **Error Reporting**
   - Jika ada error, akan ditunjuk baris mana
   - Penjelasan error yang jelas
   - Bisa diperbaiki dan dicoba lagi

4. **Preview Sebelum Import**
   - Lihat preview data
   - Lihat berapa baris yang akan diimport
   - Lihat error jika ada (tanpa disimpan)

## 🎯 Contoh Data Anda (Format yang Support):

```
Tanggal      | Jenis Transaksi | Kategori   | Nominal       | Keterangan
29/12/2025   | Uang Masuk       | Gaji       | Rp4.906.146   | Gaji bulan 12
29/12/2025   | Uang Keluar      | Transfer   | Rp23.000      | Transfer ke Rini
30/12/2025   | Uang Keluar      | Transport  | Rp50.000      | Ojek ke kantor
31/12/2025   | Uang Keluar      | Jajan      | Rp7.000       | Minum kopi
01/01/2026   | Uang Keluar      | Jajan      | Rp85.000      | Makan mie
01/01/2026   | Uang Keluar      | Hadiah     | Rp125.000     | Hadiah tahun baru
```

## ⚠️ Catatan Penting:

1. **Semua kolom bisa ada**: Jika Excel Anda punya kolom lebih, tidak masalah. Sistem akan ignore yang tidak perlu.

2. **Urutan kolom tidak penting**: Mau Nominal di depan atau belakang, semua OK.

3. **Nama kolom case-insensitive**: "Tanggal", "TANGGAL", "tanggal" semua OK.

4. **Format tanggal fleksibel**:
   - 29/12/2025 ✓
   - 29-12-2025 ✓
   - 2025-12-29 ✓

5. **Format nominal fleksibel**:
   - 50000 ✓
   - Rp50000 ✓
   - Rp50.000 ✓
   - 50.000,00 ✓

## 🆘 Jika Ada Error:

### Error: "Nominal tidak valid"

- Periksa kolom nominal, pastikan ada angka
- Contoh OK: 50000, Rp50.000, 50.000,00

### Error: "Format tanggal tidak valid"

- Tanggal harus angka, bukan text
- Format harus DD/MM/YYYY atau YYYY-MM-DD
- Contoh OK: 29/12/2025, 2025-12-29

### Error: "Kategori tidak boleh kosong"

- Pastikan ada kategori di setiap baris
- Jangan ada baris kosong di kategori

### Error: "Tipe tidak valid"

- Periksa kolom Jenis Transaksi
- Harus "Uang Masuk" atau "Uang Keluar"
- Atau "Pemasukan"/"Pengeluaran"

## 🎉 Anda Siap!

Sekarang Anda bisa langsung import data Anda tanpa perlu ubah format apapun!

**Steps:**

1. Buka aplikasi → Daftar Transaksi
2. Klik tombol "Import" (biru)
3. Upload file Excel Anda
4. Klik "Validasi & Preview"
5. Klik "Import [N] Transaksi"
6. ✅ Selesai!

Jika ada pertanyaan, buka dokumentasi `IMPORT_GUIDE.md` untuk info lebih detail.

Happy importing! 🚀
