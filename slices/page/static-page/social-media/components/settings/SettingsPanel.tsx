import React from "react";
import { Card } from "shared/components/ui/card";
import { Switch } from "shared/components/ui/switch";
import { Bell, Shield, Globe, Palette } from "lucide-react";

export const SettingsPanel = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      <div className="space-y-6">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="text-primary h-5 w-5" />
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive alerts for important updates
                </p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="text-primary h-5 w-5" />
              <div>
                <h3 className="font-medium">Privacy</h3>
                <p className="text-sm text-gray-500">
                  Manage your data and permissions
                </p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Globe className="text-primary h-5 w-5" />
              <div>
                <h3 className="font-medium">Time Zone</h3>
                <p className="text-sm text-gray-500">
                  Set your preferred time zone
                </p>
              </div>
            </div>
            <select className="border rounded-md px-2 py-1">
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Palette className="text-primary h-5 w-5" />
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-gray-500">
                  Choose your preferred theme
                </p>
              </div>
            </div>
            <select className="border rounded-md px-2 py-1">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};