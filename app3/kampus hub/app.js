// ==========================================
// DATA AWAL (SAMPLE DATA)
// ==========================================
const INITIAL_DATA = [
  {
    id: 101,
    title: "UI/UX & Frontend Developer Intern",
    category: "Magang",
    organizer: "PT Nusantara Digital Kreatif",
    mode: "Hybrid",
    deadline: getFutureDate(12),
    benefit: "Uang Saku Rp 2.5jt/bln + Sertifikat",
    link: "https://example.com/magang-uiux",
    featured: true,
    description: "Dicari mahasiswa aktif minimal semester 5 jurusan Informatika, Sistem Informasi, atau DKV. Terbiasa menggunakan Figma, HTML, CSS, dan JavaScript dasar. Mendapat bimbingan mentor senior."
  },
  {
    id: 102,
    title: "National Business Case & Innovation Challenge 2026",
    category: "Lomba",
    organizer: "BEM Fakultas Ekonomika & Bisnis",
    mode: "Online / WFH",
    deadline: getFutureDate(5),
    benefit: "Total Hadiah Rp 15.000.000",
    link: "https://example.com/lomba-business-case",
    featured: true,
    description: "Kompetisi analisis studi kasus bisnis tingkat nasional untuk tim beranggotakan 2-3 mahasiswa D3/S1 lintas jurusan. Babak penyisihan dilakukan secara daring melalui pengumpulan pitch deck."
  },
  {
    id: 103,
    title: "Beasiswa Cendekia Prestasi & Bantuan UKT",
    category: "Beasiswa",
    organizer: "Yayasan Pendidikan Maju Bersama",
    mode: "Online / WFH",
    deadline: getFutureDate(20),
    benefit: "Bantuan UKT Rp 4.000.000/semester",
    link: "https://example.com/beasiswa-cendekia",
    featured: false,
    description: "Program dukungan biaya pendidikan bagi mahasiswa aktif S1/D4 semester 3 hingga 7 dengan IPK minimal 3.25. Termasuk pelatihan kepemimpinan dan jejaring alumni nasional."
  },
  {
    id: 104,
    title: "Data Analyst Intern (Batch Genap)",
    category: "Magang",
    organizer: "FinTech Solusi Indonesia",
    mode: "Onsite / WFO",
    deadline: getFutureDate(3),
    benefit: "Paid Internship + Peluang Full-time",
    link: "https://example.com/magang-data",
    featured: false,
    description: "Membantu tim produk menganalisis perilaku pengguna menggunakan SQL, Python, dan dashboard visualisasi data. Diutamakan mahasiswa tingkat akhir."
  },
  {
    id: 105,
    title: "Hackathon Smart Campus & Sustainability",
    category: "Lomba",
    organizer: "Komunitas Developer Mahasiswa",
    mode: "Hybrid",
    deadline: getFutureDate(16),
    benefit: "Hadiah Rp 10 Juta + Inkubasi Startup",
    link: "https://example.com/hackathon",
    featured: false,
    description: "Bangun prototipe aplikasi web atau mobile dalam 48 jam untuk menyelesaikan masalah lingkungan kampus dan efisiensi energi. Terbuka untuk tim 3-4 orang."
  },
  {
    id: 106,
    title: "Beasiswa Riset Tugas Akhir & Skripsi",
    category: "Beasiswa",
    organizer: "Lembaga Riset Inovasi Daerah",
    mode: "Online / WFH",
    deadline: getPastDate(4),
    benefit: "Dana Riset Rp 5.000.000",
    link: "https://example.com/beasiswa-riset",
    featured: false,
    description: "Pendanaan penelitian skripsi mahasiswa bertema transformasi digital UMKM, pariwisata berkelanjutan, dan pengelolaan lingkungan."
  }
];

// Helper tanggal dinamis agar demo selalu relevan saat dibuka
function getFutureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getPastDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

// ==========================================
// STATE APLIKASI
// ==========================================
let opportunities = JSON.parse(localStorage.getItem('kampushub_data')) || INITIAL_DATA;
let savedIds = JSON.parse(localStorage.getItem('kampushub_saved')) || [];
let currentCategory = 'ALL';
let currentView = 'explore'; // 'explore' atau 'saved'
let isAdminLoggedIn = false;

const ADMIN_PIN = "1234";

// ==========================================
// INISIALISASI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateSavedBadge();
  updateStats();
  renderOpportunities();
});

function saveToLocal() {
  localStorage.setItem('kampushub_data', JSON.stringify(opportunities));
  updateStats();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ==========================================
// NAVIGASI & STATISTIK
// ==========================================
function switchView(view) {
  currentView = view;
  document.getElementById('tabExplore').classList.toggle('active', view === 'explore');
  document.getElementById('tabSaved').classList.toggle('active', view === 'saved');
  document.getElementById('viewTitle').textContent =
    view === 'explore' ? 'Semua Peluang Tersedia' : 'Peluang yang Kamu Simpan';
  renderOpportunities();
}

function setCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  renderOpportunities();
}

function updateStats() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = getFutureDate(7);

  const activeCount = opportunities.filter(o => o.deadline >= today).length;
  const urgentCount = opportunities.filter(o => o.deadline >= today && o.deadline <= nextWeek).length;

  document.getElementById('statTotal').textContent = opportunities.length;
  document.getElementById('statActive').textContent = activeCount;
  document.getElementById('statUrgent').textContent = urgentCount;
}

function updateSavedBadge() {
  document.getElementById('savedBadge').textContent = savedIds.length;
}

// ==========================================
// FITUR BOOKMARK / SIMPAN PELUANG
// ==========================================
function toggleSave(id, event) {
  if (event) event.stopPropagation();
  const index = savedIds.indexOf(id);
  if (index === -1) {
    savedIds.push(id);
    showToast('⭐ Peluang disimpan ke daftar favorit');
  } else {
    savedIds.splice(index, 1);
    showToast('Dihapus dari daftar tersimpan');
  }
  localStorage.setItem('kampushub_saved', JSON.stringify(savedIds));
  updateSavedBadge();
  renderOpportunities();
}

// ==========================================
// RENDER KARTU & FILTERING
// ==========================================
function getDeadlineStatus(deadlineStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadlineStr + 'T00:00:00');
  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: 'Pendaftaran Ditutup', className: 'deadline-closed', isClosed: true };
  } else if (diffDays === 0) {
    return { text: 'Tutup Hari Ini!', className: 'deadline-urgent', isClosed: false };
  } else if (diffDays <= 7) {
    return { text: `Sisa ${diffDays} hari lagi`, className: 'deadline-urgent', isClosed: false };
  } else {
    return { text: `Tutup: ${formatDateIndo(deadlineStr)}`, className: 'deadline-open', isClosed: false };
  }
}

function formatDateIndo(dateStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function renderOpportunities() {
  const keyword = document.getElementById('searchInput').value.toLowerCase().trim();
  const modeFilter = document.getElementById('modeFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const sortFilter = document.getElementById('sortFilter').value;

  let filtered = opportunities.filter(item => {
    // Filter tab view (Explore vs Saved)
    if (currentView === 'saved' && !savedIds.includes(item.id)) return false;

    // Filter kategori
    if (currentCategory !== 'ALL' && item.category !== currentCategory) return false;

    // Filter sistem kerja/lomba
    if (modeFilter !== 'ALL' && item.mode !== modeFilter) return false;

    // Filter status buka/tutup
    const status = getDeadlineStatus(item.deadline);
    if (statusFilter === 'OPEN' && status.isClosed) return false;
    if (statusFilter === 'CLOSED' && !status.isClosed) return false;

    // Filter pencarian teks
    if (keyword) {
      const match =
        item.title.toLowerCase().includes(keyword) ||
        item.organizer.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.benefit.toLowerCase().includes(keyword);
      if (!match) return false;
    }

    return true;
  });

  // Pengurutan (Sorting)
  filtered.sort((a, b) => {
    if (sortFilter === 'FEATURED') {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      return a.deadline.localeCompare(b.deadline);
    } else if (sortFilter === 'DEADLINE_ASC') {
      return a.deadline.localeCompare(b.deadline);
    } else {
      return b.id - a.id;
    }
  });

  document.getElementById('resultsCount').textContent = `Menampilkan ${filtered.length} hasil`;
  const grid = document.getElementById('cardsGrid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h4>Belum ada informasi yang sesuai</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 6px;">
          Coba ubah kata kunci pencarian atau atur ulang filter kategori dan status.
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const status = getDeadlineStatus(item.deadline);
    const isSaved = savedIds.includes(item.id);

    return `
      <article class="card ${item.featured ? 'featured' : ''}">
        ${item.featured ? '<span class="featured-ribbon">⭐ Rekomendasi</span>' : ''}
        <div>
          <div class="card-top">
            <span class="badge badge-${item.category}">${item.category}</span>
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${item.id}, event)" title="Simpan Peluang">
              ${isSaved ? '★' : '☆'}
            </button>
          </div>

          <h4 class="card-title" onclick="openDetailModal(${item.id})">${item.title}</h4>
          <div class="card-org">${item.organizer}</div>

          <div class="card-meta">
            <span class="meta-tag">📍 ${item.mode}</span>
            <span class="meta-tag">🎁 ${item.benefit}</span>
          </div>

          <p class="card-desc">${item.description}</p>
        </div>

        <div class="card-footer">
          <span class="deadline-info ${status.className}">${status.text}</span>
          <div class="card-buttons">
            <button class="btn-secondary" onclick="openDetailModal(${item.id})">Detail</button>
            ${isAdminLoggedIn ? `
              <button class="btn-sm btn-edit" onclick="editOpportunity(${item.id})">Edit</button>
              <button class="btn-sm btn-del" onclick="deleteOpportunity(${item.id})">Hapus</button>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ==========================================
// MODAL DETAIL PELUANG
// ==========================================
function openDetailModal(id) {
  const item = opportunities.find(o => o.id === id);
  if (!item) return;

  const status = getDeadlineStatus(item.deadline);
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <span class="badge badge-${item.category}">${item.category}</span>
    <h2 style="margin: 0.75rem 0 0.25rem; color: var(--navy-900);">${item.title}</h2>
    <p style="font-weight: 600; color: var(--text-muted); margin-bottom: 1rem;">Penyelenggara: ${item.organizer}</p>

    <div class="card-meta" style="margin-bottom: 1.25rem;">
      <span class="meta-tag">📍 Sistem: ${item.mode}</span>
      <span class="meta-tag">🎁 Benefit: ${item.benefit}</span>
      <span class="meta-tag">📅 Batas Daftar: ${formatDateIndo(item.deadline)}</span>
    </div>

    <h4 style="font-size: 0.92rem; margin-bottom: 0.4rem; color: var(--navy-900);">Deskripsi & Persyaratan:</h4>
    <p style="font-size: 0.92rem; color: var(--text-main); white-space: pre-line; margin-bottom: 1.5rem;">
      ${item.description}
    </p>

    <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
      <button class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn-primary">
        ${status.isClosed ? 'Lihat Halaman Program ↗' : 'Daftar Sekarang ↗'}
      </a>
    </div>
  `;

  document.getElementById('detailModal').classList.remove('hidden');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.add('hidden');
}

function closeModalOnOutside(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeDetailModal();
    closeAuthModal();
  }
}

// ==========================================
// FITUR ADMIN (LOGIN & CRUD)
// ==========================================
function openAdminAuth() {
  if (isAdminLoggedIn) {
    document.getElementById('adminDashboard').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  document.getElementById('adminPinInput').value = '';
  document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function verifyAdminPin(event) {
  event.preventDefault();
  const pin = document.getElementById('adminPinInput').value;
  if (pin === ADMIN_PIN) {
    isAdminLoggedIn = true;
    closeAuthModal();
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('adminToggleBtn').textContent = '🔓 Admin Aktif';
    renderOpportunities();
    showToast('Berhasil masuk sebagai Admin');
  } else {
    alert('PIN salah! Gunakan PIN default: 1234');
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('adminToggleBtn').textContent = '🔒 Mode Admin';
  resetForm();
  renderOpportunities();
  showToast('Keluar dari Mode Admin');
}

function handleFormSubmit(event) {
  event.preventDefault();

  const editId = document.getElementById('editId').value;
  const newItem = {
    id: editId ? Number(editId) : Date.now(),
    title: document.getElementById('inputTitle').value.trim(),
    category: document.getElementById('inputCategory').value,
    organizer: document.getElementById('inputOrganizer').value.trim(),
    mode: document.getElementById('inputMode').value,
    deadline: document.getElementById('inputDeadline').value,
    benefit: document.getElementById('inputBenefit').value.trim(),
    link: document.getElementById('inputLink').value.trim(),
    featured: document.getElementById('inputFeatured').checked,
    description: document.getElementById('inputDescription').value.trim()
  };

  if (editId) {
    const idx = opportunities.findIndex(o => o.id === Number(editId));
    if (idx !== -1) opportunities[idx] = newItem;
    showToast('✅ Informasi berhasil diperbarui');
  } else {
    opportunities.unshift(newItem);
    showToast('✅ Peluang baru berhasil dipublikasikan');
  }

  saveToLocal();
  resetForm();
  renderOpportunities();
}

function editOpportunity(id) {
  const item = opportunities.find(o => o.id === id);
  if (!item) return;

  document.getElementById('editId').value = item.id;
  document.getElementById('inputTitle').value = item.title;
  document.getElementById('inputCategory').value = item.category;
  document.getElementById('inputOrganizer').value = item.organizer;
  document.getElementById('inputMode').value = item.mode;
  document.getElementById('inputDeadline').value = item.deadline;
  document.getElementById('inputBenefit').value = item.benefit;
  document.getElementById('inputLink').value = item.link;
  document.getElementById('inputFeatured').checked = item.featured;
  document.getElementById('inputDescription').value = item.description;

  document.getElementById('submitBtn').textContent = 'Simpan Perubahan';
  document.getElementById('adminDashboard').scrollIntoView({ behavior: 'smooth' });
}

function deleteOpportunity(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus peluang ini?')) return;
  opportunities = opportunities.filter(o => o.id !== id);
  savedIds = savedIds.filter(savedId => savedId !== id);
  localStorage.setItem('kampushub_saved', JSON.stringify(savedIds));
  updateSavedBadge();
  saveToLocal();
  renderOpportunities();
  showToast('🗑️ Peluang berhasil dihapus');
}

function resetForm() {
  document.getElementById('opportunityForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('submitBtn').textContent = 'Simpan & Publikasikan';
}
