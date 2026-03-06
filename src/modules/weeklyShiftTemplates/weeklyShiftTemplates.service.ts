//src/modules/weeklyShiftTemplates/weeklyShiftTemplates.service.ts

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
	// =====================================================
	// CREATE
	// =====================================================
	static async create(
		actorRole: 'admin' | 'superadmin',
		payload: CreateWeeklyShiftTemplateDTO,
	): Promise<WeeklyShiftTemplateResponse> {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Hanya superadmin yang boleh membuat weekly shift template');
		}

		this.validatePayload(payload);

		const existing = await WeeklyShiftTemplateRepository.findByTemplateKey(
			payload.hari,
			payload.counter_id,
			payload.shift_id,
		);

		if (existing.length > 0) {
			throw new HttpError(
				400,
				`Template untuk ${payload.hari} pada loket ini dan shift tersebut sudah ada`,
			);
		}

		try {
			return await WeeklyShiftTemplateRepository.create(payload);
		} catch (error: unknown) {
			if (isMySqlDuplicateError(error)) {
				throw new HttpError(
					400,
					`Template untuk ${payload.hari} pada loket ini dan shift tersebut sudah ada`,
				);
			}
			throw error;
		}
	}

	// =====================================================
	// UPDATE
	// =====================================================
	static async update(
		actorRole: 'admin' | 'superadmin',
		id: number,
		payload: UpdateWeeklyShiftTemplateDTO,
	): Promise<WeeklyShiftTemplateResponse> {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Hanya superadmin yang boleh mengubah weekly shift template');
		}

		this.validatePayload(payload);

		const existing = await WeeklyShiftTemplateRepository.findByTemplateKey(
			payload.hari,
			payload.counter_id,
			payload.shift_id,
		);

		if (existing.some((t) => t.id !== id)) {
			throw new HttpError(
				400,
				`Template untuk ${payload.hari} pada loket ini dan shift tersebut sudah ada`,
			);
		}

		try {
			return await WeeklyShiftTemplateRepository.updateById(id, payload);
		} catch (error: unknown) {
			if (isMySqlDuplicateError(error)) {
				throw new HttpError(
					400,
					`Template untuk ${payload.hari} pada loket ini dan shift tersebut sudah ada`,
				);
			}
			throw error;
		}
	}

	// =====================================================
	// DELETE
	// =====================================================
	static async delete(actorRole: 'admin' | 'superadmin', id: number): Promise<void> {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Hanya superadmin yang boleh menghapus weekly shift template');
		}

		await WeeklyShiftTemplateRepository.hardDelete(id);
	}

	// =====================================================
	// FIND BY ID
	// =====================================================
	static async findById(id: number): Promise<WeeklyShiftTemplateResponse | null> {
		return WeeklyShiftTemplateRepository.findById(id);
	}

	// =====================================================
	// FIND ALL (SUPERADMIN)
	// =====================================================
	static async findAll(actorRole: 'admin' | 'superadmin') {
		if (actorRole !== 'superadmin') {
			throw new HttpError(403, 'Forbidden');
		}

		return WeeklyShiftTemplateRepository.findAll();
	}

	// =====================================================
	// FIND ACTIVE TODAY
	// =====================================================
	static async findActiveToday(): Promise<WeeklyShiftTemplateListResponse> {
		return WeeklyShiftTemplateRepository.findActiveToday();
	}

	// =====================================================
	// VALIDATION
	// =====================================================
	private static validatePayload(
		payload: CreateWeeklyShiftTemplateDTO | UpdateWeeklyShiftTemplateDTO,
	): void {
		if (!payload.hari) {
			throw new HttpError(400, 'Hari wajib dipilih');
		}

		if (!payload.counter_id || payload.counter_id <= 0) {
			throw new HttpError(400, 'Loket wajib dipilih');
		}

		if (!payload.shift_id || payload.shift_id <= 0) {
			throw new HttpError(400, 'Shift wajib dipilih');
		}

		// =============================
		// VALIDASI USER (WAJIB 1 USER)
		// =============================
		if (!payload.admin_id || payload.admin_id <= 0) {
			throw new HttpError(400, 'User yang ditugaskan wajib dipilih');
		}
	}
}
