import { NextRequest } from 'next/server';

import { WeeklyShiftTemplateService } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.service';
import type { UpdateWeeklyShiftTemplateDTO } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

// =====================================================
// Context type (App Router - FIX)
// =====================================================
interface RouteContext {
	params: Promise<{
		id: string;
	}>;
}

// =====================================================
// GET /api/weeklyShift-templates/:id
// =====================================================
export async function GET(_: NextRequest, { params }: RouteContext) {
	try {
		const { id } = await params;
		const numericId = Number(id);

		if (Number.isNaN(numericId)) {
			throw new Error('ID tidak valid');
		}
		await requireAuth();

		const data = await WeeklyShiftTemplateService.findById(numericId);

		if (!data) {
			throw new Error('Weekly Shift Template tidak ditemukan');
		}

		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// PUT /api/weeklyShift-templates/:id
// ADMIN & SUPERADMIN
// =====================================================
export async function PUT(req: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.ADMIN, Role.SUPERADMIN]);

		const { id } = await params;
		const numericId = Number(id);

		if (Number.isNaN(numericId)) {
			throw new Error('ID tidak valid');
		}

		const body = (await req.json()) as UpdateWeeklyShiftTemplateDTO;

		await WeeklyShiftTemplateService.update(role, numericId, body);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// DELETE /api/weeklyShift-templates/:id
// SUPERADMIN only
// =====================================================
export async function DELETE(_: NextRequest, { params }: RouteContext) {
	try {
		const { role } = await requireAuth([Role.SUPERADMIN]);

		const { id } = await params;
		const numericId = Number(id);

		if (Number.isNaN(numericId)) {
			throw new Error('ID tidak valid');
		}

		await WeeklyShiftTemplateService.delete(role, numericId);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
