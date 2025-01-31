-- Insert default dashboard if it doesn't exist
INSERT INTO dashboards (name, description, logo, plan, is_public, is_active)
SELECT 
    'Main' as name,
    'Default Dashboard' as description,
    'layout-dashboard' as logo,
    'Personal' as plan,
    true as is_public,
    true as is_active
WHERE NOT EXISTS (
    SELECT 1 FROM dashboards 
    WHERE name = 'Main' OR name = 'main'
);
