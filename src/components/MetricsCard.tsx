
import React from 'react';
import { cn } from '@/lib/utils';
import { MetricData } from '@/utils/mockData';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { useCountAnimation } from '@/utils/animations';

interface MetricsCardProps {
  data: MetricData;
  delay?: number;
  className?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  data,
  delay = 0,
  className 
}) => {
  const MetricIcon = data.icon;
  
  // Animate the number if it's a numeric value
  const animatedValue = typeof data.value === 'number' 
    ? useCountAnimation(data.value as number, 1200, delay) 
    : data.value;
  
  const displayValue = typeof data.value === 'number' ? animatedValue : data.value;
  
  return (
    <div 
      className={cn(
        "glass-card rounded-lg overflow-hidden p-4",
        "hover:shadow-elegant-lg transition-all duration-300 ease-in-out",
        className
      )}
      style={{ 
        opacity: 0, 
        animation: `fade-in 0.4s ease-out forwards ${delay}ms` 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center text-sm font-medium text-muted-foreground mb-1">
            <MetricIcon className="h-4 w-4 mr-1" />
            <span>{data.label}</span>
          </div>
          
          <div className="text-2xl font-semibold tracking-tight">
            {displayValue}
          </div>
          
          {data.change !== undefined && (
            <div className="flex items-center mt-1">
              {data.change > 0 ? (
                <div className="flex items-center text-green-600 text-xs">
                  <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                  <span>{Math.abs(data.change)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-xs">
                  <ArrowDownIcon className="h-3 w-3 mr-0.5" />
                  <span>{Math.abs(data.change)}%</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        
        <div className="bg-primary/10 p-2 rounded-lg">
          <MetricIcon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
