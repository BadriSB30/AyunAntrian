// src/hooks/useDeleteWeeklyShiftTemplate.ts
import { useCallback, useState } from 'react';
import { deleteWeeklyShiftTemplate } from '@/services/weekly.api';

export function useDeleteWeeklyShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const remove = useCallback(
		async (id: number) => {
			try {
				setLoading(true);
				await deleteWeeklyShiftTemplate(id);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess],
	);

	return { remove, loading };
}
