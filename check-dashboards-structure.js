const { Pool } = require('pg');

async function main() {
  try {
    const pool = new Pool({
      host: '194.238.22.2',
      port: 5432,
      database: 'sadashboard',
      user: 'postgres',
      password: 'Bismillah63'
    });

    console.log('Connected to database');
    
    // Check table structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'dashboards'
      ORDER BY ordinal_position;
    `);
    
    console.log('Dashboards table structure:');
    tableInfo.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // Check menu_items column specifically
    const menuItemsCol = tableInfo.rows.find(col => col.column_name === 'menu_items');
    if (menuItemsCol) {
      console.log('\nThe menu_items column exists in the dashboards table.');
      
      // Check if any rows have data in menu_items
      const dashboardsWithMenuItems = await pool.query(`
        SELECT id, name, menu_items 
        FROM dashboards 
        WHERE menu_items IS NOT NULL AND menu_items != '[]'::jsonb;
      `);
      
      console.log(`\nFound ${dashboardsWithMenuItems.rows.length} dashboards with menu_items data:`);
      dashboardsWithMenuItems.rows.forEach(row => {
        console.log(`- Dashboard ${row.name} (${row.id}): ${JSON.stringify(row.menu_items).substring(0, 100)}...`);
      });
    } else {
      console.log('\nThe menu_items column does NOT exist in the dashboards table.');
    }
    
    // Get all dashboards
    const allDashboards = await pool.query(`
      SELECT id, name 
      FROM dashboards
      ORDER BY created_at DESC;
    `);
    
    console.log(`\nAll dashboards (${allDashboards.rows.length}):`);
    allDashboards.rows.forEach(row => {
      console.log(`- ${row.name} (${row.id})`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
