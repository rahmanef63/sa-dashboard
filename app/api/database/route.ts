import { NextResponse } from "next/server";
import { Pool } from "pg";
import { DatabaseFormData } from "@/shared/types/database";
import { logDebug } from "@/slices/page/static-page/database-management/utils/debug";

// Singleton pool for postgres database
let globalPool: Pool | null = null;

function getGlobalPool(): Pool {
  if (globalPool) return globalPool;

  globalPool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: 'postgres', // Always connect to postgres for database operations
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    ssl: process.env.NODE_ENV === "production",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  globalPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    // If a fatal error occurs, clear the pool so it can be recreated
    globalPool = null;
  });

  return globalPool;
}

// Cache for database list
const databaseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10000; // 10 seconds cache for database list

export async function GET() {
  const cacheKey = 'databases';
  const now = Date.now();
  const cached = databaseCache.get(cacheKey);

  // Return cached data if valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    logDebug("GET - Using cached database list", {
      cacheAge: now - cached.timestamp
    });
    return NextResponse.json(cached.data);
  }

  const pool = getGlobalPool();
  const client = await pool.connect();
  
  try {
    logDebug("GET - Fetching databases", { 
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
      }
    });
    
    const query = `
      SELECT 
        datname as name,
        pg_size_pretty(pg_database_size(datname)) as size,
        usename as owner,
        pg_encoding_to_char(encoding) as encoding,
        datcollate as collation,
        datctype as ctype,
        pg_database_size(datname) as raw_size
      FROM pg_database d
      JOIN pg_user u ON d.datdba = u.usesysid
      WHERE datistemplate = false
        AND datname != 'postgres'  -- Exclude postgres system database
      ORDER BY 
        CASE WHEN datname = $1 THEN 0 ELSE 1 END,  -- Prioritize current database
        raw_size DESC;  -- Then order by size
    `;
    
    const result = await client.query(query, [process.env.POSTGRES_DB]);
    
    // Update cache
    const data = result.rows.map(({ raw_size, ...rest }) => rest); // Remove raw_size from output
    databaseCache.set(cacheKey, {
      data,
      timestamp: now
    });

    logDebug("GET - Query result", data);
    return NextResponse.json(data);
  } catch (error: any) {
    logDebug("GET - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    return NextResponse.json(
      { error: error.message || "Failed to fetch databases" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const pool = getGlobalPool();
  const client = await pool.connect();
  
  try {
    const data: DatabaseFormData = await request.json();
    
    logDebug("POST - Creating database", { 
      database: data.name,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
      }
    });

    // Validate database name
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(data.name)) {
      throw new Error("Invalid database name. Use only letters, numbers, and underscores, starting with a letter.");
    }

    // Check if database exists
    const checkQuery = `
      SELECT datname FROM pg_database 
      WHERE datistemplate = false 
        AND datname = $1;
    `;
    const existing = await client.query(checkQuery, [data.name]);
    if (existing.rows.length > 0) {
      throw new Error(`Database '${data.name}' already exists`);
    }

    // Create database with proper escaping
    const createQuery = `CREATE DATABASE "${data.name.replace(/"/g, '""')}"`;
    await client.query(createQuery);

    // Clear cache to ensure fresh data on next fetch
    databaseCache.clear();

    logDebug("POST - Database created successfully", { name: data.name });
    return NextResponse.json({ message: 'Database created successfully' });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });

    const status = error.code === '42P04' ? 409 : 500; // 42P04 is duplicate database
    return NextResponse.json(
      { error: error.message || "Failed to create database" },
      { status }
    );
  } finally {
    client.release();
  }
}