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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Default User
```sql
-- Default admin user
INSERT INTO users (id, email, name, role) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'admin@example.com',
    'Admin User',
    'admin'
);
```

### 2. Dashboards Table
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255) DEFAULT 'layout-dashboard',
    plan VARCHAR(50) DEFAULT 'Personal',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. User Dashboards Table (Junction Table)
```sql
CREATE TABLE user_dashboards (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'owner',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, dashboard_id)
);
```

## Common Queries

### 1. Create Dashboard with User
```sql
-- Begin transaction
BEGIN;

-- Insert dashboard
INSERT INTO dashboards (name, description, logo, plan, is_public)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;

-- Link dashboard to user
INSERT INTO user_dashboards (user_id, dashboard_id, role, is_default)
VALUES ($1, $2, 'owner', false);

-- Commit transaction
COMMIT;
```

### 2. Get User's Dashboards
```sql
SELECT 
    d.*,
    ud.role as user_role,
    ud.is_default,
    u.name as user_name,
    u.email as user_email
FROM dashboards d
JOIN user_dashboards ud ON d.id = ud.dashboard_id
JOIN users u ON ud.user_id = u.id
WHERE ud.user_id = $1;
```

### 3. Delete Dashboard
```sql
-- Begin transaction
BEGIN;

-- Delete from user_dashboards (cascade will handle this automatically)
DELETE FROM user_dashboards WHERE dashboard_id = $1;

-- Delete the dashboard
DELETE FROM dashboards WHERE id = $1;

-- Commit transaction
COMMIT;
```

## Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sadashboard
ADMIN_DB=sadashboard
```

## Timestamps and Updates
All tables include `created_at` and `updated_at` timestamps that are automatically managed by the database. The `updated_at` field is updated via a trigger whenever the row is modified.

## Data Validation
- User emails must be unique
- Dashboard names must not be empty
- All UUIDs are automatically generated using uuid_generate_v4()
- Foreign key constraints ensure referential integrity
- Cascading deletes ensure clean removal of related records

## Security Considerations
1. User Authentication
   - All database operations require valid user credentials
   - User roles determine access levels

2. Dashboard Access
   - Users can only access dashboards they are linked to via user_dashboards
   - The is_public flag allows for dashboard sharing
   - Role-based access control via user_dashboards.role

3. Data Integrity
   - Foreign key constraints prevent orphaned records
   - Transactions ensure atomic operations
   - Input validation at both application and database levels
