import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import BankingChat from '../../banking/BankingChat';
import CreditCardStatus from './CreditCardStatus';
import CreditDecisionView from '../creditEvaluation/CreditDecisionView';
import DocumentVerificationView from '../document/DocumentVerificationView';
import { Layers, CheckCircle, AlertCircle, FileText, Calculator } from 'lucide-react';

const CreditCardWorkflow: React.FC = () => {
  const { creditCard } = useBankingContext();
  const [activeView, setActiveView] = useState<'chat' | 'status' | 'document' | 'decision'>('chat');
  const [documentType, setDocumentType] = useState<string>('pay-stub');
  
  // Handler for document verification requests from the chat
  const handleDocumentVerificationRequest = (type: string) => {
    setDocumentType(type);
    setActiveView('document');
  };
  
  // Handler for when document verification is complete
  const handleDocumentVerificationComplete = (success: boolean) => {
    // After document verification, show decision if successful
    setTimeout(() => {
      if (success) {
        setActiveView('decision');
      } else {
        setActiveView('chat');
      }
    }, 1000);
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
            <span>Credit Card Agent</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'document'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('document')}
          >
            <FileText className="h-4 w-4 mr-1.5" />
            <span>Income Verification</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'decision'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('decision')}
          >
            <Calculator className="h-4 w-4 mr-1.5" />
            <span>Credit Decision</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'status'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('status')}
          >
            {creditCard ? (
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
            <BankingChat 
              mode="credit-card" 
              onRequestDocumentVerification={handleDocumentVerificationRequest}
            />
          </div>
        ) : activeView === 'document' ? (
          <div className="h-full p-4">
            <DocumentVerificationView
              documentType={documentType}
              onComplete={handleDocumentVerificationComplete}
            />
          </div>
        ) : activeView === 'decision' ? (
          <div className="h-full p-4">
            <CreditDecisionView 
              creditScore={720}
              income={85000}
              requestedLimit={10000}
              existingDebt={25000}
              employmentMonths={36}
            />
          </div>
        ) : (
          <div className="h-full p-4">
            <CreditCardStatus />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCardWorkflow;