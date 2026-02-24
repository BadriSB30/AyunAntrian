import { NextRequest } from 'next/server';

import { created } from '@/core/http/api-response';
import { handleError } from '@/core/http/handler';
import { HttpError } from '@/core/http/error';

import { UserService } from '@/modules/user/user.service';
import { Role } from '@/types/enums';

// =====================================================
// SUPERADMIN BOOTSTRAP (sementara)
// =====================================================
const SUPERADMIN_EMAIL = 'adminisa@gmail.com';
const SUPERADMIN_PASSWORD = 'adminisa';

// =====================================================
// POST /api/auth/register
// =====================================================
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { nama, username, email, password } = body;

		if (!nama || !username || !email || !password) {
			throw new HttpError(403, 'Registrasi ditutup');
		}

		const isSuperAdmin = email === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD;

		if (!isSuperAdmin) {
			throw new HttpError(403, 'Registrasi ditutup. Silakan hubungi admin');
		}

		const user = await UserService.create(Role.SUPERADMIN, {
			nama: nama,
			username: username,
			email,
			password,
			role: Role.SUPERADMIN,
		});

		return created(user);
	} catch (error) {
		return handleError(error);
	}
}
