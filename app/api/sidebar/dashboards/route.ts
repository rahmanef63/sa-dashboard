import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { adminDbOperations as db } from '@/slices/sidebar/config/admin-db';
import { AuthenticatedRequest, withAuth, withErrorHandler, ApiError } from '../middleware';
import { createApiResponse } from '../config';
import { transformResponse, UserDashboardRow } from '@/slices/sidebar/dashboard/types/api';
import { Dashboard } from '@/slices/sidebar/dashboard/types';
import { MenuItem } from '@/shared/types/navigation-types';

// Cache for dashboard data
let dashboardCache: { data: UserDashboardRow[]; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    return withErrorHandler(async () => {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId') || req.user.id;

      // Query to get user's dashboards with roles
      const query = `
        SELECT 
          d.*,
          u.dashboard_roles[array_position(u.dashboard_ids, d.id)] as user_role,
          u.name as user_name,
          u.email as user_email,
          CASE WHEN u.default_dashboard_id = d.id THEN true ELSE false END as is_default
        FROM dashboards d
        JOIN users u ON d.id = ANY(u.dashboard_ids)
        WHERE u.id = $1 AND d.is_active = true
        ORDER BY d.created_at DESC;
      `;

      const dashboardsResult = await db.query<UserDashboardRow>(query, [userId]);

      if (!dashboardsResult.rows.length) {
        throw new ApiError('No dashboards found', 404);
      }

      // Transform the response
      const dashboards = dashboardsResult.rows.map(dashboard => ({
        ...transformResponse(dashboard),
        menu_items: [] as MenuItem[] // Explicitly type the menu_items array
      }));

      try {
        // Try to fetch menu items, but don't fail if they don't exist
        const menuItemsResult = await db.query<MenuItem>(`
          SELECT * FROM menu_items 
          WHERE dashboard_id IN (${dashboardsResult.rows.map((_, i) => `$${i + 1}`).join(',')})
        `, dashboardsResult.rows.map(d => d.id));

        // If menu items exist, add them to the dashboards
        if (menuItemsResult.rows.length > 0) {
          dashboards.forEach(dashboard => {
            dashboard.menu_items = menuItemsResult.rows.filter(item => item.dashboard_id === dashboard.id);
          });
        }
      } catch (error) {
        console.warn('Menu items not available:', error);
        // Continue without menu items
      }

      // Revalidate the path
      const referer = req.headers.get('referer') || '';
      if (referer) {
        revalidatePath(referer);
      }

      return NextResponse.json(createApiResponse(dashboards));
    });
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    return withErrorHandler(async () => {
      const body = await req.json();
      const { userId, role, isDefault, userName, userEmail, ...dashboardData } = body;
      
      if (!body.name) {
        throw new ApiError('Dashboard name is required', 400);
      }

      if (!userEmail) {
        throw new ApiError('User email is required', 400);
      }

      // Start a transaction
      const dashboard = await db.transaction(async (client) => {
        // Check if user exists or create a new one
        let user;
        if (userId) {
          const userResult = await client.query(`
            SELECT * FROM users WHERE id = $1;
          `, [userId]);
          user = userResult.rows[0];
          if (!user) {
            throw new ApiError('User not found', 404);
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

      return NextResponse.json(createApiResponse(transformResponse(dashboard)));
    });
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    return withErrorHandler(async () => {
      const body = await req.json();
      const { id, userId, isDefault, ...updateData } = body;
      
      if (!id) {
        throw new ApiError('Dashboard ID is required', 400);
      }

      if (!userId) {
        throw new ApiError('User ID is required', 400);
      }

      if (Object.keys(updateData).length === 0 && isDefault === undefined) {
        throw new ApiError('No update data provided', 400);
      }

      const dashboard = await db.transaction(async (client) => {
        // Update dashboard data if provided
        if (Object.keys(updateData).length > 0) {
          await client.query(`
            UPDATE dashboards
            SET ${Object.keys(updateData).map((key, i) => `${key} = $${i + 1}`).join(', ')}
            WHERE id = $${Object.keys(updateData).length + 1}
            RETURNING *;
          `, [...Object.values(updateData), id]);
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
        throw new ApiError('Dashboard not found', 404);
      }

      return NextResponse.json(createApiResponse(transformResponse(dashboard)));
    });
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    return withErrorHandler(async () => {
      const { id, userId } = await req.json();

      if (!id || !userId) {
        throw new ApiError('Both dashboard ID and user ID are required', 400);
      }

      await db.transaction(async (client) => {
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

      return NextResponse.json(createApiResponse({ success: true }));
    });
  });
}
