import { fail } from './api-response';
import { HttpError } from './error';

export function handleError(error: unknown) {
	if (error instanceof HttpError) {
		return fail(error.message, error.status);
	}

	console.error(error);
	return fail('Internal Server Error', 500);
}
