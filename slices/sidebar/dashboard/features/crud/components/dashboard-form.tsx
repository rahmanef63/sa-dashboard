import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "shared/components/ui/form";
import { Input } from "shared/components/ui/input";
import { Checkbox } from "shared/components/ui/checkbox";
import { DashboardFormValues } from "../../../types";
import { IconPicker } from "shared/icon-picker/components/IconPicker";
import { useToast } from "shared/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useUser } from "shared/hooks/use-user";
import { useDashboardMutation } from "../use-dashboard-mutation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  logo: z.string().default("layout-dashboard"),
  plan: z.string().default("Personal"),
  isPublic: z.boolean().default(false),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email("Invalid email address").optional(),
});

interface DashboardFormProps {
  mode: "create" | "edit" | "delete";
  dashboardId?: string;
  onSuccess: () => void;
}

export function DashboardForm({ mode, dashboardId, onSuccess }: DashboardFormProps) {
  const { toast } = useToast();
  const { userId, userEmail, userName } = useUser();
  const { mutate, isPending } = useDashboardMutation();

  const form = useForm<DashboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "layout-dashboard",
      plan: "Personal",
      isPublic: false
    },
  });

  const onSubmit = async (data: DashboardFormValues) => {
    try {
      await mutate(data);
      onSuccess();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
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