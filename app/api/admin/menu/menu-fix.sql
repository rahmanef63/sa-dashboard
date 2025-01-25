-- Add URL fields to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS url_href VARCHAR(255),
ADD COLUMN IF NOT EXISTS url_target VARCHAR(10),
ADD COLUMN IF NOT EXISTS url_rel VARCHAR(50);

-- Update existing menu items with proper URL fields and icons
UPDATE menu_items SET
  url_href = CASE 
    WHEN title = 'Dashboard' THEN '/dashboard'
    WHEN title = 'Analyze' THEN '/dashboard/analyze'
    WHEN title = 'Menu Store' THEN '/dashboard/menu-store'
    WHEN title = 'Database Management' THEN '/dashboard/database-manager'
    WHEN title = 'Overview' THEN '/dashboard/social-media/overview'
    WHEN title = 'Posts' THEN '/dashboard/social-media/posts'
    WHEN title = 'Calendar' THEN '/dashboard/social-media/calendar'
    WHEN title = 'Analytics' THEN '/dashboard/social-media/analytics'
    ELSE url_href
  END,
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
