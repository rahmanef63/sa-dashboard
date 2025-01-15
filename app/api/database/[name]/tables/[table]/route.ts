import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/shared/config/db";

// Debug logging function
const logDebug = (operation: string, details: any) => {
  if (typeof window !== 'undefined' && (window as any).debugConsole?.log) {
    (window as any).debugConsole.log(`[Table Operations] ${operation}`, details);
  } else {
    console.log(`[Table Operations] ${operation}`, details);
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string; table: string } }
) {
  const dbName = params.name;
  const tableName = params.table;
  const pool = getPool(dbName);
  const client = await pool.connect();

  try {
    logDebug("DELETE - Deleting table", {
      database: dbName,
      table: tableName,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
      },
    });

    // Drop the table using parameterized query with proper identifier quoting
    await client.query(
      'DROP TABLE IF EXISTS "public"."' + tableName.replace(/"/g, '""') + '"'
    );

    return NextResponse.json({ 
      message: 'Table deleted successfully',
      table: tableName,
      database: dbName
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete table',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    // Release the client back to the pool
    client.release();
  }
}
