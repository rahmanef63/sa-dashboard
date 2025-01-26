
export async function fetchTables(databaseName: string): Promise<string[]> {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  const response = await fetch(`/api/database/${databaseName}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }

  const data = await response.json();
  return data.map((row: any) => row.table_name);
}

export async function fetchTableColumns(databaseName: string, tableName: string): Promise<string[]> {
  const query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = '${tableName}'
    ORDER BY ordinal_position;
  `;

  const response = await fetch(`/api/database/${databaseName}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch columns');
  }

  const data = await response.json();
  return data.map((row: any) => row.column_name);
}
