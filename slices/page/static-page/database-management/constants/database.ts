export const DATABASE_ACTIONS = {
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

export const DIALOG_TITLES = {
  CREATE: 'Create New Database',
  EDIT: 'Edit Database',
  DELETE: 'Delete Database',
} as const;

export const DIALOG_DESCRIPTIONS = {
  CREATE: 'Enter the details for your new database.',
  EDIT: 'Update the database details.',
  DELETE: 'Are you sure you want to delete this database? This action cannot be undone.',
} as const;