export type PostgresDataType =
  | 'bigint'
  | 'boolean'
  | 'character'
  | 'character varying'
  | 'date'
  | 'double precision'
  | 'integer'
  | 'json'
  | 'jsonb'
  | 'numeric'
  | 'real'
  | 'smallint'
  | 'text'
  | 'time'
  | 'timestamp'
  | 'timestamp with time zone'
  | 'uuid';

export type ConstraintType = 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'NOT NULL';

export interface TableColumn {
  name: string;
  type: PostgresDataType;
  length?: number;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey?: boolean;
  isUnique?: boolean;
  description?: string;
}

export interface TableConstraint {
  name: string;
  type: ConstraintType;
  columns: string[];
  definition?: string;
  referencedTable?: string;
  referencedColumns?: string[];
}

export interface DatabaseTable {
  table_name: string;
  table_schema: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
  description?: string;
  total_size?: string;
}

export interface TableFormData {
  name: string;
  schema?: string;
  description?: string;
  columns: TableColumn[];
  constraints: TableConstraint[];
}

export interface TableUpdateData extends TableFormData {
  alterations: TableAlteration[];
}

export type AlterationType = 
  | 'ADD_COLUMN'
  | 'DROP_COLUMN'
  | 'ALTER_COLUMN'
  | 'ADD_CONSTRAINT'
  | 'DROP_CONSTRAINT'
  | 'RENAME_TABLE'
  | 'RENAME_COLUMN';

export interface TableAlteration {
  type: AlterationType;
  name: string;
  newName?: string;
  column?: TableColumn;
  constraint?: TableConstraint;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Validation functions
export const isValidTableName = (name: string): boolean => {
  // PostgreSQL identifiers rules:
  // - Must start with a letter or underscore
  // - Can contain letters, numbers, and underscores
  // - Maximum length is 63 bytes
  const nameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return nameRegex.test(name) && name.length <= 63;
};

export const isValidColumnName = (name: string): boolean => {
  // Same rules as table names
  return isValidTableName(name);
};

export const validateTableForm = (data: TableFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate table name
  if (!data.name) {
    errors.push({ field: 'name', message: 'Table name is required' });
  } else if (!isValidTableName(data.name)) {
    errors.push({ field: 'name', message: 'Invalid table name format' });
  }

  // Validate columns
  if (!data.columns.length) {
    errors.push({ field: 'columns', message: 'At least one column is required' });
  }

  data.columns.forEach((column, index) => {
    if (!column.name) {
      errors.push({ field: `columns[${index}].name`, message: 'Column name is required' });
    } else if (!isValidColumnName(column.name)) {
      errors.push({ field: `columns[${index}].name`, message: 'Invalid column name format' });
    }

    if (!column.type) {
      errors.push({ field: `columns[${index}].type`, message: 'Column type is required' });
    }
  });

  // Validate constraints
  data.constraints?.forEach((constraint, index) => {
    if (!constraint.name) {
      errors.push({ field: `constraints[${index}].name`, message: 'Constraint name is required' });
    }

    if (!constraint.type) {
      errors.push({ field: `constraints[${index}].type`, message: 'Constraint type is required' });
    }

    if (!constraint.columns?.length) {
      errors.push({ field: `constraints[${index}].columns`, message: 'At least one column must be specified for constraint' });
    }

    // Validate foreign key constraints
    if (constraint.type === 'FOREIGN KEY') {
      if (!constraint.referencedTable) {
        errors.push({ field: `constraints[${index}].referencedTable`, message: 'Referenced table is required for foreign key' });
      }
      if (!constraint.referencedColumns?.length) {
        errors.push({ field: `constraints[${index}].referencedColumns`, message: 'Referenced columns are required for foreign key' });
      }
    }
  });

  return errors;
};
