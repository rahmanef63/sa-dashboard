import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, className }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn("animate-spin", className)} size={size} />
    </div>
  );
};