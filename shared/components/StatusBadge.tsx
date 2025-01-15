import { Badge } from "shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string; // Added className prop
}

const variantStyles = {
  default: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
};

export const StatusBadge = ({ status, variant = "default", className }: StatusBadgeProps) => {
  return (
    <Badge className={cn(variantStyles[variant], "font-medium", className)}>
      {status}
    </Badge>
  );
};