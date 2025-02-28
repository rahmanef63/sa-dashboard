// Menu Service Health Monitoring Utility
// @/app/api/sidebar/menu/monitoring.ts

import { menuService } from './service';

// Configuration for service health monitoring
const MONITORING_CONFIG = {
  ENABLED: process.env.NODE_ENV === 'production', // Only enable in production by default
  CHECK_INTERVAL: 5 * 60 * 1000, // 5 minutes in ms
  DASHBOARD_IDS: [] as string[], // Will be populated dynamically - explicitly typed as string[]
  MAX_FAILURES: 3, // Maximum consecutive failures before alert
  DEBUG_MODE: process.env.DEBUG_MENU_SERVICE === 'true'
};

// Health metrics storage
class MenuServiceHealth {
  private static instance: MenuServiceHealth;
  private checkInterval: NodeJS.Timeout | null = null;
  private failureCounters: Map<string, number> = new Map();
  private lastCheckTimes: Map<string, number> = new Map();
  private lastSuccessTimes: Map<string, number> = new Map();
  private isMonitoring: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of MenuServiceHealth
   */
  public static getInstance(): MenuServiceHealth {
    if (!MenuServiceHealth.instance) {
      MenuServiceHealth.instance = new MenuServiceHealth();
    }
    return MenuServiceHealth.instance;
  }

  /**
   * Start health monitoring for the menu service
   * @param dashboardIds - Optional array of dashboard IDs to monitor
   */
  public startMonitoring(dashboardIds?: string[]): void {
    if (this.isMonitoring) {
      console.log('[Menu Monitoring] Health monitoring already running');
      return;
    }

    if (dashboardIds && dashboardIds.length > 0) {
      MONITORING_CONFIG.DASHBOARD_IDS = [...dashboardIds];
    }

    if (!MONITORING_CONFIG.ENABLED) {
      console.log('[Menu Monitoring] Health monitoring is disabled');
      return;
    }

    this.isMonitoring = true;
    console.log('[Menu Monitoring] Starting menu service health monitoring');

    // Start periodic checks
    this.checkInterval = setInterval(() => {
      this.checkMenuServiceHealth();
    }, MONITORING_CONFIG.CHECK_INTERVAL);

    // Run an initial check
    this.checkMenuServiceHealth();
  }

  /**
   * Stop health monitoring for the menu service
   */
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.isMonitoring = false;
    console.log('[Menu Monitoring] Stopped menu service health monitoring');
  }

  /**
   * Check health of menu service for all monitored dashboards
   */
  private async checkMenuServiceHealth(): Promise<void> {
    if (MONITORING_CONFIG.DEBUG_MODE) {
      console.log('[Menu Monitoring] Running health check for menu service');
    }

    for (const dashboardId of MONITORING_CONFIG.DASHBOARD_IDS) {
      this.checkDashboardMenuHealth(dashboardId);
    }
  }

  /**
   * Check health of menu service for a specific dashboard
   * @param dashboardId - Dashboard ID to check
   */
  private async checkDashboardMenuHealth(dashboardId: string): Promise<void> {
    try {
      this.lastCheckTimes.set(dashboardId, Date.now());
      
      // Fetch menu items through service
      const items = await menuService.getMenuItems(dashboardId);
      
      // Check if results are valid
      if (items && Array.isArray(items)) {
        // Success - reset failure counter
        this.lastSuccessTimes.set(dashboardId, Date.now());
        this.failureCounters.set(dashboardId, 0);
        
        if (MONITORING_CONFIG.DEBUG_MODE) {
          console.log(`[Menu Monitoring] Health check passed for dashboard ${dashboardId}: ${items.length} items found`);
        }
      } else {
        // Failed - increment counter
        this.handleFailure(dashboardId, 'Invalid response structure');
      }
    } catch (error) {
      // Exception - increment counter
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.handleFailure(dashboardId, errorMessage);
    }
  }

  /**
   * Handle a health check failure
   * @param dashboardId - Dashboard ID that failed
   * @param reason - Reason for failure
   */
  private handleFailure(dashboardId: string, reason: string): void {
    const currentFailures = (this.failureCounters.get(dashboardId) || 0) + 1;
    this.failureCounters.set(dashboardId, currentFailures);
    
    console.warn(`[Menu Monitoring] Health check failed for dashboard ${dashboardId}: ${reason} (Failure #${currentFailures})`);
    
    // If we exceed the threshold, trigger an alert
    if (currentFailures >= MONITORING_CONFIG.MAX_FAILURES) {
      this.triggerHealthAlert(dashboardId, currentFailures, reason);
      
      // Force refresh cache to try to recover
      console.log(`[Menu Monitoring] Attempting recovery by forcing cache refresh for dashboard ${dashboardId}`);
      menuService.clearMenuCache(dashboardId);
    }
  }

  /**
   * Trigger a health alert when multiple failures occur
   * @param dashboardId - Dashboard ID with health issues
   * @param failureCount - Number of consecutive failures
   * @param reason - Reason for failure
   */
  private triggerHealthAlert(dashboardId: string, failureCount: number, reason: string): void {
    const lastSuccess = this.lastSuccessTimes.get(dashboardId);
    const timeSinceSuccess = lastSuccess ? Math.floor((Date.now() - lastSuccess) / 1000 / 60) : 'unknown';
    
    console.error(`[Menu Monitoring] ALERT: Menu service is unhealthy for dashboard ${dashboardId}!`);
    console.error(`[Menu Monitoring] Details: ${failureCount} consecutive failures. Last success: ${timeSinceSuccess} minutes ago. Reason: ${reason}`);
    
    // Here you would implement a notification system (e.g., logging service, email, Slack notification)
    // For now, we just log to console, but in a real-world scenario, you might want to:
    //
    // 1. Send an alert to an error monitoring service like Sentry
    // 2. Trigger a notification to DevOps team
    // 3. Mark the service as degraded in a health dashboard
  }

  /**
   * Add a dashboard ID to monitoring
   * @param dashboardId - Dashboard ID to monitor
   */
  public addDashboardToMonitoring(dashboardId: string): void {
    if (!MONITORING_CONFIG.DASHBOARD_IDS.includes(dashboardId)) {
      MONITORING_CONFIG.DASHBOARD_IDS.push(dashboardId);
      console.log(`[Menu Monitoring] Added dashboard ${dashboardId} to health monitoring`);
    }
  }

  /**
   * Get health metrics for all monitored dashboards
   */
  public getHealthMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {
      isMonitoring: this.isMonitoring,
      dashboardsMonitored: MONITORING_CONFIG.DASHBOARD_IDS.length,
      dashboardMetrics: {}
    };
    
    for (const dashboardId of MONITORING_CONFIG.DASHBOARD_IDS) {
      metrics.dashboardMetrics[dashboardId] = {
        failures: this.failureCounters.get(dashboardId) || 0,
        lastCheck: this.lastCheckTimes.get(dashboardId) || null,
        lastSuccess: this.lastSuccessTimes.get(dashboardId) || null,
        status: this.getDashboardHealthStatus(dashboardId)
      };
    }
    
    return metrics;
  }

  /**
   * Get health status for a specific dashboard
   * @param dashboardId - Dashboard ID to check
   */
  private getDashboardHealthStatus(dashboardId: string): string {
    const failures = this.failureCounters.get(dashboardId) || 0;
    
    if (failures === 0) return 'healthy';
    if (failures < MONITORING_CONFIG.MAX_FAILURES) return 'degraded';
    return 'unhealthy';
  }
}

// Export singleton instance
export const menuServiceHealth = MenuServiceHealth.getInstance();

// Optional auto-start feature (can be enabled/disabled via environment variable)
if (process.env.AUTO_START_MENU_MONITORING === 'true') {
  menuServiceHealth.startMonitoring();
  console.log('[Menu Monitoring] Auto-started menu service health monitoring');
}
