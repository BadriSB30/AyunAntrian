import { UserRepository } from './user.repository';
import { CreateUserDTO, UpdateUserDTO, UserResponse, UserListResponse } from './user.types';
import { UserEntity } from './user.entity';
import { hashPassword } from '@/core/auth/password';
import { Role, UserStatus } from '@/types/enums';
import { HttpError } from '@/core/http/error';

export class UserService {
	// =====================================================
	// INTERNAL TRANSFORM
	// =====================================================
	private static toResponse(user: UserEntity): UserResponse {
		return {
			id: user.id,
			nama: user.nama,
			username: user.username,
			email: user.email,
			role: user.role,
			status: user.status,
			created_at: user.created_at,
		};
	}

	// =====================================================
	// CREATE
	// =====================================================
	static async create(actorRole: Role, payload: CreateUserDTO): Promise<UserResponse> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		this.validateCreatePayload(payload);

		const exists = await UserRepository.findByEmailUsername(payload.email, payload.username);

		if (exists) {
			throw new HttpError(409, 'Username atau email sudah terdaftar');
		}

		const hashedPassword = await hashPassword(payload.password);

		const user = await UserRepository.create({
			nama: payload.nama,
			username: payload.username.toLowerCase().replace(/\s+/g, ''),
			email: payload.email,
			password: hashedPassword,
			role: payload.role,
			status: UserStatus.AKTIF,
		});

		return this.toResponse(user);
	}

	// =====================================================
	// FIND BY ID
	// =====================================================
	static async findById(id: number): Promise<UserResponse | null> {
		const user = await UserRepository.findById(id);
		return user ? this.toResponse(user) : null;
	}

	// =====================================================
	// FIND ALL
	// =====================================================
	static async findAll(): Promise<UserListResponse> {
		const users = await UserRepository.findAll();
		return users.map((u) => this.toResponse(u));
	}

	// =====================================================
	// UPDATE
	// =====================================================
	static async update(actorRole: Role, id: number, payload: UpdateUserDTO): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		this.validateUpdatePayload(payload);

		const user = await UserRepository.findById(id);
		if (!user) {
			throw new HttpError(404, 'User tidak ditemukan');
		}

		if (payload.email || payload.username) {
			const exists = await UserRepository.findByEmailUsername(
				payload.email ?? null,
				payload.username ?? null,
			);

			if (exists && exists.id !== id) {
				throw new HttpError(409, 'Username atau email sudah terdaftar');
			}
		}

		const updatePayload: Partial<Omit<UserEntity, 'id' | 'created_at'>> = {};

		if (payload.nama !== undefined) updatePayload.nama = payload.nama;
		if (payload.email !== undefined) updatePayload.email = payload.email;
		if (payload.role !== undefined) updatePayload.role = payload.role;
		if (payload.status !== undefined) updatePayload.status = payload.status;

		if (payload.username) {
			updatePayload.username = payload.username.toLowerCase().replace(/\s+/g, '');
		}

		if (payload.password) {
			updatePayload.password = await hashPassword(payload.password);
		}

		await UserRepository.updateById(id, updatePayload);
	}

	// =====================================================
	// UPDATE STATUS
	// =====================================================
	static async updateStatus(actorRole: Role, id: number, status: UserStatus): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		const user = await UserRepository.findById(id);
		if (!user) {
			throw new HttpError(404, 'User tidak ditemukan');
		}

		await UserRepository.updateStatus(id, status);
	}

	// =====================================================
	// HARD DELETE
	// =====================================================
	static async hardDelete(actorRole: Role, id: number): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		const user = await UserRepository.findById(id);
		if (!user) {
			throw new HttpError(404, 'User tidak ditemukan');
		}

		await UserRepository.hardDelete(id);
	}

	// =====================================================
	// VALIDATION CREATE
	// =====================================================
	private static validateCreatePayload(payload: CreateUserDTO): void {
		if (!payload.nama) {
			throw new HttpError(400, 'Nama wajib diisi');
		}

		if (!payload.username) {
			throw new HttpError(400, 'Username wajib diisi');
		}

		if (!payload.email) {
			throw new HttpError(400, 'Email wajib diisi');
		}

		if (!payload.password) {
			throw new HttpError(400, 'Password wajib diisi');
		}

		if (!payload.role) {
			throw new HttpError(400, 'Role wajib dipilih');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(payload.email)) {
			throw new HttpError(400, 'Format email tidak valid');
		}

		if (payload.password.length < 6) {
			throw new HttpError(400, 'Password minimal 6 karakter');
		}
	}

	// =====================================================
	// VALIDATION UPDATE
	// =====================================================
	private static validateUpdatePayload(payload: UpdateUserDTO): void {
		if (payload.email) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			if (!emailRegex.test(payload.email)) {
				throw new HttpError(400, 'Format email tidak valid');
			}
		}

		if (payload.password && payload.password.length < 6) {
			throw new HttpError(400, 'Password minimal 6 karakter');
		}
	}
}
