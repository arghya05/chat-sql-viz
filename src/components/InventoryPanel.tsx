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
              className="hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group bg-[var(--gradient-card)] rounded-xl"
              style={{ boxShadow: 'var(--shadow-soft)' }}
              onClick={() => {
                const pdfFilenames = [
                  'honda-accord-brochure.pdf',
                  'toyota-rav4-specs.pdf', 
                  'tesla-model3-info.pdf',
                  'ford-f150-details.pdf'
                ];
                const randomPdf = pdfFilenames[Math.floor(Math.random() * pdfFilenames.length)];
                console.log(`Selected vehicle: ${vehicle.title}`);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {vehicle.title}
                  </CardTitle>
                  <vehicle.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold group-hover:text-primary transition-colors">{vehicle.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.details}
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all">
                    <Fuel className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="brochures" className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: '2024 Honda Accord', type: 'Brochure', size: '2.4 MB', image: '/placeholder.svg', color: 'bg-blue-500' },
              { name: 'Toyota RAV4', type: 'Specifications', size: '1.8 MB', image: '/placeholder.svg', color: 'bg-red-500' },
              { name: 'Tesla Model 3', type: 'Features Guide', size: '3.1 MB', image: '/placeholder.svg', color: 'bg-gray-800' },
              { name: 'Ford F-150', type: 'Capabilities', size: '1.2 MB', image: '/placeholder.svg', color: 'bg-blue-600' },
              { name: 'BMW 3 Series', type: 'Options Guide', size: '2.7 MB', image: '/placeholder.svg', color: 'bg-black' },
              { name: 'Financing Guide', type: '2024 Rates', size: '1.9 MB', image: '/placeholder.svg', color: 'bg-green-600' }
            ].map((doc, index) => (
              <Card 
                key={index}
                className="hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group bg-[var(--gradient-card)] rounded-xl overflow-hidden"
                style={{ boxShadow: 'var(--shadow-soft)' }}
                onClick={() => {
                  const filename = `${doc.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
                  console.log('Opening PDF:', filename);
                }}
              >
                <div className="relative">
                  <div className={`h-32 ${doc.color} flex items-center justify-center`}>
                    <img 
                      src={doc.image} 
                      alt={doc.name}
                      className="w-16 h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{doc.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs">View</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};