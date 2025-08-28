import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, BarChart3, FileText } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface MetricsPanelProps {
  selectedPdf: string | null;
  onClosePdf: () => void;
}

const metricCards = [
  {
    id: 'transactions',
    title: 'Transactions',
    value: '988',
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
    image: '/placeholder.svg'
  },
  {
    id: 'pageviews', 
    title: 'Pageviews',
    value: '252k',
    change: '+8%',
    trend: 'up',
    icon: BarChart3,
    image: '/placeholder.svg'
  },
  {
    id: 'time-on-site',
    title: 'Time on Site',
    value: '3.75m',
    change: '-2%',
    trend: 'down',
    icon: TrendingDown,
    image: '/placeholder.svg'
  },
  {
    id: 'bounces',
    title: 'Bounces', 
    value: '34.2k',
    change: '+5%',
    trend: 'down',
    icon: TrendingDown,
    image: '/placeholder.svg'
  },
  {
    id: 'revenue',
    title: 'Revenue',
    value: '$111m',
    change: '+15%',
    trend: 'up',
    icon: TrendingUp,
    image: '/placeholder.svg'
  },
  {
    id: 'avg-transaction',
    title: 'Average Transaction Value',
    value: '1.64k',
    change: '+3%',
    trend: 'up',
    icon: TrendingUp,
    image: '/placeholder.svg'
  },
  {
    id: 'total-hits',
    title: 'Total Hits',
    value: '302k',
    change: '+7%',
    trend: 'up',
    icon: BarChart3,
    image: '/placeholder.svg'
  },
  {
    id: 'total-visits',
    title: 'Total Visits',
    value: '67.4k',
    change: '+4%',
    trend: 'up',
    icon: TrendingUp,
    image: '/placeholder.svg'
  }
];

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ selectedPdf, onClosePdf }) => {
  const [activeTab, setActiveTab] = useState('metrics');

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
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="brochures">Brochures</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="metrics" className="flex-1 overflow-y-auto p-4 space-y-4">
          {metricCards.map((metric) => (
            <Card 
              key={metric.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Simulate PDF selection for demo
                const pdfFilenames = [
                  'quarterly-report.pdf',
                  'marketing-analysis.pdf', 
                  'revenue-breakdown.pdf',
                  'traffic-insights.pdf'
                ];
                const randomPdf = pdfFilenames[Math.floor(Math.random() * pdfFilenames.length)];
                // In real implementation, this would be based on the metric
                console.log(`Selected metric: ${metric.title}`);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`text-sm ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                  <div className="w-16 h-8 bg-muted rounded flex items-center justify-center">
                    <div className={`w-8 h-1 rounded ${
                      metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="brochures" className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { name: 'Q4 Analytics Report', type: 'PDF', size: '2.4 MB' },
            { name: 'Marketing Insights', type: 'PDF', size: '1.8 MB' },
            { name: 'Revenue Analysis', type: 'PDF', size: '3.1 MB' },
            { name: 'Traffic Breakdown', type: 'PDF', size: '1.2 MB' },
            { name: 'Customer Segments', type: 'PDF', size: '2.7 MB' },
            { name: 'Performance Review', type: 'PDF', size: '1.9 MB' }
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