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
    <div className="h-screen bg-background flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="brochures">Brochures</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inventory" className="flex-1 overflow-y-auto p-4 space-y-4">
          {vehicleCards.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
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
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {vehicle.title}
                  </CardTitle>
                  <vehicle.icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{vehicle.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.details}
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-muted rounded flex items-center justify-center">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="brochures" className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { name: '2024 Honda Accord Brochure', type: 'PDF', size: '2.4 MB' },
            { name: 'Toyota RAV4 Specifications', type: 'PDF', size: '1.8 MB' },
            { name: 'Tesla Model 3 Features', type: 'PDF', size: '3.1 MB' },
            { name: 'Ford F-150 Capabilities', type: 'PDF', size: '1.2 MB' },
            { name: 'BMW 3 Series Options', type: 'PDF', size: '2.7 MB' },
            { name: 'Financing Guide 2024', type: 'PDF', size: '1.9 MB' }
          ].map((doc, index) => (
            <Card 
              key={index}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => {
                // Simulate opening PDF
                const filename = `${doc.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                console.log('Opening PDF:', filename);
                // For demo, we'll just log this
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};