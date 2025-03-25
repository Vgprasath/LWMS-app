
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart, Box, Calendar, ChevronLeft, ChevronRight, 
  ClipboardList, Home, Package, Settings, ShieldCheck, Truck, Warehouse 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/inventory', label: 'Inventory', icon: <Box size={20} /> },
    { path: '/space', label: 'Space', icon: <Warehouse size={20} /> },
    { path: '/shipment', label: 'Shipment', icon: <Truck size={20} /> },
    { path: '/maintenance', label: 'Maintenance', icon: <ShieldCheck size={20} /> },
    { path: '/performance', label: 'Performance', icon: <BarChart size={20} /> },
  ];

  return (
    <div 
      className={`relative flex flex-col glass-panel min-h-screen border-r shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[80px]' : 'w-[250px]'
      }`}
    >
      <div className="flex items-center p-4 h-16 border-b">
        {!collapsed && (
          <h1 className="text-xl font-semibold text-gradient">LogiMate</h1>
        )}
        {collapsed && <span className="text-xl font-bold">LM</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <div className="flex flex-col flex-1 py-4 overflow-y-auto">
        <nav className="flex-1">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      collapsed ? 'justify-center' : 'px-4'
                    } py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground/80 hover:bg-secondary'
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto px-3 py-2">
          {!collapsed && (
            <>
              <div className="px-4 py-2 mb-2">
                <p className="text-xs text-muted-foreground">Logged in as</p>
                <p className="font-medium truncate">{user?.name}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Settings size={18} />
                <span className="ml-3">Logout</span>
              </button>
            </>
          )}
          {collapsed && (
            <button
              onClick={logout}
              className="w-full flex justify-center p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
