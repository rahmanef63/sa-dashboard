# PostgreSQL Database Management System

## Project Overview
This project implements a full-stack database management system using PostgreSQL, Next.js, and TypeScript. The system allows users to create, manage, and monitor PostgreSQL databases through a modern web interface.

## Project Structure
```
sidebar/
├── app/
│   └── dashboard/
│       └── database-manager/
│           └── page.tsx           # Main database manager page
├── shared/
│   ├── components/
│   │   ├── FormDialog.tsx        # Reusable dialog component
│   │   ├── DebugConsole.tsx      # Debug console for monitoring API calls
│   │   └── sidebar/
│   │       └── app-sidebar.tsx   # Application sidebar with navigation
│   └── types/
│       └── database.ts           # Shared type definitions
└── slices/
    └── page/
        └── static-page/
            └── database-management/
                ├── components/
                │   └── Database/
                │       ├── Core/
                │       │   ├── DatabaseManager.tsx   # Main database management component
                │       │   ├── DatabaseHeader.tsx    # Header with actions
                │       │   ├── DatabaseTabs.tsx      # Database list view
                │       │   └── DatabaseTables.tsx    # Table management
                │       └── Forms/
                │           ├── DatabaseForm.tsx      # Database creation/edit form
                │           └── DatabaseTableForm.tsx # Table creation/edit form
                └── hooks/
                    ├── useDialogState.ts       # Dialog state management
                    └── useDatabaseOperations.ts # Database CRUD operations
```

## Component Architecture

### Core Components
1. **DatabaseManager**
   - Main component orchestrating database operations
   - Manages state for database CRUD operations
   - Handles dialog states for various operations

2. **DatabaseHeader**
   - Displays current database context
   - Provides database creation button
   - Shows database metadata

3. **DatabaseTabs**
   - Lists all available databases
   - Handles database selection
   - Provides edit and delete actions

4. **DatabaseTables**
   - Manages tables within a database
   - Provides table creation interface
   - Lists existing tables with actions

### Form Components
1. **DatabaseForm**
   - Handles database creation and editing
   - Form validation
   - Success/error feedback
   - Debug logging for form actions

2. **DatabaseTableForm**
   - Table creation and modification
   - Column definition
   - Constraint management

### Shared Components
1. **FormDialog**
   - Reusable dialog component
   - Clean form submission handling
   - Consistent UI for all forms

2. **DebugConsole**
   - Real-time API request/response monitoring
   - Network request tracking
   - Error logging and debugging
   - Color-coded log types (request, response, error)

3. **AppSidebar**
   - Navigation component
   - Database management section
   - Consistent access to features

## State Management
- Uses React hooks for local state management
- Custom hooks for specific functionalities:
  - `useDialogState`: Manages dialog visibility
  - `useDatabaseOperations`: Handles API calls and database operations

## API Integration
- RESTful API endpoints under `/api/database`
- Operations:
  - GET /api/database - List all databases
  - POST /api/database - Create new database
  - PUT /api/database/:name - Update database
  - DELETE /api/database/:name - Delete database

## Database Connection
- PostgreSQL connection via environment variables:
  ```env
  POSTGRES_USER=postgres
  POSTGRES_HOST=your_host
  POSTGRES_DB=postgres
  POSTGRES_PASSWORD=your_password
  POSTGRES_PORT=5432
  ```

## Features
- [x] Database Management
  - Create new databases
  - List existing databases
  - Update database properties
  - Delete databases
- [x] Debug Tools
  - Real-time API monitoring
  - Request/Response tracking
  - Error logging
- [x] User Interface
  - Modern, responsive design
  - Form validation
  - Success/Error feedback
  - Loading states

## Debugging
The application includes comprehensive debugging tools:
1. **Debug Console**
   - Shows real-time API requests and responses
   - Tracks form submissions
   - Displays database operations
   - Color-coded for different types of logs

2. **Server Logs**
   - Database operation tracking
   - Connection status monitoring
   - Error reporting

3. **Form Validation**
   - Input validation feedback
   - Error state handling
   - Success confirmation
