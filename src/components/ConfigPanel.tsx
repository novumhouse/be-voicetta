
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Code, Key, MessageSquare, RefreshCw, Settings } from 'lucide-react';

interface ConfigPanelProps {
  className?: string;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [retryInterval, setRetryInterval] = useState(30);

  return (
    <div className={cn(
      "glass-panel rounded-lg overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-medium">API Configuration</h2>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Active
        </Badge>
      </div>

      <Tabs defaultValue="yieldplanet" className="p-4">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="yieldplanet">YieldPlanet</TabsTrigger>
          <TabsTrigger value="retell">Retell AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="yieldplanet" className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key">API Key</Label>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Production</Badge>
            </div>
            <div className="flex space-x-2">
              <Input id="api-key" type="password" value="••••••••••••••••••••••••••••••" className="font-mono text-sm" />
              <Button variant="outline" size="icon">
                <Key className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endpoint-url">Endpoint URL</Label>
            <Input id="endpoint-url" value="https://api.yieldplanet.com/v1.31" />
          </div>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Connection Status</Label>
                <p className="text-xs text-muted-foreground">Last verified 5 minutes ago</p>
              </div>
              <div className="flex items-center">
                <div className={cn(
                  "w-3 h-3 rounded-full mr-2",
                  isConnected ? "bg-green-500" : "bg-red-500"
                )}></div>
                <span>{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="auto-retry">Auto Retry on Error</Label>
              <Switch id="auto-retry" checked={true} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="retry-interval">Retry Interval ({retryInterval}s)</Label>
              </div>
              <Slider 
                id="retry-interval" 
                min={5} 
                max={120}
                step={5}
                value={[retryInterval]} 
                onValueChange={(value) => setRetryInterval(value[0])} 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="space-x-1">
              <RefreshCw className="h-4 w-4 mr-1" />
              Test Connection
            </Button>
            <Button>Save Configuration</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="retell" className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="retell-api-key">API Key</Label>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Production</Badge>
            </div>
            <div className="flex space-x-2">
              <Input id="retell-api-key" type="password" value="••••••••••••••••••••••••••••••" className="font-mono text-sm" />
              <Button variant="outline" size="icon">
                <Key className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex items-center space-x-2">
              <Input id="webhook-url" value="https://api.hotelconnect.io/webhooks/retell" className="font-mono text-sm" />
              <Button variant="outline" size="icon">
                <Code className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Use this URL in your Retell AI dashboard for custom functions</p>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="log-conversations">Log Conversations</Label>
              <Switch id="log-conversations" checked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="response-timeout">Response Timeout (ms)</Label>
              <Input id="response-timeout" type="number" value="300" className="w-24 text-right" />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="space-x-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              Test Webhook
            </Button>
            <Button>Save Configuration</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigPanel;
