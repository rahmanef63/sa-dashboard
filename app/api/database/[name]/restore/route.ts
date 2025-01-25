import { NextResponse } from "next/server";
import { Pool } from "pg";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";

const execAsync = promisify(exec);

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
  console.log(`[Restore API] ${operation}:`, JSON.stringify(details, null, 2));
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

    // Get the form data with the uploaded file
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No backup file provided" },
        { status: 400 }
      );
    }

    // Verify file extension
    const fileName = file.name;
    if (!fileName.endsWith('.sql') && !fileName.endsWith('.sql.gz')) {
      return NextResponse.json(
        { error: "Invalid file format. Must be .sql or .sql.gz" },
        { status: 400 }
      );
    }

    // Create temp directory for restore
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Save uploaded file
    const isCompressed = fileName.endsWith('.gz');
    const tempFilePath = path.join(tempDir, fileName);
    const sqlFilePath = isCompressed 
      ? path.join(tempDir, fileName.replace('.gz', ''))
      : tempFilePath;

    // Write uploaded file to disk
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

    // If file is compressed, decompress it
    if (isCompressed) {
      const gunzip = createGunzip();
      const source = createReadStream(tempFilePath);
      const destination = createWriteStream(sqlFilePath);
      await pipeline(source, gunzip, destination);
      await fs.unlink(tempFilePath); // Remove compressed file
    }

    // Verify database exists
    const dbCheck = await client.query(
      'SELECT datname FROM pg_database WHERE datname = $1',
      [dbName]
    );

    // Terminate existing connections to the database
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `, [dbName]);

    // Drop and recreate database to ensure clean state
    if (dbCheck.rows.length > 0) {
      await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    }
    await client.query(`CREATE DATABASE ${dbName}`);

    // Build psql restore command
    const restoreCmd = [
      "psql",
      `-h "${process.env.POSTGRES_HOST}"`,
      `-p "${process.env.POSTGRES_PORT}"`,
      `-U "${process.env.POSTGRES_USER}"`,
      `-d "${dbName}"`,
      `-f "${sqlFilePath}"`,
    ].join(" ");

    logDebug("POST - Executing restore", {
      dbName,
      fileName,
      isCompressed
    });

    // Execute restore
    await execAsync(restoreCmd, {
      env: {
        ...process.env,
        PGPASSWORD: process.env.POSTGRES_PASSWORD
      }
    });

    // Cleanup temp files
    await fs.unlink(sqlFilePath);
    
    return NextResponse.json({
      success: true,
      message: "Database restored successfully"
    });
  } catch (error: any) {
    logDebug("POST - Error", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Attempt to cleanup on error
    try {
      const tempDir = path.join(process.cwd(), 'temp');
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }

    return NextResponse.json(
      { 
        error: "Failed to restore database", 
        details: error.message,
        code: error.code 
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
