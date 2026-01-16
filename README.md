# Sudut Kampus : Campus Digital Bulletin Board

**Sudut Kampus** adalah aplikasi mading digital berbasis web yang dirancang untuk komunitas kampus. Platform ini memiliki dua fitur utama: **Menfess (Confessions)** untuk pesan anonim, dan **Lost & Found** untuk melaporkan barang hilang atau ditemukan.

Dibangun dengan **Node.js** dan **Vanilla JS**, proyek ini menggunakan sistem database berbasis file (JSON) sehingga ringan dan mudah dijalankan tanpa perlu menginstall software database tambahan (seperti MySQL/Mongo).

---

## ✨ Fitur Unggulan

### 💌 Menfess (Curhatan Anonim)
- **Sticky Note UI:** Tampilan visual seperti kertas tempel dengan rotasi dan warna acak.
- **Auto-Archive (24 Jam):** Pesan otomatis hilang dari tampilan publik setelah 24 jam, namun tetap tersimpan di database sebagai arsip.
- **Anonimitas:** Pengguna dapat mengirim pesan tanpa login.

### 🔍 Lost & Found (Barang Hilang & Temu)
- **Status Barang:** Label visual yang jelas untuk barang **HILANG (Lost)** atau **DITEMUKAN (Found)**.
- **Upload Foto:** Mendukung unggah foto barang bukti.
- **WhatsApp Integration:** Tombol "Hubungi via WhatsApp" yang langsung mengarah ke chat pemilik/penemu.
- **Password Protection:** Sistem keamanan unik di mana setiap postingan memiliki password sendiri untuk menghapusnya (Soft Delete).
- **Search & Filter:** Cari barang berdasarkan nama atau filter berdasarkan status.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6+).
* **Backend:** Node.js, Express.js.
* **Database:** JSON File System (`fs` module) - *No SQL required!*
* **File Upload:** Multer.

---

## 📂 Struktur Folder
---

u-board/ ├── public/ # File Frontend (Bisa diakses user) │ ├── css/ # Stylesheet custom │ ├── js/ # Logika Frontend (DOM & Fetch API) │ ├── index.html # Halaman Utama (Menfess) │ └── lost-found.html # Halaman Lost & Found ├── server/ # Logika Backend │ ├── data/ # Database JSON disimpan di sini │ ├── config/ # Konfigurasi Upload (Multer) │ └── server.js # Entry point server (Express) ├── uploads/ # Tempat penyimpanan foto barang └── package.json # Daftar dependensi


---

## 🚀 Cara Menjalankan (Installation)

Pastikan kamu sudah menginstall **Node.js** di komputermu.

1.  **Clone Repository ini**
    ```bash
    git clone https://github.com/aru-kaisariblis/SudutKampus
    cd u-board
    ```

2.  **Install Dependensi**
    Masuk ke terminal dan jalankan:
    ```bash
    npm install
    ```

3.  **Jalankan Server**
    ```bash
    node server/server.js
    ```

4.  **Buka Aplikasi**
    Buka browser dan kunjungi:
    `http://localhost:3000`

---

## 📡 Dokumentasi API

Berikut adalah endpoint yang tersedia di Backend:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| **GET** | `/api/confess` | Mengambil daftar curhatan (filter < 24 jam). |
| **POST** | `/api/confess` | Mengirim curhatan baru. |
| **GET** | `/api/items` | Mengambil daftar barang (Lost & Found). |
| **POST** | `/api/items` | Posting barang baru (Support upload gambar). |
| **DELETE** | `/api/items/:id` | Menghapus barang (Memerlukan body `{password}`). |

---

## 📸 Screenshots

*(Tempatkan screenshot fitur Menfess di sini)*
> **Menfess Wall:** Tampilan pesan tempel yang interaktif.

*(Tempatkan screenshot fitur Lost & Found di sini)*
> **Lost & Found:** Detail barang dengan tombol WhatsApp dan Hapus.

---

## 🤝 Kontribusi

Proyek ini dibuat untuk tujuan pembelajaran. Pull Request dipersilakan jika ingin menambahkan fitur seperti:
- Login Admin Dashboard.
- Notifikasi Email.
- Migrasi ke Database SQL.

---

## 📝 Lisensi

[MIT License](LICENSE)
Copyright © 2026 - Dibuat oleh Aru-KaisarIblis & Elkyn-sia .
