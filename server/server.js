const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import konfigurasi upload (Pastikan path ini benar)
const upload = require('./config/upload'); 

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

// === MIDDLEWARE ===
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === STATIC FILES ===
// 1. Folder 'public' agar HTML/CSS/JS bisa diakses
app.use(express.static(path.join(__dirname, '../public')));

// 2. Folder 'uploads' agar gambar barang bisa muncul
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// === FUNGSI DATABASE (JSON) ===
// Cek file database, kalau belum ada bikin baru
if (!fs.existsSync(DATA_FILE)) {
    if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
    fs.writeFileSync(DATA_FILE, JSON.stringify({ confessions: [], items: [] }, null, 2));
}

const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { confessions: [], items: [] };
    }
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};


// === ROUTES (API) ===

// 1. GET & POST STORY (CONFESS)
app.get('/api/confess', (req, res) => {
    const db = readData();
    res.json(db.confessions.reverse()); // Kirim yang terbaru dulu
});

app.post('/api/confess', (req, res) => {
    const db = readData();
    
    const newConfess = {
        id: Date.now(),
        pesan: req.body.pesan,
        // Data baru dari desain temanmu:
        sender: req.body.sender || 'Anonim',
        recipient: req.body.recipient || 'Someone',
        color: req.body.color || '#FFF9C4', // Default kuning
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    
    db.confessions.push(newConfess);
    writeData(db);
    
    res.json({ message: "Curhatan tersimpan!", data: newConfess });
});

// 2. GET & POST ITEMS (LOST & FOUND)
app.get('/api/items', (req, res) => {
    const db = readData();
    res.json(db.items.reverse());
});

app.post('/api/items', upload.single('foto_barang'), (req, res) => {
    const db = readData();
    
    // Cek apakah ada foto yang diupload
    // Note: path foto ditambah '/' di depan agar bisa diakses browser
    const fotoPath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newItem = {
        id: Date.now(),
        nama: req.body.nama,
        // Status dikirim dari frontend sebagai 'HILANG' atau 'DITEMUKAN'
        status: req.body.status || 'HILANG', 
        kontak: req.body.kontak || '-',
        foto: fotoPath,
        tanggal: new Date().toLocaleDateString('id-ID')
    };
    
    db.items.push(newItem);
    writeData(db);
    
    res.json({ message: "Barang berhasil diposting!", data: newItem });
});


// === START SERVER ===
app.listen(PORT, () => {
    // Pastikan folder uploads ada
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
    }
    console.log(`Server U-Board jalan di http://localhost:${PORT}`);
});