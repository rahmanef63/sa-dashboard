import { QueryItem } from './types';

export const initialQueries: QueryItem[] = [
    {
        name: "Check Database Tables",
        description: "Check current table structure",
        query: `
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('users', 'dashboards', 'menu_items')
ORDER BY table_name, ordinal_position;`.trim()
    },
    {
        name: "Add Dashboard Arrays to Users",
        description: "Add columns for dashboard IDs and roles arrays to users table",
        query: `
-- Add array columns if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS dashboard_ids UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS dashboard_roles TEXT[] DEFAULT '{}';

-- Drop the dashboard_users table if it exists
DROP TABLE IF EXISTS dashboard_users;`.trim()
    },
    {
        name: "Add is_default_dashboard Column",
        description: "Add is_default_dashboard column to dashboards table",
        query: `
ALTER TABLE dashboards 
ADD COLUMN IF NOT EXISTS is_default_dashboard BOOLEAN DEFAULT false;

-- Set is_default_dashboard to true for the Main dashboard
UPDATE dashboards 
SET is_default_dashboard = true 
WHERE name = 'Main';`.trim()
    },
    {
        name: "Add Unique Constraint",
        description: "Add unique constraint on dashboard name",
        query: `
-- Drop the constraint if it exists (to avoid errors)
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE dashboards DROP CONSTRAINT IF EXISTS dashboards_name_key;
    EXCEPTION
        WHEN undefined_object THEN
            NULL;
    END;
END $$;

-- Add the unique constraint
ALTER TABLE dashboards ADD CONSTRAINT dashboards_name_key UNIQUE (name);`.trim()
    },
    {
        name: "Insert Other Dashboards",
        description: "Insert remaining dashboards from constants",
        query: `
-- First delete existing dashboards that we want to replace
DELETE FROM dashboards 
WHERE name IN (
    'Home', 'Professional', 'Study', 'Health', 'Travel', 
    'Family', 'Finance', 'Hobbies', 'Digital'
);

-- Then insert new ones with generated UUIDs
INSERT INTO dashboards (id, name, logo, plan, is_active, is_default_dashboard, user_id)
VALUES 
    (gen_random_uuid(), 'Home', 'home', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Professional', 'briefcase', 'Professional', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Study', 'graduation-cap', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Health', 'heart', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Travel', 'plane', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Family', 'users', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Finance', 'wallet', 'Professional', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Hobbies', 'palette', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    (gen_random_uuid(), 'Digital', 'monitor', 'Personal', true, true, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');`.trim()
    },
    {
        name: "Update User Dashboard Arrays",
        description: "Update admin user with all dashboard IDs and roles",
        query: `
-- Update admin user with all dashboard IDs and roles
UPDATE users 
SET 
    dashboard_ids = ARRAY(SELECT id FROM dashboards ORDER BY created_at),
    dashboard_roles = ARRAY_FILL('admin'::TEXT, ARRAY[ARRAY_LENGTH(ARRAY(SELECT id FROM dashboards), 1)])
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';`.trim()
    },
    {
        name: "List All Dashboards",
        description: "Display all dashboards with their details",
        query: `
SELECT 
    id,
    name,
    logo,
    plan,
    is_active,
    COALESCE(is_default_dashboard, false) as is_default_dashboard,
    user_id,
    created_at,
    updated_at
FROM dashboards
ORDER BY created_at DESC;`.trim()
    },
    {
        name: "List User Dashboards",
        description: "Display all user dashboard assignments using arrays",
        query: `
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    u.role as user_role,
    -- Combine dashboard info into a JSON array for better readability
    (
        SELECT json_agg(json_build_object(
            'dashboard_id', d.id,
            'dashboard_name', d.name,
            'role', u.dashboard_roles[idx.n],
            'created_at', d.created_at
        ))
        FROM (
            SELECT generate_subscripts(u.dashboard_ids, 1) as n
        ) idx
        JOIN dashboards d ON d.id = u.dashboard_ids[idx.n]
    ) as dashboard_assignments
FROM users u
WHERE array_length(u.dashboard_ids, 1) > 0
ORDER BY u.name;`.trim()
    }
];