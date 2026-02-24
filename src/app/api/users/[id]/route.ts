// app/api/users/[id]/route.ts

import { NextRequest } from 'next/server';
import { UserService } from '@/modules/user/user.service';

import { ok } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';
import { HttpError } from '@/core/http/error';

import { Role } from '@/types/enums';

// =====================================================
// Route Context (🔥 PARAMS ASYNC)
// =====================================================
interface RouteContext {
	params: Promise<{
		id: string;
	}>;
}

// =====================================================
// GET /api/users/:id
// (login required)
// =====================================================
export async function GET(
	_req: NextRequest,
	{ params }: RouteContext,
) {
	try {
		await requireAuth(); // 🔐 login + active check

		const { id } = await params; // ✅ WAJIB
		const userId = Number(id);

		if (Number.isNaN(userId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		const user = await UserService.findById(userId);
		if (!user) {
			throw new HttpError(404, 'User tidak ditemukan');
		}

		return ok(user);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// PUT /api/users/:id
// (SUPERADMIN only)
// =====================================================
export async function PUT(
	req: NextRequest,
	{ params }: RouteContext,
) {
	try {
		await requireAuth([Role.SUPERADMIN]); // 🔐 role guard

		const { id } = await params; // ✅ WAJIB
		const userId = Number(id);

		if (Number.isNaN(userId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		const body = await req.json();

		await UserService.update(Role.SUPERADMIN, userId, body);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// DELETE /api/users/:id
// (SUPERADMIN only)
// =====================================================
export async function DELETE(
	_req: NextRequest,
	{ params }: RouteContext,
) {
	try {
		await requireAuth([Role.SUPERADMIN]); // 🔐 role guard

		const { id } = await params; // ✅ WAJIB
		const userId = Number(id);

		if (Number.isNaN(userId)) {
			throw new HttpError(400, 'ID tidak valid');
		}

		await UserService.hardDelete(Role.SUPERADMIN, userId);
		return ok(null);
	} catch (error) {
		return handleError(error);
	}
}
