//src/modules/shift/shift.repository.ts

import { pool } from '@/core/database/postgres';
import { ShiftEntity } from './shift.entity';

type ShiftRow = {
	id: number;
	nama_shift: string;
	kode_shift: string;
	jam_mulai: string;
	jam_selesai: string;
};

export class ShiftRepository {
	// =====================================================
	// SELECT
	// =====================================================
	static async findById(id: number): Promise<ShiftEntity | null> {
		const { rows } = await pool.query<ShiftRow>(
			`SELECT id, nama_shift, kode_shift, jam_mulai, jam_selesai
       FROM shifts WHERE id = $1 LIMIT 1`,
			[id],
		);
		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByNamaShift(nama_shift: string): Promise<ShiftEntity | null> {
		const { rows } = await pool.query<ShiftRow>(
			`SELECT id, nama_shift, kode_shift, jam_mulai, jam_selesai
       FROM shifts WHERE nama_shift = $1 LIMIT 1`,
			[nama_shift],
		);
		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<ShiftEntity[]> {
		const { rows } = await pool.query<ShiftRow>(
			`SELECT id, nama_shift, kode_shift, jam_mulai, jam_selesai
       FROM shifts ORDER BY kode_shift ASC`,
		);
		return rows.map((row) => this.mapRow(row));
	}

	// =====================================================
	// GET ALL EXISTING KODE_SHIFT
	// =====================================================
	static async findAllKodeShift(): Promise<string[]> {
		const { rows } = await pool.query<{ kode_shift: string }>(
			`SELECT kode_shift FROM shifts ORDER BY kode_shift ASC`,
		);
		return rows.map((r) => r.kode_shift);
	}

	// =====================================================
	// INSERT
	// =====================================================
	static async create(data: Omit<ShiftEntity, 'id'>): Promise<ShiftEntity> {
		const { rows } = await pool.query<ShiftRow>(
			`INSERT INTO shifts (nama_shift, kode_shift, jam_mulai, jam_selesai)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nama_shift, kode_shift, jam_mulai, jam_selesai`,
			[data.nama_shift, data.kode_shift, data.jam_mulai, data.jam_selesai],
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
			'kode_shift',
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

		await pool.query(`UPDATE shifts SET ${fields.join(', ')} WHERE id = $${paramIndex}`, [
			...values,
			id,
		]);
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
	private static mapRow(row: ShiftRow): ShiftEntity {
		return {
			id: row.id,
			nama_shift: row.nama_shift,
			kode_shift: row.kode_shift,
			jam_mulai: row.jam_mulai,
			jam_selesai: row.jam_selesai,
		};
	}
}
