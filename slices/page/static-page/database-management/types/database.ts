export interface PostgresDatabase {
  name: string;
  size?: string;
  owner?: string;
}

export interface DatabaseFormData {
  name: string;
  description: string;
}

export interface DatabaseHeaderProps {
  onCreateClick: () => void;
}

export interface DatabaseTabsProps {
  databases: PostgresDatabase[];
  selectedDatabase: PostgresDatabase | null;
  onDatabaseSelect: (database: PostgresDatabase) => void;
  onEditClick: (database: PostgresDatabase) => void;
  onDeleteClick: (database: PostgresDatabase) => void;
}

export interface FormDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}

export const DIALOG_TITLES = {
  createDatabase: "Create New Database",
  editDatabase: "Edit Database",
  deleteDatabase: "Delete Database"
} as const;

export const DIALOG_DESCRIPTIONS = {
  createDatabase: "Enter the details for your new database.",
  editDatabase: "Update the database details.",
  deleteDatabase: "Are you sure you want to delete this database? This action cannot be undone."
} as const;
