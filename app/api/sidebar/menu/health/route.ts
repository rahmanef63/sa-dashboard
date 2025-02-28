// app/api/sidebar/menu/health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandler } from '../../middleware';
import { menuServiceHealth } from '../monitoring';

const CACHE_CONTROL = 'no-cache, no-store, must-revalidate';

/**
 * GET handler for menu service health status
 * Returns current health metrics for menu service
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      try {
        // Get current metrics
        const healthMetrics = menuServiceHealth.getHealthMetrics();
        
        // Add dashboard ID to monitoring if provided
        const { searchParams } = new URL(request.url);
        const dashboardId = searchParams.get('dashboardId');
        
        if (dashboardId) {
          menuServiceHealth.addDashboardToMonitoring(dashboardId);
          console.log(`[Menu Health API] Added dashboard ${dashboardId} to monitoring`);
        }
        
        return new NextResponse(
          JSON.stringify({
            data: healthMetrics,
            success: true,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        console.error('[Menu Health API] Error retrieving health metrics:', errorMessage);
        
        return new NextResponse(
          JSON.stringify({
            error: errorMessage,
            success: false,
            timestamp: new Date().toISOString()
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      }
    });
  });
}
