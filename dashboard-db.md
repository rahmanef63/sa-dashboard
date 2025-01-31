# Dashboard Database Documentation

## Overview
This document provides comprehensive information about the dashboard database structure, including table schemas, relationships, and CRUD operations.

## Database Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    dashboard_ids UUID[] DEFAULT '{}',
    dashboard_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Default User
```sql
-- Default admin user
id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
email: 'admin@example.com'
name: 'Admin User'
role: 'admin'
```

### 2. Dashboards Table
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    logo VARCHAR(255) DEFAULT 'layout-dashboard',
    plan VARCHAR(50) DEFAULT 'Personal',
    is_active BOOLEAN DEFAULT true,
    is_default_dashboard BOOLEAN DEFAULT false,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Common Queries

### 1. Fetch User with Dashboards
```sql
-- Basic user info with dashboard array
SELECT 
    u.id,
    u.email,
    u.name,
    u.role as user_role,
    u.dashboard_ids,
    u.dashboard_roles
FROM users u
WHERE u.id = :userId;

-- Detailed user info with dashboard details
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    u.role as user_role,
    (
        SELECT json_agg(json_build_object(
            'dashboard_id', d.id,
            'dashboard_name', d.name,
            'logo', d.logo,
            'plan', d.plan,
            'is_active', d.is_active,
            'is_default_dashboard', d.is_default_dashboard,
            'role', u.dashboard_roles[idx.n]
        ))
        FROM (
            SELECT generate_subscripts(u.dashboard_ids, 1) as n
        ) idx
        JOIN dashboards d ON d.id = u.dashboard_ids[idx.n]
    ) as dashboards
FROM users u
WHERE u.id = :userId;
```

### 2. Add Dashboard to User
```sql
-- Add a single dashboard
UPDATE users
SET 
    dashboard_ids = array_append(dashboard_ids, :dashboardId),
    dashboard_roles = array_append(dashboard_roles, :role)
WHERE id = :userId;

-- Add multiple dashboards
UPDATE users
SET 
    dashboard_ids = dashboard_ids || :newDashboardIds,
    dashboard_roles = dashboard_roles || :newDashboardRoles
WHERE id = :userId;
```

### 3. Remove Dashboard from User
```sql
-- Remove a single dashboard
UPDATE users
SET 
    dashboard_roles = array_remove(dashboard_roles, dashboard_roles[array_position(dashboard_ids, :dashboardId)]),
    dashboard_ids = array_remove(dashboard_ids, :dashboardId)
WHERE id = :userId;
```

### 4. Update Dashboard Role
```sql
-- Update role for a specific dashboard
UPDATE users
SET dashboard_roles[array_position(dashboard_ids, :dashboardId)] = :newRole
WHERE id = :userId AND :dashboardId = ANY(dashboard_ids);
```

## Implementation Steps

1. Fetch User
```typescript
// Query to get user data
const getUserQuery = `
SELECT 
    id,
    email,
    name,
    role as user_role,
    dashboard_ids,
    dashboard_roles,
    created_at,
    updated_at
FROM users
WHERE id = $1;
`;

// Execute query
const result = await db.query(getUserQuery, [userId]);
const user = result.rows[0];
```

2. Fetch User's Dashboards
```typescript
// Query to get user's dashboards with details
const getUserDashboardsQuery = `
SELECT 
    d.*,
    u.dashboard_roles[array_position(u.dashboard_ids, d.id)] as user_role
FROM users u
CROSS JOIN UNNEST(u.dashboard_ids) WITH ORDINALITY AS did(id, idx)
JOIN dashboards d ON d.id = did.id
WHERE u.id = $1
ORDER BY did.idx;
`;

// Execute query
const result = await db.query(getUserDashboardsQuery, [userId]);
const dashboards = result.rows;
```

3. Check Dashboard Access
```typescript
// Query to check if user has access to a specific dashboard
const checkDashboardAccessQuery = `
SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE id = $1 
    AND $2 = ANY(dashboard_ids)
) as has_access;
`;

// Execute query
const result = await db.query(checkDashboardAccessQuery, [userId, dashboardId]);
const hasAccess = result.rows[0].has_access;
```

## Indexes
- `idx_menu_items_dashboard_id` on `menu_items(dashboard_id)` - For faster lookups of menu items by dashboard
- `idx_menu_items_parent_id` on `menu_items(parent_id)` - For faster lookups of child menu items
- `idx_menu_items_order` on `menu_items(order_index)` - For faster sorting of menu items

## Database Environment Configuration
```env
POSTGRES_USER=postgres
POSTGRES_HOST=194.238.22.2
POSTGRES_DB=postgres
POSTGRES_PASSWORD=Bismillah63
POSTGRES_PORT=5432
ADMIN_DB=sadashboard
```

## Timestamps and Updates
All tables include:
- `created_at` - Set automatically on record creation
- `updated_at` - Updated automatically via trigger on record update

```sql
-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';
```

## Security Considerations
1. User authentication required for all non-public dashboard operations
2. Role-based access control implemented via:
   - User roles (admin, user)
   - Dashboard-specific roles (viewer, editor, admin)
3. Dashboard visibility controlled by:
   - User ownership (created_by)
   - Public flag (is_public)
   - Dashboard users table (shared access)
4. Cascade deletes configured to maintain referential integrity
5. UUID used for all primary keys to prevent enumeration attacks

## Default Menu Structure

### Main Menu
```
- Main Menu (Header)
  - Menu Switcher
    - Menu A
    - Menu B
```

### Personal Menu
```
- Personal Menu (Header)
  - Weather
  - News
  - Settings
    - Profile
    - Account
    - Appearance
    - Notifications
```

## Implementation Progress

### Completed
1. ✅ Created base table structure for users, dashboards, and menu_items
2. ✅ Implemented user creation trigger that automatically creates default dashboards
3. ✅ Implemented dashboard creation trigger that automatically creates menu items
4. ✅ Created functions for generating default menu items for both main and personal dashboards
5. ✅ Added proper indexing for better query performance
6. ✅ Implemented parent-child relationships for menu items
7. ✅ Added support for different menu types (main, personal)

### In Progress
1. 🔄 Fine-tuning menu item creation for specific dashboard types
2. 🔄 Adding more menu items based on dashboard requirements
3. 🔄 Implementing menu item ordering and hierarchy

### Todo
1. ⏳ Add support for menu item permissions
2. ⏳ Implement menu item visibility rules
3. ⏳ Add support for custom menu items
4. ⏳ Create API endpoints for menu item management
5. ⏳ Add validation for menu item URLs and icons

## Latest Changes (2025-01-30)
1. Simplified menu item structure to focus on essential navigation
2. Improved menu creation triggers with better error handling
3. Added more debug logging for easier troubleshooting
4. Fixed issues with menu item parent-child relationships
5. Added support for menu headers and menu type differentiation
