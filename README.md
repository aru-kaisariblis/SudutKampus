# Project Name: SudutKampus

Proyek ini dikembangkan untuk tugas proyek GDGOC. Web ini memungkinkan user untuk mengirimkan cerita hari ini (story) dan melaporkan barang hilang atau ditemukan (Lost & Found).

## Struktur Proyek
Proyek ini dipisahkan menjadi dua bagian utama:

- `/frontend`: Berisi HTML, CSS, JS, dan logika integrasi API.
- `/backend`: Berisi server Node.js/Express dan manajemen database [Sebutkan database jika tahu, misal: MongoDB/MySQL].

## Cara Menjalankan
### 1. Menjalankan Backend
Pastikan Anda memiliki Node.js terinstal.
1. Masuk ke folder server: `cd server`
2. Instal dependensi: `npm install`
3. Jalankan server: `npm start` atau `node server.js`
Server akan berjalan di `http://localhost:3000`.

### 2. Menjalankan Frontend
1. Masuk ke folder frontend: `cd public`
2. Jalankan `index.html` menggunakan Live Server atau cukup buka di browser.
3. Pastikan `API_URL` di dalam `js/app.js` sudah sesuai dengan alamat server backend.

## 🛠️ Fitur Utama
- **Integrasi API**: Menggunakan Fetch API untuk komunikasi asinkron antara UI dan Server.
- **Hybrid Detail System**: Logika JavaScript mampu menangani data dinamis dari database maupun data statis (fallback).
- **Hide on Scroll Navbar**: Optimasi UX untuk kenyamanan navigasi pengguna.
- **Floating Action Button (FAB)**: Menu interaktif untuk akses cepat fitur utama.

## 🤝 Kontributor
- **Frontend Developer**: [Nama Kamu]
- **Backend Developer**: [Nama Teman Kamu]