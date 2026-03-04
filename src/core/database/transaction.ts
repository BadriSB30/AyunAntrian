// src/core/database/transaction.ts

import { PoolClient } from 'pg';
import { pool } from './postgres';

export async function withTransaction<T>(fn: (conn: PoolClient) => Promise<T>): Promise<T> {
	const conn = await pool.connect();
	try {
		await conn.query('BEGIN');
		const result = await fn(conn);
		await conn.query('COMMIT');
		return result;
	} catch (e) {
		await conn.query('ROLLBACK');
		throw e;
	} finally {
		conn.release();
	}
}
