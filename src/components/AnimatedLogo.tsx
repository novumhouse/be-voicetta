
import React from 'react';
import { HotelIcon, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-10">
          <div className="w-14 h-14 rounded-full border-2 border-primary"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow opacity-20" style={{ animationDelay: '-2s' }}>
          <div className="w-10 h-10 rounded-full border-2 border-primary"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center space-x-1">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <HotelIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
      <div className="ml-3 font-semibold tracking-tight">
        <span className="opacity-90">HotelConnect</span>
        <span className="text-primary ml-1.5 opacity-80">API</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
