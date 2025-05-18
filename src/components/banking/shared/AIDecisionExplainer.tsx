import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Lightbulb, GitBranch, ArrowRight, ThumbsUp, ThumbsDown, BrainCog } from 'lucide-react';

interface Factor {
  name: string;
  score: number;
  weight: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

interface AIDecisionExplainerProps {
  decision: 'approved' | 'denied' | 'review';
  title?: string;
  contextType: 'account' | 'credit' | 'loan';
  factors: Factor[];
  confidenceScore?: number;
  alternateDecision?: string;
  recommendationText?: string;
  loading?: boolean;
}

const AIDecisionExplainer: React.FC<AIDecisionExplainerProps> = ({
  decision,
  title,
  contextType,
  factors,
  confidenceScore = 85,
  alternateDecision,
  recommendationText,
  loading = false
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'factors' | 'alternate' | 'recommendation'>('factors');
  const [visibleFactors, setVisibleFactors] = useState<Factor[]>([]);
  
  // Simulate the gradual revealing of factors
  useEffect(() => {
    if (expanded && !loading) {
      setVisibleFactors([]);
      
      factors.forEach((factor, index) => {
        setTimeout(() => {
          setVisibleFactors(prev => [...prev, factor]);
        }, 300 * index);
      });
    }
  }, [expanded, factors, loading]);
  
  // Get decision-specific styling and text
  const getDecisionStyles = () => {
    switch(decision) {
      case 'approved':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
          title: title || 'Application Approved',
          headerBg: 'bg-green-100'
        };
      case 'denied':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          title: title || 'Application Denied',
          headerBg: 'bg-red-100'
        };
      case 'review':
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          icon: <HelpCircle className="h-5 w-5 text-amber-600" />,
          title: title || 'Manual Review Required',
          headerBg: 'bg-amber-100'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <HelpCircle className="h-5 w-5 text-gray-600" />,
          title: title || 'Decision Pending',
          headerBg: 'bg-gray-100'
        };
    }
  };
  
  const styles = getDecisionStyles();
  
  // Get decision explanation text
  const getDecisionExplanation = () => {
    if (loading) return "The AI agent is currently evaluating all relevant factors...";
    
    switch(decision) {
      case 'approved':
        return contextType === 'account' 
          ? "Based on the provided information and document verification, your application meets our account opening criteria."
          : contextType === 'credit'
          ? "Your credit profile meets our approval criteria. The AI analyzed your credit history, income, and existing debt to determine eligibility."
          : "Your loan application was approved based on your credit history, income verification, and debt-to-income ratio analysis.";
      case 'denied':
        return contextType === 'account'
          ? "Unfortunately, your application cannot be approved at this time. There were issues with identity verification or compliance requirements."
          : contextType === 'credit'
          ? "Your application was denied because it did not meet our current approval criteria. The key factors are detailed below."
          : "Based on our analysis, your loan application was denied. The key factors that influenced this decision are detailed below.";
      case 'review':
        return contextType === 'account'
          ? "Your application requires additional review by our compliance team. This is a standard procedure in certain cases."
          : contextType === 'credit'
          ? "Your credit application requires manual review. The AI has identified factors that need human expertise to evaluate."
          : "Your loan application has been flagged for manual review. Some aspects of your application require additional verification.";
      default:
        return "Your application is being processed. The AI agent is analyzing the provided information to make a decision.";
    }
  };
  
  // Get impact color based on factor impact
  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch(impact) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral':
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${styles.borderColor} ${styles.bgColor}`}>
      <div className={`px-4 py-3 ${styles.headerBg} border-b ${styles.borderColor} flex justify-between items-center`}>
        <div className="flex items-center">
          {styles.icon}
          <h3 className={`font-medium ml-2 ${styles.textColor}`}>
            {loading ? "AI Decision In Progress..." : styles.title}
          </h3>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className={`p-1 rounded-full hover:bg-white/50 ${styles.textColor}`}
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="px-4 py-3">
        <p className={`text-sm ${styles.textColor}`}>
          {getDecisionExplanation()}
        </p>
        
        {loading && (
          <div className="flex items-center mt-3">
            <div className="mr-3 h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
            <p className="text-xs text-gray-600">AI agent analyzing factors...</p>
          </div>
        )}
        
        {!loading && (
          <div className="mt-1 flex items-center">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
            <span className="ml-2 text-xs font-medium text-indigo-700">{confidenceScore}% confidence</span>
          </div>
        )}
      </div>
      
      {expanded && !loading && (
        <div className="border-t border-gray-200">
          {/* Section tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveSection('factors')}
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeSection === 'factors'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Key Factors
            </button>
            
            <button
              onClick={() => setActiveSection('alternate')}
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeSection === 'alternate'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Alternate Outcomes
            </button>
            
            <button
              onClick={() => setActiveSection('recommendation')}
              className={`flex-1 py-2 text-sm font-medium border-b-2 ${
                activeSection === 'recommendation'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommendations
            </button>
          </div>
          
          {/* Content based on active section */}
          <div className="p-4">
            {activeSection === 'factors' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <BrainCog className="h-4 w-4 text-indigo-500 mr-1.5" />
                  AI Decision Factors
                </h4>
                
                {visibleFactors.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="h-5 w-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Analyzing decision factors...</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    {visibleFactors.map((factor, index) => (
                      <div 
                        key={index} 
                        className="border rounded-lg p-3 bg-white animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-900">{factor.name}</h5>
                          <div className={`px-2 py-0.5 text-xs rounded-full border ${getImpactColor(factor.impact)}`}>
                            {factor.impact === 'positive' && 'Positive'}
                            {factor.impact === 'negative' && 'Negative'}
                            {factor.impact === 'neutral' && 'Neutral'}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{factor.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[100px] mr-2">
                              <div 
                                className={`h-full rounded-full ${
                                  factor.impact === 'positive' ? 'bg-green-500' :
                                  factor.impact === 'negative' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`} 
                                style={{ width: `${factor.score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">Score: {factor.score}</span>
                          </div>
                          
                          <span className="text-xs text-gray-600">Weight: {factor.weight}%</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        <BrainCog className="inline-block h-3.5 w-3.5 text-indigo-600 mr-1 align-text-bottom" />
                        The AI analyzed {factors.length} factors to reach this decision with {confidenceScore}% confidence.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeSection === 'alternate' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <GitBranch className="h-4 w-4 text-indigo-500 mr-1.5" />
                  Alternative Outcomes
                </h4>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {decision === 'approved' ? 
                          <AlertTriangle className="h-4 w-4 text-amber-500" /> : 
                          <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">
                        {alternateDecision || (decision === 'approved' ? 'Review Required' : 'Approval Possible')}
                      </h5>
                      
                      <p className="text-xs text-gray-600 mt-1 mb-3">
                        {decision === 'approved'
                          ? "The AI considered requiring manual review, but determined that your application is clear-cut and can be automatically approved."
                          : decision === 'denied'
                          ? "Your application could potentially be approved with the following modifications:"
                          : "Your application could be automatically approved if the following conditions are met:"}
                      </p>
                      
                      <div className="space-y-2">
                        {decision !== 'approved' && (
                          <>
                            <div className="flex items-start">
                              <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mr-1.5 mt-0.5" />
                              <p className="text-xs text-gray-700">
                                {contextType === 'account'
                                  ? "Provide additional identity verification documents"
                                  : contextType === 'credit'
                                  ? "Reduce existing debt obligations or increase income"
                                  : "Decrease the requested loan amount or increase down payment"}
                              </p>
                            </div>
                            
                            <div className="flex items-start">
                              <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mr-1.5 mt-0.5" />
                              <p className="text-xs text-gray-700">
                                {contextType === 'account'
                                  ? "Add a co-applicant to the account application"
                                  : contextType === 'credit'
                                  ? "Consider a secured credit card option instead"
                                  : "Extend the loan term to reduce monthly payments"}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mt-2 flex items-center">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                  <span>
                    AI evaluates multiple potential outcomes for each application and selects the most appropriate based on regulatory requirements and bank policies.
                  </span>
                </div>
              </div>
            )}
            
            {activeSection === 'recommendation' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Lightbulb className="h-4 w-4 text-indigo-500 mr-1.5" />
                  AI Recommendations
                </h4>
                
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {recommendationText || 
                      (contextType === 'account'
                        ? "Based on your profile, we recommend a Premium Checking account with no minimum balance requirement for the first year."
                        : contextType === 'credit'
                        ? "Based on your credit profile, we recommend our Cash Rewards card with 2% cash back on all purchases."
                        : "Based on your financial profile, we recommend a 15-year fixed-rate mortgage for better long-term savings.")}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mr-1.5 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        {contextType === 'account'
                          ? "Set up direct deposit to waive monthly maintenance fees"
                          : contextType === 'credit'
                          ? "Pay your balance in full each month to avoid interest charges"
                          : "Consider making extra principal payments to pay off your loan faster"}
                      </p>
                    </div>
                    
                    <div className="flex items-start">
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mr-1.5 mt-0.5" />
                      <p className="text-xs text-gray-700">
                        {contextType === 'account'
                          ? "Enable account alerts to monitor activity and avoid overdrafts"
                          : contextType === 'credit'
                          ? "Set up automatic payments to avoid late fees"
                          : "Establish an emergency fund for unexpected expenses"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors">
                    <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                    <span>Not Helpful</span>
                  </button>
                  <button className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                    <span>Helpful</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDecisionExplainer;