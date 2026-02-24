// src/app/api/queues/[id]/route.ts

import { NextRequest } from 'next/server';

import { QueueService } from '@/modules/queue/queue.service';
import type { UpdateQueueDTO } from '@/modules/queue/queue.types';

import { ok } from '@/core/http/api-response';
import { HttpError } from '@/core/http/error';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';

interface RouteContext {
	params: Promise<{ id: string }>;
}

// =====================================================
// Helper
// =====================================================
function parseId(id: string): number {
	const value = Number(id);

	if (Number.isNaN(value)) {
		throw new HttpError(400, 'ID tidak valid');
	}

	return value;
}

// =====================================================
// GET /api/queues/:id
// =====================================================
export async function GET(_: NextRequest, { params }: RouteContext) {
	try {
		await requireAuth(); // 🔐 login wajib

		const { id } = await params;
		const queueId = parseId(id);

		const data = await QueueService.findById(queueId);
		if (!data) {
			throw new HttpError(404, 'Queue tidak ditemukan');
		}

		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// PUT /api/queues/:id
// =====================================================
export async function PUT(req: NextRequest, { params }: RouteContext) {
	try {
		await requireAuth(); // 🔐 login wajib

		const { id } = await params;
		const queueId = parseId(id);

		const body = (await req.json()) as UpdateQueueDTO;

		await QueueService.update(queueId, body);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// DELETE /api/queues/:id
// =====================================================
export async function DELETE(_: NextRequest, { params }: RouteContext) {
	try {
		await requireAuth(); // 🔐 login wajib

		const { id } = await params;
		const queueId = parseId(id);

		await QueueService.cancelQueue(queueId);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
