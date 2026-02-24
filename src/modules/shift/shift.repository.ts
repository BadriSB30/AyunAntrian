import { pool } from '@/core/database/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { ShiftEntity } from './shift.entity';

type ShiftRow = RowDataPacket & {
	id: number;
	nama_shift: string;
	jam_mulai: Date | string;
	jam_selesai: Date | string;
};

export class ShiftRepository {
	// =====================================================
	// SELECT
	// =====================================================

	static async findById(id: number): Promise<ShiftEntity | null> {
		const [rows] = await pool.query<ShiftRow[]>(
			`
			SELECT
				id,
				nama_shift,
				jam_mulai,
				jam_selesai
			FROM shifts
			WHERE id = ?
			LIMIT 1
			`,
			[id]
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByNamaShift(nama_shift: string): Promise<ShiftEntity | null> {
		const [rows] = await pool.query<ShiftRow[]>(
			`
			SELECT
				id,
				nama_shift,
				jam_mulai,
				jam_selesai
			FROM shifts
			WHERE nama_shift = ?
			LIMIT 1
			`,
			[nama_shift]
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<ShiftEntity[]> {
		const [rows] = await pool.query<ShiftRow[]>(
			`
			SELECT
				id,
				nama_shift,
				jam_mulai,
				jam_selesai
			FROM shifts
			ORDER BY id DESC
			`
		);

		return rows.map((row) => this.mapRow(row));
	}

	// =====================================================
	// INSERT
	// =====================================================

	static async create(data: Omit<ShiftEntity, 'id'>): Promise<ShiftEntity> {
		const [result] = await pool.execute<ResultSetHeader>(
			`
			INSERT INTO shifts (nama_shift, jam_mulai, jam_selesai)
			VALUES (?, ?, ?)
			`,
			[data.nama_shift, data.jam_mulai, data.jam_selesai]
		);

		const created = await this.findById(result.insertId);
		if (!created) {
			throw new Error('Failed to create shift');
		}

		return created;
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

		for (const key of allowedFields) {
			if (data[key] !== undefined) {
				fields.push(`${key} = ?`);
				values.push(data[key]);
			}
		}

		if (!fields.length) return;

		await pool.execute(
			`
			UPDATE shifts
			SET ${fields.join(', ')}
			WHERE id = ?
			`,
			[...values, id]
		);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async hardDelete(id: number): Promise<void> {
		await pool.execute(`DELETE FROM shifts WHERE id = ?`, [id]);
	}

	// =====================================================
	// INTERNAL MAPPER
	// =====================================================

	private static formatTime(value: Date | string): string {
		if (typeof value === 'string') return value;
		return value.toTimeString().slice(0, 8); // HH:mm:ss
	}

	private static mapRow(row: ShiftRow): ShiftEntity {
		return {
			id: row.id,
			nama_shift: row.nama_shift,
			jam_mulai: this.formatTime(row.jam_mulai),
			jam_selesai: this.formatTime(row.jam_selesai),
		};
	}
}
