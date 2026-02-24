// app/api/shifts/[id]/route.ts

import { NextRequest } from 'next/server';

import { ShiftService } from '@/modules/shift/shift.service';
import type { UpdateShiftDTO } from '@/modules/shift/shift.types';

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
// GET /api/shifts/:id
// (login required)
// =====================================================
export async function GET(_req: NextRequest, { params }: RouteContext) {
	try {
		await requireAuth(); // 🔐 login + active check

		const { id } = await params;
		const shiftId = Number(id);

		if (Number.isNaN(shiftId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		const data = await ShiftService.findById(shiftId);
		if (!data) {
			throw new HttpError(404, 'Shift tidak ditemukan');
		}

		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// PUT /api/shifts/:id
// (ADMIN & SUPERADMIN)
// =====================================================
export async function PUT(req: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([
			Role.ADMIN,
			Role.SUPERADMIN,
		]);

		const { id } = await params;
		const shiftId = Number(id);

		if (Number.isNaN(shiftId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		const body = (await req.json()) as UpdateShiftDTO;

		await ShiftService.update(role, shiftId, body);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// DELETE /api/shifts/:id
// (SUPERADMIN only)
// =====================================================
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.SUPERADMIN]);

		const { id } = await params;
		const shiftId = Number(id);

		if (Number.isNaN(shiftId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		await ShiftService.delete(role, shiftId);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
