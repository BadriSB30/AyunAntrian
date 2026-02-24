// src/hooks/useWeeklyShiftsTemplate.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { getUser } from '@/services/user.api';
import type { UserListResponse } from '@/modules/user/user.types';

export function useUser() {
	const [list, setList] = useState<UserListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getUser();
			setList(data);
		} catch (error) {
			console.error('[useUser]', error);
			toast.error('Gagal memuat daftar user');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	return {
		list,
		loading,
		refresh,
	};
}
