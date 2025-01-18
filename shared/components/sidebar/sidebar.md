# Sidebar System Documentation

The application implements a modern, flexible sidebar system that combines both static and dynamic navigation capabilities, all powered by a unified type system.

## Type System

All sidebar components use a unified type system defined in `shared/types/navigation-types.ts`. This provides consistent typing across all navigation-related components.

### Core Types:

1. **Base Types**
   - `BaseNavigationItem`: Core interface for all navigation items
   - `NavUrl`: URL configuration type
   - `MenuItemWithChildren`: Extended type for nested navigation

2. **Component Props**
   - `MenuItemProps`: Props for basic menu items
   - `MenuSectionProps`: Props for menu sections
   - `CollapsibleMenuProps`: Props for expandable menus
   - `SecondaryMenuProps`: Props for secondary navigation

3. **Configuration Types**
   - `MenuDisplayConfig`: Visual display settings
   - `MenuStateConfig`: State management settings
   - `MenuThemeConfig`: Theming configuration
   - `MenuEventHandlers`: Event handling configuration

## Component Structure

### Core Components (`shared/components/sidebar/menu/`)

1. **MenuItem** (`menu-item.tsx`)
   - Base navigation component
   - Handles single menu items
   - Supports icons and labels
   - Props: `MenuItemProps`

2. **MenuSection** (`menu-section.tsx`)
   - Groups related menu items
   - Supports collapsible sections
   - Manages section headers
   - Props: `MenuSectionProps`

3. **CollapsibleMenu** (`collapsible-menu.tsx`)
   - Implements expandable/collapsible navigation
   - Handles nested menu items
   - Supports animations
   - Props: `CollapsibleMenuProps`

4. **SecondaryMenu** (`secondary-menu.tsx`)
   - Implements secondary navigation panel
   - Supports detailed sub-navigation
   - Props: `SecondaryMenuProps`

### Main Sidebar (`app-sidebar.tsx`)

The `AppSidebar` component serves as the main container, integrating:
- Team switcher
- Main navigation
- Projects navigation
- User navigation
- Secondary sidebar handling

Features:
- Collapsible sidebar
- Secondary navigation panel
- Persistent state
- Responsive design

## Navigation Structure

The navigation system supports:
1. Basic menu items with direct links
2. Collapsible sections with nested items
3. Secondary navigation panels
4. Icon support (Lucide icons or custom components)
5. Active state management
6. Hover and focus states

## State Management

- Local state for collapse/expand
- Secondary navigation state
- Team selection state
- Persistent preferences

## Styling and Theming

Components use Tailwind CSS with:
- Consistent color schemes
- Responsive layouts
- Smooth transitions
- Hover and active states
- Dark/light mode support

## Usage Example

```tsx
const navigationItems: MenuItemWithChildren[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <LayoutDashboard />,
    href: '/dashboard'
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: <FolderKanban />,
    isCollapsible: true,
    children: [
      {
        id: 'active-projects',
        title: 'Active Projects',
        href: '/projects/active'
      }
    ]
  }
]

<MenuSection 
  items={navigationItems}
  title="Main Navigation"
  isCollapsed={false}
  onSecondaryItemClick={handleSecondaryNav}
/>
```

## Best Practices

1. **Type Safety**
   - Always import types from `shared/types/navigation-types`
   - Use proper type annotations for props
   - Leverage TypeScript's type checking

2. **Component Usage**
   - Use `MenuSection` for grouped items
   - Use `CollapsibleMenu` for nested navigation
   - Use `SecondaryMenu` for detailed sub-navigation

3. **State Management**
   - Handle collapse state at appropriate levels
   - Manage secondary navigation properly
   - Persist important user preferences

4. **Performance**
   - Lazy load secondary navigation
   - Use proper React hooks
   - Implement proper memoization where needed

## Future Improvements

1. Enhanced animation system
2. More customizable theming options
3. Advanced state persistence
4. Additional navigation patterns
5. Improved accessibility features
