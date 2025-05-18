import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { useAppContext } from '../../../context/AppContext';
import { 
  TrendingUp, 
  BarChart3, 
  CreditCard, 
  Landmark, 
  ArrowRight, 
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  BadgeDollarSign,
  BarChartBig,
  PieChart,
  HelpCircle
} from 'lucide-react';
import PortfolioDonutChart from '../../visualizations/PortfolioDonutChart';

const LoanPortfolioIntegration: React.FC = () => {
  const { customer, loan } = useBankingContext();
  const { portfolios, retirementData } = useAppContext();
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<number>(65);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  const [loanImpact, setLoanImpact] = useState<{
    score: number;
    timeToRetirement: number;
    retirementIncome: number;
    message: string;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>({
    score: 0,
    timeToRetirement: 0,
    retirementIncome: 0,
    message: "",
    sentiment: 'neutral'
  });
  
  // Set default selected portfolio if available
  useEffect(() => {
    if (portfolios.length > 0) {
      setSelectedPortfolio(portfolios[0].type);
    }
  }, [portfolios]);
  
  const handlePortfolioSelect = (portfolioType: string) => {
    setSelectedPortfolio(portfolioType);
    
    // Simulate calculation
    setIsCalculating(true);
    setTimeout(() => {
      calculateLoanImpact(portfolioType);
      setIsCalculating(false);
      setShowRecommendations(true);
    }, 1500);
  };
  
  // Calculate the impact of the loan on the selected portfolio
  const calculateLoanImpact = (portfolioType: string) => {
    // Get the selected portfolio
    const portfolio = portfolios.find(p => p.type === portfolioType);
    if (!portfolio || !loan || !retirementData) return;
    
    // Basic impact calculation logic (simplified for demo purposes)
    const loanPayment = loan.monthlyPayment;
    const annualLoanPayment = loanPayment * 12;
    
    // Calculate reduction in savings capacity
    const currentSavingsRate = retirementData.annualIncome * 0.15; // Assuming 15% savings rate
    const newSavingsRate = Math.max(0, currentSavingsRate - annualLoanPayment);
    const savingsReductionRate = (currentSavingsRate - newSavingsRate) / currentSavingsRate;
    
    // Impact on retirement timeline
    let timeToRetirement = retirementData.retirementAge - retirementData.age;
    let retirementDelay = 0;
    
    if (savingsReductionRate > 0.5) {
      // Significant impact - might delay retirement by 2-5 years
      retirementDelay = Math.min(5, Math.floor(savingsReductionRate * 10));
    } else if (savingsReductionRate > 0.2) {
      // Moderate impact - might delay retirement by 1-2 years
      retirementDelay = Math.min(2, Math.floor(savingsReductionRate * 5));
    }
    
    // Impact on retirement income
    const projectedFund = portfolio.projectedFund;
    const reducedFund = projectedFund * (1 - savingsReductionRate * 0.5); // Simplistic calculation
    const currentRetirementIncome = projectedFund * 0.04; // 4% rule
    const newRetirementIncome = reducedFund * 0.04;
    
    // Financial health score adjustment
    let scoreImpact = 0;
    if (loan.loanType === 'home') {
      // Home loans can be positive for long-term wealth
      scoreImpact = savingsReductionRate < 0.3 ? 5 : -5;
    } else if (loan.loanType === 'auto') {
      // Auto loans typically have moderate negative impact
      scoreImpact = -5;
    } else {
      // Personal loans often have more negative impact on retirement
      scoreImpact = -10;
    }
    
    // Generate impact message
    let impactMessage = "";
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    
    if (retirementDelay > 3) {
      impactMessage = `This loan may significantly impact your retirement plans, potentially delaying retirement by approximately ${retirementDelay} years and reducing your monthly retirement income by ${Math.round((currentRetirementIncome - newRetirementIncome) / 12).toLocaleString()} per month.`;
      sentiment = 'negative';
    } else if (retirementDelay > 0) {
      impactMessage = `This loan could moderately affect your retirement timeline, potentially delaying retirement by ${retirementDelay} ${retirementDelay === 1 ? 'year' : 'years'} and reducing your monthly retirement income by about ${Math.round((currentRetirementIncome - newRetirementIncome) / 12).toLocaleString()} per month.`;
      sentiment = 'neutral';
    } else {
      impactMessage = `This loan appears to have minimal impact on your retirement plans. Your retirement timeline remains on track, with only a small reduction of about ${Math.round((currentRetirementIncome - newRetirementIncome) / 12).toLocaleString()} in projected monthly retirement income.`;
      sentiment = 'positive';
    }
    
    // Update loan impact state
    setLoanImpact({
      score: healthScore + scoreImpact,
      timeToRetirement: timeToRetirement + retirementDelay,
      retirementIncome: newRetirementIncome,
      message: impactMessage,
      sentiment
    });
    
    // Update health score
    setHealthScore(prev => Math.max(0, Math.min(100, prev + scoreImpact)));
  };
  
  // Get recommendations based on portfolio and loan
  const getRecommendations = () => {
    if (!selectedPortfolio || !loan) return [];
    
    const portfolio = portfolios.find(p => p.type === selectedPortfolio);
    if (!portfolio) return [];
    
    const recommendations = [];
    
    // Adjust asset allocation
    if (loan.loanType === 'home' && portfolio.type === 'Aggressive') {
      recommendations.push({
        title: "Rebalance Investment Portfolio",
        description: "Consider increasing your bond allocation by 5-10% to reduce risk while you're paying off your mortgage.",
        actionText: "Review Portfolio"
      });
    }
    
    // Investment account recommendation
    if (loan.loanType === 'personal' && portfolio.type !== 'Safe') {
      recommendations.push({
        title: "Debt Consolidation Strategy",
        description: "Consider a debt consolidation approach to lower your overall interest payments while maintaining your investment strategy.",
        actionText: "Learn More"
      });
    }
    
    // Cash reserves recommendation
    if (loan.monthlyPayment > 1000) {
      recommendations.push({
        title: "Increase Emergency Fund",
        description: "With this loan payment, we recommend increasing your emergency fund to 6 months of expenses for greater financial security.",
        actionText: "Set Up Savings Plan"
      });
    }
    
    // Cross-sell opportunity
    if (loan.loanType === 'home') {
      recommendations.push({
        title: "HELOC Opportunity",
        description: "A Home Equity Line of Credit could provide flexible access to funds at a lower rate than personal loans or credit cards.",
        actionText: "Explore HELOC Options"
      });
    }
    
    return recommendations;
  };
  
  // Format as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // If no portfolios or no loan, show a message
  if (portfolios.length === 0) {
    return (
      <div className="bg-yellow-50 rounded-lg p-6 text-center">
        <HelpCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-yellow-800 mb-2">No Investment Portfolio Found</h3>
        <p className="text-yellow-700 mb-4">
          To see how your loan affects your retirement plans, you'll need to set up an investment portfolio.
        </p>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          Create Investment Portfolio
        </button>
      </div>
    );
  }
  
  if (!loan) {
    return (
      <div className="bg-yellow-50 rounded-lg p-6 text-center">
        <HelpCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-yellow-800 mb-2">No Active Loan Application</h3>
        <p className="text-yellow-700 mb-4">
          Please complete your loan application to see how it impacts your investment portfolio and financial health.
        </p>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
          Return to Application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
        <h2 className="text-lg font-medium text-indigo-900">Portfolio & Loan Integration</h2>
        <p className="text-sm text-indigo-700">
          See how your loan application impacts your investment portfolio and overall financial health
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Financial Health Score */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Financial Health Score</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  {/* Circular progress indicator */}
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
                        healthScore >= 60 ? 'text-blue-500' : 
                        healthScore >= 40 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}
                      strokeWidth="8"
                      strokeDasharray={`${healthScore * 2.51} 251.2`}
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
                      <span className="text-3xl font-bold">{healthScore}</span>
                      <span className="text-sm block">/100</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Debt Ratio</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-xs font-medium">35%</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Savings Rate</p>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-xs font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loan Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 capitalize">{loan.loanType} Loan</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Loan Amount</span>
                  <span className="text-sm font-medium">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Monthly Payment</span>
                  <span className="text-sm font-medium">{formatCurrency(loan.monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Loan Term</span>
                  <span className="text-sm font-medium">{loan.term} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Interest Rate</span>
                  <span className="text-sm font-medium">{loan.interestRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total Interest</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(loan.monthlyPayment * loan.term - loan.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Portfolio Selection */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Link Investment Portfolio</h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">
                Select your investment portfolio to analyze how this loan impacts your retirement goals:
              </p>
              
              <div className="space-y-2">
                {portfolios.map(portfolio => (
                  <div 
                    key={portfolio.type}
                    onClick={() => handlePortfolioSelect(portfolio.type)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPortfolio === portfolio.type
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: portfolio.colorScheme.primary }}
                      ></div>
                      <span className="text-sm font-medium">{portfolio.type} Portfolio</span>
                      
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        portfolio.riskLevel === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : portfolio.riskLevel === 'Medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {portfolio.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Impact Analysis */}
        {isCalculating ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Impact</h3>
            <p className="text-gray-600">
              Our AI is analyzing how this loan affects your investment portfolio and retirement goals...
            </p>
          </div>
        ) : selectedPortfolio && showRecommendations ? (
          <div className="space-y-6">
            {/* Loan Impact Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                  Loan Impact Analysis
                </h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className={`p-4 rounded-lg ${
                    loanImpact.sentiment === 'positive' ? 'bg-green-50 border border-green-100' :
                    loanImpact.sentiment === 'negative' ? 'bg-red-50 border border-red-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}>
                    <div className="flex items-start">
                      {loanImpact.sentiment === 'positive' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : loanImpact.sentiment === 'negative' ? (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <p className={`text-sm ${
                        loanImpact.sentiment === 'positive' ? 'text-green-700' :
                        loanImpact.sentiment === 'negative' ? 'text-red-700' :
                        'text-blue-700'
                      }`}>{loanImpact.message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Financial Health Score */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-900">Financial Health Score</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gray-900">{loanImpact.score}</div>
                      <div className={`text-sm px-2 py-0.5 rounded-full ${
                        loanImpact.score > healthScore ? 'bg-green-100 text-green-800' : 
                        loanImpact.score < healthScore ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {loanImpact.score > healthScore ? `+${loanImpact.score - healthScore}` : 
                         loanImpact.score < healthScore ? `${loanImpact.score - healthScore}` : 
                         'No Change'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Retirement Timeline */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <Landmark className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-900">Retirement Timeline</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gray-900">
                        {loanImpact.timeToRetirement} <span className="text-lg font-normal">years</span>
                      </div>
                      <div className={`text-sm px-2 py-0.5 rounded-full ${
                        loanImpact.timeToRetirement < (retirementData?.retirementAge || 0) - (retirementData?.age || 0) 
                          ? 'bg-green-100 text-green-800' 
                          : loanImpact.timeToRetirement > (retirementData?.retirementAge || 0) - (retirementData?.age || 0)
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loanImpact.timeToRetirement < (retirementData?.retirementAge || 0) - (retirementData?.age || 0)
                          ? `${(retirementData?.retirementAge || 0) - (retirementData?.age || 0) - loanImpact.timeToRetirement} years earlier`
                          : loanImpact.timeToRetirement > (retirementData?.retirementAge || 0) - (retirementData?.age || 0)
                          ? `${loanImpact.timeToRetirement - ((retirementData?.retirementAge || 0) - (retirementData?.age || 0))} years delay`
                          : 'No change'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Retirement Income */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-2">
                      <BadgeDollarSign className="h-5 w-5 text-indigo-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-900">Annual Retirement Income</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-gray-900">{formatCurrency(loanImpact.retirementIncome)}</div>
                      <div className={`text-sm px-2 py-0.5 rounded-full ${
                        loanImpact.retirementIncome > (portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0) 
                          ? 'bg-green-100 text-green-800' 
                          : loanImpact.retirementIncome < (portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0)
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loanImpact.retirementIncome > (portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0)
                          ? `+${formatCurrency(loanImpact.retirementIncome - (portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0))}`
                          : loanImpact.retirementIncome < (portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0)
                          ? `-${formatCurrency((portfolios.find(p => p.type === selectedPortfolio)?.annualWithdrawal || 0) - loanImpact.retirementIncome)}`
                          : 'No change'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Portfolio Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
                    Current Portfolio Allocation
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex justify-center mb-4">
                    {selectedPortfolio && (
                      <PortfolioDonutChart 
                        allocation={portfolios.find(p => p.type === selectedPortfolio)?.allocation || {
                          stocks: 0,
                          bonds: 0,
                          reits: 0,
                          international: 0,
                          alternatives: 0,
                          cash: 0
                        }}
                        colorPrimary={portfolios.find(p => p.type === selectedPortfolio)?.colorScheme.primary || '#3b82f6'}
                        colorSecondary={portfolios.find(p => p.type === selectedPortfolio)?.colorScheme.secondary || '#60a5fa'}
                        colorAccent={portfolios.find(p => p.type === selectedPortfolio)?.colorScheme.accent || '#93c5fd'}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-gray-500">Stocks:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.stocks}%</div>
                    <div><span className="text-gray-500">Bonds:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.bonds}%</div>
                    <div><span className="text-gray-500">REITs:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.reits}%</div>
                    <div><span className="text-gray-500">International:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.international}%</div>
                    <div><span className="text-gray-500">Alternatives:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.alternatives}%</div>
                    <div><span className="text-gray-500">Cash:</span> {portfolios.find(p => p.type === selectedPortfolio)?.allocation.cash}%</div>
                  </div>
                </div>
              </div>
              
              {/* Smart Recommendations */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <BarChartBig className="h-5 w-5 mr-2 text-indigo-600" />
                    Financial Recommendations
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {getRecommendations().map((rec, index) => (
                      <div key={index} className="border border-indigo-100 rounded-lg p-3 bg-indigo-50">
                        <h4 className="text-sm font-medium text-indigo-900 mb-1">{rec.title}</h4>
                        <p className="text-xs text-indigo-700 mb-2">{rec.description}</p>
                        <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors">
                          {rec.actionText}
                        </button>
                      </div>
                    ))}
                    
                    {getRecommendations().length === 0 && (
                      <div className="text-center py-4">
                        <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No recommendations available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cross-Product Recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                  Complementary Products
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">Cash Back Credit Card</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {loan.loanType === 'home' ? 
                        "Earn 5% cash back on home improvement purchases for the first year." :
                        "Earn 3% cash back on all purchases to help offset loan payments."}
                    </p>
                    <button className="w-full bg-indigo-100 text-indigo-700 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors">
                      Apply Now
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">No annual fee</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {loan.loanType === 'home' ? "Automatic Loan Acceleration" : "Loan Protection Plan"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {loan.loanType === 'home' ? 
                        "Round up payments to pay off your mortgage up to 5 years faster." :
                        "Protection if you're unable to make payments due to unemployment or disability."}
                    </p>
                    <button className="w-full bg-green-100 text-green-700 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                      Learn More
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {loan.loanType === 'home' ? 
                        "Save thousands in interest" :
                        "Only $15/month"}
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <BadgeDollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {loan.loanType === 'home' ? "High-Yield Savings Account" : "Automated Savings Plan"}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {loan.loanType === 'home' ? 
                        "Earn 4.15% APY while saving for home maintenance expenses." :
                        "Build your emergency fund while paying down your loan."}
                    </p>
                    <button className="w-full bg-blue-100 text-blue-700 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                      Open Account
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      No minimum balance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-indigo-800 mb-2">Select your investment portfolio</h3>
            <p className="text-indigo-600 mb-4">
              Choose a portfolio from the options above to see how this loan impacts your retirement goals
            </p>
            <div className="w-24 h-24 mx-auto opacity-50">
              <TrendingUp className="w-full h-full text-indigo-300" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanPortfolioIntegration;