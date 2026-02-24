import { useState } from 'react';
import { updateUserStatus } from '@/services/user.api';

export function useUpdateUserStatus(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const toggleStatus = async (id: number, status: 'aktif' | 'nonaktif') => {
		setLoading(true);
		try {
			await updateUserStatus(id, status);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { toggleStatus, loading };
}
