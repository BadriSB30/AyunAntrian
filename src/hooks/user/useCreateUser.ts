// src/hooks/useCreateUser.ts
import { useState } from 'react';

import { createUser } from '@/services/user.api';
import type { CreateUserDTO } from '@/modules/user/user.types';

export function useCreateUser(onSuccess?: () => void) {
	const [loading, setLoading] = useState(false);

	const submit = async (payload: CreateUserDTO) => {
		try {
			setLoading(true);
			await createUser(payload);
			onSuccess?.();
		} finally {
			setLoading(false);
		}
	};

	return { submit, loading };
}
