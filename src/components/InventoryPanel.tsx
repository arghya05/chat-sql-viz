import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Car, Fuel, DollarSign, FileText } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface InventoryPanelProps {
  selectedPdf: string | null;
  onClosePdf: () => void;
}

const vehicleCards = [
  {
    id: 'sedan-special',
    title: '2024 Honda Accord',
    value: '$28,995',
    details: 'LX Trim • CVT',
    type: 'sedan',
    icon: Car,
    image: '/placeholder.svg'
  },
  {
    id: 'suv-deal', 
    title: '2023 Toyota RAV4',
    value: '$32,450',
    details: 'LE AWD • 1.2k miles',
    type: 'suv',
    icon: Car,
    image: '/placeholder.svg'
  },
  {
    id: 'electric-special',
    title: '2024 Tesla Model 3',
    value: '$35,990',
    details: 'Standard Range • 0 miles',
    type: 'electric',
    icon: Car,
    image: '/placeholder.svg'
  },
  {
    id: 'truck-deal',
    title: '2023 Ford F-150', 
    value: '$42,995',
    details: 'XLT SuperCrew • 5k miles',
    type: 'truck',
    icon: Car,
    image: '/placeholder.svg'
  },
  {
    id: 'luxury-sedan',
    title: '2023 BMW 3 Series',
    value: '$45,500',
    details: '330i xDrive • 8k miles',
    type: 'luxury',
    icon: Car,
    image: '/placeholder.svg'
  },
  {
    id: 'compact-deal',
    title: '2024 Nissan Sentra',
    value: '$21,990',
    details: 'SV CVT • New',
    type: 'compact',
    icon: Car,
    image: '/placeholder.svg'
  }
];

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ selectedPdf, onClosePdf }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  if (selectedPdf) {
    return (
      <div className="h-screen bg-background">
        <PDFViewer filename={selectedPdf} onClose={onClosePdf} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="p-6 pb-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-md">
            <TabsTrigger value="inventory" className="rounded-lg font-medium">Inventory</TabsTrigger>
            <TabsTrigger value="brochures" className="rounded-lg font-medium">Brochures</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inventory" className="flex-1 overflow-y-auto px-6 space-y-4">
          {vehicleCards.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="group p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] border border-white/20 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => {
                // Simulate PDF selection for vehicle brochure
                const pdfFilenames = [
                  'honda-accord-brochure.pdf',
                  'toyota-rav4-specs.pdf', 
                  'tesla-model3-info.pdf',
                  'ford-f150-details.pdf'
                ];
                const randomPdf = pdfFilenames[Math.floor(Math.random() * pdfFilenames.length)];
                // In real implementation, this would be the actual vehicle brochure
                console.log(`Selected vehicle: ${vehicle.title}`);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <vehicle.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{vehicle.title}</h3>
                    <p className="text-xs text-muted-foreground">{vehicle.details}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-primary">{vehicle.value}</div>
                <div className="w-12 h-8 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                  <Fuel className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="brochures" className="flex-1 overflow-y-auto px-6 space-y-4">
          {[
            { name: '2024 Honda Accord Brochure', type: 'PDF', size: '2.4 MB' },
            { name: 'Toyota RAV4 Specifications', type: 'PDF', size: '1.8 MB' },
            { name: 'Tesla Model 3 Features', type: 'PDF', size: '3.1 MB' },
            { name: 'Ford F-150 Capabilities', type: 'PDF', size: '1.2 MB' },
            { name: 'BMW 3 Series Options', type: 'PDF', size: '2.7 MB' },
            { name: 'Financing Guide 2024', type: 'PDF', size: '1.9 MB' }
          ].map((doc, index) => (
            <div 
              key={index}
              className="group p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] border border-white/20 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => {
                // Simulate opening PDF
                const filename = `${doc.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                console.log('Opening PDF:', filename);
                // For demo, we'll just log this
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-red-100 transition-colors">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  View
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};