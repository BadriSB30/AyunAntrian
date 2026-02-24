// src/app/api/counters/[id]/route.ts

import { NextRequest } from 'next/server';

import { CounterService } from '@/modules/counter/counter.service';
import type { UpdateCounterDTO } from '@/modules/counter/counter.types';

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
// GET /api/counters/:id
// Login-only (tanpa role restriction)
// =====================================================
export async function GET(_: NextRequest, { params }: RouteContext) {
	try {
		await requireAuth(); // 🔒 wajib login

		const { id } = await params;
		const counterId = parseId(id);

		const data = await CounterService.findById(counterId);
		if (!data) {
			throw new HttpError(404, 'Counter tidak ditemukan');
		}

		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// PUT /api/counters/:id
// Admin & Superadmin
// =====================================================
export async function PUT(req: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.ADMIN, Role.SUPERADMIN]);

		const { id } = await params;
		const counterId = parseId(id);

		const body = (await req.json()) as UpdateCounterDTO;

		await CounterService.update(role, counterId, body);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// DELETE /api/counters/:id
// Admin & Superadmin
// =====================================================
export async function DELETE(_: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.ADMIN, Role.SUPERADMIN]);

		const { id } = await params;
		const counterId = parseId(id);

		await CounterService.delete(role, counterId);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
