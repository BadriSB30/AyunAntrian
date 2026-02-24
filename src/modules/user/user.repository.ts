import { pool } from '@/core/database/mysql';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { UserEntity } from './user.entity';
import { Role, UserStatus } from '@/types/enums';

/**
 * Representasi row DB (RAW)
 * → tetap string karena berasal dari MySQL
 */
type UserRow = RowDataPacket & {
	id: number;
	nama: string;
	username: string;
	email: string;
	password: string;
	role: Role;
	status: UserStatus;
	created_at: string | Date;
};

export class UserRepository {
	// =====================================================
	// SELECT
	// =====================================================

	static async findById(id: number): Promise<UserEntity | null> {
		const [rows] = await pool.query<UserRow[]>(
			`
			SELECT
				id,
				nama,
				username,
				email,
				password,
				role,
				status,
				created_at
			FROM users
			WHERE id = ?
			LIMIT 1
			`,
			[id],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findByUsername(username: string): Promise<UserEntity | null> {
		const [rows] = await pool.query<UserRow[]>(
			`
			SELECT
				id,
				nama,
				username,
				email,
				password,
				role,
				status,
				created_at
			FROM users
			WHERE username = ?
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
		const [rows] = await pool.query<UserRow[]>(
			`
			SELECT
				id,
				nama,
				username,
				email,
				password,
				role,
				status,
				created_at
			FROM users
			WHERE email = ? OR username = ?
			LIMIT 1
			`,
			[email, username],
		);

		return rows.length ? this.mapRow(rows[0]) : null;
	}

	static async findAll(): Promise<UserEntity[]> {
		const [rows] = await pool.query<UserRow[]>(
			`
			SELECT
				id,
				nama,
				username,
				email,
				password,
				role,
				status,
				created_at
			FROM users
			ORDER BY created_at DESC
			`,
		);

		return rows.map(this.mapRow);
	}

	// =====================================================
	// INSERT
	// =====================================================

	static async create(data: Omit<UserEntity, 'id' | 'created_at'>): Promise<UserEntity> {
		const [result] = await pool.execute<ResultSetHeader>(
			`
			INSERT INTO users (nama, username, email, password, role, status)
			VALUES (?, ?, ?, ?, ?, ?)
			`,
			[data.nama, data.username, data.email, data.password, data.role, data.status],
		);

		const created = await this.findById(result.insertId);
		if (!created) {
			throw new Error('Failed to create user');
		}

		return created;
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

		for (const key of allowedFields) {
			if (data[key] !== undefined) {
				fields.push(`${key} = ?`);
				values.push(data[key]);
			}
		}

		if (!fields.length) return;

		await pool.execute(
			`
			UPDATE users
			SET ${fields.join(', ')}
			WHERE id = ?
			`,
			[...values, id],
		);
	}

	static async updateStatus(id: number, status: UserStatus): Promise<void> {
		await pool.execute(`UPDATE users SET status = ? WHERE id = ?`, [status, id]);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async hardDelete(id: number): Promise<void> {
		await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
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
