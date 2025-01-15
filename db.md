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

2. **DatabaseTableForm**
   - Table creation and modification
   - Column definition
   - Constraint management

### Shared Components
1. **FormDialog**
   - Reusable dialog component
   - Handles form submission
   - Provides consistent UI for all forms

2. **AppSidebar**
   - Navigation component
   - Database management section
   - Consistent access to features

## State Management
- Uses React hooks for local state management
- Custom hooks for specific functionalities:
  - `useDialogState`: Manages dialog visibility
  - `useDatabaseOperations`: Handles API calls

## API Integration
- RESTful API endpoints under `/api/database`
- Operations:
  - GET /api/database - List all databases
  - POST /api/database - Create new database
  - PUT /api/database/:name - Update database
  - DELETE /api/database/:name - Delete database

## Features
- [x] Database Management
  - Create new databases
  - Modify existing databases
  - Delete databases
  - View database details

- [x] Table Management
  - Create database tables
  - Define table structure
  - Modify existing tables
  - Delete tables

- [x] User Interface
  - Modern, responsive design
  - Intuitive navigation
  - Real-time feedback
  - Error handling

## Development Status
{{ ... }}

## Security Measures
- [ ] Authentication required for all operations
- [ ] Role-based access control
- [ ] SQL injection prevention
- [ ] Input validation
- [ ] Secure connection handling

## Next Steps
1. Implement table structure visualization
2. Add data import/export functionality
3. Implement query builder interface
4. Add monitoring and metrics
5. Implement backup and restore features

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=your_database
   POSTGRES_USER=your_username
   POSTGRES_PASSWORD=your_password
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:3000/dashboard/database-manager`

{{ ... }}
