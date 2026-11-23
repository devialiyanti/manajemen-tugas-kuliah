import "./style.css";
import {
  type FilterStatus,
  type StatusTugas,
  type TugasKuliah,
  ambilDariStorage,
  saringData,
  simpanKeStorage,
} from "./types";

const STORAGE_KEY: string = "daftar_tugas_kuliah_v1";
const namaAplikasi: string =
  import.meta.env.VITE_APP_NAME || "DeadLine Kuliah";
const versiAplikasi: string = import.meta.env.VITE_APP_VERSION || "1.0.0";

const dataAwal: TugasKuliah[] = [
  {
    id: 1,
    mataKuliah: "Pengembangan Aplikasi Web",
    judulTugas: "Tugas Pertemuan 6: Git, npm, TypeScript, dan Vite",
    sks: 3,
    deadline: "2026-11-25",
    selesai: false,
    status: "Belum Selesai",
  },
];

let daftarTugas: TugasKuliah[] = ambilDariStorage<TugasKuliah[]>(
  STORAGE_KEY,
  dataAwal
);
let idSedangDiedit: number | null = null;
let filterAktif: FilterStatus = "Semua";

const appTitleEl = document.getElementById("app-title") as HTMLHeadingElement;
const appVersionEl = document.getElementById("app-version") as HTMLSpanElement;
const formHeadingEl = document.getElementById(
  "form-heading"
) as HTMLHeadingElement;
const formEl = document.getElementById("tugas-form") as HTMLFormElement;
const inputMatkul = document.getElementById("mata-kuliah") as HTMLInputElement;
const inputJudul = document.getElementById("judul-tugas") as HTMLInputElement;
const inputSks = document.getElementById("sks") as HTMLInputElement;
const inputDeadline = document.getElementById("deadline") as HTMLInputElement;
const btnSubmit = document.getElementById("btn-submit") as HTMLButtonElement;
const btnBatal = document.getElementById("btn-batal") as HTMLButtonElement;
const daftarTugasEl = document.getElementById("daftar-tugas") as HTMLDivElement;
const statistikEl = document.getElementById(
  "statistik-tugas"
) as HTMLDivElement;
const filterButtons =
  document.querySelectorAll<HTMLButtonElement>(".btn-filter");
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
const sections = document.querySelectorAll<HTMLElement>("main section.card");

appTitleEl.textContent = namaAplikasi;
appVersionEl.textContent = `v${versiAplikasi}`;
document.title = `${namaAplikasi} - v${versiAplikasi}`;

function setActiveNav(targetId: string): void {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === `#${targetId}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    if (href) {
      setActiveNav(href.replace("#", ""));
    }
  });
});

window.addEventListener("scroll", () => {
  let currentId: string = "tambah-tugas";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });
  setActiveNav(currentId);
});

function resetForm(): void {
  idSedangDiedit = null;
  formEl.reset();
  inputSks.value = "3";
  formHeadingEl.textContent = "Tambah Tugas Baru";
  btnSubmit.textContent = "Tambah Tugas";
  btnBatal.classList.add("hidden");
}

function simpanDanRender(): void {
  simpanKeStorage<TugasKuliah[]>(STORAGE_KEY, daftarTugas);
  renderDaftarTugas();
}

function renderDaftarTugas(): void {
  const totalTugas: number = daftarTugas.length;
  const totalSelesai: number = saringData<TugasKuliah>(
    daftarTugas,
    (item) => item.selesai
  ).length;
  const totalBelum: number = totalTugas - totalSelesai;

  statistikEl.textContent = `Total: ${totalTugas} tugas | Belum Selesai: ${totalBelum} | Selesai: ${totalSelesai}`;

  const tugasTersaring: TugasKuliah[] =
    filterAktif === "Semua"
      ? daftarTugas
      : saringData<TugasKuliah>(
          daftarTugas,
          (item) => item.status === filterAktif
        );

  if (tugasTersaring.length === 0) {
    daftarTugasEl.innerHTML = `<div class="empty-state">Belum ada tugas pada kategori "${filterAktif}".</div>`;
    return;
  }

  daftarTugasEl.innerHTML = tugasTersaring
    .map(
      (tugas) => `
      <div class="tugas-item ${tugas.selesai ? "selesai" : ""}">
        <div class="tugas-info">
          <span class="tugas-matkul">${tugas.mataKuliah} (${tugas.sks} SKS)</span>
          <h3 class="tugas-judul">${tugas.judulTugas}</h3>
          <div class="tugas-meta">
            <span>Deadline: <strong>${tugas.deadline}</strong></span>
            <span class="badge-status ${
              tugas.selesai ? "badge-selesai" : "badge-belum"
            }">${tugas.status}</span>
          </div>
        </div>
        <div class="tugas-actions">
          <button class="btn-sm btn-toggle" data-action="toggle" data-id="${tugas.id}">
            ${tugas.selesai ? "Tandai Belum" : "Tandai Selesai"}
          </button>
          <button class="btn-sm btn-edit" data-action="edit" data-id="${tugas.id}">
            Edit
          </button>
          <button class="btn-sm btn-delete" data-action="delete" data-id="${tugas.id}">
            Hapus
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

formEl.addEventListener("submit", (event: Event) => {
  event.preventDefault();

  const mataKuliah: string = inputMatkul.value.trim();
  const judulTugas: string = inputJudul.value.trim();
  const sks: number = Number(inputSks.value);
  const deadline: string = inputDeadline.value;

  if (!mataKuliah || !judulTugas || !deadline) {
    return;
  }

  if (idSedangDiedit !== null) {
    daftarTugas = daftarTugas.map((item) =>
      item.id === idSedangDiedit
        ? { ...item, mataKuliah, judulTugas, sks, deadline }
        : item
    );
  } else {
    const statusBaru: StatusTugas = "Belum Selesai";
    const tugasBaru: TugasKuliah = {
      id: Date.now(),
      mataKuliah,
      judulTugas,
      sks,
      deadline,
      selesai: false,
      status: statusBaru,
    };
    daftarTugas.unshift(tugasBaru);
  }

  resetForm();
  simpanDanRender();
});

btnBatal.addEventListener("click", () => {
  resetForm();
});

daftarTugasEl.addEventListener("click", (event: Event) => {
  const target = event.target as HTMLElement;
  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action || !id) {
    return;
  }

  if (action === "toggle") {
    daftarTugas = daftarTugas.map((item) => {
      if (item.id === id) {
        const selesaiBaru: boolean = !item.selesai;
        const statusBaru: StatusTugas = selesaiBaru
          ? "Selesai"
          : "Belum Selesai";
        return { ...item, selesai: selesaiBaru, status: statusBaru };
      }
      return item;
    });
    simpanDanRender();
  } else if (action === "edit") {
    const targetTugas = daftarTugas.find((item) => item.id === id);
    if (targetTugas) {
      idSedangDiedit = targetTugas.id;
      inputMatkul.value = targetTugas.mataKuliah;
      inputJudul.value = targetTugas.judulTugas;
      inputSks.value = String(targetTugas.sks);
      inputDeadline.value = targetTugas.deadline;
      formHeadingEl.textContent = "Edit Tugas Kuliah";
      btnSubmit.textContent = "Simpan Perubahan";
      btnBatal.classList.remove("hidden");
      document
        .getElementById("tambah-tugas")
        ?.scrollIntoView({ behavior: "smooth" });
      inputMatkul.focus();
    }
  } else if (action === "delete") {
    daftarTugas = daftarTugas.filter((item) => item.id !== id);
    if (idSedangDiedit === id) {
      resetForm();
    }
    simpanDanRender();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterAktif = (btn.dataset.filter as FilterStatus) || "Semua";
    renderDaftarTugas();
  });
});

renderDaftarTugas();