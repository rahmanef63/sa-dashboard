import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import { Button } from "shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form";
import { Input } from "shared/components/ui/input";
import { Checkbox } from "shared/components/ui/checkbox";
import { useDashboardMutation } from "../use-dashboard-mutation";
import { DashboardFormValues } from "../../../types";
import { IconPicker } from "shared/icon-picker/components/IconPicker";
import { useToast } from "shared/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser } from "shared/hooks/use-user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "shared/components/ui/dialog";
import { DashboardDialogProps } from "../../../types";
import { useEffect } from "react";
import { dashboardService } from '@/app/api/sidebar/dashboards/service';
import type { Dashboard } from '@/slices/sidebar/dashboard/types';

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().default(""),
  logo: z.string().default("layout-dashboard"),
  plan: z.string().default("Personal"),
  isPublic: z.boolean().default(false),
});

interface DashboardFormProps {
  mode: "create" | "edit" | "delete";
  dashboardId?: string;
  onSuccess: () => void;
}

function adaptDashboardToForm(data: Dashboard): DashboardFormValues {
  return {
    name: data.name,
    description: data.description || "",
    logo: data.logo,
    plan: data.plan,
    isPublic: data.isPublic
  };
}

export function DashboardForm({ mode, dashboardId, onSuccess }: DashboardFormProps) {
  const { mutate, isPending } = useDashboardMutation();
  const { toast } = useToast();
  const { userId, userEmail, userName } = useUser();

  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "layout-dashboard",
      plan: "Personal",
      isPublic: false,
    },
  });

  useEffect(() => {
    if (mode === 'edit' && dashboardId) {
      dashboardService.getUserDashboards(userId)
        .then(dashboards => {
          const dashboard = dashboards.find(d => d.id === dashboardId);
          if (dashboard) {
            form.reset(adaptDashboardToForm(dashboard));
          } else {
            throw new Error('Dashboard not found');
          }
        })
        .catch((error: Error) => {
          toast({
            title: 'Error loading dashboard',
            description: error.message,
            variant: 'destructive'
          });
        });
    }
  }, [mode, dashboardId, userId, form, toast]);

  const onSubmit = (values: DashboardFormValues) => {
    if (mode === "delete" && dashboardId) {
      mutate({ 
        id: dashboardId,
        ...values
      }, {
        onSuccess: () => {
          toast({
            title: "Dashboard deleted successfully",
            variant: "default",
          });
          onSuccess();
        },
        onError: (error) => {
          console.error("[Delete Dashboard]", error);
          toast({
            title: "Failed to delete dashboard",
            description: error instanceof Error 
              ? error.message 
              : "An unexpected error occurred. Please check the console for more details.",
            variant: "destructive",
          });
        },
      });
      return;
    }

    const submitData = {
      ...values,
      userId: userId || '',
      userName: userName || '',
      userEmail: userEmail || '',
    };

    mutate(mode === "edit" && dashboardId ? { id: dashboardId, ...submitData } : submitData, {
      onSuccess: () => {
        toast({
          title: `Dashboard ${mode === "edit" ? "updated" : "created"} successfully`,
          variant: "default",
        });
        onSuccess();
      },
      onError: (error) => {
        console.error(`[${mode === "edit" ? "Update" : "Create"} Dashboard]`, error);
        toast({
          title: `Failed to ${mode === "edit" ? "update" : "create"} dashboard`,
          description: error instanceof Error 
            ? error.message 
            : "An unexpected error occurred. Please check the console for more details.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode !== "delete" ? (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter dashboard name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter dashboard description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value || "layout-dashboard"} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Make this dashboard public
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete this dashboard? This action cannot be undone.
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onSuccess()}
            type="button"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={mode === "delete" ? "destructive" : "default"}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "delete"
              ? "Delete"
              : mode === "edit"
              ? "Update"
              : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function DashboardDialog({ open, onOpenChange, mode = "create", dashboardId }: DashboardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Dashboard" : mode === "edit" ? "Edit Dashboard" : "Delete Dashboard"}
          </DialogTitle>
        </DialogHeader>
        <DashboardForm 
          mode={mode} 
          dashboardId={dashboardId} 
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}