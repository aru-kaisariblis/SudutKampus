const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import konfigurasi upload
const upload = require('./config/upload'); 

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');
const EXPIRE_TIME = 24 * 60 * 60 * 1000;

// === MIDDLEWARE ===
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === STATIC FILES ===
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// === FUNGSI DATABASE ===
if (!fs.existsSync(DATA_FILE)) {
    if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
    fs.writeFileSync(DATA_FILE, JSON.stringify({ confessions: [], items: [] }, null, 2));
}

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error baca database:", err);
        return { confessions: [], items: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// === ROUTES (API) ===

// 1. STORY (CONFESS)
app.get('/api/confess', (req, res) => {
    let db = readData();
    const now = Date.now();
    let isDataFixed = false; // Penanda kalau kita memperbaiki data lama

    // 1. CEK & PERBAIKI DATA LAMA (MIGRASI)
    db.confessions.forEach(item => {
        if (!item.createdAt) {
            item.createdAt = now; 
            isDataFixed = true; 
        }
    });

    if (isDataFixed) {
        writeData(db);
        console.log("Database update: Menambahkan timestamp ke pesan lama.");
    }

    // 2. FILTER TAMPILAN (Saring sebelum dikirim)
    const visibleConfessions = db.confessions.filter(item => {
        return (now - item.createdAt) < EXPIRE_TIME;
    });

    // 3. KIRIM HASIL SARINGAN
    res.json(visibleConfessions.reverse());
});

app.post('/api/confess', (req, res) => {
    const db = readData();
    
    const newConfess = {
        id: Date.now(),
        pesan: req.body.pesan,
        sender: req.body.sender || 'Anonim',
        recipient: req.body.recipient || 'Someone',
        color: req.body.color || '#FFF9C4',
        
        // Tampilan tanggal (untuk dibaca manusia)
        tanggal: new Date().toLocaleDateString('id-ID'),
        
        // WAKTU ASLI (Untuk sistem menghitung umur pesan)
        createdAt: Date.now() 
    };
    
    db.confessions.push(newConfess);
    writeData(db);
    
    res.json({ message: "Curhatan tersimpan!", data: newConfess });
});

// 2. ITEMS (LOST & FOUND)

app.get('/api/items', (req, res) => {
    const db = readData();
    // Hanya ambil item yang isResolved-nya false (atau undefined buat data lama)
    const activeItems = db.items.filter(item => !item.isResolved);
    res.json(activeItems.reverse());
});

// [FIX 2] Menambahkan Console Log di Route POST untuk Debugging
app.post('/api/items', upload.single('foto_barang'), (req, res) => {
    
    // --- AREA DEBUGGING (CCTV) ---
    console.log("=== ADA POSTINGAN BARU MASUK ===");
    console.log("Body (Data Teks):", req.body);
    console.log("File (Gambar):", req.file);
    // -----------------------------

    const db = readData();
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newItem = {
        id: Date.now(),
        nama: req.body.nama,
        status: req.body.status || 'HILANG', 
        
        // Pastikan ini menangkap field yang benar
        kontak: req.body.kontak || '-',      
        lokasi: req.body.lokasi || '-',      
        deskripsi: req.body.deskripsi || '-', 

        password: req.body.password, // Password tersimpan di sini
        isResolved: false,           // Penanda apakah barang sudah ketemu/selesai
    

        foto: fotoPath,
        tanggal: new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })
    };
    
    db.items.push(newItem);
    writeData(db);
    
    console.log("Data berhasil disimpan:", newItem); // Cek hasil akhir yang disimpan
    res.json({ message: "Barang berhasil diposting!", data: newItem });

    
});

// 3. DELETE ITEM (Soft Delete dengan Password)
app.delete('/api/items/:id', (req, res) => {
    const db = readData();
    const id = parseInt(req.params.id);
    const userPassword = req.body.password;

    // Cari barang berdasarkan ID
    const itemIndex = db.items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ message: "Barang tidak ditemukan" });
    }

    // Cek Password
    const item = db.items[itemIndex];
    if (item.password !== userPassword) {
        return res.status(401).json({ message: "Password salah!" });
    }

    // SOFT DELETE: Ubah status jadi resolved, jangan dihapus dari array
    db.items[itemIndex].isResolved = true; 
    
    writeData(db);
    res.json({ message: "Postingan berhasil dihapus/diselesaikan!" });
});

// === START SERVER ===
app.listen(PORT, () => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    console.log(`Server U-Board jalan di http://localhost:${PORT}`);
});