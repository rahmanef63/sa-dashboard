// Modification: Added array operations, updated user queries, and modified dashboard queries.

// shared/config/admin-db.ts

import { Pool, PoolConfig, QueryResult, QueryResultRow } from 'pg';

// Database error type
interface DbError extends Error {
  code?: string;
}

// Ensure this code only runs on the server side
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

// Admin database configuration
const adminDbConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.ADMIN_DB, // Using ADMIN_DB from .env
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection
  maxUses: 7500, // Close and replace a connection after it has been used this many times
  allowExitOnIdle: true // Allow the pool to exit when there are no connections
};

// Create a singleton pool for the admin database
const adminPool = new Pool(adminDbConfig);

// Test the connection
adminPool.on('connect', () => {
  console.log('Connected to Admin PostgreSQL database');
});

adminPool.on('error', (err: DbError) => {
  console.error('Unexpected error on admin database client', err);
  // Don't exit the process, just log the error
  // process.exit(-1);
});

// Helper function for queries with retry logic
export async function adminQuery<T extends QueryResultRow = any>(
  text: string,
  values?: any[]
): Promise<QueryResult<T>> {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const client = await adminPool.connect();
      try {
        const result = await client.query<T>(text, values);
        if (!result) {
          throw new Error('Query returned no result');
        }
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      console.log(`Retrying query (attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError || new Error('Query failed after all retries');
}

// Admin database operations
export const adminDbOperations = {
  // Direct query method
  query: async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> => {
    return adminQuery<T>(text, params);
  },

  // Table Operations
  listTables: async (): Promise<QueryResult<{ table_name: string }>> => {
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    return adminQuery<{ table_name: string }>(sql);
  },

  // User Operations
  createUser: async (name: string, email: string): Promise<QueryResult<BaseRow & { name: string; email: string }>> => {
    const sql = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *;
    `;
    return adminQuery<BaseRow & { name: string; email: string }>(sql, [name, email]);
  },

  getUser: async (userId: string): Promise<QueryResult<BaseRow & { name: string; email: string }>> => {
    const sql = `
      SELECT * FROM users WHERE id = $1;
    `;
    return adminQuery<BaseRow & { name: string; email: string }>(sql, [userId]);
  },

  getUserByEmail: async (email: string): Promise<QueryResult<BaseRow & { name: string; email: string }>> => {
    const sql = `
      SELECT * FROM users WHERE email = $1;
    `;
    return adminQuery<BaseRow & { name: string; email: string }>(sql, [email]);
  },

  // Generic CRUD Operations
  create: async <T extends QueryResultRow>(
    tableName: string,
    data: Record<string, any>
  ): Promise<QueryResult<T>> => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);

    const sql = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *;
    `;
    return adminQuery<T>(sql, values);
  },

  read: async <T extends QueryResultRow>(
    tableName: string,
    conditions?: Record<string, any>,
    orderBy?: string,
    limit?: number
  ): Promise<QueryResult<T>> => {
    let sql = `SELECT * FROM ${tableName}`;
    const values: any[] = [];
    
    if (conditions && Object.keys(conditions).length > 0) {
      const whereClauses = Object.entries(conditions).map(([key, _], index) => `${key} = $${index + 1}`);
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
      values.push(...Object.values(conditions));
    }
    
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }
    
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    return adminQuery<T>(sql, values);
  },

  update: async <T extends QueryResultRow>(
    tableName: string,
    id: string | number,
    data: Record<string, any>
  ): Promise<QueryResult<T>> => {
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = [...Object.values(data), id];

    const sql = `
      UPDATE ${tableName}
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;
    return adminQuery<T>(sql, values);
  },

  delete: async <T extends QueryResultRow>(
    tableName: string,
    conditions: Record<string, any>
  ): Promise<QueryResult<T>> => {
    const whereClauses = Object.entries(conditions).map(([key, _], index) => `${key} = $${index + 1}`);
    const values = Object.values(conditions);

    const sql = `
      DELETE FROM ${tableName}
      WHERE ${whereClauses.join(' AND ')}
      RETURNING *;
    `;
    return adminQuery<T>(sql, values);
  },

  // Specific Table Operations
  getDashboards: async (): Promise<QueryResult<DashboardRow>> => {
    const sql = `
      WITH user_dashboard_info AS (
        SELECT 
          d.id as dashboard_id,
          STRING_AGG(DISTINCT u.name, ', ') as user_names,
          STRING_AGG(DISTINCT u.email, ', ') as user_emails,
          STRING_AGG(DISTINCT ud.role, ', ') as user_roles,
          bool_or(ud.is_default) as is_default
        FROM dashboards d
        LEFT JOIN user_dashboards ud ON ud.dashboard_id = d.id
        LEFT JOIN users u ON u.id = ud.user_id
        GROUP BY d.id
      )
      SELECT 
        d.*,
        udi.user_names,
        udi.user_emails,
        udi.user_roles,
        udi.is_default
      FROM dashboards d
      LEFT JOIN user_dashboard_info udi ON udi.dashboard_id = d.id
      ORDER BY d.created_at DESC;
    `;
    return adminQuery<DashboardRow>(sql);
  },

  getUserDashboards: async (userId: string): Promise<QueryResult<UserDashboardRow>> => {
    const sql = `
      SELECT 
        d.*,
        ud.role as user_role,
        ud.is_default,
        u.name as user_name,
        u.email as user_email
      FROM dashboards d
      JOIN user_dashboards ud ON ud.dashboard_id = d.id
      JOIN users u ON u.id = ud.user_id
      WHERE ud.user_id = $1
      ORDER BY d.name;
    `;
    return adminQuery<UserDashboardRow>(sql, [userId]);
  },

  getMenuItems: async (dashboardId?: string): Promise<QueryResult<MenuItem>> => {
    if (!dashboardId) {
      throw new Error('Dashboard ID is required');
    }

    console.log('[Debug] Fetching menu items for dashboard:', dashboardId);

    // First, try to fetch menu items from the dashboards table
    const dashboardQuery = `
      SELECT menu_items
      FROM dashboards
      WHERE id = $1
      LIMIT 1;
    `;
    const dashboardResult = await adminQuery<{ menu_items: any }>(dashboardQuery, [dashboardId]);

    if (dashboardResult.rows.length && dashboardResult.rows[0].menu_items) {
      const menuItemsJson = dashboardResult.rows[0].menu_items;
      if (Array.isArray(menuItemsJson)) {
        console.log('[Debug] Found menu items in dashboards table:', menuItemsJson.length);
        // Emulate a QueryResult shape
        return { rows: menuItemsJson } as QueryResult<MenuItem>;
      } else {
        console.warn('[Debug] menu_items in dashboards is not an array.');
      }
    }

    // Fallback: fetch menu items from the menu_items table
    const sql = `
      SELECT 
        id,
        dashboard_id,
        name,
        icon,
        url AS url_href,
        parent_id,
        order_index,
        is_active,
        created_at,
        updated_at
      FROM menu_items
      WHERE dashboard_id = $1
      ORDER BY 
        COALESCE(parent_id, id),
        order_index;
    `;

    const result = await adminQuery<MenuItem>(sql, [dashboardId]);
    console.log('[Debug] Found menu items in menu_items table:', result.rows.length);
    return result;
  },

  getDefaultDashboard: async (): Promise<QueryResult<DashboardRow>> => {
    const sql = `
      SELECT *
      FROM dashboards
      WHERE name = 'Main Dashboard'
      LIMIT 1;
    `;
    return adminQuery<DashboardRow>(sql);
  },

  assignDashboardToUser: async (userId: string, dashboardId: string, role: string = 'viewer', isDefault: boolean = false): Promise<QueryResult<UserDashboardRow>> => {
    const sql = `
      INSERT INTO user_dashboards (user_id, dashboard_id, role, is_default)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, dashboard_id) 
      DO UPDATE SET 
        role = EXCLUDED.role,
        is_default = EXCLUDED.is_default,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    return adminQuery<UserDashboardRow>(sql, [userId, dashboardId, role, isDefault]);
  },

  removeDashboardFromUser: async (userId: string, dashboardId: string): Promise<QueryResult<UserDashboardRow>> => {
    const sql = `
      DELETE FROM user_dashboards
      WHERE user_id = $1 AND dashboard_id = $2
      RETURNING *;
    `;
    return adminQuery<UserDashboardRow>(sql, [userId, dashboardId]);
  },

  setDefaultDashboard: async (userId: string, dashboardId: string): Promise<QueryResult<UserDashboardRow>> => {
    // First, remove default status from all user's dashboards
    await adminQuery(`
      UPDATE user_dashboards 
      SET is_default = false 
      WHERE user_id = $1;
    `, [userId]);

    // Then set the new default dashboard
    const sql = `
      UPDATE user_dashboards
      SET is_default = true
      WHERE user_id = $1 AND dashboard_id = $2
      RETURNING *;
    `;
    return adminQuery<UserDashboardRow>(sql, [userId, dashboardId]);
  },

  createDefaultMenuItems: async (dashboardId: string): Promise<QueryResult<MenuItem>> => {
    const sql = `
      INSERT INTO menu_items (dashboard_id, name, icon, url_href, order_index)
      SELECT 
          $1 as dashboard_id,
          'Overview' as name,
          'layout-dashboard' as icon,
          '/dashboard' as url_href,
          0 as order_index
      WHERE NOT EXISTS (
          SELECT 1 FROM menu_items mi 
          WHERE mi.dashboard_id = $1 AND mi.name = 'Overview'
      )
      RETURNING *;
    `;
    return adminQuery<MenuItem>(sql, [dashboardId]);
  },

  // Transaction helper
  transaction: async <T>(callback: (client: any) => Promise<T>): Promise<T> => {
    const client = await adminPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

// Type definitions for database rows
export interface BaseRow {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardRow extends BaseRow {
  name: string;
  description: string;
  logo?: string;
  plan?: string;
  is_public: boolean;
  is_active: boolean;
  user_names?: string;
  user_emails?: string;
  user_roles?: string;
  is_default?: boolean;
}

export interface UserDashboardRow extends BaseRow {
  user_id: string;
  dashboard_id: string;
  role: string;
  is_default: boolean;
  user_name?: string;
  user_email?: string;
}

export interface MenuItem extends BaseRow {
  dashboard_id: string;
  name: string;
  icon: string;
  url_href: string;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
}

export default adminPool;
