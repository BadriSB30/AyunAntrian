// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });
	const { pathname } = req.nextUrl;

	/* =======================
	   WAJIB LOGIN
	======================= */
	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	const role = token.role as string | undefined;

	/* =======================
	   SUPERADMIN ONLY
	======================= */
	if (pathname.startsWith('/users')) {
		if (role !== 'superadmin') {
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}
	}

	/* =======================
	   ADMIN & SUPERADMIN
	======================= */
	if (
		pathname.startsWith('/dashboard') ||
		pathname.startsWith('/loket') ||
		pathname.startsWith('/shift') ||
		pathname.startsWith('/pemanggilan') ||
		pathname.startsWith('/antrian')
	) {
		if (!['admin', 'superadmin'].includes(role ?? '')) {
			return NextResponse.redirect(new URL('/dashboard', req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/users/:path*',
		'/laporan/:path*',
		'/loket/:path*',
		'/shift/:path*',
		'/pemanggilan/:path*',
		'/antrian/:path*',
	],
};
