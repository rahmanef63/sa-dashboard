import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from 'shared/types/navigation-types';
import { checkSubmenuAvailability } from '../../utils';

interface UseSubmenuAvailabilityProps {
  item: MenuItem
  defaultAvailable?: boolean
}

export function useSubmenuAvailability({ 
  item, 
  defaultAvailable = true 
}: UseSubmenuAvailabilityProps) {
  const [isAvailable, setIsAvailable] = useState(defaultAvailable);

  useEffect(() => {
    setIsAvailable(checkSubmenuAvailability(item));
  }, [item]);

  const checkAvailability = useCallback(() => {
    const available = checkSubmenuAvailability(item);
    setIsAvailable(available);
    return available;
  }, [item]);

  return { 
    isAvailable,
    checkAvailability
  };
}
