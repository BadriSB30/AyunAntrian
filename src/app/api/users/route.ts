// app/api/users/route.ts

import { UserService } from '@/modules/user/user.service';

import { ok, created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { requireAuth } from '@/core/auth/require-auth';

import { Role } from '@/types/enums';

// =====================================================
// GET /api/users
// SUPERADMIN only
// =====================================================
export async function GET() {
	try {
		await requireAuth();
		const users = await UserService.findAll();
		return ok(users);
	} catch (error) {
		return handleError(error);
	}
}

// =====================================================
// POST /api/users
// SUPERADMIN only
// =====================================================
export async function POST(req: Request) {
	try {
		const { role } = await requireAuth([Role.SUPERADMIN]);

		const body = await req.json();

		const user = await UserService.create(role, body);
		return created(user);
	} catch (error) {
		return handleError(error);
	}
}
