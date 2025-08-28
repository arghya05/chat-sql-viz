import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatPanel } from './ChatPanel';
import { InventoryPanel } from './InventoryPanel';
import { Sidebar } from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DashboardLayout = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inventoryCollapsed, setInventoryCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2">
      <div className="h-[calc(100vh-1rem)] flex gap-3 max-w-7xl mx-auto">
        {!sidebarCollapsed && (
          <div className="w-60 bg-white/90 backdrop-blur-sm rounded-xl shadow-[var(--shadow-floating)] border border-white/40">
            <Sidebar />
          </div>
        )}
        
        {/* Sidebar toggle */}
        <div className="flex flex-col justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:bg-white/90 hover:shadow-xl transition-all duration-300"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-[var(--shadow-floating)] border border-white/40 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={inventoryCollapsed ? 100 : 65} minSize={40}>
              <ChatPanel onPdfSelect={setSelectedPdf} />
            </ResizablePanel>
            
            {!inventoryCollapsed && (
              <>
                <ResizableHandle className="w-1 bg-border/30 hover:bg-border/50 transition-colors" />
                <ResizablePanel defaultSize={35} minSize={25}>
                  <InventoryPanel 
                    selectedPdf={selectedPdf} 
                    onClosePdf={() => setSelectedPdf(null)} 
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        
        {/* Inventory panel toggle */}
        <div className="flex flex-col justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInventoryCollapsed(!inventoryCollapsed)}
            className="h-10 w-10 p-0 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-white/20 hover:bg-white/90 hover:shadow-xl transition-all duration-300"
          >
            {inventoryCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};