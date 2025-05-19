import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import BankingChat from '../BankingChat';
import FraudAlertDashboard from './FraudAlertDashboard';
import TransactionMonitoring from './TransactionMonitoring';
import FraudDetectionVisualization from './FraudDetectionVisualization';
import { Layers, AlertTriangle, BarChart, Activity, Shield } from 'lucide-react';

const FraudDetectionWorkflow: React.FC = () => {
  const [activeView, setActiveView] = useState<'chat' | 'alerts' | 'monitoring' | 'visualization'>('chat');

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
            <span>Fraud Agent</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'alerts'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('alerts')}
          >
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            <span>Alert Center</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'monitoring'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('monitoring')}
          >
            <Activity className="h-4 w-4 mr-1.5" />
            <span>Transaction Monitoring</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'visualization'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('visualization')}
          >
            <BarChart className="h-4 w-4 mr-1.5" />
            <span>Fraud Detection AI</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="h-full p-4">
            <BankingChat 
              mode="fraud-detection" 
              standalone={true}
            />
          </div>
        ) : activeView === 'alerts' ? (
          <div className="h-full p-4">
            <FraudAlertDashboard />
          </div>
        ) : activeView === 'monitoring' ? (
          <div className="h-full p-4">
            <TransactionMonitoring />
          </div>
        ) : (
          <div className="h-full p-4">
            <FraudDetectionVisualization />
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudDetectionWorkflow;