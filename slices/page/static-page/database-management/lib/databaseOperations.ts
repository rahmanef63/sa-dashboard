import { Database, DatabaseTable } from "shared/types/global";

export const generateDatabaseId = () => `db-${Date.now()}`;
export const generateTableId = () => `tbl-${Date.now()}`;

export const createNewDatabase = (name: string, description: string): Database => ({
  id: generateDatabaseId(),
  name,
  description,
  tables: [],
  features: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const updateDatabase = (
  databases: Database[],
  databaseId: string,
  updates: Partial<Database>
): Database[] => {
  return databases.map((db) =>
    db.id === databaseId
      ? {
          ...db,
          ...updates,
          updatedAt: new Date(),
        }
      : db
  );
};

export const deleteDatabase = (
  databases: Database[],
  databaseId: string
): Database[] => {
  return databases.filter((db) => db.id !== databaseId);
};

export const addTableToDatabase = (
  databases: Database[],
  databaseId: string,
  table: DatabaseTable
): Database[] => {
  return updateDatabase(databases, databaseId, {
    tables: [
      ...databases.find((db) => db.id === databaseId)?.tables || [],
      { ...table, id: generateTableId() },
    ],
  });
};

export const updateTableInDatabase = (
  databases: Database[],
  databaseId: string,
  updatedTable: DatabaseTable
): Database[] => {
  return updateDatabase(databases, databaseId, {
    tables:
      databases
        .find((db) => db.id === databaseId)
        ?.tables.map((table) =>
          table.id === updatedTable.id ? updatedTable : table
        ) || [],
  });
};

export const deleteTableFromDatabase = (
  databases: Database[],
  databaseId: string,
  tableId: string
): Database[] => {
  return updateDatabase(databases, databaseId, {
    tables:
      databases
        .find((db) => db.id === databaseId)
        ?.tables.filter((table) => table.id !== tableId) || [],
  });
};