
const API_URL = 'http://localhost:3000/api';

/* LOGIKA HIDE ON SCROLL 
   ---------------------- */
let lastScrollTop = 0;
const navbar = document.getElementById('main-nav');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(lastScrollTop - scrollTop) <= 10) return;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
        navbar.classList.add('nav-hidden');
    } else {
        navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
}, { passive: true });

/* INDEX 
   ---------------------- */

/* STORY 
   ---------------------- */
const addBtn = document.getElementById('add-story-btn');
const formOverlay = document.getElementById('form-overlay');
const closeBtn = document.getElementById('close-btn');

/* --- INTEGRASI BACKEND STORY --- */

// 1. Load Data dari Server
async function loadStories() {
    try {
        const res = await fetch(`${API_URL}/confess`);
        const data = await res.json();
        const container = document.getElementById('stories-container');
        
        if(container) {
            container.innerHTML = ''; // Reset container
            const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-3'];
            
            data.forEach(item => {
                const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
                const bgColor = item.color || '#FFF9C4';

                // inject html
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
const storyForm = document.getElementById('story-form');
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
        document.getElementById('form-overlay').classList.add('hidden');
        loadStories(); // Refresh data
    });
}

loadStories();

if (addBtn && formOverlay) {
    addBtn.addEventListener('click', () => {
        formOverlay.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        formOverlay.classList.add('hidden');
    });

    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) formOverlay.classList.add('hidden');
    });
}

/* LOST & FOUND
   ---------------------- */
function filterItems(category) {
    const cards = document.querySelectorAll('.item-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    //Filter
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
const itemForm = document.getElementById('item-form'); 

if(itemForm) {
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Siapkan FormData (karena ada upload foto)
        const formData = new FormData(itemForm);

        const typeTitle = document.getElementById('modal-form-title').innerText;
        // Map "Lost" -> "HILANG", "Found" -> "DITEMUKAN"
        const statusValue = (typeTitle === 'Lost') ? 'HILANG' : 'DITEMUKAN';
        
        formData.append('status', statusValue); 

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

//Search
const searchInput = document.getElementById('search-input');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.item-card');

        cards.forEach(card => {
            const itemName = card.querySelector('p').innerText.toLowerCase();
            
            // Jika nama barang cocok dengan kata kunci, tampilkan. Jika tidak, sembunyikan.
            if (itemName.includes(keyword)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}


//ADD button
const mainBtn = document.getElementById('fab-main-btn');
const fabMenu = document.getElementById('fab-menu');
const fabOverlay = document.getElementById('fab-overlay');
const fabIcon = document.getElementById('fab-icon');
const inputModal = document.getElementById('input-modal');
const mainNav = document.getElementById('main-nav');

function closeFab() {
    fabMenu.classList.remove('menu-visible');
    fabOverlay.classList.remove('overlay-visible');
    fabIcon.style.transform = 'rotate(0deg)';

    mainNav.style.filter = 'none'; 
}

mainBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = fabMenu.classList.contains('menu-visible');
    if (!isOpen) {
        fabMenu.classList.add('menu-visible');
        fabOverlay.classList.add('overlay-visible');
        fabIcon.style.transform = 'rotate(45deg)';

        mainNav.style.filter = 'blur(5px)'; 
    } else {
        closeFab();
    }
});

// Buka form 
function openForm(type) {
    mainNav.style.filter = 'none'; 

    closeFab(); 
    const title = document.getElementById('modal-form-title');
    const btn = document.getElementById('submit-btn');
    title.innerText = type;
    btn.style.backgroundColor = (type === 'Lost') ? '#f87171' : '#66BB6A';
    inputModal.classList.remove('hidden');
}

function closeForm() {
    inputModal.classList.add('hidden');
    mainNav.style.filter = 'none';
}

inputModal.addEventListener('click', (e) => {
    if (e.target === inputModal) closeForm();
});

fabOverlay?.addEventListener('click', closeFab);

/* --- INTEGRASI BACKEND LOST & FOUND --- */

async function loadItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        const data = await res.json();
        const container = document.getElementById('lost-found-container');

        if(container) {
            container.innerHTML = ''; // Bersihkan dummy

            data.forEach(item => {
                // Tentukan class 'lost' atau 'found'
                const categoryClass = item.status === 'HILANG' ? 'lost' : 'found';
                const statusColor = item.status === 'HILANG' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600';
                
                // Gunakan foto dari server atau placeholder
                const imgUrl = item.foto ? `http://localhost:3000${item.foto}` : 'https://via.placeholder.com/150';

                // Render HTML Card
                // Perhatikan: simpan data kontak di atribut 'data-contact' biar gampang diambil
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

//Detail post
const detailModal = document.getElementById('detail-modal');
const closeDetail = document.getElementById('close-detail');

function openDetail(card) {
    if (!detailModal) return;

    const backendName = card.getAttribute('data-name');

    if (backendName) {
        const status = card.getAttribute('data-status');
        const contact = card.getAttribute('data-contact');
        const img = card.getAttribute('data-img');
        const date = card.getAttribute('data-date');

        document.getElementById('detail-name').innerText = backendName;
        document.getElementById('detail-status').innerText = status;
        document.getElementById('detail-status').style.backgroundColor = (status === 'HILANG' || status === 'Lost') ? '#f87171' : '#4ade80';
        document.getElementById('detail-img').src = img || "https://via.placeholder.com/400";
        
        const descText = (status === 'HILANG' || status === 'Lost') 
            ? `Barang ini hilang pada tanggal ${date}. Jika menemukan, tolong hubungi:` 
            : `Barang ini ditemukan pada tanggal ${date}. Pemilik bisa menghubungi:`;
        
        document.getElementById('detail-desc').innerHTML = `
            <p>${descText}</p>
            <p class="mt-2 font-bold text-xl text-blue-600">📞 ${contact}</p>
        `;
    } else {
        const name = card.querySelector('p').innerText;
        const location = card.querySelector('span.text-sm').innerText;
        const time = card.querySelector('.font-mono')?.innerText || "Waktu tidak tersedia";
        const status = card.classList.contains('found') ? 'Found' : 'Lost';

        document.getElementById('detail-name').innerText = name;
        document.getElementById('detail-location').querySelector('span').innerText = location;
        document.getElementById('detail-time').querySelector('span').innerText = time;
        document.getElementById('detail-status').innerText = status;
        document.getElementById('detail-status').style.backgroundColor = status === 'Found' ? '#4ade80' : '#f87171';
        document.getElementById('detail-img').src = "https://via.placeholder.com/400"; 
        
        document.getElementById('detail-desc').innerText = "Kontak & Detail: Silakan cek informasi yang tertera di sini. " + 
            (status === 'Lost' ? "Bagi yang menemukan hubungi pengunggah." : "Bagi pemilik sah silakan hubungi pengunggah.");
    }

    detailModal.classList.remove('hidden');
}

// Global Listener untuk kartu
document.addEventListener('click', (e) => {
    const card = e.target.closest('.item-card');
    if (card) {
        openDetail(card);
    }
});

if (closeDetail) {
    closeDetail.addEventListener('click', () => detailModal.classList.add('hidden'));
}

if (detailModal) {
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
    });
}

//Waktu postingan
const lfPostForm = document.getElementById('lf-post-form');

lfPostForm?.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const itemName = document.getElementById('input-item-name').value;
    const itemLocation = document.getElementById('input-item-location').value;
    const itemType = document.getElementById('modal-form-title').innerText; 

    const now = new Date();
    const timeString = now.toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    });

    const grid = document.getElementById('items-grid');
    const newCard = document.createElement('div');
    
    const statusColor = itemType === 'Lost' ? 'bg-red-400' : 'bg-green-400';
    const randomRotation = Math.floor(Math.random() * 5) - 2; 

    newCard.className = `item-card bg-white ${itemType.toLowerCase()} flex flex-col`;
    newCard.style.transform = `rotate(${randomRotation}deg)`;

    newCard.innerHTML = `
        <div class="status-tag ${statusColor} text-white">${itemType}</div>
        <p class="text-xl font-semibold">${itemName}</p>
        <span class="text-sm text-gray-500">Lokasi: ${itemLocation}</span>
        <div class="mt-auto pt-2 border-t border-dashed border-gray-100">
            <span class="text-[10px] text-gray-400 font-mono italic">🕒 ${timeString}</span>
        </div>
    `;

    grid.prepend(newCard);
    closeForm();
    lfPostForm.reset();
});
