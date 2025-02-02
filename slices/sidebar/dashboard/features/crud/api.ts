// /slices/dashboard/crud/lib/api.ts
import { DashboardFormValues, Dashboard } from "@/slices/sidebar/dashboard/types";
import { dashboardService } from "@/app/api/sidebar/dashboards/service";

export async function createDashboard(data: DashboardFormValues) {
  return dashboardService.createDashboard(data);
}

export async function updateDashboard({ dashboardId, ...data }: Dashboard) {
  if (!dashboardId) throw new Error("Dashboard ID is required for update");
  return dashboardService.updateDashboard(dashboardId, data);
}

export async function deleteDashboard({ dashboardId }: { dashboardId?: string }) {
  if (!dashboardId) throw new Error("Dashboard ID is required for deletion");
  return dashboardService.deleteDashboard(dashboardId);
}
