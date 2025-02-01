import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/components/ui/dialog";
import { DashboardDialogProps } from "@/slices/sidebar/dashboard/types";
import { DashboardForm } from "./dashboard-form";

export function DashboardDialog({ open, onOpenChange, mode = "create", dashboardId }: DashboardDialogProps) {
  const titles = {
    create: "Create Dashboard",
    edit: "Edit Dashboard",
    delete: "Delete Dashboard",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
        </DialogHeader>
        <DashboardForm mode={mode} dashboardId={dashboardId} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
