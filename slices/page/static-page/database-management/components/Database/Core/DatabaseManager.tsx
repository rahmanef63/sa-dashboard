'use client';

import { useState } from "react";
import { Database, DatabaseFormData } from "@/shared/types/database";
import { DatabaseHeader } from "./DatabaseHeader";
import { DatabaseTabs } from "./DatabaseTabs";
import { DatabaseDetails } from "./DatabaseDetails";
import { FormDialog } from "@/shared/components/FormDialog";
import { DatabaseForm } from "../Forms/DatabaseForm";
import { useDatabaseOperations } from "slices/page/static-page/database-management/hooks/useDatabaseOperations";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

export const DatabaseManager = () => {
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { databases, isLoading, error, createDatabase, updateDatabase, deleteDatabase } = useDatabaseOperations();

  const handleCreateDatabase = async (data: DatabaseFormData) => {
    await createDatabase(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateDatabase = async (data: DatabaseFormData) => {
    if (selectedDatabase) {
      await updateDatabase(selectedDatabase.name, data);
    }
  };

  const handleDeleteDatabase = async (database: Database) => {
    await deleteDatabase(database.name);
    if (selectedDatabase?.name === database.name) {
      setSelectedDatabase(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DatabaseHeader
        selectedDatabase={selectedDatabase}
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Database List */}
        <div className="col-span-4">
          <DatabaseTabs
            databases={databases}
            selectedDatabase={selectedDatabase}
            onDatabaseSelect={setSelectedDatabase}
            onEditClick={(db) => setSelectedDatabase(db)}
            onDeleteClick={handleDeleteDatabase}
          />
        </div>

        {/* Database Details */}
        <div className="col-span-8">
          {selectedDatabase ? (
            <DatabaseDetails
              database={selectedDatabase}
              onEditClick={(formData: DatabaseFormData) => handleUpdateDatabase(formData)}
              onDeleteClick={() => handleDeleteDatabase(selectedDatabase)}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900">No Database Selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a database from the list or create a new one to get started.
              </p>
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Database
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Database Dialog */}
      <FormDialog
        isOpen={isCreateDialogOpen}
        title="Create Database"
        description="Enter the details for your new database."
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <DatabaseForm
          onSubmit={handleCreateDatabase}
        />
      </FormDialog>
    </div>
  );
};