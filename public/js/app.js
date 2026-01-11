
const API_URL = 'http://localhost:3000/api';

/* INDEX */


/* STORY */
const addBtn = document.getElementById('add-story-btn');
const formOverlay = document.getElementById('form-overlay');
const closeBtn = document.getElementById('close-btn');

/* --- INTEGRASI BACKEND STORY --- */

// 1. Load Data dari Server
async function loadStories() {
    try {
        const res = await fetch(`${API_URL}/confess`);
        const data = await res.json();
        const container = document.getElementById('stories-container'); // Pastikan ID ini ada di HTML
        
        if(container) {
            container.innerHTML = ''; // Reset container
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-3'];
            
            data.forEach(item => {
                const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
                const bgColor = item.color || '#FFF9C4'; // Default kuning

                // Kita inject HTML sesuai desain temanmu
                const html = `
                    <div class="memo p-6 shadow-md rounded-sm transition-transform hover:scale-105 ${randomRot} flex flex-col justify-between min-h-[200px]" style="background-color: ${bgColor};">
                        <div>
                            <small class="block text-black/40 font-bold mb-2 uppercase border-b border-black/10 pb-1">To: ${item.recipient}</small>
                            <p class="text-gray-800 font-serif text-lg">"${item.pesan}"</p>
                        </div>
                        <div class="text-right mt-4">
                            <span class="text-xs font-bold text-gray-500">- ${item.sender}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }
    } catch (err) { console.error("Gagal load story:", err); }
}

// 2. Submit Story Baru
const storyForm = document.getElementById('story-form'); // Pastikan ID form di HTML 'story-form'
if(storyForm) {
    storyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ambil data
        const sender = document.getElementById('inputSender').value;
        const recipient = document.getElementById('inputRecipient').value;
        const message = document.getElementById('inputMessage').value;
        const color = document.querySelector('input[name="color"]:checked')?.value || '#FFF9C4';

        await fetch(`${API_URL}/confess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pesan: message, sender, recipient, color })
        });

        alert("Berhasil curhat!");
        e.target.reset();
        document.getElementById('form-overlay').classList.add('hidden'); // Tutup modal pakai ID temanmu
        loadStories(); // Refresh data
    });
}

// Panggil saat web dibuka
loadStories();

// Buka Modal
if (addBtn && formOverlay) {
    addBtn.addEventListener('click', () => {
        formOverlay.classList.remove('hidden');
    });

// Tutup Modal
    closeBtn.addEventListener('click', () => {
        formOverlay.classList.add('hidden');
    });

// Tutup Modal jika klik area hitam di luar form
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) formOverlay.classList.add('hidden');
    });
}

/*detail post*/
const detailModal = document.getElementById('detail-modal');
const closeDetail = document.getElementById('close-detail');

// Fungsi untuk membuka detail
function openDetail(card) {
    const name = card.querySelector('p').innerText;
    const location = card.querySelector('span').innerText;
    const status = card.classList.contains('found') ? 'Found' : 'Lost';
    const statusBg = card.classList.contains('found') ? '#4ade80' : '#f87171';
    
    // Sinkronisasi Data ke Modal
    document.getElementById('detail-name').innerText = name;
    document.getElementById('detail-location').querySelector('span').innerText = location;
    document.getElementById('detail-status').innerText = status;
    document.getElementById('detail-status').style.backgroundColor = statusBg;
    
    // Ambil deskripsi (Misal: dari atribut data atau teks default)
    document.getElementById('detail-desc').innerText = "Kontak & Detail: Silakan cek informasi yang tertera di sini. " + (status === 'Lost' ? "Bagi yang menemukan hubungi nomor di atas." : "Bagi pemilik sah silakan hubungi nomor di atas.");
    
    document.getElementById('detail-img').src = "https://via.placeholder.com/400"; 

    detailModal.classList.remove('hidden');
}

// Tambahkan event listener ke semua kartu yang ada
document.addEventListener('click', (e) => {
    const card = e.target.closest('.item-card');
    if (card) {
        openDetail(card);
    }
});

// Tutup modal
if (closeDetail) {
    closeDetail.addEventListener('click', () => detailModal.classList.add('hidden'));
}

detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
});

/* LOST & FOUND */
function filterItems(category) {
    const cards = document.querySelectorAll('.item-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update tampilan tombol aktif
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Logika Filter
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'flex';
        } else {
            if (card.classList.contains(category)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

/* --- SUBMIT FORM LOST & FOUND --- */
// Pastikan form di dalam modal input punya ID="item-form"
const itemForm = document.getElementById('item-form'); 

if(itemForm) {
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Siapkan FormData (karena ada upload foto)
        const formData = new FormData(itemForm);
        
        // Cek tipe (Lost/Found) dari judul modal yang diset temanmu
        const typeTitle = document.getElementById('modal-form-title').innerText;
        // Map "Lost" -> "HILANG", "Found" -> "DITEMUKAN"
        const statusValue = (typeTitle === 'Lost') ? 'HILANG' : 'DITEMUKAN';
        
        formData.append('status', statusValue); 
        // Pastikan di HTML input name="nama", name="kontak", name="foto_barang" sudah benar

        try {
            await fetch(`${API_URL}/items`, {
                method: 'POST',
                body: formData
            });

            alert("Postingan berhasil!");
            closeForm(); // Panggil fungsi tutup modal temanmu
            itemForm.reset(); // Kosongkan form
            loadItems(); // Refresh grid barang
        } catch (err) {
            console.error(err);
            alert("Gagal posting");
        }
    });
}

/*searching logic*/
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase(); // Ambil teks input
        const cards = document.querySelectorAll('.item-card'); // Ambil semua kartu mading

        cards.forEach(card => {
            const itemName = card.querySelector('p').innerText.toLowerCase(); // Ambil nama barang di kartu
            
            // Jika nama barang cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
            if (itemName.includes(keyword)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}
/*+add button logic*/
/* --- FAB & INPUT MODAL LOGIC --- */
const mainBtn = document.getElementById('fab-main-btn');
const fabMenu = document.getElementById('fab-menu');
const fabOverlay = document.getElementById('fab-overlay');
const fabIcon = document.getElementById('fab-icon');
const inputModal = document.getElementById('input-modal');

// Fungsi menutup FAB
function closeFab() {
    fabMenu.classList.remove('menu-visible');
    fabOverlay.classList.remove('overlay-visible');
    fabIcon.style.transform = 'rotate(0deg)';
}

// Klik tombol +
mainBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = fabMenu.classList.contains('menu-visible');
    if (!isOpen) {
        fabMenu.classList.add('menu-visible');
        fabOverlay.classList.add('overlay-visible');
        fabIcon.style.transform = 'rotate(45deg)';
    } else {
        closeFab();
    }
});

// Fungsi Membuka Form (Dipanggil dari atribut onclick di HTML)
function openForm(type) {
    closeFab(); // Tutup menu FAB dulu
    
    const title = document.getElementById('modal-form-title');
    const btn = document.getElementById('submit-btn');
    
    title.innerText = type;
    // Set warna tombol Posting sesuai tipe
    btn.style.backgroundColor = (type === 'Lost') ? '#f87171' : '#66BB6A';
    
    inputModal.classList.remove('hidden');
}

// Fungsi Menutup Form
function closeForm() {
    inputModal.classList.add('hidden');
}

// Tutup modal jika klik di area blur (luar form)
inputModal.addEventListener('click', (e) => {
    if (e.target === inputModal) closeForm();
});

// Pastikan overlay FAB juga bisa menutup FAB
fabOverlay?.addEventListener('click', closeFab);

/* --- INTEGRASI BACKEND LOST & FOUND --- */

async function loadItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        const data = await res.json();
        const container = document.getElementById('lost-found-container'); // Pastikan ID ini ada di HTML Grid kamu

        if(container) {
            container.innerHTML = ''; // Bersihkan dummy

            data.forEach(item => {
                // Tentukan class 'lost' atau 'found' biar Filter temanmu jalan
                const categoryClass = item.status === 'HILANG' ? 'lost' : 'found';
                const statusColor = item.status === 'HILANG' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
                
                // Gunakan foto dari server atau placeholder
                const imgUrl = item.foto ? `http://localhost:3000${item.foto}` : 'https://via.placeholder.com/150';

                // Render HTML Card (Struktur disesuaikan biar fungsi openDetail temanmu jalan)
                // Perhatikan: Kita simpan data kontak di atribut 'data-contact' biar gampang diambil
                const html = `
                    <div class="item-card ${categoryClass} bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex flex-col gap-3"
                         onclick="openDetailBackend(this)" 
                         data-name="${item.nama}"
                         data-status="${item.status}"
                         data-contact="${item.kontak}"
                         data-img="${imgUrl}"
                         data-date="${item.tanggal}">
                        
                        <div class="relative h-40 w-full overflow-hidden rounded-lg">
                            <img src="${imgUrl}" class="w-full h-full object-cover">
                            <span class="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${statusColor}">
                                ${item.status}
                            </span>
                        </div>
                        
                        <div>
                            <p class="font-bold text-lg text-gray-800">${item.nama}</p>
                            <span class="text-sm text-gray-400">📅 ${item.tanggal}</span>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }
    } catch (err) { console.error("Gagal load items:", err); }
}

// Kita buat fungsi Open Detail versi Upgrade (Biar datanya akurat dari backend)
// Fungsi ini akan menimpa logika openDetail temanmu yang mengandalkan innerText
function openDetailBackend(card) {
    const modal = document.getElementById('detail-modal');
    
    // Ambil data dari atribut data- yang kita tempel di atas
    const name = card.getAttribute('data-name');
    const status = card.getAttribute('data-status');
    const contact = card.getAttribute('data-contact');
    const img = card.getAttribute('data-img');
    const date = card.getAttribute('data-date');

    // Isi ke Modal
    document.getElementById('detail-name').innerText = name;
    document.getElementById('detail-status').innerText = status;
    document.getElementById('detail-status').style.backgroundColor = status === 'HILANG' ? '#f87171' : '#4ade80';
    document.getElementById('detail-img').src = img;
    
    // Deskripsi lebih lengkap
    const descText = status === 'HILANG' 
        ? `Barang ini hilang pada tanggal ${date}. Jika menemukan, tolong hubungi:` 
        : `Barang ini ditemukan pada tanggal ${date}. Pemilik bisa menghubungi:`;
    
    document.getElementById('detail-desc').innerHTML = `
        <p>${descText}</p>
        <p class="mt-2 font-bold text-xl text-blue-600">📞 ${contact}</p>
    `;

    modal.classList.remove('hidden');
}

// Panggil loadItems saat web dibuka
loadItems();