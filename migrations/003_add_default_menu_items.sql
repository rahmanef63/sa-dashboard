-- Insert default menu items for each dashboard
INSERT INTO menu_items (dashboard_id, title, icon, url_href, order_index)
SELECT 
    d.id as dashboard_id,
    'Overview' as title,
    'layout-dashboard' as icon,
    '/dashboard' as url_href,
    0 as order_index
FROM dashboards d
WHERE NOT EXISTS (
    SELECT 1 FROM menu_items mi 
    WHERE mi.dashboard_id = d.id AND mi.title = 'Overview'
);
