import React from 'react';
import { DatabaseTable } from "../types";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T]) => React.ReactNode;
};

export const databaseTableColumns: Column<DatabaseTable>[] = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "name",
    header: "Table Name",
  },
  {
    key: "feature",
    header: "Feature",
    render: (feature: DatabaseTable["feature"]) => {
      if (!feature) return "N/A";
      return (
        <span className="text-sm text-muted-foreground">
          {feature.name || "N/A"} ({feature.entityType || "N/A"})
        </span>
      );
    },
  },
];