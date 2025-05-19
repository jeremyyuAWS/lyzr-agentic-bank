import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BarChart3, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  CreditCard, 
  Repeat, 
  Flag, 
  Clock 
} from 'lucide-react';

// Transaction types
interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'debit' | 'credit' | 'transfer' | 'withdrawal' | 'deposit';
  category: string;
  status: 'normal' | 'flagged' | 'suspicious' | 'verified';
  accountNumber: string;
  merchantCategory?: string;
  location?: string;
  ipAddress?: string;
  deviceId?: string;
  riskScore: number; // 0-100
  fraudProbability: number; // 0-100
  flags?: string[];
}

// Generate mock transactions
const generateMockTransactions = (count: number = 100): Transaction[] => {
  const transactionTypes: Transaction['type'][] = ['debit', 'credit', 'transfer', 'withdrawal', 'deposit'];
  const statuses: Transaction['status'][] = ['normal', 'flagged', 'suspicious', 'verified'];
  const merchants = [
    'Amazon', 'Walmart', 'Target', 'Starbucks', 'Netflix', 'Uber', 'Apple', 'Microsoft', 
    'GameStop', 'Home Depot', 'Best Buy', 'Nike', 'Spotify', 'Shell', 'Chipotle', 'OnlyPets'
  ];
  const categories = [
    'Shopping', 'Groceries', 'Entertainment', 'Travel', 'Dining', 'Utilities', 'Healthcare', 
    'Electronics', 'Automotive', 'Education', 'Subscriptions'
  ];
  const locations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'London, UK', 'Toronto, CA', 'Moscow, Russia', 'Lagos, Nigeria', 'Remote'
  ];
  
  const mockTransactions: Transaction[] = [];
  
  // Generate mostly normal transactions with a few flagged ones
  for (let i = 0; i < count; i++) {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const amount = type === 'debit' || type === 'withdrawal' ? 
                 -(Math.random() * 1000 + 5).toFixed(2) : 
                 (Math.random() * 1000 + 5).toFixed(2);
    
    // Make some transactions suspicious
    const isSuspicious = Math.random() < 0.1; // 10% chance
    const isSimplyFlagged = Math.random() < 0.15; // 15% chance
    
    let status: Transaction['status'] = 'normal';
    if (isSuspicious) {
      status = 'suspicious';
    } else if (isSimplyFlagged) {
      status = 'flagged';
    } else if (Math.random() < 0.05) { // 5% chance
      status = 'verified';
    }
    
    // Risk scores
    const riskScore = status === 'normal' ? Math.floor(Math.random() * 20) : 
                    status === 'flagged' ? 20 + Math.floor(Math.random() * 40) :
                    status === 'suspicious' ? 60 + Math.floor(Math.random() * 40) :
                    Math.floor(Math.random() * 30); // verified
    
    const fraudProbability = riskScore * (0.8 + Math.random() * 0.4); // Some variability but correlated with risk
    
    // Generate merchant and description
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    let description = '';
    
    if (type === 'debit') {
      description = `POS Purchase - ${merchant}`;
    } else if (type === 'credit') {
      description = `Payment - Thank You`;
    } else if (type === 'transfer') {
      description = `Transfer to/from Account ****${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (type === 'withdrawal') {
      description = `ATM Withdrawal`;
    } else {
      description = `Deposit`;
    }
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate flags if applicable
    let flags: string[] = [];
    if (status === 'flagged' || status === 'suspicious') {
      if (Math.random() < 0.3) flags.push('Unusual location');
      if (Math.random() < 0.3) flags.push('Amount outside normal pattern');
      if (Math.random() < 0.3) flags.push('Velocity alert');
      if (Math.random() < 0.3) flags.push('High-risk merchant category');
      if (Math.random() < 0.3) flags.push('Suspicious IP address');
      
      // Ensure at least one flag
      if (flags.length === 0) {
        flags.push('Unusual transaction pattern');
      }
    }
    
    const transaction: Transaction = {
      id: `txn-${Date.now() - i * 100000 + Math.floor(Math.random() * 1000)}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Last 30 days
      description,
      amount: parseFloat(amount),
      type,
      category,
      status,
      accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      merchantCategory: type === 'debit' ? categories[Math.floor(Math.random() * categories.length)] : undefined,
      location: Math.random() < 0.8 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
      ipAddress: Math.random() < 0.7 ? `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : undefined,
      deviceId: Math.random() < 0.7 ? `device-${Math.floor(Math.random() * 100000)}` : undefined,
      riskScore,
      fraudProbability,
      flags: flags.length > 0 ? flags : undefined
    };
    
    mockTransactions.push(transaction);
  }
  
  // Sort by date, newest first
  return mockTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const TransactionMonitoring: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | 'custom'>('30days');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Load transactions
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(generateMockTransactions(100));
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Filter transactions
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Filter by status
      if (filter !== 'all') {
        if (filter === 'flagged' && transaction.status !== 'flagged' && transaction.status !== 'suspicious') {
          return false;
        } else if (filter !== 'flagged' && transaction.status !== filter) {
          return false;
        }
      }
      
      // Filter by date range
      if (dateRange === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (transaction.date < sevenDaysAgo) {
          return false;
        }
      } else if (dateRange === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (transaction.date < thirtyDaysAgo) {
          return false;
        }
      }
      
      // Filter by account
      if (selectedAccount && transaction.accountNumber !== selectedAccount) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(query) ||
          transaction.id.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query) ||
          (transaction.location && transaction.location.toLowerCase().includes(query)) ||
          transaction.accountNumber.includes(query)
        );
      }
      
      return true;
    });
  };
  
  const filteredTransactions = getFilteredTransactions();
  
  // Get unique accounts from transactions
  const getUniqueAccounts = () => {
    const accounts = new Set(transactions.map(t => t.accountNumber));
    return Array.from(accounts);
  };
  
  // Get transaction status indicator
  const getStatusIndicator = (status: Transaction['status']) => {
    switch (status) {
      case 'normal':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></div>
            <span className="text-sm text-green-800">Normal</span>
          </div>
        );
      case 'flagged':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></div>
            <span className="text-sm text-yellow-800">Flagged</span>
          </div>
        );
      case 'suspicious':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></div>
            <span className="text-sm text-red-800">Suspicious</span>
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></div>
            <span className="text-sm text-blue-800">Verified</span>
          </div>
        );
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get risk level text
  const getRiskLevelText = (score: number): string => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Low';
    return 'Very Low';
  };
  
  // Get risk color
  const getRiskColor = (score: number): string => {
    if (score >= 80) return 'text-red-700';
    if (score >= 60) return 'text-orange-700';
    if (score >= 40) return 'text-yellow-700';
    if (score >= 20) return 'text-blue-700';
    return 'text-green-700';
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-indigo-900">Transaction Monitoring</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setTransactions(generateMockTransactions(100));
                  setIsLoading(false);
                }, 800);
              }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh
            </button>
            
            <button
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        {/* Transaction statistics */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 font-medium text-sm">Total Transactions</p>
              <div className="bg-gray-100 text-gray-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {transactions.length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-red-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-red-500 font-medium text-sm">Suspicious</p>
              <div className="bg-red-100 text-red-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {transactions.filter(t => t.status === 'suspicious').length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-yellow-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-yellow-500 font-medium text-sm">Flagged</p>
              <div className="bg-yellow-100 text-yellow-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {transactions.filter(t => t.status === 'flagged').length}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-green-500 font-medium text-sm">Normal</p>
              <div className="bg-green-100 text-green-800 text-lg font-semibold px-2 py-0.5 rounded-md">
                {transactions.filter(t => t.status === 'normal').length + transactions.filter(t => t.status === 'verified').length}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-xs text-gray-600 mr-2">Status:</span>
            </div>
            
            <div className="flex space-x-1 overflow-x-auto">
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('all')}
              >
                All Transactions
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'flagged' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('flagged')}
              >
                <Flag className="inline-block h-3 w-3 mr-1" />
                Flagged & Suspicious
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'normal' 
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('normal')}
              >
                <CheckCircle className="inline-block h-3 w-3 mr-1" />
                Normal
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  filter === 'verified' 
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setFilter('verified')}
              >
                <CheckCircle className="inline-block h-3 w-3 mr-1" />
                Verified
              </button>
            </div>
            
            <div className="flex items-center ml-4">
              <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-xs text-gray-600 mr-2">Period:</span>
              
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    dateRange === 'all' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setDateRange('all')}
                >
                  All Time
                </button>
                
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    dateRange === '7days' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setDateRange('7days')}
                >
                  Last 7 Days
                </button>
                
                <button
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    dateRange === '30days' 
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setDateRange('30days')}
                >
                  Last 30 Days
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account selector */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center">
            <span className="text-xs text-gray-600 mr-2">Account:</span>
          </div>
          
          <button
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
              selectedAccount === null 
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedAccount(null)}
          >
            All Accounts
          </button>
          
          {getUniqueAccounts().slice(0, 4).map(account => (
            <button
              key={account}
              className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                selectedAccount === account 
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedAccount(account)}
            >
              <CreditCard className="inline-block h-3 w-3 mr-1" />
              {account}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Activity className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">No transactions found</h3>
            <p className="text-sm">No transactions match your current filters</p>
          </div>
        ) : (
          <div className="p-4">
            {filteredTransactions.map(transaction => (
              <div 
                key={transaction.id}
                className={`border rounded-lg overflow-hidden transition-all duration-200 hover:border-indigo-200 hover:shadow-sm mb-3 ${
                  transaction.status === 'suspicious' ? 'border-red-300 bg-red-50' :
                  transaction.status === 'flagged' ? 'border-yellow-300' :
                  'border-gray-200'
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedTransaction(expandedTransaction === transaction.id ? null : transaction.id)}
                >
                  <div className="flex items-start">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                      transaction.type === 'debit' || transaction.type === 'withdrawal' ? 'bg-red-100' :
                      transaction.type === 'credit' || transaction.type === 'deposit' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <div className={`${
                        transaction.type === 'debit' || transaction.type === 'withdrawal' ? 'text-red-600' :
                        transaction.type === 'credit' || transaction.type === 'deposit' ? 'text-green-600' :
                        'text-blue-600'
                      }`}>
                        {transaction.type === 'debit' ? <ArrowRight className="h-5 w-5" /> :
                         transaction.type === 'credit' ? <ArrowRight className="h-5 w-5 transform rotate-180" /> :
                         transaction.type === 'transfer' ? <Repeat className="h-5 w-5" /> :
                         transaction.type === 'withdrawal' ? <ArrowRight className="h-5 w-5" /> :
                         <ArrowRight className="h-5 w-5 transform rotate-180" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{transaction.description}</h3>
                          <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                        
                        <p className={`text-sm font-medium ${
                          transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {transaction.accountNumber}
                          </span>
                          
                          {transaction.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              {transaction.category}
                            </span>
                          )}
                          
                          {transaction.location && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                              <MapPin className="h-3 w-3 mr-1" />
                              {transaction.location}
                            </span>
                          )}
                        </div>
                        
                        <div>
                          {getStatusIndicator(transaction.status)}
                        </div>
                      </div>
                      
                      {/* Flags */}
                      {transaction.flags && transaction.flags.length > 0 && (
                        <div className="mt-2 flex items-center">
                          <Flag className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                          <span className="text-xs text-yellow-800">
                            {transaction.flags.slice(0, 2).join(', ')}
                            {transaction.flags.length > 2 ? ` +${transaction.flags.length - 2} more` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded transaction details */}
                {expandedTransaction === transaction.id && (
                  <div className="bg-gray-50 border-t border-gray-100 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Details</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Transaction ID:</span>
                            <span className="text-xs font-medium text-gray-900">{transaction.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Date & Time:</span>
                            <span className="text-xs font-medium text-gray-900">{transaction.date.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Amount:</span>
                            <span className={`text-xs font-medium ${
                              transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Type:</span>
                            <span className="text-xs font-medium text-gray-900 capitalize">{transaction.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Category:</span>
                            <span className="text-xs font-medium text-gray-900">{transaction.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-500">Account:</span>
                            <span className="text-xs font-medium text-gray-900">{transaction.accountNumber}</span>
                          </div>
                          {transaction.merchantCategory && (
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Merchant Category:</span>
                              <span className="text-xs font-medium text-gray-900">{transaction.merchantCategory}</span>
                            </div>
                          )}
                          {transaction.location && (
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Location:</span>
                              <span className="text-xs font-medium text-gray-900">{transaction.location}</span>
                            </div>
                          )}
                          {transaction.ipAddress && (
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">IP Address:</span>
                              <span className="text-xs font-medium text-gray-900">{transaction.ipAddress}</span>
                            </div>
                          )}
                          {transaction.deviceId && (
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500">Device ID:</span>
                              <span className="text-xs font-medium text-gray-900">{transaction.deviceId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Assessment</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Fraud Probability</span>
                              <span className={`text-xs font-medium ${getRiskColor(transaction.fraudProbability)}`}>
                                {transaction.fraudProbability.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  transaction.fraudProbability >= 80 ? 'bg-red-500' :
                                  transaction.fraudProbability >= 60 ? 'bg-orange-500' :
                                  transaction.fraudProbability >= 40 ? 'bg-yellow-500' :
                                  transaction.fraudProbability >= 20 ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${transaction.fraudProbability}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Risk Level</span>
                              <span className={`text-xs font-medium ${getRiskColor(transaction.riskScore)}`}>
                                {getRiskLevelText(transaction.riskScore)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  transaction.riskScore >= 80 ? 'bg-red-500' :
                                  transaction.riskScore >= 60 ? 'bg-orange-500' :
                                  transaction.riskScore >= 40 ? 'bg-yellow-500' :
                                  transaction.riskScore >= 20 ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${transaction.riskScore}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Flags */}
                          {transaction.flags && transaction.flags.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-xs font-medium text-gray-900 mb-2">Risk Flags</h5>
                              <div className="space-y-1.5">
                                {transaction.flags.map((flag, index) => (
                                  <div key={index} className="flex items-start">
                                    <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                    <span className="text-xs text-gray-700">{flag}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* AI Analysis - only for flagged or suspicious transactions */}
                          {(transaction.status === 'flagged' || transaction.status === 'suspicious') && (
                            <div className="mt-4 pt-3 border-t border-gray-100">
                              <h5 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                                <BarChart3 className="h-3.5 w-3.5 text-indigo-600 mr-1" />
                                AI Fraud Analysis
                              </h5>
                              <div className={`p-2 rounded-lg text-xs ${
                                transaction.status === 'suspicious' ? 'bg-red-50 border border-red-100 text-red-800' :
                                'bg-yellow-50 border border-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.status === 'suspicious' ? 
                                  'This transaction exhibits multiple high-risk characteristics common to fraudulent transactions. Immediate review is recommended.' :
                                  'This transaction contains some anomalous patterns that warrant further review, but may be legitimate.'
                                }
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="mt-3 flex space-x-2 justify-end">
                          <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            View History
                          </button>
                          
                          {transaction.status === 'flagged' || transaction.status === 'suspicious' ? (
                            <>
                              <button className="px-3 py-1.5 text-xs bg-green-50 border border-green-300 rounded text-green-700 hover:bg-green-100 transition-colors flex items-center">
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Mark as Verified
                              </button>
                              
                              <button className="px-3 py-1.5 text-xs bg-red-50 border border-red-300 rounded text-red-700 hover:bg-red-100 transition-colors flex items-center">
                                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                Create Alert
                              </button>
                            </>
                          ) : (
                            <button className="px-3 py-1.5 text-xs bg-yellow-50 border border-yellow-300 rounded text-yellow-700 hover:bg-yellow-100 transition-colors flex items-center">
                              <Flag className="h-3.5 w-3.5 mr-1.5" />
                              Flag Transaction
                            </button>
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

export default TransactionMonitoring;