// src/app/api/counters/route.ts

import { NextRequest } from 'next/server';

import { CounterService } from '@/modules/counter/counter.service';
import type { CreateCounterDTO } from '@/modules/counter/counter.types';

import { ok, created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';
import { Role } from '@/types/enums';

// =====================================================
// GET /api/counters
// Public / login-only (tanpa role check)
// =====================================================
export async function GET() {
	try {
		await requireAuth(); // 🔐 login wajib
		const data = await CounterService.findAll();
		return ok(data);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// POST /api/counters
// Admin & Superadmin
// =====================================================
export async function POST(req: NextRequest) {
	try {
		const { role } = await requireAuth([Role.ADMIN, Role.SUPERADMIN]);

		const body = (await req.json()) as CreateCounterDTO;
		const data = await CounterService.create(role, body);

		return created(data);
	} catch (error) {
		return handleError(error);
	}
}
