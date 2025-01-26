import { NextRequest, NextResponse } from "next/server";
import { withClient } from "../../../config";
import { logDebug } from "@/slices/page/static-page/database-management/utils/debug";

// Cache for table information
const tableCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds cache

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const dbName = params.name;
  
  // Check cache first
  const cached = tableCache.get(dbName);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    logDebug("GET - Using cached table info", {
      database: dbName,
      cacheAge: now - cached.timestamp
    });
    return NextResponse.json(cached.data);
  }

  try {
    logDebug("GET - Fetching basic table info", {
      database: dbName,
    });

    const result = await withClient(dbName, async (client) => {
      // Get only basic table information
      const query = `
        SELECT 
          t.table_name,
          t.table_schema,
          obj_description(quote_ident(t.table_name)::regclass::oid, 'pg_class') as description,
          pg_size_pretty(pg_total_relation_size(quote_ident(t.table_name)::regclass::oid)) as total_size
        FROM information_schema.tables t
        WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name;
      `;

      return client.query(query);
    });

    // Update cache
    tableCache.set(dbName, {
      data: result.rows,
      timestamp: now
    });

    logDebug("GET - Basic table info result", result.rows);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    logDebug("GET - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    return NextResponse.json(
      { error: error.message || "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
