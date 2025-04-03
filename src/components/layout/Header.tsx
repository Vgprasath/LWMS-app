
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 px-6 flex items-center justify-between border-b bg-white/70 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          Logistics Management System
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 rounded-full bg-secondary/50 border-transparent focus:border-transparent focus:ring-0 focus:outline-none text-sm"
          />
        </div>
        
        <button className="p-2 rounded-full hover:bg-secondary/80 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
