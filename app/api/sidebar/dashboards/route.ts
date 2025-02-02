import { NextRequest, NextResponse } from 'next/server';
import { adminDbOperations } from '@/slices/sidebar/config/admin-db';
import { 
  DashboardCreateInput, 
  DashboardSchema,
} from '@/slices/sidebar/dashboard/types';
import { transformToCamelCase, transformToSnakeCase } from '@/slices/sidebar/dashboard/types/transforms';
import { QueryResult } from 'pg';

interface DashboardWithRole extends DashboardSchema {
  userRole?: string;
  isDefault?: boolean;
  userName?: string;
  userEmail?: string;
  userNames?: string[];
  userEmails?: string[];
  userRoles?: string[];
}

const isDashboardSchema = (obj: any): obj is DashboardSchema => {
  const requiredKeys = ['id', 'name', 'description', 'logo', 'plan', 'isPublic', 'isActive', 'createdAt', 'updatedAt'] as const;
  return requiredKeys.every(key => key in obj);
};

// Added module-level cache for dashboards
let dashboardCache: { data: any, timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

export async function GET(request: NextRequest) {
  // Get auth status from request headers or cookies
  const authToken = request.headers.get('authorization') || request.cookies.get('auth-token');
  
  if (!authToken) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check cache before processing the request
  if (dashboardCache && (Date.now() - dashboardCache.timestamp < CACHE_DURATION)) {
    console.log('[Debug] Using cached dashboards');
    return NextResponse.json({ success: true, data: dashboardCache.data });
  }

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
    
    let result;
    if (userId) {
      const query = `
        SELECT 
          d.id,
          d.name,
          d.description,
          d.logo,
          d.plan,
          d.is_public,
          d.is_active,
          d.created_at,
          d.updated_at
        FROM dashboards d
        WHERE d.is_active = true
        ORDER BY d.created_at DESC
        LIMIT 50
      `;
      try {
        console.log('[Debug] Executing query:', query.trim());
        result = await adminDbOperations.query(query);
        console.log('[Debug] Query result:', JSON.stringify(result.rows, null, 2));
        
        // Update cache with fresh results
        dashboardCache = { data: result.rows, timestamp: Date.now() };
      } catch (error) {
        console.error('[Database Error]', error);
        throw new Error('Failed to fetch dashboards');
      }
    } else {
      const query = `
        SELECT 
          d.id,
          d.name,
          d.description,
          d.logo,
          d.plan,
          d.is_public,
          d.is_active,
          d.created_at,
          d.updated_at
        FROM dashboards d
        WHERE d.is_active = true
        ORDER BY d.created_at DESC
        LIMIT 50
      `;
      try {
        console.log('[Debug] Executing query:', query.trim());
        result = await adminDbOperations.query(query);
        console.log('[Debug] Query result:', JSON.stringify(result.rows, null, 2));
        
        // Update cache with fresh results
        dashboardCache = { data: result.rows, timestamp: Date.now() };
      } catch (error) {
        console.error('[Database Error]', error);
        throw new Error('Failed to fetch dashboards');
      }
    }

    const dashboards = result.rows as DashboardWithRole[];
    console.log('[Dashboards API] Found dashboards:', dashboards.length);
    
    const transformedDashboards = dashboards
      .filter(isDashboardSchema)
      .map((dashboard: DashboardWithRole) => ({
        ...transformToCamelCase(dashboard),
        userRole: dashboard.userRole || dashboard.userRoles,
        isDefault: dashboard.isDefault || false,
        userName: dashboard.userName || dashboard.userNames,
        userEmail: dashboard.userEmail || dashboard.userEmails
      }));

    return NextResponse.json({ success: true, data: transformedDashboards });
  } catch (error) {
    console.error('[Dashboards API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, role, isDefault, userName, userEmail, ...dashboardData } = body;
    
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Dashboard name is required' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'User email is required' },
        { status: 400 }
      );
    }

    // Start a transaction
    const dashboard = await adminDbOperations.transaction(async (client) => {
      // Check if user exists or create a new one
      let user;
      if (userId) {
        const userResult = await client.query(`
          SELECT * FROM users WHERE id = $1;
        `, [userId]);
        user = userResult.rows[0];
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          );
        }
      } else {
        // Check if user exists by email
        const existingUserResult = await client.query(`
          SELECT * FROM users WHERE email = $1;
        `, [userEmail]);
        
        if (existingUserResult.rows.length > 0) {
          user = existingUserResult.rows[0];
        } else {
          // Create new user
          const newUserResult = await client.query(`
            INSERT INTO users (name, email)
            VALUES ($1, $2)
            RETURNING *;
          `, [userName || userEmail.split('@')[0], userEmail]);
          user = newUserResult.rows[0];
        }
      }

      // Create dashboard
      const dashboardResult = await client.query(`
        INSERT INTO dashboards (name, description, logo, plan, is_public, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `, [
        dashboardData.name,
        dashboardData.description || '',
        dashboardData.logo || 'layout-dashboard',
        dashboardData.plan || 'Personal',
        dashboardData.isPublic || false,
        true
      ]);

      const newDashboard = dashboardResult.rows[0];

      // Update user's dashboard arrays
      await client.query(`
        UPDATE users 
        SET 
          dashboard_ids = array_append(dashboard_ids, $1),
          dashboard_roles = array_append(dashboard_roles, $2),
          default_dashboard_id = CASE 
            WHEN $3 = true OR default_dashboard_id IS NULL 
            THEN $1 
            ELSE default_dashboard_id 
          END
        WHERE id = $4;
      `, [newDashboard.id, role || 'owner', isDefault || false, user.id]);

      // Create default menu items
      await client.query(`
        INSERT INTO menu_items (dashboard_id, title, icon, url, type, order_index)
        VALUES 
          ($1, 'Dashboard', 'layout-dashboard', '{"href":"/"}', 'main', 1),
          ($1, 'Settings', 'settings', '{"href":"/settings"}', 'main', 2);
      `, [newDashboard.id]);

      // Return the complete dashboard info
      const finalDashboardResult = await client.query(`
        SELECT 
          d.*,
          u.dashboard_roles[array_position(u.dashboard_ids, d.id)] as user_role,
          CASE WHEN u.default_dashboard_id = d.id THEN true ELSE false END as is_default,
          u.name as user_name,
          u.email as user_email
        FROM dashboards d
        JOIN users u ON d.id = ANY(u.dashboard_ids)
        WHERE d.id = $1 AND u.id = $2;
      `, [newDashboard.id, user.id]);

      return finalDashboardResult.rows[0];
    });

    return NextResponse.json({ success: true, data: dashboard });
  } catch (error) {
    console.error('[Dashboards API] POST Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred while creating the dashboard'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, isDefault, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dashboard ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0 && isDefault === undefined) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      );
    }

    const dashboard = await adminDbOperations.transaction(async (client) => {
      // Update dashboard data if provided
      if (Object.keys(updateData).length > 0) {
        const transformedData = {
          ...transformToSnakeCase(updateData),
          updated_at: new Date()
        };

        await client.query(`
          UPDATE dashboards
          SET ${Object.keys(transformedData).map((key, i) => `${key} = $${i + 1}`).join(', ')}
          WHERE id = $${Object.keys(transformedData).length + 1}
          RETURNING *;
        `, [...Object.values(transformedData), id]);
      }

      // Update default dashboard status if specified
      if (isDefault !== undefined) {
        await client.query(`
          UPDATE users
          SET default_dashboard_id = CASE 
            WHEN $1 = true THEN $2
            WHEN default_dashboard_id = $2 THEN NULL
            ELSE default_dashboard_id
          END
          WHERE id = $3;
        `, [isDefault, id, userId]);
      }

      // Return updated dashboard with user info
      const result = await client.query(`
        SELECT 
          d.*,
          u.dashboard_roles[array_position(u.dashboard_ids, d.id)] as user_role,
          CASE WHEN u.default_dashboard_id = d.id THEN true ELSE false END as is_default,
          u.name as user_name,
          u.email as user_email
        FROM dashboards d
        JOIN users u ON d.id = ANY(u.dashboard_ids)
        WHERE d.id = $1 AND u.id = $2;
      `, [id, userId]);

      return result.rows[0];
    });

    if (!dashboard) {
      return NextResponse.json(
        { success: false, error: 'Dashboard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: transformToCamelCase(dashboard)
    });
  } catch (error) {
    console.error('[Dashboards API] PUT Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update dashboard' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: 'Both dashboard ID and user ID are required' },
        { status: 400 }
      );
    }

    await adminDbOperations.transaction(async (client) => {
      // Remove dashboard from user's arrays
      await client.query(`
        UPDATE users
        SET 
          dashboard_ids = array_remove(dashboard_ids, $1),
          dashboard_roles = array_remove(dashboard_roles, dashboard_roles[array_position(dashboard_ids, $1)]),
          default_dashboard_id = CASE 
            WHEN default_dashboard_id = $1 THEN NULL 
            ELSE default_dashboard_id 
          END
        WHERE id = $2;
      `, [id, userId]);

      // Delete menu items
      await client.query('DELETE FROM menu_items WHERE dashboard_id = $1', [id]);

      // Delete dashboard if no users have it
      await client.query(`
        DELETE FROM dashboards d
        WHERE d.id = $1
        AND NOT EXISTS (
          SELECT 1 FROM users u 
          WHERE $1 = ANY(u.dashboard_ids)
        );
      `, [id]);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE Dashboard]', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the dashboard' 
      }, 
      { status: 500 }
    );
  }
}
