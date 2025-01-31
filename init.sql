-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables and functions
DO $$
BEGIN
    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS menu_items CASCADE;
    DROP TABLE IF EXISTS dashboard_users CASCADE;
    DROP TABLE IF EXISTS dashboards CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Create users table
    CREATE TABLE users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create dashboards table
    CREATE TABLE dashboards (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(255),
        plan VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create dashboard_users table for many-to-many relationship
    CREATE TABLE dashboard_users (
        dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'viewer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (dashboard_id, user_id)
    );
    
    -- Create menu_items table
    CREATE TABLE menu_items (
        id VARCHAR(255) PRIMARY KEY,
        dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
        parent_id VARCHAR(255) REFERENCES menu_items(id) ON DELETE CASCADE,
        menu_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(255),
        url_href VARCHAR(255),
        menu_type VARCHAR(50) NOT NULL,
        is_default BOOLEAN DEFAULT false,
        is_menu_header BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create indexes
    CREATE INDEX idx_menu_items_dashboard_id ON menu_items(dashboard_id);
    CREATE INDEX idx_menu_items_parent_id ON menu_items(parent_id);
    CREATE INDEX idx_menu_items_menu_id ON menu_items(menu_id);
    CREATE INDEX idx_dashboards_user_id ON dashboards(user_id);
    CREATE INDEX idx_dashboard_users_dashboard_id ON dashboard_users(dashboard_id);
    CREATE INDEX idx_dashboard_users_user_id ON dashboard_users(user_id);
    
    RAISE NOTICE 'Created menu_items table and indexes';
END $$;

-- Create default dashboards for user function
CREATE OR REPLACE FUNCTION create_default_dashboards_for_user(user_id UUID)
RETURNS void AS $$
DECLARE
    dashboard_id UUID;
BEGIN
    RAISE NOTICE 'Creating default dashboards for user: %', user_id;

    -- Create main dashboard
    INSERT INTO dashboards (id, name, logo, plan, is_active, user_id)
    VALUES (uuid_generate_v4(), 'Main', 'layout-dashboard', 'Personal', true, user_id)
    RETURNING id INTO dashboard_id;
    
    RAISE NOTICE 'Created main dashboard with ID: % for user: %', dashboard_id, user_id;

    -- Create main menu items
    PERFORM create_default_menu_items(dashboard_id, 'main-menu', 'Main Menu', 'main', true);

    -- Create personal dashboard
    INSERT INTO dashboards (id, name, logo, plan, is_active, user_id)
    VALUES (uuid_generate_v4(), 'Personal', 'layout-dashboard', 'Personal', true, user_id)
    RETURNING id INTO dashboard_id;
    
    RAISE NOTICE 'Created personal dashboard with ID: % for user: %', dashboard_id, user_id;

    -- Create personal menu items
    PERFORM create_default_menu_items(dashboard_id, 'personal-menu', 'Personal Menu', 'personal', true);
END;
$$ LANGUAGE plpgsql;

-- Create default menu items function
CREATE OR REPLACE FUNCTION create_default_menu_items(
    dashboard_id UUID,
    menu_id VARCHAR(255),
    menu_name VARCHAR(255),
    menu_type VARCHAR(50),
    is_default BOOLEAN DEFAULT false
)
RETURNS void AS $$
DECLARE
    menu_header_id VARCHAR(255);
BEGIN
    RAISE NOTICE 'Creating menu items for dashboard: % with menu type: %', dashboard_id, menu_type;

    -- Create menu header
    INSERT INTO menu_items (
        id,
        dashboard_id,
        parent_id,
        menu_id,
        title,
        menu_type,
        is_default,
        is_menu_header,
        order_index
    )
    VALUES (
        menu_id || '-header',
        dashboard_id,
        NULL,
        menu_id,
        menu_name,
        menu_type,
        is_default,
        true,
        0
    )
    RETURNING id INTO menu_header_id;

    RAISE NOTICE 'Created menu header with ID: % for dashboard: %', menu_header_id, dashboard_id;

    -- Add Main Nav Items
    IF menu_type = 'main' THEN
        RAISE NOTICE 'Creating main menu items for dashboard: %', dashboard_id;
        
        -- Menu Switcher
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-menuSwitcher',
            dashboard_id,
            menu_header_id,
            menu_id,
            'Menu Switcher',
            'LayoutDashboard',
            NULL,
            menu_type,
            is_default,
            false,
            1
        );

        RAISE NOTICE 'Created menu switcher for dashboard: %', dashboard_id;

        -- Menu A
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-menuA',
            dashboard_id,
            menu_id || '-menuSwitcher',
            menu_id,
            'Menu A',
            'LayoutDashboard',
            '/menu-a',
            menu_type,
            is_default,
            false,
            2
        );

        RAISE NOTICE 'Created Menu A for dashboard: %', dashboard_id;

        -- Menu B
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-menuB',
            dashboard_id,
            menu_id || '-menuSwitcher',
            menu_id,
            'Menu B',
            'LayoutDashboard',
            '/menu-b',
            menu_type,
            is_default,
            false,
            3
        );

        RAISE NOTICE 'Created Menu B for dashboard: %', dashboard_id;
    END IF;

    -- Add Personal Nav Items
    IF menu_type = 'personal' THEN
        RAISE NOTICE 'Creating personal menu items for dashboard: %', dashboard_id;

        -- Weather
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-weather',
            dashboard_id,
            menu_header_id,
            menu_id,
            'Weather',
            'Cloud',
            '/weather',
            menu_type,
            is_default,
            false,
            1
        );

        RAISE NOTICE 'Created Weather menu item for dashboard: %', dashboard_id;

        -- News
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-news',
            dashboard_id,
            menu_header_id,
            menu_id,
            'News',
            'Newspaper',
            '/news',
            menu_type,
            is_default,
            false,
            2
        );

        RAISE NOTICE 'Created News menu item for dashboard: %', dashboard_id;

        -- Settings
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES (
            menu_id || '-settings',
            dashboard_id,
            menu_header_id,
            menu_id,
            'Settings',
            'Settings',
            '/settings',
            menu_type,
            is_default,
            false,
            3
        );

        RAISE NOTICE 'Created Settings menu item for dashboard: %', dashboard_id;

        -- Settings Children
        INSERT INTO menu_items (
            id, dashboard_id, parent_id, menu_id, title, 
            icon, url_href, menu_type, is_default, 
            is_menu_header, order_index
        )
        VALUES
            (menu_id || '-profile', dashboard_id, menu_id || '-settings', menu_id, 'Profile', 'User', '/settings/profile', menu_type, is_default, false, 1),
            (menu_id || '-account', dashboard_id, menu_id || '-settings', menu_id, 'Account', 'CreditCard', '/settings/account', menu_type, is_default, false, 2),
            (menu_id || '-appearance', dashboard_id, menu_id || '-settings', menu_id, 'Appearance', 'PaintBucket', '/settings/appearance', menu_type, is_default, false, 3),
            (menu_id || '-notifications', dashboard_id, menu_id || '-settings', menu_id, 'Notifications', 'Bell', '/settings/notifications', menu_type, is_default, false, 4);

        RAISE NOTICE 'Created Settings children menu items for dashboard: %', dashboard_id;
    END IF;

    RAISE NOTICE 'Finished creating menu items for dashboard: %', dashboard_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic dashboard creation
CREATE OR REPLACE FUNCTION create_default_dashboards_trigger()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'Trigger fired for user: %', NEW.id;
    PERFORM create_default_dashboards_for_user(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_default_dashboards_on_user_creation ON users;
CREATE TRIGGER create_default_dashboards_on_user_creation
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_default_dashboards_trigger();

-- Create a test user if not exists
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Delete existing test users
    DELETE FROM users WHERE email IN ('test@example.com', 'test2@example.com');
    
    -- Create first test user
    INSERT INTO users (id, email, name, role)
    SELECT 
        uuid_generate_v4(),
        'test@example.com',
        'Test User',
        'user'
    RETURNING id INTO test_user_id;
    
    RAISE NOTICE 'Created test user with ID: %', test_user_id;
    
    -- Create second test user
    INSERT INTO users (id, email, name, role)
    SELECT
        uuid_generate_v4(),
        'test2@example.com',
        'Test User 2',
        'user'
    RETURNING id INTO test_user_id;
    
    RAISE NOTICE 'Created second test user with ID: %', test_user_id;
END $$;

-- Final verification
DO $$
DECLARE
    user_count INTEGER;
    dashboard_count INTEGER;
    menu_item_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO dashboard_count FROM dashboards;
    SELECT COUNT(*) INTO menu_item_count FROM menu_items;
    
    RAISE NOTICE 'Final counts:';
    RAISE NOTICE 'Users: %', user_count;
    RAISE NOTICE 'Dashboards: %', dashboard_count;
    RAISE NOTICE 'Menu Items: %', menu_item_count;
END $$;
