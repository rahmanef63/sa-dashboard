-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    url_href VARCHAR(255),
    url_label VARCHAR(255),
    parent_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    is_collapsible BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dashboard_menu_items table for mapping menus to dashboards
CREATE TABLE IF NOT EXISTS dashboard_menu_items (
    dashboard_id VARCHAR(255) REFERENCES dashboards(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    is_enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (dashboard_id, menu_item_id)
);

-- Insert initial menu items
INSERT INTO menu_items (title, icon, url_href, is_collapsible, order_index) VALUES
('Dashboard', 'LayoutDashboard', '/dashboard', false, 1),
('Analyze', 'BarChart2', '/dashboard/analyze', false, 2),
('Menu Store', 'Store', '/dashboard/menu-store', false, 3),
('Database Management', 'Database', '/dashboard/database-manager', false, 4),
('Social Media', 'Share2', null, true, 5);

-- Get the id of the Social Media menu item
DO $$ 
DECLARE 
    social_media_id INTEGER;
BEGIN
    SELECT id INTO social_media_id FROM menu_items WHERE title = 'Social Media';
    
    -- Insert child menu items for Social Media
    INSERT INTO menu_items (title, icon, url_href, parent_id, order_index) VALUES
    ('Overview', 'LayoutDashboard', '/dashboard/social-media/overview', social_media_id, 1),
    ('Posts', 'Inbox', '/dashboard/social-media/posts', social_media_id, 2),
    ('Calendar', 'Calendar', '/dashboard/social-media/calendar', social_media_id, 3),
    ('Analytics', 'BarChart', '/dashboard/social-media/analytics', social_media_id, 4);
END $$;
