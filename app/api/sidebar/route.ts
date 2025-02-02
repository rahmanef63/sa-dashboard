// app/api/sidebar/route.ts
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { withAuth, withErrorHandler } from './middleware';
import { apiResponse, errorResponse } from './utils';
import { adminDbOperations as db } from '@/slices/sidebar/config/admin-db';
import { transformResponse } from '@/slices/sidebar/dashboard/types/api';
import { DashboardUserRow, transformQueryToDashboardRow, QueryRow } from '@/shared/types/dashboard';
import type { QueryResultRow } from 'pg';

// Transform database row to API type
const transformToApiType = (row: QueryResultRow): DashboardUserRow => {
  const queryRow: QueryRow = {
    id: row.id as string,
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
    ...row
  };
  return transformQueryToDashboardRow(queryRow);
};

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const headersList = req.headers;
      const referer = headersList.get('referer') || '';
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId') || req.user.id;

      const dashboardsResult = await db.getUserDashboards(userId);
      const menuItemsResult = await db.getMenuItems();

      if (!dashboardsResult.rows.length) {
        return errorResponse('No dashboards found', 404);
      }

      // Transform the results before returning
      const dashboards = dashboardsResult.rows.map(row => {
        const dashboard = transformToApiType(row);
        return {
          ...transformResponse(dashboard),
          menu_items: menuItemsResult.rows.filter(item => item.dashboard_id === dashboard.id)
        };
      });

      if (referer) {
        revalidatePath(referer);
      }

      return apiResponse(dashboards);
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const data = await request.json();

      if (!data.name || typeof data.name !== 'string') {
        return errorResponse('Invalid dashboard name', 400);
      }

      const dashboardResult = await db.create('dashboards', {
        name: data.name,
        description: data.description,
        logo: data.logo,
        plan: data.plan,
        is_public: data.isPublic ?? true,
        is_active: data.isActive ?? true,
      });

      const dashboard = transformToApiType(dashboardResult.rows[0]);
      await db.assignDashboardToUser(req.user.id, dashboard.id);

      const menuItems = await db.createDefaultMenuItems(dashboard.id);

      revalidatePath('/dashboard');

      return apiResponse({
        ...transformResponse(dashboard),
        menu_items: menuItems.rows.map(item => transformToApiType(item))
      }, 201);
    });
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const data = await request.json();

      if (!data.id) {
        return errorResponse('Dashboard ID is required', 400);
      }

      const userDashboards = await db.getUserDashboards(req.user.id);
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

      const dashboard = transformToApiType(dashboardResult.rows[0]);
      const menuItems = await db.getMenuItems(dashboard.id);

      revalidatePath('/dashboard');

      return apiResponse({
        ...transformResponse(dashboard),
        menu_items: menuItems.rows
      });
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      if (!id) {
        return errorResponse('Dashboard ID is required', 400);
      }

      const userDashboards = await db.getUserDashboards(req.user.id);
      const hasAccess = userDashboards.rows.some(d => d.id === id);
      if (!hasAccess) {
        return errorResponse('Unauthorized to delete this dashboard', 403);
      }

      await db.delete('dashboards', { id });
      await db.removeDashboardFromUser(req.user.id, id);

      revalidatePath('/dashboard');

      return apiResponse({ success: true, message: 'Dashboard deleted successfully' });
    });
  });
}
