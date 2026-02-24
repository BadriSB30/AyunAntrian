import { QueueRepository } from './queue.repository';
import { CreateQueueDTO, UpdateQueueDTO, QueueResponse, QueueListResponse } from './queue.types';
import { QueueEntity } from './queue.entity';
import { QueueStatus, Role } from '@/types/enums';
import type { QueueCountResult } from './queue.repository';
import { HttpError } from '@/core/http/error';

export class QueueService {
	// =====================================================
	// INTERNAL TRANSFORM
	// =====================================================

	private static toResponse(entity: QueueEntity): QueueResponse {
		return { ...entity };
	}

	private static mapRole(role: Role): 'admin' | 'superadmin' {
		switch (role) {
			case Role.ADMIN:
				return 'admin';
			case Role.SUPERADMIN:
				return 'superadmin';
			default:
				throw new HttpError(400, 'Invalid role');
		}
	}

	// =====================================================
	// CREATE QUEUE
	// =====================================================

	static async create(data: CreateQueueDTO): Promise<QueueResponse> {
		const now = new Date();

		const nomorAntrian = await QueueRepository.getNextQueueNumberToday(
			now,
			data.counter_id,
			data.shift_id,
		);

		const created = await QueueRepository.create({
			tanggal: now,
			nomor_antrian: nomorAntrian,
			counter_id: data.counter_id,
			admin_id: data.admin_id,
			shift_id: data.shift_id,
			status: QueueStatus.MENUNGGU,
			waktu_ambil: now,
			waktu_panggil: null,
			waktu_selesai: null,
		});
		return this.toResponse(created);
	}

	// =====================================================
	// FIND
	// =====================================================

	static async findById(id: number): Promise<QueueResponse | null> {
		const queue = await QueueRepository.findById(id);
		return queue ? this.toResponse(queue) : null;
	}

	/**
	 * Superadmin only (global)
	 */
	static async findAll(): Promise<QueueListResponse> {
		const queues = await QueueRepository.findByRole('superadmin');
		return queues.map(this.toResponse);
	}

	/**
	 * Role based (ADMIN / SUPERADMIN)
	 */
	static async findByRole(role: Role, userId?: number): Promise<QueueListResponse> {
		if (role === Role.ADMIN && !userId) {
			throw new HttpError(400, 'adminId is required for admin role');
		}

		const repoRole = this.mapRole(role);

		const queues = await QueueRepository.findByRole(
			repoRole,
			repoRole === 'admin' ? userId : undefined,
		);

		return queues.map(this.toResponse);
	}

	// =====================================================
	// UPDATE STATUS
	// =====================================================

	static async update(id: number, data: UpdateQueueDTO): Promise<void> {
		if (!data.status) {
			throw new HttpError(400, 'Status is required');
		}

		const queue = await QueueRepository.findById(id);
		if (!queue) {
			throw new HttpError(404, 'Queue not found');
		}

		const now = new Date();
		const payload: Partial<QueueEntity> = {
			status: data.status,
		};

		switch (data.status) {
			case QueueStatus.DIPANGGIL:
				payload.waktu_panggil = now;
				payload.waktu_selesai = null;
				break;

			case QueueStatus.SELESAI:
				payload.waktu_panggil = queue.waktu_panggil ?? now;
				payload.waktu_selesai = now;
				break;

			case QueueStatus.BATAL:
			case QueueStatus.MENUNGGU:
				payload.waktu_panggil = null;
				payload.waktu_selesai = null;
				break;

			default:
				throw new HttpError(400, 'Invalid queue status');
		}

		await QueueRepository.updateById(id, payload);
	}

	// =====================================================
	// DELETE
	// =====================================================

	static async cancelQueue(id: number): Promise<void> {
		const queue = await QueueRepository.findById(id);
		if (!queue) {
			throw new HttpError(404, 'Queue not found');
		}

		await QueueRepository.hardDelete(id);
	}

	// =====================================================
	// ================== COUNT / STAT =====================
	// =====================================================

	static async countByRole(role: Role, userId?: number): Promise<QueueCountResult> {
		if (role === Role.ADMIN && !userId) {
			throw new HttpError(400, 'adminId is required for admin role');
		}

		return QueueRepository.countByRole(
			this.mapRole(role),
			role === Role.ADMIN ? userId : undefined,
		);
	}
}
