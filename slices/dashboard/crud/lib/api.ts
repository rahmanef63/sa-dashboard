import { DashboardFormValues, DashboardWithId } from "slices/dashboard/types";
import { createDashboard as createDashboardService, 
         updateDashboard as updateDashboardService, 
         deleteDashboard as deleteDashboardService } from "./dashboard-service";

export async function createDashboard(data: DashboardFormValues) {
  return createDashboardService(data);
}

export async function updateDashboard({ id, ...data }: DashboardWithId) {
  if (!id) throw new Error("Dashboard ID is required for update");
  return updateDashboardService(id, data);
}

export async function deleteDashboard({ id }: { id?: string }) {
  if (!id) throw new Error("Dashboard ID is required for deletion");
  return deleteDashboardService(id);
}
