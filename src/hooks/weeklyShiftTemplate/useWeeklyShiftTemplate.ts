// src/hooks/useWeeklyShiftsTemplate.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { getWeeklyShiftTemplates } from '@/services/weekly.api';
import type { WeeklyShiftTemplateListResponse } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

export function useWeeklyShiftTemplate() {
	const [list, setList] = useState<WeeklyShiftTemplateListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getWeeklyShiftTemplates();
			setList(data);
		} catch (error) {
			console.error('[useWeeklyShiftTemplates]', error);
			toast.error('Gagal memuat daftar shift');
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
