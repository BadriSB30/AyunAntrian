// src/core/database/postgres.ts

import { Pool } from 'pg';
import { env } from '@/core/env';

export const pool = new Pool({
	host: env.DB_HOST,
	port: Number(env.DB_PORT), // 🔥 ini fix error
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	max: 10,
});
