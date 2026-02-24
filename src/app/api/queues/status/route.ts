// src/app/api/queues/route.ts

import { QueueService } from '@/modules/queue/queue.service';
import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';

// =====================================================
// GET /api/queues
// =====================================================
export async function GET() {
	try {
		const data = await QueueService.findAll();
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}
