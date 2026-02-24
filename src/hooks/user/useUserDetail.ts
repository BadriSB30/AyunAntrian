// src/hooks/useUserDetail.ts
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getUserById } from '@/services/user.api';
import type { UserResponse } from '@/modules/user/user.types';

export function useUserDetail() {
	const [data, setData] = useState<UserResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const open = useCallback(async (id: number) => {
		try {
			setLoading(true);
			const res = await getUserById(id);
			setData(res);
		} catch {
			toast.error('Gagal memuat detail user');
		} finally {
			setLoading(false);
		}
	}, []);

	const close = () => setData(null);

	return { data, loading, open, close };
}
