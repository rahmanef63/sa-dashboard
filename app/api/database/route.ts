import { NextResponse } from "next/server";
import { Pool } from "pg";
import { DatabaseFormData } from "@/shared/types/database";

// Create a connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production",
});

// Debug logging function
const logDebug = (operation: string, details: any) => {
  console.log(`[Database API] ${operation}:`, JSON.stringify(details, null, 2));
};

export async function GET() {
  try {
    logDebug("GET - Fetching databases", { 
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      }
    });
    
    const query = `
      SELECT datname as name,
             pg_size_pretty(pg_database_size(datname)) as size,
             usename as owner
      FROM pg_database d
      JOIN pg_user u ON d.datdba = u.usesysid
      WHERE datistemplate = false
      ORDER BY datname;
    `;
    
    const result = await pool.query(query);
    logDebug("GET - Query result", result.rows);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    logDebug("GET - Error", error);
    return NextResponse.json(
      { error: "Failed to fetch databases", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data: DatabaseFormData = await request.json();
    logDebug("POST - Creating database", { 
      requestData: data,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      }
    });

    // First, check if database already exists
    const checkQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1;
    `;
    const exists = await client.query(checkQuery, [data.name]);
    
    if (exists.rows.length > 0) {
      logDebug("POST - Database already exists", data.name);
      return NextResponse.json(
        { error: "Database already exists" },
        { status: 400 }
      );
    }

    // Create the database - we need to use template0 to avoid encoding issues
    const createQuery = `CREATE DATABASE "${data.name}" WITH TEMPLATE template0;`;
    logDebug("POST - Executing create query", createQuery);
    await client.query(createQuery);
    
    // Add description if provided
    if (data.description) {
      const commentQuery = `
        COMMENT ON DATABASE "${data.name}" IS '${data.description}';
      `;
      logDebug("POST - Adding description", commentQuery);
      await client.query(commentQuery);
    }

    logDebug("POST - Database created successfully", data.name);
    return NextResponse.json({ 
      message: "Database created successfully",
      database: {
        name: data.name,
        description: data.description
      }
    });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { 
        error: "Failed to create database", 
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(request: Request) {
  try {
    const data: DatabaseFormData = await request.json();
    const dbName = request.url.split("/").pop();
    logDebug("PUT - Updating database", { 
      name: dbName, 
      data,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      }
    });

    if (!dbName) {
      return NextResponse.json(
        { error: "Database name is required" },
        { status: 400 }
      );
    }

    // Update database comment
    if (data.description) {
      const query = `
        COMMENT ON DATABASE "${dbName}" IS '${data.description}';
      `;
      await pool.query(query);
    }

    logDebug("PUT - Database updated successfully", dbName);
    return NextResponse.json({ message: "Database updated successfully" });
  } catch (error: any) {
    logDebug("PUT - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: "Failed to update database", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const dbName = request.url.split("/").pop();
    logDebug("DELETE - Deleting database", { 
      name: dbName,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      }
    });

    if (!dbName) {
      return NextResponse.json(
        { error: "Database name is required" },
        { status: 400 }
      );
    }

    // First, terminate all connections to the database
    const terminateQuery = `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid();
    `;
    await pool.query(terminateQuery, [dbName]);

    // Then drop the database
    const dropQuery = `DROP DATABASE IF EXISTS "${dbName}";`;
    await pool.query(dropQuery);

    logDebug("DELETE - Database deleted successfully", dbName);
    return NextResponse.json({ message: "Database deleted successfully" });
  } catch (error: any) {
    logDebug("DELETE - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    return NextResponse.json(
      { error: "Failed to delete database", details: error.message },
      { status: 500 }
    );
  }
}