import { WeeklyShiftTemplateRepository } from './weeklyShiftTemplates.repository';
import type {
	CreateWeeklyShiftTemplateDTO,
	UpdateWeeklyShiftTemplateDTO,
	WeeklyShiftTemplateResponse,
	WeeklyShiftTemplateListResponse,
} from './weeklyShiftTemplates.types';
import { HttpError } from '@/core/http/error';

type MySqlError = {
	code: string;
};

function isMySqlDuplicateError(error: unknown): error is MySqlError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as MySqlError).code === 'ER_DUP_ENTRY'
	);
}

export class WeeklyShiftTemplateService {
	// =========================
	// CREATE
	// =========================
	static async create(
		actorRole: 'admin' | 'superadmin',
		data: CreateWeeklyShiftTemplateDTO,
	): Promise<WeeklyShiftTemplateResponse> {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Hanya superadmin yang boleh membuat weekly shift template');
		}

		// =========================
		// VALIDASI SESUAI DB
		// =========================
		const existing = await WeeklyShiftTemplateRepository.findByTemplateKey(
			data.hari,
			data.counter_id,
			data.shift_id,
		);

		if (existing.length > 0) {
			throw new HttpError(
				400,
				`Template untuk ${data.hari} pada loket ini dan shift tersebut sudah ada`,
			);
		}

		// =========================
		// INSERT + SAFETY NET
		// =========================
		try {
			return await WeeklyShiftTemplateRepository.create(data);
		} catch (error: unknown) {
			if (isMySqlDuplicateError(error)) {
				throw new HttpError(
					400,
					`Template untuk ${data.hari} pada loket ini dan shift tersebut sudah ada`,
				);
			}
			throw error;
		}
	}

	// =========================
	// UPDATE
	// =========================
	static async update(
		actorRole: 'admin' | 'superadmin',
		id: number,
		data: UpdateWeeklyShiftTemplateDTO,
	): Promise<WeeklyShiftTemplateResponse> {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Hanya superadmin yang boleh mengubah weekly shift template');
		}

		const existing = await WeeklyShiftTemplateRepository.findByTemplateKey(
			data.hari,
			data.counter_id,
			data.shift_id,
		);

		if (existing.some((t) => t.id !== id)) {
			throw new HttpError(
				400,
				`Template untuk ${data.hari} pada loket ini dan shift tersebut sudah ada`,
			);
		}

		try {
			return await WeeklyShiftTemplateRepository.updateById(id, data);
		} catch (error: unknown) {
			if (isMySqlDuplicateError(error)) {
				throw new HttpError(
					400,
					`Template untuk ${data.hari} pada loket ini dan shift tersebut sudah ada`,
				);
			}
			throw error;
		}
	}

	// =========================
	// DELETE
	// =========================
	static async delete(actorRole: 'admin' | 'superadmin', id: number): Promise<void> {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden: hanya superadmin yang boleh menghapus weekly shift template');
		}

		await WeeklyShiftTemplateRepository.hardDelete(id);
	}

	// =========================
	// FIND
	// =========================
	static async findById(id: number): Promise<WeeklyShiftTemplateResponse | null> {
		return WeeklyShiftTemplateRepository.findById(id);
	}

	// =========================
	// SUPERADMIN: SEMUA DATA
	// =========================
	static async findAll(actorRole: 'admin' | 'superadmin') {
		if (actorRole !== 'superadmin') {
			throw new Error('Forbidden');
		}
		return WeeklyShiftTemplateRepository.findAll();
	}

	// =========================
	// FIND AKTIF HARI INI
	// =========================
	static async findActiveToday(): Promise<WeeklyShiftTemplateListResponse> {
		return WeeklyShiftTemplateRepository.findActiveToday();
	}
}
