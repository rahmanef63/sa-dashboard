import { NextRequest, NextResponse } from "next/server";
import { Pool, FieldDef } from "pg";

// Create a connection pool
const getPool = (dbName: string) => new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: dbName,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production",
});

// Debug logging function
const logDebug = (operation: string, details: any) => {
  console.log(`[Query API] ${operation}:`, JSON.stringify(details, null, 2));
};

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const dbName = params.name;
  const pool = getPool(dbName);
  const client = await pool.connect();

  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    logDebug("POST - Executing query", {
      database: dbName,
      query: query,
    });

    // Execute the query
    const result = await client.query(query);
    
    logDebug("POST - Query result", {
      rowCount: result.rowCount,
      fields: result.fields.map((f: FieldDef) => f.name),
    });

    return NextResponse.json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields.map((f: FieldDef) => ({
        name: f.name,
        dataType: f.dataTypeID,
      })),
    });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: "Failed to execute query", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}
