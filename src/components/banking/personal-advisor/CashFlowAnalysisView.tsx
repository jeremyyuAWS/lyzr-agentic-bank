import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  BarChart, 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  CalendarDays, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Wallet,
  BarChart3,
  Tag,
  Plus,
  RefreshCw,
  ChevronRight,
  Edit2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Income {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: 'monthly' | 'bi-weekly' | 'weekly' | 'annual';
  nextDate: Date;
}

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: 'monthly' | 'bi-weekly' | 'weekly' | 'annual' | 'one-time';
  essential: boolean;
  nextDate: Date;
}

interface BudgetCategory {
  name: string;
  planned: number;
  actual: number;
  color: string;
}

const CashFlowAnalysisView: React.FC = () => {
  const { customer, bankAccount, loan, creditCard } = useBankingContext();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [monthlyNetCashFlow, setMonthlyNetCashFlow] = useState<number>(0);
  const [savingsRate, setSavingsRate] = useState<number>(0);
  const [showOptimizer, setShowOptimizer] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [expenseChanges, setExpenseChanges] = useState<{
    category: string;
    amount: number;
    impact: number;
  }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<'current' | 'next' | 'previous'>('current');
  
  // Generate mock budget data based on customer profile
  useEffect(() => {
    if (!customer) return;
    
    const income: Income[] = [];
    const expenses: Expense[] = [];
    
    // Generate primary income
    income.push({
      id: 'income-1',
      name: 'Primary Salary',
      category: 'Employment',
      amount: customer.annualIncome / 12,
      frequency: 'monthly',
      nextDate: new Date(new Date().setDate(1))
    });
    
    // Add potential second income for some customers
    if (customer.annualIncome > 100000 && Math.random() > 0.7) {
      income.push({
        id: 'income-2',
        name: 'Side Business',
        category: 'Self-Employment',
        amount: customer.annualIncome * 0.15 / 12,
        frequency: 'monthly',
        nextDate: new Date(new Date().setDate(15))
      });
    }
    
    // Add investments income if high income
    if (customer.annualIncome > 150000) {
      income.push({
        id: 'income-3',
        name: 'Investment Dividends',
        category: 'Investment',
        amount: customer.annualIncome * 0.03 / 12,
        frequency: 'monthly',
        nextDate: new Date(new Date().setDate(10))
      });
    }
    
    // Generate expenses
    const monthlyIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    
    // Housing expense (25-35% of income)
    const housingPercent = 0.25 + (Math.random() * 0.1);
    expenses.push({
      id: 'expense-1',
      name: 'Housing',
      category: 'Housing',
      amount: monthlyIncome * housingPercent,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(1))
    });
    
    // Transportation (10-15%)
    const transportPercent = 0.1 + (Math.random() * 0.05);
    expenses.push({
      id: 'expense-2',
      name: 'Transportation',
      category: 'Transportation',
      amount: monthlyIncome * transportPercent,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(5))
    });
    
    // Food (10-15%)
    const foodPercent = 0.1 + (Math.random() * 0.05);
    expenses.push({
      id: 'expense-3',
      name: 'Groceries & Dining',
      category: 'Food',
      amount: monthlyIncome * foodPercent,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(15))
    });
    
    // Utilities (5-8%)
    const utilitiesPercent = 0.05 + (Math.random() * 0.03);
    expenses.push({
      id: 'expense-4',
      name: 'Utilities',
      category: 'Utilities',
      amount: monthlyIncome * utilitiesPercent,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(10))
    });
    
    // Entertainment (5-10%)
    const entertainmentPercent = 0.05 + (Math.random() * 0.05);
    expenses.push({
      id: 'expense-5',
      name: 'Entertainment',
      category: 'Entertainment',
      amount: monthlyIncome * entertainmentPercent,
      frequency: 'monthly',
      essential: false,
      nextDate: new Date(new Date().setDate(20))
    });
    
    // Loan payments
    if (loan) {
      expenses.push({
        id: 'expense-loan',
        name: `${loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} Loan Payment`,
        category: 'Debt',
        amount: loan.monthlyPayment,
        frequency: 'monthly',
        essential: true,
        nextDate: new Date(new Date().setDate(15))
      });
    }
    
    // Credit card payments (minimum)
    if (creditCard) {
      const estimatedCreditCardBalance = creditCard.creditLimit * 0.3; // Assume 30% utilization
      const minimumPayment = Math.max(25, estimatedCreditCardBalance * 0.03); // 3% of balance or $25, whichever is greater
      
      expenses.push({
        id: 'expense-credit',
        name: 'Credit Card Payment',
        category: 'Debt',
        amount: minimumPayment,
        frequency: 'monthly',
        essential: true,
        nextDate: new Date(new Date().setDate(25))
      });
    }
    
    // Subscriptions
    expenses.push({
      id: 'expense-subs',
      name: 'Subscriptions',
      category: 'Entertainment',
      amount: 50 + (Math.random() * 100), // $50-150
      frequency: 'monthly',
      essential: false,
      nextDate: new Date(new Date().setDate(7))
    });
    
    // Insurance
    expenses.push({
      id: 'expense-insurance',
      name: 'Insurance',
      category: 'Insurance',
      amount: monthlyIncome * 0.05,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(12))
    });
    
    // Savings
    const savingsPercent = 0.1 + (Math.random() * 0.1); // 10-20%
    expenses.push({
      id: 'expense-savings',
      name: 'Savings & Investments',
      category: 'Savings',
      amount: monthlyIncome * savingsPercent,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(1))
    });
    
    // Healthcare
    expenses.push({
      id: 'expense-healthcare',
      name: 'Healthcare',
      category: 'Healthcare',
      amount: monthlyIncome * 0.05,
      frequency: 'monthly',
      essential: true,
      nextDate: new Date(new Date().setDate(18))
    });
    
    // Calculate monthly cash flow
    const totalMonthlyIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalMonthlyExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netCashFlow = totalMonthlyIncome - totalMonthlyExpenses;
    
    // Calculate savings rate (including the explicit savings category)
    const savingsExpense = expenses.find(exp => exp.category === 'Savings');
    const savingsAmount = savingsExpense ? savingsExpense.amount : 0;
    const savingsRate = (savingsAmount + netCashFlow) / totalMonthlyIncome;
    
    // Create budget categories
    const categories: Record<string, BudgetCategory> = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = {
          name: expense.category,
          planned: 0,
          actual: 0, // In a real app, this would come from transaction data
          color: getCategoryColor(expense.category)
        };
      }
      categories[expense.category].planned += expense.amount;
      categories[expense.category].actual += expense.amount * (0.9 + Math.random() * 0.2); // Random between 90-110% of planned
    });
    
    // Generate optimization suggestions
    const potentialSavings: {
      category: string;
      amount: number;
      impact: number;
    }[] = [];
    
    // Find non-essential expenses that could be reduced
    const nonEssentialExpenses = expenses.filter(exp => !exp.essential);
    nonEssentialExpenses.forEach(expense => {
      // Suggest 10-30% reduction on non-essential expenses
      const reductionPercent = 0.1 + (Math.random() * 0.2);
      const reductionAmount = expense.amount * reductionPercent;
      
      potentialSavings.push({
        category: expense.category,
        amount: reductionAmount,
        impact: reductionAmount * 12 // Annual impact
      });
    });
    
    // Sort savings by impact
    potentialSavings.sort((a, b) => b.impact - a.impact);
    
    // Set state
    setIncomes(income);
    setExpenses(expenses);
    setBudgetCategories(Object.values(categories));
    setMonthlyNetCashFlow(netCashFlow);
    setSavingsRate(savingsRate);
    setExpenseChanges(potentialSavings.slice(0, 3));
    
  }, [customer, bankAccount, loan, creditCard]);

  // Get color for category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Housing':
        return '#4f46e5'; // indigo-600
      case 'Transportation':
        return '#10b981'; // emerald-500
      case 'Food':
        return '#f59e0b'; // amber-500
      case 'Utilities':
        return '#6366f1'; // indigo-500
      case 'Entertainment':
        return '#ec4899'; // pink-500
      case 'Debt':
        return '#ef4444'; // red-500
      case 'Insurance':
        return '#8b5cf6'; // violet-500
      case 'Savings':
        return '#3b82f6'; // blue-500
      case 'Healthcare':
        return '#14b8a6'; // teal-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (offset: number = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString('default', { month: 'long' });
  };

  // Handler for simulating expense optimization
  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setShowOptimizer(true);
    }, 1500);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart className="h-6 w-6 text-indigo-600 mr-2" />
              Cash Flow Analysis
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Track your income, expenses, and optimize your cash flow management.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="bg-white flex rounded-md shadow-sm border border-gray-300">
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-l-md ${
                  selectedMonth === 'previous' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setSelectedMonth('previous')}
              >
                {getMonthName(-1)}
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium ${
                  selectedMonth === 'current' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setSelectedMonth('current')}
              >
                {getMonthName(0)}
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium rounded-r-md ${
                  selectedMonth === 'next' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setSelectedMonth('next')}
              >
                {getMonthName(1)}
              </button>
            </div>
            
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
              onClick={handleOptimize}
            >
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Sliders className="h-4 w-4 mr-1.5" />
              )}
              Optimize Cash Flow
            </button>
          </div>
        </div>
        
        {/* Cash flow summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 mr-3">
                <Wallet className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Monthly Income</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(incomes.reduce((sum, inc) => sum + inc.amount, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100 mr-3">
                <ArrowDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Monthly Expenses</h3>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${monthlyNetCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                {monthlyNetCashFlow >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Net Cash Flow</h3>
                <p className={`text-xl font-bold ${monthlyNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyNetCashFlow)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${savingsRate >= 0.15 ? 'bg-green-100' : savingsRate >= 0.1 ? 'bg-yellow-100' : 'bg-red-100'} mr-3`}>
                <DollarSign className={`h-5 w-5 ${savingsRate >= 0.15 ? 'text-green-600' : savingsRate >= 0.1 ? 'text-yellow-600' : 'text-red-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Savings Rate</h3>
                <p className={`text-xl font-bold ${savingsRate >= 0.15 ? 'text-green-600' : savingsRate >= 0.1 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {(savingsRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Budget breakdown */}
          <div className="md:col-span-2 grid gap-6">
            {/* Budget categories visualization */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                Budget Categories
              </h3>
              
              <div className="space-y-4">
                {budgetCategories.map(category => {
                  const variance = category.actual - category.planned;
                  const variancePercent = (variance / category.planned) * 100;
                  
                  return (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(category.actual)}</p>
                          <p className={`text-xs ml-1.5 ${
                            variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {variance !== 0 && (variance > 0 ? '+' : '')}{formatCurrency(variance)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        {/* Planned amount */}
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${(category.planned / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100}%`,
                            backgroundColor: category.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Essential vs. Non-Essential</h4>
                  <div className="flex h-28 items-end space-x-8 justify-center">
                    <div className="flex flex-col items-center">
                      <div className="h-full w-16 bg-indigo-500 rounded-t-lg flex items-end justify-center">
                        <span className="text-white font-medium text-xs mb-1">
                          {Math.round(
                            (expenses.filter(e => e.essential).reduce((sum, e) => sum + e.amount, 0) / 
                            expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
                          )}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Essential</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="h-full relative">
                        <div 
                          className="w-16 bg-pink-500 rounded-t-lg flex items-end justify-center"
                          style={{ 
                            height: `${
                              (expenses.filter(e => !e.essential).reduce((sum, e) => sum + e.amount, 0) / 
                              expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
                            }%` 
                          }}
                        >
                          <span className="text-white font-medium text-xs mb-1">
                            {Math.round(
                              (expenses.filter(e => !e.essential).reduce((sum, e) => sum + e.amount, 0) / 
                              expenses.reduce((sum, e) => sum + e.amount, 0)) * 100
                            )}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Non-Essential</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Saving vs. Spending</h4>
                  <div className="flex h-28 items-end space-x-8 justify-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-16 bg-blue-500 rounded-t-lg flex items-end justify-center"
                        style={{ height: `${(savingsRate * 100)}%` }}
                      >
                        <span className="text-white font-medium text-xs mb-1">
                          {Math.round(savingsRate * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Saving</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-16 bg-green-500 rounded-t-lg flex items-end justify-center"
                        style={{ height: `${(1 - savingsRate) * 100}%` }}
                      >
                        <span className="text-white font-medium text-xs mb-1">
                          {Math.round((1 - savingsRate) * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Spending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cash flow timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CalendarDays className="h-5 w-5 text-indigo-600 mr-2" />
                {getMonthName(selectedMonth === 'previous' ? -1 : selectedMonth === 'next' ? 1 : 0)} Cash Flow Timeline
              </h3>
              
              <div className="space-y-3">
                {/* Timeline visualization */}
                <div className="relative h-24 bg-gray-100 rounded-lg p-4">
                  <div className="absolute top-0 bottom-0 left-0 right-0">
                    {/* Day markers */}
                    <div className="flex justify-between px-4 absolute inset-x-0 bottom-0 border-t border-gray-200">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const day = Math.floor(index * 7);
                        return (
                          <div key={index} className="text-xs text-gray-500 -mt-2 bg-gray-100 px-1">
                            {day + 1}
                          </div>
                        );
                      })}
                      <div className="text-xs text-gray-500 -mt-2 bg-gray-100 px-1">
                        30
                      </div>
                    </div>
                    
                    {/* Income dots */}
                    {incomes.map(income => {
                      // Position based on date
                      const position = (income.nextDate.getDate() - 1) / 30 * 100;
                      
                      return (
                        <div 
                          key={income.id} 
                          className="absolute top-3"
                          style={{ left: `${position}%` }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center" title={income.name}>
                              <ArrowDown className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="text-xs text-green-700 mt-1 font-medium">
                              {formatCurrency(income.amount)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Expense dots */}
                    {expenses.map(expense => {
                      // Position based on date
                      const position = (expense.nextDate.getDate() - 1) / 30 * 100;
                      
                      return (
                        <div 
                          key={expense.id} 
                          className="absolute bottom-8"
                          style={{ left: `${position}%` }}
                        >
                          <div className="flex flex-col items-center">
                            <div className="text-xs text-red-700 mb-1 font-medium">
                              {formatCurrency(expense.amount)}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center" title={expense.name}>
                              <ArrowUp className="h-3 w-3 text-red-600" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Upcoming cash flows */}
                <div>
                  <div className="flex items-center justify-between mb-2 pt-2 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Upcoming Cash Flows</h4>
                    <span className="text-xs text-gray-500">Next 7 days</span>
                  </div>
                  
                  <div className="space-y-2">
                    {[...incomes, ...expenses]
                      .filter(item => {
                        const date = new Date(item.nextDate);
                        const today = new Date();
                        const next7Days = new Date();
                        next7Days.setDate(today.getDate() + 7);
                        return date >= today && date <= next7Days;
                      })
                      .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
                      .slice(0, 4)
                      .map(item => {
                        const isIncome = 'category' in item && incomes.some(inc => inc.id === item.id);
                        
                        return (
                          <div key={item.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-200">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                                {isIncome ? (
                                  <ArrowDown className="h-4 w-4 text-green-600" />
                                ) : (
                                  <ArrowUp className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {item.nextDate.toLocaleDateString(undefined, { 
                                    weekday: 'short',
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            <p className={`text-sm font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                              {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Optimization insights (conditionally shown) */}
            {showOptimizer && (
              <div className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-200 p-4">
                <div className="flex items-start mb-4">
                  <div className="p-2 rounded-full bg-indigo-100 mr-3 flex-shrink-0">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-900">AI Cash Flow Optimizer</h3>
                    <p className="text-sm text-indigo-700 mt-1">
                      We've analyzed your spending patterns and identified opportunities to improve your cash flow 
                      by {formatCurrency(expenseChanges.reduce((sum, item) => sum + item.impact, 0))} annually.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {expenseChanges.map((change, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-indigo-100">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Reduce {change.category} expenses
                            </h4>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Reducing your monthly {change.category.toLowerCase()} spending by {formatCurrency(change.amount)} 
                              would save you {formatCurrency(change.impact)} per year.
                            </p>
                          </div>
                        </div>
                        <button className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Impact on Financial Goals</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Implementing these changes would improve your monthly cash flow by {formatCurrency(expenseChanges.reduce((sum, item) => sum + item.amount, 0))}, 
                    which could be redirected to your financial goals:
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 p-2 rounded-lg border border-green-100">
                      <h5 className="text-xs font-medium text-green-800 mb-1">Emergency Fund</h5>
                      <p className="text-xs text-green-600">Fully funded 3 months sooner</p>
                    </div>
                    
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                      <h5 className="text-xs font-medium text-blue-800 mb-1">Retirement</h5>
                      <p className="text-xs text-blue-600">+{formatCurrency(expenseChanges.reduce((sum, item) => sum + item.impact, 0) * 5)} in 10 years</p>
                    </div>
                    
                    <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                      <h5 className="text-xs font-medium text-purple-800 mb-1">Debt Reduction</h5>
                      <p className="text-xs text-purple-600">Pay off 18 months sooner</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      View Detailed Plan
                    </button>
                    <button className="text-xs bg-indigo-600 text-white py-1 px-3 rounded-full hover:bg-indigo-700 transition-colors">
                      Implement Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Income/Expense lists and actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <ArrowDown className="h-4 w-4 text-green-600 mr-1.5" />
                  Income Sources
                </h3>
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {incomes.map(income => (
                  <div key={income.id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{income.name}</h4>
                        <p className="text-xs text-gray-500 capitalize">
                          {income.category} • {income.frequency}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-green-600 mr-2">
                          {formatCurrency(income.amount)}
                        </p>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <ArrowUp className="h-4 w-4 text-red-600 mr-1.5" />
                  Expenses
                </h3>
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {expenses.map(expense => (
                  <div key={expense.id} className="px-4 py-3 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getCategoryColor(expense.category) }}
                        ></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{expense.name}</h4>
                          <p className="text-xs text-gray-500">
                            {expense.category} • {expense.frequency} • {expense.essential ? 'Essential' : 'Non-essential'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-red-600 mr-2">
                          {formatCurrency(expense.amount)}
                        </p>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Expenses</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Financial Health */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Financial Health Indicators
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Savings Rate</span>
                    <span className={`text-sm font-medium ${
                      savingsRate >= 0.2 ? 'text-green-600' :
                      savingsRate >= 0.1 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(savingsRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        savingsRate >= 0.2 ? 'bg-green-500' :
                        savingsRate >= 0.1 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(savingsRate * 100, 100) * 2}%` }}  // * 2 to scale 0-50% to 0-100% width
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {savingsRate >= 0.2 ? 'Excellent' :
                     savingsRate >= 0.1 ? 'Good' : 'Needs improvement'} 
                     {' '}- Target: 20%
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Debt-to-Income Ratio</span>
                    {/* Calculate DTI based on debt expenses */}
                    <span className={`text-sm font-medium ${
                      (expenses.filter(e => e.category === 'Debt').reduce((sum, e) => sum + e.amount, 0) / 
                       incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.36 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {
                        ((expenses.filter(e => e.category === 'Debt').reduce((sum, e) => sum + e.amount, 0) / 
                         incomes.reduce((sum, i) => sum + i.amount, 0)) * 100).toFixed(1)
                      }%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (expenses.filter(e => e.category === 'Debt').reduce((sum, e) => sum + e.amount, 0) / 
                         incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.36 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${
                          (expenses.filter(e => e.category === 'Debt').reduce((sum, e) => sum + e.amount, 0) / 
                           incomes.reduce((sum, i) => sum + i.amount, 0)) * 100
                        }%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      (expenses.filter(e => e.category === 'Debt').reduce((sum, e) => sum + e.amount, 0) / 
                       incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.36 ? 'Good' : 'Too high'
                    } 
                    {' '}- Target: Below 36%
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Housing Ratio</span>
                    {/* Calculate housing ratio */}
                    <span className={`text-sm font-medium ${
                      (expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0) / 
                       incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.28 ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {
                        ((expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0) / 
                         incomes.reduce((sum, i) => sum + i.amount, 0)) * 100).toFixed(1)
                      }%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        (expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0) / 
                         incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.28 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${
                          (expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0) / 
                           incomes.reduce((sum, i) => sum + i.amount, 0)) * 100 * 2
                        }%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {
                      (expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0) / 
                       incomes.reduce((sum, i) => sum + i.amount, 0)) <= 0.28 ? 'Good' : 'Slightly high'
                    } 
                    {' '}- Target: Below 28%
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  <FileText className="h-4 w-4 mr-1.5" />
                  Full Financial Health Report
                </button>
                <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors">
                  Set Budget Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data visualization insights */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-indigo-600 mr-2" />
              AI Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <h4 className="font-medium text-green-800 flex items-center mb-1">
                  <Tag className="h-4 w-4 text-green-600 mr-1.5" />
                  Spending Pattern
                </h4>
                <p className="text-sm text-green-700">
                  Your spending in {getMonthName(0)} is trending 5% lower than your 6-month average, keeping you on track for your savings goals.
                </p>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <h4 className="font-medium text-indigo-800 flex items-center mb-1">
                  <AlertTriangle className="h-4 w-4 text-indigo-600 mr-1.5" />
                  Upcoming Consideration
                </h4>
                <p className="text-sm text-indigo-700">
                  You have higher than usual expenses coming in {getMonthName(1)}. Consider setting aside an additional {formatCurrency(incomes.reduce((sum, inc) => sum + inc.amount, 0) * 0.1)} this month.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <h4 className="font-medium text-purple-800 flex items-center mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-600 mr-1.5" />
                  Opportunity
                </h4>
                <p className="text-sm text-purple-700">
                  Based on your cash flow, you could increase your investment contributions by {formatCurrency(incomes.reduce((sum, inc) => sum + inc.amount, 0) * 0.03)} without impacting your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowAnalysisView;