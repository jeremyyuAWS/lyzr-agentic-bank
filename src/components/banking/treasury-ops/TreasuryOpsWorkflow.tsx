import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import BankingChat from '../BankingChat';
import LiquidityDashboard from './LiquidityDashboard';
import InterBankTransfers from './InterBankTransfers';
import RegulatoryReporting from './RegulatoryReporting';
import CapitalManagement from './CapitalManagement';
import BaselCompliance from './BaselCompliance';
import { MessageSquare, BarChart, Landmark, FileText, Landmark2, ShieldCheck } from 'lucide-react';

const TreasuryOpsWorkflow: React.FC = () => {
  const { updateTreasuryData } = useBankingContext();
  const [activeView, setActiveView] = useState<'chat' | 'liquidity' | 'transfers' | 'regulatory' | 'capital' | 'basel'>('chat');

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
            <MessageSquare className="h-4 w-4 mr-1.5" />
            <span>Treasury Agent</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'liquidity'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('liquidity')}
          >
            <BarChart className="h-4 w-4 mr-1.5" />
            <span>Liquidity Position</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'transfers'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('transfers')}
          >
            <Landmark className="h-4 w-4 mr-1.5" />
            <span>InterBank Transfers</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'regulatory'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('regulatory')}
          >
            <FileText className="h-4 w-4 mr-1.5" />
            <span>Regulatory Reporting</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'capital'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('capital')}
          >
            <Landmark2 className="h-4 w-4 mr-1.5" />
            <span>Capital Management</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'basel'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('basel')}
          >
            <ShieldCheck className="h-4 w-4 mr-1.5" />
            <span>Basel III Compliance</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="h-full p-4">
            <BankingChat 
              mode="treasury-ops"
            />
          </div>
        ) : activeView === 'liquidity' ? (
          <div className="h-full p-4">
            <LiquidityDashboard />
          </div>
        ) : activeView === 'transfers' ? (
          <div className="h-full p-4">
            <InterBankTransfers />
          </div>
        ) : activeView === 'regulatory' ? (
          <div className="h-full p-4">
            <RegulatoryReporting />
          </div>
        ) : activeView === 'capital' ? (
          <div className="h-full p-4">
            <CapitalManagement />
          </div>
        ) : (
          <div className="h-full p-4">
            <BaselCompliance />
          </div>
        )}
      </div>
    </div>
  );
};

export default TreasuryOpsWorkflow;