import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { DatabaseTable, TableFormData, TableUpdateData, validateTableForm } from "@/shared/types/table";

// Create a connection pool
const getPool = (dbName: string) => new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: dbName, // Use the database name from the route
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  ssl: process.env.NODE_ENV === "production",
});

// Debug logging function
const logDebug = (operation: string, details: any) => {
  console.log(`[Table API] ${operation}:`, JSON.stringify(details, null, 2));
};

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const dbName = params.name;
  const pool = getPool(dbName);
  const client = await pool.connect();
  
  try {
    logDebug("GET - Fetching tables", {
      database: dbName,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
      },
    });

    // Switch to the target database
    await client.query(`SET search_path TO public`);
    
    // Get tables with their columns and constraints
    const query = `
      WITH table_info AS (
        SELECT 
          t.table_name,
          t.table_schema,
          jsonb_build_object(
            'name', c.column_name,
            'type', c.data_type,
            'nullable', c.is_nullable = 'YES',
            'defaultValue', c.column_default,
            'description', pd.description
          ) as column_info,
          jsonb_build_object(
            'name', tc.constraint_name,
            'type', tc.constraint_type,
            'column', kcu.column_name,
            'referencedTable', ccu.table_name,
            'referencedColumn', ccu.column_name
          ) as constraint_info,
          obj_description(quote_ident(t.table_name)::regclass::oid, 'pg_class') as description,
          pg_size_pretty(pg_total_relation_size(quote_ident(t.table_name)::regclass::oid)) as total_size
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c 
          ON c.table_name = t.table_name 
          AND c.table_schema = t.table_schema
        LEFT JOIN pg_description pd 
          ON pd.objoid = quote_ident(t.table_name)::regclass::oid 
          AND pd.objsubid = c.ordinal_position
        LEFT JOIN information_schema.table_constraints tc
          ON tc.table_name = t.table_name 
          AND tc.table_schema = t.table_schema
        LEFT JOIN information_schema.key_column_usage kcu
          ON kcu.constraint_name = tc.constraint_name
          AND kcu.table_schema = tc.table_schema
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
      )
      SELECT 
        table_name,
        table_schema,
        array_agg(DISTINCT column_info) FILTER (WHERE column_info->>'name' IS NOT NULL) as columns,
        array_agg(DISTINCT constraint_info) FILTER (WHERE constraint_info->>'name' IS NOT NULL) as constraints,
        MAX(description) as description,
        MAX(total_size) as total_size
      FROM table_info
      GROUP BY table_name, table_schema;
    `;

    const result = await client.query(query);
    logDebug("GET - Query result", result.rows);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    logDebug("GET - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Failed to fetch tables", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const dbName = params.name;
  const pool = getPool(dbName);
  const client = await pool.connect();
  try {
    const data: TableFormData = await request.json();

    logDebug("POST - Creating table", {
      database: dbName,
      data,
      env: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
      },
    });

    // Validate the table data
    const validationErrors = validateTableForm(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Build the CREATE TABLE query
    let createQuery = `CREATE TABLE "${data.name}" (\n`;

    try {
      // Add columns
      const columnDefs = data.columns.map((col) => {
        let def = `  "${col.name}" ${col.type}`;
        if (col.length) def += `(${col.length})`;
        if (!col.nullable) def += " NOT NULL";
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
        return def;
      });

      // Add constraints
      const constraintDefs = data.constraints.map((constraint) => {
        let def = `  CONSTRAINT "${constraint.name}" ${constraint.type}`;
        if (constraint.type === "FOREIGN KEY") {
          def += ` (${constraint.columns.join(", ")}) REFERENCES "${
            constraint.referencedTable
          }" (${constraint.referencedColumns!.join(", ")})`;
        } else if (constraint.type === "CHECK") {
          def += ` (${constraint.definition})`;
        } else {
          def += ` (${constraint.columns.join(", ")})`;
        }
        return def;
      });

      createQuery += [...columnDefs, ...constraintDefs].join(",\n");
      createQuery += "\n);";

      logDebug('CREATE TABLE Query', createQuery);

      // Execute the CREATE TABLE query
      await client.query(createQuery);

      // Add table description if provided
      if (data.description) {
        const commentQuery = `
          COMMENT ON TABLE "${data.name}" IS '${data.description.replace(/'/g, "''")}';
        `;
        await client.query(commentQuery);
      }

      // Add column descriptions if provided
      for (const column of data.columns) {
        if (column.description) {
          const columnCommentQuery = `
            COMMENT ON COLUMN "${data.name}"."${column.name}" IS '${column.description.replace(/'/g, "''")}';
          `;
          await client.query(columnCommentQuery);
        }
      }
    } catch (error) {
      logDebug('CREATE TABLE Error', { error, query: createQuery });
      return NextResponse.json(
        { error: "Failed to create table", details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }

    logDebug("POST - Table created successfully", data.name);
    return NextResponse.json({
      message: "Table created successfully",
      table: {
        name: data.name,
        schema: "public",
        columns: data.columns,
        constraints: data.constraints,
        description: data.description,
      },
    });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { error: "Failed to create table", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const dbName = params.name;
  const pool = getPool(dbName);
  const client = await pool.connect();

  try {
    const { tableName } = request.url.match(/\/tables\/([^\/]+)$/i)?.groups || {};
    if (!tableName) {
      return NextResponse.json(
        { error: "Table name is required" },
        { status: 400 }
      );
    }

    const data: TableFormData = await request.json();
    const validationErrors = validateTableForm(data);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    logDebug("PUT - Updating table", {
      database: dbName,
      table: tableName,
      data,
    });

    // Start a transaction
    await client.query('BEGIN');

    // Rename table if name changed
    if (data.name !== tableName) {
      await client.query(
        'ALTER TABLE $1:name RENAME TO $2:name',
        [tableName, data.name]
      );
    }

    // Get existing columns
    const { rows: existingColumns } = await client.query(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_name = $1
       AND table_schema = 'public'`,
      [data.name]
    );

    // Update columns
    for (const column of data.columns) {
      const existing = existingColumns.find(
        (c) => c.column_name === column.name
      );

      if (!existing) {
        // Add new column
        await client.query(
          `ALTER TABLE ${data.name} ADD COLUMN ${column.name} ${column.type}${
            column.nullable ? '' : ' NOT NULL'
          }${column.defaultValue ? ` DEFAULT ${column.defaultValue}` : ''}`
        );
      } else if (
        existing.data_type !== column.type ||
        existing.is_nullable !== (column.nullable ? 'YES' : 'NO')
      ) {
        // Modify existing column
        await client.query(
          `ALTER TABLE ${data.name}
           ALTER COLUMN ${column.name} TYPE ${column.type},
           ALTER COLUMN ${column.name} ${column.nullable ? 'DROP' : 'SET'} NOT NULL`
        );
      }
    }

    // Remove deleted columns
    for (const existing of existingColumns) {
      if (!data.columns.find((c) => c.name === existing.column_name)) {
        await client.query(
          `ALTER TABLE ${data.name} DROP COLUMN ${existing.column_name}`
        );
      }
    }

    // Update description
    if (data.description !== undefined) {
      await client.query(
        'COMMENT ON TABLE $1:name IS $2',
        [data.name, data.description || null]
      );
    }

    await client.query('COMMIT');

    logDebug("PUT - Table updated successfully", {
      table: data.name,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.query('ROLLBACK');

    logDebug("PUT - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: "Failed to update table", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
    await pool.end();
  }
}
