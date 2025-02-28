# SA Dashboard: Project Knowledge Base

## Project Overview
The SA Dashboard (Super Admin Dashboard) is a Next.js-based dashboard application built with React and TypeScript. It features a flexible sidebar navigation system with dynamic menu items that can be fetched from different data sources, supporting multiple dashboards with role-based access control.

## Architecture

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Custom UI components with Radix UI primitives
- **State Management**: React Context API for global state
- **Styling**: Tailwind CSS with custom class-variance-authority (CVA) variants
- **API Communication**: Fetch API with custom service wrappers
- **Data Storage**: PostgreSQL (via pg module)

### Main Project Structure
- `/app`: Next.js 14 app router structure
  - `/api`: Backend API routes
  - `/dashboard`: Dashboard pages and layouts
- `/context`: React Context providers
- `/slices`: Feature-based modules (sidebar, menu, etc.)
- `/shared`: Shared components, hooks, and utilities

## Role-Based Access Control (RBAC)

The system implements a comprehensive role-based access control system with the following roles:
- **Super Admin**: Full system access with the ability to manage all dashboards, users, and databases
- **Admin**: Administrative access to specific dashboards
- **Super User/Manager**: Enhanced privileges within their assigned dashboards
- **User**: Standard access to assigned dashboards and features
- **Guest/Client**: Limited view-only access
- **Custom Role**: Dynamically created roles with configurable permissions

## Available Dashboards

The system currently supports multiple dashboard types:
1. **Main Dashboard** (Central Hub)
2. **Professional Dashboard** (Job & Freelance Management)
3. **Hobbies Dashboard**
4. **Travel Dashboard**
5. **Family Dashboard**
6. **Finance Dashboard**
7. **Health Dashboard**
8. **Study Dashboard**
9. **Home Dashboard**
10. **Personal Dashboard**
11. **Digital Dashboard**

Each dashboard can have its own unique menu structure, widgets, and access controls.

## Dashboard Navigation System

### Menu Items Data Flow
As identified in the project memories:

1. **Data Sources (Priority Order):**
   - First attempts to fetch from `dashboards` table's menu_items JSONB column (though this doesn't exist in the current schema)
   - If that fails (column doesn't exist), falls back to querying the separate `menu_items` table
   - If both approaches fail, uses hardcoded mock menu items

2. **Data Fetching:**
   - The API endpoint at `/api/sidebar/menu` handles menu item retrieval
   - Implements a robust error handling system for database structure variations
   - Transforms retrieved data to a consistent format regardless of source

3. **Menu Item Types:**
   - `MenuItem`: Base menu item with essential properties
   - `SubMenuItem`: Child menu items with parent references
   - `MenuGroup`: Groups of menu items with collapsible sections
   - `NavMainGroup`: Navigation main menu group structure

4. **Menu Tree Building:**
   - Raw menu items are transformed into a hierarchical tree structure
   - The system supports parent-child relationships with unlimited nesting
   - Items are sorted by a configurable order property

### Dynamic Menu Structures
- **Menu Switcher**: Allows users to switch between different menu configurations
- **Collapsible Menu Group**: Grouping of related menu items that can be expanded/collapsed
- **Menu Item**: Standard navigation link
- **Submenu Item (Collapsible)**: Nested navigation with expandable sections

### Caching System
- Client-side caching using `MenuCache` singleton service
- Caches both raw menu items and processed menu trees
- Uses localStorage for persistence between sessions
- Automatic cache invalidation on key events to ensure data freshness
- Support for manual cache control alongside state management tools
- Potential automatic polling or revalidation on window focus or network reconnection

### UI Components
- **Sidebar**: Main container for navigation elements
- **SidebarGroup**: Collapsible section of menu items
- **MenuItem**: Individual navigation link
- **MenuItemWithSubmenu**: Menu item that can contain nested items
- **DashboardSwitcher**: Allows switching between multiple dashboards

### Menu Access Control
- Menu items are tagged with role permissions
- Both frontend and backend validate the current user's role
- Support for dynamic roles that can adjust visibility on the fly
- Permission-based rendering prevents unauthorized access to menu items

### Error Handling
- Centralized error management for menu fetching
- Standardized error responses with comprehensive logging
- Fallback mechanisms including retries and user-friendly messages
- Graceful degradation when switching between data sources

### Route Tracking and Active Item Highlighting
- Leverages Next.js routing events to monitor path changes
- Active menu items are highlighted by matching the current URL with menu paths
- Nested routes update their parent menu states for a consistent user experience

### Deep Linking
- URLs are structured to include nested route parameters
- Direct access to specific nested views is supported for sharing or bookmarking
- Proper state restoration when accessing deep links

## Key Components

### API Layer
- RESTful API endpoints in `/app/api/`
- Menu items API at `/app/api/sidebar/menu/route.ts`
- Services with error handling and response normalization

### Context Providers
- `DashboardProvider`: Manages dashboard state (current selection, available dashboards)
- `MenuProvider`: Handles menu state and operations (fetching, updating items)

### Hooks
- `useMenu`: Interface for menu operations and state
- `useMenuFetch`: Handles menu data fetching with caching
- `useDashboard`: Access to dashboard context and operations

### UI Structure
- Responsive sidebar with collapsible menu groups
- Support for icons using the Lucide React icon library
- Hierarchical navigation with unlimited nesting
- Responsive design for mobile devices:
  - CSS media queries and dynamic classes for sidebar collapsibility
  - Hamburger menu transformation on mobile devices
  - Optimized touch interactions for mobile UX

## Database Structure
The application works with the following database schema:

### Actual Database Schema

1. **Dashboards Table**
   ```sql
   CREATE TABLE dashboards (
     id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
     name VARCHAR(255) NOT NULL,
     description TEXT,
     logo VARCHAR(255),
     plan VARCHAR(100),
     is_public BOOLEAN DEFAULT false,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

2. **Menu Items Table**
   ```sql
   CREATE TABLE menu_items (
     id UUID PRIMARY KEY,
     dashboard_id UUID,
     title VARCHAR(255),
     icon VARCHAR(255),
     url JSONB,
     parent_id UUID,
     order_index INTEGER,
     type VARCHAR(50),
     is_active BOOLEAN,
     created_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE
   );
   ```

3. **Dashboard Menus Table**
   ```sql
   CREATE TABLE dashboard_menus (
     id UUID PRIMARY KEY,
     user_id UUID,
     dashboard_id UUID,
     title VARCHAR(255),
     slug VARCHAR(255),
     parent_id UUID,
     order_index INTEGER,
     icon VARCHAR(255),
     route VARCHAR(255),
     metadata JSONB,
     type VARCHAR(50),
     is_active BOOLEAN,
     created_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE,
     FOREIGN KEY (dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE
   );
   ```

4. **Users Table**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     email VARCHAR(255),
     name VARCHAR(255),
     role VARCHAR(50),
     avatar VARCHAR(255),
     default_dashboard_id UUID,
     dashboard_ids ARRAY,
     dashboard_roles ARRAY,
     created_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE,
     FOREIGN KEY (default_dashboard_id) REFERENCES dashboards(id)
   );
   ```

### Relationships and References
- `dashboard_menus` has a foreign key constraint to `dashboards(id)` with cascade delete
- `users` has a foreign key constraint to `dashboards(id)` for the `default_dashboard_id` field
- The `users` table contains arrays for managing multiple dashboard associations (`dashboard_ids`) and their corresponding roles (`dashboard_roles`)

### Menu Item Data Handling
It's worth noting that while the code is prepared to handle menu items from a JSONB column in the dashboards table, the current database schema doesn't have this column. This suggests the code has been designed with flexibility to work with different database schemas, and currently relies on the separate `menu_items` table for navigation data.

The system appears to use two different approaches for menu items:
1. The `menu_items` table stores generic menu items associated with dashboards
2. The `dashboard_menus` table likely stores user-specific customizations of menu items, as it has both `user_id` and `dashboard_id` fields

Both tables include hierarchical navigation support through `parent_id` fields and ordering via `order_index`.

## Key Features
- Dynamic menu structure with collapsible sections
- Multi-dashboard support with admin interface for Super Admin users
- User-specific navigation options
- Client-side caching for improved performance
- Responsive design with mobile support
- Internationalization (i18n) for menu labels and content
- Analytics tracking for user interactions with menu items
- Support for both predefined and custom icons
- Multi-organization support allowing users to have different dashboards for different roles (e.g., Company A, Company B, Freelance work)
- Full CRUD operations for dashboards, menu items, and user roles
- Database management for Super Admin users

## Development Patterns
- Component-based architecture with clear separation of concerns
- Context API for state management
- Custom hooks for reusable logic
- Service-based API communication
- Type-safe interface with TypeScript
- Slice-based structure with vertical flow for module organization

## Advanced Features

### Internationalization (i18n)
- Menu labels and content are integrated with an i18n framework
- Support for dynamic language switching
- Localized content display based on user preferences

### Analytics and Tracking
- User interactions (clicks, route changes) with menu items are tracked
- Integration with analytics platforms (e.g., Google Analytics, Mixpanel)
- Custom events for fine-tuning UI/UX based on user behavior

### Icon Management
- Predefined icon set available for consistency
- Support for custom SVGs and external icon libraries
- Admin-configurable icon selection for menu items

## Upcoming Features

### AI Integration
- Context-aware AI acting as a knowledge base
- Intelligent assistance for dashboard navigation and operations

### Customizable UI
- Users can move and pin widgets across dashboards
- Personalized dashboard layouts and configurations

### RBAC Expansion
- Enhanced flexibility in managing user permissions
- More granular control over feature access