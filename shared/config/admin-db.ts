import { Pool, PoolConfig } from 'pg';

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
    return adminQuery('SELECT * FROM dashboards ORDER BY created_at DESC');
  },

  getMenuItems: async (dashboardId?: string) => {
    let sql = `
      WITH RECURSIVE menu_tree AS (
        -- Base case: get parent menu items
        SELECT 
          mi.id,
          mi.title,
          mi.icon,
          mi.url_href,
          mi.url_target,
          mi.url_rel,
          mi.parent_id,
          mi.is_collapsible,
          COALESCE(dmi.order_index, mi.order_index) as order_index,
          dmi.is_enabled,
          1 as level,
          ARRAY[COALESCE(dmi.order_index, mi.order_index)] as path
        FROM menu_items mi
        LEFT JOIN dashboard_menu_items dmi ON mi.id = dmi.menu_item_id
        WHERE mi.parent_id IS NULL
        ${dashboardId ? 'AND dmi.dashboard_id = $1' : ''}
        
        UNION ALL
        
        -- Recursive case: get child menu items
        SELECT 
          c.id,
          c.title,
          c.icon,
          c.url_href,
          c.url_target,
          c.url_rel,
          c.parent_id,
          c.is_collapsible,
          COALESCE(dmi.order_index, c.order_index) as order_index,
          dmi.is_enabled,
          p.level + 1,
          p.path || COALESCE(dmi.order_index, c.order_index)
        FROM menu_items c
        INNER JOIN menu_tree p ON c.parent_id = p.id
        LEFT JOIN dashboard_menu_items dmi ON c.id = dmi.menu_item_id
        ${dashboardId ? 'AND dmi.dashboard_id = $1' : ''}
      )
      SELECT 
        id,
        title,
        icon,
        url_href,
        url_target,
        url_rel,
        parent_id,
        is_collapsible,
        order_index,
        is_enabled,
        level,
        path
      FROM menu_tree
      ORDER BY path;
    `;

    return adminQuery(sql, dashboardId ? [dashboardId] : undefined);
  },

  getUserDashboards: async (userId: string) => {
    const sql = `
      SELECT d.*, ud.is_active
      FROM dashboards d
      JOIN user_dashboards ud ON d.id = ud.dashboard_id
      WHERE ud.user_id = $1
      ORDER BY ud.created_at DESC
    `;
    return adminQuery(sql, [userId]);
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
