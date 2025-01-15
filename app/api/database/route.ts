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
  console.log(`[Database API] ${operation}:`, details);
};

export async function GET() {
  try {
    logDebug("GET - Fetching databases", "Started");
    
    const query = `
      SELECT datname as name,
             pg_size_pretty(pg_database_size(datname)) as size,
             usename as owner
      FROM pg_database
      JOIN pg_user ON pg_database.datdba = pg_user.usesysid
      WHERE datistemplate = false;
    `;
    
    const result = await pool.query(query);
    logDebug("GET - Query result", result.rows);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    logDebug("GET - Error", error);
    return NextResponse.json(
      { error: "Failed to fetch databases" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: DatabaseFormData = await request.json();
    logDebug("POST - Creating database", data);

    // First, check if database already exists
    const checkQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1;
    `;
    const exists = await pool.query(checkQuery, [data.name]);
    
    if (exists.rows.length > 0) {
      logDebug("POST - Database already exists", data.name);
      return NextResponse.json(
        { error: "Database already exists" },
        { status: 400 }
      );
    }

    // Create the database
    const createQuery = `CREATE DATABASE "${data.name}";`;
    await pool.query(createQuery);
    
    // Add description if provided
    if (data.description) {
      const commentQuery = `
        COMMENT ON DATABASE "${data.name}" IS '${data.description}';
      `;
      await pool.query(commentQuery);
    }

    logDebug("POST - Database created successfully", data.name);
    return NextResponse.json({ message: "Database created successfully" });
  } catch (error) {
    logDebug("POST - Error", error);
    return NextResponse.json(
      { error: "Failed to create database" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data: DatabaseFormData = await request.json();
    const dbName = request.url.split("/").pop();
    logDebug("PUT - Updating database", { name: dbName, data });

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
  } catch (error) {
    logDebug("PUT - Error", error);
    return NextResponse.json(
      { error: "Failed to update database" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const dbName = request.url.split("/").pop();
    logDebug("DELETE - Deleting database", dbName);

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
    const dropQuery = `DROP DATABASE "${dbName}";`;
    await pool.query(dropQuery);

    logDebug("DELETE - Database deleted successfully", dbName);
    return NextResponse.json({ message: "Database deleted successfully" });
  } catch (error) {
    logDebug("DELETE - Error", error);
    return NextResponse.json(
      { error: "Failed to delete database" },
      { status: 500 }
    );
  }
}