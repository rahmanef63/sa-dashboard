import type { Dashboard } from './base';

/**
 * Mutation related types for dashboard
 */
export interface DashboardCreateInput {
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface DashboardUpdateInput {
  id: string;
}

export interface DashboardMutationVariables {
  create: DashboardCreateInput;
  edit: DashboardUpdateInput;
  delete: { id: string };
  id: string;
}

export interface DashboardMutationResult {
  create: Dashboard;
  edit: Dashboard;
  delete: void;
}
