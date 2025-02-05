# Multi-Dashboard Navigation Implementation Plan

## Data Structures & Types

### Menu Types
- [ ] Create interfaces in `types/menu.ts`:
  ```typescript
  interface MenuGroup {
    id: string;
    name: string;
    order: number;
    dashboardId: string;
    items: MenuItem[];
  }

  interface MenuSwitch {
    id: string;
    name: string;
    icon?: string;
    dashboards: {
      id: string;
      name: string;
      icon?: string;
    }[];
  }

  interface MenuItem {
    id: string;
    name: string;
    order: number;
    icon?: string;
    path?: string;
    groupId: string;
    dashboardId: string;
    subItems?: SubMenuItem[];
  }

  interface SubMenuItem {
    id: string;
    name: string;
    order: number;
    icon?: string;
    path: string;
    parentId: string;
    dashboardId: string;
  }
  ```

### Dashboard-Specific Data
- [ ] Enhance NavMainData type:
  ```typescript
  interface NavMainData {
    dashboardId: string;
    groups: MenuGroup[];
    items: MenuItem[];
    subItems: SubMenuItem[];
  }
  ```

## State Management

### Dashboard Context
- [ ] Create `context/dashboard-context.tsx`:
  - Implement DashboardProvider
  - Add useDashboard hook
  - Store current dashboardId

### Local Storage & Hooks
- [ ] Update menu-cache.ts:
  - Add dashboardId to storage keys
  - Implement per-dashboard data separation
- [ ] Enhance useMenuState:
  - Add dashboard-aware storage
  - Centralize CRUD operations

## UI Components

### Base Components
- [ ] Update BaseNavigationForm
  - Add dashboard selection
  - Pass dashboardId to handlers
- [ ] Enhance GroupForm and ItemForm
  - Add dashboard context integration

### Menu Components
- [ ] Create MenuGroup component
  - Implement collapsible groups
  - Add drag-and-drop support
- [ ] Build MenuSwitch component
  - Dashboard selector UI
  - Smooth transition handling

### Submenu Components
- [ ] Implement SubMenuItem component
  - Reuse collapsible logic
  - Add depth controls

## Dashboard Switching

### MenuSwitch Implementation
- [ ] Build dashboard selector UI
- [ ] Implement context switching
- [ ] Add data persistence

### Data Management
- [ ] Implement data loading per dashboard
- [ ] Add caching strategy
- [ ] Handle transition states

## Utilities & Best Practices

### Shared Utilities
- [ ] Create menu utility functions:
  - ID generation
  - Sort handling
  - URL formatting

### Performance Optimizations
- [ ] Add React.memo where needed
- [ ] Implement useCallback for handlers
- [ ] Add useMemo for computed values

## Testing & Validation

### Test Cases
- [ ] Dashboard switching
- [ ] Menu CRUD operations
- [ ] Data persistence
- [ ] Performance testing

### Debug Tools
- [ ] Add logging utilities
- [ ] Implement error boundaries
- [ ] Create debug views

## Progress Tracking

### Completed
- Initial planning
- Documentation setup

### In Progress
- Data structure definition
- Component architecture

### Next Steps
1. Implement core interfaces
2. Set up dashboard context
3. Update existing components
4. Build MenuSwitch component
