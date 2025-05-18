import React, { useState, useEffect } from 'react';
import { Share2, Code, Users, ShieldCheck, Gauge, ArrowUpFromLine, HelpCircle, ZoomIn } from 'lucide-react';

// Simulated system components and their health
interface SystemComponent {
  name: string;
  status: 'operational' | 'degraded' | 'issue';
  uptime: number; // percentage
  latency: number; // milliseconds
  icon: React.ReactNode;
}

const SystemHealth: React.FC = () => {
  const [components, setComponents] = useState<SystemComponent[]>([
    {
      name: 'Agent Communication',
      status: 'operational',
      uptime: 99.98,
      latency: 92,
      icon: <Share2 className="h-4 w-4" />
    },
    {
      name: 'Reasoning Engine',
      status: 'operational',
      uptime: 99.95,
      latency: 164,
      icon: <Code className="h-4 w-4" />
    },
    {
      name: 'User Management',
      status: 'operational',
      uptime: 100,
      latency: 55,
      icon: <Users className="h-4 w-4" />
    },
    {
      name: 'Security Layer',
      status: 'operational',
      uptime: 100,
      latency: 38,
      icon: <ShieldCheck className="h-4 w-4" />
    },
    {
      name: 'Document Processor',
      status: 'operational',
      uptime: 99.92,
      latency: 228,
      icon: <ArrowUpFromLine className="h-4 w-4" />
    }
  ]);
  
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  
  // Simulated incident generation 
  useEffect(() => {
    const interval = setInterval(() => {
      // 5% chance of a component having a degraded status
      if (Math.random() < 0.05) {
        setComponents(prev => {
          const newComponents = [...prev];
          const randomIndex = Math.floor(Math.random() * newComponents.length);
          newComponents[randomIndex] = {
            ...newComponents[randomIndex],
            status: 'degraded',
            uptime: Math.max(98, newComponents[randomIndex].uptime - Math.random()),
            latency: newComponents[randomIndex].latency * (1 + Math.random())
          };
          return newComponents;
        });
        
        // Restore to operational after a delay
        setTimeout(() => {
          setComponents(prev => {
            const newComponents = [...prev];
            const degradedIndex = newComponents.findIndex(c => c.status === 'degraded');
            if (degradedIndex !== -1) {
              newComponents[degradedIndex] = {
                ...newComponents[degradedIndex],
                status: 'operational',
                uptime: 99.9 + Math.random() * 0.1,
                latency: newComponents[degradedIndex].latency / (1 + Math.random())
              };
            }
            return newComponents;
          });
        }, 10000); // Restore after 10 seconds
      }
      
      // Randomly vary latency slightly for realism
      setComponents(prev => {
        return prev.map(component => ({
          ...component,
          latency: component.status === 'operational' 
            ? Math.max(20, component.latency + (Math.random() * 10 - 5))
            : component.latency
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: SystemComponent['status']) => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'degraded':
        return 'text-amber-500';
      case 'issue':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const getStatusBg = (status: SystemComponent['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'issue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const toggleComponent = (name: string) => {
    if (expandedComponent === name) {
      setExpandedComponent(null);
    } else {
      setExpandedComponent(name);
    }
  };
  
  // Calculate overall system health
  const overallHealth = components.every(c => c.status === 'operational') 
    ? 'operational' 
    : components.some(c => c.status === 'issue') 
      ? 'issue' 
      : 'degraded';
  
  const averageUptime = components.reduce((sum, c) => sum + c.uptime, 0) / components.length;
  const averageLatency = components.reduce((sum, c) => sum + c.latency, 0) / components.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            System Health
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(overallHealth)}`}>
            {overallHealth === 'operational' 
              ? 'All Systems Operational' 
              : overallHealth === 'degraded'
                ? 'Some Systems Degraded'
                : 'System Issues Detected'}
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {components.map(component => (
          <div key={component.name}>
            <div 
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleComponent(component.name)}
            >
              <div className="flex items-center">
                <div className={`mr-3 p-2 rounded-full ${
                  component.status === 'operational' ? 'bg-green-100' :
                  component.status === 'degraded' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  {component.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{component.name}</p>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(component.status)} mr-1.5`}></div>
                    <p className="text-xs text-gray-500">
                      {component.status === 'operational' 
                        ? 'Operational' 
                        : component.status === 'degraded'
                          ? 'Performance Degraded'
                          : 'Issue Detected'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <p className="text-sm font-medium mr-4">{component.uptime.toFixed(2)}% uptime</p>
                {expandedComponent === component.name ? (
                  <ZoomIn className="h-4 w-4 text-gray-400" />
                ) : (
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            
            {/* Expanded details */}
            {expandedComponent === component.name && (
              <div className="p-3 bg-gray-50 text-sm border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Response Latency</p>
                    <p className="text-sm font-medium text-gray-900">{Math.round(component.latency)} ms</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          component.latency < 100 ? 'bg-green-500' :
                          component.latency < 200 ? 'bg-blue-500' :
                          component.latency < 300 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (component.latency / 5))}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Request Volume</p>
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round(50 + Math.random() * 100)} req/min
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 rounded-full bg-blue-500"
                        style={{ width: `${30 + Math.random() * 60}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">Last Incident:</p>
                  <p>No incidents in the last 7 days</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`h-2.5 w-2.5 rounded-full ${
              overallHealth === 'operational' ? 'bg-green-500' :
              overallHealth === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
            } mr-1.5`}></div>
            <p className="text-xs text-gray-600">
              Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="flex items-center text-xs">
            <span className="text-gray-500 mr-2">Avg. Latency:</span>
            <span className="font-medium text-gray-700">{Math.round(averageLatency)}ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;