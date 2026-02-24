// src/app/api/queues/count/route.ts

import { QueueService } from '@/modules/queue/queue.service';

import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';

import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

// =====================================================
// GET /api/queues/count (SUPERADMIN)
// =====================================================
export async function GET() {
	try {
		// 🔐 Login + SUPERADMIN only
		await requireAuth([Role.SUPERADMIN]);

		const data = await QueueService.countByRole(Role.SUPERADMIN);
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}
