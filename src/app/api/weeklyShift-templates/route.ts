import { NextRequest } from 'next/server';
import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

import { WeeklyShiftTemplateService } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.service';
import type { CreateWeeklyShiftTemplateDTO } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

import { ok, created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';

// =====================================================
// GET
// =====================================================
export async function GET() {
	try {
		const { role } = await requireAuth([Role.SUPERADMIN]);

		const data = await WeeklyShiftTemplateService.findAll(role);
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// POST
// =====================================================
export async function POST(req: NextRequest) {
	try {
		const { role } = await requireAuth([Role.SUPERADMIN]);

		const body = (await req.json()) as CreateWeeklyShiftTemplateDTO;
		const data = await WeeklyShiftTemplateService.create(role, body);

		return created(data);
	} catch (error) {
		return handleError(error);
	}
}
