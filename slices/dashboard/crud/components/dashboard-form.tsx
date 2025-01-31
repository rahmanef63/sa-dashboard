import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form";
import { Input } from "shared/components/ui/input";
import { Checkbox } from "shared/components/ui/checkbox";
import { useDashboardMutation } from "../hooks/use-dashboard-mutation";
import { DashboardFormValues } from "../../types/dashboard.types";
import { IconPicker } from "shared/icon-picker/components/IconPicker";
import { useToast } from "shared/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser } from "shared/hooks/use-user";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().default("layout-dashboard"),
  plan: z.string().default("Personal"),
  isPublic: z.boolean().default(false),
  userId: z.string().optional(),
});

interface DashboardFormProps {
  mode: "create" | "edit" | "delete";
  dashboardId?: string;
  onSuccess: () => void;
}

export function DashboardForm({ mode, dashboardId, onSuccess }: DashboardFormProps) {
  const { mutate, isPending } = useDashboardMutation(mode);
  const { toast } = useToast();
  const { userId } = useUser();

  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "layout-dashboard",
      plan: "Personal",
      isPublic: false,
      userId: userId,
    },
  });

  const onSubmit = (values: DashboardFormValues) => {
    if (mode === "delete" && dashboardId) {
      mutate({ id: dashboardId } as const, {
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
      userId,
      logo: values.logo || "layout-dashboard",
    };

    if (mode === "edit" && dashboardId) {
      mutate({ ...submitData, id: dashboardId }, {
        onSuccess: () => {
          toast({
            title: "Dashboard updated successfully",
            variant: "default",
          });
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("[Update Dashboard]", error);
          toast({
            title: "Failed to update dashboard",
            description: error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please check the console for more details.",
            variant: "destructive",
          });
        },
      });
      return;
    }

    mutate(submitData, {
      onSuccess: () => {
        toast({
          title: "Dashboard created successfully",
          variant: "default",
        });
        onSuccess();
        form.reset();
      },
      onError: (error: unknown) => {
        console.error("[Create Dashboard]", error);
        toast({
          title: "Failed to create dashboard",
          description: error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please check the console for more details.",
          variant: "destructive",
        });
      },
    });
  };

  if (mode === "delete") {
    return (
      <div className="space-y-4">
        <p>Are you sure you want to delete this dashboard?</p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => onSuccess()}>Cancel</Button>
          <Button 
            variant="destructive" 
            onClick={() => onSubmit({} as DashboardFormValues)} 
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Dashboard" {...field} />
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
                <Input placeholder="Optional description" {...field} />
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Public Dashboard
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Dashboard" : mode === "edit" ? "Update Dashboard" : "Delete Dashboard"}
        </Button>
      </form>
    </Form>
  );
}
