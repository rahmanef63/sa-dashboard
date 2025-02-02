import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dashboard, DashboardFormValues } from "../../types";
import { createDashboard, deleteDashboard, updateDashboard } from "./api";

export function useDashboardMutation() {
  const queryClient = useQueryClient();

  return useMutation<Dashboard, Error, DashboardFormValues & { id?: string }>({
    mutationFn: async (data) => {
      const formattedData = {
        ...data,
        logo: data.logo || "layout-dashboard", // Ensure logo is always defined
        dashboardId: data.id || crypto.randomUUID(), // Generate dashboardId if not editing
        id: data.id || crypto.randomUUID(), // Ensure id is always defined
      };
      
      if (data.id) {
        return updateDashboard(formattedData);
      }
      return createDashboard(formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}
