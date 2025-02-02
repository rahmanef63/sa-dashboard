-- Add test menu items
UPDATE dashboards 
SET menu_items = jsonb_build_array(
  jsonb_build_object(
    'id', 'menu1',
    'name', 'Dashboard',
    'path', '/dashboard',
    'icon', 'layout-dashboard',
    'parentId', null,
    'order', 1
  ),
  jsonb_build_object(
    'id', 'menu2',
    'name', 'Analytics',
    'path', '/analytics',
    'icon', 'chart-bar',
    'parentId', null,
    'order', 2
  ),
  jsonb_build_object(
    'id', 'menu3',
    'name', 'Reports',
    'path', '/reports',
    'icon', 'file-report',
    'parentId', 'menu2',
    'order', 1
  )
)
WHERE id = 'b24c5f8a-5e25-4f9d-8492-9bf5f418c408';
