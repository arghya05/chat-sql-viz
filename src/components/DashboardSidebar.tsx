import React from 'react';
import { Car } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">AutoDealer Pro</h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-6">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/10">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Your intelligent assistant for car sales, financing, and customer support
          </p>
        </div>
      </div>
    </div>
  );
};