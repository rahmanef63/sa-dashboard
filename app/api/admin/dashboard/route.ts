import { NextRequest, NextResponse } from "next/server";
import { adminDbOperations } from "@/shared/config/admin-db";

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
    console.error('[Admin Dashboard API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, logo, plan, default_menu_id, user_id } = body;

    // Use transaction to create dashboard and link it to user
    await adminDbOperations.transaction(async (client) => {
      // Create dashboard
      const dashboardResult = await client.query(
        `INSERT INTO dashboards (id, name, logo, plan, default_menu_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, name, logo, plan, default_menu_id]
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
      message: 'Dashboard created successfully'
    });
  } catch (error: any) {
    console.error('[Admin Dashboard API] POST Error:', error);
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
    console.error('[Admin Dashboard API] PUT Error:', error);
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
      // Delete dashboard menu items
      await client.query(
        'DELETE FROM dashboard_menu_items WHERE dashboard_id = $1',
        [id]
      );

      // Delete user dashboard links
      await client.query(
        'DELETE FROM user_dashboards WHERE dashboard_id = $1',
        [id]
      );

      // Delete dashboard
      await client.query(
        'DELETE FROM dashboards WHERE id = $1',
        [id]
      );
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard and related data deleted successfully'
    });
  } catch (error: any) {
    console.error('[Admin Dashboard API] DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
