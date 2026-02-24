// src/utils/dateFormatter.ts
export function formatDate(value?: Date | string | null, withTime: boolean = true) {
	if (!value) return '-';

	const date = value instanceof Date ? value : new Date(value);

	const dateOptions: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
	};

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
	};

	return withTime
		? date.toLocaleString('id-ID', { ...dateOptions, ...timeOptions })
		: date.toLocaleDateString('id-ID', dateOptions);
}
