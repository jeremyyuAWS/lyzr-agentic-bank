import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import BankingChat from '../../banking/BankingChat';
import LoanStatus from './LoanStatus';
import DocumentVerificationView from '../document/DocumentVerificationView';
import AIDecisionExplainer from '../shared/AIDecisionExplainer';
import { Layers, CheckCircle, AlertCircle, FileText, Calculator } from 'lucide-react';

const LoanWorkflow: React.FC = () => {
  const { loan } = useBankingContext();
  const [activeView, setActiveView] = useState<'chat' | 'status' | 'document' | 'decision'>('chat');
  const [documentType, setDocumentType] = useState<string>('tax-return');
  
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
  
  // Decision factors for the loan
  const loanDecisionFactors = [
    {
      name: 'Credit Score',
      score: 85, // Score out of 100
      weight: 30, // Weight as percentage
      description: "Your credit score of 715 indicates good creditworthiness, though it's below our premium threshold of 740.",
      impact: 'positive' as const
    },
    {
      name: 'Debt-to-Income Ratio',
      score: 75,
      weight: 25,
      description: 'Your DTI ratio of 32% is within our acceptable range but approaching the upper limit of 36%.',
      impact: 'neutral' as const
    },
    {
      name: 'Employment History',
      score: 90,
      weight: 20,
      description: '4+ years with current employer demonstrates strong employment stability.',
      impact: 'positive' as const
    },
    {
      name: 'Loan-to-Value Ratio',
      score: 80,
      weight: 15,
      description: 'Your LTV ratio of 78% is below our 80% threshold, reducing risk.',
      impact: 'positive' as const
    },
    {
      name: 'Payment-to-Income Ratio',
      score: 65,
      weight: 10,
      description: 'The proposed loan payment would be 28% of your monthly income, which is at the upper end of our comfort range.',
      impact: 'neutral' as const
    }
  ];
  
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
            <span>Loan Agent</span>
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
            <span>Loan Decision</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'status'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('status')}
          >
            {loan ? (
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
              mode="loan"
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
          <div className="h-full p-4 space-y-4">
            <AIDecisionExplainer
              decision="approved"
              title="Loan Application Approved"
              contextType="loan"
              factors={loanDecisionFactors}
              confidenceScore={88}
              alternateDecision="Approval with Modified Terms"
              recommendationText="Based on your credit profile and income, we can offer you a personal loan of $25,000 with a 36-month term at 7.49% APR."
            />
            
            {/* Loan terms summary - would be more sophisticated in a real app */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Approved Loan Terms</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-indigo-900 mb-1">Loan Amount</h5>
                  <p className="text-2xl font-bold text-indigo-900">$25,000</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-green-900 mb-1">Interest Rate</h5>
                  <p className="text-2xl font-bold text-green-900">7.49%</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-amber-900 mb-1">Loan Term</h5>
                  <p className="text-2xl font-bold text-amber-900">36 Months</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-medium text-gray-900">Monthly Payment</h5>
                  <p className="text-lg font-bold text-gray-900">$775.42</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Represents 28% of your monthly income</p>
              </div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
                Accept Loan Offer
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                This offer is valid for the next 30 days
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full p-4">
            <LoanStatus />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanWorkflow;