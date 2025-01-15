const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    ssl: process.env.NODE_ENV === "production",
  });

  try {
    console.log('Testing database connection...');
    console.log('Connection config:', {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
    });

    // Test basic connection
    const client = await pool.connect();
    console.log('Successfully connected to database');

    // Test user permissions
    const permissionsQuery = `
      SELECT 
        r.rolname, 
        ARRAY_AGG(DISTINCT p.privilege_type) as privileges
      FROM 
        information_schema.role_usage_grants g
        JOIN pg_roles r ON g.grantee = r.rolname
        JOIN information_schema.usage_privileges p ON g.object_name = p.object_name
      WHERE 
        r.rolname = $1
      GROUP BY 
        r.rolname;
    `;
    
    const result = await client.query(permissionsQuery, [process.env.POSTGRES_USER]);
    console.log('User permissions:', result.rows);

    // Test database creation
    const testDbName = 'test_db_' + Date.now();
    console.log(`Testing database creation with name: ${testDbName}`);
    
    await client.query(`CREATE DATABASE ${testDbName}`);
    console.log('Successfully created test database');
    
    await client.query(`DROP DATABASE ${testDbName}`);
    console.log('Successfully dropped test database');

    client.release();
    await pool.end();
    
    console.log('All tests passed successfully');
  } catch (error) {
    console.error('Error during connection test:', error);
    process.exit(1);
  }
}

testConnection().catch(console.error);
