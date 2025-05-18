import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { useAppContext } from '../../../context/AppContext';
import { 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart3, 
  Landmark, 
  CreditCard, 
  BarChart
} from 'lucide-react';

// This component provides a summary of financial health for the dashboard
const FinancialHealthMetrics: React.FC = () => {
  const { customer, bankAccount, creditCard, loan } = useBankingContext();
  const { portfolios, retirementData } = useAppContext();
  const [healthScore, setHealthScore] = useState<number>(65);
  
  // Calculate financial health score
  useEffect(() => {
    if (!customer) return;
    
    // Simple calculation for demo purposes
    let score = 65; // Base score
    
    // Adjust for banking products
    if (bankAccount) score += 5;
    if (creditCard) score += 5;
    if (loan) {
      if (loan.loanType === 'home') {
        score += 5; // Home loans generally positive for financial health
      } else {
        score -= 5; // Other loans might reduce score slightly
      }
    }
    
    // Adjust for investments
    if (portfolios.length > 0 && retirementData) {
      // Calculate retirement readiness
      const maxProjectedFund = Math.max(...portfolios.map(p => p.projectedFund));
      const annualIncome = retirementData.annualIncome;
      const yearsToRetirement = retirementData.retirementAge - retirementData.age;
      
      // Simple scoring based on projected fund vs annual income
      const incomeFactor = maxProjectedFund / (annualIncome * yearsToRetirement / 5);
      
      if (incomeFactor > 1) {
        score += 10; // Well prepared for retirement
      } else if (incomeFactor > 0.5) {
        score += 5; // Somewhat prepared
      }
    }
    
    // Ensure score is in range 0-100
    score = Math.max(0, Math.min(100, score));
    
    setHealthScore(score);
  }, [customer, bankAccount, creditCard, loan, portfolios, retirementData]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!customer) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
          Financial Health Metrics
        </h3>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Health Score</h4>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">{healthScore}</span>
              <span className="text-xs text-gray-500 ml-1">/100</span>
              
              {/* Score change indicator */}
              {loan && (
                <span className={`ml-2 flex items-center text-xs ${loan.loanType === 'home' ? 'text-green-600' : 'text-red-600'}`}>
                  {loan.loanType === 'home' ? (
                    <>
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      +5
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                      -5
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-24 h-24">
            <div className="relative w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`${
                    healthScore >= 80 ? 'text-green-500' : 
                    healthScore >= 60 ? 'text-indigo-500' : 
                    healthScore >= 40 ? 'text-amber-500' : 
                    'text-red-500'
                  }`}
                  strokeWidth="8"
                  strokeDasharray={`${healthScore * 2.51} 251.2`} // 251.2 is the circumference of a circle with r=40
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Banking Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Banking</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wallet className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Checking Balance</span>
                </div>
                <span className="text-sm font-medium">
                  {bankAccount ? formatCurrency(bankAccount.balance) : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Credit Utilization</span>
                </div>
                <span className="text-sm font-medium">
                  {creditCard ? '32%' : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Landmark className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Debt-to-Income</span>
                </div>
                <span className="text-sm font-medium">
                  {loan ? '28%' : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Investment Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Investments</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Portfolio Value</span>
                </div>
                <span className="text-sm font-medium">
                  {retirementData ? formatCurrency(retirementData.currentSavings) : 'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Retirement Readiness</span>
                </div>
                <span className="text-sm font-medium">
                  {portfolios.length > 0 && retirementData ? 
                    `${Math.round((portfolios[0].projectedFund / (retirementData.annualIncome * 25)) * 100)}%` : 
                    'N/A'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 text-indigo-500 mr-1.5" />
                  <span className="text-sm text-gray-600">Risk Level</span>
                </div>
                <span className="text-sm font-medium">
                  {portfolios.length > 0 ? portfolios[0].riskLevel : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            View Detailed Financial Health Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthMetrics;