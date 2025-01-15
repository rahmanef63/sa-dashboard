import { DatabaseTable, DatabaseColumn } from "shared/types/global";

export const validateTableName = (name: string): boolean => {
  return name.trim().length > 0;
};

export const validateColumn = (column: DatabaseColumn): boolean => {
  return (
    column.name.trim().length > 0 &&
    column.type.trim().length > 0 &&
    (!column.references ||
      (column.references.table.trim().length > 0 &&
        column.references.column.trim().length > 0))
  );
};

export const validateTable = (table: DatabaseTable): boolean => {
  return (
    validateTableName(table.name) &&
    table.columns.length > 0 &&
    table.columns.every(validateColumn)
  );
};