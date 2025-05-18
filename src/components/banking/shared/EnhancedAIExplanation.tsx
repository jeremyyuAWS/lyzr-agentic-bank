import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, BrainCog, ArrowRight, Lightbulb, Sparkles, Info, PieChart, BarChart, GitBranch } from 'lucide-react';

interface DecisionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100
  description: string;
  weight: number; // percentage weight of this factor
}

interface EnhancedAIExplanationProps {
  decision: 'approved' | 'denied' | 'review';
  decisionType: 'loan' | 'credit' | 'account' | 'kyc';
  confidenceScore: number; // 0-100
  factors: DecisionFactor[];
  alternatives?: Array<{
    decision: string;
    conditions: string[];
    probability: number;
  }>;
  showVisualization?: boolean;
}

const EnhancedAIExplanation: React.FC<EnhancedAIExplanationProps> = ({
  decision,
  decisionType,
  confidenceScore,
  factors,
  alternatives = [],
  showVisualization = true
}) => {
  const [activeTab, setActiveTab] = useState<'factors' | 'reasoning' | 'alternatives'>('factors');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [visibleFactors, setVisibleFactors] = useState<DecisionFactor[]>([]);
  
  // Progressive reveal of factors for a better UX
  useEffect(() => {
    setVisibleFactors([]);
    
    const timer = setTimeout(() => {
      factors.forEach((factor, index) => {
        setTimeout(() => {
          setVisibleFactors(prev => [...prev, factor]);
          
          // Mark animation as complete when all factors are shown
          if (index === factors.length - 1) {
            setAnimationComplete(true);
          }
        }, 300 * index);
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [factors]);
  
  const getDecisionColor = () => {
    switch (decision) {
      case 'approved': return 'green';
      case 'denied': return 'red';
      case 'review': return 'amber';
      default: return 'gray';
    }
  };
  
  const getDecisionTitle = () => {
    const decisionText = decision.charAt(0).toUpperCase() + decision.slice(1);
    
    switch (decisionType) {
      case 'loan': return `Loan Application ${decisionText}`;
      case 'credit': return `Credit Card ${decisionText}`;
      case 'account': return `Account Opening ${decisionText}`;
      case 'kyc': return `Identity Verification ${decisionText}`;
      default: return `Application ${decisionText}`;
    }
  };
  
  const color = getDecisionColor();
  const title = getDecisionTitle();
  
  // Get explanation text based on decision and confidence
  const getExplanationText = () => {
    const confidenceLevel = confidenceScore >= 90 ? 'high' : 
                          confidenceScore >= 70 ? 'good' : 
                          confidenceScore >= 50 ? 'moderate' : 'low';
    
    if (decision === 'approved') {
      return `This application was approved with ${confidenceLevel} confidence (${confidenceScore}%). After analyzing all relevant factors, our AI determined that the application meets our approval criteria. The decision process evaluated credit history, income verification, debt obligations, and other factors shown below.`;
    } else if (decision === 'denied') {
      return `This application was denied with ${confidenceLevel} confidence (${confidenceScore}%). After analyzing all relevant factors, our AI determined that the application does not meet our approval criteria at this time. The key factors that influenced this decision are detailed below.`;
    } else {
      return `This application requires manual review with ${confidenceLevel} confidence (${confidenceScore}%). Our AI has identified factors that need human expertise to evaluate. While some aspects of the application meet approval criteria, others raised questions that require additional verification.`;
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden bg-${color}-50 border-${color}-200`}>
      <div className={`px-4 py-3 bg-${color}-100 border-b border-${color}-200 flex items-center justify-between`}>
        <div className="flex items-center">
          {decision === 'approved' && <CheckCircle className={`h-5 w-5 mr-2 text-${color}-600`} />}
          {decision === 'denied' && <AlertTriangle className={`h-5 w-5 mr-2 text-${color}-600`} />}
          {decision === 'review' && <HelpCircle className={`h-5 w-5 mr-2 text-${color}-600`} />}
          
          <h3 className={`font-medium text-${color}-900 flex items-center`}>
            {title}
            <div className="ml-3 flex items-center">
              <BrainCog className="h-4 w-4 mr-1 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-700">{confidenceScore}% confidence</span>
            </div>
          </h3>
        </div>
        
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${color}-600 text-white`}>
          AI Decision
        </span>
      </div>
      
      <div className="p-4">
        <p className={`text-sm text-${color}-800 mb-4`}>
          {getExplanationText()}
        </p>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'factors'
                ? `border-indigo-500 text-indigo-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('factors')}
          >
            Decision Factors
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'reasoning'
                ? `border-indigo-500 text-indigo-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reasoning')}
          >
            AI Reasoning
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'alternatives'
                ? `border-indigo-500 text-indigo-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('alternatives')}
          >
            Alternatives
          </button>
        </div>
        
        {/* Tab content */}
        <div className="py-2">
          {/* Decision Factors Tab */}
          {activeTab === 'factors' && (
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <Sparkles className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-900">Key Decision Factors</h4>
              </div>
              
              {visibleFactors.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-b-2 border-indigo-500 rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleFactors.map((factor, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          {factor.name}
                          <span className="ml-2 text-xs text-gray-500">Weight: {factor.weight}%</span>
                        </h5>
                        
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          factor.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          factor.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {factor.impact === 'positive' ? 'Positive' :
                           factor.impact === 'negative' ? 'Negative' :
                           'Neutral'}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <span>Confidence: </span>
                          <div className="w-[100px] bg-gray-200 rounded-full h-2 ml-2">
                            <div
                              className={`h-2 rounded-full ${
                                factor.confidence >= 80 ? 'bg-green-500' :
                                factor.confidence >= 60 ? 'bg-blue-500' :
                                'bg-amber-500'
                              }`}
                              style={{ width: `${factor.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <span>{factor.confidence}%</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-xs text-gray-500 flex items-center mt-2">
                    <Info className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    Factors are weighted based on their importance to the final decision
                  </div>
                </div>
              )}
              
              {/* Factor visualization */}
              {showVisualization && animationComplete && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-3">
                    <PieChart className="h-5 w-5 text-indigo-500 mr-2" />
                    <h5 className="font-medium text-gray-900">Decision Weight Distribution</h5>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {factors.map((factor, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">{factor.name}</span>
                          <span className="text-xs font-medium">{factor.weight}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              factor.impact === 'positive' ? 'bg-green-500' :
                              factor.impact === 'negative' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${factor.weight}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* AI Reasoning Tab */}
          {activeTab === 'reasoning' && (
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <BrainCog className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-900">AI Decision Logic</h4>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="space-y-4">
                  {/* Decision process visualization */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">1</div>
                      <div className="flex-1 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <p className="text-sm font-medium text-indigo-800">Data Collection & Verification</p>
                        <p className="text-xs text-indigo-600 mt-1">Customer information and documents were processed and verified</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">2</div>
                      <div className="flex-1 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <p className="text-sm font-medium text-indigo-800">Risk Assessment</p>
                        <p className="text-xs text-indigo-600 mt-1">Financial metrics and risk factors were evaluated against policy guidelines</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">3</div>
                      <div className="flex-1 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <p className="text-sm font-medium text-indigo-800">Decision Calculation</p>
                        <p className="text-xs text-indigo-600 mt-1">Weighted analysis of all factors determined the final decision</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium mr-3">4</div>
                      <div className={`flex-1 p-3 rounded-lg border ${
                        decision === 'approved' 
                          ? 'bg-green-50 border-green-100' 
                          : decision === 'denied'
                          ? 'bg-red-50 border-red-100'
                          : 'bg-amber-50 border-amber-100'
                      }`}>
                        <p className={`text-sm font-medium ${
                          decision === 'approved' 
                            ? 'text-green-800' 
                            : decision === 'denied'
                            ? 'text-red-800'
                            : 'text-amber-800'
                        }`}>Final Decision: {decision.charAt(0).toUpperCase() + decision.slice(1)}</p>
                        <p className={`text-xs mt-1 ${
                          decision === 'approved' 
                            ? 'text-green-600' 
                            : decision === 'denied'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}>Decision made with {confidenceScore}% confidence</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Explanation of AI methodology */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">AI Methodology</h5>
                    <p className="text-sm text-gray-600">
                      Our AI uses a combination of rule-based policies and machine learning models trained on thousands of historical applications. The decision process:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc pl-5">
                      <li>Evaluates hundreds of data points across multiple categories</li>
                      <li>Applies regulatory requirements and institution policies</li>
                      <li>Calculates risk probabilities based on historical patterns</li>
                      <li>Determines approval threshold based on product-specific criteria</li>
                    </ul>
                    
                    <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                      <div className="flex">
                        <Lightbulb className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-indigo-800">Decision Transparency</p>
                          <p className="text-xs text-indigo-600 mt-1">
                            {decision === 'approved'
                              ? "This decision met all required regulatory and policy requirements for approval."
                              : decision === 'denied'
                              ? "This decision complies with all regulatory requirements including adverse action notice requirements."
                              : "This application has been flagged for additional human review to ensure accurate decision-making."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Alternatives Tab */}
          {activeTab === 'alternatives' && (
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <GitBranch className="h-5 w-5 text-indigo-500 mr-2" />
                <h4 className="font-medium text-gray-900">Alternative Scenarios</h4>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Our AI evaluated multiple possible outcomes for your application. The following alternatives could be possible with changes to the application:
                </p>
                
                <div className="space-y-4">
                  {alternatives.length > 0 ? (
                    alternatives.map((alt, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg border border-indigo-100 bg-indigo-50"
                      >
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
                          <h5 className="font-medium text-indigo-800">{alt.decision}</h5>
                          <span className="ml-auto text-xs font-medium text-indigo-700">
                            {alt.probability}% probability
                          </span>
                        </div>
                        
                        <p className="text-sm text-indigo-700 mb-2">Required changes:</p>
                        <ul className="space-y-1">
                          {alt.conditions.map((condition, i) => (
                            <li key={i} className="flex items-start text-sm text-indigo-600">
                              <ArrowRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1.5 flex-shrink-0" />
                              <span>{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-gray-500 mr-2" />
                          <h5 className="font-medium text-gray-700">
                            {decision === 'approved'
                              ? "Approval with Higher Amount"
                              : decision === 'denied'
                              ? "Conditional Approval"
                              : "Full Approval without Review"}
                          </h5>
                          <span className="ml-auto text-xs font-medium text-gray-600">
                            {decision === 'approved' ? '35%' : decision === 'denied' ? '25%' : '40%'} probability
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">Required changes:</p>
                        <ul className="space-y-1">
                          {decision === 'approved' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Provide additional income verification documentation</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Longer relationship history with our institution</span>
                              </li>
                            </>
                          )}
                          
                          {decision === 'denied' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Reduce requested loan amount by 25%</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Provide additional collateral or security</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Add a co-signer with stronger credit profile</span>
                              </li>
                            </>
                          )}
                          
                          {decision === 'review' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Provide clearer documentation to resolve verification issues</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Address discrepancies in application data</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-5 w-5 text-gray-500 mr-2" />
                          <h5 className="font-medium text-gray-700">
                            {decision === 'approved'
                              ? "Expedited Funding"
                              : decision === 'denied'
                              ? "Alternative Product Offering"
                              : "Immediate Denial"}
                          </h5>
                          <span className="ml-auto text-xs font-medium text-gray-600">
                            {decision === 'approved' ? '20%' : decision === 'denied' ? '45%' : '15%'} probability
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">Required changes:</p>
                        <ul className="space-y-1">
                          {decision === 'approved' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Enroll in automatic payments from a checking account</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Full electronic document signing and processing</span>
                              </li>
                            </>
                          )}
                          
                          {decision === 'denied' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Consider a secured loan or credit builder product</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Smaller loan amount with shorter term</span>
                              </li>
                            </>
                          )}
                          
                          {decision === 'review' && (
                            <>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Significant unresolved flags in compliance checks</span>
                              </li>
                              <li className="flex items-start text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 text-gray-500 mt-0.5 mr-1.5 flex-shrink-0" />
                                <span>Potentially fraudulent application elements</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIExplanation;