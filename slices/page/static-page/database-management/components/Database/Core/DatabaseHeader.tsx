import { DatabaseHeaderProps } from "@/shared/types/database";

export const DatabaseHeader: React.FC<DatabaseHeaderProps> = ({
  selectedDatabase,
  onCreateClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {selectedDatabase ? selectedDatabase.name : "Databases"}
        </h1>
        {selectedDatabase?.description && (
          <p className="mt-1 text-sm text-gray-500">
            {selectedDatabase.description}
          </p>
        )}
      </div>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create Database
      </button>
    </div>
  );
};