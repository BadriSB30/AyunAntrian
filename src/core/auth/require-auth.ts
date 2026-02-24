// src/core/auth/require-auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/core/auth/next-auth';
import { UserRepository } from '@/modules/user/user.repository';
import { Role } from '@/types/enums';
import { HttpError } from '@/core/http/error';
import type { Session } from 'next-auth';

// =====================================================
// Auth Context (PASTI VALID)
// =====================================================
export interface AuthContext {
	session: Session;
	userId: number;
	role: Role;
}

// =====================================================
// Require Auth Helper
// - Login wajib
// - Status user aktif
// - Optional RBAC
// =====================================================
export async function requireAuth(
	roles?: readonly Role[],
): Promise<AuthContext> {
	const session = await getServerSession(authOptions);

	// =========================
	// LOGIN CHECK
	// =========================
	if (!session?.user?.id || !session.user.role) {
		throw new HttpError(401, 'Unauthorized');
	}

	const userId = Number(session.user.id);
	if (Number.isNaN(userId)) {
		throw new HttpError(401, 'Unauthorized');
	}

	// =========================
	// ROLE ENUM VALIDATION
	// =========================
	if (!Object.values(Role).includes(session.user.role as Role)) {
		throw new HttpError(403, 'Forbidden');
	}

	const role = session.user.role as Role;

	// =========================
	// DB AS SOURCE OF TRUTH
	// =========================
	const user = await UserRepository.findById(userId);
	if (!user) {
		throw new HttpError(401, 'Unauthorized');
	}

	// =========================
	// FORCE LOGOUT (INACTIVE)
	// =========================
	if (user.status !== 'aktif') {
		throw new HttpError(403, 'Akun nonaktif');
	}

	// =========================
	// OPTIONAL RBAC
	// =========================
	if (roles && !roles.includes(role)) {
		throw new HttpError(403, 'Forbidden');
	}

	// =========================
	// SUCCESS
	// =========================
	return {
		session,
		userId,
		role,
	};
}
