import React from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { BarChart3, ArrowUpRight, ArrowDownRight, Users, CreditCard, BadgeDollarSign } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { mode, auditTrail } = useBankingContext();
  
  // Calculate stats based on audit trail
  const totalUsers = Math.max(1, Math.floor(auditTrail.length / 10));
  const accountsOpened = Math.floor(auditTrail.length / 20);
  const cardsIssued = Math.floor(auditTrail.length / 25);
  const loansApproved = Math.floor(auditTrail.length / 30);
  
  // Simulate changes (up or down) for metrics
  const userChange = Math.floor(Math.random() * 20) + 5;
  const accountChange = Math.floor(Math.random() * 15) + 3;
  const cardChange = Math.floor(Math.random() * 10) + 2;
  const loanChange = Math.floor(Math.random() * 8) + 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs font-medium text-green-600">+{userChange}%</span>
          </div>
        </div>
        <h3 className="font-medium text-gray-500 mb-1">Total Users</h3>
        <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>vs. previous week</span>
        </div>
      </div>
      
      {/* Accounts Opened */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v14" />
            </svg>
          </div>
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs font-medium text-green-600">+{accountChange}%</span>
          </div>
        </div>
        <h3 className="font-medium text-gray-500 mb-1">Accounts Opened</h3>
        <p className="text-2xl font-bold text-gray-900">{accountsOpened}</p>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>vs. previous week</span>
        </div>
      </div>
      
      {/* Cards Issued */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-xs font-medium text-red-600">-{cardChange}%</span>
          </div>
        </div>
        <h3 className="font-medium text-gray-500 mb-1">Cards Issued</h3>
        <p className="text-2xl font-bold text-gray-900">{cardsIssued}</p>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>vs. previous week</span>
        </div>
      </div>
      
      {/* Loans Approved */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <BadgeDollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs font-medium text-green-600">+{loanChange}%</span>
          </div>
        </div>
        <h3 className="font-medium text-gray-500 mb-1">Loans Approved</h3>
        <p className="text-2xl font-bold text-gray-900">{loansApproved}</p>
        <div className="mt-3 flex items-center text-xs text-gray-500">
          <BarChart3 className="h-3.5 w-3.5 mr-1" />
          <span>vs. previous week</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;