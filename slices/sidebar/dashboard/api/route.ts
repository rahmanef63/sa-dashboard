import { NextRequest, NextResponse } from "next/server";
import { adminDbOperations } from "@/slices/sidebar/config/admin-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let result;
    if (userId) {
      result = await adminDbOperations.getUserDashboards(userId);
    } else {
      result = await adminDbOperations.getDashboards();
    }

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('[Dashboard API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, logo, plan, is_public, user_id } = body;

    // Use transaction to create dashboard and link it to user
    const result = await adminDbOperations.transaction(async (client) => {
      // Create dashboard
      const dashboardResult = await client.query(
        `INSERT INTO dashboards (id, name, description, logo, plan, is_public)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, name, description, logo, plan, is_public]
      );

      // Create default menu for the dashboard
      const menuResult = await client.query(
        `INSERT INTO menu_items (id, title, icon, href, menu_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [`${id}-menu`, 'Main Menu', 'layout-dashboard', '/dashboard', 'main', true]
      );

      // Link menu to dashboard
      await client.query(
        `UPDATE dashboards 
         SET default_menu_id = $1
         WHERE id = $2
         RETURNING *`,
        [menuResult.rows[0].id, id]
      );

      // If user_id is provided, link dashboard to user
      if (user_id) {
        await client.query(
          `INSERT INTO user_dashboards (user_id, dashboard_id)
           VALUES ($1, $2)`,
          [user_id, id]
        );
      }

      return dashboardResult.rows[0];
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[Dashboard API] POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const result = await adminDbOperations.update('dashboards', id, updateData);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('[Dashboard API] PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
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

    // Use transaction to delete dashboard and its relationships
    await adminDbOperations.transaction(async (client) => {
      // Delete user-dashboard relationships
      await client.query(
        'DELETE FROM user_dashboards WHERE dashboard_id = $1',
        [id]
      );

      // Delete dashboard-menu relationships
      await client.query(
        'DELETE FROM dashboard_menu_items WHERE dashboard_id = $1',
        [id]
      );

      // Delete the dashboard
      await client.query(
        'DELETE FROM dashboards WHERE id = $1',
        [id]
      );
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard deleted successfully'
    });
  } catch (error: any) {
    console.error('[Dashboard API] DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
