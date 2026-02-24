// src/hooks/useDeleteShiftTemplate.ts
import { useCallback, useState } from 'react';
import { deleteShift } from '@/services/shift.api';

export function useDeleteShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const remove = useCallback(
		async (id: number) => {
			if (!confirm('Menghapus Shift ini?')) return;

			try {
				setLoading(true);
				await deleteShift(id);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess]
	);

	return { remove, loading };
}
