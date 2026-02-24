// src/hooks/useWeeklyShiftTemplate.ts
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { getWeeklyShiftAssignments } from '@/services/weekly.api';
import type { WeeklyShiftTemplateListResponse } from '@/modules/weeklyShiftTemplates/weeklyShiftTemplates.types';

export function useWeeklyShiftAssignment() {
	const [list, setList] = useState<WeeklyShiftTemplateListResponse>([]);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getWeeklyShiftAssignments();
			setList(data);
		} catch (error) {
			console.error('[useWeeklyShiftAssignment]', error);
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
