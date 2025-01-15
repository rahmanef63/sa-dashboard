import { useState } from 'react';

interface Database {
  name: string;
  size: string;
  owner: string;
}

export function useDatabase() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setDatabases(data.databases);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDatabase = async (name: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      await fetchDatabases(); // Refresh the list
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDatabase = async (name: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/database', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      await fetchDatabases(); // Refresh the list
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    databases,
    loading,
    error,
    fetchDatabases,
    createDatabase,
    deleteDatabase
  };
}