// src/hooks/useUpdateUser.ts
import { useCallback, useState } from 'react';
import { updateUser } from '@/services/user.api';
import type { UpdateUserDTO } from '@/modules/user/user.types';

export function useUpdateUser(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = useCallback(
		async (id: number, data: UpdateUserDTO) => {
			try {
				setLoading(true);
				await updateUser(id, data);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess]
	);

	return { submit, loading };
}
