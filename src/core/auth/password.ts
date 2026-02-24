// src/core/auth/password.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = (plain: string) => {
	return bcrypt.hash(plain, SALT_ROUNDS);
};

export const comparePassword = (plain: string, hashed: string) => {
	return bcrypt.compare(plain, hashed);
};
