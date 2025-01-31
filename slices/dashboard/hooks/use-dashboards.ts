import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '../crud/lib/dashboard-service';

export function useDashboards(userId?: string) {
  return useQuery({
    queryKey: ['dashboards', userId],
    queryFn: () => DashboardService.getDashboards(userId),
  });
}
