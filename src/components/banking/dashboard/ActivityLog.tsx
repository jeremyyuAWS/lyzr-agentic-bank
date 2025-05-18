import React, { useEffect, useRef, useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Shield, 
  Clock, 
  CreditCard,
  Database,
  RefreshCw
} from 'lucide-react';

interface ActivityLogProps {
  maxHeight?: string;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ maxHeight = "400px" }) => {
  const { auditTrail } = useBankingContext();
  const [filteredLogs, setFilteredLogs] = useState(auditTrail);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [newEntryCount, setNewEntryCount] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs come in
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Track new entries for animation
    setNewEntryCount(prev => prev + 1);
    const timer = setTimeout(() => setNewEntryCount(0), 300);
    
    return () => clearTimeout(timer);
  }, [auditTrail.length]);
  
  // Filter logs
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredLogs(auditTrail);
    } else {
      setFilteredLogs(auditTrail.filter(log => {
        switch (activeFilter) {
          case 'user':
            return log.event.includes('User') || log.event.includes('Message');
          case 'document':
            return log.event.includes('Document');
          case 'kyc':
            return log.event.includes('KYC') || log.event.includes('Compliance');
          case 'account':
            return log.event.includes('Account') || log.event.includes('created');
          default:
            return true;
        }
      }));
    }
  }, [activeFilter, auditTrail]);
  
  // Get icon for log entry
  const getLogIcon = (event: string) => {
    if (event.includes('Message') || event.includes('sent')) {
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    } else if (event.includes('Document') || event.includes('Upload')) {
      return <FileText className="h-4 w-4 text-orange-500" />;
    } else if (event.includes('KYC') || event.includes('Compliance') || event.includes('verify')) {
      return <Shield className="h-4 w-4 text-indigo-500" />;
    } else if (event.includes('Account') || event.includes('created')) {
      return <CreditCard className="h-4 w-4 text-green-500" />;
    } else if (event.includes('Error') || event.includes('failed')) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    } else if (event.includes('Started') || event.includes('Reset')) {
      return <RefreshCw className="h-4 w-4 text-gray-500" />;
    } else {
      return <Database className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get color class based on event type
  const getEventColorClass = (event: string) => {
    if (event.includes('Error') || event.includes('failed')) {
      return 'bg-red-50 border-red-100 hover:bg-red-100';
    } else if (event.includes('KYC') || event.includes('Compliance')) {
      return 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100';
    } else if (event.includes('Document')) {
      return 'bg-orange-50 border-orange-100 hover:bg-orange-100';
    } else if (event.includes('Account') || event.includes('created') || event.includes('approved')) {
      return 'bg-green-50 border-green-100 hover:bg-green-100';
    } else {
      return 'bg-gray-50 border-gray-100 hover:bg-gray-100';
    }
  };
  
  const toggleDetails = (timestamp: string) => {
    if (expandedLog === timestamp) {
      setExpandedLog(null);
    } else {
      setExpandedLog(timestamp);
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Activity Log</h3>
          
          <div className="flex space-x-2 overflow-x-auto">
            <button
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Activities
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                activeFilter === 'user' 
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('user')}
            >
              User Interactions
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                activeFilter === 'document' 
                  ? 'bg-orange-100 text-orange-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('document')}
            >
              Documents
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                activeFilter === 'kyc' 
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('kyc')}
            >
              KYC/Compliance
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
                activeFilter === 'account' 
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('account')}
            >
              Accounts
            </button>
          </div>
        </div>
      </div>
      <div className="p-2 overflow-hidden" style={{ maxHeight }}>
        <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight: `calc(${maxHeight} - 16px)` }}>
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm">No activity logs match your filter</p>
            </div>
          ) : (
            filteredLogs.slice().reverse().map((log, index) => {
              const isNew = index === 0 && newEntryCount > 0;
              const timestampKey = log.timestamp.toISOString();
              return (
                <div 
                  key={`${timestampKey}-${index}`}
                  className={`border rounded-md cursor-pointer transition-all ${
                    getEventColorClass(log.event)
                  } ${
                    isNew ? 'animate-pulse border-indigo-300' : ''
                  }`}
                  onClick={() => toggleDetails(timestampKey)}
                >
                  <div className="p-3 flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getLogIcon(log.event)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.event}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {log.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {log.details}
                      </p>
                    </div>
                  </div>
                  
                  {/* Expanded view */}
                  {expandedLog === timestampKey && (
                    <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                      <div className="text-xs text-gray-600">
                        <p className="whitespace-pre-wrap">{log.details}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <span className="font-medium">Timestamp:</span>
                          <span>{log.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;