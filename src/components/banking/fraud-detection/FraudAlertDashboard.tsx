import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  MapPin, 
  CreditCard, 
  Eye, 
  Filter,
  AlertCircle,
  XCircle,
  Search,
  SlidersHorizontal,
  BadgeInfo
} from 'lucide-react';

// Alert Types
interface FraudAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved' | 'dismissed';
  type: 'transaction' | 'login' | 'device' | 'card' | 'account';
  timestamp: Date;
  description: string;
  accountNumber?: string;
  cardNumber?: string;
  amount?: number;
  location?: string;
  ipAddress?: string;
  deviceDetails?: string;
  riskScore: number; // 0-100
  resolutionDetails?: string;
  resolvedAt?: Date;
  customerAction?: 'confirmed' | 'disputed';
}

// Generate mock fraud alerts
const generateMockAlerts = (count: number = 15): FraudAlert[] => {
  const alertTypes: FraudAlert['type'][] = ['transaction', 'login', 'device', 'card', 'account'];
  const severities: FraudAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: FraudAlert['status'][] = ['new', 'in-progress', 'resolved', 'dismissed'];
  
  const mockAlerts: FraudAlert[] = [];
  
  for (let i = 0; i < count; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = Math.random() > 0.7 ? 'critical' : 
                   Math.random() > 0.5 ? 'high' : 
                   Math.random() > 0.3 ? 'medium' : 
                   'low';
    
    // Newer alerts more likely to be 'new' or 'in-progress'
    const status = i < 5 ? 
                 (Math.random() > 0.5 ? 'new' : 'in-progress') : 
                 (Math.random() > 0.5 ? 'resolved' : 'dismissed');
    
    const alert: FraudAlert = {
      id: `alert-${Date.now() - i * 1000000 + Math.floor(Math.random() * 1000)}`,
      severity,
      status,
      type: alertType,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last week
      description: getAlertDescription(alertType, severity),
      riskScore: severity === 'critical' ? 85 + Math.floor(Math.random() * 15) : 
               severity === 'high' ? 70 + Math.floor(Math.random() * 15) : 
               severity === 'medium' ? 40 + Math.floor(Math.random() * 30) : 
               10 + Math.floor(Math.random() * 30),
    };
    
    // Add type-specific details
    if (alertType === 'transaction') {
      alert.accountNumber = `****${Math.floor(1000 + Math.random() * 9000)}`;
      alert.amount = Math.floor(100 + Math.random() * 9900);
      alert.location = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Moscow, Russia', 'Lagos, Nigeria', 'London, UK'][Math.floor(Math.random() * 7)];
    } else if (alertType === 'login') {
      alert.ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      alert.location = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Moscow, Russia', 'Lagos, Nigeria', 'London, UK'][Math.floor(Math.random() * 7)];
    } else if (alertType === 'device') {
      alert.deviceDetails = ['New Android device', 'Unrecognized iPhone', 'Unknown Windows PC', 'New Tablet', 'New Browser'][Math.floor(Math.random() * 5)];
    } else if (alertType === 'card') {
      alert.cardNumber = `****${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (alertType === 'account') {
      alert.accountNumber = `****${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    // Add resolution for resolved/dismissed alerts
    if (status === 'resolved' || status === 'dismissed') {
      alert.resolvedAt = new Date(alert.timestamp.getTime() + Math.random() * 24 * 60 * 60 * 1000);
      alert.resolutionDetails = status === 'resolved' 
        ? ['Confirmed legitimate by customer', 'Transaction blocked', 'Account locked', 'Card blocked', 'Password reset required'][Math.floor(Math.random() * 5)]
        : ['False positive', 'Expected behavior', 'Known location', 'Verified device'][Math.floor(Math.random() * 4)];
    }
    
    mockAlerts.push(alert);
  }
  
  // Sort by timestamp, newest first
  return mockAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const getAlertDescription = (type: FraudAlert['type'], severity: FraudAlert['severity']): string => {
  if (type === 'transaction') {
    return severity === 'critical' ? 'Suspicious high-value transaction in unusual location' : 
           severity === 'high' ? 'Potential fraudulent transaction detected' :
           severity === 'medium' ? 'Unusual transaction pattern detected' :
           'Transaction amount outside normal range';
  } else if (type === 'login') {
    return severity === 'critical' ? 'Login attempt from suspicious foreign location' :
           severity === 'high' ? 'Multiple failed login attempts detected' :
           severity === 'medium' ? 'Login from unrecognized IP address' :
           'Login attempt from new device';
  } else if (type === 'device') {
    return severity === 'critical' ? 'Account accessed from multiple locations simultaneously' :
           severity === 'high' ? 'New device added with unusual access patterns' :
           severity === 'medium' ? 'Unrecognized device accessing account' :
           'New device registered to account';
  } else if (type === 'card') {
    return severity === 'critical' ? 'Multiple declined card transactions in rapid succession' :
           severity === 'high' ? 'Card used in unusual location' :
           severity === 'medium' ? 'Unusual card transaction pattern' :
           'Small test transaction detected';
  } else {
    return severity === 'critical' ? 'Potential account takeover attempt' :
           severity === 'high' ? 'Multiple account changes in short period' :
           severity === 'medium' ? 'Password or email changed recently' :
           'Address change requested';
  }
};

const FraudAlertDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  
  // Generate mock alerts
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAlerts(generateMockAlerts(15));
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    // Filter by status
    if (filter !== 'all' && alert.status !== filter) {
      return false;
    }
    
    // Filter by severity
    if (severityFilter !== 'all' && alert.severity !== severityFilter) {
      return false;
    }
    
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        alert.description.toLowerCase().includes(query) ||
        alert.id.toLowerCase().includes(query) ||
        (alert.location && alert.location.toLowerCase().includes(query)) ||
        (alert.accountNumber && alert.accountNumber.includes(query)) ||
        (alert.cardNumber && alert.cardNumber.includes(query))
      );
    }
    
    return true;
  });
  
  // Get alert details for expanded view
  const getAlertDetails = (alert: FraudAlert) => {
    let details = [];
    
    // Common details
    details.push({ label: 'Alert ID', value: alert.id });
    details.push({ label: 'Risk Score', value: `${alert.riskScore}/100` });
    details.push({ label: 'Date & Time', value: alert.timestamp.toLocaleString() });
    
    // Type-specific details
    if (alert.type === 'transaction') {
      if (alert.amount) details.push({ label: 'Amount', value: `$${alert.amount.toLocaleString()}` });
      if (alert.accountNumber) details.push({ label: 'Account', value: alert.accountNumber });
      if (alert.location) details.push({ label: 'Location', value: alert.location });
    } else if (alert.type === 'login') {
      if (alert.ipAddress) details.push({ label: 'IP Address', value: alert.ipAddress });
      if (alert.location) details.push({ label: 'Location', value: alert.location });
      details.push({ label: 'Login Type', value: 'Web Portal' });
    } else if (alert.type === 'device') {
      if (alert.deviceDetails) details.push({ label: 'Device', value: alert.deviceDetails });
      if (alert.ipAddress) details.push({ label: 'IP Address', value: alert.ipAddress });
    } else if (alert.type === 'card') {
      if (alert.cardNumber) details.push({ label: 'Card Number', value: alert.cardNumber });
      if (alert.amount) details.push({ label: 'Amount', value: `$${alert.amount.toLocaleString()}` });
      if (alert.location) details.push({ label: 'Merchant Location', value: alert.location });
    } else if (alert.type === 'account') {
      if (alert.accountNumber) details.push({ label: 'Account', value: alert.accountNumber });
      details.push({ label: 'Change Type', value: 'Personal Info' });
    }
    
    // Resolution details if resolved
    if (alert.status === 'resolved' || alert.status === 'dismissed') {
      details.push({ label: 'Resolution', value: alert.resolutionDetails || 'No details provided' });
      if (alert.resolvedAt) details.push({ label: 'Resolved At', value: alert.resolvedAt.toLocaleString() });
      if (alert.customerAction) details.push({ label: 'Customer Action', value: alert.customerAction });
    }
    
    return details;
  };
  
  // Get alert type icon
  const getAlertTypeIcon = (type: FraudAlert['type']) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'login':
        return <User className="h-5 w-5 text-indigo-600" />;
      case 'device':
        return <ShieldAlert className="h-5 w-5 text-orange-600" />;
      case 'card':
        return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'account':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Get alert status badge
  const getStatusBadge = (status: FraudAlert['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            New Alert
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Resolved
          </span>
        );
      case 'dismissed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Dismissed
          </span>
        );
      default:
        return null;
    }
  };
  
  // Get severity indicator
  const getSeverityIndicator = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></div>
            <span className="text-sm font-medium text-red-800">Critical</span>
          </div>
        );
      case 'high':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1.5"></div>
            <span className="text-sm font-medium text-orange-800">High</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></div>
            <span className="text-sm font-medium text-yellow-800">Medium</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-sm font-medium text-blue-800">Low</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Change alert status
  const updateAlertStatus = (alertId: string, newStatus: FraudAlert['status']) => {
    setAlerts(prev => 
      prev.map(alert => {
        if (alert.id === alertId) {
          return { 
            ...alert, 
            status: newStatus, 
            resolvedAt: ['resolved', 'dismissed'].includes(newStatus) ? new Date() : alert.resolvedAt,
            resolutionDetails: ['resolved', 'dismissed'].includes(newStatus) ? 
              newStatus === 'resolved' ? 'Marked as resolved by agent' : 'Dismissed as false positive by agent' 
              : alert.resolutionDetails
          };
        }
        return alert;
      })
    );
  };
  
  // Format time relative to now
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);
    
    if (diffSec < 60) {
      return 'Just now';
    } else if (diffMin < 60) {
      return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHr < 24) {
      return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-red-50 border-b border-red-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-medium text-red-900">Fraud Alert Center</h2>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-60 pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
              Advanced Filters
            </button>
          </div>
        </div>
        
        {/* Alert statistics */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-red-500 font-medium text-sm">Critical</p>
              <div className="bg-red-100 text-red-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {alerts.filter(a => a.severity === 'critical' && (a.status === 'new' || a.status === 'in-progress')).length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium text-sm">New</p>
              <div className="bg-gray-100 text-gray-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {alerts.filter(a => a.status === 'new').length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium text-sm">In Progress</p>
              <div className="bg-gray-100 text-gray-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {alerts.filter(a => a.status === 'in-progress').length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium text-sm">Resolved Today</p>
              <div className="bg-gray-100 text-gray-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {alerts.filter(a => 
                  (a.status === 'resolved' || a.status === 'dismissed') && 
                  a.resolvedAt && 
                  a.resolvedAt.toDateString() === new Date().toDateString()
                ).length}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">Status:</span>
          </div>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-indigo-100 text-indigo-800 font-medium' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('all')}
          >
            All Alerts
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              filter === 'new' 
                ? 'bg-red-100 text-red-800 font-medium border border-red-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('new')}
          >
            <AlertCircle className="inline-block h-3 w-3 mr-1" />
            New
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              filter === 'in-progress' 
                ? 'bg-blue-100 text-blue-800 font-medium border border-blue-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('in-progress')}
          >
            <Clock className="inline-block h-3 w-3 mr-1" />
            In Progress
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              filter === 'resolved' 
                ? 'bg-green-100 text-green-800 font-medium border border-green-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('resolved')}
          >
            <CheckCircle className="inline-block h-3 w-3 mr-1" />
            Resolved
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              filter === 'dismissed' 
                ? 'bg-gray-600 text-white font-medium border border-gray-700' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setFilter('dismissed')}
          >
            <XCircle className="inline-block h-3 w-3 mr-1" />
            Dismissed
          </button>
          
          <div className="flex items-center ml-4 mr-2">
            <span className="text-xs text-gray-500">Severity:</span>
          </div>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              severityFilter === 'all' 
                ? 'bg-indigo-100 text-indigo-800 font-medium' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSeverityFilter('all')}
          >
            All Severities
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              severityFilter === 'critical' 
                ? 'bg-red-100 text-red-800 font-medium border border-red-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSeverityFilter('critical')}
          >
            Critical
          </button>
          
          <button
            className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap ${
              severityFilter === 'high' 
                ? 'bg-orange-100 text-orange-800 font-medium border border-orange-200' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSeverityFilter('high')}
          >
            High
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading alerts...</span>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Shield className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">No alerts found</h3>
            <p className="text-sm">No fraud alerts match your current filters</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`border rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-200 hover:shadow-sm ${
                  alert.severity === 'critical' && alert.status === 'new' ? 'border-red-300 bg-red-50' :
                  alert.status === 'new' ? 'border-red-200' :
                  alert.status === 'in-progress' ? 'border-blue-200' :
                  alert.status === 'resolved' ? 'border-green-200' :
                  'border-gray-200'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-white shadow-sm">
                      {getAlertTypeIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-0.5">{alert.description}</h3>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              {formatRelativeTime(alert.timestamp)}
                            </span>
                            
                            {alert.accountNumber && (
                              <span className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1" />
                                Account: {alert.accountNumber}
                              </span>
                            )}
                            
                            {alert.cardNumber && (
                              <span className="flex items-center">
                                <CreditCard className="h-3.5 w-3.5 mr-1" />
                                Card: {alert.cardNumber}
                              </span>
                            )}
                            
                            {alert.location && (
                              <span className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {alert.location}
                              </span>
                            )}
                            
                            {alert.amount && (
                              <span className="flex items-center">
                                <DollarSign className="h-3.5 w-3.5 mr-1" />
                                ${alert.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-2 sm:mt-0 sm:ml-4">
                          <div className="mr-3">
                            {getSeverityIndicator(alert.severity)}
                          </div>
                          {getStatusBadge(alert.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded alert details */}
                {expandedAlert === alert.id && (
                  <div className="bg-gray-50 border-t border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Alert Details</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-1">
                          {getAlertDetails(alert).map((detail, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-xs text-gray-500">{detail.label}:</span>
                              <span className="text-xs font-medium text-gray-900">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Assessment</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Risk Score</span>
                              <span className={`text-xs font-medium ${
                                alert.riskScore >= 80 ? 'text-red-600' :
                                alert.riskScore >= 60 ? 'text-orange-600' :
                                alert.riskScore >= 40 ? 'text-yellow-600' :
                                'text-blue-600'
                              }`}>
                                {alert.riskScore}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  alert.riskScore >= 80 ? 'bg-red-500' :
                                  alert.riskScore >= 60 ? 'bg-orange-500' :
                                  alert.riskScore >= 40 ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${alert.riskScore}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* AI-generated risk factors */}
                          <div className="mt-4">
                            <h5 className="text-xs font-medium text-gray-900 mb-2">Risk Factors</h5>
                            <ul className="space-y-1.5">
                              {alert.type === 'transaction' && (
                                <>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.location && alert.location.includes('Russia') || alert.location?.includes('Nigeria') ? 
                                        `Transaction location (${alert.location}) is a high-risk region` :
                                        `Transaction amount (${alert.amount && '$' + alert.amount.toLocaleString()}) is outside normal patterns`
                                      }
                                    </span>
                                  </li>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.severity === 'critical' || alert.severity === 'high' ?
                                        'Multiple transactions in short timeframe' :
                                        'Transaction category unusual for this account'
                                      }
                                    </span>
                                  </li>
                                </>
                              )}
                              
                              {alert.type === 'login' && (
                                <>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.location && alert.location.includes('Russia') || alert.location?.includes('Nigeria') ? 
                                        `Login location (${alert.location}) is a high-risk region` :
                                        'Login attempt from IP address not previously used'
                                      }
                                    </span>
                                  </li>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.severity === 'critical' || alert.severity === 'high' ?
                                        'Multiple failed login attempts before successful login' :
                                        'Login time outside of normal usage patterns'
                                      }
                                    </span>
                                  </li>
                                </>
                              )}
                              
                              {alert.type === 'device' && (
                                <>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.deviceDetails ? 
                                        `New device (${alert.deviceDetails}) added to account` :
                                        'Unusual device characteristics detected'
                                      }
                                    </span>
                                  </li>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.severity === 'critical' || alert.severity === 'high' ?
                                        'Device IP address matches known fraud patterns' :
                                        'Device fingerprint partially matches known suspicious device'
                                      }
                                    </span>
                                  </li>
                                </>
                              )}
                              
                              {alert.type === 'card' && (
                                <>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.severity === 'critical' || alert.severity === 'high' ?
                                        'Card used in multiple locations within short timeframe' :
                                        'Small test transaction detected (common before fraud)'
                                      }
                                    </span>
                                  </li>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.location && alert.location.includes('Russia') || alert.location?.includes('Nigeria') ? 
                                        `Transaction location (${alert.location}) is a high-risk region` :
                                        'Merchant category code is high-risk for fraud'
                                      }
                                    </span>
                                  </li>
                                </>
                              )}
                              
                              {alert.type === 'account' && (
                                <>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      {alert.severity === 'critical' || alert.severity === 'high' ?
                                        'Multiple account setting changes in rapid succession' :
                                        'Contact information changed recently'
                                      }
                                    </span>
                                  </li>
                                  <li className="text-xs flex items-start">
                                    <BadgeInfo className="h-3.5 w-3.5 text-blue-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-gray-600">
                                      'Account accessed from unusual location shortly before changes'
                                    </span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                        
                        {/* Status actions */}
                        {alert.status !== 'resolved' && alert.status !== 'dismissed' && (
                          <div className="mt-3 flex justify-end gap-2">
                            <button 
                              className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => updateAlertStatus(alert.id, 'in-progress')}
                            >
                              <Clock className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" />
                              Investigate
                            </button>
                            
                            <button 
                              className="px-3 py-1.5 text-xs bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 transition-colors"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              <CheckCircle className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" />
                              Resolve
                            </button>
                            
                            <button 
                              className="px-3 py-1.5 text-xs bg-red-50 border border-red-300 rounded text-red-700 hover:bg-red-100 transition-colors"
                              onClick={() => updateAlertStatus(alert.id, 'dismissed')}
                            >
                              <XCircle className="inline-block h-3.5 w-3.5 mr-1 -mt-0.5" />
                              Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Case notes for in-progress alerts */}
                    {alert.status === 'in-progress' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Case Notes</h4>
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          rows={3}
                          placeholder="Add investigation notes here..."
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <button className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
                            Save Notes
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Resolution details for resolved/dismissed alerts */}
                    {(alert.status === 'resolved' || alert.status === 'dismissed') && alert.resolutionDetails && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Resolution</h4>
                        <div className={`p-3 rounded-lg ${
                          alert.status === 'resolved' ? 'bg-green-50 border border-green-100' :
                          'bg-gray-100 border border-gray-200'
                        }`}>
                          <div className="flex items-start">
                            {alert.status === 'resolved' ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                            )}
                            
                            <div>
                              <p className="text-sm font-medium">
                                {alert.status === 'resolved' ? 'Alert Resolved' : 'Alert Dismissed'}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">{alert.resolutionDetails}</p>
                              
                              {alert.resolvedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatRelativeTime(alert.resolvedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action history (would be populated in a real app) */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Eye className="h-4 w-4 text-gray-500 mr-1.5" />
                        Activity Log
                      </h4>
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 mr-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-900">Alert created</p>
                              <p className="text-xs text-gray-500">{alert.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {alert.status !== 'new' && (
                            <div className="flex items-start">
                              <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 mr-1.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-gray-900">Status changed to {alert.status}</p>
                                <p className="text-xs text-gray-500">{(alert.resolvedAt || new Date()).toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAlertDashboard;