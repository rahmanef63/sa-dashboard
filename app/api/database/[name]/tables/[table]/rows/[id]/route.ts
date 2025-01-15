import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/shared/config/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string; table: string; id: string } }
) {
  const { name: dbName, table: tableName, id } = params;
  const pool = getPool(dbName);
  const client = await pool.connect();
  
  try {
    const data = await request.json();
    const setClauses = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id') {
        setClauses.push(`"${key}" = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    values.push(id);
    const query = `
      UPDATE "public"."${tableName}"
      SET ${setClauses.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(query, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating row:', error);
    return NextResponse.json(
      { error: 'Failed to update row', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string; table: string; id: string } }
) {
  const { name: dbName, table: tableName, id } = params;
  const pool = getPool(dbName);
  const client = await pool.connect();
  
  try {
    const query = `
      DELETE FROM "public"."${tableName}"
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await client.query(query, [id]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting row:', error);
    return NextResponse.json(
      { error: 'Failed to delete row', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
