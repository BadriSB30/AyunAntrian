// app/api/users/[id]/status/route.ts

import { NextRequest } from 'next/server';
import { UserService } from '@/modules/user/user.service';
import type { UserEntity } from '@/modules/user/user.entity';

import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';
import { HttpError } from '@/core/http/error';
import { Role } from '@/types/enums';

// =====================================================
// Route Context (⚠️ params AS Promise)
// =====================================================
interface RouteContext {
	params: Promise<{ id: string }>;
}

// =====================================================
// PATCH /api/users/:id/status
// ADMIN & SUPERADMIN
// =====================================================
export async function PATCH(
	req: NextRequest,
	{ params }: RouteContext,
) {
	try {
		// 🔐 login + active check + RBAC
		const { role } = await requireAuth([
			Role.ADMIN,
			Role.SUPERADMIN,
		]);

		// ✅ WAJIB unwrap params
		const { id } = await params;
		const userId = Number(id);

		if (Number.isNaN(userId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		const body = (await req.json()) as {
			status?: UserEntity['status'];
		};

		if (!body.status) {
			throw new HttpError(400, 'Status wajib diisi');
		}

		await UserService.updateStatus(role, userId, body.status);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
