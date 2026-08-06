<div align="center">

# 🎫 Ayun Antrian — Digital Queue & Counter Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pg_8.19-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v4.24-22C55E?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#-lisensi)

<p align="center">
  <b>Sistem Manajemen Antrian Digital & Penjadwalan Loket Berbasis Full-Stack Web Modern</b><br>
  Fitur Pemanggil Suara Otomatis (TTS Audio Announcer), Tampilan Display TV Real-Time, Manajemen Shift Harian & Mingguan, serta Analitik Beban Kerja Loket.
</p>

[ 📖 Tentang Project ](#-tentang-project) • [ 🔄 Alur Kerja ](#-alur-kerja-sistem-antrian) • [ ✨ Fitur Utama ](#-fitur-utama) • [ 🛠️ Tech Stack ](#%EF%B8%8F-tech-stack) • [ 🚀 Panduan Instalasi ](#-panduan-instalasi)

</div>

---

> [!NOTE]
> **Arsitektur Proyek**: **Ayun Antrian** dibangun dengan **Next.js 16 App Router** & **TypeScript** menggunakan pendekatan **Domain-Driven Design (DDD)**. Komunikasi data menggunakan driver native PostgreSQL (`pg`) tanpa ORM berat demi performa pemrosesan antrian yang responsif dan terukur.

---

## 📌 Tentang Project

**Ayun Antrian** adalah platform digital untuk mengelola alur pelayanan publik dan operasional loket kantor. Sistem ini mengintegrasikan kiosk pengambilan tiket antrian mandiri, papan display ruang tunggu layar lebar (TV Display Guard), fitur pemanggil suara otomatis per nomor antrian, serta pengelolaan jam kerja petugas (shift management).

### 🎯 Nilai Unggul Sistem

- 🔊 **Automated Audio Paging (`queue.speak`)**: Pemanggilan suara otomatis nomor antrian dan loket tujuan langsung melalui peramban web tanpa perangkat keras audio tambahan.
- 📺 **TV Display Monitor (`TVOnlyGuard`)**: Antarmuka khusus layar lebar/TV di ruang tunggu yang memperbarui status antrian panggil secara konsisten.
- 🗓️ **Flexible Shift & Scheduling**: Pengaturan shift harian serta _template_ mingguan terotomatisasi dengan eksekusi berkala berbasis `node-cron`.
- ⚡ **High Performance Data Handling**: Kueri SQL native teroptimasi untuk menjamin operasi transaksi antrian bebas dari bentrokan (_race conditions_).
- 📈 **Visual Analytics**: Monitoring statistik real-time terkait jumlah antrian terlayani, waktu tunggu rata-rata, dan distribusi statistik per loket.

---

## 🔄 Alur Kerja Sistem Antrian

```text
  [ 🚶 Pengunjung ]
          │
          ▼
┌──────────────────┐      ┌────────────────────────┐      ┌─────────────────────────┐
│  Ambil Antrian   │────▶ │  Server / PostgreSQL   │────▶ │   Display TV Monitor    │
│ (Kiosk/Public)   │      │ (Queue State Updated)  │      │  (Visual & Audio TTS)   │
└──────────────────┘      └───────────┬────────────┘      └─────────────────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │   Panel Operator Loket │
                          │ (Call / Next / Recall) │
                          └────────────────────────┘
```

````

---

## ✨ Fitur Utama

| Modul                    | Fitur & Deskripsi                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Pengambilan Tiket**    | Antarmuka mandiri bagi pengunjung untuk memilih kategori layanan dan mencetak/menerima nomor tiket antrian (`/ambil-antrian`). |
| **Status Antrian Live**  | Pelacakan status panggil nomor antrian secara langsung melalui perangkat seluler pengunjung (`/status-antrian`).               |
| **Display Ruang Tunggu** | Tampilan visual besar khusus layar TV ruang tunggu yang dilengkapi dengan proteksi akses (`TVOnlyGuard`).                      |

| Modul                   | Fitur & Deskripsi                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Panggilan Antrian**   | Dasbor petugas loket untuk memanggil antrian berikutnya, memanggil ulang (_recall_), atau menandai antrian selesai/batal. |
| **Manajemen Loket**     | Pengaturan status operasional loket (buka/tutup), penetapan nama loket, dan jenis layanan yang ditangani.                 |
| **Shift & Penjadwalan** | Pengaturan shift kerja harian petugas serta fleksibilitas pembuatan _template_ shift mingguan.                            |
| **Manajemen User**      | Otentikasi aman pengguna berbasis **NextAuth.js** dan penentuan peran (Admin vs Operator Loket).                          |
| **Laporan & Analitik**  | Visualisasi statistik antrian harian dan bulanan menggunakan grafik interaktif berbasis **Chart.js**.                     |

---

## 🏛️ Arsitektur Sistem & Domain-Driven Design (DDD)

Struktur kode aplikasi mengadopsi prinsip **Clean Architecture / Domain-Driven Design** yang memisahkan logika bisnis (_Modules_) dengan lapisan penyajian UI (_App Router & Components_).

```text
src/
├── app/                        # Next.js 16 App Router (Routing & API Endpoints)
│   ├── (auth)/                 # Otentikasi (Login & Register)
│   ├── (dashboard)/            # Management Admin & Operator (Antrian, Loket, Shift, Users)
│   ├── (public)/               # Halaman Akses Pengunjung (Ambil & Status Antrian)
│   └── api/                    # REST API Handlers (queues, counters, shifts, users)
├── components/                 # Komponen UI Reusable
│   ├── layout/                 # ClientLayout, Navbar, Sidebar, TVOnlyGuard
│   └── ui/                     # DataTable, Modal, StatCard, Chart, Toaster
├── core/                       # Infrastruktur Utama Aplikasi
│   ├── auth/                   # Config NextAuth & Password Hashing
│   ├── database/               # PostgreSQL Connection Pool & Transaction Manager
│   └── http/                   # Standardized API Response & Error Handling
├── hooks/                      # Custom React Hooks per Domain
├── lib/                        # File ayunantrian.sql, Fetcher, SweetAlert Utilities
├── modules/                    # Core Logika Bisnis (DDD Pattern)
│   ├── counter/                # Domain Loket (Entity, Repository, Service)
│   ├── queue/                  # Domain Antrian & TTS Audio Announcer (queue.speak.ts)
│   ├── shift/                  # Domain Shift Petugas
│   ├── user/                   # Domain Manajemen User
│   └── weeklyShiftTemplates/   # Domain Template Shift Mingguan
├── services/                   # Client API Integration Services
├── types/                      # Global TypeScript Definitions
└── utils/                      # Formatting Date & Queue Status Utilities

```

---

## 🛠️ Tech Stack

| Kategori                | Teknologi                           | Keterangan / Kegunaan                                                |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------------- |
| **Core Framework**      | **Next.js 16.1 (App Router)**       | Framework utama React berbasis Server Components & API Routes        |
| **UI Library**          | **React 18.3 & TypeScript 5.9**     | Engine UI dan kepastian tipe data di seluruh lapisan aplikasi        |
| **Styling & Animation** | **Tailwind CSS v4 + Framer Motion** | Penataan gaya modern utility-first dan animasi visual antarmuka      |
| **Database & Driver**   | **PostgreSQL + `pg` Native**        | Database relasional ultra-cepat dengan manajemen koneksi pool native |
| **Autentikasi**         | **NextAuth.js v4 + BcryptJS**       | Pengelolaan sesi JWT aman dan enkripsi kata sandi pengguna           |
| **Audio Synthesizer**   | **Web Speech API (`queue.speak`)**  | Modul pemanggil suara otomatis nomor antrian ke loket tujuan         |
| **Data & Visualisasi**  | **TanStack Table v8 + Chart.js v4** | Tabel data interaktif dan grafik analisis antrian                    |
| **Task Scheduler**      | **Node-Cron**                       | Pemroses jadwal otomatis untuk reset dan rotasi shift antrian        |

---

## 🚀 Panduan Instalasi

### 1. Prasyarat Sistem

Sebelum memulai instalasi, pastikan lingkungan pengembangan Anda memenuhi persyaratan berikut:

- **Node.js**: Versi `20.x` LTS atau yang lebih baru
- **PostgreSQL**: Versi `14.0` atau yang lebih baru
- **Package Manager**: `npm`, `pnpm`, `yarn`, atau `bun`

### 2. Kloning Repositori & Instalasi Dependensi

```bash
# Kloning repositori proyek
git clone [https://github.com/username/ayunantrian.git](https://github.com/username/ayunantrian.git)

# Masuk ke direktori proyek
cd ayunantrian

# Instal seluruh dependensi
npm install

```

### 3. Konfigurasi Variabel Lingkungan (`.env`)

Buat berkas `.env` di **akar direktori proyek** dan sesuaikan konfigurasi berikut:

```env
# ===============================
# DATABASE CONFIGURATION (POSTGRESQL)
# ===============================
DATABASE_URL="postgresql://postgres:12345@localhost:5432/ayunantrian"

# Detail Parameter Koneksi Driver Native
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=12345
DB_NAME=ayunantrian

# ===============================
# NEXTAUTH CONFIGURATION
# ===============================
NEXTAUTH_SECRET=YOUR_SECURE_RANDOM_SECRET_KEY
NEXTAUTH_URL=http://localhost:3000

# ===============================
# APPLICATION PUBLIC URL
# ===============================
NEXT_PUBLIC_BASE_URL=http://localhost:3000

```

> [!TIP]
> Buat kunci rahasia acak untuk `NEXTAUTH_SECRET` menggunakan perintah terminal:
> `openssl rand -base64 32`

### 4. Setup Database PostgreSQL

1. Buat database baru di PostgreSQL Anda dengan nama `ayunantrian`.
2. Impor struktur tabel awal dari berkas SQL yang telah disediakan:

```bash
# Impor skema melalui CLI PostgreSQL
psql -U postgres -d ayunantrian -f src/lib/ayunantrian.sql

```

_Atau impor berkas `src/lib/ayunantrian.sql` secara manual menggunakan aplikasi pengelola database seperti PgAdmin atau DBeaver._

### 5. Jalankan Aplikasi

```bash
# Menjalankan Mode Pengembangan (Development)
npm run dev

```

Buka peramban Anda dan akses [http://localhost:3000](http://localhost:3000).

---

## 📜 Skrip NPM

| Perintah        | Deskripsi                                                     |
| --------------- | ------------------------------------------------------------- |
| `npm run dev`   | 🚀 Menjalankan server pengembangan lokal (_hot-reloading_)    |
| `npm run build` | 📦 Membangun kompilasi produksi teroptimasi                   |
| `npm run start` | ⚡ Menjalankan aplikasi dari hasil kompilasi produksi         |
| `npm run lint`  | 🔍 Memeriksa kualitas dan validasi standar kode dengan ESLint |

---

## 🤝 Kontribusi

Aplikasi ini terbuka untuk pengembangan lebih lanjut. Jika Anda ingin berkontribusi:

1. **Fork** repositori ini
2. Buat branch fitur baru (`git checkout -b feature/FiturBaru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`)
4. Push ke branch tersebut (`git push origin feature/FiturBaru`)
5. Ajukan **Pull Request**

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **[MIT License](https://www.google.com/search?q=LICENSE)**.

```

```
````
