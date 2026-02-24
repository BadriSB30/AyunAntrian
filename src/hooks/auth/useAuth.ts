'use client';
import { useSession } from 'next-auth/react';

export function useAuth(role?: 'admin' | 'superadmin') {
	const { data, status } = useSession();

	const allowed = !role || data?.user.role === role;

	return { session: data, loading: status === 'loading', allowed };
}
