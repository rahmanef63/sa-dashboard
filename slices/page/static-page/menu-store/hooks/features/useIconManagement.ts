import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from "shared/components/ui/use-toast";

export const useIconManagement = () => {
  const { toast } = useToast();
  const [iconErrors, setIconErrors] = useState<{ [key: string]: string }>({});
  const errorTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const [itemsWithMissingIcons, setItemsWithMissingIcons] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      Object.values(errorTimeoutRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleIconError = useCallback((itemId: string, message: string) => {
    if (errorTimeoutRef.current[itemId]) {
      clearTimeout(errorTimeoutRef.current[itemId]);
    }

    setIconErrors(prev => ({ ...prev, [itemId]: message }));
    
    errorTimeoutRef.current[itemId] = setTimeout(() => {
      toast({
        title: "Icon Rendering Issue",
        description: message,
        variant: "destructive",
      });
    }, 500);

    setItemsWithMissingIcons(prev => new Set(prev).add(itemId));
  }, [toast]);

  const clearIconError = useCallback((itemId: string) => {
    if (errorTimeoutRef.current[itemId]) {
      clearTimeout(errorTimeoutRef.current[itemId]);
      delete errorTimeoutRef.current[itemId];
    }
    
    setIconErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });

    setItemsWithMissingIcons(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  return {
    iconErrors,
    itemsWithMissingIcons,
    handleIconError,
    clearIconError
  };
};
