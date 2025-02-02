// app/api/sidebar/dashboards/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDbOperations as db, UserDashboardRow } from '@/slices/sidebar/config/admin-db';
import { withAuth, withErrorHandler, ApiError } from '../middleware';
import { apiResponse, errorResponse } from '../utils';
import { createApiResponse } from '../config';
import { transformResponse} from '@/slices/sidebar/dashboard/types/api';
import { Dashboard } from '@/slices/sidebar/dashboard/types';
import { MenuItem } from '@/shared/types/navigation-types';

// Cache settings
const CACHE_CONTROL = 'public, s-maxage=10, stale-while-revalidate=59';

// Helper to attach menu items to dashboards
const attachMenuItems = (dashboards: Dashboard[], menuItems: MenuItem[]) => {
  return dashboards.map(dashboard => ({
    ...dashboard,
    menu_items: menuItems.filter(item => item.dashboardId === dashboard.id)
  }));
};

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId') || req.user.id;

      // Query for user dashboards with roles
      const query = `
        WITH user_dashboards AS (
          -- Get dashboards directly assigned to the user
          SELECT 
            d.*,
            u.dashboard_roles[array_position(u.dashboard_ids, d.id)] as user_role,
            u.name as user_name,
            u.email as user_email,
            CASE WHEN u.default_dashboard_id = d.id THEN true ELSE false END as is_default,
            COALESCE(d.menu_items, '[]'::jsonb) as menu_items
          FROM dashboards d
          JOIN users u ON d.id = ANY(u.dashboard_ids)
          WHERE u.id = $1 AND d.is_active = true

          UNION

          -- Get public dashboards not directly assigned to the user
          SELECT 
            d.*,
            'viewer' as user_role,
            u.name as user_name,
            u.email as user_email,
            false as is_default,
            COALESCE(d.menu_items, '[]'::jsonb) as menu_items
          FROM dashboards d
          CROSS JOIN users u
          WHERE u.id = $1 
            AND d.is_active = true 
            AND d.is_public = true
            AND NOT d.id = ANY(
              SELECT unnest(dashboard_ids) 
              FROM users 
              WHERE id = $1
            )
        )
        SELECT * FROM user_dashboards
        ORDER BY created_at DESC;
      `;
      const dashboardsResult = await db.query(query, [userId]);

      if (!dashboardsResult.rows.length) {
        throw new ApiError('No dashboards found', 404);
      }

      console.log('[Dashboards API] Query result:', {
        userId,
        count: dashboardsResult.rows.length,
        dashboards: dashboardsResult.rows
      });

      // Transform each row to Dashboard type
      const dashboards: Dashboard[] = dashboardsResult.rows.map(row => {
        // Parse menu_items if it's a string
        const menuItems = typeof row.menu_items === 'string' 
          ? JSON.parse(row.menu_items)
          : (row.menu_items || []);

        return transformResponse({
          ...row,
          menu_items: menuItems
        });
      });

      console.log('[Dashboards API] Transformed dashboards:', dashboards);

      // Revalidate the referer if provided
      const referer = request.headers.get('referer') ?? '/';
      revalidatePath(referer);

      // Attempt to fetch menu items (but don't fail if unavailable)
      try {
        const menuItemsResult = await db.getMenuItems();
        const menuItems = menuItemsResult.rows;
        console.log('[Dashboards API] Menu items:', menuItems);
        
        // Attach menu items to dashboards and wrap in API response
        const responseData = attachMenuItems(dashboards, menuItems);
        console.log('[Dashboards API] Final response data:', responseData);

        // Return serialized JSON response
        return new NextResponse(
          JSON.stringify({ data: responseData }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      } catch (error) {
        // If menu items fail, return dashboards without menu items
        console.log('[Dashboards API] Final response data (without menu items):', dashboards);
        
        // Return serialized JSON response
        return new NextResponse(
          JSON.stringify({ data: dashboards }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      }
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const body = await req.json();
      const { userId, role, isDefault, userName, userEmail, ...dashboardData } = body;
      
      if (!body.name) {
        throw new ApiError('Dashboard name is required', 400);
      }
      if (!userEmail) {
        throw new ApiError('User email is required', 400);
      }

      // Transaction to create dashboard and update user
      const dashboard = await db.transaction(async (client) => {
        let user;
        if (userId) {
          const userResult = await client.query(`SELECT * FROM users WHERE id = $1;`, [userId]);
          user = userResult.rows[0];
          if (!user) {
            throw new ApiError('User not found', 404);
          }
        } else {
          const existingUserResult = await client.query(`SELECT * FROM users WHERE email = $1;`, [userEmail]);
          if (existingUserResult.rows.length > 0) {
            user = existingUserResult.rows[0];
          } else {
            const newUserResult = await client.query(`
              INSERT INTO users (name, email)
              VALUES ($1, $2)
              RETURNING *;
            `, [userName || userEmail.split('@')[0], userEmail]);
            user = newUserResult.rows[0];
          }
        }

        const dashboardResult = await client.query(`
          INSERT INTO dashboards (name, description, logo, plan, is_public, is_active, menu_items)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `, [
          dashboardData.name,
          dashboardData.description || '',
          dashboardData.logo || 'layout-dashboard',
          dashboardData.plan || 'Personal',
          dashboardData.isPublic || false,
          true,
          JSON.stringify(dashboardData.menuItems || [])
        ]);
        const newDashboard = dashboardResult.rows[0];

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

      return apiResponse(createApiResponse(transformResponse(dashboard)));
    });
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const dashboardId = params.id;
      const data = await request.json();

      // Update dashboard query
      const query = `
        UPDATE dashboards 
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          logo = COALESCE($3, logo),
          is_public = COALESCE($4, is_public),
          menu_items = COALESCE($5::jsonb, menu_items),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6 AND is_active = true
        RETURNING *;
      `;

      // Convert menu items to JSONB
      const menuItemsJson = data.menuItems ? JSON.stringify(data.menuItems) : null;

      const result = await db.query(query, [
        data.name,
        data.description,
        data.logo,
        data.isPublic,
        menuItemsJson,
        dashboardId
      ]);

      if (!result.rows.length) {
        throw new ApiError('Dashboard not found', 404);
      }

      // Transform response
      const dashboard = transformResponse(result.rows[0]);
      
      return new NextResponse(
        JSON.stringify({ data: dashboard }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const { id, userId } = await request.json();
      if (!id || !userId) {
        throw new ApiError('Both dashboard ID and user ID are required', 400);
      }

      await db.transaction(async (client) => {
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

        await client.query('DELETE FROM menu_items WHERE dashboardId = $1', [id]);

        await client.query(`
          DELETE FROM dashboards d
          WHERE d.id = $1
          AND NOT EXISTS (
            SELECT 1 FROM users u 
            WHERE $1 = ANY(u.dashboard_ids)
          );
        `, [id]);
      });

      return apiResponse(createApiResponse({ success: true }));
    });
  });
}
