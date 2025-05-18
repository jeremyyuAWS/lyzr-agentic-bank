import React from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Shield, CreditCard, Landmark, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const WorkflowSummary: React.FC = () => {
  const { 
    activeTab, 
    setMode, 
    setActiveTab, 
    customer, 
    bankAccount,
    creditCard,
    loan,
    chatThreads
  } = useBankingContext();
  
  const handleWorkflowClick = (mode: 'account-opening' | 'credit-card' | 'loan') => {
    setMode(mode);
    setActiveTab(mode);
  };
  
  // Calculate workflow statuses
  const accountStatus = 
    bankAccount ? 'completed' : 
    customer ? 'in-progress' : 
    chatThreads['account-opening'].messages.length > 0 ? 'started' : 
    'not-started';
    
  const creditCardStatus = 
    creditCard ? 'completed' : 
    customer ? 'in-progress' : 
    chatThreads['credit-card'].messages.length > 0 ? 'started' : 
    'not-started';
    
  const loanStatus = 
    loan ? 'completed' : 
    customer ? 'in-progress' : 
    chatThreads['loan'].messages.length > 0 ? 'started' : 
    'not-started';
  
  // Calculate workflow progress percentages
  const accountProgress = 
    accountStatus === 'completed' ? 100 : 
    accountStatus === 'in-progress' ? 50 : 
    accountStatus === 'started' ? 15 : 
    0;
    
  const creditCardProgress = 
    creditCardStatus === 'completed' ? 100 : 
    creditCardStatus === 'in-progress' ? 50 : 
    creditCardStatus === 'started' ? 15 : 
    0;
    
  const loanProgress = 
    loanStatus === 'completed' ? 100 : 
    loanStatus === 'in-progress' ? 50 : 
    loanStatus === 'started' ? 15 : 
    0;
    
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'started':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-900">Workflow Status</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {/* Account Opening */}
        <div 
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            activeTab === 'account-opening' ? 'bg-indigo-50' : ''
          }`}
          onClick={() => handleWorkflowClick('account-opening')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Account Opening</h4>
                <p className="text-xs text-gray-500">Open a new bank account</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {getStatusIcon(accountStatus)}
              <span className={`ml-1.5 text-xs font-medium ${
                accountStatus === 'completed' ? 'text-green-700' :
                accountStatus === 'in-progress' ? 'text-blue-700' :
                accountStatus === 'started' ? 'text-amber-700' :
                'text-gray-500'
              }`}>
                {accountStatus === 'completed' ? 'Completed' :
                 accountStatus === 'in-progress' ? 'In Progress' :
                 accountStatus === 'started' ? 'Started' :
                 'Not Started'}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                accountStatus === 'completed' ? 'bg-green-500' :
                accountStatus === 'in-progress' ? 'bg-blue-500' :
                accountStatus === 'started' ? 'bg-amber-500' :
                'bg-gray-300'
              }`}
              style={{ width: `${accountProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Credit Card */}
        <div 
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            activeTab === 'credit-card' ? 'bg-indigo-50' : ''
          }`}
          onClick={() => handleWorkflowClick('credit-card')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Credit Card Issuance</h4>
                <p className="text-xs text-gray-500">Apply for a new credit card</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {getStatusIcon(creditCardStatus)}
              <span className={`ml-1.5 text-xs font-medium ${
                creditCardStatus === 'completed' ? 'text-green-700' :
                creditCardStatus === 'in-progress' ? 'text-blue-700' :
                creditCardStatus === 'started' ? 'text-amber-700' :
                'text-gray-500'
              }`}>
                {creditCardStatus === 'completed' ? 'Completed' :
                 creditCardStatus === 'in-progress' ? 'In Progress' :
                 creditCardStatus === 'started' ? 'Started' :
                 'Not Started'}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                creditCardStatus === 'completed' ? 'bg-green-500' :
                creditCardStatus === 'in-progress' ? 'bg-blue-500' :
                creditCardStatus === 'started' ? 'bg-amber-500' :
                'bg-gray-300'
              }`}
              style={{ width: `${creditCardProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Loan Origination */}
        <div 
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            activeTab === 'loan' ? 'bg-indigo-50' : ''
          }`}
          onClick={() => handleWorkflowClick('loan')}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Landmark className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Loan Origination</h4>
                <p className="text-xs text-gray-500">Apply for a personal or home loan</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {getStatusIcon(loanStatus)}
              <span className={`ml-1.5 text-xs font-medium ${
                loanStatus === 'completed' ? 'text-green-700' :
                loanStatus === 'in-progress' ? 'text-blue-700' :
                loanStatus === 'started' ? 'text-amber-700' :
                'text-gray-500'
              }`}>
                {loanStatus === 'completed' ? 'Completed' :
                 loanStatus === 'in-progress' ? 'In Progress' :
                 loanStatus === 'started' ? 'Started' :
                 'Not Started'}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                loanStatus === 'completed' ? 'bg-green-500' :
                loanStatus === 'in-progress' ? 'bg-blue-500' :
                loanStatus === 'started' ? 'bg-amber-500' :
                'bg-gray-300'
              }`}
              style={{ width: `${loanProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSummary;