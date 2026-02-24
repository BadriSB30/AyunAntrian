// src/app/api/counters/[id]/status/route.ts

import { NextRequest } from 'next/server';

import { CounterService } from '@/modules/counter/counter.service';
import type { CounterEntity } from '@/modules/counter/counter.entity';

import { ok } from '@/core/http/api-response';
import { HttpError } from '@/core/http/error';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';

import { Role } from '@/types/enums';

// =====================================================
// Route Context
// =====================================================
interface RouteContext {
	params: Promise<{ id: string }>;
}

// =====================================================
// Helper
// =====================================================
function parseId(id: string): number {
	const parsed = Number(id);
	if (Number.isNaN(parsed)) {
		throw new HttpError(400, 'ID tidak valid');
	}
	return parsed;
}

// =====================================================
// PATCH /api/counters/:id/status
// Admin & Superadmin only
// =====================================================
export async function PATCH(req: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.ADMIN, Role.SUPERADMIN]);

		const { id } = await params;
		const counterId = parseId(id);

		const { status }: { status: CounterEntity['status'] } = await req.json();

		if (!status) {
			throw new HttpError(400, 'Status wajib diisi');
		}

		await CounterService.updateStatus(role, counterId, status);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
