"use strict";

/* =====================================================
   PENGATURAN: ubah harga di sini sesuai laundry kamu
   ===================================================== */
const HARGA_PER_KG = {
  "Cuci + setrika": 7000,
  "Cuci kering": 5000,
  "Setrika saja": 4000,
};
const TAMBAHAN_KILAT_PER_KG = 3000;
const STATUS = ["Diterima", "Dicuci", "Siap diambil", "Sudah diambil"];
const KUNCI_PENYIMPANAN = "pelacak-laundry-pesanan";

/* ===================== STATE ===================== */
let pesanan = muatData();
let sedangDiedit = null; // id pesanan yang sedang diubah
let filterStatus = "semua"; // "semua" atau indeks status (string)
let kataCari = "";

/* ===================== ELEMEN ===================== */
const $ = (selektor) => document.querySelector(selektor);
const formPesanan = $("#form-pesanan");
const pilihLayanan = $("#layanan");
const pesanForm = $("#pesan-form");
const tombolSimpan = $("#tombol-simpan");
const tombolBatal = $("#tombol-batal");

/* ===================== UTILITAS ===================== */
function muatData() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_PENYIMPANAN));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function simpanData() {
  try {
    localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(pesanan));
  } catch {
    tampilkanPesan("Data gagal disimpan. Penyimpanan browser mungkin penuh.", "galat");
  }
}

function rupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
}

function hitungBiaya(layanan, berat, kilat) {
  const perKg = (HARGA_PER_KG[layanan] || 0) + (kilat ? TAMBAHAN_KILAT_PER_KG : 0);
  return Math.round(perKg * berat);
}

function kodeBaru() {
  const terbesar = pesanan.reduce((maks, p) => {
    const nomor = parseInt(p.kode.replace("LDR-", ""), 10);
    return nomor > maks ? nomor : maks;
  }, 0);
  return "LDR-" + String(terbesar + 1).padStart(4, "0");
}

function formatWaktu(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBerat(berat) {
  return berat.toLocaleString("id-ID") + " kg";
}

function esc(teks) {
  return String(teks).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function tampilkanPesan(teks, jenis) {
  pesanForm.textContent = teks;
  pesanForm.className = "pesan " + (jenis || "");
}

/* ===================== FORM ===================== */
function isiPilihanLayanan() {
  pilihLayanan.innerHTML = Object.keys(HARGA_PER_KG)
    .map((nama) => `<option value="${esc(nama)}">${esc(nama)} (${rupiah(HARGA_PER_KG[nama])}/kg)</option>`)
    .join("");
}

function perbaruiPratinjauBiaya() {
  const berat = parseFloat(formPesanan.berat.value) || 0;
  const biaya = hitungBiaya(formPesanan.layanan.value, berat, formPesanan.kilat.checked);
  $("#pratinjau-biaya").textContent = rupiah(biaya);
}

function resetForm() {
  formPesanan.reset();
  sedangDiedit = null;
  $("#judul-form").textContent = "Pesanan baru";
  tombolSimpan.textContent = "Simpan pesanan";
  tombolBatal.hidden = true;
  perbaruiPratinjauBiaya();
}

formPesanan.addEventListener("input", perbaruiPratinjauBiaya);
formPesanan.addEventListener("change", perbaruiPratinjauBiaya);

formPesanan.addEventListener("submit", (e) => {
  e.preventDefault();

  const nama = formPesanan.nama.value.trim();
  const hp = formPesanan.hp.value.replace(/[\s-]/g, "");
  const layanan = formPesanan.layanan.value;
  const berat = parseFloat(formPesanan.berat.value);
  const kilat = formPesanan.kilat.checked;
  const catatan = formPesanan.catatan.value.trim();

  if (!nama) return tampilkanPesan("Nama pelanggan wajib diisi.", "galat");
  if (!/^\+?[0-9]{8,15}$/.test(hp)) {
    return tampilkanPesan("Nomor HP harus berisi 8 sampai 15 angka.", "galat");
  }
  if (!(berat > 0)) return tampilkanPesan("Berat harus lebih dari 0 kg.", "galat");

  const biaya = hitungBiaya(layanan, berat, kilat);

  if (sedangDiedit) {
    const p = pesanan.find((x) => x.id === sedangDiedit);
    Object.assign(p, { nama, hp, layanan, berat, kilat, catatan, biaya });
    tampilkanPesan(`Pesanan ${p.kode} diperbarui.`, "sukses");
  } else {
    const sekarang = new Date().toISOString();
    const baru = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kode: kodeBaru(),
      nama, hp, layanan, berat, kilat, catatan, biaya,
      status: 0,
      tanggal: sekarang,
      riwayat: [{ status: 0, waktu: sekarang }],
    };
    pesanan.push(baru);
    tampilkanPesan(`Pesanan ${baru.kode} disimpan. Berikan kode ini ke pelanggan.`, "sukses");
  }

  simpanData();
  const pesanTersimpan = pesanForm.textContent;
  const kelasTersimpan = pesanForm.className;
  resetForm();
  pesanForm.textContent = pesanTersimpan;
  pesanForm.className = kelasTersimpan;
  render();
});

tombolBatal.addEventListener("click", () => {
  resetForm();
  tampilkanPesan("");
});

function mulaiUbah(id) {
  const p = pesanan.find((x) => x.id === id);
  if (!p) return;
  sedangDiedit = id;
  formPesanan.nama.value = p.nama;
  formPesanan.hp.value = p.hp;
  formPesanan.layanan.value = p.layanan;
  formPesanan.berat.value = p.berat;
  formPesanan.kilat.checked = p.kilat;
  formPesanan.catatan.value = p.catatan;
  $("#judul-form").textContent = "Ubah pesanan " + p.kode;
  tombolSimpan.textContent = "Simpan perubahan";
  tombolBatal.hidden = false;
  perbaruiPratinjauBiaya();
  tampilkanPesan("");
  formPesanan.nama.focus();
  formPesanan.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===================== STATUS & HAPUS ===================== */
function ubahStatus(id, arah) {
  const p = pesanan.find((x) => x.id === id);
  if (!p) return;
  const baru = p.status + arah;
  if (baru < 0 || baru >= STATUS.length) return;
  p.status = baru;
  p.riwayat.push({ status: baru, waktu: new Date().toISOString() });
  simpanData();
  render();
}

function hapusPesanan(id) {
  const p = pesanan.find((x) => x.id === id);
  if (!p) return;
  if (!confirm(`Hapus pesanan ${p.kode} atas nama ${p.nama}?`)) return;
  pesanan = pesanan.filter((x) => x.id !== id);
  if (sedangDiedit === id) resetForm();
  simpanData();
  render();
}

/* ===================== RENDER ===================== */
function render() {
  renderRingkasan();
  renderTab();
  renderDaftar();
}

function renderRingkasan() {
  const dikerjakan = pesanan.filter((p) => p.status <= 1).length;
  const siap = pesanan.filter((p) => p.status === 2).length;
  const pendapatan = pesanan
    .filter((p) => p.status === 3)
    .reduce((jumlah, p) => jumlah + p.biaya, 0);

  $("#ringkasan").innerHTML = `
    <div><span>Sedang dikerjakan</span><strong>${dikerjakan}</strong></div>
    <div><span>Siap diambil</span><strong>${siap}</strong></div>
    <div><span>Pendapatan (sudah diambil)</span><strong>${rupiah(pendapatan)}</strong></div>
  `;
}

function renderTab() {
  const hitung = (s) => pesanan.filter((p) => p.status === s).length;
  const tab = [{ nilai: "semua", teks: `Semua (${pesanan.length})` }].concat(
    STATUS.map((nama, i) => ({ nilai: String(i), teks: `${nama} (${hitung(i)})` }))
  );

  $("#tab-status").innerHTML = tab
    .map((t) => `<button type="button" class="tab" data-filter="${t.nilai}" aria-pressed="${filterStatus === t.nilai}">${esc(t.teks)}</button>`)
    .join("");
}

function renderDaftar() {
  const kata = kataCari.toLowerCase();
  const tampil = pesanan
    .filter((p) => filterStatus === "semua" || String(p.status) === filterStatus)
    .filter((p) => !kata || [p.kode, p.nama, p.hp].some((v) => v.toLowerCase().includes(kata)))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));

  const wadah = $("#daftar");

  if (pesanan.length === 0) {
    wadah.innerHTML = `<div class="kosong">Belum ada pesanan. Isi formulir di sebelah untuk mencatat cucian pertama.</div>`;
    return;
  }
  if (tampil.length === 0) {
    wadah.innerHTML = `<div class="kosong">Tidak ada pesanan yang cocok dengan pencarian atau filter ini.</div>`;
    return;
  }

  wadah.innerHTML = tampil.map(htmlTiket).join("");
}

function htmlTiket(p) {
  const segmen = STATUS.map((_, i) => `<i class="${i <= p.status ? "aktif" : ""}"></i>`).join("");
  const labelJalur = STATUS.map((nama) => `<span>${esc(nama)}</span>`).join("");

  const tombolMaju = p.status < STATUS.length - 1
    ? `<button class="tombol tombol-utama tombol-kecil" data-aksi="maju" data-id="${p.id}">Tandai ${esc(STATUS[p.status + 1].toLowerCase())}</button>`
    : "";
  const tombolMundur = p.status > 0
    ? `<button class="tombol tombol-kecil" data-aksi="mundur" data-id="${p.id}">Kembalikan status</button>`
    : "";

  return `
    <article class="tiket s${p.status}">
      <div class="tiket-atas">
        <span class="kode">${esc(p.kode)}</span>
        <span class="lencana s${p.status}">${esc(STATUS[p.status])}</span>
      </div>
      <h3><button class="link-nama" data-aksi="riwayat" data-hp="${esc(p.hp)}">${esc(p.nama)}</button></h3>
      <p class="rincian">
        <span>${esc(p.layanan)}${p.kilat ? " (kilat)" : ""}</span>
        <span>${formatBerat(p.berat)}</span>
        <span>${rupiah(p.biaya)}</span>
        <span>Masuk ${formatWaktu(p.tanggal)}</span>
      </p>
      ${p.catatan ? `<p class="rincian catatan">Catatan: ${esc(p.catatan)}</p>` : ""}
      <div class="jalur" aria-hidden="true">${segmen}</div>
      <div class="label-jalur" aria-hidden="true">${labelJalur}</div>
      <div class="aksi">
        ${tombolMaju}
        ${tombolMundur}
        <button class="tombol tombol-kecil" data-aksi="ubah" data-id="${p.id}">Ubah</button>
        <button class="tombol tombol-kecil tombol-hapus" data-aksi="hapus" data-id="${p.id}">Hapus</button>
      </div>
    </article>
  `;
}

/* ===================== EVENT: DAFTAR, TAB, CARI ===================== */
$("#daftar").addEventListener("click", (e) => {
  const tombol = e.target.closest("[data-aksi]");
  if (!tombol) return;
  const { aksi, id, hp } = tombol.dataset;

  if (aksi === "maju") ubahStatus(id, 1);
  else if (aksi === "mundur") ubahStatus(id, -1);
  else if (aksi === "ubah") mulaiUbah(id);
  else if (aksi === "hapus") hapusPesanan(id);
  else if (aksi === "riwayat") tampilkanRiwayat(hp);
});

$("#tab-status").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-filter]");
  if (!tab) return;
  filterStatus = tab.dataset.filter;
  render();
});

$("#cari").addEventListener("input", (e) => {
  kataCari = e.target.value.trim();
  renderDaftar();
});

/* ===================== RIWAYAT PELANGGAN ===================== */
function tampilkanRiwayat(hp) {
  const milikPelanggan = pesanan
    .filter((p) => p.hp === hp)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  if (milikPelanggan.length === 0) return;

  const total = milikPelanggan.reduce((jumlah, p) => jumlah + p.biaya, 0);
  const totalBerat = milikPelanggan.reduce((jumlah, p) => jumlah + p.berat, 0);
  const baris = milikPelanggan
    .map((p) => `
      <tr>
        <td>${esc(p.kode)}</td>
        <td>${formatWaktu(p.tanggal)}</td>
        <td>${esc(p.layanan)}</td>
        <td>${formatBerat(p.berat)}</td>
        <td>${rupiah(p.biaya)}</td>
        <td>${esc(STATUS[p.status])}</td>
      </tr>`)
    .join("");

  $("#isi-riwayat").innerHTML = `
    <h2 id="judul-riwayat">${esc(milikPelanggan[0].nama)}</h2>
    <p class="sub">${esc(hp)}: ${milikPelanggan.length} pesanan, ${formatBerat(totalBerat)}, total ${rupiah(total)}</p>
    <div class="tabel-gulir">
      <table>
        <thead><tr><th>Kode</th><th>Masuk</th><th>Layanan</th><th>Berat</th><th>Biaya</th><th>Status</th></tr></thead>
        <tbody>${baris}</tbody>
      </table>
    </div>
  `;
  $("#dialog-riwayat").showModal();
}

/* ===================== CEK STATUS ===================== */
$("#form-cek").addEventListener("submit", (e) => {
  e.preventDefault();
  let masukan = $("#kode-cek").value.trim().toUpperCase();
  if (/^\d+$/.test(masukan)) masukan = "LDR-" + masukan.padStart(4, "0");

  const hasil = $("#hasil-cek");
  const p = pesanan.find((x) => x.kode === masukan);

  if (!p) {
    hasil.innerHTML = `<p class="galat">Kode ${esc(masukan)} tidak ditemukan. Periksa lagi kode pada nota.</p>`;
    return;
  }

  const waktuTerakhir = p.riwayat[p.riwayat.length - 1].waktu;
  hasil.innerHTML = `
    <div class="kartu-hasil">
      <strong>${esc(p.kode)}: ${esc(STATUS[p.status])}</strong>
      <p>Atas nama ${esc(p.nama)}. Diperbarui ${formatWaktu(waktuTerakhir)}. Total ${rupiah(p.biaya)}.</p>
    </div>
  `;
});

/* ===================== MULAI ===================== */
isiPilihanLayanan();
perbaruiPratinjauBiaya();
render();