import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { useAppContext } from '../../context/AppContext';
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Home, 
  ShieldCheck, 
  AlertTriangle,
  Calendar,
  Clock,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';

// This component will be used in the dashboard to show a holistic view of financial health
// by integrating banking and investment data

const FinancialHealthDashboard: React.FC = () => {
  const { customer, bankAccount, creditCard, loan, documents } = useBankingContext();
  const { portfolios, retirementData } = useAppContext();
  const [healthScore, setHealthScore] = useState<number>(65);
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    savings: number;
    debt: number;
    protection: number;
    retirement: number;
  }>({
    savings: 0,
    debt: 0,
    protection: 0,
    retirement: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Calculate financial health score based on all data
  useEffect(() => {
    // Only calculate if we have some data
    if (!customer && portfolios.length === 0) return;
    
    setLoading(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Each component has a max of 25 points
      let savingsScore = 0;
      let debtScore = 0;
      let protectionScore = 0;
      let retirementScore = 0;
      
      // Calculate savings score
      if (bankAccount) {
        // Simplified scoring based on balance
        const monthlyIncome = (customer?.annualIncome || 0) / 12;
        const monthsOfExpenses = bankAccount.balance / (monthlyIncome * 0.7); // Assuming 70% of income is expenses
        
        // Score based on months of emergency fund (3-6 months is ideal)
        if (monthsOfExpenses >= 6) {
          savingsScore = 25;
        } else if (monthsOfExpenses >= 3) {
          savingsScore = 20;
        } else if (monthsOfExpenses >= 1) {
          savingsScore = 15;
        } else {
          savingsScore = 10;
        }
      } else {
        savingsScore = 10; // Default if no bank account
      }
      
      // Calculate debt score
      let debtToIncomeRatio = 0;
      const monthlyIncome = (customer?.annualIncome || 0) / 12;
      
      if (monthlyIncome > 0) {
        const creditCardPayment = creditCard ? (creditCard.creditLimit * 0.03) : 0; // Minimum payment estimate
        const loanPayment = loan ? loan.monthlyPayment : 0;
        
        debtToIncomeRatio = (creditCardPayment + loanPayment) / monthlyIncome;
        
        // Score based on DTI ratio (lower is better)
        if (debtToIncomeRatio < 0.15) {
          debtScore = 25;
        } else if (debtToIncomeRatio < 0.3) {
          debtScore = 20;
        } else if (debtToIncomeRatio < 0.4) {
          debtScore = 15;
        } else if (debtToIncomeRatio < 0.5) {
          debtScore = 10;
        } else {
          debtScore = 5;
        }
      } else {
        debtScore = 15; // Default if no income data
      }
      
      // Calculate protection score
      // Simple scoring based on document verification
      const hasVerifiedID = documents.some(doc => 
        (doc.type === 'id' || doc.type === 'passport' || doc.type === 'driver-license') && 
        doc.status === 'verified'
      );
      
      const hasAddress = documents.some(doc => 
        (doc.type === 'utility-bill' || doc.type === 'bank-statement') && 
        doc.status === 'verified'
      );
      
      protectionScore = (hasVerifiedID ? 15 : 0) + (hasAddress ? 10 : 0);
      
      // Calculate retirement score
      if (portfolios.length > 0 && retirementData) {
        // Find highest projected fund
        const maxProjectedFund = Math.max(...portfolios.map(p => p.projectedFund));
        const annualIncome = retirementData.annualIncome;
        
        // Calculate retirement readiness (projected fund / annual income)
        // A multiple of 10-12x income is considered good for retirement
        const incomeMultiple = maxProjectedFund / annualIncome;
        
        if (incomeMultiple >= 10) {
          retirementScore = 25;
        } else if (incomeMultiple >= 7) {
          retirementScore = 20;
        } else if (incomeMultiple >= 5) {
          retirementScore = 15;
        } else if (incomeMultiple >= 3) {
          retirementScore = 10;
        } else {
          retirementScore = 5;
        }
      } else {
        retirementScore = 5; // Default if no portfolio data
      }
      
      // Set breakdown
      setScoreBreakdown({
        savings: savingsScore,
        debt: debtScore,
        protection: protectionScore,
        retirement: retirementScore
      });
      
      // Calculate overall score
      const totalScore = savingsScore + debtScore + protectionScore + retirementScore;
      setHealthScore(totalScore);
      setLoading(false);
    }, 1000);
  }, [customer, bankAccount, creditCard, loan, documents, portfolios, retirementData]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <h2 className="font-medium text-lg text-indigo-900">Financial Health Dashboard</h2>
        <p className="text-sm text-indigo-700">
          Holistic view of your financial wellbeing across banking and investment
        </p>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <p className="text-gray-600">Calculating your financial health score...</p>
          </div>
        ) : (
          <>
            {/* Health Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white p-6">
                <h3 className="text-lg font-medium mb-4">Financial Health Score</h3>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    {/* Circular progress indicator */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-white opacity-20"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-white"
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold">{healthScore}</span>
                        <span className="text-sm opacity-90 block">out of 100</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Score breakdown */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Savings & Liquidity</span>
                      <span>{scoreBreakdown.savings}/25</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${(scoreBreakdown.savings / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Debt Management</span>
                      <span>{scoreBreakdown.debt}/25</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${(scoreBreakdown.debt / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Protection</span>
                      <span>{scoreBreakdown.protection}/25</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${(scoreBreakdown.protection / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Retirement</span>
                      <span>{scoreBreakdown.retirement}/25</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                      <div 
                        className="bg-white h-1.5 rounded-full" 
                        style={{ width: `${(scoreBreakdown.retirement / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Banking Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Wallet className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Banking Health</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Checking Balance</p>
                        <p className="text-lg font-medium text-gray-900">{bankAccount ? formatCurrency(bankAccount.balance) : '$0'}</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Credit Utilization</p>
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-gray-900">
                            {creditCard ? '32%' : 'N/A'}
                          </p>
                          {creditCard && (
                            <span className="ml-2 text-xs text-green-600 flex items-center">
                              <ArrowDownRight className="h-3 w-3 mr-0.5" />
                              4%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded-full">
                        <CreditCard className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Monthly Debt Payment</p>
                        <p className="text-lg font-medium text-gray-900">
                          {loan ? formatCurrency(loan.monthlyPayment) : '$0'}
                        </p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-full">
                        <Calendar className="h-6 w-6 text-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Investment Summary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                    <h3 className="font-medium text-gray-900">Investment Health</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Current Savings</p>
                        <p className="text-lg font-medium text-gray-900">{retirementData ? formatCurrency(retirementData.currentSavings) : '$0'}</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded-full">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Retirement Projection</p>
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-gray-900">
                            {portfolios.length > 0 ? formatCurrency(Math.max(...portfolios.map(p => p.projectedFund))) : 'N/A'}
                          </p>
                          {portfolios.length > 0 && (
                            <span className="ml-2 text-xs text-green-600 flex items-center">
                              <ArrowUpRight className="h-3 w-3 mr-0.5" />
                              7%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-2 rounded-full">
                        <Home className="h-6 w-6 text-indigo-500" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Years to Retirement</p>
                        <p className="text-lg font-medium text-gray-900">
                          {retirementData ? retirementData.retirementAge - retirementData.age : 'N/A'}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Clock className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Risk Factors & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Factors */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    Risk Factors
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {healthScore < 30 ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800">Critical Financial Risk</h4>
                            <p className="text-xs text-red-700 mt-1">Your financial health score indicates serious concerns that need immediate attention.</p>
                          </div>
                        </div>
                      </div>
                    ) : healthScore < 50 ? (
                      <>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-amber-800">Debt-to-Income Ratio</h4>
                              <p className="text-xs text-amber-700 mt-1">Your debt payments are higher than recommended for financial stability.</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-amber-800">Emergency Savings</h4>
                              <p className="text-xs text-amber-700 mt-1">Your emergency fund is below the recommended 3-6 months of expenses.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : healthScore < 70 ? (
                      <>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Retirement Savings Rate</h4>
                              <p className="text-xs text-blue-700 mt-1">Your current savings rate may not be sufficient to meet your retirement goals.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="flex">
                          <ShieldCheck className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-green-800">Strong Financial Position</h4>
                            <p className="text-xs text-green-700 mt-1">Your financial health is strong with no significant risk factors identified.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {loan && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">New Loan Impact</h4>
                            <p className="text-xs text-blue-700 mt-1">Your new loan will increase your debt obligations by {formatCurrency(loan.monthlyPayment)} monthly.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Add more risk factors based on the score breakdown */}
                    {scoreBreakdown.retirement < 15 && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800">Retirement Readiness</h4>
                            <p className="text-xs text-blue-700 mt-1">Your retirement projections indicate you may not have sufficient savings by your target retirement age.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Smart Recommendations */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-indigo-600" />
                    AI-Powered Financial Recommendations
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Recommendations based on score */}
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <div className="flex items-center mb-2">
                        <PieChart className="h-5 w-5 text-indigo-600 mr-2" />
                        <h4 className="font-medium text-indigo-900">Portfolio Optimization</h4>
                      </div>
                      <p className="text-sm text-indigo-700 mb-3">
                        {portfolios.length > 0 ? (
                          portfolios[0].riskLevel === 'High' ? 
                            "Consider diversifying your aggressive portfolio to include more stable assets given your new loan obligations." :
                            "Your current portfolio is well-balanced with your new loan. Consider increasing retirement contributions once your debt is reduced."
                        ) : (
                          "Start building an investment portfolio with automatic contributions to balance your new loan with long-term growth."
                        )}
                      </p>
                      <button className="w-full bg-indigo-600 text-white py-1.5 text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        View Portfolio Options
                      </button>
                    </div>
                    
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center mb-2">
                        <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-900">Debt Optimization</h4>
                      </div>
                      <p className="text-sm text-green-700 mb-3">
                        {loan ? (
                          loan.loanType === 'home' ? 
                            "Consider setting up bi-weekly payments on your mortgage to save on interest and pay off your home sooner." :
                            "Setup automatic extra payments to reduce your loan term and save on interest charges."
                        ) : (
                          creditCard ? 
                            "Pay more than the minimum payment on your credit card to reduce interest charges and improve your credit score." :
                            "Your debt management is on track. Continue to avoid high-interest debt."
                        )}
                      </p>
                      <button className="w-full bg-green-600 text-white py-1.5 text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Optimize Payments
                      </button>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-blue-900">Savings Strategy</h4>
                      </div>
                      <p className="text-sm text-blue-700 mb-3">
                        {bankAccount && bankAccount.balance > 0 ? (
                          bankAccount.balance > (customer?.annualIncome || 0) / 4 ?
                            "Your savings are healthy. Consider allocating some funds to your investment portfolio for better long-term growth." :
                            "Build your emergency fund to at least 3 months of expenses before increasing loan payments."
                        ) : (
                          "Start building an emergency fund with automatic transfers to cover unexpected expenses."
                        )}
                      </p>
                      <button className="w-full bg-blue-600 text-white py-1.5 text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Setup Savings Plan
                      </button>
                    </div>
                    
                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                        <h4 className="font-medium text-purple-900">Retirement Planning</h4>
                      </div>
                      <p className="text-sm text-purple-700 mb-3">
                        {retirementData ? (
                          retirementData.currentSavings > retirementData.annualIncome ?
                            "You're on track for retirement. Consider increasing your contributions to your tax-advantaged retirement accounts." :
                            "Increase your retirement contributions to at least 15% of your income to stay on track with your retirement goals."
                        ) : (
                          "Start planning for retirement by setting up automatic contributions to a retirement account."
                        )}
                      </p>
                      <button className="w-full bg-purple-600 text-white py-1.5 text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        View Retirement Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialHealthDashboard;