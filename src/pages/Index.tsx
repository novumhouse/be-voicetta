
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col animated-bg">
      <Header />
      
      <main className={cn(
        "flex-1 pt-16 transition-opacity duration-500 ease-in-out",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-opacity-20 animate-spin"></div>
              <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent absolute top-0 animate-spin"></div>
            </div>
          </div>
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
};

export default Index;
