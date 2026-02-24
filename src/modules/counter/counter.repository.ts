// src/modules/counter/counter.repository.ts

import { pool } from '@/core/database/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { CounterEntity } from './counter.entity';
import { CounterStatus } from '@/types/enums';

/**
 * Representasi row DB
 */
type CounterRow = RowDataPacket & {
	id: number;
	kode_loket: string;
	nama_loket: string;
	status: CounterStatus;
	created_at: Date | string;
};

export class CounterRepository {
	// =====================================================
	// SELECT
	// =====================================================

	static async findById(id: number): Promise<CounterEntity | null> {
		const [rows] = await pool.query<CounterRow[]>(
			`
			SELECT id, kode_loket, nama_loket, status, created_at
			FROM counters
			WHERE id = ?
			LIMIT 1
			`,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	/**
	 * Cek apakah kode_loket ATAU nama_loket sudah digunakan
	 */
	static async findByKodeOrNama(
		kode_loket?: string,
		nama_loket?: string,
	): Promise<CounterEntity | null> {
		if (!kode_loket && !nama_loket) return null;

		const conditions: string[] = [];
		const values: unknown[] = [];

		if (kode_loket) {
			conditions.push('kode_loket = ?');
			values.push(kode_loket);
		}

		if (nama_loket) {
			conditions.push('nama_loket = ?');
			values.push(nama_loket);
		}

		const [rows] = await pool.query<CounterRow[]>(
			`
			SELECT id, kode_loket, nama_loket, status, created_at
			FROM counters
			WHERE ${conditions.join(' OR ')}
			LIMIT 1
			`,
			values,
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<CounterEntity[]> {
		const [rows] = await pool.query<CounterRow[]>(
			`
			SELECT id, kode_loket, nama_loket, status, created_at
			FROM counters
			ORDER BY created_at DESC
			`,
		);

		return rows.map(this.mapRow);
	}

	// =====================================================
	// INSERT
	// =====================================================

	static async create(data: Omit<CounterEntity, 'id' | 'created_at'>): Promise<CounterEntity> {
		const [result] = await pool.execute<ResultSetHeader>(
			`
			INSERT INTO counters (kode_loket, nama_loket, status)
			VALUES (?, ?, ?)
			`,
			[data.kode_loket, data.nama_loket, data.status],
		);

		const created = await this.findById(result.insertId);
		if (!created) {
			throw new Error('Failed to create counter');
		}

		return created;
	}

	// =====================================================
	// UPDATE
	// =====================================================

	static async updateById(
		id: number,
		data: Partial<Omit<CounterEntity, 'id' | 'created_at'>>,
	): Promise<void> {
		const fields: string[] = [];
		const values: unknown[] = [];

		if (data.kode_loket !== undefined) {
			fields.push('kode_loket = ?');
			values.push(data.kode_loket);
		}

		if (data.nama_loket !== undefined) {
			fields.push('nama_loket = ?');
			values.push(data.nama_loket);
		}

		if (data.status !== undefined) {
			fields.push('status = ?');
			values.push(data.status);
		}

		if (!fields.length) return;

		await pool.execute(
			`
			UPDATE counters
			SET ${fields.join(', ')}
			WHERE id = ?
			`,
			[...values, id],
		);
	}

	static async updateStatus(id: number, status: CounterStatus): Promise<void> {
		await pool.execute(`UPDATE counters SET status = ? WHERE id = ?`, [status, id]);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async hardDelete(id: number): Promise<void> {
		await pool.execute(`DELETE FROM counters WHERE id = ?`, [id]);
	}

	// =====================================================
	// INTERNAL MAPPER
	// =====================================================

	private static mapRow(row: CounterRow): CounterEntity {
		return {
			id: row.id,
			kode_loket: row.kode_loket,
			nama_loket: row.nama_loket,
			status: row.status,
			created_at: new Date(row.created_at),
		};
	}
}
