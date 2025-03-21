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
   ```sql
   SELECT
     d.id,
     d.name,
     d.description,
     d.logo,
     d.plan,
     d.is_public,
     d.is_active,
     d.created_at,
     d.updated_at
   FROM dashboards d
   WHERE d.is_active = true
   ORDER BY d.created_at DESC
   LIMIT 50
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
// slices/sidebar/config/admin-db.ts
- Add array operations
- Update user queries
- Modify dashboard queries
```

### API Routes
```typescript
// slices/sidebar/dashboard/api/route.ts
- Update CRUD operations
- Modify response structure

// slices/sidebar/menu/api/route.ts
- Update menu operations
- Add array handling
```

### Dashboard Slice
```typescript
// slices/sidebar/dashboard/types/index.ts
- Update interfaces
- Modify schemas

// slices/sidebar/dashboard/api/dashboardService.ts
- Update API calls
- Modify data handling
```

### Menu Slice
```typescript
// slices/sidebar/menu/nav-user/config.ts
- Update user config
- Modify menu structure

// slices/sidebar/menu/nav-user/nav-user.tsx
- Update rendering
- Modify interactions
```

### Sidebar Components
```typescript
// slices/sidebar/sidebar-content.tsx
- Update menu fetching
- Modify rendering

// slices/sidebar/app-sidebar.tsx
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
- [x] Implement dashboard creation
  - Validate required fields (name, description)
  - Set default values (logo, plan, is_public, is_active)
  - Generate UUID for dashboard ID
  
- [x] Implement dashboard retrieval
  - Get dashboard by ID
  - List all dashboards for a user
  - Filter active/inactive dashboards
  
- [x] Implement dashboard updates
  - Update basic information
  - Toggle public/private status
  - Manage active status

#### 2. Menu Items Management
- [x] Implement menu item creation
  - Add main menu items (Dashboard, Settings)
  - Support parent-child relationships
  - Maintain order_index
  
- [x] Implement menu structure updates
  - Update menu item properties
  - Reorder menu items
  - Toggle item visibility
  
- [x] Implement menu item deletion
  - Handle cascade deletion
  - Update parent-child relationships
  - Reorder remaining items

#### 3. User-Dashboard Integration
- [x] Implement user dashboard assignment
  - Set default dashboard
  - Manage dashboard_ids array
  - Handle dashboard roles
  
- [x] Implement dashboard access control
  - Validate user permissions
  - Handle public vs private access
  - Manage role-based access

#### 4. Testing & Validation
- [x] Create test cases
  - Dashboard CRUD operations
  - Menu item management
  - User-dashboard relationships
  
- [x] Perform integration testing
  - API endpoints
  - Database operations
  - Frontend components

#### 5. Frontend Implementation
- [x] Update dashboard components
  - Dashboard creation form
  - Dashboard list view
  - Dashboard detail view
  
- [x] Update menu components
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

## Progress Update (Feb 1, 2025)

### ✅ Completed
1. Set up basic dashboard structure and components
2. Implemented dashboard database schema and API endpoints
3. Created DashboardService with basic CRUD operations
4. Implemented DashboardSwitcher component UI
5. Connected API endpoints to fetch dashboard data
6. Fixed type issues in DashboardSwitcher component

### 🚧 In Progress
1. **Data Loading Issues**
   - API is successfully fetching data (confirmed in terminal logs)
   - Multiple redundant API calls detected
   - UI not displaying fetched data properly
   - Need to implement proper caching mechanism

2. **Optimization Needed**
   - Implement caching in DashboardService
   - Reduce duplicate API calls
   - Add proper loading states
   - Handle error states better

### 📝 Next Steps
1. Fix multiple API calls issue by:
   - Implementing proper caching in DashboardService
   - Using React Query or similar for data fetching
   - Adding debounce/throttling where needed

2. Improve data display:
   - Debug why UI is not showing fetched data
   - Add proper error boundaries
   - Implement loading skeletons
   - Add error messages for failed states

3. Add user dashboard preferences:
   - Save last selected dashboard
   - Remember user's dashboard order
   - Implement dashboard pinning

## Technical Notes

### API Response Structure
```json
{
  "id": "uuid",
  "name": "Dashboard Name",
  "description": "Description",
  "logo": "layout-dashboard",
  "plan": "Personal",
  "is_public": boolean,
  "is_active": boolean,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Known Issues
1. Multiple API calls to `/api/sidebar/dashboards`
2. UI not reflecting data despite successful API responses
3. Missing proper caching mechanism
4. Need to implement proper error handling

### Performance Considerations
- Implement caching to reduce API calls
- Consider implementing server-side caching
- Add debounce for rapid dashboard switches
- Optimize re-renders in React components

## 8. Authentication and Sidebar Design Review

### What's Wrong:
  - **Mixing Concerns:**
    - Login logic is intertwined with sidebar/menu services.
    - Authentication isn’t clearly separated from UI rendering.
  - **Ambiguous File Roles:**
    - *service.ts* under the sidebar folder suggests login is handled there, which can be confusing.
    - *admin-db.ts* looks out of place if it's used for login-related configurations.
  - **Missing Details:**
    - Lacks explicit error handling, session/token management, and security measures.
    - Doesn’t clearly show how state updates (like Redux slices) handle user data independently.

### Best Approach:
  - **Separate Authentication:**
    - Create a dedicated authentication module (e.g., `app/api/auth`) for login API calls.
    - Use separate Redux slices or contexts for user authentication and sidebar UI state.
  - **Clear File Organization:**
    - Keep API functions for login separate from menu/sidebar functions.
    - Rename and reorganize config files (e.g., move admin DB config to a more intuitive location).
  - **Improve State & Error Handling:**
    - Integrate proper error handling and secure token/session management.
    - Use middleware (like Redux-Thunk or Redux-Saga) to manage asynchronous login processes.
  - **Refine Custom Hooks:**
    - Let `useSidebar.ts` manage only sidebar state; don’t let it depend directly on login logic.
    - Use dedicated hooks for fetching or managing user authentication data if needed.
