// src/hooks/useDeleteUser.ts
import { useCallback, useState } from 'react';
import { deleteUser } from '@/services/user.api';

export function useDeleteUser(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const remove = useCallback(
		async (id: number) => {
			try {
				setLoading(true);
				await deleteUser(id);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess],
	);

	return { remove, loading };
}
