import React from 'react';
import { useDashboard } from '../../../../context/dashboard-context';
import { Icon } from '@/shared/components/ui/icon';

export function MenuSwitch() {
  const { 
    currentDashboardId, 
    availableDashboards, 
    setCurrentDashboard 
  } = useDashboard();

  return (
    <div className="menu-switch">
      <div className="menu-switch-header">
        <h3 className="text-sm font-medium text-gray-500">Dashboards</h3>
      </div>
      <div className="menu-switch-content mt-2">
        {availableDashboards.map((dashboard) => (
          <button
            key={dashboard.id}
            onClick={() => setCurrentDashboard(dashboard.id)}
            className={`
              w-full flex items-center px-3 py-2 text-sm rounded-md
              ${currentDashboardId === dashboard.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {dashboard.icon && (
              <Icon
                icon={dashboard.icon}
                className="mr-3 h-5 w-5 text-gray-400"
              />
            )}
            <span>{dashboard.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
