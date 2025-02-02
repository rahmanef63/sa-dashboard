// app/api/sidebar/utils.ts
import { NextResponse } from 'next/server';
import { API_CONFIG, createApiError } from './config';

export const apiResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Cache-Control': API_CONFIG.CACHE_CONTROL,
    },
  });
};

export const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(createApiError(message, status), { status });
};
