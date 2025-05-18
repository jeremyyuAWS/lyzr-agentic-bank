import React from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { CheckCircle as CircleCheck, PauseCircle as CirclePause, BrainCog, Cpu, Share, FolderCheck, Timer } from 'lucide-react';

// Generates mock metrics for agent performance
const generateAgentMetrics = () => {
  return {
    responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
    accuracy: 95 + Math.floor(Math.random() * 5), // 95-99%
    completionRate: 90 + Math.floor(Math.random() * 10), // 90-99%
    averageTaskTime: Math.floor(Math.random() * 3000) + 1000, // 1-4 seconds
    messagesProcessed: Math.floor(Math.random() * 100) + 50, // 50-150
    documentsVerified: Math.floor(Math.random() * 20) + 10, // 10-30
    customerSatisfaction: 90 + Math.floor(Math.random() * 10), // 90-99%
  };
};

interface AgentMetricsProps {
  showTitle?: boolean;
}

const AgentMetrics: React.FC<AgentMetricsProps> = ({ showTitle = true }) => {
  const { mode, auditTrail } = useBankingContext();
  const metrics = React.useMemo(() => generateAgentMetrics(), []);
  
  // Calculate active agents based on mode
  const activeAgents = mode === 'account-opening' ? 4 : mode === 'credit-card' ? 3 : mode === 'loan' ? 3 : 0;
  const totalAgents = 8; // Total agents in the system
  
  // Count message events in audit trail
  const messageEvents = auditTrail.filter(event => event.event.includes('Message')).length;
  
  // Count document events in audit trail
  const documentEvents = auditTrail.filter(event => event.event.includes('Document')).length;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {showTitle && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Agent System Metrics</h3>
        </div>
      )}
      
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Agent status indicator */}
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <div className="flex items-center mb-2">
              <BrainCog className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="text-sm font-medium text-indigo-900">Agent Status</h4>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-indigo-800">Active Agents:</span>
              <div className="flex items-center">
                <CircleCheck className="h-3.5 w-3.5 text-green-500 mr-1" />
                <span className="text-sm font-medium text-indigo-900">{activeAgents} / {totalAgents}</span>
              </div>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-1.5">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full" 
                style={{ width: `${(activeAgents / totalAgents) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Response time */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center mb-2">
              <Timer className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="text-sm font-medium text-green-900">Response Time</h4>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-green-800">Average:</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-900">{metrics.responseTime} ms</span>
              </div>
            </div>
            <div className="w-full bg-green-200 rounded-full h-1.5">
              <div 
                className="bg-green-600 h-1.5 rounded-full" 
                style={{ width: `${100 - (metrics.responseTime / 10)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Accuracy */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center mb-2">
              <Cpu className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="text-sm font-medium text-blue-900">Processing Accuracy</h4>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-blue-800">Success Rate:</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">{metrics.accuracy}%</span>
              </div>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${metrics.accuracy}%` }}
              ></div>
            </div>
          </div>
          
          {/* User messages */}
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center mb-2">
              <Share className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="text-sm font-medium text-purple-900">Communications</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-purple-800 mb-1">Messages</p>
                <p className="text-lg font-medium text-purple-900">{messageEvents}</p>
              </div>
              <div>
                <p className="text-xs text-purple-800 mb-1">Inter-Agent</p>
                <p className="text-lg font-medium text-purple-900">{Math.floor(messageEvents * 0.7)}</p>
              </div>
            </div>
          </div>
          
          {/* Document processing */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="flex items-center mb-2">
              <FolderCheck className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="text-sm font-medium text-amber-900">Document Processing</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-amber-800 mb-1">Processed</p>
                <p className="text-lg font-medium text-amber-900">{documentEvents || 0}</p>
              </div>
              <div>
                <p className="text-xs text-amber-800 mb-1">Verification</p>
                <p className="text-lg font-medium text-amber-900">{metrics.accuracy}%</p>
              </div>
            </div>
          </div>
          
          {/* System health */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center mb-2">
              <CirclePause className="h-5 w-5 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">System Health</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">Uptime</p>
                <p className="text-sm font-medium text-gray-900">99.9%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Latency</p>
                <p className="text-sm font-medium text-gray-900">{metrics.responseTime - 50}ms</p>
              </div>
            </div>
            <div className="mt-1 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: '99.9%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic real-time stats */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="border border-gray-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Activity Level</p>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <p className="text-sm font-medium text-gray-900">
                {activeAgents > 0 ? 'Active' : 'Standby'}
              </p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Task Queue</p>
            <p className="text-sm font-medium text-gray-900">
              {Math.round(messageEvents * 0.3)} tasks
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">Response Rate</p>
            <p className="text-sm font-medium text-gray-900">
              {(60000 / metrics.averageTaskTime).toFixed(1)}/min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentMetrics;