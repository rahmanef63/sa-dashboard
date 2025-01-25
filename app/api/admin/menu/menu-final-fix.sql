-- Drop and recreate menu_items table with proper sequence
DROP TABLE IF EXISTS menu_items CASCADE;

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    url_href VARCHAR(255),
    url_target VARCHAR(10),
    url_rel VARCHAR(50),
    parent_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    is_collapsible BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert main menu items
INSERT INTO menu_items (title, icon, url_href, url_target, is_collapsible, order_index)
VALUES 
('Dashboard', 'LayoutDashboard', '/dashboard', '_self', false, 1),
('Analyze', 'BarChart2', '/dashboard/analyze', '_self', false, 2),
('Menu Store', 'Store', '/dashboard/menu-store', '_self', false, 3),
('Database Management', 'Database', '/dashboard/database-manager', '_self', false, 4),
('Social Media', 'Share2', NULL, '_self', true, 5);

-- Insert social media submenu items
WITH social_media AS (
  SELECT id FROM menu_items WHERE title = 'Social Media'
)
INSERT INTO menu_items (title, icon, url_href, url_target, parent_id, order_index)
SELECT 
  child.title,
  child.icon,
  child.url_href,
  '_self',
  sm.id,
  child.order_index
FROM social_media sm
CROSS JOIN (VALUES 
  ('Overview', 'LayoutDashboard', '/dashboard/social-media/overview', 1),
  ('Posts', 'Inbox', '/dashboard/social-media/posts', 2),
  ('Calendar', 'Calendar', '/dashboard/social-media/calendar', 3),
  ('Analytics', 'BarChart', '/dashboard/social-media/analytics', 4)
) AS child(title, icon, url_href, order_index);

-- Recreate dashboard_menu_items table
DROP TABLE IF EXISTS dashboard_menu_items;

CREATE TABLE dashboard_menu_items (
    dashboard_id VARCHAR(255) REFERENCES dashboards(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dashboard_id, menu_item_id)
);
