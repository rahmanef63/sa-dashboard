import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dashboard,
  DashboardFormValues, 
  DashboardMutationVariables, 
  DashboardMutationResult 
} from "@/slices/sidebar/dashboard/types";
import { createDashboard, updateDashboard, deleteDashboard } from "../lib/api";

export function useDashboardMutation(mode: keyof DashboardMutationVariables) {
  const queryClient = useQueryClient();

  return useMutation<
    DashboardMutationResult[typeof mode],
    Error,
    DashboardMutationVariables[typeof mode]
  >({
    mutationFn: async (variables) => {
      try {
        if (mode === "create") {
          return await createDashboard(variables as DashboardFormValues);
        }
        if (mode === "edit") {
          return await updateDashboard(variables as DashboardFormValues & { id: string });
        }
        // Delete mode
        return await deleteDashboard(variables as { id: string });
      } catch (error: any) {
        // Ensure we throw an Error object with the proper message
        throw new Error(error.message || 'Operation failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}
