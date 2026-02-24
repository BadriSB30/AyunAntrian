-- ======================================================
-- DATABASE : ayunantrian
-- SYSTEM   : Antrian Pendaftaran (Loket)
-- DBMS     : MySQL
-- ======================================================

-- =========================
-- 1. CREATE DATABASE
-- =========================
CREATE DATABASE IF NOT EXISTS ayunantrian
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ayunantrian;

-- =========================
-- 2. TABLE: users (Petugas)
-- =========================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','superadmin') NOT NULL,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- 3. TABLE: counters (Loket)
-- =========================
DROP TABLE IF EXISTS counters;
CREATE TABLE counters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_loket VARCHAR(10) NOT NULL UNIQUE,
  nama_loket VARCHAR(50) NOT NULL,
  status ENUM('aktif','nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- 4. TABLE: shifts (Shift Kerja)
-- =========================
DROP TABLE IF EXISTS shifts;
CREATE TABLE shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_shift VARCHAR(30) NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL
) ENGINE=InnoDB;

-- =========================
-- 5. TABLE: weekly_shift_templates
-- (Template Jadwal Mingguan)
-- =========================
DROP TABLE IF EXISTS weekly_shift_templates;
CREATE TABLE weekly_shift_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,

  counter_id INT NOT NULL,
  admin_id INT NOT NULL,
  shift_id INT NOT NULL,

  hari ENUM (
    'senin','selasa','rabu','kamis','jumat','sabtu','minggu'
  ) NOT NULL,

  CONSTRAINT fk_tpl_counter
    FOREIGN KEY (counter_id) REFERENCES counters(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tpl_admin
    FOREIGN KEY (admin_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT fk_tpl_shift
    FOREIGN KEY (shift_id) REFERENCES shifts(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  UNIQUE KEY uniq_template (counter_id, hari, shift_id)
) ENGINE=InnoDB;

-- =========================
-- 6. TABLE: queues (Antrian)
-- =========================
DROP TABLE IF EXISTS queues;
CREATE TABLE queues (
  id INT AUTO_INCREMENT PRIMARY KEY,

  tanggal DATE NOT NULL,
  nomor_antrian INT NOT NULL,

  counter_id INT NOT NULL,
  admin_id INT NOT NULL,
  shift_id INT NOT NULL,

  status ENUM('menunggu','dipanggil','selesai','batal')
    DEFAULT 'menunggu',

  waktu_ambil DATETIME DEFAULT CURRENT_TIMESTAMP,
  waktu_panggil DATETIME NULL,
  waktu_selesai DATETIME NULL,

  CONSTRAINT fk_queue_counter
    FOREIGN KEY (counter_id) REFERENCES counters(id),

  CONSTRAINT fk_queue_admin
    FOREIGN KEY (admin_id) REFERENCES users(id),

  CONSTRAINT fk_queue_shift
    FOREIGN KEY (shift_id) REFERENCES shifts(id),

  UNIQUE KEY uniq_queue (
    tanggal, counter_id, shift_id, nomor_antrian
  )
) ENGINE=InnoDB;

-- =========================
-- 7. INDEXING (PERFORMA)
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
