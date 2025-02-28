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
    
    // Get all dashboards
    const dashboards = await pool.query(`
      SELECT id, name 
      FROM dashboards
      ORDER BY name;
    `);
    
    // For each dashboard, check for menu items
    for (const dashboard of dashboards.rows) {
      const menuItems = await pool.query(`
        SELECT id, title, icon, url, parent_id, order_index
        FROM menu_items
        WHERE dashboard_id = $1
        ORDER BY order_index;
      `, [dashboard.id]);
      
      console.log(`\nDashboard: ${dashboard.name} (${dashboard.id})`);
      console.log(`Menu items: ${menuItems.rows.length}`);
      
      if (menuItems.rows.length > 0) {
        console.log('Items:');
        menuItems.rows.forEach(item => {
          console.log(`- ${item.title} (${item.id}) [icon: ${item.icon}]`);
          if (item.url) {
            console.log(`  URL: ${JSON.stringify(item.url)}`);
          }
        });
      } else {
        // Insert a default menu item for this dashboard
        console.log('No menu items found. Inserting a default menu item...');
        
        try {
          const result = await pool.query(`
            INSERT INTO menu_items (
              dashboard_id, 
              title, 
              icon, 
              url, 
              parent_id, 
              order_index, 
              is_active
            ) VALUES (
              $1, 
              'Dashboard', 
              'layout-dashboard', 
              '{"path": "/dashboard", "label": "Dashboard"}'::jsonb, 
              NULL, 
              1, 
              true
            ) RETURNING id, title;
          `, [dashboard.id]);
          
          console.log(`Created menu item: ${result.rows[0].title} (${result.rows[0].id})`);
        } catch (error) {
          console.error('Error creating menu item:', error.message);
        }
      }
    }
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
