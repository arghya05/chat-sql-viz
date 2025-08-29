import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatPanel } from './ChatPanel';
import { InventoryPanel } from './InventoryPanel';
import { Sidebar } from './DashboardSidebar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from 'lucide-react';
import tataLogo from '@/assets/tata-motors-logo.png';

export const DashboardLayout = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inventoryCollapsed, setInventoryCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top banner */}
      <div className="h-16 bg-black border-b border-sidebar-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <img 
            src={tataLogo} 
            alt="TATA MOTORS" 
            className="h-12 w-auto object-contain" 
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {!sidebarCollapsed && <Sidebar />}
        
        {/* Sidebar toggle */}
        <div className="flex flex-col justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-6 p-0 border-r border-border"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={inventoryCollapsed ? 100 : 60} minSize={30}>
            <ChatPanel onPdfSelect={setSelectedPdf} />
          </ResizablePanel>
          
          {!inventoryCollapsed && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={30}>
                <InventoryPanel 
                  selectedPdf={selectedPdf} 
                  onClosePdf={() => setSelectedPdf(null)} 
                  onPdfSelect={setSelectedPdf}
                />
              </ResizablePanel>
            </>
          )}
          
          {/* Inventory panel toggle */}
          <div className="flex flex-col justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInventoryCollapsed(!inventoryCollapsed)}
              className="h-8 w-6 p-0 border-l border-border"
            >
              {inventoryCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};