import { NextRequest, NextResponse } from "next/server";
import { adminDbOperations } from "@/shared/config/admin-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboardId');

    const result = await adminDbOperations.getMenuItems(dashboardId || undefined);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('[Menu API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, parent_id, order_index, icon, href, menu_type, is_active, is_collapsible } = body;

    const result = await adminDbOperations.create('menu_items', {
      id,
      title,
      parent_id,
      order_index,
      icon,
      href,
      menu_type,
      is_active,
      is_collapsible
    });

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('[Menu API] POST Error:', error);
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

    const result = await adminDbOperations.update('menu_items', id, updateData);

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('[Menu API] PUT Error:', error);
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
        { success: false, error: 'Menu item ID is required' },
        { status: 400 }
      );
    }

    await adminDbOperations.delete('menu_items', { id });

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error: any) {
    console.error('[Menu API] DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
