// app/api/shifts/route.ts

import { NextRequest } from 'next/server';

import { ShiftService } from '@/modules/shift/shift.service';
import type { CreateShiftDTO } from '@/modules/shift/shift.types';

import { ok, created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

// =====================================================
// GET /api/shifts
// (login required)
// =====================================================
export async function GET() {
	try {
		await requireAuth(); // 🔐 login + active check
		const data = await ShiftService.findAll();
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// POST /api/shifts
// (ADMIN & SUPERADMIN)
// =====================================================
export async function POST(req: NextRequest) {
	try {
		const { role } = await requireAuth([
			Role.ADMIN,
			Role.SUPERADMIN,
		]);

		const body = (await req.json()) as CreateShiftDTO;
		const data = await ShiftService.create(role, body);

		return created(data);
	} catch (error) {
		return handleError(error);
	}
}
