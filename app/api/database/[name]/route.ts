import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const client = await pool.connect();
  try {
    const dbName = params.name;
    logDebug("DELETE - Deleting database", {
      name: dbName,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      },
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
    await client.query(terminateQuery, [dbName]);

    // Then drop the database
    const dropQuery = `DROP DATABASE IF EXISTS "${dbName}";`;
    await client.query(dropQuery);

    logDebug("DELETE - Database deleted successfully", dbName);
    return NextResponse.json({ message: "Database deleted successfully" });
  } catch (error: any) {
    logDebug("DELETE - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Failed to delete database", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const client = await pool.connect();
  try {
    const oldName = params.name;
    const data = await request.json();

    logDebug("PUT - Updating database", {
      name: oldName,
      data,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
      },
    });

    if (!oldName) {
      return NextResponse.json(
        { error: "Database name is required" },
        { status: 400 }
      );
    }

    // First terminate all connections to the database
    const terminateQuery = `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid();
    `;
    await client.query(terminateQuery, [oldName]);

    // If name is being updated, rename the database
    if (data.name && data.name !== oldName) {
      const renameQuery = `ALTER DATABASE "${oldName}" RENAME TO "${data.name}";`;
      await client.query(renameQuery);
    }

    // Update description if provided
    if (data.description !== undefined) {
      const commentQuery = `
        COMMENT ON DATABASE "${data.name || oldName}" IS '${data.description}';
      `;
      await client.query(commentQuery);
    }

    logDebug("PUT - Database updated successfully", { name: oldName, data });
    return NextResponse.json({
      message: "Database updated successfully",
      database: {
        name: data.name || oldName,
        description: data.description,
      },
    });
  } catch (error: any) {
    logDebug("PUT - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Failed to update database", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
