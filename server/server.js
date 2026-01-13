const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import konfigurasi upload
const upload = require('./config/upload'); 

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

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
    const db = readData();
    res.json(db.confessions.reverse());
});

app.post('/api/confess', (req, res) => {
    const db = readData();
    const newConfess = {
        id: Date.now(),
        pesan: req.body.pesan,
        sender: req.body.sender || 'Anonim',
        recipient: req.body.recipient || 'Someone',
        color: req.body.color || '#FFF9C4',
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    db.confessions.push(newConfess);
    writeData(db);
    res.json({ message: "Curhatan tersimpan!", data: newConfess });
});

// 2. ITEMS (LOST & FOUND)

// [FIX 1] Menambahkan Route GET yang tadi hilang
app.get('/api/items', (req, res) => {
    const db = readData();
    res.json(db.items.reverse());
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

// === START SERVER ===
app.listen(PORT, () => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    console.log(`Server U-Board jalan di http://localhost:${PORT}`);
});