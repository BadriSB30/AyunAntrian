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
	static async create(actorRole: Role, data: CreateUserDTO): Promise<UserResponse> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		const exists = await UserRepository.findByEmailUsername(data.email, data.username);

		if (exists) {
			throw new HttpError(409, 'Username atau email sudah terdaftar');
		}

		const hashedPassword = await hashPassword(data.password);

		const user = await UserRepository.create({
			nama: data.nama,
			username: data.username.toLowerCase().replace(/\s+/g, ''),
			email: data.email,
			password: hashedPassword,
			role: data.role,
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
		return users.map(this.toResponse);
	}

	// =====================================================
	// UPDATE
	// =====================================================
	static async update(actorRole: Role, id: number, data: UpdateUserDTO): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new HttpError(403, 'Forbidden');
		}

		const user = await UserRepository.findById(id);
		if (!user) {
			throw new HttpError(404, 'User tidak ditemukan');
		}

		if (data.email || data.username) {
			const exists = await UserRepository.findByEmailUsername(
				data.email ?? null,
				data.username ?? null,
			);

			if (exists && exists.id !== id) {
				throw new HttpError(409, 'Username atau email sudah terdaftar');
			}
		}

		const payload: Partial<Omit<UserEntity, 'id' | 'created_at'>> = {};

		if (data.nama !== undefined) payload.nama = data.nama;
		if (data.email !== undefined) payload.email = data.email;
		if (data.role !== undefined) payload.role = data.role;
		if (data.status !== undefined) payload.status = data.status;

		if (data.username) {
			payload.username = data.username.toLowerCase().replace(/\s+/g, '');
		}

		if (data.password) {
			payload.password = await hashPassword(data.password);
		}

		await UserRepository.updateById(id, payload);
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
}
