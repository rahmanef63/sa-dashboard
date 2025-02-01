// /slices/dashboard/crud/lib/api.ts
import { DashboardFormValues, DashboardWithId } from "@/slices/sidebar/dashboard/types";
// Adjust the path as needed (here we assume the new file is in ../api/)
import { DashboardService } from "../../api/dashboardService";

export async function createDashboard(data: DashboardFormValues) {
  return DashboardService.createDashboard(data);
}

export async function updateDashboard({ id, ...data }: DashboardWithId) {
  if (!id) throw new Error("Dashboard ID is required for update");
  return DashboardService.updateDashboard(id, data);
}

export async function deleteDashboard({ id }: { id?: string }) {
  if (!id) throw new Error("Dashboard ID is required for deletion");
  return DashboardService.deleteDashboard(id);
}
