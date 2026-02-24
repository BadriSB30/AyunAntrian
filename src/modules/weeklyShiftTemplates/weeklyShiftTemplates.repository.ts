import { pool } from '@/core/database/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { WeeklyShiftTemplateEntity } from './weeklyShiftTemplates.entity';
import type { Hari } from '@/types/enums';

/**
 * Row hasil JOIN
 */
type WeeklyShiftTemplateRow = RowDataPacket & {
	id: number;
	hari: Hari;

	counter_id: number;
	admin_id: number;
	shift_id: number;

	kode_loket: string;
	nama_loket: string;

	admin_nama: string;

	nama_shift: string;
	jam_mulai: string;
	jam_selesai: string;
};

export class WeeklyShiftTemplateRepository {
	// =====================================================
	// SELECT ALL
	// =====================================================
	static async findAll(): Promise<WeeklyShiftTemplateEntity[]> {
		const [rows] = await pool.query<WeeklyShiftTemplateRow[]>(`
			SELECT
				wst.id,
				wst.hari,
				wst.counter_id,
				wst.admin_id,
				wst.shift_id,

				c.kode_loket,
				c.nama_loket,

				u.nama AS admin_nama,

				s.nama_shift,
				s.jam_mulai,
				s.jam_selesai
			FROM weekly_shift_templates wst
			JOIN counters c ON c.id = wst.counter_id
			JOIN users u ON u.id = wst.admin_id
			JOIN shifts s ON s.id = wst.shift_id
			ORDER BY wst.id DESC
		`);

		return rows.map(this.mapRow);
	}

	// =====================================================
	// SELECT BY ID
	// =====================================================
	static async findById(id: number): Promise<WeeklyShiftTemplateEntity | null> {
		const [rows] = await pool.query<WeeklyShiftTemplateRow[]>(
			`
			SELECT
				wst.id,
				wst.hari,
				wst.counter_id,
				wst.admin_id,
				wst.shift_id,

				c.kode_loket,
				c.nama_loket,

				u.nama AS admin_nama,

				s.nama_shift,
				s.jam_mulai,
				s.jam_selesai
			FROM weekly_shift_templates wst
			JOIN counters c ON c.id = wst.counter_id
			JOIN users u ON u.id = wst.admin_id
			JOIN shifts s ON s.id = wst.shift_id
			WHERE wst.id = ?
			LIMIT 1
			`,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}
	// =====================================================
	// SELECT AKTIF HARI INI + SHIFT BERJALAN (TERMASUK SHIFT MALAM)
	// =====================================================
	static async findActiveToday(): Promise<WeeklyShiftTemplateEntity[]> {
		const [rows] = await pool.query<WeeklyShiftTemplateRow[]>(`
		SELECT
		wst.id,
		wst.hari,
		wst.counter_id,
		wst.admin_id,
		wst.shift_id,

		c.kode_loket,
		c.nama_loket,

		u.nama AS admin_nama,

		s.nama_shift,
		s.jam_mulai,
		s.jam_selesai
		FROM weekly_shift_templates wst
		INNER JOIN counters c 
		ON c.id = wst.counter_id AND c.status = 'aktif'
		INNER JOIN users u 
		ON u.id = wst.admin_id AND u.status = 'aktif'
		INNER JOIN shifts s 
		ON s.id = wst.shift_id
		WHERE 
		(
			-- Shift normal / siang / pagi hari ini
			(wst.hari = (
			CASE WEEKDAY(CURDATE())
				WHEN 0 THEN 'senin'
				WHEN 1 THEN 'selasa'
				WHEN 2 THEN 'rabu'
				WHEN 3 THEN 'kamis'
				WHEN 4 THEN 'jumat'
				WHEN 5 THEN 'sabtu'
				WHEN 6 THEN 'minggu'
			END
			) AND 
			(
				(s.jam_mulai <= s.jam_selesai AND CURRENT_TIME() BETWEEN s.jam_mulai AND s.jam_selesai)
				OR
				(s.jam_mulai > s.jam_selesai AND CURRENT_TIME() >= s.jam_mulai)
			)
			)
			OR
			-- Shift malam dari hari sebelumnya
			(
			wst.hari = (
				CASE WEEKDAY(DATE_SUB(CURDATE(), INTERVAL 1 DAY))
				WHEN 0 THEN 'senin'
				WHEN 1 THEN 'selasa'
				WHEN 2 THEN 'rabu'
				WHEN 3 THEN 'kamis'
				WHEN 4 THEN 'jumat'
				WHEN 5 THEN 'sabtu'
				WHEN 6 THEN 'minggu'
				END
			)
			AND s.jam_mulai > s.jam_selesai
			AND CURRENT_TIME() <= s.jam_selesai
			)
		)
		ORDER BY c.nama_loket
	`);
		return rows.map(this.mapRow);
	}

	// =====================================================
	// SELECT BY TEMPLATE KEY
	// =====================================================
	static async findByTemplateKey(
		hari: Hari,
		counter_id: number,
		shift_id: number,
	): Promise<WeeklyShiftTemplateEntity[]> {
		const [rows] = await pool.query<WeeklyShiftTemplateRow[]>(
			`
			SELECT
				wst.id,
				wst.hari,
				wst.counter_id,
				wst.admin_id,
				wst.shift_id,

				c.kode_loket,
				c.nama_loket,

				u.nama AS admin_nama,

				s.nama_shift,
				s.jam_mulai,
				s.jam_selesai
			FROM weekly_shift_templates wst
			JOIN counters c ON c.id = wst.counter_id
			JOIN users u ON u.id = wst.admin_id
			JOIN shifts s ON s.id = wst.shift_id
			WHERE
				wst.hari = ?
				AND wst.counter_id = ?
				AND wst.shift_id = ?
			`,
			[hari, counter_id, shift_id],
		);

		return rows.map(this.mapRow);
	}

	// =====================================================
	// INSERT (CREATE)
	// =====================================================
	static async create(params: {
		hari: Hari;
		counter_id: number;
		admin_id: number;
		shift_id: number;
	}): Promise<WeeklyShiftTemplateEntity> {
		const { hari, counter_id, admin_id, shift_id } = params;

		const [result] = await pool.execute<ResultSetHeader>(
			`
			INSERT INTO weekly_shift_templates
				(hari, counter_id, admin_id, shift_id)
			VALUES (?, ?, ?, ?)
			`,
			[hari, counter_id, admin_id, shift_id],
		);

		const created = await this.findById(result.insertId);
		if (!created) {
			throw new Error('Failed to create weekly shift template');
		}

		return created;
	}

	// =====================================================
	// UPDATE BY ID
	// =====================================================
	static async updateById(
		id: number,
		params: {
			hari: Hari;
			counter_id: number;
			admin_id: number;
			shift_id: number;
		},
	): Promise<WeeklyShiftTemplateEntity> {
		const { hari, counter_id, admin_id, shift_id } = params;

		await pool.execute(
			`
			UPDATE weekly_shift_templates
			SET
				hari = ?,
				counter_id = ?,
				admin_id = ?,
				shift_id = ?
			WHERE id = ?
			`,
			[hari, counter_id, admin_id, shift_id, id],
		);

		const updated = await this.findById(id);
		if (!updated) {
			throw new Error('Failed to update weekly shift template');
		}

		return updated;
	}

	// =====================================================
	// DELETE
	// =====================================================
	static async hardDelete(id: number): Promise<void> {
		await pool.execute(`DELETE FROM weekly_shift_templates WHERE id = ?`, [id]);
	}

	// =====================================================
	// MAPPER
	// =====================================================
	private static mapRow(row: WeeklyShiftTemplateRow): WeeklyShiftTemplateEntity {
		return {
			id: row.id,
			hari: row.hari,

			counter_id: row.counter_id,
			admin_id: row.admin_id,
			shift_id: row.shift_id,

			counter: {
				id: row.counter_id,
				kode_loket: row.kode_loket,
				nama_loket: row.nama_loket,
			},

			admin: {
				id: row.admin_id,
				nama: row.admin_nama,
			},

			shift: {
				id: row.shift_id,
				nama_shift: row.nama_shift,
				jam_mulai: row.jam_mulai,
				jam_selesai: row.jam_selesai,
			},
		};
	}
}
