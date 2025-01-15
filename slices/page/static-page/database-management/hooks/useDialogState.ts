import { useState } from "react";
import { Database, DialogState } from "@/shared/types/database";

export function useDialogState(): DialogState {
  const [isCreateDbDialogOpen, setIsCreateDbDialogOpen] = useState(false);
  const [isEditDbDialogOpen, setIsEditDbDialogOpen] = useState(false);
  const [isDeleteDbDialogOpen, setIsDeleteDbDialogOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);

  const openCreateDbDialog = () => setIsCreateDbDialogOpen(true);
  const closeCreateDbDialog = () => setIsCreateDbDialogOpen(false);

  const openEditDbDialog = (database: Database) => {
    setSelectedDatabase(database);
    setIsEditDbDialogOpen(true);
  };
  const closeEditDbDialog = () => {
    setSelectedDatabase(null);
    setIsEditDbDialogOpen(false);
  };

  const openDeleteDbDialog = (database: Database) => {
    setSelectedDatabase(database);
    setIsDeleteDbDialogOpen(true);
  };
  const closeDeleteDbDialog = () => {
    setSelectedDatabase(null);
    setIsDeleteDbDialogOpen(false);
  };

  return {
    isCreateDbDialogOpen,
    isEditDbDialogOpen,
    isDeleteDbDialogOpen,
    selectedDatabase,
    openCreateDbDialog,
    closeCreateDbDialog,
    openEditDbDialog,
    closeEditDbDialog,
    openDeleteDbDialog,
    closeDeleteDbDialog,
  };
}