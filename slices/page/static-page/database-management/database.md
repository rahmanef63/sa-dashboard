# Database Management Module Documentation

## Database Schema

### Core Tables

#### Users Table
- `id` UUID PRIMARY KEY
- `email` VARCHAR(255) UNIQUE NOT NULL
- `name` VARCHAR(255) NOT NULL
- `role` VARCHAR(50) NOT NULL DEFAULT 'user'
- `avatar` VARCHAR(255)
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

#### Dashboards Table
- `id` UUID PRIMARY KEY
- `name` VARCHAR(255) NOT NULL
- `description` TEXT
- `icon` VARCHAR(255)
- `logo` VARCHAR(255) DEFAULT 'layout-dashboard'
- `plan` VARCHAR(50) DEFAULT 'Personal'
- `is_public` BOOLEAN DEFAULT false
- `is_active` BOOLEAN DEFAULT true
- `default_menu_id` UUID
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE
- `created_by` UUID REFERENCES users(id)
- `updated_by` UUID REFERENCES users(id)

#### Dashboard Users Table (Junction)
- `id` UUID PRIMARY KEY
- `dashboard_id` UUID REFERENCES dashboards(id) CASCADE
- `user_id` UUID REFERENCES users(id) CASCADE
- `role` VARCHAR(50) DEFAULT 'viewer'
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE
- UNIQUE(dashboard_id, user_id)

### Menu Management Tables

#### Menus Table
- `id` UUID PRIMARY KEY
- `dashboard_id` UUID REFERENCES dashboards(id) CASCADE
- `name` VARCHAR(255) NOT NULL
- `icon` VARCHAR(255)
- `menu_type` VARCHAR(50) NOT NULL DEFAULT 'sidebar'
- `is_default` BOOLEAN DEFAULT false
- `is_active` BOOLEAN DEFAULT true
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE
- UNIQUE(dashboard_id, name)

#### Menu Items Table
- `id` UUID PRIMARY KEY
- `menu_id` UUID REFERENCES menus(id) CASCADE
- `parent_id` UUID REFERENCES menu_items(id) CASCADE
- `title` VARCHAR(255) NOT NULL
- `icon` VARCHAR(255)
- `url_href` VARCHAR(255)
- `target` VARCHAR(50)
- `rel` VARCHAR(255)
- `order_index` INTEGER DEFAULT 0
- `is_active` BOOLEAN DEFAULT true
- `is_collapsible` BOOLEAN DEFAULT false
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE

Indexes:
- `idx_menu_items_menu_id` ON menu_items(menu_id)
- `idx_menu_items_parent_id` ON menu_items(parent_id)
- `idx_menu_items_order` ON menu_items(order_index)

### User Preferences Table
- `id` UUID PRIMARY KEY
- `user_id` UUID REFERENCES users(id) CASCADE
- `dashboard_id` UUID REFERENCES dashboards(id) CASCADE
- `menu_id` UUID REFERENCES menus(id) CASCADE
- `settings` JSONB DEFAULT '{}'
- `created_at` TIMESTAMP WITH TIME ZONE
- `updated_at` TIMESTAMP WITH TIME ZONE
- UNIQUE(user_id, dashboard_id, menu_id)

## Directory Structure Overview

The database management module is organized into several key directories, each serving a specific purpose:

### Core Components
- `page.tsx` - Main page component
- `types.ts` - Core type definitions

### Components Directory
Main UI components for different database tables and management interfaces:

#### Table Components
- `ClientsTable.tsx` - Manages client data display
- `CoursesTable.tsx` - Handles course information
- `DatabaseTableForm.tsx` - Form for table operations
- `DatabaseTables.tsx` - Main tables container
- `DatabaseTabs.tsx` - Navigation tabs
- `DesignAssetsTable.tsx` - Design assets management
- `EmployeesTable.tsx` - Employee data management
- `ProjectsTable.tsx` - Projects information
- `TransactionsTable.tsx` - Transactions data

#### Database Manager Components
Located in `/components/DatabaseManager/`:
- `DatabaseContent.tsx` - Main content display
- `DatabaseEmptyState.tsx` - Empty state handling
- `DatabaseForm.tsx` - Database form operations
- `DatabaseHeader.tsx` - Header component
- `DatabaseManager.tsx` - Main manager component
- `types.ts` - Manager-specific types

#### Preview Components
- `TablePreview/TablePreview.tsx` - Preview functionality for tables

### Supporting Directories

#### Constants
- `database.ts` - Database constants
- `tableColumns.tsx` - Column definitions

#### Data
- `seedData.ts` - Initial data for tables

#### Hooks
Custom React hooks for database operations:
- `useDatabaseOperations.ts` - Database CRUD operations
- `useDialogState.ts` - Dialog state management

#### Library
- `databaseOperations.ts` - Core database operations

#### Types
- `index.ts` - Type definitions and interfaces

#### Utils
- `validation.ts` - Validation utilities

## Key Features
1. Table Management
2. Database Operations
3. Data Preview
4. Form Handling
5. State Management
6. Data Validation

## Architecture
The module follows a component-based architecture with clear separation of concerns:
- UI Components for data display and interaction
- Hooks for business logic and state management
- Utils for shared functionality
- Constants for configuration
- Types for type safety
