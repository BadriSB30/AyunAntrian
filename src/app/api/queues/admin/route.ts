// src/app/api/queues/admin/route.ts

import { QueueService } from '@/modules/queue/queue.service';

import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { HttpError } from '@/core/http/error';

import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

// =====================================================
// GET /api/queues/admin
// =====================================================
export async function GET() {
	try {
		// 🔐 WAJIB login + ADMIN
		const session = await requireAuth([Role.ADMIN]);

		const adminId = session.userId;
		if (!adminId || Number.isNaN(adminId)) {
			throw new HttpError(400, 'Invalid admin id');
		}

		const data = await QueueService.findByRole(Role.ADMIN, adminId);
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}
