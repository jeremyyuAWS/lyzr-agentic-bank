import React, { useState, useEffect } from 'react';
import AIDecisionExplainer from '../shared/AIDecisionExplainer';
import { Shield, DollarSign, BadgePercent, CreditCard, RefreshCw, Calculator, BarChart3, Tag } from 'lucide-react';

interface CreditDecisionViewProps {
  creditScore?: number;
  income?: number;
  requestedLimit?: number;
  existingDebt?: number;
  employmentMonths?: number;
  applicationComplete?: boolean;
}

const CreditDecisionView: React.FC<CreditDecisionViewProps> = ({
  creditScore = 720,
  income = 85000,
  requestedLimit = 10000,
  existingDebt = 25000,
  employmentMonths = 36,
  applicationComplete = true
}) => {
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState<'approved' | 'denied' | 'review'>('review');
  
  // Simulate credit decision process
  useEffect(() => {
    if (applicationComplete) {
      setLoading(true);
      
      const timer = setTimeout(() => {
        // Make a decision based on the input parameters
        if (creditScore >= 700 && income > 50000 && employmentMonths >= 12) {
          setDecision('approved');
        } else if (creditScore < 580 || income < 30000) {
          setDecision('denied');
        } else {
          setDecision('review');
        }
        
        setLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [creditScore, income, requestedLimit, existingDebt, employmentMonths, applicationComplete]);
  
  // Calculate DTI (Debt to Income ratio)
  const calculateDTI = () => {
    const monthlyDebt = existingDebt * 0.03; // Approximate monthly payment on existing debt
    const monthlyIncome = income / 12;
    return (monthlyDebt / monthlyIncome) * 100;
  };
  
  const dti = calculateDTI();
  
  // Decision factors
  const decisionFactors = [
    {
      name: 'Credit Score',
      score: Math.min(100, (creditScore / 850) * 100),
      weight: 35,
      description: `Your credit score of ${creditScore} indicates ${
        creditScore >= 740 ? 'excellent' : creditScore >= 670 ? 'good' : creditScore >= 580 ? 'fair' : 'poor'
      } creditworthiness.`,
      impact: creditScore >= 670 ? 'positive' as const : creditScore >= 580 ? 'neutral' as const : 'negative' as const
    },
    {
      name: 'Debt-to-Income Ratio',
      score: Math.max(0, 100 - (dti * 2.5)), // Lower DTI is better
      weight: 25,
      description: `Your DTI ratio of ${dti.toFixed(1)}% is ${
        dti <= 20 ? 'excellent' : dti <= 36 ? 'good' : dti <= 43 ? 'acceptable' : 'high'
      }.`,
      impact: dti <= 36 ? 'positive' as const : dti <= 43 ? 'neutral' as const : 'negative' as const
    },
    {
      name: 'Income Level',
      score: Math.min(100, (income / 100000) * 100),
      weight: 20,
      description: `Annual income of $${income.toLocaleString()} is ${
        income >= 80000 ? 'well above' : income >= 50000 ? 'above' : income >= 30000 ? 'at' : 'below'
      } our typical approval threshold.`,
      impact: income >= 50000 ? 'positive' as const : income >= 30000 ? 'neutral' as const : 'negative' as const
    },
    {
      name: 'Employment Stability',
      score: Math.min(100, (employmentMonths / 60) * 100),
      weight: 15,
      description: `${employmentMonths} months of continuous employment shows ${
        employmentMonths >= 36 ? 'strong' : employmentMonths >= 12 ? 'adequate' : 'limited'
      } job stability.`,
      impact: employmentMonths >= 12 ? 'positive' as const : employmentMonths >= 6 ? 'neutral' as const : 'negative' as const
    },
    {
      name: 'Requested Credit Limit',
      score: 100 - Math.min(100, (requestedLimit / (income * 0.5)) * 100),
      weight: 5,
      description: `Requested limit of $${requestedLimit.toLocaleString()} is ${
        requestedLimit <= income * 0.2 ? 'conservative' : requestedLimit <= income * 0.4 ? 'reasonable' : 'high'
      } relative to income.`,
      impact: requestedLimit <= income * 0.3 ? 'positive' as const : requestedLimit <= income * 0.5 ? 'neutral' as const : 'negative' as const
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
        <h3 className="text-md font-medium text-indigo-900 flex items-center">
          <Shield className="h-5 w-5 text-indigo-600 mr-2" />
          Credit Application Evaluation
        </h3>
        <p className="text-xs text-indigo-700">
          AI-powered credit assessment and decision explanation
        </p>
      </div>
      
      <div className="p-4">
        {/* Application summary */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center mb-1">
              <BarChart3 className="h-4 w-4 text-blue-600 mr-1.5" />
              <h4 className="text-xs font-medium text-blue-800">Credit Score</h4>
            </div>
            <p className="text-lg font-bold text-blue-900">{creditScore}</p>
            <p className="text-xs text-blue-600">{
              creditScore >= 740 ? 'Excellent' :
              creditScore >= 670 ? 'Good' :
              creditScore >= 580 ? 'Fair' : 'Poor'
            }</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center mb-1">
              <DollarSign className="h-4 w-4 text-green-600 mr-1.5" />
              <h4 className="text-xs font-medium text-green-800">Annual Income</h4>
            </div>
            <p className="text-lg font-bold text-green-900">${income.toLocaleString()}</p>
            <p className="text-xs text-green-600">${Math.round(income/12).toLocaleString()}/month</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <div className="flex items-center mb-1">
              <BadgePercent className="h-4 w-4 text-amber-600 mr-1.5" />
              <h4 className="text-xs font-medium text-amber-800">DTI Ratio</h4>
            </div>
            <p className="text-lg font-bold text-amber-900">{dti.toFixed(1)}%</p>
            <p className="text-xs text-amber-600">{
              dti <= 20 ? 'Excellent' :
              dti <= 36 ? 'Good' :
              dti <= 43 ? 'Fair' : 'High'
            }</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center mb-1">
              <CreditCard className="h-4 w-4 text-purple-600 mr-1.5" />
              <h4 className="text-xs font-medium text-purple-800">Requested Limit</h4>
            </div>
            <p className="text-lg font-bold text-purple-900">${requestedLimit.toLocaleString()}</p>
            <p className="text-xs text-purple-600">{Math.round((requestedLimit/income) * 100)}% of income</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin mr-3" />
            <div>
              <h4 className="font-medium text-lg text-gray-900">Evaluating Application</h4>
              <p className="text-sm text-gray-600">Our AI is analyzing your information...</p>
            </div>
          </div>
        ) : (
          <AIDecisionExplainer
            decision={decision}
            contextType="credit"
            factors={decisionFactors}
            confidenceScore={decision === 'approved' ? 92 : decision === 'denied' ? 87 : 75}
            alternateDecision={
              decision === 'approved' ? "Manual Review" : 
              decision === 'denied' ? "Approval with Conditions" :
              "Automatic Approval"
            }
            recommendationText={
              decision === 'approved' 
                ? "Based on your excellent creditworthiness, we recommend our Premium Card with a higher limit and better rewards." 
                : decision === 'denied'
                ? "We recommend improving your credit score and reducing existing debt before reapplying in 3-6 months."
                : "While we review your application, consider providing additional income verification to strengthen your case."
            }
          />
        )}
        
        {/* Card Recommendation (if approved) */}
        {decision === 'approved' && !loading && (
          <div className="mt-6 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center mb-3">
              <Tag className="h-5 w-5 text-indigo-600 mr-2" />
              <h4 className="text-md font-medium text-indigo-900">Recommended Credit Card</h4>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4 max-w-lg mx-auto">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 shadow-md text-white">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-sm opacity-90">AgenticBank</span>
                  <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <div className="mb-6">
                  <p className="text-xs opacity-90 mb-1">Card Number</p>
                  <p className="font-medium tracking-widest">
                    **** **** **** 0000
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-90 mb-1">Card Holder</p>
                    <p className="font-medium">VALUED CUSTOMER</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-90 mb-1">Expires</p>
                    <p className="font-medium">05/28</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Premium Rewards Card</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                    <span>2% Cash Back</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 text-indigo-500 mr-1" />
                    <span>${(requestedLimit * 1.2).toLocaleString()} Limit</span>
                  </div>
                  <div className="flex items-center">
                    <BadgePercent className="h-4 w-4 text-amber-500 mr-1" />
                    <span>16.99% APR</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="h-4 w-4 text-purple-500 mr-1" />
                    <span>No Annual Fee</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                  Accept Offer
                </button>
              </div>
            </div>
            
            <p className="text-xs text-indigo-700 text-center mt-3">
              This card recommendation is personalized based on your credit profile and spending habits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditDecisionView;