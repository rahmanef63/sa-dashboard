import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { User } from '@/shared/types/global';
import { API_CONFIG, createApiError } from './config';

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export class ApiError extends Error {
  constructor(public message: string, public status: number = 400) {
    super(message);
    this.name = 'ApiError';
  }
}

export const authenticate = async (request: NextRequest): Promise<User> => {
  if (process.env.NODE_ENV === 'development') {
    return API_CONFIG.DEV.MOCK_USER;
  }

  const cookieStore = cookies();
  const token = cookieStore.get(API_CONFIG.AUTH_COOKIE_NAME);
  
  if (!token) {
    throw new ApiError('Unauthorized access', 401);
  }

  // TODO: Implement proper JWT verification
  return API_CONFIG.DEV.MOCK_USER;
};

export const withAuth = async (
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> => {
  try {
    const user = await authenticate(request);
    const authenticatedRequest = Object.assign(request, { user }) as AuthenticatedRequest;
    return await handler(authenticatedRequest);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        createApiError(error.message, error.status),
        { status: error.status }
      );
    }
    return NextResponse.json(
      createApiError('Internal server error', 500),
      { status: 500 }
    );
  }
};

export const withErrorHandler = async (
  handler: () => Promise<NextResponse>
): Promise<NextResponse> => {
  try {
    return await handler();
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        createApiError(error.message, error.status),
        { status: error.status }
      );
    }
    return NextResponse.json(
      createApiError('Internal server error', 500),
      { status: 500 }
    );
  }
};
