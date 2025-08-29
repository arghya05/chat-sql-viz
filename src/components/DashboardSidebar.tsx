import React from 'react';

export const Sidebar = () => {
  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex-1 p-4">
        <p className="text-sm text-sidebar-foreground/60">
          Your AI assistant for car sales and financing
        </p>
      </div>
    </div>
  );
};