import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Car, Fuel, DollarSign, FileText, Loader2, Search, Filter, Eye, ArrowLeft, MapPin, Calendar, Star, Settings } from 'lucide-react';
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
  const [selectedVehicle, setSelectedVehicle] = useState<CarData | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter vehicles based on search and status
  const filteredVehicles = Object.entries(carData).filter(([key, vehicle]) => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.specs.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vehicle.availability_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (selectedPdf) {
    return (
      <div className="h-screen bg-background">
        <PDFViewer filename={selectedPdf} onClose={onClosePdf} />
      </div>
    );
  }

  if (selectedVehicle) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <div className="border-b border-border p-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedVehicle(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold">{selectedVehicle.specs.year} {selectedVehicle.specs.make} {selectedVehicle.model}</h2>
            <p className="text-sm text-muted-foreground">{selectedVehicle.specs.trim} • VIN: {selectedVehicle.vin}</p>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Vehicle Image Placeholder */}
            <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
              <Car className="w-24 h-24 text-primary/40" />
            </div>
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <div className="text-2xl font-bold">₹{(selectedVehicle.price / 100000).toFixed(1)}L</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Fuel className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Fuel Economy</span>
                  </div>
                  <div className="text-lg font-semibold">{selectedVehicle.specs.fuel_economy_city}/{selectedVehicle.specs.fuel_economy_highway} kmpl</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Engine</span>
                    <p className="font-medium">{selectedVehicle.specs.engine}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Transmission</span>
                    <p className="font-medium">{selectedVehicle.specs.transmission}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Drivetrain</span>
                    <p className="font-medium">{selectedVehicle.specs.drivetrain}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Horsepower</span>
                    <p className="font-medium">{selectedVehicle.specs.horsepower} HP</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Safety Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{selectedVehicle.specs.safety_rating}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Mileage</span>
                    <p className="font-medium">{selectedVehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Location & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Location: {selectedVehicle.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={selectedVehicle.availability_status === 'available' ? 'default' : 'secondary'}>
                    {selectedVehicle.availability_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            

          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-border p-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="inventory">
                <Car className="w-4 h-4 mr-2" />
                Inventory ({Object.keys(carData).length})
              </TabsTrigger>
              <TabsTrigger value="brochures">
                <FileText className="w-4 h-4 mr-2" />
                Brochures ({brochures.length})
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'inventory' && (
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {activeTab === 'inventory' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles by model, make, or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>

        <TabsContent value="inventory" className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading inventory...</span>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Car className="w-12 h-12 mb-4 opacity-50" />
                <p>No vehicles found</p>
                {(searchTerm || filterStatus !== 'all') && (
                  <Button variant="link" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredVehicles.map(([key, vehicle]) => (
                  <Card 
                    key={vehicle.id} 
                    className="hover:shadow-[var(--shadow-glow)] transition-all duration-300 cursor-pointer group bg-[var(--gradient-card)] rounded-xl"
                    style={{ boxShadow: 'var(--shadow-soft)' }}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                          {vehicle.specs.year} {vehicle.specs.make} {vehicle.model}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={vehicle.availability_status === 'available' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {vehicle.availability_status}
                          </Badge>
                          <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                            ₹{(vehicle.price / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.specs.trim} • {vehicle.color}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {vehicle.specs.engine} • {vehicle.specs.transmission}
                          </div>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/30 transition-all">
                          <Car className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {vehicle.specs.fuel_economy_city}/{vehicle.specs.fuel_economy_highway} kmpl
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {vehicle.specs.safety_rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {vehicle.location}
                        </div>
                      </div>
                      
                    </CardContent>
                  </Card>
                ))}
              </div>
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