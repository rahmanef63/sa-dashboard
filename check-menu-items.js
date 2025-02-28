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
    
    // Insert a test menu item if it doesn't exist
    await pool.query(`
      INSERT INTO menu_items (
        dashboard_id, 
        title, 
        icon, 
        url, 
        parent_id, 
        order_index, 
        is_active
      )
      SELECT 
        'f5531af3-4bbe-4906-bc37-4b9d8f509ece'::uuid, 
        'Test Menu Item',
        'layout-dashboard',
        '{"path": "/test-path", "label": "Test Label"}'::jsonb,
        NULL,
        1,
        true
      WHERE NOT EXISTS (
        SELECT 1 FROM menu_items 
        WHERE dashboard_id = 'f5531af3-4bbe-4906-bc37-4b9d8f509ece'::uuid 
        AND title = 'Test Menu Item'
      );
    `);
    console.log('Inserted test menu item if it didn\'t exist');
    
    // Check if the menu item exists
    const result = await pool.query(`
      SELECT * FROM menu_items WHERE dashboard_id = 'f5531af3-4bbe-4906-bc37-4b9d8f509ece'::uuid
    `);
    
    console.log('Menu items found:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('Sample menu item:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
