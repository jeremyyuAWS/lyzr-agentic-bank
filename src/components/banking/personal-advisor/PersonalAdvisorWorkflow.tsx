import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import FinancialHealthDashboard from '../FinancialHealthDashboard';
import PersonalAdvisorChat from './PersonalAdvisorChat';
import GoalPlanningDashboard from './GoalPlanningDashboard';
import PortfolioOptimizationView from './PortfolioOptimizationView';
import CashFlowAnalysisView from './CashFlowAnalysisView';
import LifeEventPlanningView from './LifeEventPlanningView';
import { MessageSquare, TrendingUp, Target, PieChart, BarChart, Heart } from 'lucide-react';

const PersonalAdvisorWorkflow: React.FC = () => {
  const { updateTreasuryData } = useBankingContext();
  const [activeView, setActiveView] = useState<'chat' | 'health' | 'goals' | 'portfolio' | 'cashflow' | 'lifeevents'>('chat');

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
            <span>Financial Advisor</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'health'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('health')}
          >
            <TrendingUp className="h-4 w-4 mr-1.5" />
            <span>Financial Health</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'goals'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('goals')}
          >
            <Target className="h-4 w-4 mr-1.5" />
            <span>Goal Planning</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'portfolio'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('portfolio')}
          >
            <PieChart className="h-4 w-4 mr-1.5" />
            <span>Portfolio Optimization</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'cashflow'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('cashflow')}
          >
            <BarChart className="h-4 w-4 mr-1.5" />
            <span>Cash Flow</span>
          </button>
          
          <button
            className={`py-2 px-3 text-sm font-medium rounded-md flex items-center transition-all ${
              activeView === 'lifeevents'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveView('lifeevents')}
          >
            <Heart className="h-4 w-4 mr-1.5" />
            <span>Life Events</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' ? (
          <div className="h-full p-4">
            <PersonalAdvisorChat />
          </div>
        ) : activeView === 'health' ? (
          <div className="h-full p-4">
            <FinancialHealthDashboard />
          </div>
        ) : activeView === 'goals' ? (
          <div className="h-full p-4">
            <GoalPlanningDashboard />
          </div>
        ) : activeView === 'portfolio' ? (
          <div className="h-full p-4">
            <PortfolioOptimizationView />
          </div>
        ) : activeView === 'cashflow' ? (
          <div className="h-full p-4">
            <CashFlowAnalysisView />
          </div>
        ) : (
          <div className="h-full p-4">
            <LifeEventPlanningView />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalAdvisorWorkflow;