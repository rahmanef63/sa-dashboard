-- Add missing URL fields to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS url_target VARCHAR(10),
ADD COLUMN IF NOT EXISTS url_rel VARCHAR(50);

-- Update existing menu items with proper URL fields and icons
UPDATE menu_items SET
  url_target = '_self',
  icon = CASE 
    WHEN title = 'Dashboard' THEN 'LayoutDashboard'
    WHEN title = 'Analyze' THEN 'BarChart2'
    WHEN title = 'Menu Store' THEN 'Store'
    WHEN title = 'Database Management' THEN 'Database'
    WHEN title = 'Social Media' THEN 'Share2'
    WHEN title = 'Overview' THEN 'LayoutDashboard'
    WHEN title = 'Posts' THEN 'Inbox'
    WHEN title = 'Calendar' THEN 'Calendar'
    WHEN title = 'Analytics' THEN 'BarChart'
    ELSE icon
  END
WHERE icon IS NULL OR icon = '';

-- Insert default menu items if they don't exist
INSERT INTO menu_items (title, icon, url_href, url_target, is_collapsible, order_index)
SELECT 'Dashboard', 'LayoutDashboard', '/dashboard', '_self', false, 1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE title = 'Dashboard')
UNION ALL
SELECT 'Analyze', 'BarChart2', '/dashboard/analyze', '_self', false, 2
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE title = 'Analyze')
UNION ALL
SELECT 'Menu Store', 'Store', '/dashboard/menu-store', '_self', false, 3
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE title = 'Menu Store')
UNION ALL
SELECT 'Database Management', 'Database', '/dashboard/database-manager', '_self', false, 4
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE title = 'Database Management');

-- Insert Social Media section if it doesn't exist
WITH social_media AS (
  INSERT INTO menu_items (title, icon, url_href, url_target, is_collapsible, order_index)
  SELECT 'Social Media', 'Share2', NULL, '_self', true, 5
  WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE title = 'Social Media')
  RETURNING id
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
) AS child(title, icon, url_href, order_index)
WHERE NOT EXISTS (
  SELECT 1 
  FROM menu_items mi 
  WHERE mi.title = child.title 
  AND mi.parent_id = (SELECT id FROM menu_items WHERE title = 'Social Media')
);
