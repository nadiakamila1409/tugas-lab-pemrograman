[readme_kospace.md](https://github.com/user-attachments/files/35419546/readme_kospace.md)

# KOSPACE — Manage Your Boarding House Smarter

**KOSPACE** adalah aplikasi web manajemen kos (*Boarding House Management System*) berbasis *client-side* yang dirancang untuk membantu pemilik kos skala kecil hingga menengah di Indonesia mengelola operasional harian—mulai dari ketersediaan kamar, data penghuni, penagihan sewa, arus kas keuangan, hingga laporan perbaikan (*maintenance*)—dalam satu dashboard terpadu.

---

## ✨ Fitur Utama

1. **Dashboard Ringkasan**
   - Pemantauan jumlah total kamar, kamar terisi (beserta persentase okupansi), kamar kosong, dan pemasukan bulan berjalan secara *real-time*.
   - Grafik perbandingan pemasukan dan pengeluaran 6 bulan terakhir.
   - Visualisasi *donut chart* status ketersediaan kamar.
   - Daftar tagihan yang belum lunas dan log aktivitas terbaru.

2. **Manajemen Data Kamar**
   - Tambah, edit, detail, dan hapus data kamar beserta harga sewa dan fasilitas.
   - Filter status kamar (**Terisi**, **Kosong**, **Maintenance**) dan pencarian nomor kamar.
   - Status kamar terisi otomatis mengikuti data penghuni aktif.

3. **Manajemen Penghuni**
   - Pencatatan data lengkap penyewa (kontak, tanggal masuk/keluar, nominal sewa, dan deposit).
   - Alur **Check-in** dan **Check-out** yang otomatis memperbarui ketersediaan kamar.
   - Riwayat tagihan dan pembayaran per penghuni.

4. **Tagihan & Pembayaran**
   - Pembuatan tagihan bulanan otomatis untuk seluruh penghuni aktif (*batch generate*) maupun satuan.
   - Dukungan **pembayaran penuh maupun cicilan/sebagian**.
   - Status tagihan otomatis (**Belum dibayar**, **Dibayar sebagian**, **Lunas**, **Terlambat**).

5. **Keuangan & Arus Kas**
   - Pencatatan pemasukan dan pengeluaran berdasarkan kategori (Listrik, Air, Internet, Kebersihan, Perbaikan, dll.).
   - Sinkronisasi otomatis dari pembayaran sewa dan biaya perbaikan yang selesai.
   - Perhitungan total pemasukan, pengeluaran, dan arus kas bersih dengan filter rentang tanggal dan kategori.

6. **Maintenance (Perbaikan Fasilitas)**
   - Pelaporan kerusakan kamar/fasilitas beserta status pengerjaan (**Baru**, **Diproses**, **Selesai**) dan biaya perbaikan.
   - Opsi menandai kamar berstatus **Maintenance** selama perbaikan berlangsung.

7. **Pengaturan & Persistensi Data**
   - Penyimpanan data otomatis di browser menggunakan **LocalStorage** sehingga data tetap aman saat halaman di-*refresh*.
   - Fitur **Reset Data Demo** untuk mengembalikan contoh data awal (*Kos Tembalang*).

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** — Struktur semantik aplikasi.
- **CSS3** — Desain responsif bergaya modern SaaS (*CSS Variables*, *Grid*, *Flexbox*).
- **Vanilla JavaScript (ES6+)** — Logika aplikasi, manajemen state, validasi form, dan rendering dinamis tanpa framework eksternal.
- **SVG** — Visualisasi grafik batang dan *donut chart* ringan tanpa library tambahan.
- **LocalStorage API** — Penyimpanan data lokal di sisi klien.

---

## 📂 Struktur Folder

```text
kospace/
├── index.html   # Struktur utama halaman dan modal aplikasi
├── style.css    # Styling komponen, layout dashboard, dan tampilan responsif
├── script.js    # Logika bisnis, data dummy, chart SVG, dan manajemen LocalStorage
└── README.md    # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan

Karena aplikasi ini bersifat *standalone* tanpa memerlukan *backend* atau proses *build*:

1. Clone atau unduh folder `kospace/` dari repository ini.
2. Buka file `kospace/index.html` langsung di browser (Chrome, Edge, Firefox, Safari) dengan cara *double-click*, atau jalankan melalui ekstensi **Live Server** di VS Code.
3. Aplikasi siap digunakan dengan data contoh **Kos Tembalang**.
