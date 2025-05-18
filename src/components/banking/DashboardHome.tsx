import React, { useState } from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { ArrowRight, Shield, CreditCard, Landmark, Bot, RefreshCw } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const { setMode, setActiveTab, resetAll, addAuditEvent, auditTrail } = useBankingContext();
  const [isResetting, setIsResetting] = useState(false);
  
  const handleWorkflowSelection = (mode: 'account-opening' | 'credit-card' | 'loan') => {
    setMode(mode);
    setActiveTab(mode);
    addAuditEvent('Workflow Selected', `User started the ${mode} workflow`);
  };
  
  const handleReset = () => {
    setIsResetting(true);
    
    // Simulate a reset process
    setTimeout(() => {
      resetAll();
      setIsResetting(false);
      addAuditEvent('System Reset', 'User initiated a complete system reset');
    }, 1000);
  };
  
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to AgenticBank</h2>
              <p className="text-gray-600 mt-1">
                Experience the future of banking with our AI-powered digital bank
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
              disabled={isResetting}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isResetting ? 'animate-spin' : ''}`} />
              Reset Demo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleWorkflowSelection('account-opening')}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Account Opening</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Open a new bank account in minutes with our streamlined verification process.
              </p>
              <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
                <span>Get started</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
            
            <div
              className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleWorkflowSelection('credit-card')}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Credit Card</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Apply for a credit card with instant approval and virtual card issuance.
              </p>
              <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
                <span>Get started</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
            
            <div
              className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
              onClick={() => handleWorkflowSelection('loan')}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Landmark className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Loan Origination</h3>
              </div>
              <p className="text-white/90 text-sm mb-4">
                Apply for personal, home, or auto loans with our simplified application process.
              </p>
              <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
                <span>Get started</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">How It Works</h3>
            <p className="text-gray-600 mb-4">
              Our banking processes are powered by AI agents that guide you through each step:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <Bot className="h-5 w-5 text-indigo-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Conversational Interface</h4>
                <p className="text-sm text-gray-600">
                  Chat naturally with our AI to complete your banking tasks without complex forms.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Document Processing</h4>
                <p className="text-sm text-gray-600">
                  Upload and verify your documents through our secure and intelligent system.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Real-time Decisions</h4>
                <p className="text-sm text-gray-600">
                  Get instant feedback and decisions on your applications with transparent reasoning.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Compliance & Security</h4>
                <p className="text-sm text-gray-600">
                  Every action is logged and checked against regulatory requirements for full compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Activity</h3>
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h4 className="text-sm font-medium text-gray-700">Audit Log</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditTrail.slice().reverse().map((entry, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                        {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                        {entry.event}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 max-w-md truncate">
                        {entry.details}
                      </td>
                    </tr>
                  ))}
                  {auditTrail.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-sm text-center text-gray-500">
                        No activity recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;