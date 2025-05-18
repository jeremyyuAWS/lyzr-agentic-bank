import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import BankingChat from '../../banking/BankingChat';
import AccountOpeningStatus from './AccountOpeningStatus';
import DocumentVerificationView from '../document/DocumentVerificationView';
import { Layers, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const AccountOpeningWorkflow: React.FC = () => {
  const { bankAccount } = useBankingContext();
  const [activeView, setActiveView] = useState<'chat' | 'status' | 'document'>('chat');
  const [documentType, setDocumentType] = useState<string>('id');
  
  // Handler for when document verification is complete
  const handleDocumentVerificationComplete = (success: boolean) => {
    // After document verification, return to chat
    setTimeout(() => {
      setActiveView('chat');
    }, 2000);
  };
  
  // Open document verification view with specified document type
  const openDocumentVerification = (type: string) => {
    setDocumentType(type);
    setActiveView('document');
  };
  
  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex">
        <div className="flex space-x-4 overflow-x-auto">
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'chat'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('chat')}
          >
            <Layers className="h-4 w-4 mr-1.5" />
            <span>Application Agent</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'document'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => openDocumentVerification('id')}
          >
            <FileText className="h-4 w-4 mr-1.5" />
            <span>Document Verification</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'status'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('status')}
          >
            {bankAccount ? (
              <CheckCircle className="h-4 w-4 mr-1.5 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 mr-1.5 text-amber-500" />
            )}
            <span>Application Status</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="h-full p-4">
            <BankingChat mode="account-opening" />
          </div>
        ) : activeView === 'document' ? (
          <div className="h-full p-4">
            <DocumentVerificationView 
              documentType={documentType}
              onComplete={handleDocumentVerificationComplete}
            />
          </div>
        ) : (
          <div className="h-full p-4">
            <AccountOpeningStatus />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountOpeningWorkflow;