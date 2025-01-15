import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/shared/config/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string; table: string } }
) {
  const dbName = params.name;
  const tableName = params.table;
  const pool = getPool(dbName);
  
  try {
    // Get a client from the pool
    const client = await pool.connect();

    try {
      // First check if table exists
      const tableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [tableName]);

      if (!tableExists.rows[0].exists) {
        return NextResponse.json(
          { error: `Table "${tableName}" does not exist` },
          { status: 404 }
        );
      }

      // Query to get the first 100 rows from the table with proper quoting
      const result = await client.query(
        `SELECT * FROM "public"."${tableName.replace(/"/g, '""')}" LIMIT 100`
      );

      return NextResponse.json(result.rows);
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error('Error fetching table preview:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch table preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
