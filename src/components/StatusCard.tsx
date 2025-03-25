
import React from 'react';
import { cn } from '@/lib/utils';
import { ApiStatus, getStatusIcon } from '@/utils/mockData';
import { Badge } from '@/components/ui/badge';
import { useFadeIn } from '@/utils/animations';

interface StatusCardProps {
  data: ApiStatus;
  delay?: number;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  data, 
  delay = 0,
  className 
}) => {
  const fadeIn = useFadeIn(delay, 400);
  const StatusIcon = data.icon;
  const StatusIndicator = getStatusIcon(data.status);

  const getStatusColor = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-amber-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'operational' | 'degraded' | 'down') => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 150) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div 
      className={cn(
        "glass-card p-4 rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
        "hover:shadow-elegant-lg transform hover:-translate-y-1",
        className
      )}
      style={fadeIn.style}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-md mr-3">
            <StatusIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{data.name}</h3>
            <div className="flex items-center mt-0.5">
              <div className={cn("w-2 h-2 rounded-full mr-1.5", getStatusColor(data.status))}></div>
              <span className="text-sm text-muted-foreground">{getStatusText(data.status)}</span>
            </div>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={cn("font-mono", getLatencyColor(data.latency))}
        >
          {data.latency}ms
        </Badge>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        Last checked: {new Date(data.lastChecked).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatusCard;
