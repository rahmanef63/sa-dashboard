'use client';

import { Database } from "@/shared/types/database";

interface DatabaseTabsProps {
  databases: Database[];
  selectedDatabase: Database | null;
  onDatabaseSelect: (database: Database) => void;
  onEditClick: (database: Database) => void;
  onDeleteClick: (database: Database) => void;
}

export const DatabaseTabs: React.FC<DatabaseTabsProps> = ({
  databases = [],
  selectedDatabase,
  onDatabaseSelect,
  onEditClick,
  onDeleteClick,
}) => {
  if (!databases || databases.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No databases found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {databases.map((database) => (
        <div
          key={database.name}
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedDatabase?.name === database.name
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onClick={() => onDatabaseSelect(database)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{database.name}</h3>
              {database.description && (
                <p className="text-sm text-gray-600">{database.description}</p>
              )}
              <div className="mt-1 text-sm text-gray-500">
                <span>Size: {database.size || "N/A"}</span>
                <span className="mx-2">•</span>
                <span>Owner: {database.owner || "N/A"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick(database);
                }}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(database);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};