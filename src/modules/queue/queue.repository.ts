import { pool } from '@/core/database/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { QueueEntity } from './queue.entity';
import { QueueStatus } from '@/types/enums';
import { HttpError } from '@/core/http/error';

/**
 * =====================================================
 * ROW TYPES
 * =====================================================
 */

type QueueRow = RowDataPacket & {
	id: number;
	tanggal: string | Date;
	nomor_antrian: number;
	counter_id: number;
	admin_id: number;
	shift_id: number;
	status: QueueStatus;
	waktu_ambil: string | Date;
	waktu_panggil: string | Date | null;
	waktu_selesai: string | Date | null;
};

type QueueJoinRow = QueueRow & {
	nama_loket: string;
	nama_admin: string;
	nama_shift: string;
};

type QueueCountRow = RowDataPacket & {
	total: number;
	menunggu: number;
	dipanggil: number;
	selesai: number;
	batal: number;
};

/**
 * =====================================================
 * RESULT TYPES
 * =====================================================
 */

export type QueueCountResult = {
	total: number;
	menunggu: number;
	dipanggil: number;
	selesai: number;
	batal: number;
};

export type QueueGroupedStat = QueueCountResult & {
	key: number;
	label: string;
};

/**
 * =====================================================
 * REPOSITORY
 * =====================================================
 */

export class QueueRepository {
	// =====================================================
	// BASE SELECT
	// =====================================================

	private static baseSelect = `
		SELECT
			q.id,
			q.tanggal,
			q.nomor_antrian,
			q.counter_id,
			c.nama_loket,
			q.admin_id,
			u.nama AS nama_admin,
			q.shift_id,
			s.nama_shift,
			q.status,
			q.waktu_ambil,
			q.waktu_panggil,
			q.waktu_selesai
		FROM queues q
		LEFT JOIN counters c ON c.id = q.counter_id
		LEFT JOIN users u ON u.id = q.admin_id
		LEFT JOIN shifts s ON s.id = q.shift_id
	`;

	// =====================================================
	// FIND
	// =====================================================

	static async findById(id: number): Promise<QueueEntity | null> {
		const [rows] = await pool.query<QueueJoinRow[]>(`${this.baseSelect} WHERE q.id = ? LIMIT 1`, [
			id,
		]);

		return rows.length ? this.mapJoinRow(rows[0]) : null;
	}

	static async findAll(): Promise<QueueEntity[]> {
		const [rows] = await pool.query<QueueJoinRow[]>(
			`${this.baseSelect} ORDER BY q.tanggal DESC, q.nomor_antrian ASC`,
		);

		return rows.map(this.mapJoinRow);
	}

	static async findByRole(role: 'admin' | 'superadmin', adminId?: number) {
		if (role === 'admin' && !adminId) {
			throw new Error('adminId is required');
		}

		const where =
			role === 'admin'
				? `
				WHERE q.counter_id IN (
					SELECT counter_id
					FROM weekly_shift_templates
					WHERE admin_id = ?
				)
			`
				: '';

		const [rows] = await pool.query<QueueJoinRow[]>(
			`${this.baseSelect} ${where}
				ORDER BY q.tanggal DESC, q.waktu_ambil ASC`,
			role === 'admin' ? [adminId] : [],
		);

		return rows.map((row) => this.mapJoinRow(row));
	}

	// =====================================================
	// COUNT CORE
	// =====================================================

	private static async countBase(whereSql = '', params: unknown[] = []): Promise<QueueCountResult> {
		const [rows] = await pool.query<QueueCountRow[]>(
			`
			SELECT
				COUNT(*) AS total,
				SUM(status = ?) AS menunggu,
				SUM(status = ?) AS dipanggil,
				SUM(status = ?) AS selesai,
				SUM(status = ?) AS batal
			FROM queues
			${whereSql}
			`,
			[
				QueueStatus.MENUNGGU,
				QueueStatus.DIPANGGIL,
				QueueStatus.SELESAI,
				QueueStatus.BATAL,
				...params,
			],
		);

		const r = rows[0];
		return {
			total: Number(r.total) || 0,
			menunggu: Number(r.menunggu) || 0,
			dipanggil: Number(r.dipanggil) || 0,
			selesai: Number(r.selesai) || 0,
			batal: Number(r.batal) || 0,
		};
	}

	// =====================================================
	// STATISTIC
	// =====================================================

	static countByRole(role: 'admin' | 'superadmin', adminId?: number) {
		if (role === 'admin') {
			return this.countBase(
				`
				WHERE counter_id IN (
					SELECT counter_id
					FROM weekly_shift_templates
					WHERE admin_id = ?
				)
				`,
				[adminId],
			);
		}
		return this.countBase();
	}

	// =====================================================
	// INSERT / UPDATE / DELETE
	// =====================================================

	private static async ensureCounterIsActive(counterId: number) {
		const [rows] = await pool.query<RowDataPacket[]>(
			`SELECT status FROM counters WHERE id = ? LIMIT 1`,
			[counterId],
		);

		if (!rows.length) throw new HttpError(404, 'Loket tidak ditemukan');
		if (rows[0].status !== 'aktif')
			throw new HttpError(403, 'Loket nonaktif, silakan hubungi admin');
	}

	static async create(data: Omit<QueueEntity, 'id'>): Promise<QueueEntity> {
		await this.ensureCounterIsActive(data.counter_id);

		const [res] = await pool.execute<ResultSetHeader>(
			`
			INSERT INTO queues (
				tanggal, nomor_antrian, counter_id,
				admin_id, shift_id, status,
				waktu_ambil, waktu_panggil, waktu_selesai
			)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			[
				data.tanggal,
				data.nomor_antrian,
				data.counter_id,
				data.admin_id,
				data.shift_id,
				data.status,
				data.waktu_ambil,
				data.waktu_panggil,
				data.waktu_selesai,
			],
		);

		return (await this.findById(res.insertId))!;
	}

	static async updateById(id: number, data: Partial<Omit<QueueEntity, 'id'>>) {
		const keys = Object.keys(data);
		if (!keys.length) return;

		const fields = keys.map((k) => `${k} = ?`).join(', ');
		const values = Object.values(data);

		await pool.execute(`UPDATE queues SET ${fields} WHERE id = ?`, [...values, id]);
	}

	static async hardDelete(id: number) {
		await pool.execute(`DELETE FROM queues WHERE id = ?`, [id]);
	}

	static async getNextQueueNumberToday(
		tanggal: Date,
		counter_id: number,
		shift_id: number,
	): Promise<number> {
		const [rows] = await pool.query<RowDataPacket[]>(
			`
			SELECT COALESCE(MAX(nomor_antrian), 0) AS last
			FROM queues
			WHERE DATE(tanggal) = DATE(?)
			AND counter_id = ?
			AND shift_id = ?
			`,
			[tanggal, counter_id, shift_id],
		);

		return rows[0].last + 1;
	}

	// =====================================================
	// MAPPER
	// =====================================================

	private static mapRow(row: QueueRow): QueueEntity {
		return {
			id: row.id,
			tanggal: new Date(row.tanggal),
			nomor_antrian: row.nomor_antrian,
			counter_id: row.counter_id,
			admin_id: row.admin_id,
			shift_id: row.shift_id,
			status: row.status,
			waktu_ambil: new Date(row.waktu_ambil),
			waktu_panggil: row.waktu_panggil ? new Date(row.waktu_panggil) : null,
			waktu_selesai: row.waktu_selesai ? new Date(row.waktu_selesai) : null,
		};
	}

	private static mapJoinRow(row: QueueJoinRow): QueueEntity {
		return {
			...this.mapRow(row),
			nama_loket: row.nama_loket,
			nama_admin: row.nama_admin,
			nama_shift: row.nama_shift,
		};
	}
}
