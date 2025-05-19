import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  PieChart, 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Zap, 
  AlertTriangle, 
  ArrowRight, 
  FileText, 
  RefreshCw,
  Sliders,
  ArrowUpRight,
  Calendar,
  Check
} from 'lucide-react';

interface AssetClass {
  id: string;
  name: string;
  currentAllocation: number;
  recommendedAllocation: number;
  currentAmount: number;
  expectedReturn: number;
  risk: number;
  color: string;
}

interface Portfolio {
  totalValue: number;
  riskScore: number; // 1-100
  expectedReturn: number;
  assetClasses: AssetClass[];
  rebalancingNeeded: boolean;
  taxEfficiencyScore: number; // 1-100
  diversificationScore: number; // 1-100
  lastRebalanced: Date;
}

const PortfolioOptimizationView: React.FC = () => {
  const { customer, bankAccount } = useBankingContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<Portfolio | null>(null);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'current' | 'optimized'>('current');
  const [optimizationFocus, setOptimizationFocus] = useState<'balanced' | 'growth' | 'income' | 'tax' | 'risk'>('balanced');

  // Generate mock portfolio data based on customer profile
  useEffect(() => {
    if (!customer) return;

    const totalValue = bankAccount?.balance || 150000;

    const initialAssetClasses: AssetClass[] = [
      {
        id: 'us-stocks',
        name: 'US Stocks',
        currentAllocation: 45,
        recommendedAllocation: 50,
        currentAmount: totalValue * 0.45,
        expectedReturn: 8.5,
        risk: 75,
        color: '#4f46e5' // indigo-600
      },
      {
        id: 'intl-stocks',
        name: 'International Stocks',
        currentAllocation: 15,
        recommendedAllocation: 20,
        currentAmount: totalValue * 0.15,
        expectedReturn: 9.0,
        risk: 80,
        color: '#8b5cf6' // violet-500
      },
      {
        id: 'bonds',
        name: 'Bonds',
        currentAllocation: 25,
        recommendedAllocation: 20,
        currentAmount: totalValue * 0.25,
        expectedReturn: 4.0,
        risk: 30,
        color: '#10b981' // emerald-500
      },
      {
        id: 'reits',
        name: 'REITs',
        currentAllocation: 5,
        recommendedAllocation: 5,
        currentAmount: totalValue * 0.05,
        expectedReturn: 7.0,
        risk: 65,
        color: '#f59e0b' // amber-500
      },
      {
        id: 'commodities',
        name: 'Commodities',
        currentAllocation: 2,
        recommendedAllocation: 0,
        currentAmount: totalValue * 0.02,
        expectedReturn: 5.0,
        risk: 70,
        color: '#ef4444' // red-500
      },
      {
        id: 'cash',
        name: 'Cash & Equivalents',
        currentAllocation: 8,
        recommendedAllocation: 5,
        currentAmount: totalValue * 0.08,
        expectedReturn: 1.5,
        risk: 5,
        color: '#3b82f6' // blue-500
      }
    ];

    // Calculate weighted average expected return and risk
    const weightedReturn = initialAssetClasses.reduce(
      (sum, asset) => sum + (asset.currentAllocation / 100) * asset.expectedReturn,
      0
    );

    const weightedRisk = initialAssetClasses.reduce(
      (sum, asset) => sum + (asset.currentAllocation / 100) * asset.risk,
      0
    );

    const initialPortfolio: Portfolio = {
      totalValue,
      riskScore: Math.round(weightedRisk),
      expectedReturn: weightedReturn,
      assetClasses: initialAssetClasses,
      rebalancingNeeded: true,
      taxEfficiencyScore: 75,
      diversificationScore: 80,
      lastRebalanced: new Date(new Date().setMonth(new Date().getMonth() - 3))
    };

    setPortfolio(initialPortfolio);
  }, [customer, bankAccount]);

  // Generate optimized portfolio based on selected focus
  const optimizePortfolio = () => {
    if (!portfolio) return;

    setIsOptimizing(true);

    // Simulate a delay for optimization processing
    setTimeout(() => {
      // Clone the current portfolio
      const basePortfolio = JSON.parse(JSON.stringify(portfolio)) as Portfolio;

      // Adjust based on optimization focus
      switch (optimizationFocus) {
        case 'growth':
          // Increase stock allocation for more growth
          basePortfolio.assetClasses.forEach(asset => {
            if (asset.id === 'us-stocks') {
              asset.recommendedAllocation = 55;
            } else if (asset.id === 'intl-stocks') {
              asset.recommendedAllocation = 25;
            } else if (asset.id === 'bonds') {
              asset.recommendedAllocation = 10;
            } else if (asset.id === 'cash') {
              asset.recommendedAllocation = 3;
            } else if (asset.id === 'commodities') {
              asset.recommendedAllocation = 2;
            }
          });
          break;
        case 'income':
          // Increase bond and dividend stock allocation
          basePortfolio.assetClasses.forEach(asset => {
            if (asset.id === 'us-stocks') {
              asset.recommendedAllocation = 40;
            } else if (asset.id === 'bonds') {
              asset.recommendedAllocation = 35;
            } else if (asset.id === 'reits') {
              asset.recommendedAllocation = 10;
            } else if (asset.id === 'intl-stocks') {
              asset.recommendedAllocation = 10;
            } else if (asset.id === 'cash') {
              asset.recommendedAllocation = 5;
            } else if (asset.id === 'commodities') {
              asset.recommendedAllocation = 0;
            }
          });
          break;
        case 'tax':
          // Improve tax efficiency
          basePortfolio.assetClasses.forEach(asset => {
            if (asset.id === 'bonds') {
              asset.recommendedAllocation = 20;
            } else if (asset.id === 'us-stocks') {
              asset.recommendedAllocation = 45;
            } else if (asset.id === 'intl-stocks') {
              asset.recommendedAllocation = 25;
            } else if (asset.id === 'reits') {
              asset.recommendedAllocation = 0;
            } else if (asset.id === 'cash') {
              asset.recommendedAllocation = 10;
            } else if (asset.id === 'commodities') {
              asset.recommendedAllocation = 0;
            }
          });
          basePortfolio.taxEfficiencyScore = 92;
          break;
        case 'risk':
          // Reduce risk
          basePortfolio.assetClasses.forEach(asset => {
            if (asset.id === 'us-stocks') {
              asset.recommendedAllocation = 35;
            } else if (asset.id === 'intl-stocks') {
              asset.recommendedAllocation = 10;
            } else if (asset.id === 'bonds') {
              asset.recommendedAllocation = 40;
            } else if (asset.id === 'cash') {
              asset.recommendedAllocation = 15;
            } else if (asset.id === 'reits') {
              asset.recommendedAllocation = 0;
            } else if (asset.id === 'commodities') {
              asset.recommendedAllocation = 0;
            }
          });
          break;
        case 'balanced':
        default:
          // Keep the original recommendations
          break;
      }

      // Update recommended amounts based on new allocations
      basePortfolio.assetClasses.forEach(asset => {
        asset.currentAmount = (asset.currentAllocation / 100) * basePortfolio.totalValue;
      });

      // Recalculate expected return and risk for the optimized portfolio
      const newWeightedReturn = basePortfolio.assetClasses.reduce(
        (sum, asset) => sum + (asset.recommendedAllocation / 100) * asset.expectedReturn,
        0
      );

      const newWeightedRisk = basePortfolio.assetClasses.reduce(
        (sum, asset) => sum + (asset.recommendedAllocation / 100) * asset.risk,
        0
      );

      basePortfolio.expectedReturn = newWeightedReturn;
      basePortfolio.riskScore = Math.round(newWeightedRisk);
      basePortfolio.diversificationScore = optimizationFocus === 'balanced' ? 92 : optimizationFocus === 'tax' ? 85 : 78;
      basePortfolio.taxEfficiencyScore = optimizationFocus === 'tax' ? 95 : basePortfolio.taxEfficiencyScore;

      setOptimizedPortfolio(basePortfolio);
      setIsOptimizing(false);
      setActiveTab('optimized');
    }, 1500);
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 60) return 'Moderate';
    if (score < 80) return 'Moderately High';
    return 'High';
  };

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
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const activePortfolio = activeTab === 'optimized' && optimizedPortfolio ? optimizedPortfolio : portfolio;

  if (!portfolio) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-indigo-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900">Loading portfolio data...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <PieChart className="h-6 w-6 text-indigo-600 mr-2" />
            Portfolio Optimization
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Analyze and optimize your investment portfolio with AI-powered recommendations.
          </p>
        </div>

        {/* Portfolio summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-indigo-100 mr-3">
                <DollarSign className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Total Value</h3>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(activePortfolio.totalValue)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Expected Return</h3>
                <p className="text-xl font-bold text-gray-900">{activePortfolio.expectedReturn.toFixed(1)}%</p>
                {activeTab === 'optimized' && optimizedPortfolio && (
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    +{(optimizedPortfolio.expectedReturn - portfolio.expectedReturn).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-yellow-100 mr-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Risk Level</h3>
                <p className="text-xl font-bold text-gray-900">{getRiskLabel(activePortfolio.riskScore)}</p>
                <p className="text-xs text-gray-500">{activePortfolio.riskScore}/100</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Diversification</h3>
                <p className="text-xl font-bold text-gray-900">{activePortfolio.diversificationScore}/100</p>
                {activeTab === 'optimized' && optimizedPortfolio && (
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    +{optimizedPortfolio.diversificationScore - portfolio.diversificationScore}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab controls for Current vs Optimized */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-4 text-sm font-medium flex-1 text-center ${
                activeTab === 'current'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('current')}
            >
              Current Portfolio
            </button>
            <button
              className={`py-4 px-4 text-sm font-medium flex-1 text-center ${
                activeTab === 'optimized'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              } ${!optimizedPortfolio && 'opacity-50 cursor-not-allowed'}`}
              onClick={() => optimizedPortfolio && setActiveTab('optimized')}
              disabled={!optimizedPortfolio}
            >
              Optimized Portfolio
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column - Allocation */}
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Allocation</h3>
                
                <div className="relative pt-[100%]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 300 300">
                      {/* Simplified pie chart */}
                      {activePortfolio.assetClasses.map((asset, i) => {
                        // Calculate the start and end angles for the pie slice
                        const total = activePortfolio.assetClasses.reduce((sum, a) => 
                          sum + (activeTab === 'optimized' ? a.recommendedAllocation : a.currentAllocation), 0);
                        
                        let startAngle = 0;
                        for (let j = 0; j < i; j++) {
                          startAngle += (activeTab === 'optimized' 
                            ? activePortfolio.assetClasses[j].recommendedAllocation 
                            : activePortfolio.assetClasses[j].currentAllocation) / total * 360;
                        }
                        
                        const angle = (activeTab === 'optimized' 
                          ? asset.recommendedAllocation 
                          : asset.currentAllocation) / total * 360;
                        
                        const endAngle = startAngle + angle;
                        
                        // Convert angles to radians
                        const startRad = (startAngle - 90) * Math.PI / 180;
                        const endRad = (endAngle - 90) * Math.PI / 180;
                        
                        // Calculate the SVG arc path
                        const radius = 120;
                        const x1 = 150 + radius * Math.cos(startRad);
                        const y1 = 150 + radius * Math.sin(startRad);
                        const x2 = 150 + radius * Math.cos(endRad);
                        const y2 = 150 + radius * Math.sin(endRad);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const pathData = `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                        
                        return (
                          <path 
                            key={asset.id} 
                            d={pathData} 
                            fill={asset.color} 
                            stroke="#ffffff" 
                            strokeWidth="1"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="mt-4 space-y-2">
                  {activePortfolio.assetClasses.map(asset => {
                    const allocation = activeTab === 'optimized' 
                      ? asset.recommendedAllocation 
                      : asset.currentAllocation;
                    
                    const delta = asset.recommendedAllocation - asset.currentAllocation;
                    
                    return (
                      <div key={asset.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-sm mr-2"
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className="text-sm">{asset.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{allocation}%</span>
                          {activeTab === 'optimized' && Math.abs(delta) > 0 && (
                            <span className={`text-xs ml-1.5 ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {delta > 0 ? `+${delta}` : delta}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Optimization options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Optimization Focus</h3>
                  
                  <div className="space-y-3">
                    <div 
                      className={`p-3 rounded-lg cursor-pointer ${
                        optimizationFocus === 'balanced'
                          ? 'bg-indigo-100 border border-indigo-200'
                          : 'bg-white border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50'
                      }`}
                      onClick={() => setOptimizationFocus('balanced')}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${
                          optimizationFocus === 'balanced' ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            optimizationFocus === 'balanced' ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="ml-2 font-medium text-gray-900">Balanced Growth</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Optimize for balanced risk and return
                      </p>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer ${
                        optimizationFocus === 'growth'
                          ? 'bg-indigo-100 border border-indigo-200'
                          : 'bg-white border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50'
                      }`}
                      onClick={() => setOptimizationFocus('growth')}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${
                          optimizationFocus === 'growth' ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            optimizationFocus === 'growth' ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="ml-2 font-medium text-gray-900">Maximum Growth</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Prioritize long-term growth potential
                      </p>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer ${
                        optimizationFocus === 'income'
                          ? 'bg-indigo-100 border border-indigo-200'
                          : 'bg-white border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50'
                      }`}
                      onClick={() => setOptimizationFocus('income')}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${
                          optimizationFocus === 'income' ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            optimizationFocus === 'income' ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="ml-2 font-medium text-gray-900">Income Generation</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Focus on dividend and interest income
                      </p>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer ${
                        optimizationFocus === 'tax'
                          ? 'bg-indigo-100 border border-indigo-200'
                          : 'bg-white border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50'
                      }`}
                      onClick={() => setOptimizationFocus('tax')}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${
                          optimizationFocus === 'tax' ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            optimizationFocus === 'tax' ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="ml-2 font-medium text-gray-900">Tax Efficiency</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Minimize tax impact of investments
                      </p>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer ${
                        optimizationFocus === 'risk'
                          ? 'bg-indigo-100 border border-indigo-200'
                          : 'bg-white border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50'
                      }`}
                      onClick={() => setOptimizationFocus('risk')}
                    >
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full ${
                          optimizationFocus === 'risk' ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            optimizationFocus === 'risk' ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <h4 className="ml-2 font-medium text-gray-900">Risk Reduction</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Minimize volatility and downside risk
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                    onClick={optimizePortfolio}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Optimize Portfolio
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right column - Performance metrics and recommendations */}
              <div className="md:col-span-2 space-y-6">
                {/* Portfolio metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Metrics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1.5" />
                        Risk Analysis
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Portfolio Risk Score</span>
                            <span className="text-xs font-medium text-gray-900">
                              {activePortfolio.riskScore}/100 ({getRiskLabel(activePortfolio.riskScore)})
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-amber-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.riskScore}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Volatility (Standard Deviation)</span>
                            <span className="text-xs font-medium text-gray-900">
                              {(activePortfolio.riskScore * 0.2).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-indigo-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.riskScore * 0.8}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Drawdown Risk (Max Loss)</span>
                            <span className="text-xs font-medium text-gray-900">
                              {(activePortfolio.riskScore * 0.5).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.riskScore * 0.9}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
                        Performance Potential
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Expected Annual Return</span>
                            <span className="text-xs font-medium text-gray-900">
                              {activePortfolio.expectedReturn.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.expectedReturn * 10}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Tax Efficiency</span>
                            <span className="text-xs font-medium text-gray-900">
                              {activePortfolio.taxEfficiencyScore}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.taxEfficiencyScore}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Diversification Score</span>
                            <span className="text-xs font-medium text-gray-900">
                              {activePortfolio.diversificationScore}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full" 
                              style={{width: `${activePortfolio.diversificationScore}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Asset Classes</p>
                        <p className="text-sm font-medium text-gray-900">{activePortfolio.assetClasses.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Rebalancing</p>
                        <p className="text-sm font-medium text-gray-900">
                          {activePortfolio.rebalancingNeeded ? 'Needed' : 'Not needed'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Rebalanced</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(activePortfolio.lastRebalanced)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Risk/Return Ratio</p>
                        <p className="text-sm font-medium text-gray-900">
                          {(activePortfolio.riskScore / (activePortfolio.expectedReturn * 10)).toFixed(1)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI recommendations */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Zap className="h-5 w-5 text-indigo-600 mr-2" />
                    AI Recommendations
                  </h3>
                  
                  {activeTab === 'current' ? (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-800 mb-1">Portfolio Rebalancing Needed</h4>
                            <p className="text-sm text-yellow-700">
                              Your portfolio has drifted from its target allocation. Rebalancing is recommended to maintain your risk and return profile.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Increase international exposure</p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Your international holdings are below the recommended allocation. Consider increasing 
                                your international exposure by 5% to improve diversification.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Reduce cash holdings</p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Your cash allocation (8%) is higher than the recommended 5%. Consider deploying 
                                some of this capital to higher-yielding assets.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-gray-800 font-medium">Eliminate commodities exposure</p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Your small allocation to commodities (2%) offers limited diversification benefit 
                                and increases portfolio complexity. Consider reallocating to your core holdings.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        onClick={optimizePortfolio}
                        disabled={isOptimizing}
                      >
                        {isOptimizing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Optimizing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Generate Optimized Portfolio
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                        <div className="flex">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-green-800 mb-1">Optimization Complete</h4>
                            <p className="text-sm text-green-700">
                              This optimized portfolio is designed to {
                                optimizationFocus === 'balanced' ? 'balance risk and return' :
                                optimizationFocus === 'growth' ? 'maximize long-term growth potential' :
                                optimizationFocus === 'income' ? 'generate steady income' :
                                optimizationFocus === 'tax' ? 'improve tax efficiency' :
                                'reduce overall portfolio risk'
                              }.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900">Key Changes</h4>
                      <div className="space-y-3">
                        {portfolio.assetClasses.map(asset => {
                          const optimizedAsset = optimizedPortfolio?.assetClasses.find(a => a.id === asset.id);
                          if (!optimizedAsset) return null;
                          
                          const delta = optimizedAsset.recommendedAllocation - asset.currentAllocation;
                          if (Math.abs(delta) < 2) return null; // Skip small changes
                          
                          return (
                            <div key={asset.id} className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-start">
                                <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-800 font-medium">
                                    {delta > 0 ? 'Increase' : 'Decrease'} {asset.name}
                                  </p>
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    {delta > 0 ? 'Increase' : 'Decrease'} your {asset.name} allocation from {asset.currentAllocation}% 
                                    to {optimizedAsset.recommendedAllocation}% ({Math.abs(delta)} percentage points).
                                  </p>
                                  <div className="mt-2 flex items-center text-xs">
                                    <span className={`px-1.5 py-0.5 rounded ${
                                      delta > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {delta > 0 ? '+' : ''}{delta}%
                                    </span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-500">
                                      {formatCurrency(asset.currentAmount)} → {
                                        formatCurrency((optimizedAsset.recommendedAllocation / 100) * portfolio.totalValue)
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                        <h4 className="font-medium text-indigo-800 mb-2">Implementation Plan</h4>
                        <p className="text-sm text-indigo-700 mb-3">
                          Follow these steps to rebalance your portfolio with tax-efficiency in mind:
                        </p>
                        <ol className="text-sm text-indigo-700 space-y-2 pl-5 list-decimal">
                          <li>Make new contributions to underweighted asset classes first</li>
                          <li>Rebalance within tax-advantaged accounts when possible</li>
                          <li>Consider tax-loss harvesting opportunities in taxable accounts</li>
                          <li>Implement changes gradually over 60 days to minimize market timing risk</li>
                        </ol>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors">
                          Export Plan
                        </button>
                        <button className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">
                          Implement Changes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Education tile */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                    Investment Education
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-1">Asset Allocation 101</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Understand how different asset classes work together in your portfolio.
                      </p>
                      <div className="flex items-center text-indigo-600 text-xs font-medium">
                        <span>Read article</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-1">Tax-Efficient Investing</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Learn strategies to minimize tax impact and maximize after-tax returns.
                      </p>
                      <div className="flex items-center text-indigo-600 text-xs font-medium">
                        <span>Read article</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-100 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <h4 className="font-medium text-gray-900 mb-1">Rebalancing Strategies</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        Discover when and how to rebalance for optimal portfolio management.
                      </p>
                      <div className="flex items-center text-indigo-600 text-xs font-medium">
                        <span>Read article</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioOptimizationView;