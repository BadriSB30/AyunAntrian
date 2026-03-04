// src/modules/user/user.repository.ts

import { pool } from '@/core/database/postgres';
import { UserEntity } from './user.entity';
import { Role, UserStatus } from '@/types/enums';

/**
 * Representasi row DB (RAW)
 * PostgreSQL mengembalikan TIMESTAMPTZ sebagai objek Date
 */
type UserRow = {
	id: number;
	nama: string;
	username: string;
	email: string;
	password: string;
	role: Role;
	status: UserStatus;
	created_at: Date;
};

const SELECT_FIELDS = `
  id, nama, username, email, password, role, status, created_at
`;

export class UserRepository {
	// =====================================================
	// SELECT
	// =====================================================

	static async findById(id: number): Promise<UserEntity | null> {
		const { rows } = await pool.query<UserRow>(
			`
      SELECT ${SELECT_FIELDS}
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByUsername(username: string): Promise<UserEntity | null> {
		const { rows } = await pool.query<UserRow>(
			`
      SELECT ${SELECT_FIELDS}
      FROM users
      WHERE username = $1
      LIMIT 1
      `,
			[username],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByEmailUsername(
		email: string | null,
		username: string | null,
	): Promise<UserEntity | null> {
		const { rows } = await pool.query<UserRow>(
			`
      SELECT ${SELECT_FIELDS}
      FROM users
      WHERE email = $1 OR username = $2
      LIMIT 1
      `,
			[email, username],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<UserEntity[]> {
		const { rows } = await pool.query<UserRow>(
			`
      SELECT ${SELECT_FIELDS}
      FROM users
      ORDER BY created_at DESC
      `,
		);

		return rows.map((row) => this.mapRow(row));
	}

	// =====================================================
	// INSERT
	// =====================================================

	static async create(data: Omit<UserEntity, 'id' | 'created_at'>): Promise<UserEntity> {
		const { rows } = await pool.query<UserRow>(
			`
      INSERT INTO users (nama, username, email, password, role, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${SELECT_FIELDS}
      `,
			[data.nama, data.username, data.email, data.password, data.role, data.status],
		);

		if (!rows.length) throw new Error('Failed to create user');

		return this.mapRow(rows[0]);
	}

	// =====================================================
	// UPDATE (SAFE)
	// =====================================================

	static async updateById(
		id: number,
		data: Partial<Omit<UserEntity, 'id' | 'created_at'>>,
	): Promise<void> {
		const allowedFields: (keyof Omit<UserEntity, 'id' | 'created_at'>)[] = [
			'nama',
			'username',
			'email',
			'password',
			'role',
			'status',
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
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      `,
			[...values, id],
		);
	}

	static async updateStatus(id: number, status: UserStatus): Promise<void> {
		await pool.query(`UPDATE users SET status = $1 WHERE id = $2`, [status, id]);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async hardDelete(id: number): Promise<void> {
		await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
	}

	// =====================================================
	// INTERNAL MAPPER
	// =====================================================

	private static mapRow(row: UserRow): UserEntity {
		return {
			id: row.id,
			nama: row.nama,
			username: row.username,
			email: row.email,
			password: row.password,
			role: row.role,
			status: row.status,
			created_at: new Date(row.created_at),
		};
	}
}
