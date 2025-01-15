import { Database, DatabaseFormData } from "@/shared/types/database";
import { useEffect, useState } from "react";

interface DatabaseFormProps {
  initialData?: Database;
  onSubmit: (data: DatabaseFormData) => Promise<void>;
}

// Debug logging function
const logDebug = (operation: string, details: any) => {
  console.log(`[Database Form] ${operation}:`, details);
};

export const DatabaseForm: React.FC<DatabaseFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<DatabaseFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logDebug('handleSubmit', { formData });
    try {
      await onSubmit(formData);
      logDebug('handleSubmit - Success', { formData });
    } catch (error) {
      logDebug('handleSubmit - Error', { error, formData });
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Database Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => {
            const newData = { ...formData, name: e.target.value };
            setFormData(newData);
            logDebug('nameChange', { newValue: e.target.value, formData: newData });
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) => {
            const newData = { ...formData, description: e.target.value };
            setFormData(newData);
            logDebug('descriptionChange', { newValue: e.target.value, formData: newData });
          }}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
};