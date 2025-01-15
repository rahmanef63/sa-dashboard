import { Database, DatabaseTable, DatabaseMapping } from "shared/types/global";


export interface DatabaseFormData {
  name: string;
  description: string;
}

export interface DatabaseOperations {
  onAddTable: (table: DatabaseTable) => void;
  onUpdateTable: (table: DatabaseTable) => void;
  onDeleteTable: (tableId: string) => void;
}

export interface DatabaseContentProps extends DatabaseOperations {
  database: Database;
  onEditClick: (db: Database) => void;
  onDeleteClick: (db: Database) => void;
  availableTables: string[];
}

export interface DatabaseTableFormProps {
  onSave: (table: DatabaseTable) => void;
  availableTables: string[];
  initialTable?: DatabaseTable;
}

export interface DatabaseTablesProps extends DatabaseOperations {
  tables: DatabaseTable[];
  availableTables: string[];
}


export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  category: string;
  enrolledEmployees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseFeatureConfig {
  enabled: boolean;
  mapping: DatabaseMapping | null;
  syncInterval: number;
}

// Re-export global types for convenience
export type { Database, DatabaseTable, DatabaseMapping };