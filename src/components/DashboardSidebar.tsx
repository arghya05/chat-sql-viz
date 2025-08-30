import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Car, 
  FileText, 
  Calendar, 
  Settings, 
  BarChart3, 
  Users, 
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Tag,
  TrendingUp,
  Star,
  Activity
} from 'lucide-react';

export const Sidebar = () => {
  const [quickStats, setQuickStats] = useState({
    totalInventory: 24,
    pendingAppointments: 8,
    activeOffers: 5,
    monthlyLeads: 142
  });

  const navItems = [
    { icon: MessageSquare, label: 'Chat Assistant', active: true },
    { icon: Car, label: 'Inventory', count: quickStats.totalInventory },
    { icon: FileText, label: 'Brochures', count: 12 },
    { icon: Calendar, label: 'Appointments', count: quickStats.pendingAppointments },
    { icon: Tag, label: 'Offers', count: quickStats.activeOffers },
    { icon: Users, label: 'Customers', count: 89 },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Settings, label: 'Settings' }
  ];

  const recentActivity = [
    { time: '2m ago', text: 'New appointment booked', type: 'appointment' },
    { time: '15m ago', text: 'Customer inquiry about Nexon', type: 'inquiry' },
    { time: '1h ago', text: 'Test drive completed', type: 'testdrive' },
    { time: '2h ago', text: 'New offer created', type: 'offer' }
  ];

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          Sales Dashboard
        </h2>
        <p className="text-sm text-sidebar-foreground/60 mt-1">
          Your AI assistant for car sales
        </p>
      </div>

      <ScrollArea className="flex-1">
        {/* Quick Stats */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Quick Stats</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-lg font-bold">{quickStats.totalInventory}</div>
                  <div className="text-xs text-muted-foreground">Vehicles</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-lg font-bold">{quickStats.pendingAppointments}</div>
                  <div className="text-xs text-muted-foreground">Appointments</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-lg font-bold">{quickStats.activeOffers}</div>
                  <div className="text-xs text-muted-foreground">Active Offers</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-lg font-bold">{quickStats.monthlyLeads}</div>
                  <div className="text-xs text-muted-foreground">Monthly Leads</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Navigation</h3>
          
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className="w-full justify-start h-9 px-3"
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Recent Activity</h3>
          
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-sidebar-foreground">{activity.text}</p>
                  <p className="text-xs text-sidebar-foreground/60">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Quick Actions</h3>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start h-8" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call Customer
            </Button>
            <Button variant="outline" className="w-full justify-start h-8" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Visit
            </Button>
            <Button variant="outline" className="w-full justify-start h-8" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Generate Quote
            </Button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Today's Schedule</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Clock className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Test Drive - Nexon</p>
                <p className="text-xs text-muted-foreground">2:30 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              <MapPin className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Customer Visit</p>
                <p className="text-xs text-muted-foreground">4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
          <Activity className="w-4 h-4" />
          <span>System Status: Online</span>
        </div>
      </div>
    </div>
  );
};