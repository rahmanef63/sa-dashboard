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

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string; table: string } }
) {
  const dbName = params.name;
  const tableName = params.table;
  const pool = getPool(dbName);
  const client = await pool.connect();

  try {
    logDebug("GET - Fetching table details", {
      database: dbName,
      table: tableName,
    });

    // Get table schema information
    const schemaQuery = `
      SELECT 
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale,
        obj_description(quote_ident(c.table_name)::regclass::oid, 'pg_class') as description,
        pg_get_expr(d.adbin, d.adrelid) as default_value,
        col_description(quote_ident(c.table_name)::regclass::oid, c.ordinal_position) as column_description
      FROM information_schema.columns c
      LEFT JOIN pg_attrdef d ON 
        d.adrelid = quote_ident(c.table_name)::regclass::oid AND 
        d.adnum = c.ordinal_position
      WHERE c.table_schema = 'public'
        AND c.table_name = $1
      ORDER BY c.ordinal_position;
    `;

    // Get table constraints
    const constraintQuery = `
      SELECT
        c.conname as constraint_name,
        c.contype as constraint_type,
        array_agg(col.attname) as column_names,
        pg_get_constraintdef(c.oid) as definition
      FROM pg_constraint c
      JOIN pg_namespace n ON n.oid = c.connamespace
      JOIN pg_class rel ON rel.oid = c.conrelid
      JOIN pg_attribute col ON col.attrelid = c.conrelid
      WHERE n.nspname = 'public'
        AND rel.relname = $1
        AND col.attnum = ANY(c.conkey)
      GROUP BY c.conname, c.contype, c.oid;
    `;

    const [schemaResult, constraintResult] = await Promise.all([
      client.query(schemaQuery, [tableName]),
      client.query(constraintQuery, [tableName])
    ]);

    const tableDetails = {
      table_name: tableName,
      table_schema: 'public',
      description: schemaResult.rows[0]?.description || '',
      columns: schemaResult.rows.map(row => ({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        default: row.default_value || row.column_default,
        description: row.column_description,
        length: row.character_maximum_length,
        precision: row.numeric_precision,
        scale: row.numeric_scale
      })),
      constraints: constraintResult.rows.map(row => ({
        name: row.constraint_name,
        type: row.constraint_type,
        columns: row.column_names,
        definition: row.definition
      }))
    };

    logDebug("GET - Table details result", tableDetails);
    return NextResponse.json(tableDetails);
  } catch (error: any) {
    logDebug("GET - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: error.message || "Failed to fetch table details" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

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
  } catch (error: any) {
    logDebug("DELETE - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: error.message || "Failed to delete table" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
