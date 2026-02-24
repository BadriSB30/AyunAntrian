import { useState } from 'react';
import { updateCounterStatus } from '@/services/counter.api';

export function useUpdateCounterStatus(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const toggleStatus = async (id: number, status: 'aktif' | 'nonaktif') => {
		setLoading(true);
		try {
			await updateCounterStatus(id, status);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { toggleStatus, loading };
}
