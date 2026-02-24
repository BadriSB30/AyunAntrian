// src/app/api/queues/route.ts

import { NextRequest } from 'next/server';

import { QueueService } from '@/modules/queue/queue.service';
import type { CreateQueueDTO } from '@/modules/queue/queue.types';

import { ok, created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';

// =====================================================
// GET /api/queues
// (login required)
// =====================================================
export async function GET() {
	try {
		await requireAuth(); // 🔐 wajib login & user aktif

		const data = await QueueService.findAll();
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// POST /api/queues
// =====================================================
export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as CreateQueueDTO;

		const data = await QueueService.create(body);
		return created(data);
	} catch (error) {
		return handleError(error);
	}
}
