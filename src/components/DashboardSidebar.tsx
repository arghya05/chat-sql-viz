import React from 'react';
import { BarChart3, MessageSquare, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboards', active: false },
  { icon: MessageSquare, label: 'Marketing', active: true },
  { icon: Settings, label: 'Operations', active: false },
  { icon: HelpCircle, label: 'Support', active: false },
];

export const Sidebar = () => {
  return (
    <div className="w-48 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">datagpt</span>
        </div>
      </div>
      
      <nav className="flex-1 p-2">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
              item.active 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};