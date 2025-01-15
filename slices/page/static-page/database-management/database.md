# Database Management Module Documentation

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
