import { Pool, PoolConfig } from 'pg';

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
export const adminQuery = async (text: string, params?: any[]) => {
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
  // Table Operations
  listTables: async () => {
    const sql = `
      SELECT table_name as name,
             table_schema as schema
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `;
    return adminQuery(sql);
  },

  // Generic CRUD Operations
  create: async (tableName: string, data: Record<string, any>) => {
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

  read: async (tableName: string, conditions?: Record<string, any>, orderBy?: string, limit?: number) => {
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

  update: async (tableName: string, id: string | number, data: Record<string, any>) => {
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

  delete: async (tableName: string, conditions: Record<string, any>) => {
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
  getDashboards: async () => {
    const result = await adminQuery('SELECT * FROM dashboards ORDER BY created_at DESC');
    return result.rows;
  },

  getMenuItems: async (dashboardId?: string) => {
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
    return result.rows;
  },

  getUserDashboards: async (userId: string) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const sql = `
      SELECT DISTINCT d.* 
      FROM dashboards d
      LEFT JOIN users u ON u.id = $1
      WHERE d.user_id = $1 
        OR d.id = ANY(SELECT UNNEST(string_to_array(u.dashboard_ids, ','))::uuid)
      ORDER BY d.created_at DESC
    `;
    
    try {
      const result = await adminQuery(sql, [userId]);
      return result.rows;
    } catch (error) {
      console.error('[getUserDashboards] Error:', error);
      throw error;
    }
  },

  getDefaultDashboard: async () => {
    const sql = `
      SELECT * FROM dashboards 
      WHERE name = 'main' OR name = 'Main'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const result = await adminQuery(sql);
    return result.rows[0];
  },

  createDefaultMenuItems: async (dashboardId: string) => {
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
    return result.rows[0];
  },

  // Transaction helper
  transaction: async (callback: (client: any) => Promise<void>) => {
    const client = await adminPool.connect();
    try {
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
};

export default adminPool;
