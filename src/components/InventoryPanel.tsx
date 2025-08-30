import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Car, Fuel, DollarSign, FileText, Loader2 } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { toast } from '@/hooks/use-toast';

interface InventoryPanelProps {
  selectedPdf: string | null;
  onClosePdf: () => void;
  onPdfSelect?: (filename: string) => void;
}

interface CarData {
  id: string;
  vin: string;
  model: string;
  specs: {
    make: string;
    year: number;
    trim: string;
    engine: string;
    transmission: string;
    drivetrain: string;
    fuel_economy_city: number;
    fuel_economy_highway: number;
    horsepower: number;
    safety_rating: string;
  };
  price: number;
  mileage: number;
  color: string;
  location: string;
  availability_status: string;
  features: string[];
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ selectedPdf, onClosePdf, onPdfSelect }) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [carData, setCarData] = useState<Record<string, CarData>>({});
  const [brochures, setBrochures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [brochuresLoading, setBrochuresLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch('http://localhost:9090/car_data');
        if (!response.ok) throw new Error('Failed to fetch car data');
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
        toast({
          title: "Connection Error",
          description: "Cannot connect to the server. Please check if the backend service is running on localhost:9090",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchBrochures = async () => {
      try {
        const response = await fetch('http://localhost:9090/brochures');
        if (!response.ok) throw new Error('Failed to fetch brochures');
        const data = await response.json();
        setBrochures(data.brochures || []);
      } catch (error) {
        console.error('Error fetching brochures:', error);
        toast({
          title: "Connection Error",
          description: "Cannot connect to the server. Please check if the backend service is running on localhost:9090",
          variant: "destructive",
        });
      } finally {
        setBrochuresLoading(false);
      }
    };

    fetchCarData();
    fetchBrochures();
  }, []);

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
        <div className="border-b border-border p-4 pt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="brochures">Brochures</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="inventory" className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading inventory...</span>
              </div>
            ) : Object.entries(carData).length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No vehicles available
              </div>
            ) : (
              Object.entries(carData).map(([key, vehicle]) => (
                <Card 
                  key={vehicle.id} 
                  className="hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group bg-[var(--gradient-card)] rounded-xl"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                  onClick={() => {
                    console.log(`Selected vehicle: ${vehicle.model}`);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {vehicle.specs.year} {vehicle.specs.make} {vehicle.model}
                      </CardTitle>
                      <Car className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                          Starts from ₹{(vehicle.price / 100000).toFixed(1)}L
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {vehicle.specs.trim} • {vehicle.color}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {vehicle.specs.engine} • {vehicle.specs.transmission}
                        </div>
                      </div>
                      <div className="w-16 h-8 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all">
                        <Fuel className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="text-xs text-muted-foreground">
                        <span className="inline-block mr-4">⛽ {vehicle.specs.fuel_economy_city}/{vehicle.specs.fuel_economy_highway} kmpl</span>
                        <span className="inline-block mr-4">🏆 {vehicle.specs.safety_rating}</span>
                        <span className="inline-block">📍 {vehicle.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="brochures" className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            {brochuresLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading brochures...</span>
              </div>
            ) : brochures.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No brochures available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brochures.map((filename, index) => {
                  // Extract display name from filename
                  const displayName = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  const colors = [
                    'bg-blue-500',
                    'bg-red-500', 
                    'bg-green-600',
                    'bg-purple-600',
                    'bg-orange-500',
                    'bg-teal-600'
                  ];
                  const bgColor = colors[index % colors.length];
                  
                  return (
                    <Card 
                      key={filename}
                      className="hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group bg-[var(--gradient-card)] rounded-xl overflow-hidden"
                      style={{ boxShadow: 'var(--shadow-soft)' }}
                      onClick={() => {
                        if (onPdfSelect) {
                          onPdfSelect(filename);
                        }
                      }}
                    >
                      <div className="relative">
                        <div className={`h-32 ${bgColor} flex items-center justify-center relative overflow-hidden`}>
                          {/* PDF Preview placeholder - would need actual PDF preview implementation */}
                          <iframe 
                            src={`http://localhost:9090/get-pdf/${filename}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full scale-50 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity"
                            style={{ transform: 'scale(0.5)', transformOrigin: 'center' }}
                            onError={() => {
                              // Fallback to file icon if preview fails
                            }}
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full p-1">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{displayName}</h3>
                        <p className="text-xs text-muted-foreground mb-2">PDF Document</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{filename}</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs">View</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};