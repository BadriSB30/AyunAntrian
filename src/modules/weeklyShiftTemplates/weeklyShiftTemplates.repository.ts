// src/modules/weeklyShiftTemplate/weeklyShiftTemplate.repository.ts

import { pool } from '@/core/database/postgres';
import type { WeeklyShiftTemplateEntity } from './weeklyShiftTemplates.entity';
import type { Hari } from '@/types/enums';

/**
 * Row hasil JOIN
 */
type WeeklyShiftTemplateRow = {
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

// =====================================================
// BASE SELECT (reusable)
// =====================================================
const BASE_SELECT = `
  SELECT
    wst.id,
    wst.hari,
    wst.counter_id,
    wst.admin_id,
    wst.shift_id,
    c.kode_loket,
    c.nama_loket,
    u.nama  AS admin_nama,
    s.nama_shift,
    s.jam_mulai,
    s.jam_selesai
  FROM weekly_shift_templates wst
  JOIN counters c ON c.id = wst.counter_id
  JOIN users    u ON u.id = wst.admin_id
  JOIN shifts   s ON s.id = wst.shift_id
`;

/**
 * Konversi angka DOW PostgreSQL ke nilai enum hari_type (Bahasa Indonesia).
 *
 * EXTRACT(DOW FROM date) → 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
 *
 * Menggunakan wst.hari::text untuk perbandingan string agar
 * tidak terjadi error cast enum saat membandingkan dengan CASE result.
 */
const dowToHari = (dateExpr: string): string => `
  CASE EXTRACT(DOW FROM ${dateExpr})::int
    WHEN 1 THEN 'senin'
    WHEN 2 THEN 'selasa'
    WHEN 3 THEN 'rabu'
    WHEN 4 THEN 'kamis'
    WHEN 5 THEN 'jumat'
    WHEN 6 THEN 'sabtu'
    WHEN 0 THEN 'minggu'
  END
`;

export class WeeklyShiftTemplateRepository {
	// =====================================================
	// SELECT ALL
	// =====================================================
	static async findAll(): Promise<WeeklyShiftTemplateEntity[]> {
		const { rows } = await pool.query<WeeklyShiftTemplateRow>(
			`${BASE_SELECT} ORDER BY wst.id DESC`,
		);

		return rows.map(this.mapRow);
	}

	// =====================================================
	// SELECT BY ID
	// =====================================================
	static async findById(id: number): Promise<WeeklyShiftTemplateEntity | null> {
		const { rows } = await pool.query<WeeklyShiftTemplateRow>(
			`${BASE_SELECT} WHERE wst.id = $1 LIMIT 1`,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	// =====================================================
	// SELECT AKTIF HARI INI + SHIFT BERJALAN (TERMASUK SHIFT MALAM)
	// =====================================================
	static async findActiveToday(): Promise<WeeklyShiftTemplateEntity[]> {
		const { rows } = await pool.query<WeeklyShiftTemplateRow>(`
      SELECT
        wst.id,
        wst.hari,
        wst.counter_id,
        wst.admin_id,
        wst.shift_id,
        c.kode_loket,
        c.nama_loket,
        u.nama  AS admin_nama,
        s.nama_shift,
        s.jam_mulai,
        s.jam_selesai
      FROM weekly_shift_templates wst
      INNER JOIN counters c
        ON c.id = wst.counter_id AND c.status = 'aktif'
      INNER JOIN users u
        ON u.id = wst.admin_id  AND u.status = 'aktif'
      INNER JOIN shifts s
        ON s.id = wst.shift_id
      WHERE
        (
          -- Shift normal / siang / pagi: hari ini
          wst.hari::text = ${dowToHari('CURRENT_DATE')}
          AND (
            (
              -- Shift tidak melewati tengah malam
              s.jam_mulai <= s.jam_selesai
              AND CURRENT_TIME BETWEEN s.jam_mulai AND s.jam_selesai
            )
            OR
            (
              -- Shift melewati tengah malam, porsi malam hari ini
              s.jam_mulai > s.jam_selesai
              AND CURRENT_TIME >= s.jam_mulai
            )
          )
        )
        OR
        (
          -- Shift malam dari hari sebelumnya yang belum selesai
          wst.hari::text = ${dowToHari("CURRENT_DATE - INTERVAL '1 day'")}
          AND s.jam_mulai > s.jam_selesai
          AND CURRENT_TIME <= s.jam_selesai
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
		const { rows } = await pool.query<WeeklyShiftTemplateRow>(
			`
      ${BASE_SELECT}
      WHERE
        wst.hari       = $1
        AND wst.counter_id = $2
        AND wst.shift_id   = $3
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

		const { rows } = await pool.query<{ id: number }>(
			`
      INSERT INTO weekly_shift_templates (hari, counter_id, admin_id, shift_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
			[hari, counter_id, admin_id, shift_id],
		);

		const created = await this.findById(rows[0].id);
		if (!created) throw new Error('Failed to create weekly shift template');

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

		await pool.query(
			`
      UPDATE weekly_shift_templates
      SET
        hari       = $1,
        counter_id = $2,
        admin_id   = $3,
        shift_id   = $4
      WHERE id = $5
      `,
			[hari, counter_id, admin_id, shift_id, id],
		);

		const updated = await this.findById(id);
		if (!updated) throw new Error('Failed to update weekly shift template');

		return updated;
	}

	// =====================================================
	// DELETE
	// =====================================================
	static async hardDelete(id: number): Promise<void> {
		await pool.query(`DELETE FROM weekly_shift_templates WHERE id = $1`, [id]);
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
