// src/core/http/response.ts

import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200) {
	return NextResponse.json(
		{
			success: true,
			data,
		},
		{ status }
	);
}

export function created<T>(data: T) {
	return ok(data, 201);
}

export function fail(message: string, status = 400) {
	return NextResponse.json(
		{
			success: false,
			message,
		},
		{ status }
	);
}
