-- First, let's check if we have any dashboards
DO $$ 
DECLARE
    dashboard_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO dashboard_count FROM dashboards;
    
    -- If no dashboards exist, create a default one
    IF dashboard_count = 0 THEN
        INSERT INTO dashboards (id, name, logo, plan)
        VALUES ('default', 'Default Dashboard', 'LayoutDashboard', 'Personal');
    END IF;
END $$;

-- Get all menu items and dashboards for mapping
WITH menu_items_list AS (
    SELECT id, title FROM menu_items
),
dashboards_list AS (
    SELECT id FROM dashboards
)
-- Insert mappings for each dashboard and menu item
INSERT INTO dashboard_menu_items (dashboard_id, menu_item_id, is_enabled, order_index)
SELECT 
    d.id,
    mi.id,
    true,
    CASE 
        WHEN mi.title = 'Dashboard' THEN 1
        WHEN mi.title = 'Analyze' THEN 2
        WHEN mi.title = 'Menu Store' THEN 3
        WHEN mi.title = 'Database Management' THEN 4
        WHEN mi.title = 'Social Media' THEN 5
        WHEN mi.title = 'Overview' THEN 6
        WHEN mi.title = 'Posts' THEN 7
        WHEN mi.title = 'Calendar' THEN 8
        WHEN mi.title = 'Analytics' THEN 9
        ELSE 10
    END
FROM dashboards_list d
CROSS JOIN menu_items_list mi
ON CONFLICT (dashboard_id, menu_item_id) DO UPDATE
SET is_enabled = EXCLUDED.is_enabled,
    order_index = EXCLUDED.order_index;
