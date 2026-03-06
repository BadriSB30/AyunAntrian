import { ShiftRepository } from './shift.repository';
import { CreateShiftDTO, UpdateShiftDTO, ShiftResponse, ShiftListResponse } from './shift.types';
import { ShiftEntity } from './shift.entity';

export class ShiftService {
	// =====================================================
	// GENERATE KODE SHIFT (A, B, C, ... Z, AA, AB, ...)
	// =====================================================
	private static generateKodeShift(existingKodes: string[]): string {
		const kodeSet = new Set(existingKodes);

		const generateSequence = function* () {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

			for (const c of chars) yield c;

			for (const c1 of chars) {
				for (const c2 of chars) yield c1 + c2;
			}
		};

		for (const kode of generateSequence()) {
			if (!kodeSet.has(kode)) return kode;
		}

		throw new Error('Tidak ada kode shift yang tersedia');
	}

	// =====================================================
	// INTERNAL TRANSFORM
	// =====================================================
	private static toResponse(entity: ShiftEntity): ShiftResponse {
		return {
			id: entity.id,
			nama_shift: entity.nama_shift,
			kode_shift: entity.kode_shift,
			jam_mulai: entity.jam_mulai,
			jam_selesai: entity.jam_selesai,
		};
	}

	// =====================================================
	// CREATE
	// =====================================================
	static async create(
		actorRole: 'admin' | 'superadmin',
		payload: CreateShiftDTO,
	): Promise<ShiftResponse> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh membuat shift');
		}

		this.validateCreatePayload(payload);

		const exists = await ShiftRepository.findByNamaShift(payload.nama_shift);
		if (exists) throw new Error('Nama shift sudah terdaftar');

		const existingKodes = await ShiftRepository.findAllKodeShift();
		const kode_shift = this.generateKodeShift(existingKodes);

		const shift = await ShiftRepository.create({
			nama_shift: payload.nama_shift,
			kode_shift,
			jam_mulai: payload.jam_mulai,
			jam_selesai: payload.jam_selesai,
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
		payload: UpdateShiftDTO,
	): Promise<void> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh mengubah shift');
		}

		this.validateUpdatePayload(payload);

		if (payload.nama_shift) {
			const existing = await ShiftRepository.findByNamaShift(payload.nama_shift);
			if (existing && existing.id !== id) {
				throw new Error('Nama shift sudah digunakan');
			}
		}

		const updatePayload: Partial<Omit<ShiftEntity, 'id'>> = { ...payload };

		await ShiftRepository.updateById(id, updatePayload);
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

	// =====================================================
	// VALIDATION CREATE
	// =====================================================
	private static validateCreatePayload(payload: CreateShiftDTO): void {
		if (!payload.nama_shift) throw new Error('Nama shift wajib diisi');
		if (!payload.jam_mulai) throw new Error('Jam mulai wajib diisi');
		if (!payload.jam_selesai) throw new Error('Jam selesai wajib diisi');

		if (payload.jam_mulai >= payload.jam_selesai) {
			throw new Error('Jam selesai harus lebih besar dari jam mulai');
		}
	}

	// =====================================================
	// VALIDATION UPDATE
	// =====================================================
	private static validateUpdatePayload(payload: UpdateShiftDTO): void {
		if (payload.jam_mulai && payload.jam_selesai) {
			if (payload.jam_mulai >= payload.jam_selesai) {
				throw new Error('Jam selesai harus lebih besar dari jam mulai');
			}
		}
	}
}
