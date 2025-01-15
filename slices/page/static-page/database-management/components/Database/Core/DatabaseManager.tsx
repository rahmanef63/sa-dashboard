'use client';

import { useCallback, useState } from "react";
import { DatabaseHeader } from "./DatabaseHeader";
import { DatabaseTabs } from "./DatabaseTabs";
import { DatabaseForm } from "../Forms/DatabaseForm";
import { FormDialog } from "@/shared/components/FormDialog";
import { useDialogState } from "../../../hooks/useDialogState";
import { useDatabaseOperations } from "../../../hooks/useDatabaseOperations";
import { Database, DatabaseFormData } from "@/shared/types/database";

export const DatabaseManager = () => {
  const {
    databases,
    isLoading,
    error,
    createDatabase,
    updateDatabase,
    deleteDatabase,
    refetchDatabases,
  } = useDatabaseOperations();

  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);

  const {
    isCreateDbDialogOpen,
    isEditDbDialogOpen,
    isDeleteDbDialogOpen,
    openCreateDbDialog,
    closeCreateDbDialog,
    openEditDbDialog,
    closeEditDbDialog,
    openDeleteDbDialog,
    closeDeleteDbDialog,
  } = useDialogState();

  const handleCreateDatabase = useCallback(
    async (formData: DatabaseFormData) => {
      await createDatabase(formData);
      closeCreateDbDialog();
      await refetchDatabases();
    },
    [createDatabase, closeCreateDbDialog, refetchDatabases]
  );

  const handleUpdateDatabase = useCallback(
    async (formData: DatabaseFormData) => {
      if (selectedDatabase) {
        await updateDatabase(selectedDatabase.name, formData);
        closeEditDbDialog();
        await refetchDatabases();
      }
    },
    [selectedDatabase, updateDatabase, closeEditDbDialog, refetchDatabases]
  );

  const handleDeleteDatabase = useCallback(
    async (database: Database) => {
      await deleteDatabase(database.name);
      closeDeleteDbDialog();
      setSelectedDatabase(null);
      await refetchDatabases();
    },
    [deleteDatabase, closeDeleteDbDialog, refetchDatabases]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <DatabaseHeader
        selectedDatabase={selectedDatabase}
        onCreateClick={openCreateDbDialog}
      />

      <DatabaseTabs
        databases={databases}
        selectedDatabase={selectedDatabase}
        onDatabaseSelect={setSelectedDatabase}
        onEditClick={openEditDbDialog}
        onDeleteClick={openDeleteDbDialog}
      />

      <FormDialog
        isOpen={isCreateDbDialogOpen}
        title="Create New Database"
        description="Enter the details for your new database."
        onClose={closeCreateDbDialog}
      >
        <DatabaseForm onSubmit={handleCreateDatabase} />
      </FormDialog>

      <FormDialog
        isOpen={isEditDbDialogOpen}
        title="Edit Database"
        description="Update the database details."
        onClose={closeEditDbDialog}
      >
        <DatabaseForm
          initialData={selectedDatabase || undefined}
          onSubmit={handleUpdateDatabase}
        />
      </FormDialog>

      <FormDialog
        isOpen={isDeleteDbDialogOpen}
        title="Delete Database"
        description="Are you sure you want to delete this database? This action cannot be undone."
        onClose={closeDeleteDbDialog}
      >
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={closeDeleteDbDialog}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => selectedDatabase && handleDeleteDatabase(selectedDatabase)}
          >
            Delete
          </button>
        </div>
      </FormDialog>
    </div>
  );
};