import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Clock, 
  Eye,
  FileText,
  UserCheck,
  Banknote,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  Gauge,
  HelpCircle,
  AlignJustify
} from 'lucide-react';

interface ComplianceCheck {
  id: string;
  customerId: string;
  customerName: string;
  checkType: 'kyc' | 'aml' | 'fraud' | 'sanctions' | 'pep' | 'identity';
  status: 'passed' | 'failed' | 'pending-review' | 'in-progress';
  timestamp: Date;
  riskScore: number; // 0-100
  details: string;
  flags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  workflow: 'account-opening' | 'credit-card' | 'loan';
}

// Generate mock compliance checks
const generateMockChecks = (): ComplianceCheck[] => {
  const checkTypes: Array<ComplianceCheck['checkType']> = ['kyc', 'aml', 'fraud', 'sanctions', 'pep', 'identity'];
  const statuses: Array<ComplianceCheck['status']> = ['passed', 'failed', 'pending-review', 'in-progress'];
  const workflows: Array<ComplianceCheck['workflow']> = ['account-opening', 'credit-card', 'loan'];
  const names = [
    'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Lee', 
    'Michael Chen', 'Emily Wilson', 'James Brown', 'Robert Kim'
  ];
  
  const flags = [
    {
      type: 'identity',
      severity: 'high' as const,
      description: 'Multiple identity documents associated with different names'
    },
    {
      type: 'sanctions',
      severity: 'high' as const,
      description: 'Partial name match with sanctioned individual'
    },
    {
      type: 'transaction',
      severity: 'medium' as const,
      description: 'Unusual transaction patterns detected'
    },
    {
      type: 'address',
      severity: 'low' as const,
      description: 'Address verification could not be completed'
    },
    {
      type: 'credit',
      severity: 'medium' as const,
      description: 'Credit history shows recent defaults'
    },
    {
      type: 'document',
      severity: 'medium' as const,
      description: 'Document tampering suspected'
    }
  ];
  
  const getRandomFlags = (min = 0, max = 2) => {
    const numFlags = Math.floor(Math.random() * (max - min + 1)) + min;
    const selectedFlags = [];
    
    // Create a copy of flags to shuffle
    const shuffledFlags = [...flags].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numFlags; i++) {
      if (i < shuffledFlags.length) {
        selectedFlags.push(shuffledFlags[i]);
      }
    }
    
    return selectedFlags;
  };
  
  const mockChecks: ComplianceCheck[] = [];
  
  // Create some recent checks
  for (let i = 0; i < 20; i++) {
    const checkType = checkTypes[Math.floor(Math.random() * checkTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const riskScore = status === 'passed' 
      ? Math.floor(Math.random() * 30) 
      : status === 'pending-review'
        ? 30 + Math.floor(Math.random() * 40)
        : 70 + Math.floor(Math.random() * 30);
    
    // More flags for higher risk scores
    const checkFlags = status === 'passed'
      ? getRandomFlags(0, 1)
      : status === 'pending-review'
        ? getRandomFlags(1, 2)
        : getRandomFlags(1, 3);
    
    mockChecks.push({
      id: `check-${i}`,
      customerId: `cust-${i}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      checkType,
      status,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Within last week
      riskScore,
      details: `${checkType.toUpperCase()} check ${status} for customer application`,
      flags: checkFlags,
      workflow: workflows[Math.floor(Math.random() * workflows.length)]
    });
  }
  
  // Sort by timestamp, most recent first
  return mockChecks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const ComplianceDashboard: React.FC = () => {
  const { auditTrail, kycResult } = useBankingContext();
  const [checks, setChecks] = useState<ComplianceCheck[]>(generateMockChecks());
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Add any real KYC result to the list of checks
  useEffect(() => {
    if (kycResult && !checks.some(check => check.customerId === kycResult.customerId)) {
      const newCheck: ComplianceCheck = {
        id: `real-check-${Date.now()}`,
        customerId: kycResult.customerId,
        customerName: 'Current Customer',
        checkType: 'kyc',
        status: kycResult.status as any,
        timestamp: kycResult.checkDate,
        riskScore: kycResult.riskScore * 100,
        details: `KYC check ${kycResult.status} with risk score ${(kycResult.riskScore * 100).toFixed(0)}`,
        flags: kycResult.flags.map(flag => ({
          type: flag.type,
          severity: flag.severity,
          description: flag.description
        })),
        workflow: 'account-opening'
      };
      
      setChecks(prev => [newCheck, ...prev]);
    }
  }, [kycResult]);
  
  // Monitor audit trail to potentially add new checks
  useEffect(() => {
    if (auditTrail.length > 0) {
      const latestEvent = auditTrail[auditTrail.length - 1];
      
      // If there's a KYC or document verification event, simulate a new check
      if (latestEvent.event.includes('KYC') || 
          latestEvent.event.includes('Verification') || 
          latestEvent.event.includes('Document')) {
        
        // Give a brief loading indicator
        setIsLoading(true);
        
        setTimeout(() => {
          const checkTypes: Array<ComplianceCheck['checkType']> = ['kyc', 'aml', 'fraud', 'sanctions', 'pep', 'identity'];
          const checkType = checkTypes[Math.floor(Math.random() * checkTypes.length)];
          
          // 80% pass rate
          const willPass = Math.random() < 0.8;
          const status: ComplianceCheck['status'] = willPass ? 'passed' : Math.random() < 0.5 ? 'pending-review' : 'failed';
          
          // Risk score based on status
          const riskScore = status === 'passed' 
            ? Math.floor(Math.random() * 30) 
            : status === 'pending-review'
              ? 30 + Math.floor(Math.random() * 40)
              : 70 + Math.floor(Math.random() * 30);
          
          // Generate some flags based on the event
          const checkFlags = [];
          
          if (latestEvent.event.includes('Document')) {
            if (!willPass) {
              checkFlags.push({
                type: 'document',
                severity: status === 'failed' ? 'high' as const : 'medium' as const,
                description: 'Document verification issues detected'
              });
            }
          }
          
          if (latestEvent.event.includes('KYC')) {
            if (!willPass) {
              checkFlags.push({
                type: 'identity',
                severity: status === 'failed' ? 'high' as const : 'medium' as const,
                description: 'Identity verification requires additional review'
              });
            }
          }
          
          // Add a random flag if we don't have any yet
          if (checkFlags.length === 0 && !willPass) {
            checkFlags.push({
              type: ['sanctions', 'address', 'pep', 'fraud'][Math.floor(Math.random() * 4)],
              severity: status === 'failed' ? 'high' as const : 'medium' as const,
              description: 'Verification issue requires manual review'
            });
          }
          
          const newCheck: ComplianceCheck = {
            id: `check-${Date.now()}`,
            customerId: `cust-new-${Date.now()}`,
            customerName: 'Current Customer',
            checkType,
            status,
            timestamp: new Date(),
            riskScore,
            details: `${checkType.toUpperCase()} check ${status}`,
            flags: checkFlags,
            workflow: 'account-opening'
          };
          
          setChecks(prev => [newCheck, ...prev]);
          setIsLoading(false);
        }, 2000);
      }
    }
  }, [auditTrail]);
  
  // Filter checks based on selected filters
  const filteredChecks = checks.filter(check => {
    // Filter by check type
    if (filter !== 'all' && check.checkType !== filter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && check.status !== statusFilter) {
      return false;
    }
    
    // Search by name or ID
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        check.customerName.toLowerCase().includes(query) ||
        check.customerId.toLowerCase().includes(query) ||
        check.details.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle expanding/collapsing a check
  const toggleCheck = (checkId: string) => {
    if (expandedCheck === checkId) {
      setExpandedCheck(null);
    } else {
      setExpandedCheck(checkId);
    }
  };
  
  // Get icon for check type
  const getCheckIcon = (type: ComplianceCheck['checkType']) => {
    switch (type) {
      case 'kyc':
        return <UserCheck className="h-5 w-5 text-indigo-600" />;
      case 'aml':
        return <Banknote className="h-5 w-5 text-blue-600" />;
      case 'fraud':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'sanctions':
        return <Shield className="h-5 w-5 text-purple-600" />;
      case 'pep':
        return <UserCheck className="h-5 w-5 text-pink-600" />;
      case 'identity':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Get status badge class
  const getStatusClass = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending-review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get risk level class
  const getRiskClass = (score: number) => {
    if (score < 30) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (score < 70) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      return 'bg-red-100 text-red-800 border-red-200';
    }
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>;
      case 'medium':
        return <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>;
      case 'high':
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></div>;
    }
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-indigo-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">GRC & Compliance Dashboard</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            className="px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => setChecks(generateMockChecks())}
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Refresh
          </button>
          
          <button className="px-3 py-1.5 text-sm rounded-md border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center">
            <AlignJustify className="h-4 w-4 mr-1.5" />
            Reports
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search customer or check ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-xs text-gray-600 mr-2">Type:</span>
            </div>
            
            <div className="flex space-x-1 overflow-x-auto">
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All Checks
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'kyc' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('kyc')}
              >
                KYC
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'aml' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('aml')}
              >
                AML
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'fraud' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('fraud')}
              >
                Fraud
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'sanctions' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('sanctions')}
              >
                Sanctions
              </button>
            </div>
            
            <div className="hidden md:flex items-center ml-3">
              <span className="text-xs text-gray-600 mr-2">Status:</span>
              
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    statusFilter === 'all' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    statusFilter === 'passed' 
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('passed')}
                >
                  Passed
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    statusFilter === 'failed' 
                      ? 'bg-red-100 text-red-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('failed')}
                >
                  Failed
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    statusFilter === 'pending-review' 
                      ? 'bg-amber-100 text-amber-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('pending-review')}
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Risk summary banner */}
      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="col-span-1 md:col-span-2 flex items-center">
            <Gauge className="h-5 w-5 text-indigo-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-indigo-900">Overall System Risk</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2 max-w-xs">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full" 
                    style={{ width: '16%' }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-indigo-700">Low (16%)</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 col-span-2 gap-2">
            <div className="bg-white rounded-md p-2 border border-indigo-100">
              <p className="text-xs text-gray-500 mb-1">Failed Checks</p>
              <p className="text-sm font-medium text-red-600">
                {checks.filter(c => c.status === 'failed').length}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 border border-indigo-100">
              <p className="text-xs text-gray-500 mb-1">Pending Review</p>
              <p className="text-sm font-medium text-amber-600">
                {checks.filter(c => c.status === 'pending-review').length}
              </p>
            </div>
            <div className="bg-white rounded-md p-2 border border-indigo-100">
              <p className="text-xs text-gray-500 mb-1">High Risk Flags</p>
              <p className="text-sm font-medium text-gray-900">
                {checks.reduce((count, check) => 
                  count + check.flags.filter(f => f.severity === 'high').length, 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        {isLoading && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 flex items-center">
            <div className="mr-3 flex-shrink-0">
              <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Processing compliance checks...</p>
              <p className="text-xs text-blue-600">
                Running automated verification against watchlists and regulatory databases
              </p>
            </div>
          </div>
        )}
        
        {filteredChecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No compliance checks found</h3>
            <p className="text-sm text-gray-500">
              No checks match your current filters or search criteria
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChecks.map((check) => (
              <div 
                key={check.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-200 hover:shadow-sm"
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleCheck(check.id)}
                >
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 mr-4 flex items-center justify-center">
                      {getCheckIcon(check.checkType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 flex items-center">
                            <span className="truncate">{check.customerName}</span>
                            <span className="mx-1.5 text-gray-500">•</span>
                            <span className="text-gray-500">{check.customerId}</span>
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 truncate">
                            {check.details}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex flex-col items-end">
                          <div className="flex items-center">
                            <div className={`px-2.5 py-0.5 rounded-md text-xs border ${getStatusClass(check.status)}`}>
                              {check.status === 'passed' && <CheckCircle2 className="h-3 w-3 mr-1 inline-block" />}
                              {check.status === 'failed' && <XCircle className="h-3 w-3 mr-1 inline-block" />}
                              {check.status === 'pending-review' && <Eye className="h-3 w-3 mr-1 inline-block" />}
                              {check.status === 'in-progress' && <Clock className="h-3 w-3 mr-1 inline-block" />}
                              
                              {check.status === 'passed' && 'Passed'}
                              {check.status === 'failed' && 'Failed'}
                              {check.status === 'pending-review' && 'Review Required'}
                              {check.status === 'in-progress' && 'In Progress'}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-1">
                            <div className={`px-2 py-0.5 rounded-md text-xs border ${getRiskClass(check.riskScore)}`}>
                              Risk: {check.riskScore.toFixed(0)}%
                            </div>
                            
                            <div className="bg-gray-100 px-2 py-0.5 rounded-md text-xs border border-gray-200 text-gray-700 capitalize">
                              {check.workflow.replace('-', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Flag summary */}
                      {check.flags.length > 0 && (
                        <div className="flex items-center mt-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mr-1" />
                          <span className="text-xs text-amber-700">
                            {check.flags.length} flag{check.flags.length === 1 ? '' : 's'} detected
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {expandedCheck === check.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded view */}
                {expandedCheck === check.id && (
                  <div className="bg-gray-50 border-t border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Risk score and details */}
                      <div className="md:col-span-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Risk Assessment</h4>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Risk Score</span>
                            <span className="text-sm font-medium text-gray-900">{check.riskScore.toFixed(0)}%</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                            <div 
                              className={`h-2.5 rounded-full ${
                                check.riskScore < 30 ? 'bg-green-500' :
                                check.riskScore < 70 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${check.riskScore}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Check Details</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Check Type</span>
                              <span className="text-xs font-medium text-gray-900 uppercase">{check.checkType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Workflow</span>
                              <span className="text-xs font-medium text-gray-900 capitalize">{check.workflow.replace('-', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Date & Time</span>
                              <span className="text-xs font-medium text-gray-900">{check.timestamp.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Status</span>
                              <span className={`text-xs font-medium ${
                                check.status === 'passed' ? 'text-green-600' :
                                check.status === 'failed' ? 'text-red-600' :
                                check.status === 'pending-review' ? 'text-amber-600' :
                                'text-blue-600'
                              }`}>
                                {check.status === 'passed' && 'Passed'}
                                {check.status === 'failed' && 'Failed'}
                                {check.status === 'pending-review' && 'Review Required'}
                                {check.status === 'in-progress' && 'In Progress'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Flags and compliance details */}
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Detected Flags & Compliance Details
                        </h4>
                        
                        {check.flags.length === 0 ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-green-800">No compliance issues detected</p>
                              <p className="text-xs text-green-700 mt-0.5">
                                This check passed all compliance verifications
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {check.flags.map((flag, index) => (
                              <div 
                                key={index}
                                className={`rounded-lg border p-3 ${
                                  flag.severity === 'high' ? 'bg-red-50 border-red-200' :
                                  flag.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                                  'bg-blue-50 border-blue-200'
                                }`}
                              >
                                <div className="flex items-center mb-2">
                                  {flag.severity === 'high' && <AlertTriangle className="h-4 w-4 text-red-500 mr-1.5" />}
                                  {flag.severity === 'medium' && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />}
                                  {flag.severity === 'low' && <Info className="h-4 w-4 text-blue-500 mr-1.5" />}
                                  
                                  <h5 className={`text-sm font-medium ${
                                    flag.severity === 'high' ? 'text-red-800' :
                                    flag.severity === 'medium' ? 'text-amber-800' :
                                    'text-blue-800'
                                  } capitalize`}>
                                    {flag.type} Flag - {flag.severity.toUpperCase()} Risk
                                  </h5>
                                </div>
                                
                                <p className={`text-sm ${
                                  flag.severity === 'high' ? 'text-red-700' :
                                  flag.severity === 'medium' ? 'text-amber-700' :
                                  'text-blue-700'
                                }`}>
                                  {flag.description}
                                </p>
                                
                                {/* Recommendation/action for the flag */}
                                <div className={`mt-3 pt-2 text-xs ${
                                  flag.severity === 'high' 
                                    ? 'border-t border-red-200 text-red-700' 
                                    : flag.severity === 'medium'
                                      ? 'border-t border-amber-200 text-amber-700'
                                      : 'border-t border-blue-200 text-blue-700'
                                }`}>
                                  <p className="font-medium mb-1">Recommended Action:</p>
                                  {flag.severity === 'high' && (
                                    <p>Manual review required by compliance officer. Customer application should be placed on hold until resolved.</p>
                                  )}
                                  {flag.severity === 'medium' && (
                                    <p>Additional verification recommended. Request supporting documentation from customer.</p>
                                  )}
                                  {flag.severity === 'low' && (
                                    <p>Monitor for additional patterns. No immediate action required.</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            {/* AI decision explanation */}
                            {check.status !== 'in-progress' && (
                              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                  <BrainCog className="h-5 w-5 text-indigo-600 mr-2" />
                                  <h5 className="text-sm font-medium text-indigo-900">
                                    AI Decision Explanation
                                  </h5>
                                </div>
                                
                                <p className="text-sm text-indigo-700 mb-3">
                                  {check.status === 'passed' && (
                                    "The compliance check was successful with a low risk score, indicating no significant concerns were identified. The customer's information was verified against regulatory databases with no matches, and all identity verification steps were completed successfully."
                                  )}
                                  {check.status === 'failed' && (
                                    `This check failed due to ${check.flags.length} detected flag${check.flags.length === 1 ? '' : 's'} that indicate high-risk patterns. These issues violate regulatory requirements and must be addressed before proceeding.`
                                  )}
                                  {check.status === 'pending-review' && (
                                    `This check flagged medium-risk concerns that require human verification. While the system cannot definitively determine a pass/fail result, the ${check.flags.length} flag${check.flags.length === 1 ? '' : 's'} indicate potential issues that should be reviewed by a compliance officer.`
                                  )}
                                </p>
                                
                                <p className="text-xs text-indigo-600">
                                  Compliance checks performed in accordance with AML/KYC regulations and internal risk policies.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                      <button className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        View All Details
                      </button>
                      
                      {check.status === 'pending-review' && (
                        <>
                          <button className="px-3 py-1.5 text-xs border border-green-300 rounded text-green-700 bg-green-50 hover:bg-green-100 flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </button>
                          <button className="px-3 py-1.5 text-xs border border-red-300 rounded text-red-700 bg-red-50 hover:bg-red-100 flex items-center">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {check.status === 'failed' && (
                        <button className="px-3 py-1.5 text-xs border border-indigo-300 rounded text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center">
                          <HelpCircle className="h-3.5 w-3.5 mr-1" />
                          Request More Info
                        </button>
                      )}
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

export default ComplianceDashboard;