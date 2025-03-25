
import React, { useState } from 'react';
import { 
  Bell, 
  HelpCircle,
  Menu, 
  Settings, 
  User
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AnimatedLogo from './AnimatedLogo';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  apiStatus?: "ok" | "degraded" | "down";
}

const Header: React.FC<HeaderProps> = ({ className, apiStatus }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-16 z-50 px-4 md:px-6 flex items-center justify-between",
      "bg-background/80 backdrop-blur-md border-b border-border/40",
      className
    )}>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <AnimatedLogo className="hidden md:flex" />
        <AnimatedLogo className="md:hidden" />
      </div>

      <div className="flex items-center space-x-1 md:space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <div className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer transition-colors">
                <div className="font-medium text-sm">New booking received</div>
                <div className="text-xs text-muted-foreground">5 minutes ago</div>
              </div>
              <div className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer transition-colors">
                <div className="font-medium text-sm">YieldPlanet API connection restored</div>
                <div className="text-xs text-muted-foreground">1 hour ago</div>
              </div>
              <div className="py-2 px-3 hover:bg-accent rounded-md cursor-pointer transition-colors">
                <div className="font-medium text-sm">System update completed</div>
                <div className="text-xs text-muted-foreground">3 hours ago</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>API Configuration</DropdownMenuItem>
            <DropdownMenuItem>System Preferences</DropdownMenuItem>
            <DropdownMenuItem>Notification Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
