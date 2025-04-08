
import React, { useState } from 'react';
import { Bell, ChevronDown, Mail, Search, Settings, User, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const Header: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Smartphone X500 is running low on stock',
      timestamp: '10 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Maintenance Due',
      message: 'Forklift 1 is due for maintenance',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: '3',
      title: 'Shipment Arrived',
      message: 'Shipment #1234 has arrived at warehouse',
      timestamp: '3 hours ago',
      read: true
    },
    {
      id: '4',
      title: 'Space Alert',
      message: 'Fashion Warehouse is at 90% capacity',
      timestamp: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  return (
    <header className="bg-white border-b shadow-sm py-2 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary mr-6">WarehouseIQ</h1>
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showProfileMenu) setShowProfileMenu(false);
              }}
              className="p-2 rounded-full hover:bg-secondary relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 border overflow-hidden">
                <div className="p-3 border-b flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-secondary/30 ${!notification.read ? 'bg-blue-50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                          </div>
                          <p className="text-sm mt-1 text-muted-foreground">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                </div>
                <div className="p-2 border-t">
                  <button className="w-full px-3 py-2 text-sm text-primary hover:bg-secondary/30 rounded-md text-center">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                if (showNotifications) setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-secondary"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="hidden md:inline font-medium">Admin User</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg z-50 border overflow-hidden">
                <div className="p-3 border-b">
                  <div className="font-medium">Admin User</div>
                  <div className="text-sm text-muted-foreground">admin@example.com</div>
                </div>
                <div className="p-2">
                  <button className="flex items-center space-x-2 w-full p-2 text-sm hover:bg-secondary/30 rounded-md text-left">
                    <User size={16} className="text-muted-foreground" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-sm hover:bg-secondary/30 rounded-md text-left">
                    <Settings size={16} className="text-muted-foreground" />
                    <span>Account Settings</span>
                  </button>
                  <button className="flex items-center space-x-2 w-full p-2 text-sm hover:bg-secondary/30 rounded-md text-left">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>Messages</span>
                  </button>
                </div>
                <div className="p-2 border-t">
                  <button 
                    className="flex items-center space-x-2 w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-left"
                    onClick={() => toast({
                      title: "Logout",
                      description: "You have been logged out successfully",
                    })}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
