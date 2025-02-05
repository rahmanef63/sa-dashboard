import adminPool from 'slices/sidebar/config/admin-db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function setupDatabase() {
  const client = await adminPool.connect();
  
  try {
    // Read and execute the migration SQL
    const migrationPath = join(__dirname, '..', 'prisma', 'migrations', '001_create_tables.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('Starting database setup...');
    await client.query('BEGIN');
    
    // Split the SQL file into individual statements and execute them
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }
    
    await client.query('COMMIT');
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await adminPool.end();
  }
}

setupDatabase().catch(console.error);
