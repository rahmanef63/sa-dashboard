import { Dashboard } from "@/slices/dashboard/types/index";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  dashboards?: Dashboard[];
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  id: string;
  name: string;
  description?: string;
  tables: DatabaseTable[];
  features: DatabaseFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  feature?: {
    name: string;
    entityType: 'design' | 'project' | 'financial' | 'hr';
  };
}

export interface DatabaseColumn {
  name: string;
  type: string;
  required: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface DatabaseFeature {
  name: string;
  enabled: boolean;
  syncInterval?: number;
}

export interface DatabaseMapping {
  featureId: string;
  databaseId: string;
  tableId: string;
  mappedFields: {
    sourceField: string;
    targetField: string;
  }[];
}