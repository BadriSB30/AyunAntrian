// modules/shift/shift.service.ts

import { ShiftRepository } from './shift.repository';
import { CreateShiftDTO, UpdateShiftDTO, ShiftResponse, ShiftListResponse } from './shift.types';
import { ShiftEntity } from './shift.entity';

export class ShiftService {
	// =====================================================
	// INTERNAL TRANSFORM
	// =====================================================
	private static toResponse(entity: ShiftEntity): ShiftResponse {
		return {
			id: entity.id,
			nama_shift: entity.nama_shift,
			jam_mulai: entity.jam_mulai,
			jam_selesai: entity.jam_selesai,
		};
	}

	// =====================================================
	// CREATE
	// =====================================================
	static async create(
		actorRole: 'admin' | 'superadmin',
		data: CreateShiftDTO
	): Promise<ShiftResponse> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh membuat shift');
		}

		const exists = await ShiftRepository.findByNamaShift(data.nama_shift);
		if (exists) {
			throw new Error('Nama shift sudah terdaftar');
		}

		const shift = await ShiftRepository.create({
			nama_shift: data.nama_shift,
			jam_mulai: data.jam_mulai,
			jam_selesai: data.jam_selesai,
		});

		return this.toResponse(shift);
	}

	// =====================================================
	// FIND BY ID
	// =====================================================
	static async findById(id: number): Promise<ShiftResponse | null> {
		const shift = await ShiftRepository.findById(id);
		return shift ? this.toResponse(shift) : null;
	}

	// =====================================================
	// FIND ALL
	// =====================================================
	static async findAll(): Promise<ShiftListResponse> {
		const shifts = await ShiftRepository.findAll();
		return shifts.map((s) => this.toResponse(s));
	}

	// =====================================================
	// UPDATE
	// =====================================================
	static async update(
		actorRole: 'admin' | 'superadmin',
		id: number,
		data: UpdateShiftDTO
	): Promise<void> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh mengubah shift');
		}

		if (data.nama_shift) {
			const existing = await ShiftRepository.findByNamaShift(data.nama_shift);
			if (existing && existing.id !== id) {
				throw new Error('Nama shift sudah digunakan');
			}
		}

		const payload: Partial<Omit<ShiftEntity, 'id'>> = {
			...data,
		};

		await ShiftRepository.updateById(id, payload);
	}

	// =====================================================
	// HARD DELETE
	// =====================================================
	static async delete(actorRole: 'admin' | 'superadmin', id: number): Promise<void> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh menghapus shift');
		}

		await ShiftRepository.hardDelete(id);
	}
}
