import { type LucideIcon, File } from "lucide-react"
import { getIconByName } from "@/shared/icon-picker/utils"
import React from "react"

export function useIconRenderer() {
  return React.useCallback((icon: string | LucideIcon | undefined): JSX.Element => {
    if (!icon) {
      return React.createElement(File, { className: "h-4 w-4" });
    }

    if (typeof icon === 'string') {
      const IconComponent = getIconByName(icon);
      if (!IconComponent) {
        return React.createElement(File, { className: "h-4 w-4" });
      }
      return React.createElement(IconComponent, { className: "h-4 w-4" });
    }

    const IconComponent = icon;
    return React.createElement(IconComponent, { className: "h-4 w-4" });
  }, []);
}
