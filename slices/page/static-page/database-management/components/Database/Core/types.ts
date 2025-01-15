import { Database, DatabaseTable } from "shared/types/global";

export interface DatabaseFormData {
  name: string;
  description: string;
}

export interface DatabaseHeaderProps {
  onCreateClick: () => void;
}

export interface DatabaseFormProps {
  formData: DatabaseFormData;
  onChange: (data: DatabaseFormData) => void;
}

export interface DatabaseContentProps {
  database: Database;
  onEditClick: (db: Database) => void;
  onDeleteClick: (db: Database) => void;
  onAddTable: (table: DatabaseTable) => void;
  onUpdateTable: (table: DatabaseTable) => void;
  onDeleteTable: (tableId: string) => void;
  availableTables: string[];
}

export interface DatabaseEmptyStateProps {
  onCreateClick: () => void;
}