/**
 * Constants for dashboard feature
 */
export const DASHBOARD_SWITCHER_LABELS = {
  NEW_DASHBOARD: 'Create Dashboard',
  NO_DASHBOARDS: 'No dashboards found',
  LOADING: 'Loading dashboards...',
} as const;

export const DASHBOARD_SWITCHER_SHORTCUTS = {
  OPEN: 'mod+k',
  CLOSE: 'esc',
  NAVIGATE: 'up,down',
  SELECT: 'enter',
} as const;

export const DASHBOARD_DIALOG_LABELS = {
  CREATE: {
    TITLE: 'Create Dashboard',
    DESCRIPTION: 'Create a new dashboard',
  },
  EDIT: {
    TITLE: 'Edit Dashboard',
    DESCRIPTION: 'Edit dashboard details',
  },
  DELETE: {
    TITLE: 'Delete Dashboard',
    DESCRIPTION: 'Are you sure you want to delete this dashboard?',
  },
} as const;
