import { pool } from './mysql';

export async function withTransaction<T>(fn: (conn: unknown) => Promise<T>) {
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		const res = await fn(conn);
		await conn.commit();
		return res;
	} catch (e) {
		await conn.rollback();
		throw e;
	} finally {
		conn.release();
	}
}
