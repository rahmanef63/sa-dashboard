import { useState } from "react";
import { Database, DatabaseFormData } from "@/shared/types/database";
import { FormDialog } from "@/shared/components/FormDialog";
import { DatabaseForm } from "../Forms/DatabaseForm";
import { Pencil, Trash2, Table, Database as DatabaseIcon } from "lucide-react";
import { DatabaseTables } from "./DatabaseTables";
import { DatabaseBackup } from "./DatabaseBackup";
import { Button } from "shared/components/ui/button";

interface DatabaseDetailsProps {
  database: Database;
  onEditClick: (data: DatabaseFormData) => Promise<void>;
  onDeleteClick: () => Promise<void>;
}

export function DatabaseDetails({
  database,
  onEditClick,
  onDeleteClick,
}: DatabaseDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables'>('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditSubmit = async (formData: DatabaseFormData) => {
    await onEditClick(formData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteSubmit = async () => {
    await onDeleteClick();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{database.name}</h1>
          <p className="text-gray-500">{database.description || 'No description'}</p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DatabaseIcon className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Table className="h-4 w-4 inline mr-2" />
            Tables
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium">Database Info</h3>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.size}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.owner}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div>
            <DatabaseBackup databaseName={database.name} />
          </div>
        </div>
      ) : (
        <DatabaseTables databaseName={database.name} />
      )}
      {/* Edit Dialog */}
      <FormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Database"
        description="Update the database details."
      >
        <DatabaseForm
          onSubmit={handleEditSubmit}
          initialData={{
            name: database.name,
            description: database.description || '',
          }}
        />
      </FormDialog>

      {/* Delete Dialog */}
      <FormDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Database"
        description={`Are you sure you want to delete "${database.name}"? This action cannot be undone.`}
      >
        <div className="space-y-4">
          <p className="text-red-500">
            Warning: This will permanently delete the database and all its data.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </div>
        </div>
      </FormDialog>
    </div>
  );
}
