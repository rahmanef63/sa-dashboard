import { NextRequest, NextResponse } from "next/server";
import { adminDbOperations, adminQuery } from "@/shared/config/admin-db";

const handleErrors = (error: any, method: string) => {
  console.error(`[Admin Dashboard Menu API] ${method} Error:`, error);
  return NextResponse.json(
    { success: false, error: error.message },
    { status: 500 }
  );
};

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

    const result = await adminDbOperations.getMenuItems(dashboardId);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    return handleErrors(error, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dashboard_id, menu_items } = body;

    if (!dashboard_id || !menu_items || !Array.isArray(menu_items)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    await adminDbOperations.transaction(async (client) => {
      // First, remove existing menu items for this dashboard
      await client.query(
        'DELETE FROM dashboard_menu_items WHERE dashboard_id = $1',
        [dashboard_id]
      );

      // Then insert the new menu items
      for (const item of menu_items) {
        await client.query(
          `INSERT INTO dashboard_menu_items 
           (dashboard_id, menu_item_id, is_enabled, order_index)
           VALUES ($1, $2, $3, $4)`,
          [dashboard_id, item.menu_item_id, item.is_enabled ?? true, item.order_index]
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard menu items updated successfully'
    });
  } catch (error: any) {
    return handleErrors(error, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { dashboard_id, menu_item_id, is_enabled, order_index } = body;

    if (!dashboard_id || !menu_item_id) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID and Menu Item ID are required' },
        { status: 400 }
      );
    }

    const result = await adminQuery(
      `UPDATE dashboard_menu_items
       SET is_enabled = $3, order_index = $4
       WHERE dashboard_id = $1 AND menu_item_id = $2
       RETURNING *`,
      [dashboard_id, menu_item_id, is_enabled, order_index]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    return handleErrors(error, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboardId');
    const menuItemId = searchParams.get('menuItemId');

    if (!dashboardId || !menuItemId) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID and Menu Item ID are required' },
        { status: 400 }
      );
    }

    await adminDbOperations.delete('dashboard_menu_items', {
      dashboard_id: dashboardId,
      menu_item_id: menuItemId
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard menu item removed successfully'
    });
  } catch (error: any) {
    return handleErrors(error, 'DELETE');
  }
}
