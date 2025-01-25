# PostgreSQL Database Management System

## Project Overview
This project implements a full-stack database management system using PostgreSQL, Next.js, and TypeScript. The system allows users to create, manage, and monitor PostgreSQL databases and their tables through a modern web interface.

## Current Status
Database CRUD Operations - Completed
Table Management - Completed
Query Interface - Completed

## Project Structure
```
sidebar/
├── app/
│   └── dashboard/
│   │   └── database-manager/
│   │       └── page.tsx           # Main database manager page
│   └── api/
│       └── database/
│           ├── route.ts              # Main database API (GET, POST)
│           └── [name]/
│               ├── route.ts          # Database operations (PUT, DELETE)
│               └── tables/
│                   └── route.ts      # Table operations
├── shared/
│   ├── components/
│   │   ├── FormDialog.tsx           # Reusable dialog component
│   │   ├── DebugConsole.tsx         # Debug console for monitoring
│   │   └── sidebar/
│   │       └── app-sidebar.tsx      # Application navigation
│   └── types/
│       ├── database.ts              # Database type definitions
│       └── table.ts                 # Table type definitions
└── slices/
    └── page/
        └── static-page/
            └── database-management/
                ├── components/
                │   └── Database/
                │       ├── Core/
                │       │   ├── DatabaseManager.tsx    # Main manager
                │       │   ├── DatabaseDetails.tsx    # Database details view
                │       │   ├── DatabaseTabs.tsx       # Database list
                │       │   └── DatabaseTables.tsx     # Table management
                │       └── Forms/
                │           ├── DatabaseForm.tsx       # Database creation/edit
                │           └── TableForm.tsx          # Table creation/edit
                └── hooks/
                    ├── useDatabaseOperations.ts      # Database CRUD hooks
                    └── useTableOperations.ts         # Table CRUD hooks

## Features Implementation

### Completed Features
#### Database Management
- Create new databases with names and descriptions
- List all available databases with size and owner info
- Update database descriptions
- Delete databases with connection termination
- Real-time updates after operations
- Error handling and validation
- Debug logging for operations

#### Table Management
- Create tables with custom schema
- Delete tables
- Modify table structure
- View table schema
- Preview table data

#### Data Operations
- Execute custom SQL queries
- CRUD operations on table data
- Data preview with pagination
- Data type support for all PostgreSQL types

#### Query Management
- Query editor with syntax highlighting
- Sample query templates
- Query history
- Query result display

### Planned Features
#### Backup & Restore
- Database export to SQL file
- Database import from SQL
- Automated backup scheduling
- Backup history management

#### Security & User Management
- Database user management
- Role-based access control
- Permission management
- Audit logging
- Password policy enforcement

#### Monitoring & Performance
- Active connection monitoring
- Query performance metrics
- Storage usage analytics
- Slow query logging
- System health dashboard

#### Data Migration Tools
- Schema migration tools
- Data import/export wizards
- Migration history tracking
- Schema version control

#### Query Optimization
- Query plan analyzer
- Index recommendations
- Query plan visualization
- Performance tuning suggestions

#### Maintenance Tools
- Table maintenance (VACUUM, ANALYZE)
- Storage monitoring
- Temporary data cleanup
- Table partitioning management

## Task List
<!-- dong delete or create new task, keep the order -->
### 1. Backup & Restore System
- [x] Database Export Feature
  - [x] Export database structure to SQL file
  - [x] Export data with/without structure option
  - [x] Compression support for large databases
  - [x] Progress indicator for large exports
  
- [ ] Database Import Feature
  - [ ] Import from SQL file with validation
  - [ ] Transaction support for safe imports
  - [ ] Error handling and rollback capability
  - [ ] Progress tracking for large imports

- [ ] Automated Backup System
  - [ ] Configurable backup schedules
  - [ ] Multiple backup retention policies
  - [ ] Backup verification system
  - [ ] Email notifications for backup status

### 2. Monitoring & Performance
- [ ] Connection Monitoring
  - [ ] Active connection dashboard
  - [ ] Connection pool statistics
  - [ ] Session tracking
  - [ ] Connection limit warnings

- [ ] Performance Metrics
  - [ ] Query execution time tracking
  - [ ] Resource usage monitoring
  - [ ] Performance bottleneck detection
  - [ ] Historical performance data

- [ ] Storage Management
  - [ ] Database size tracking
  - [ ] Table size monitoring
  - [ ] Index size analysis
  - [ ] Storage trend analysis

- [ ] Query Logging
  - [ ] Slow query detection
  - [ ] Query pattern analysis
  - [ ] Error logging
  - [ ] Query optimization suggestions

### 3. Security System
- [ ] User Management
  - [ ] User creation and management
  - [ ] Permission assignment
  - [ ] User activity monitoring
  - [ ] Session management

- [ ] Access Control
  - [ ] Role-based access control (RBAC)
  - [ ] Custom permission sets
  - [ ] Object-level permissions
  - [ ] IP-based access restrictions

- [ ] Audit System
  - [ ] Change tracking for schema
  - [ ] Data modification logging
  - [ ] User action logging
  - [ ] Audit report generation

- [ ] Security Policies
  - [ ] Password complexity rules
  - [ ] Password rotation policy
  - [ ] Failed login attempt tracking
  - [ ] Security alert system

### 4. Data Migration Tools
- [ ] Table Migration
  - [ ] Cross-table data transfer
  - [ ] Data transformation rules
  - [ ] Batch processing support
  - [ ] Migration validation

- [ ] Schema Management
  - [ ] Schema version control
  - [ ] Migration scripts
  - [ ] Rollback capabilities
  - [ ] Schema comparison tools

- [ ] Migration History
  - [ ] Detailed migration logs
  - [ ] Success/failure tracking
  - [ ] Performance metrics
  - [ ] Rollback points

### 5. Query Optimization
- [ ] Query Analysis
  - [ ] Query plan generation
  - [ ] Performance metrics collection
  - [ ] Bottleneck identification
  - [ ] Optimization suggestions

- [ ] Index Management
  - [ ] Index usage analysis
  - [ ] Missing index detection
  - [ ] Duplicate index identification
  - [ ] Index maintenance recommendations

- [ ] Query Plan Tools
  - [ ] Visual query plan explorer
  - [ ] Cost estimation
  - [ ] Plan comparison
  - [ ] Plan optimization suggestions

- [ ] Cache System
  - [ ] Query result caching
  - [ ] Cache invalidation rules
  - [ ] Cache hit ratio monitoring
  - [ ] Cache size management

### 6. Maintenance Tools
- [ ] Database Maintenance
  - [ ] Automated VACUUM scheduling
  - [ ] ANALYZE automation
  - [ ] Index maintenance
  - [ ] Statistics update

- [ ] Size Monitoring
  - [ ] Real-time size tracking
  - [ ] Growth prediction
  - [ ] Size alert system
  - [ ] Cleanup recommendations

- [ ] Cleanup Tools
  - [ ] Temporary data identification
  - [ ] Automated cleanup jobs
  - [ ] Custom cleanup rules
  - [ ] Cleanup verification

- [ ] Partitioning Management
  - [ ] Partition scheme design
  - [ ] Automated partition creation
  - [ ] Partition cleanup
  - [ ] Partition performance monitoring

## Priority Order
1. Backup & Restore System (Critical for data safety)
2. Security System (Essential for production use)
3. Monitoring & Performance (Important for maintenance)
4. Maintenance Tools (Necessary for long-term health)
5. Query Optimization (Performance improvement)
6. Data Migration Tools (Feature enhancement)

## API Link

### Database Operations
- `GET /api/database`
  - Lists all databases
  - Returns: `Database[]`

- `POST /api/database`
  - Creates a new database
  - Body: `DatabaseFormData`

- `PUT /api/database/[name]`
  - Updates database properties
  - Body: `DatabaseFormData`

- `DELETE /api/database/[name]`
  - Deletes a database
  - Handles connection termination

### Table Operations
- `GET /api/database/[name]/tables`
  - Lists all tables in database
  - Returns: `DatabaseTable[]`

- `POST /api/database/[name]/tables`
  - Creates a new table
  - Body: `TableFormData`

- `PUT /api/database/[name]/tables/[table]`
  - Modifies table structure
  - Body: `TableUpdateData`

- `DELETE /api/database/[name]/tables/[table]`
  - Drops a table

## Error Handling
- Client-side validation
- Server-side validation
- Safe JSON parsing
- Detailed error messages
- Error state management
- Debug logging

## Development Guidelines
1. Always handle database connections properly:
   ```typescript
   const client = await pool.connect();
   try {
     // Database operations
   } finally {
     client.release();
   }
   ```

2. Use proper error handling:
   ```typescript
   try {
     // Operation
   } catch (error: any) {
     logDebug("Operation - Error", {
       message: error.message,
       stack: error.stack,
       code: error.code
     });
     throw new Error(error.message);
   }
   ```

3. Implement proper validation:
   ```typescript
   if (!isValidName(name)) {
     throw new Error("Invalid name format");
   }
   ```

4. Always use parameterized queries:
   ```typescript
   const result = await client.query(
     'SELECT * FROM table WHERE name = $1',
     [name]
   );
   ```
