# SA Dashboard Implementation Plan

## 1. Database Structure

### Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    -- Dashboard-related fields
    default_dashboard_id UUID,
    dashboard_ids UUID[] DEFAULT '{}',
    dashboard_roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Dashboards Table
```sql
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255) DEFAULT 'layout-dashboard',
    plan VARCHAR(50) DEFAULT 'Personal',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    menu_items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Menu Items Table
```sql
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID REFERENCES dashboards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(255),
    url JSONB,
    parent_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    order_index INTEGER,
    type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 2. Implementation Steps

### Phase 1: Database Setup
1. Update `admin-db.ts`:
   - Add array-based dashboard operations
   - Add menu item operations
   - Add user operations with dashboard arrays

2. Create database migration:
   - Drop existing tables
   - Create new simplified schema
   - Add default admin user
   - Add sample dashboards and menu items

### Phase 2: API Layer Updates

#### Dashboard API (`app/api/sidebar/dashboards/route.ts`)
1. Update POST endpoint:
   ```typescript
   - Accept dashboard creation
   - Auto-add to user's dashboard_ids
   - Create default menu items
   ```

2. Update GET endpoint:
   ```typescript
   - Return dashboards with menu items
   - Include user roles from arrays
   ```

3. Update DELETE endpoint:
   ```typescript
   - Remove dashboard
   - Auto-remove from user's arrays
   ```

#### Menu API (`app/api/sidebar/menu/route.ts`)
1. Update endpoints to work with new schema:
   ```typescript
   - GET: Fetch menu items by dashboard
   - POST: Create menu items
   - PUT: Update menu structure
   - DELETE: Remove menu items
   ```

### Phase 3: Frontend Updates

#### Dashboard Slice (`slices/sidebar/dashboard/`)
1. Update types:
   ```typescript
   - Modify DashboardSchema
   - Update user-dashboard relationship types
   - Add menu item types
   ```

2. Update services:
   ```typescript
   - Modify dashboard CRUD operations
   - Add menu item operations
   - Update user dashboard operations
   ```

#### Menu Slice (`slices/sidebar/menu/`)
1. Update components:
   ```typescript
   - Modify menu rendering
   - Update menu item creation
   - Add drag-and-drop support
   ```

2. Update nav-user:
   ```typescript
   - Update user profile handling
   - Modify dashboard switching
   ```

#### Sidebar Components
1. Update `slices/sidebar/content/sidebar-content.tsx`:
   ```typescript
   - Modify menu fetching
   - Update rendering logic
   - Add role-based visibility
   ```

2. Update `slices/sidebar/app-sidebar.tsx`:
   ```typescript
   - Update dashboard switching
   - Modify menu state management
   ```

## 3. File Changes Required

### Shared Config
```typescript
// admin-db.ts
- Add array operations
- Update user queries
- Modify dashboard queries
```

### API Routes
```typescript
// dashboards/route.ts
- Update CRUD operations
- Modify response structure

// menu/route.ts
- Update menu operations
- Add array handling
```

### Dashboard Slice
```typescript
// types/index.ts
- Update interfaces
- Modify schemas

// api/dashboardService.ts
- Update API calls
- Modify data handling
```

### Menu Slice
```typescript
// nav-user/config.ts
- Update user config
- Modify menu structure

// nav-user/nav-user.tsx
- Update rendering
- Modify interactions
```

### Sidebar Components
```typescript
// sidebar-content.tsx
- Update menu fetching
- Modify rendering

// app-sidebar.tsx
- Update state management
- Modify dashboard handling
```

## 4. Progress Tracking

### Current Database Status
✅ Initial tables created:
- users
- dashboards
- menu_items

### Implementation Subtasks

#### 1. Basic Dashboard Operations
- [ ] Implement dashboard creation
  - Validate required fields (name, description)
  - Set default values (logo, plan, is_public, is_active)
  - Generate UUID for dashboard ID
  
- [ ] Implement dashboard retrieval
  - Get dashboard by ID
  - List all dashboards for a user
  - Filter active/inactive dashboards
  
- [ ] Implement dashboard updates
  - Update basic information
  - Toggle public/private status
  - Manage active status

#### 2. Menu Items Management
- [ ] Implement menu item creation
  - Add main menu items (Dashboard, Settings)
  - Support parent-child relationships
  - Maintain order_index
  
- [ ] Implement menu structure updates
  - Update menu item properties
  - Reorder menu items
  - Toggle item visibility
  
- [ ] Implement menu item deletion
  - Handle cascade deletion
  - Update parent-child relationships
  - Reorder remaining items

#### 3. User-Dashboard Integration
- [ ] Implement user dashboard assignment
  - Set default dashboard
  - Manage dashboard_ids array
  - Handle dashboard roles
  
- [ ] Implement dashboard access control
  - Validate user permissions
  - Handle public vs private access
  - Manage role-based access

#### 4. Testing & Validation
- [ ] Create test cases
  - Dashboard CRUD operations
  - Menu item management
  - User-dashboard relationships
  
- [ ] Perform integration testing
  - API endpoints
  - Database operations
  - Frontend components

#### 5. Frontend Implementation
- [ ] Update dashboard components
  - Dashboard creation form
  - Dashboard list view
  - Dashboard detail view
  
- [ ] Update menu components
  - Menu item creation/edit forms
  - Menu structure visualization
  - Drag-and-drop reordering

### Next Steps
1. Begin with Basic Dashboard Operations
2. Proceed with Menu Items Management
3. Implement User-Dashboard Integration
4. Complete Testing & Validation
5. Finalize Frontend Implementation

## 5. Testing Plan

### Unit Tests
1. Database Operations
   - Test array operations
   - Verify cascade deletes
   - Check data integrity

2. API Endpoints
   - Test CRUD operations
   - Verify response formats
   - Check error handling

3. Frontend Components
   - Test menu rendering
   - Verify dashboard switching
   - Check user interactions

### Integration Tests
1. User Flow
   - Dashboard creation to menu display
   - User role changes
   - Menu item updates

2. Data Flow
   - Database to API
   - API to frontend
   - Frontend to user interface

## 6. Migration Plan

### Step 1: Database
1. Backup existing data
2. Run new migrations
3. Migrate existing data to new structure

### Step 2: Backend
1. Update API endpoints
2. Deploy backend changes
3. Verify data integrity

### Step 3: Frontend
1. Update components
2. Deploy frontend changes
3. Verify user experience

## 7. Monitoring and Maintenance

### Performance Monitoring
1. Database queries
2. API response times
3. Frontend rendering

### Error Tracking
1. Database operations
2. API endpoints
3. User interactions

### Backup Strategy
1. Regular database backups
2. Configuration backups
3. User data preservation
