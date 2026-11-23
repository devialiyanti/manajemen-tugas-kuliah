# DeadLine Kuliah

Aplikasi web manajemen daftar tugas perkuliahan berbasis **TypeScript** dan **Vite**. Proyek ini dibuat untuk memenuhi **Tugas Pertemuan 6 (Git, npm, TypeScript, dan Vite)** pada mata kuliah **Pengembangan Aplikasi Web**.

## Identitas Mahasiswa

- **Nama:** Devi Aliyanti
- **NIM:** 124750029
- **Program Studi:** Teknik Informatika – UIN Sunan Gunung Djati Bandung
- **Mata Kuliah:** Pengembangan Aplikasi Web
- **Repository GitHub:** [devialiyanti/manajemen-tugas-kuliah](https://github.com/devialiyanti/manajemen-tugas-kuliah)

---

## Fitur Utama

- **Tambah Tugas Baru:** Menambahkan mata kuliah, judul/deskripsi tugas, bobot SKS, dan tenggat waktu (*deadline*).
- **Daftar & Statistik Tugas:** Menampilkan seluruh daftar tugas beserta ringkasan jumlah tugas keseluruhan, belum selesai, dan selesai.
- **Edit & Hapus Tugas:** Memperbarui detail tugas yang sudah tercatat atau menghapus tugas dari daftar.
- **Manajemen Status & Filter:** Mengubah status tugas (`Belum Selesai` / `Selesai`) serta menyaring daftar tugas berdasarkan kategori status.
- **Penyimpanan Lokal:** Data tugas tersimpan otomatis di `localStorage` browser sehingga tidak hilang saat halaman dimuat ulang.
- **Dokumentasi Teknis:** Memuat ringkasan konsep Git, GitHub, npm, TypeScript, Vite (*compiler*, *transpiler*, *bundler*), dan *environment variables* langsung pada halaman web.

---

## Penerapan Konsep Teknis

### 1. TypeScript (`src/types.ts` & `src/main.ts`)
- **Primitive Types:** `string`, `number`, dan `boolean` untuk properti tugas dan status penyuntingan.
- **Array:** `TugasKuliah[]` untuk mengelola koleksi data tugas kuliah.
- **Interface:** `TugasKuliah`, `ImportMetaEnv`, dan `ImportMeta`.
- **Type Alias & Union Type:** `StatusTugas` (`"Belum Selesai" | "Selesai"`) dan `FilterStatus` (`"Semua" | StatusTugas`).
- **Generics:** Fungsi *reusable* `simpanKeStorage<T>()`, `ambilDariStorage<T>()`, dan `saringData<T>()`.

### 2. npm & Vite (`package.json`)
- Proyek diinisialisasi menggunakan template `vanilla-ts` dari Vite.
- Pengelolaan paket pustaka pengembangan (`typescript`, `vite`) tercatat pada `devDependencies` dengan aturan *Semantic Versioning*.
- Menggunakan *npm scripts* (`npm run dev`, `npm run build`, `npm run preview`) untuk menjalankan server pengembangan dan proses *bundling* produksi ke folder `dist/`.

### 3. Environment Variables (`.env` & `.env.example`)
- Konfigurasi non-rahasia (`VITE_APP_NAME` dan `VITE_APP_VERSION`) diakses melalui `import.meta.env`.
- File `.env` dikecualikan melalui `.gitignore` agar kredensial sensitif seperti `SECRET_API_KEY` tidak terunggah ke GitHub.

---

## Struktur Proyek

```text
manajemen-tugas-kuliah/
├── src/
│   ├── main.ts          # Logika utama CRUD, filter, navigasi, dan manipulasi DOM
│   ├── style.css        # Styling responsif dan tata letak komponen
│   └── types.ts         # Definisi Interface, Type Alias, Union Type, dan Generics
├── .env.example         # Template variabel lingkungan
├── .gitignore           # Daftar file/folder yang diabaikan Git (.env, node_modules, dist)
├── index.html           # Struktur halaman utama, navbar, form, daftar tugas, dan dokumentasi
├── package.json         # Konfigurasi proyek, dependencies, dan npm scripts
├── tsconfig.json        # Konfigurasi compiler TypeScript
└── README.md            # Dokumentasi proyek