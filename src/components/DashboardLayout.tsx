import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ChatPanel } from './ChatPanel';
import { MetricsPanel } from './MetricsPanel';
import { Sidebar } from './DashboardSidebar';

export const DashboardLayout = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={40}>
          <ChatPanel onPdfSelect={setSelectedPdf} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={30}>
          <MetricsPanel 
            selectedPdf={selectedPdf} 
            onClosePdf={() => setSelectedPdf(null)} 
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};