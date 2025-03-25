
import React from 'react';
import { cn } from '@/lib/utils';
import StatusCard from './StatusCard';
import MetricsCard from './MetricsCard';
import BookingList from './BookingList';
import ConfigPanel from './ConfigPanel';
import { apiStatusData, metricsData, recentBookings } from '@/utils/mockData';
import { Calendar, Code2, Info, Layers, LayoutDashboard, Settings, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ className }) => {
  return (
    <div className={cn("p-4 md:p-6 space-y-6", className)}>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your booking engine and API integrations</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="h-9">
            <Code2 className="mr-2 h-4 w-4" />
            View API Docs
          </Button>
          <Button className="h-9">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => (
          <MetricsCard
            key={metric.label}
            data={metric}
            delay={index * 100}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <BookingList bookings={recentBookings} />
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Layers className="mr-2 h-4 w-4 text-primary" />
              API Status
            </h3>
            
            <div className="space-y-3">
              {apiStatusData.map((status, index) => (
                <StatusCard
                  key={status.name}
                  data={status}
                  delay={index * 150}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigPanel />
        
        <div className="glass-panel rounded-lg overflow-hidden">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-medium">Quick Navigation</h2>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col items-center justify-center hover:bg-primary/5">
              <LayoutDashboard className="h-6 w-6 mb-2 text-primary" />
              <span>Dashboard</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex-col items-center justify-center hover:bg-primary/5">
              <Calendar className="h-6 w-6 mb-2 text-primary" />
              <span>Bookings</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex-col items-center justify-center hover:bg-primary/5">
              <Code2 className="h-6 w-6 mb-2 text-primary" />
              <span>API Logs</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 flex-col items-center justify-center hover:bg-primary/5">
              <Users className="h-6 w-6 mb-2 text-primary" />
              <span>User Access</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
