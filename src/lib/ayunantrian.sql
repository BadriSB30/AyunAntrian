-- ======================================================
-- DATABASE : ayunantrian
-- SYSTEM   : Antrian Pendaftaran (Loket)
-- DBMS     : PostgreSQL
-- ======================================================

-- =========================
-- 1. CREATE DATABASE
-- (Jalankan sebagai superuser di luar koneksi database target)
-- =========================
-- CREATE DATABASE ayunantrian
--   ENCODING 'UTF8'
--   LC_COLLATE 'id_ID.UTF-8'
--   LC_CTYPE   'id_ID.UTF-8'
--   TEMPLATE template0;

-- \c ayunantrian

-- =========================
-- 2. CUSTOM ENUM TYPES
-- (Pengganti ENUM inline MySQL)
-- =========================
DO $$ BEGIN
  CREATE TYPE role_type   AS ENUM ('admin', 'superadmin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_user AS ENUM ('aktif', 'nonaktif');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_loket AS ENUM ('aktif', 'nonaktif');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE hari_type AS ENUM (
    'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_antrian AS ENUM (
    'menunggu', 'dipanggil', 'selesai', 'batal'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =========================
-- 3. TABLE: users (Petugas)
-- =========================
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  username    VARCHAR(50)   NOT NULL UNIQUE,
  email       VARCHAR(100)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        role_type     NOT NULL,
  status      status_user   NOT NULL DEFAULT 'aktif',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. TABLE: counters (Loket)
-- =========================
DROP TABLE IF EXISTS counters CASCADE;
CREATE TABLE counters (
  id          SERIAL PRIMARY KEY,
  kode_loket  VARCHAR(10)   NOT NULL UNIQUE,
  nama_loket  VARCHAR(50)   NOT NULL,
  status      status_loket  NOT NULL DEFAULT 'aktif',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 5. TABLE: shifts (Shift Kerja)
-- =========================
DROP TABLE IF EXISTS shifts CASCADE;
CREATE TABLE shifts (
  id           SERIAL PRIMARY KEY,
  nama_shift   VARCHAR(30)  NOT NULL,
  jam_mulai    TIME         NOT NULL,
  jam_selesai  TIME         NOT NULL
);

-- =========================
-- 6. TABLE: weekly_shift_templates
-- (Template Jadwal Mingguan)
-- =========================
DROP TABLE IF EXISTS weekly_shift_templates CASCADE;
CREATE TABLE weekly_shift_templates (
  id          SERIAL PRIMARY KEY,
  counter_id  INT        NOT NULL,
  admin_id    INT        NOT NULL,
  shift_id    INT        NOT NULL,
  hari        hari_type  NOT NULL,

  CONSTRAINT fk_tpl_counter
    FOREIGN KEY (counter_id) REFERENCES counters(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tpl_admin
    FOREIGN KEY (admin_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tpl_shift
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT uniq_template
    UNIQUE (counter_id, hari, shift_id)
);

-- =========================
-- 7. TABLE: queues (Antrian)
-- =========================
DROP TABLE IF EXISTS queues CASCADE;
CREATE TABLE queues (
  id             SERIAL PRIMARY KEY,
  tanggal        DATE            NOT NULL,
  nomor_antrian  INT             NOT NULL,
  counter_id     INT             NOT NULL,
  admin_id       INT             NOT NULL,
  shift_id       INT             NOT NULL,
  status         status_antrian  NOT NULL DEFAULT 'menunggu',
  waktu_ambil    TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  waktu_panggil  TIMESTAMPTZ     NULL,
  waktu_selesai  TIMESTAMPTZ     NULL,

  CONSTRAINT fk_queue_counter
    FOREIGN KEY (counter_id) REFERENCES counters(id),

  CONSTRAINT fk_queue_admin
    FOREIGN KEY (admin_id) REFERENCES users(id),

  CONSTRAINT fk_queue_shift
    FOREIGN KEY (shift_id) REFERENCES shifts(id),

  CONSTRAINT uniq_queue
    UNIQUE (tanggal, counter_id, shift_id, nomor_antrian)
);

-- =========================
-- 8. INDEXING (PERFORMA)
-- =========================
CREATE INDEX idx_queue_tanggal ON queues (tanggal);
CREATE INDEX idx_queue_status  ON queues (status);
CREATE INDEX idx_queue_counter ON queues (counter_id);
CREATE INDEX idx_queue_admin   ON queues (admin_id);
CREATE INDEX idx_queue_shift   ON queues (shift_id);

CREATE INDEX idx_template_hari ON weekly_shift_templates (hari);

-- ======================================================
-- SELESAI
-- ======================================================