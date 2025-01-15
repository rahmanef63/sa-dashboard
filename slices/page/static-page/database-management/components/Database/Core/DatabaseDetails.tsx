'use client';

import { Database, DatabaseFormData } from "@/shared/types/database";
import { useState } from "react";
import { FormDialog } from "@/shared/components/FormDialog";
import { DatabaseForm } from "../Forms/DatabaseForm";
import { Pencil, Trash2, Table, Database as DatabaseIcon } from "lucide-react";

interface DatabaseDetailsProps {
  database: Database;
  onEditClick: (formData: DatabaseFormData) => Promise<void>;
  onDeleteClick: (database: Database) => Promise<void>;
}

export const DatabaseDetails: React.FC<DatabaseDetailsProps> = ({
  database,
  onEditClick,
  onDeleteClick,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tables'>('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEditSubmit = async (formData: DatabaseFormData) => {
    await onEditClick(formData);
    setIsEditDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    await onDeleteClick(database);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{database.name}</h2>
          <p className="text-gray-600">{database.description || 'No description'}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>Size: {database.size || 'N/A'}</span>
            <span className="mx-2">•</span>
            <span>Owner: {database.owner || 'N/A'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="Edit Database"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            title="Delete Database"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <DatabaseIcon className="h-5 w-5 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'tables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Table className="h-5 w-5 inline-block mr-2" />
            Tables
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Database Information</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.owner || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.size || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.description || 'No description'}</dd>
                </div>
              </dl>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Statistics</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Number of Tables</dt>
                  <dd className="mt-1 text-sm text-gray-900">Coming soon</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{database.size || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Database Tables</h3>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {/* TODO: Implement table creation */}}
              >
                Create Table
              </button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Table list will go here */}
              <div className="p-6 text-center text-gray-500">
                Table management coming soon
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <FormDialog
        isOpen={isEditDialogOpen}
        title="Edit Database"
        description="Modify the database details."
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DatabaseForm
          initialData={database}
          onSubmit={handleEditSubmit}
        />
      </FormDialog>

      {/* Delete Dialog */}
      <FormDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Database"
        description="Are you sure you want to delete this database? This action cannot be undone."
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-500">
            This will permanently delete the database "{database.name}" and all its data.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete Database
            </button>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};
