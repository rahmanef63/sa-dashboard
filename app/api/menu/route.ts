import { NextRequest, NextResponse } from 'next/server';
import { adminDbOperations } from '@/shared/config/admin-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboardId');

    if (!dashboardId) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }

    const menuItems = await adminDbOperations.getMenuItems(dashboardId);

    return NextResponse.json({
      success: true,
      data: menuItems
    });
  } catch (error: any) {
    console.error('[Menu API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
