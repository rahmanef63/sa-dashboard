import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ADMIN_DB
} = process.env;

if (!POSTGRES_HOST || !POSTGRES_USER || !POSTGRES_PASSWORD || !ADMIN_DB) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const pool = new Pool({
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || '5432'),
  database: ADMIN_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  ssl: false
});

async function runMigration() {
  const client = await pool.connect();
  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Read migration files
    const migrationsDir = path.join(process.cwd(), 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      const migrationName = path.parse(file).name;

      // Check if migration has been executed
      const { rows } = await client.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migrationName]
      );

      if (rows.length === 0) {
        console.log(`Running migration: ${migrationName}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
          );
          await client.query('COMMIT');
          console.log(`Migration ${migrationName} completed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`Error running migration ${migrationName}:`, error);
          throw error;
        }
      } else {
        console.log(`Migration ${migrationName} already executed`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration()
  .then(() => {
    console.log('All migrations completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
