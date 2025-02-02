import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { adminDbOperations as db } from 'slices/sidebar/config/admin-db';
import { User } from '@/shared/types/global';
import { MOCK_ADMIN_USER } from '@/shared/dev-tool/types';
import { revalidatePath } from 'next/cache';
import type { MenuItem as MenuItemSchema } from '@/shared/types/navigation-types';
import type { Dashboard } from '@/slices/sidebar/dashboard/types';
import { transformResponse } from '@/slices/sidebar/dashboard/types/api';

// Types
export interface DashboardResponse extends Dashboard {
  menu_items: MenuItemSchema[];
}

// API Response handlers with proper typing
const apiResponse = <T>(data: T, status: number = 200) => {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
    },
  });
};

const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() }, 
    { status }
  );
};

// Development authentication middleware
const authenticate = async (request: NextRequest): Promise<User> => {
  // In development, always return mock admin user
  if (process.env.NODE_ENV === 'development') {
    return MOCK_ADMIN_USER;
  }

  // For production, implement proper authentication
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');
  
  if (!token) {
    throw new Error('Unauthorized access');
  }

  // TODO: Implement proper JWT verification
  return MOCK_ADMIN_USER;
};

// Request validation
const validateRequest = async (request: NextRequest) => {
  try {
    const user = await authenticate(request);
    return user;
  } catch (error) {
    throw new Error('Unauthorized access');
  }
};

// Transform database response to API response
const transformDashboardResponse = (
  dashboard: any,
  menuItems: MenuItemSchema[] = []
): DashboardResponse => {
  const transformed = transformResponse(dashboard);
  return {
    ...transformed,
    menu_items: menuItems,
  };
};

// GET handler with proper error handling and caching
export async function GET(request: NextRequest) {
  try {
    const user = await validateRequest(request);
    const headersList = headers();
    const referer = headersList.get('referer') || '';

    // Extract userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // In development, allow access to all dashboards
    const dashboardsResult = await db.getUserDashboards(userId || user.id);
    const menuItemsResult = await db.getMenuItems();

    if (!dashboardsResult.rows.length) {
      return errorResponse('No dashboards found', 404);
    }

    // Transform the response
    const dashboards: DashboardResponse[] = dashboardsResult.rows.map(dashboard => 
      transformDashboardResponse(
        dashboard,
        menuItemsResult.rows.filter(item => item.dashboard_id === dashboard.id)
      )
    );

    // Revalidate the path to ensure fresh data
    revalidatePath(referer);

    return apiResponse(dashboards);
  } catch (error) {
    console.error('GET error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 
      error instanceof Error && error.message === 'Unauthorized access' ? 401 : 500
    );
  }
}

// POST handler with validation
export async function POST(request: NextRequest) {
  try {
    const user = await validateRequest(request);
    const data = await request.json();

    if (!data.name || typeof data.name !== 'string') {
      return errorResponse('Invalid dashboard name');
    }

    const dashboardResult = await db.create('dashboards', {
      name: data.name,
      description: data.description,
      logo: data.logo,
      plan: data.plan,
      is_public: data.isPublic ?? true,
      is_active: data.isActive ?? true,
    });

    const dashboard = dashboardResult.rows[0];
    await db.assignDashboardToUser(user.id, dashboard.id);

    // Create default menu items
    const menuItems = await db.createDefaultMenuItems(dashboard.id);

    // Invalidate cache
    revalidatePath('/dashboard');

    return apiResponse(transformDashboardResponse(dashboard, menuItems.rows), 201);
  } catch (error) {
    console.error('POST error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 
      error instanceof Error && error.message === 'Unauthorized access' ? 401 : 500
    );
  }
}

// PUT handler with validation
export async function PUT(request: NextRequest) {
  try {
    const user = await validateRequest(request);
    const data = await request.json();

    if (!data.id) {
      return errorResponse('Dashboard ID is required');
    }

    // Verify user has access to this dashboard
    const userDashboards = await db.getUserDashboards(user.id);
    const hasAccess = userDashboards.rows.some(d => d.id === data.id);
    
    if (!hasAccess) {
      return errorResponse('Unauthorized to modify this dashboard', 403);
    }

    const dashboardResult = await db.update('dashboards', data.id, {
      name: data.name,
      description: data.description,
      logo: data.logo,
      plan: data.plan,
      is_public: data.isPublic,
      is_active: data.isActive,
    });

    const dashboard = dashboardResult.rows[0];
    const menuItems = await db.getMenuItems(dashboard.id);

    // Invalidate cache
    revalidatePath('/dashboard');

    return apiResponse(transformDashboardResponse(dashboard, menuItems.rows));
  } catch (error) {
    console.error('PUT error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 
      error instanceof Error && error.message === 'Unauthorized access' ? 401 : 500
    );
  }
}

// DELETE handler with validation
export async function DELETE(request: NextRequest) {
  try {
    const user = await validateRequest(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Dashboard ID is required');
    }

    // Verify user has access to this dashboard
    const userDashboards = await db.getUserDashboards(user.id);
    const hasAccess = userDashboards.rows.some(d => d.id === id);
    
    if (!hasAccess) {
      return errorResponse('Unauthorized to delete this dashboard', 403);
    }

    await db.delete('dashboards', { id });
    await db.removeDashboardFromUser(user.id, id);

    // Invalidate cache
    revalidatePath('/dashboard');

    return apiResponse({ success: true, message: 'Dashboard deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 
      error instanceof Error && error.message === 'Unauthorized access' ? 401 : 500
    );
  }
}