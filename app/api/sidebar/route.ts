import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminDbOperations as db } from 'slices/sidebar/config/admin-db';
import { User } from '@/shared/types/global';
import { MOCK_ADMIN_USER } from '@/shared/dev-tool/types';

// Types
interface DashboardResponse {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  is_public: boolean;
  is_active: boolean;
  menu_items: MenuItem[];
}

interface MenuItem {
  id: string;
  dashboard_id: string;
  title: string;
  icon?: string;
  url?: any;
  parent_id?: string;
  order_index?: number;
  type?: string;
  is_active: boolean;
}

// Helper function to handle API responses
const apiResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { status });
};

// Helper function to handle errors
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ error: message }, { status });
};

// Helper function to get current user
const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Since we're in an API route, we need to get the user from the session/token
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) {
      return null;
    }

    // For development, return mock admin user
    // In production, you would verify the token and get the user from the database
    return {
      ...MOCK_ADMIN_USER,
      role: 'admin',
      avatar: '/avatars/shadcn.jpg'
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// GET: Fetch user's dashboards and menus
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const dashboards = await db.getUserDashboards(user.id);
    const menuItems = await db.getMenuItems();

    const formattedDashboards: DashboardResponse[] = dashboards.rows.map((d: any) => ({
      ...d,
      menu_items: menuItems.rows.filter(m => m.dashboard_id === d.id)
    }));

    return apiResponse(formattedDashboards);
  } catch (error) {
    console.error('GET /api/sidebar error:', error);
    return errorResponse('Failed to fetch sidebar data');
  }
}

// POST: Create new dashboard or menu item
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'dashboard') {
      const dashboard = await db.create('dashboards', {
        name: data.name,
        description: data.description,
        logo: data.logo,
        plan: data.plan,
        is_public: data.is_public,
        is_active: data.is_active
      });

      // Assign dashboard to user
      await db.assignDashboardToUser(user.id, dashboard.rows[0].id);

      return apiResponse(dashboard.rows[0], 201);
    } else if (type === 'menu') {
      const menuItem = await db.create('menu_items', {
        dashboard_id: data.dashboard_id,
        title: data.title,
        icon: data.icon,
        url: data.url,
        parent_id: data.parent_id,
        order_index: data.order_index,
        type: data.type,
        is_active: data.is_active
      });

      return apiResponse(menuItem.rows[0], 201);
    }

    return errorResponse('Invalid type specified');
  } catch (error) {
    console.error('POST /api/sidebar error:', error);
    return errorResponse('Failed to create item');
  }
}

// PUT: Update dashboard or menu item
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'dashboard') {
      // Verify user has access to this dashboard
      const userDashboards = await db.getUserDashboards(user.id);
      const hasAccess = userDashboards.rows.some(d => d.id === id);
      
      if (!hasAccess) {
        return errorResponse('Unauthorized to modify this dashboard', 403);
      }

      const dashboard = await db.update('dashboards', id, {
        name: data.name,
        description: data.description,
        logo: data.logo,
        plan: data.plan,
        is_public: data.is_public,
        is_active: data.is_active
      });

      return apiResponse(dashboard.rows[0]);
    } else if (type === 'menu') {
      const menuItem = await db.update('menu_items', id, {
        title: data.title,
        icon: data.icon,
        url: data.url,
        parent_id: data.parent_id,
        order_index: data.order_index,
        type: data.type,
        is_active: data.is_active
      });

      return apiResponse(menuItem.rows[0]);
    }

    return errorResponse('Invalid type specified');
  } catch (error) {
    console.error('PUT /api/sidebar error:', error);
    return errorResponse('Failed to update item');
  }
}

// DELETE: Remove dashboard or menu item
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return errorResponse('Missing type or id parameter');
    }

    if (type === 'dashboard') {
      // Verify user has access to this dashboard
      const userDashboards = await db.getUserDashboards(user.id);
      const hasAccess = userDashboards.rows.some(d => d.id === id);
      
      if (!hasAccess) {
        return errorResponse('Unauthorized to delete this dashboard', 403);
      }

      await db.delete('dashboards', { id });
      await db.removeDashboardFromUser(user.id, id);

      return apiResponse({ message: 'Dashboard deleted successfully' });
    } else if (type === 'menu') {
      await db.delete('menu_items', { id });
      return apiResponse({ message: 'Menu item deleted successfully' });
    }

    return errorResponse('Invalid type specified');
  } catch (error) {
    console.error('DELETE /api/sidebar error:', error);
    return errorResponse('Failed to delete item');
  }
}