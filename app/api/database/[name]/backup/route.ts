import { NextResponse } from "next/server";
import { Pool } from "pg";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";

const execAsync = promisify(exec);

// Create a connection pool (reuse from existing database config)
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
  console.log(`[Backup API] ${operation}:`, JSON.stringify(details, null, 2));
};

export async function POST(
  request: Request,
  { params }: { params: { name: string } }
) {
  const client = await pool.connect();
  try {
    // Validate database name
    const dbName = params.name;
    if (!dbName || typeof dbName !== 'string') {
      return NextResponse.json(
        { error: "Invalid database name" },
        { status: 400 }
      );
    }

    // Verify database exists
    const dbCheck = await client.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [dbName]
    );
    if (dbCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Database not found" },
        { status: 404 }
      );
    }

    const { type = "structure", compression = true } = await request.json();
    
    // Validate backup type
    if (type !== "structure" && type !== "full") {
      return NextResponse.json(
        { error: "Invalid backup type. Must be 'structure' or 'full'" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(process.cwd(), "backups");
    const sqlFileName = `${dbName}_${timestamp}.sql`;
    const finalFileName = compression ? `${sqlFileName}.gz` : sqlFileName;
    const sqlFilePath = path.join(backupDir, sqlFileName);
    const finalFilePath = path.join(backupDir, finalFileName);

    // Ensure backup directory exists
    await fs.mkdir(backupDir, { recursive: true });

    // Build pg_dump command
    const pgDumpCmd = [
      "pg_dump",
      `-h "${process.env.POSTGRES_HOST}"`,
      `-p "${process.env.POSTGRES_PORT}"`,
      `-U "${process.env.POSTGRES_USER}"`,
      type === "structure" ? "--schema-only" : "",
      `-f "${sqlFilePath}"`,
      `"${dbName}"`,
    ].join(" ");

    logDebug("POST - Executing backup", { 
      dbName,
      type,
      compression,
      timestamp
    });

    // Execute pg_dump
    await execAsync(pgDumpCmd, {
      env: {
        ...process.env,
        PGPASSWORD: process.env.POSTGRES_PASSWORD
      }
    });

    // If compression is enabled, compress the file using zlib
    if (compression) {
      const gzip = createGzip();
      const source = createReadStream(sqlFilePath);
      const destination = createWriteStream(finalFilePath);
      
      await pipeline(source, gzip, destination);
      
      // Remove the uncompressed file
      await fs.unlink(sqlFilePath);
    }

    return NextResponse.json({
      success: true,
      message: "Backup created successfully",
      file: finalFileName,
    });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return NextResponse.json(
      { 
        error: "Failed to create backup", 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}