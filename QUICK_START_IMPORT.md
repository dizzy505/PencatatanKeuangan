# 🎉 Fitur Baru: Import Data dari Excel!

Sekarang Anda bisa mengimport transaksi langsung dari file Excel atau CSV!

## 🚀 Quick Start

1. **Klik tombol "Import"** di bagian Daftar Transaksi
2. **Download Template** (opsional) atau upload file Excel Anda
3. **Klik "Validasi & Preview"** untuk melihat preview data
4. **Klik "Import"** untuk menyimpan data ke database

Selesai! Data Anda sudah tersimpan. 🎊

## 📋 Format File yang Benar

File Excel harus memiliki kolom-kolom ini:

| Kolom      | Contoh      | Wajib? |
| ---------- | ----------- | ------ |
| tanggal    | 2026-01-27  | ✅ Ya  |
| kategori   | Makanan     | ✅ Ya  |
| nominal    | 50000       | ✅ Ya  |
| tipe       | Pengeluaran | ✅ Ya  |
| keterangan | Makan siang | ❌ No  |

## ⚠️ Aturan Penting

- **Tanggal**: Format `YYYY-MM-DD` (contoh: 2026-01-27)
- **Tipe**: Harus exact `"Pemasukan"` atau `"Pengeluaran"` (jangan typo!)
- **Nominal**: Hanya angka, tanpa Rp atau tanda apapun
- **Kategori**: Tidak boleh kosong

## 💡 Tips

- Gunakan template download untuk memastikan format benar
- Jika ada error, aplikasi akan kasih tahu baris mana yang bermasalah
- Bisa import ratusan transaksi sekaligus!
- Setelah import, data bisa di-edit atau di-delete seperti biasa

## 📚 Dokumentasi Lengkap

Lihat file `IMPORT_GUIDE.md` untuk dokumentasi detail dengan berbagai contoh.

Selamat menggunakan! 🎉
