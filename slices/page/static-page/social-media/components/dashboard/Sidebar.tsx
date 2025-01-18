import { Home, BarChart2, Calendar, Settings, Menu, PenSquare } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onTabChange: (tab: "dashboard" | "calendar" | "analytics" | "settings" | "posts") => void;
  activeTab: string;
}

export const Sidebar = ({ onTabChange, activeTab }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: PenSquare, label: "Posts", id: "posts" },
    { icon: Calendar, label: "Calendar", id: "calendar" },
    { icon: BarChart2, label: "Analytics", id: "analytics" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } min-h-screen transition-all duration-300 ease-in-out`}
    >
      <div className="flex justify-between items-center mb-8">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">Social Manager</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2  rounded-lg"
        >
          <Menu />
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as "dashboard" | "calendar" | "analytics" | "settings" | "posts")}
            className={`flex items-center space-x-2  p-2  rounded-lg transition-colors w-full ${
              activeTab === item.id ? "" : ""
            }`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};