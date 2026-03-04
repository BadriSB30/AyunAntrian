// src/modules/shift/shift.repository.ts

import { pool } from '@/core/database/postgres';
import { ShiftEntity } from './shift.entity';

/**
 * PostgreSQL mengembalikan kolom TIME sebagai string "HH:mm:ss"
 */
type ShiftRow = {
	id: number;
	nama_shift: string;
	jam_mulai: string;
	jam_selesai: string;
};

export class ShiftRepository {
	// =====================================================
	// SELECT
	// =====================================================

	static async findById(id: number): Promise<ShiftEntity | null> {
		const { rows } = await pool.query<ShiftRow>(
			`
      SELECT id, nama_shift, jam_mulai, jam_selesai
      FROM shifts
      WHERE id = $1
      LIMIT 1
      `,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByNamaShift(nama_shift: string): Promise<ShiftEntity | null> {
		const { rows } = await pool.query<ShiftRow>(
			`
      SELECT id, nama_shift, jam_mulai, jam_selesai
      FROM shifts
      WHERE nama_shift = $1
      LIMIT 1
      `,
			[nama_shift],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<ShiftEntity[]> {
		const { rows } = await pool.query<ShiftRow>(
			`
      SELECT id, nama_shift, jam_mulai, jam_selesai
      FROM shifts
      ORDER BY id DESC
      `,
		);

		return rows.map((row) => this.mapRow(row));
	}

	// =====================================================
	// INSERT
	// =====================================================

	static async create(data: Omit<ShiftEntity, 'id'>): Promise<ShiftEntity> {
		const { rows } = await pool.query<ShiftRow>(
			`
      INSERT INTO shifts (nama_shift, jam_mulai, jam_selesai)
      VALUES ($1, $2, $3)
      RETURNING id, nama_shift, jam_mulai, jam_selesai
      `,
			[data.nama_shift, data.jam_mulai, data.jam_selesai],
		);

		if (!rows.length) throw new Error('Failed to create shift');

		return this.mapRow(rows[0]);
	}

	// =====================================================
	// UPDATE (SAFE)
	// =====================================================

	static async updateById(id: number, data: Partial<Omit<ShiftEntity, 'id'>>): Promise<void> {
		const allowedFields: (keyof Omit<ShiftEntity, 'id'>)[] = [
			'nama_shift',
			'jam_mulai',
			'jam_selesai',
		];

		const fields: string[] = [];
		const values: unknown[] = [];
		let paramIndex = 1;

		for (const key of allowedFields) {
			if (data[key] !== undefined) {
				fields.push(`${key} = $${paramIndex++}`);
				values.push(data[key]);
			}
		}

		if (!fields.length) return;

		await pool.query(
			`
      UPDATE shifts
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      `,
			[...values, id],
		);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async hardDelete(id: number): Promise<void> {
		await pool.query(`DELETE FROM shifts WHERE id = $1`, [id]);
	}

	// =====================================================
	// INTERNAL MAPPER
	// =====================================================

	/**
	 * PostgreSQL mengembalikan kolom TIME langsung sebagai string "HH:mm:ss",
	 * tidak perlu konversi tambahan seperti di MySQL.
	 */
	private static mapRow(row: ShiftRow): ShiftEntity {
		return {
			id: row.id,
			nama_shift: row.nama_shift,
			jam_mulai: row.jam_mulai,
			jam_selesai: row.jam_selesai,
		};
	}
}
