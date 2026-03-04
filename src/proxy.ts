// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Route yang bebas diakses tanpa login
const PUBLIC_ROUTES = [
	'/',
	'/login',
	'/register',
	'/not-found',
	'/ambil-antrian',
	'/status-antrian',
];

// Definisi route dan role yang diizinkan
const PROTECTED_ROUTES: Record<string, string[]> = {
	'/users': ['superadmin'],
	'/dashboard': ['admin', 'superadmin'],
	'/loket': ['superadmin'],
	'/shift': ['superadmin'],
	'/antrian': ['admin', 'superadmin'],
};

function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function getMatchedRoute(pathname: string): string | null {
	for (const route of Object.keys(PROTECTED_ROUTES)) {
		if (pathname === route || pathname.startsWith(route + '/')) {
			return route;
		}
	}
	return null;
}

export async function proxy(req: NextRequest) {
	const token = await getToken({ req });
	const { pathname } = req.nextUrl;

	/* =======================
     PUBLIC ROUTE → langsung lanjut
  ======================= */
	if (isPublicRoute(pathname)) {
		return NextResponse.next();
	}

	/* =======================
     BELUM LOGIN → pura-pura not-found
     (tidak bocorkan bahwa halaman ada)
  ======================= */
	if (!token) {
		return NextResponse.rewrite(new URL('/not-found', req.url));
	}

	const role = (token.role as string | undefined) ?? '';

	/* =======================
     CEK ROUTE YANG COCOK
  ======================= */
	const matchedRoute = getMatchedRoute(pathname);

	// URL tidak cocok dengan route manapun → not-found
	if (!matchedRoute) {
		return NextResponse.rewrite(new URL('/not-found', req.url));
	}

	// Role tidak diizinkan untuk route ini → not-found
	const allowedRoles = PROTECTED_ROUTES[matchedRoute];
	if (!allowedRoles.includes(role)) {
		return NextResponse.rewrite(new URL('/not-found', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)|api).*)',
	],
};
