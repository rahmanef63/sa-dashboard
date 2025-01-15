import { Pool, PoolConfig } from 'pg';

// Database configuration
const dbConfig: PoolConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Pool cache to avoid creating multiple pools for the same database
const poolCache = new Map<string, Pool>();

// Get or create a pool for a specific database
export const getPool = (dbName: string): Pool => {
  if (poolCache.has(dbName)) {
    return poolCache.get(dbName)!;
  }

  const config: PoolConfig = {
    ...dbConfig,
    database: dbName,
  };

  const newPool = new Pool(config);
  poolCache.set(dbName, newPool);

  // Add error handler
  newPool.on('error', (err) => {
    console.error(`Unexpected error on idle client for database ${dbName}:`, err);
  });

  return newPool;
};

// Create a new pool instance for the default database
const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Helper functions
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Database operations
export const dbOperations = {
  // List all databases
  listDatabases: async () => {
    const sql = `
      SELECT datname as name,
             pg_size_pretty(pg_database_size(datname)) as size,
             pg_get_userbyid(datdba) as owner
      FROM pg_database
      WHERE datistemplate = false;
    `;
    return query(sql);
  },

  // Create a new database
  createDatabase: async (name: string) => {
    const sql = `CREATE DATABASE ${name}`;
    return query(sql);
  },

  // Delete a database
  deleteDatabase: async (name: string) => {
    const sql = `DROP DATABASE IF EXISTS ${name}`;
    return query(sql);
  },

  // List all tables in current database
  listTables: async () => {
    const sql = `
      SELECT table_name as name,
             table_schema as schema
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `;
    return query(sql);
  },
};

export default pool;