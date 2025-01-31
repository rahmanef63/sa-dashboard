import { NextRequest, NextResponse } from 'next/server';
import { adminDbOperations } from '@/shared/config/admin-db';
import { 
  DashboardCreateInput, 
  DashboardSchema,
  isDashboardSchema, 
  transformToCamelCase, 
  transformToSnakeCase 
} from '@/slices/dashboard/types/dashboard.types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    console.log('[Dashboards API] Fetching dashboards for user:', userId || 'all');
    
    const result = userId 
      ? await adminDbOperations.getUserDashboards(userId)
      : await adminDbOperations.getDashboards();

    const dashboards = Array.isArray(result) ? result : [];
    console.log('[Dashboards API] Found dashboards:', dashboards.length);
    
    const transformedDashboards = dashboards
      .filter(isDashboardSchema)
      .map(transformToCamelCase);
      
    return NextResponse.json({
      success: true,
      data: transformedDashboards
    });
  } catch (error: any) {
    console.error('[Dashboards API] GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch dashboards',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Dashboard name is required' },
        { status: 400 }
      );
    }

    // Transform and validate input data
    const dashboardData = {
      ...transformToSnakeCase(body as DashboardCreateInput),
      is_active: true,
      is_public: true
    };

    // Create dashboard
    const result = await adminDbOperations.create('dashboards', dashboardData);
    const dashboard = result.rows[0];
    
    if (!dashboard?.id) {
      throw new Error('Failed to create dashboard');
    }

    // Create default menu items for the dashboard
    await adminDbOperations.createDefaultMenuItems(dashboard.id);

    // Transform response to camelCase
    const transformedDashboard = transformToCamelCase(dashboard as DashboardSchema);

    return NextResponse.json({
      success: true,
      data: transformedDashboard
    });
  } catch (error: any) {
    console.error('[Dashboards API] POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create dashboard' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      );
    }

    const transformedData = {
      ...transformToSnakeCase(updateData),
      updated_at: new Date()
    };

    const { rows } = await adminDbOperations.update('dashboards', id, transformedData);
    const result = rows[0];
    
    if (!isDashboardSchema(result)) {
      console.error('[Dashboards API] Invalid data:', result);
      throw new Error('Invalid dashboard data returned from database');
    }

    return NextResponse.json({
      success: true,
      data: transformToCamelCase(result)
    });
  } catch (error: any) {
    console.error('[Dashboards API] PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update dashboard' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }
    
    await adminDbOperations.delete('dashboards', { id });
    
    return NextResponse.json({
      success: true,
      data: { id }
    });
  } catch (error: any) {
    console.error('[Dashboards API] DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete dashboard' },
      { status: 500 }
    );
  }
}
