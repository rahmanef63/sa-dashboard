import { Pool, PoolClient } from "pg";

// Singleton pool map to reuse connections
const pools = new Map<string, Pool>();

export function getPool(dbName: string): Pool {
  if (pools.has(dbName)) {
    return pools.get(dbName)!;
  }

  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: dbName,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    ssl: process.env.NODE_ENV === "production",
    // Add connection pool settings
    max: 20, // Maximum number of clients
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  });

  // Handle pool errors
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
  });

  pools.set(dbName, pool);
  return pool;
}

export async function withClient<T>(
  dbName: string, 
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool(dbName);
  const client = await pool.connect();
  
  try {
    await client.query('SET search_path TO public');
    return await operation(client);
  } finally {
    client.release();
  }
}
