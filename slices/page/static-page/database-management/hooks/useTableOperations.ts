import { useState, useCallback, useEffect, useRef } from 'react';
import { DatabaseTable, TableFormData, ValidationError } from '@/shared/types/table';
import { logDebug } from '../utils/debug';
import { safeParseJSON } from '../utils/json';

interface BasicTableInfo {
  table_name: string;
  table_schema: string;
  description?: string;
  total_size?: string;
}

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
  const [tables, setTables] = useState<BasicTableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const CACHE_DURATION = 5000; // 5 seconds cache

  const fetchTables = useCallback(async (force = false) => {
    if (!databaseName) {
      setTables([]);
      setIsLoading(false);
      return;
    }

    // Check if we should use cached data
    const now = Date.now();
    if (!force && now - lastFetchRef.current < CACHE_DURATION) {
      logDebug('Using cached table data', { database: databaseName });
      return;
    }

    try {
      logDebug('Fetching tables', { database: databaseName });
      setIsLoading(true);
      const response = await fetch(`/api/database/${databaseName}/tables/basic`);
      
      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to fetch tables');
      }

      const data = await safeParseJSON(response);
      logDebug('Tables fetched', { tables: data });
      setTables(Array.isArray(data) ? data : []);
      setError(null);
      lastFetchRef.current = now;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error fetching tables', errorMessage);
      setError(errorMessage);
      setTables([]);
    } finally {
      setIsLoading(false);
    }
  }, [databaseName]);

  const fetchTableDetails = useCallback(async (tableName: string): Promise<DatabaseTable | null> => {
    try {
      logDebug('Fetching table details', { database: databaseName, table: tableName });
      const response = await fetch(`/api/database/${databaseName}/tables/${tableName}`);
      
      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to fetch table details');
      }

      const data = await safeParseJSON(response);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error fetching table details', errorMessage);
      return null;
    }
  }, [databaseName]);

  const createTable = useCallback(async (formData: TableFormData) => {
    try {
      logDebug('Creating table', { database: databaseName, formData });
      const response = await fetch(`/api/database/${databaseName}/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to create table');
      }

      await fetchTables(true); // Force refresh after create
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error creating table', errorMessage);
      throw new Error(errorMessage);
    }
  }, [databaseName, fetchTables]);

  const deleteTable = useCallback(async (tableName: string) => {
    try {
      logDebug('Deleting table', { database: databaseName, table: tableName });
      const response = await fetch(
        `/api/database/${databaseName}/tables/${tableName}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to delete table');
      }

      await fetchTables(true); // Force refresh after delete
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error deleting table', errorMessage);
      throw new Error(errorMessage);
    }
  }, [databaseName, fetchTables]);

  const updateTable = useCallback(async (tableName: string, formData: TableFormData) => {
    try {
      logDebug('Updating table', { database: databaseName, table: tableName, formData });
      const response = await fetch(
        `/api/database/${databaseName}/tables/${tableName}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await safeParseJSON(response);
        throw new Error(errorData.error || 'Failed to update table');
      }

      await fetchTables(true); // Force refresh after update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('Error updating table', errorMessage);
      throw new Error(errorMessage);
    }
  }, [databaseName, fetchTables]);

  // Initial fetch
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return {
    tables,
    isLoading,
    error,
    fetchTables,
    fetchTableDetails,
    createTable,
    deleteTable,
    updateTable,
  };
};
