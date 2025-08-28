import React from 'react';
import { Car } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">AutoDealer Pro</span>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <p className="text-sm text-sidebar-foreground/60">
          Your AI assistant for car sales and financing
        </p>
      </div>
    </div>
  );
};