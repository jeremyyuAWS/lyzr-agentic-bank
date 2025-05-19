import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Target, 
  Home, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Edit2, 
  ChevronRight, 
  Plus, 
  Calendar 
} from 'lucide-react';

// Goal type definition
interface FinancialGoal {
  id: string;
  type: 'retirement' | 'home' | 'education' | 'emergency' | 'vacation' | 'vehicle' | 'custom';
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'off-track' | 'completed';
  monthlyContribution: number;
  notes?: string;
}

const GoalPlanningDashboard: React.FC = () => {
  const { customer, bankAccount } = useBankingContext();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  // Generate mock goals based on the customer profile
  useEffect(() => {
    if (!customer) return;

    const mockGoals: FinancialGoal[] = [
      {
        id: 'goal-1',
        type: 'retirement',
        name: 'Retirement',
        targetAmount: customer.annualIncome * 25,
        currentAmount: bankAccount?.balance || 15000,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 30)),
        priority: 'high',
        status: 'on-track',
        monthlyContribution: customer.annualIncome * 0.15 / 12,
        notes: 'Aiming for financial independence by age 65 with a comfortable retirement income.'
      },
      {
        id: 'goal-2',
        type: 'home',
        name: 'Home Purchase',
        targetAmount: customer.annualIncome * 4,
        currentAmount: bankAccount?.balance ? bankAccount.balance * 0.5 : 10000,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
        priority: 'high',
        status: 'at-risk',
        monthlyContribution: customer.annualIncome * 0.1 / 12,
        notes: 'Saving for a 20% down payment on a home in a good school district.'
      },
      {
        id: 'goal-3',
        type: 'emergency',
        name: 'Emergency Fund',
        targetAmount: customer.annualIncome / 2,
        currentAmount: bankAccount?.balance ? bankAccount.balance * 0.3 : 5000,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 18)),
        priority: 'high',
        status: 'on-track',
        monthlyContribution: customer.annualIncome * 0.05 / 12
      },
      {
        id: 'goal-4',
        type: 'education',
        name: 'College Fund',
        targetAmount: 120000,
        currentAmount: 12000,
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 15)),
        priority: 'medium',
        status: 'on-track',
        monthlyContribution: 500,
        notes: 'Saving for 4 years of in-state tuition, room, and board.'
      },
      {
        id: 'goal-5',
        type: 'vacation',
        name: 'Dream Vacation',
        targetAmount: 8000,
        currentAmount: 2500,
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 12)),
        priority: 'low',
        status: 'at-risk',
        monthlyContribution: 500
      }
    ];

    setGoals(mockGoals);
    setActiveGoal(mockGoals[0].id);
  }, [customer, bankAccount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short'
    }).format(date);
  };

  const getTimeRemaining = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)) % 12;
    
    if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year' : 'years'}${diffMonths > 0 ? `, ${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}` : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'}`;
    } else {
      return 'Less than a month';
    }
  };

  const getGoalIcon = (type: FinancialGoal['type']) => {
    switch (type) {
      case 'retirement':
        return <Clock className="h-5 w-5 text-purple-600" />;
      case 'home':
        return <Home className="h-5 w-5 text-blue-600" />;
      case 'education':
        return <GraduationCap className="h-5 w-5 text-green-600" />;
      case 'emergency':
        return <ShieldCheck className="h-5 w-5 text-red-600" />;
      case 'vacation':
        return <Calendar className="h-5 w-5 text-amber-600" />;
      case 'vehicle':
        return <TrendingUp className="h-5 w-5 text-indigo-600" />;
      case 'custom':
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getGoalStatusColor = (status: FinancialGoal['status']) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'off-track':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGoalProgress = (goal: FinancialGoal) => {
    return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  };

  const goalData = goals.find(g => g.id === activeGoal);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 text-indigo-600 mr-2" />
            Financial Goals Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Track, manage, and optimize your progress toward your financial goals with AI-powered insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Goals list */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Your Financial Goals</h3>
                <button 
                  className="p-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
                  onClick={() => setShowNewGoalForm(true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {goals.map((goal) => (
                  <div 
                    key={goal.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      goal.id === activeGoal 
                        ? 'bg-indigo-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveGoal(goal.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-gray-100 mr-3">
                          {getGoalIcon(goal.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{goal.name}</h4>
                          <div className="flex items-center mt-0.5">
                            <DollarSign className="h-3.5 w-3.5 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getGoalStatusColor(goal.status)}`}>
                        {goal.status === 'on-track' ? 'On track' : 
                         goal.status === 'at-risk' ? 'At risk' :
                         goal.status === 'off-track' ? 'Off track' : 'Completed'}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{getGoalProgress(goal)}% complete</span>
                        <span>{formatDate(goal.targetDate)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            goal.status === 'on-track' ? 'bg-green-500' : 
                            goal.status === 'at-risk' ? 'bg-yellow-500' :
                            goal.status === 'off-track' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${getGoalProgress(goal)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right content - Goal details */}
          <div className="lg:col-span-2">
            {goalData ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-100 mr-4">
                        {getGoalIcon(goalData.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{goalData.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Target date: {formatDate(goalData.targetDate)} ({getTimeRemaining(goalData.targetDate)} remaining)
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                      <Edit2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Progress Card */}
                  <div className="md:col-span-2 bg-indigo-50 p-5 rounded-lg border border-indigo-100">
                    <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
                      <TrendingUp className="h-5 w-5 text-indigo-600 mr-1.5" />
                      Goal Progress
                    </h4>
                    
                    <div className="w-full bg-white rounded-full h-4 mb-3 p-0.5">
                      <div 
                        className={`h-3 rounded-full ${
                          goalData.status === 'on-track' ? 'bg-green-500' : 
                          goalData.status === 'at-risk' ? 'bg-yellow-500' :
                          goalData.status === 'off-track' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${getGoalProgress(goalData)}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs text-gray-500 mb-1">Current Amount</p>
                        <p className="text-lg font-bold text-indigo-900">
                          {formatCurrency(goalData.currentAmount)}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs text-gray-500 mb-1">Target Amount</p>
                        <p className="text-lg font-bold text-indigo-900">
                          {formatCurrency(goalData.targetAmount)}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs text-gray-500 mb-1">Progress</p>
                        <p className="text-lg font-bold text-indigo-900">
                          {getGoalProgress(goalData)}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-indigo-100">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className={`text-sm font-medium px-2 py-0.5 rounded-full inline-flex ${getGoalStatusColor(goalData.status)}`}>
                          {goalData.status === 'on-track' ? 'On Track' : 
                           goalData.status === 'at-risk' ? 'At Risk' :
                           goalData.status === 'off-track' ? 'Off Track' : 'Completed'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contribution Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Contribution Plan</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly Contribution</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(goalData.monthlyContribution)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Contributions</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(goalData.currentAmount)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Contribution Timeline</p>
                        <div className="w-full bg-gray-100 rounded-lg h-12 relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center">
                            {/* Timeline dots */}
                            <div className="absolute left-0 w-3 h-3 bg-indigo-600 rounded-full z-10"></div>
                            <div className="absolute left-1/4 w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="absolute left-1/2 w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="absolute left-3/4 w-2 h-2 bg-gray-400 rounded-full"></div>
                            <div className="absolute right-0 w-2 h-2 bg-gray-400 rounded-full"></div>
                            
                            {/* Progress line */}
                            <div className="absolute top-1/2 transform -translate-y-1/2 left-0 right-0 h-0.5 bg-gray-300">
                              <div className="h-full bg-indigo-600" style={{width: '15%'}}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Start</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>Goal</span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors py-2 rounded-md text-sm font-medium">
                        Adjust Contribution
                      </button>
                    </div>
                  </div>
                  
                  {/* Strategy Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {goalData.type === 'retirement' ? 
                            'Increase your retirement contributions by 3% to stay on track with your goal.' : 
                           goalData.type === 'home' ? 
                            'Consider a high-yield savings account to maximize interest on your down payment savings.' :
                           goalData.type === 'education' ? 
                            'Look into a 529 plan for tax-advantaged education savings.' :
                           goalData.type === 'emergency' ?
                            'Once you reach 3 months of expenses, consider splitting additional savings between emergency fund and investments.' :
                           'Automate your contributions to avoid missing monthly savings targets.'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {goalData.status !== 'on-track' ? 
                            'Increasing your monthly contribution by $100 would put you back on track to meet your goal.' : 
                            'Your current savings rate is appropriate for this goal. Continue your disciplined approach.'}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {goalData.type === 'retirement' ? 
                            'Consider increasing your allocation to stocks given your long time horizon.' : 
                            'Review this goal every 6 months to ensure you remain on track with changing circumstances.'}
                        </p>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors py-2 rounded-md text-sm font-medium">
                      Generate Detailed Plan
                    </button>
                  </div>
                </div>
                
                {/* Additional goal details */}
                {goalData.notes && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">
                      {goalData.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center">
                  <Target className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Select a goal</h3>
                  <p className="text-gray-500">
                    Choose a goal from the list to view details and progress.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanningDashboard;