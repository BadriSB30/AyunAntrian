'use client';

import { useQueues } from './useQueue';
import { useQueuesAdmin } from './useQueueAdmin';
import { Role } from '@/types/enums';

export function useQueueByRole(role?: Role) {
	const isReady = role === Role.ADMIN || role === Role.SUPERADMIN;

	const superadmin = useQueues({
		enabled: isReady && role === Role.SUPERADMIN,
	});

	const admin = useQueuesAdmin({
		enabled: isReady && role === Role.ADMIN,
	});

	if (!isReady) {
		return {
			list: [],
			loading: true,
			refresh: async () => {},
		};
	}

	return role === Role.ADMIN ? admin : superadmin;
}
