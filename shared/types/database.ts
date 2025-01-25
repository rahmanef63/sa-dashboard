import { ReactNode } from 'react';

export interface Database {
  name: string;
  size?: string;
  owner?: string;
  description?: string;
}

export interface DatabaseFormData {
  name: string;
  description: string;
}

export interface DatabaseHeaderProps {
  selectedDatabase: Database | null;
  onCreateClick: () => void;
}

export interface BackupOptions {
  type: "structure" | "full";
  compression: boolean;
}

export interface BackupResponse {
  success: boolean;
  message: string;
  file?: string;
  error?: string;
  details?: string;
}

export interface DatabaseTabsProps {
  databases: Database[];
  selectedDatabase: Database | null;
  onDatabaseSelect: (database: Database) => void;
  onEditClick: (database: Database) => void;
  onDeleteClick: (database: Database) => void;
}

export interface FormDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  children: ReactNode;
}

export interface DialogState {
  isCreateDbDialogOpen: boolean;
  isEditDbDialogOpen: boolean;
  isDeleteDbDialogOpen: boolean;
  selectedDatabase: Database | null;
  openCreateDbDialog: () => void;
  closeCreateDbDialog: () => void;
  openEditDbDialog: (database: Database) => void;
  closeEditDbDialog: () => void;
  openDeleteDbDialog: (database: Database) => void;
  closeDeleteDbDialog: () => void;
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