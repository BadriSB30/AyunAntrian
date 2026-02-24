// src/hooks/useUpdateWeeklyShiftTemplate.ts
import { useCallback, useState } from 'react';
import { updateWeeklyShiftTemplate } from '@/services/weekly.api';
import type { UpdateWeeklyShiftTemplateDTO } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

export function useUpdateWeeklyShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = useCallback(
		async (id: number, data: UpdateWeeklyShiftTemplateDTO) => {
			try {
				setLoading(true);
				await updateWeeklyShiftTemplate(id, data);
				onSuccess?.();
			} finally {
				setLoading(false);
			}
		},
		[onSuccess]
	);

	return { submit, loading };
}
