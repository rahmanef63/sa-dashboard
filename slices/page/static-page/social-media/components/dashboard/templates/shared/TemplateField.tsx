import React from "react";
import { Input } from "shared/components/ui/input";
import { Textarea } from "shared/components/ui/textarea";
import { cn } from "shared/lib/utils";

interface TemplateFieldProps {
  type: "input" | "textarea";
  placeholder: string;
  className?: string;
  onChange?: (value: string) => void;
}

export const TemplateField: React.FC<TemplateFieldProps> = ({
  type,
  placeholder,
  className = "",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return type === "input" ? (
    <Input 
      placeholder={placeholder} 
      className={cn("w-full bg-accent/50 hover:bg-accent/70 transition-colors", className)}
      onChange={handleChange}
    />
  ) : (
    <Textarea 
      placeholder={placeholder} 
      className={cn("w-full min-h-[100px] resize-none bg-accent/50 hover:bg-accent/70 transition-colors", className)}
      onChange={handleChange}
    />
  );
};