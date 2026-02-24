// src/types/enums.ts

/**
 * =====================================================
 * USER
 * =====================================================
 */

/**
 * Role user (table: users.role)
 */
export enum Role {
	ADMIN = 'admin',
	SUPERADMIN = 'superadmin',
}

/**
 * Status user (table: users.status)
 */
export enum UserStatus {
	AKTIF = 'aktif',
	NONAKTIF = 'nonaktif',
}

/**
 * =====================================================
 * COUNTER / LOKET
 * =====================================================
 */

/**
 * Status loket (table: counters.status)
 */
export enum CounterStatus {
	AKTIF = 'aktif',
	NONAKTIF = 'nonaktif',
}

/**
 * =====================================================
 * SHIFT & SCHEDULE
 * =====================================================
 */

/**
 * Hari kerja (table: weekly_shift_templates.hari)
 */
export enum Hari {
	SENIN = 'senin',
	SELASA = 'selasa',
	RABU = 'rabu',
	KAMIS = 'kamis',
	JUMAT = 'jumat',
	SABTU = 'sabtu',
	MINGGU = 'minggu',
}

/**
 * =====================================================
 * QUEUE / ANTRIAN
 * =====================================================
 */

/**
 * Status antrian (table: queues.status)
 */
export enum QueueStatus {
	MENUNGGU = 'menunggu',
	DIPANGGIL = 'dipanggil',
	SELESAI = 'selesai',
	BATAL = 'batal',
}
