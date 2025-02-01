// shared/config/admin-db.ts

import { Pool, PoolConfig, QueryResult } from 'pg';

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
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create a singleton pool for the admin database
const adminPool = new Pool(adminDbConfig);

// Test the connection
adminPool.on('connect', () => {
  console.log('Connected to Admin PostgreSQL database');
});

adminPool.on('error', (err) => {
  console.error('Unexpected error on admin database client', err);
  process.exit(-1);
});

// Helper function for queries
export const adminQuery = async (text: string, params?: any[]): Promise<QueryResult> => {
  const client = await adminPool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Admin database operations
export const adminDbOperations = {
  // Direct query method
  query: async (text: string, params?: any[]): Promise<QueryResult> => {
    return adminQuery(text, params);
  },

  // Table Operations
  listTables: async (): Promise<QueryResult> => {
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    return adminQuery(sql);
  },

  // User Operations
  createUser: async (name: string, email: string): Promise<QueryResult> => {
    const sql = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *;
    `;
    return adminQuery(sql, [name, email]);
  },

  getUser: async (userId: string): Promise<QueryResult> => {
    const sql = `
      SELECT * FROM users WHERE id = $1;
    `;
    return adminQuery(sql, [userId]);
  },

  getUserByEmail: async (email: string): Promise<QueryResult> => {
    const sql = `
      SELECT * FROM users WHERE email = $1;
    `;
    return adminQuery(sql, [email]);
  },

  // Generic CRUD Operations
  create: async (tableName: string, data: Record<string, any>): Promise<QueryResult> => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);

    const sql = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *;
    `;
    return adminQuery(sql, values);
  },

  read: async (tableName: string, conditions?: Record<string, any>, orderBy?: string, limit?: number): Promise<QueryResult> => {
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

    return adminQuery(sql, values);
  },

  update: async (tableName: string, id: string | number, data: Record<string, any>): Promise<QueryResult> => {
    const updates = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
    const values = [...Object.values(data), id];

    const sql = `
      UPDATE ${tableName}
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;
    return adminQuery(sql, values);
  },

  delete: async (tableName: string, conditions: Record<string, any>): Promise<QueryResult> => {
    const whereClauses = Object.entries(conditions).map(([key, _], index) => `${key} = $${index + 1}`);
    const values = Object.values(conditions);

    const sql = `
      DELETE FROM ${tableName}
      WHERE ${whereClauses.join(' AND ')}
      RETURNING *;
    `;
    return adminQuery(sql, values);
  },

  // Specific Table Operations
  getDashboards: async (): Promise<QueryResult> => {
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
    return adminQuery(sql);
  },

  getUserDashboards: async (userId: string): Promise<QueryResult> => {
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
    return adminQuery(sql, [userId]);
  },

  getMenuItems: async (dashboardId?: string): Promise<QueryResult> => {
    let sql = `
      WITH RECURSIVE menu_tree AS (
        -- Base case: get parent menu items
        SELECT 
          id,
          title,
          icon,
          url_href,
          parent_id,
          order_index,
          is_active,
          1 as level,
          ARRAY[order_index] as path
        FROM menu_items
        WHERE parent_id IS NULL
          AND dashboard_id = $1
        
        UNION ALL
        
        -- Recursive case: get child menu items
        SELECT 
          c.id,
          c.title,
          c.icon,
          c.url_href,
          c.parent_id,
          c.order_index,
          c.is_active,
          p.level + 1,
          p.path || c.order_index
        FROM menu_items c
        INNER JOIN menu_tree p ON c.parent_id = p.id
        WHERE c.dashboard_id = $1
      )
      SELECT 
        id,
        title,
        icon,
        url_href,
        parent_id,
        order_index,
        is_active,
        level,
        path
      FROM menu_tree
      ORDER BY path;
    `;

    if (!dashboardId) {
      throw new Error('Dashboard ID is required');
    }

    const result = await adminQuery(sql, [dashboardId]);
    return result;
  },

  getDefaultDashboard: async (): Promise<QueryResult> => {
    const sql = `
      SELECT d.*
      FROM dashboards d
      JOIN user_dashboards ud ON ud.dashboard_id = d.id
      WHERE ud.is_default = true
      LIMIT 1;
    `;
    const result = await adminQuery(sql);
    return result;
  },

  assignDashboardToUser: async (userId: string, dashboardId: string, role: string = 'viewer', isDefault: boolean = false): Promise<QueryResult> => {
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
    const result = await adminQuery(sql, [userId, dashboardId, role, isDefault]);
    return result;
  },

  removeDashboardFromUser: async (userId: string, dashboardId: string): Promise<QueryResult> => {
    const sql = `
      DELETE FROM user_dashboards
      WHERE user_id = $1 AND dashboard_id = $2
      RETURNING *;
    `;
    const result = await adminQuery(sql, [userId, dashboardId]);
    return result;
  },

  setDefaultDashboard: async (userId: string, dashboardId: string): Promise<QueryResult> => {
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
    const result = await adminQuery(sql, [userId, dashboardId]);
    return result;
  },

  createDefaultMenuItems: async (dashboardId: string): Promise<QueryResult> => {
    const sql = `
      INSERT INTO menu_items (dashboard_id, title, icon, url_href, order_index)
      SELECT 
          $1 as dashboard_id,
          'Overview' as title,
          'layout-dashboard' as icon,
          '/dashboard' as url_href,
          0 as order_index
      WHERE NOT EXISTS (
          SELECT 1 FROM menu_items mi 
          WHERE mi.dashboard_id = $1 AND mi.title = 'Overview'
      )
      RETURNING *;
    `;

    const result = await adminQuery(sql, [dashboardId]);
    return result;
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

export default adminPool;
