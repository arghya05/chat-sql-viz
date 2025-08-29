import React from 'react';
import tataLogo from '@/assets/tata-motors-logo.png';

export const Sidebar = () => {
  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border bg-black">
        <div className="flex items-center gap-2">
          <img 
            src={tataLogo} 
            alt="TATA MOTORS" 
            className="h-8 w-auto object-contain" 
          />
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