// src/modules/counter/counter.service.ts

import { CounterRepository } from './counter.repository';
import {
	CreateCounterDTO,
	UpdateCounterDTO,
	CounterResponse,
	CounterListResponse,
} from './counter.types';
import { CounterEntity } from './counter.entity';
import { Role, CounterStatus } from '@/types/enums';

export class CounterService {
	// =====================================================
	// INTERNAL TRANSFORM
	// =====================================================
	private static toResponse(entity: CounterEntity): CounterResponse {
		return { ...entity };
	}

	// =====================================================
	// CREATE
	// =====================================================
	static async create(actorRole: Role, data: CreateCounterDTO): Promise<CounterResponse> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new Error('Forbidden: hanya superadmin yang boleh membuat counter');
		}

		const existing = await CounterRepository.findByKodeOrNama(data.kode_loket, data.nama_loket);

		if (existing) {
			throw new Error('Kode loket atau nama loket sudah terdaftar');
		}

		const counter = await CounterRepository.create({
			kode_loket: data.kode_loket,
			nama_loket: data.nama_loket,
			status: data.status ?? CounterStatus.AKTIF,
		});

		return this.toResponse(counter);
	}

	// =====================================================
	// FIND BY ID
	// =====================================================
	static async findById(id: number): Promise<CounterResponse | null> {
		const counter = await CounterRepository.findById(id);
		return counter ? this.toResponse(counter) : null;
	}

	// =====================================================
	// FIND ALL
	// =====================================================
	static async findAll(): Promise<CounterListResponse> {
		const counters = await CounterRepository.findAll();
		return counters.map(this.toResponse);
	}

	// =====================================================
	// UPDATE
	// =====================================================
	static async update(actorRole: Role, id: number, data: UpdateCounterDTO): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new Error('Forbidden: hanya superadmin yang boleh mengubah counter');
		}

		if (data.kode_loket || data.nama_loket) {
			const existing = await CounterRepository.findByKodeOrNama(data.kode_loket, data.nama_loket);

			if (existing && existing.id !== id) {
				throw new Error('Kode loket atau nama loket sudah digunakan');
			}
		}

		await CounterRepository.updateById(id, data);
	}

	// =====================================================
	// UPDATE STATUS
	// =====================================================
	static async updateStatus(actorRole: Role, id: number, status: CounterStatus): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new Error('Forbidden: hanya superadmin yang boleh mengubah status');
		}

		await CounterRepository.updateStatus(id, status);
	}

	// =====================================================
	// DELETE
	// =====================================================
	static async delete(actorRole: Role, id: number): Promise<void> {
		if (actorRole !== Role.SUPERADMIN) {
			throw new Error('Forbidden: hanya superadmin yang boleh menghapus permanen');
		}

		await CounterRepository.hardDelete(id);
	}
}
