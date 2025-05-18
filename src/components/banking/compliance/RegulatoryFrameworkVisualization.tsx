import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Shield, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  CreditCard, 
  Landmark, 
  Search,
  Eye,
  Lock,
  FileQuestion,
  Scale,
  Building,
  BookOpen,
  Fingerprint,
  PieChart
} from 'lucide-react';

// Define regulation types
interface Regulation {
  id: string;
  name: string;
  description: string;
  authority: string;
  category: 'kyc' | 'aml' | 'lending' | 'privacy' | 'consumer-protection' | 'operations';
  icon: React.ReactNode;
}

interface RegulationComplianceStatus {
  regulationId: string;
  status: 'compliant' | 'non-compliant' | 'partially-compliant' | 'not-applicable';
  details: string;
  lastChecked: Date;
  nextReview?: Date;
}

// Dummy regulatory frameworks
const regulations: Regulation[] = [
  {
    id: 'bsa-aml',
    name: 'BSA/AML Compliance',
    description: 'Bank Secrecy Act & Anti-Money Laundering regulations requiring customer due diligence and suspicious activity reporting',
    authority: 'FinCEN',
    category: 'aml',
    icon: <Shield />
  },
  {
    id: 'kyc',
    name: 'Know Your Customer',
    description: 'Customer identification and verification requirements to prevent identity fraud and financial crimes',
    authority: 'FinCEN/OCC',
    category: 'kyc',
    icon: <User />
  },
  {
    id: 'ecoa',
    name: 'Equal Credit Opportunity Act',
    description: 'Prohibits lending discrimination based on race, color, religion, national origin, sex, marital status, age, or receipt of public assistance',
    authority: 'CFPB',
    category: 'lending',
    icon: <Scale />
  },
  {
    id: 'fcra',
    name: 'Fair Credit Reporting Act',
    description: 'Regulates the collection, dissemination, and use of consumer credit information',
    authority: 'CFPB',
    category: 'lending',
    icon: <FileText />
  },
  {
    id: 'reg-dd',
    name: 'Regulation DD (TISA)',
    description: 'Truth in Savings Act requirements for disclosing fees, interest rates, and terms of deposit accounts',
    authority: 'Federal Reserve',
    category: 'consumer-protection',
    icon: <BookOpen />
  },
  {
    id: 'reg-e',
    name: 'Regulation E (EFTA)',
    description: 'Electronic Fund Transfer Act governing consumer electronic banking transactions',
    authority: 'CFPB',
    category: 'operations',
    icon: <CreditCard />
  },
  {
    id: 'reg-z',
    name: 'Regulation Z (TILA)',
    description: 'Truth in Lending Act requirements for disclosure of credit terms and consumer protections',
    authority: 'CFPB',
    category: 'lending',
    icon: <Landmark />
  },
  {
    id: 'glba',
    name: 'Gramm-Leach-Bliley Act',
    description: 'Requires financial institutions to explain information-sharing practices and protect sensitive customer data',
    authority: 'FTC/Federal Reserve/FDIC',
    category: 'privacy',
    icon: <Lock />
  },
  {
    id: 'udaap',
    name: 'UDAAP',
    description: 'Prohibition against Unfair, Deceptive, or Abusive Acts or Practices in consumer financial services',
    authority: 'CFPB',
    category: 'consumer-protection',
    icon: <AlertTriangle />
  },
  {
    id: 'cip',
    name: 'Customer Identification Program',
    description: 'Requirements to verify the identity of individuals who open accounts',
    authority: 'FinCEN',
    category: 'kyc',
    icon: <Fingerprint />
  }
];

interface RegulatoryFrameworkVisualizationProps {
  filterByCategory?: string;
  filterByStatus?: string;
}

const RegulatoryFrameworkVisualization: React.FC<RegulatoryFrameworkVisualizationProps> = ({
  filterByCategory,
  filterByStatus
}) => {
  const { mode, customer, bankAccount, creditCard, loan, kycResult } = useBankingContext();
  const [complianceStatus, setComplianceStatus] = useState<RegulationComplianceStatus[]>([]);
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(filterByCategory || null);
  const [statusFilter, setStatusFilter] = useState<string | null>(filterByStatus || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Generate compliance status based on the current state
  useEffect(() => {
    // Determine compliance based on existing data
    const status: RegulationComplianceStatus[] = [];
    
    // BSA/AML Compliance
    status.push({
      regulationId: 'bsa-aml',
      status: kycResult?.status === 'passed' ? 'compliant' : 
              kycResult?.status === 'failed' ? 'non-compliant' : 
              kycResult ? 'partially-compliant' : 'not-applicable',
      details: kycResult 
        ? `AML check ${kycResult.status} with risk score of ${(kycResult.riskScore * 100).toFixed(0)}%` 
        : 'No AML check performed yet',
      lastChecked: kycResult?.checkDate || new Date(),
    });
    
    // KYC Compliance
    status.push({
      regulationId: 'kyc',
      status: kycResult?.status === 'passed' ? 'compliant' : 
              kycResult?.status === 'failed' ? 'non-compliant' : 
              kycResult ? 'partially-compliant' : 'not-applicable',
      details: kycResult 
        ? `KYC verification ${kycResult.status} with ${kycResult.flags.length} flag(s)` 
        : 'No KYC verification performed yet',
      lastChecked: kycResult?.checkDate || new Date(),
    });
    
    // Customer Identification Program
    status.push({
      regulationId: 'cip',
      status: customer && kycResult?.status === 'passed' ? 'compliant' :
              customer ? 'partially-compliant' : 'not-applicable',
      details: customer 
        ? 'Customer identity verified against CIP requirements' 
        : 'No customer identity information to verify',
      lastChecked: customer ? new Date() : new Date(),
    });
    
    // ECOA Compliance
    status.push({
      regulationId: 'ecoa',
      status: (creditCard || loan) ? 'compliant' : 'not-applicable',
      details: (creditCard || loan) 
        ? 'Lending decisions made without discriminatory factors' 
        : 'No lending products to evaluate',
      lastChecked: new Date(),
    });
    
    // FCRA Compliance
    status.push({
      regulationId: 'fcra',
      status: (creditCard || loan) ? 'compliant' : 'not-applicable',
      details: (creditCard || loan) 
        ? 'Credit reporting procedures follow FCRA requirements' 
        : 'No credit products to evaluate',
      lastChecked: new Date(),
    });
    
    // Reg DD Compliance
    status.push({
      regulationId: 'reg-dd',
      status: bankAccount ? 'compliant' : 'not-applicable',
      details: bankAccount 
        ? 'Account disclosures meet Truth in Savings Act requirements' 
        : 'No deposit accounts to evaluate',
      lastChecked: bankAccount ? bankAccount.openedAt : new Date(),
    });
    
    // Reg E Compliance
    status.push({
      regulationId: 'reg-e',
      status: bankAccount ? 'compliant' : 'not-applicable',
      details: bankAccount 
        ? 'Electronic fund transfer policies follow Regulation E' 
        : 'No electronic fund transfers to evaluate',
      lastChecked: new Date(),
    });
    
    // Reg Z Compliance
    status.push({
      regulationId: 'reg-z',
      status: (creditCard || loan) ? 'compliant' : 'not-applicable',
      details: (creditCard || loan) 
        ? 'Truth in Lending disclosures provided for all credit products' 
        : 'No credit products to evaluate',
      lastChecked: new Date(),
    });
    
    // GLBA Compliance
    status.push({
      regulationId: 'glba',
      status: customer ? 'compliant' : 'not-applicable',
      details: customer 
        ? 'Privacy notices and data protection measures in place' 
        : 'No customer data to protect',
      lastChecked: new Date(),
    });
    
    // UDAAP Compliance
    status.push({
      regulationId: 'udaap',
      status: (bankAccount || creditCard || loan) ? 'compliant' : 'not-applicable',
      details: (bankAccount || creditCard || loan) 
        ? 'Products and services follow UDAAP guidelines' 
        : 'No products or services to evaluate',
      lastChecked: new Date(),
    });
    
    setComplianceStatus(status);
  }, [customer, bankAccount, creditCard, loan, kycResult, mode]);
  
  // Get filtered regulations
  const getFilteredRegulations = () => {
    return regulations.filter(reg => {
      // Filter by category if selected
      if (categoryFilter && reg.category !== categoryFilter) return false;
      
      // Filter by compliance status if selected
      if (statusFilter) {
        const regStatus = complianceStatus.find(s => s.regulationId === reg.id);
        if (!regStatus || regStatus.status !== statusFilter) return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return reg.name.toLowerCase().includes(query) || 
               reg.description.toLowerCase().includes(query) ||
               reg.authority.toLowerCase().includes(query);
      }
      
      return true;
    });
  };
  
  const filteredRegulations = getFilteredRegulations();
  
  // Get compliance status for a regulation
  const getComplianceStatus = (regulationId: string) => {
    return complianceStatus.find(status => status.regulationId === regulationId) || {
      regulationId,
      status: 'not-applicable',
      details: 'Not evaluated',
      lastChecked: new Date()
    };
  };
  
  // Get status badge for a compliance status
  const getStatusBadge = (status: RegulationComplianceStatus['status']) => {
    switch(status) {
      case 'compliant':
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Compliant
          </span>
        );
      case 'non-compliant':
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Non-Compliant
          </span>
        );
      case 'partially-compliant':
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partially Compliant
          </span>
        );
      case 'not-applicable':
        return (
          <span className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FileQuestion className="h-3 w-3 mr-1" />
            N/A
          </span>
        );
    }
  };
  
  // Get compliance counts by status
  const getComplianceCounts = () => {
    return {
      compliant: complianceStatus.filter(s => s.status === 'compliant').length,
      nonCompliant: complianceStatus.filter(s => s.status === 'non-compliant').length,
      partiallyCompliant: complianceStatus.filter(s => s.status === 'partially-compliant').length,
      notApplicable: complianceStatus.filter(s => s.status === 'not-applicable').length,
      total: complianceStatus.length
    };
  };
  
  const counts = getComplianceCounts();
  
  // Get category icon
  const getCategoryIcon = (category: Regulation['category']) => {
    switch(category) {
      case 'kyc':
        return <User className="h-4 w-4 text-indigo-600" />;
      case 'aml':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'lending':
        return <Landmark className="h-4 w-4 text-green-600" />;
      case 'privacy':
        return <Lock className="h-4 w-4 text-red-600" />;
      case 'consumer-protection':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'operations':
        return <Building className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="flex items-center text-lg font-medium text-gray-900">
          <Shield className="h-5 w-5 text-indigo-600 mr-2" />
          Regulatory Framework & Compliance
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Visualization of how banking operations comply with regulatory requirements
        </p>
      </div>
      
      <div className="p-6">
        {/* Compliance summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <PieChart className="h-4 w-4 text-indigo-600 mr-1.5" />
              Compliance Status Summary
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex">
                <div className="relative w-24 h-24">
                  {/* Circular progress with multiple segments */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      className="text-gray-200"
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                    />
                    
                    {/* Calculate stroke dash array and offsets for each segment */}
                    {counts.total > 0 && (
                      <>
                        {/* Compliant segment (green) */}
                        {counts.compliant > 0 && (
                          <circle
                            className="text-green-500"
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(counts.compliant / counts.total) * 251.2} 251.2`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        )}
                        
                        {/* Partially compliant segment (amber) */}
                        {counts.partiallyCompliant > 0 && (
                          <circle
                            className="text-amber-500"
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(counts.partiallyCompliant / counts.total) * 251.2} 251.2`}
                            strokeDashoffset={`${-1 * (counts.compliant / counts.total) * 251.2}`}
                            transform="rotate(-90 50 50)"
                          />
                        )}
                        
                        {/* Non-compliant segment (red) */}
                        {counts.nonCompliant > 0 && (
                          <circle
                            className="text-red-500"
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(counts.nonCompliant / counts.total) * 251.2} 251.2`}
                            strokeDashoffset={`${-1 * ((counts.compliant + counts.partiallyCompliant) / counts.total) * 251.2}`}
                            transform="rotate(-90 50 50)"
                          />
                        )}
                      </>
                    )}
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900">
                    <span className="text-sm font-medium">{counts.total}</span>
                    <span className="text-xs">Total</span>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col justify-center space-y-1.5">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1.5"></div>
                    <span className="text-sm">{counts.compliant} Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1.5"></div>
                    <span className="text-sm">{counts.partiallyCompliant} Partial</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></div>
                    <span className="text-sm">{counts.nonCompliant} Non-Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-1.5"></div>
                    <span className="text-sm">{counts.notApplicable} N/A</span>
                  </div>
                </div>
              </div>
              
              <div className="border-l pl-4 border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Overall Status</h5>
                
                {counts.nonCompliant > 0 ? (
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Action Required</p>
                        <p className="text-xs text-red-700 mt-1">
                          Compliance issues require immediate attention
                        </p>
                      </div>
                    </div>
                  </div>
                ) : counts.partiallyCompliant > 0 ? (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Review Needed</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Some compliance areas need verification
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Fully Compliant</p>
                        <p className="text-xs text-green-700 mt-1">
                          All applicable regulations are in compliance
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Filter Regulations</h4>
            
            {/* Search box */}
            <div className="mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search regulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category filters */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Filter by Category:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 rounded-full text-xs ${
                    categoryFilter === null 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter(null)}
                >
                  All Categories
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    categoryFilter === 'kyc' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('kyc')}
                >
                  <User className="h-3 w-3 mr-1" />
                  KYC
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    categoryFilter === 'aml' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('aml')}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  AML
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    categoryFilter === 'lending' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('lending')}
                >
                  <Landmark className="h-3 w-3 mr-1" />
                  Lending
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    categoryFilter === 'privacy' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('privacy')}
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Privacy
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    categoryFilter === 'consumer-protection' 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('consumer-protection')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Consumer Protection
                </button>
              </div>
            </div>
            
            {/* Status filters */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Filter by Status:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusFilter === null 
                      ? 'bg-indigo-100 text-indigo-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter(null)}
                >
                  All Statuses
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    statusFilter === 'compliant' 
                      ? 'bg-green-100 text-green-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('compliant')}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Compliant
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    statusFilter === 'partially-compliant' 
                      ? 'bg-amber-100 text-amber-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('partially-compliant')}
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Partially Compliant
                </button>
                
                <button
                  className={`px-2 py-1 rounded-full text-xs flex items-center ${
                    statusFilter === 'non-compliant' 
                      ? 'bg-red-100 text-red-800 font-medium' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setStatusFilter('non-compliant')}
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Non-Compliant
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Regulations list */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Regulatory Framework</h4>
          
          {filteredRegulations.length === 0 ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
              <FileQuestion className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h5 className="text-gray-900 font-medium mb-1">No matching regulations</h5>
              <p className="text-sm text-gray-600">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRegulations.map(regulation => {
                const complianceData = getComplianceStatus(regulation.id);
                
                return (
                  <div 
                    key={regulation.id} 
                    className={`border rounded-lg overflow-hidden transition-all ${
                      selectedRegulation === regulation.id 
                        ? 'ring-2 ring-indigo-300 border-indigo-300' 
                        : 'hover:border-indigo-200 border-gray-200'
                    }`}
                  >
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setSelectedRegulation(
                        selectedRegulation === regulation.id ? null : regulation.id
                      )}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                            {regulation.icon}
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-1">{regulation.name}</h5>
                            <p className="text-xs text-gray-600 line-clamp-2">{regulation.description}</p>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          {getStatusBadge(complianceData.status)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {selectedRegulation === regulation.id && (
                      <div className="p-4 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-xs font-medium text-gray-900 mb-2">Regulation Details</h6>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Regulatory Authority:</span>
                                <span className="font-medium text-gray-900">{regulation.authority}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-medium text-gray-900 capitalize">{regulation.category.replace('-', ' ')}</span>
                              </div>
                              <div className="flex items-start">
                                <span className="text-gray-500 mr-4">Description:</span>
                                <span className="text-gray-900">{regulation.description}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h6 className="text-xs font-medium text-gray-900 mb-2">Compliance Status</h6>
                            <div className={`p-3 rounded-lg ${
                              complianceData.status === 'compliant' ? 'bg-green-50 border border-green-100' :
                              complianceData.status === 'non-compliant' ? 'bg-red-50 border border-red-100' :
                              complianceData.status === 'partially-compliant' ? 'bg-amber-50 border border-amber-100' :
                              'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex">
                                {complianceData.status === 'compliant' && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                {complianceData.status === 'non-compliant' && (
                                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                {complianceData.status === 'partially-compliant' && (
                                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                {complianceData.status === 'not-applicable' && (
                                  <FileQuestion className="h-4 w-4 text-gray-600 mt-0.5 mr-2 flex-shrink-0" />
                                )}
                                
                                <div>
                                  <p className={`text-sm font-medium ${
                                    complianceData.status === 'compliant' ? 'text-green-800' :
                                    complianceData.status === 'non-compliant' ? 'text-red-800' :
                                    complianceData.status === 'partially-compliant' ? 'text-amber-800' :
                                    'text-gray-800'
                                  }`}>
                                    {complianceData.status === 'compliant' ? 'Compliant' :
                                     complianceData.status === 'non-compliant' ? 'Non-Compliant' :
                                     complianceData.status === 'partially-compliant' ? 'Partially Compliant' :
                                     'Not Applicable'}
                                  </p>
                                  <p className="text-xs mt-1">
                                    {complianceData.details}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500">Last Checked:</span>
                                  <span>{formatDate(complianceData.lastChecked)}</span>
                                </div>
                                
                                {complianceData.nextReview && (
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-gray-500">Next Review:</span>
                                    <span>{formatDate(complianceData.nextReview)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {complianceData.status === 'non-compliant' && (
                              <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-100 flex">
                                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-xs text-red-700">
                                  Action required: Compliance issue must be addressed immediately
                                </p>
                              </div>
                            )}
                            
                            {complianceData.status === 'partially-compliant' && (
                              <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-100 flex">
                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                                <p className="text-xs text-amber-700">
                                  Follow-up needed: Additional verification required
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegulatoryFrameworkVisualization;