import { useState, useCallback, useEffect } from 'react';
import { Database, DatabaseFormData } from '@/shared/types/database';

// Debug logging function
const logDebug = (operation: string, details: any) => {
  console.log(`[Database Operations] ${operation}:`, details);
};

export const useDatabaseOperations = () => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabases = useCallback(async () => {
    try {
      logDebug('fetchDatabases', 'Started');
      setIsLoading(true);
      const response = await fetch('/api/database');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch databases');
      }

      const data = await response.json();
      logDebug('fetchDatabases', { response: data });
      setDatabases(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      logDebug('fetchDatabases - Error', errorMessage);
      setError(errorMessage);
      setDatabases([]); // Ensure databases is always an array
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDatabase = useCallback(async (formData: DatabaseFormData) => {
    try {
      logDebug('createDatabase', { data: formData });
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create database');
      }

      const result = await response.json();
      logDebug('createDatabase - Success', result);
      await fetchDatabases(); // Refresh the list after creating
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create database';
      logDebug('createDatabase - Error', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [fetchDatabases]);

  const updateDatabase = useCallback(async (name: string, formData: DatabaseFormData) => {
    try {
      logDebug('updateDatabase', { name, data: formData });
      const response = await fetch(`/api/database/${name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update database');
      }

      const result = await response.json();
      logDebug('updateDatabase - Success', result);
      await fetchDatabases(); // Refresh the list after updating
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update database';
      logDebug('updateDatabase - Error', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [fetchDatabases]);

  const deleteDatabase = useCallback(async (name: string) => {
    try {
      logDebug('deleteDatabase', { name });
      const response = await fetch(`/api/database/${name}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete database');
      }

      const result = await response.json();
      logDebug('deleteDatabase - Success', result);
      await fetchDatabases(); // Refresh the list after deleting
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete database';
      logDebug('deleteDatabase - Error', errorMessage);
      setError(errorMessage);
      throw err;
    }
  }, [fetchDatabases]);

  // Initial fetch
  useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  return {
    databases,
    isLoading,
    error,
    createDatabase,
    updateDatabase,
    deleteDatabase,
    refetchDatabases: fetchDatabases,
  };
};