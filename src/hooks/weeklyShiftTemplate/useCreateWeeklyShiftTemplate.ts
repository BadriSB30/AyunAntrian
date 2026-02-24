// src/hooks/useCreateWeeklyShiftTemplate.ts
import { useState } from 'react';

import { createWeeklyShiftTemplate } from '@/services/weekly.api';
import type { CreateWeeklyShiftTemplateDTO } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

export function useCreateWeeklyShiftTemplate(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = async (payload: CreateWeeklyShiftTemplateDTO) => {
		try {
			setLoading(true);
			await createWeeklyShiftTemplate(payload);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { submit, loading };
}
