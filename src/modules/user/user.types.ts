// modules/user/user.types.ts

import { Role, UserStatus } from '@/types/enums';

// =========================
// CREATE
// =========================
export interface CreateUserDTO {
	nama: string;
	username: string;
	email: string;
	password: string;
	role: Role;
}

// =========================
// UPDATE
// =========================
export interface UpdateUserDTO {
	nama?: string;
	username?: string;
	email?: string;
	password?: string;
	role?: Role;
	status?: UserStatus;
}

// =========================
// RESPONSE (AMAN)
// =========================
export interface UserResponse {
	id: number;
	nama: string;
	username: string;
	email: string;
	role: Role;
	status: UserStatus;
	created_at: Date;
}

// =========================
// LIST RESPONSE
// =========================
export type UserListResponse = UserResponse[];
