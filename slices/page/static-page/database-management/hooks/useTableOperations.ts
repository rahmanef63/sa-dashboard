import { useState, useCallback, useEffect } from 'react';
import { DatabaseTable, TableFormData, TableUpdateData, ValidationError } from '@/shared/types/table';

// Debug logging function
const logDebug = (operation: string, details: any) => {
  if ((window as any).debugConsole?.log) {
    (window as any).debugConsole.log(`[Table Operations] ${operation}`, details);
  }
};

// Helper function to safely parse JSON response
const safeParseJSON = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON response:', text);
    throw new Error('Invalid server response');
  }
};

// Helper function to validate table form data
const validateTableForm = (formData: TableFormData): ValidationError[] => {
  const validationErrors: ValidationError[] = [];

  // Add your validation logic here
  if (!formData.name) {
    validationErrors.push({ field: 'name', message: 'Name is required' });
  }

  return validationErrors;
};

export const useTableOperations = (databaseName: string) => {
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    if (!databaseName) {
      setTables([]);
      setIsLoading(false);
      return;
    }

    try {
      logDebug('Fetching tables', { database: databaseName });
      setIsLoading(true);
      const response = await fetch(`/api/database/${databaseName}/tables`);
      
      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to fetch tables');
      }

      const data = await safeParseJSON(response);
      logDebug('Tables fetched', { tables: data });
      setTables(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error fetching tables', { error: errorMessage });
      setError(errorMessage);
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  }, [databaseName]);

  // Initial fetch
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const createTable = useCallback(async (formData: TableFormData) => {
    if (!databaseName) {
      throw new Error('No database selected');
    }

    try {
      logDebug('Creating table', { database: databaseName, data: formData });
      
      // Validate form data
      const validationErrors = validateTableForm(formData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.map(e => `${e.field}: ${e.message}`).join(', ')}`);
      }

      const response = await fetch(`/api/database/${databaseName}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to create table');
      }

      const data = await safeParseJSON(response);
      logDebug('Table created', { response: data });
      await fetchTables(); // Refresh tables list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create table';
      logDebug('Error creating table', { error: errorMessage });
      throw err;
    }
  }, [databaseName, fetchTables]);

  const updateTable = useCallback(async (tableName: string, formData: TableFormData) => {
    if (!databaseName) {
      throw new Error('No database selected');
    }

    try {
      logDebug('Updating table', { database: databaseName, table: tableName, data: formData });
      const response = await fetch(`/api/database/${databaseName}/tables/${tableName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to update table');
      }

      const data = await safeParseJSON(response);
      logDebug('Table updated', { response: data });
      await fetchTables(); // Refresh tables list
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update table';
      logDebug('Error updating table', { error: errorMessage });
      throw err;
    }
  }, [databaseName, fetchTables]);

  const deleteTable = useCallback(async (tableName: string) => {
    try {
      logDebug('Deleting table', { database: databaseName, table: tableName });
      const response = await fetch(`/api/database/${databaseName}/tables/${tableName}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to delete table');
      }

      await fetchTables();
    } catch (error) {
      logDebug('Error deleting table', error);
      throw error;
    }
  }, [databaseName, fetchTables]);

  return {
    tables,
    isLoading,
    error,
    createTable,
    updateTable,
    deleteTable,
    refetchTables: fetchTables,
  };
};
