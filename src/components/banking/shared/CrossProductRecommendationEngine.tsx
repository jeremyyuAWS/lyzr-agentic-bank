import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { useAppContext } from '../../../context/AppContext';
import { 
  Lightbulb, 
  ChevronRight, 
  CreditCard, 
  Landmark, 
  PiggyBank, 
  Shield, 
  DollarSign, 
  Lock, 
  Clock,
  LineChart,
  Wallet,
  Zap
} from 'lucide-react';

// Product recommendation types
interface ProductRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'account' | 'credit-card' | 'loan' | 'investment' | 'insurance' | 'service';
  icon: React.ReactNode;
  matchScore: number; // 0-100 match score
  reasonCodes: string[];
  benefits: string[];
  primaryCTA: string;
  secondaryCTA?: string;
}

interface CrossProductRecommendationEngineProps {
  maxRecommendations?: number;
  showMatchScores?: boolean;
  layout?: 'grid' | 'list';
  activeFilter?: string | null;
}

const CrossProductRecommendationEngine: React.FC<CrossProductRecommendationEngineProps> = ({
  maxRecommendations = 3,
  showMatchScores = true,
  layout = 'grid',
  activeFilter = null
}) => {
  const { 
    customer, 
    bankAccount, 
    creditCard, 
    loan, 
    documents,
    kycResult,
    auditTrail,
    mode
  } = useBankingContext();
  
  const { portfolios, retirementData } = useAppContext();
  
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string | null>(activeFilter);
  
  // Generate recommendations based on current customer profile
  useEffect(() => {
    setLoading(true);
    
    // Give a little delay to simulate AI processing
    setTimeout(() => {
      const newRecommendations: ProductRecommendation[] = [];
      
      // Check if customer exists
      if (customer) {
        // Recommend a checking account if they don't have one
        if (!bankAccount) {
          newRecommendations.push({
            id: 'checking-account',
            title: 'Premium Checking Account',
            description: 'No monthly fees, free transfers, and a competitive interest rate on your balance.',
            type: 'account',
            icon: <Wallet />,
            matchScore: 95,
            reasonCodes: [
              'New customer',
              'No existing accounts',
              'Foundation for banking relationship'
            ],
            benefits: [
              'No monthly maintenance fees',
              'Free unlimited transfers',
              '0.1% APY on all balances',
              'No minimum balance requirements'
            ],
            primaryCTA: 'Open Account',
            secondaryCTA: 'Compare Accounts'
          });
        }
        
        // Recommend a savings account if they have a checking but no investments
        if (bankAccount && !portfolios.length) {
          newRecommendations.push({
            id: 'high-yield-savings',
            title: 'High-Yield Savings Account',
            description: 'Earn 4.05% APY on your savings with our premium high-yield savings account.',
            type: 'account',
            icon: <PiggyBank />,
            matchScore: 90,
            reasonCodes: [
              'Existing checking customer',
              'No investment accounts',
              'Potential for emergency savings'
            ],
            benefits: [
              '4.05% APY on all balances',
              'No monthly fees',
              'FDIC insured up to $250,000',
              'Easy transfers from checking'
            ],
            primaryCTA: 'Open Account',
            secondaryCTA: 'Learn More'
          });
        }
        
        // Recommend a credit card if they don't have one
        if (!creditCard) {
          newRecommendations.push({
            id: 'premium-credit-card',
            title: customer.annualIncome > 100000 ? 'Platinum Rewards Credit Card' : 'Cash Back Rewards Card',
            description: customer.annualIncome > 100000 
              ? 'Premium travel and lifestyle benefits with our elite Platinum card.' 
              : 'Earn 2% cash back on all purchases with no annual fee.',
            type: 'credit-card',
            icon: <CreditCard />,
            matchScore: customer.annualIncome > 100000 ? 88 : 92,
            reasonCodes: [
              'No existing credit products',
              'Income qualification',
              customer.annualIncome > 100000 ? 'Premium customer segment' : 'Everyday rewards user profile'
            ],
            benefits: customer.annualIncome > 100000 
              ? [
                  '3x points on travel and dining',
                  'Annual travel credit of $300',
                  'Airport lounge access',
                  'No foreign transaction fees'
                ]
              : [
                  '2% cash back on all purchases',
                  'No annual fee',
                  '$200 welcome bonus after $1,000 spend',
                  '0% intro APR for 15 months'
                ],
            primaryCTA: 'Apply Now',
            secondaryCTA: 'Check Eligibility'
          });
        }
        
        // Recommend a personal loan
        if (!loan) {
          newRecommendations.push({
            id: 'personal-loan',
            title: 'Personal Loan',
            description: 'Low-rate personal loans for debt consolidation, home improvement, or major purchases.',
            type: 'loan',
            icon: <Landmark />,
            matchScore: 85,
            reasonCodes: [
              'No existing loans',
              'Potential debt consolidation opportunity',
              'Qualified based on profile'
            ],
            benefits: [
              'Rates as low as 6.99% APR',
              'Borrow up to $35,000',
              'No origination fees',
              'Flexible terms from 12-60 months'
            ],
            primaryCTA: 'Check Your Rate',
            secondaryCTA: 'Calculate Payment'
          });
        }
        
        // Recommend mortgage if they have good credit and income but no mortgage
        if (customer.annualIncome > 75000 && (!loan || (loan && loan.loanType !== 'home'))) {
          newRecommendations.push({
            id: 'mortgage',
            title: 'Home Mortgage',
            description: 'Competitive rates on fixed and adjustable-rate mortgages for your dream home.',
            type: 'loan',
            icon: <Home />,
            matchScore: 82,
            reasonCodes: [
              'Income qualification',
              'No existing mortgage',
              'Potential first-time homebuyer'
            ],
            benefits: [
              'Rates as low as 5.25% APR',
              'Low down payment options',
              'First-time homebuyer programs',
              '$0 lender fees for existing customers'
            ],
            primaryCTA: 'Start Application',
            secondaryCTA: 'Calculate Payment'
          });
        }
        
        // Recommend identity protection service
        if (documents.some(d => d.type === 'id' && d.status === 'verified')) {
          newRecommendations.push({
            id: 'id-protection',
            title: 'Identity Protection Plus',
            description: 'Comprehensive identity monitoring, alerts, and $1M insurance coverage.',
            type: 'service',
            icon: <Shield />,
            matchScore: 78,
            reasonCodes: [
              'Verified identity on file',
              'Digital banking user',
              'Protection against fraud'
            ],
            benefits: [
              'Real-time fraud alerts',
              '24/7 identity monitoring',
              '$1M identity theft insurance',
              'Dark web monitoring'
            ],
            primaryCTA: 'Activate Protection',
            secondaryCTA: 'Learn More'
          });
        }
        
        // Recommend investment account
        if (!portfolios.length) {
          newRecommendations.push({
            id: 'investment-account',
            title: 'Managed Investment Portfolio',
            description: 'Professional investment management tailored to your goals and risk tolerance.',
            type: 'investment',
            icon: <LineChart />,
            matchScore: 80,
            reasonCodes: [
              'No investment accounts',
              'Income qualification',
              'Long-term growth opportunity'
            ],
            benefits: [
              'Personalized investment strategy',
              'Professional management',
              'Low annual fee of 0.25%',
              'Tax-efficient investing'
            ],
            primaryCTA: 'Start Investing',
            secondaryCTA: 'Learn More'
          });
        }
        
        // Recommend overdraft protection
        if (bankAccount) {
          newRecommendations.push({
            id: 'overdraft-protection',
            title: 'Overdraft Protection',
            description: 'Link your accounts to prevent overdrafts and avoid insufficient funds fees.',
            type: 'service',
            icon: <Lock />,
            matchScore: 75,
            reasonCodes: [
              'Existing checking account',
              'Protection against fees',
              'Peace of mind service'
            ],
            benefits: [
              'Automatic transfers to cover overdrafts',
              'Avoid $35 insufficient funds fees',
              'Choose backup funding source',
              'Real-time low balance alerts'
            ],
            primaryCTA: 'Activate Protection',
            secondaryCTA: 'Learn More'
          });
        }
        
        // Recommend auto loan
        if (!loan || (loan && loan.loanType !== 'auto')) {
          newRecommendations.push({
            id: 'auto-loan',
            title: 'Auto Loan',
            description: 'Competitive rates on new and used auto loans with flexible terms.',
            type: 'loan',
            icon: <DollarSign />,
            matchScore: 70,
            reasonCodes: [
              'No existing auto loans',
              'Income qualification',
              'Potential vehicle upgrade opportunity'
            ],
            benefits: [
              'Rates as low as 4.99% APR',
              'Up to 72-month terms',
              'No application fee',
              'Quick approval process'
            ],
            primaryCTA: 'Apply Now',
            secondaryCTA: 'Calculate Payment'
          });
        }
        
        // Recommend CD account for higher savings
        if (bankAccount && bankAccount.balance > 10000) {
          newRecommendations.push({
            id: 'certificate-deposit',
            title: '5-Year Certificate of Deposit',
            description: 'Lock in a guaranteed 4.50% APY for 5 years with our premium CD.',
            type: 'account',
            icon: <Clock />,
            matchScore: 72,
            reasonCodes: [
              'High checking balance',
              'Opportunity for higher yield',
              'Long-term savings potential'
            ],
            benefits: [
              '4.50% APY guaranteed for 5 years',
              'FDIC insured up to $250,000',
              'Minimum deposit of $1,000',
              'Early withdrawal options available'
            ],
            primaryCTA: 'Open CD Account',
            secondaryCTA: 'Compare Rates'
          });
        }
        
        // For premium customers, recommend premium services
        if (customer.annualIncome > 200000 || (portfolios.length > 0 && retirementData?.currentSavings > 500000)) {
          newRecommendations.push({
            id: 'wealth-management',
            title: 'Private Wealth Management',
            description: 'Personalized wealth management services for high-net-worth individuals.',
            type: 'service',
            icon: <Zap />,
            matchScore: 90,
            reasonCodes: [
              'Premium customer segment',
              'High income or assets',
              'Comprehensive wealth management needs'
            ],
            benefits: [
              'Dedicated wealth advisor',
              'Customized investment strategies',
              'Tax optimization planning',
              'Estate and succession planning'
            ],
            primaryCTA: 'Schedule Consultation',
            secondaryCTA: 'Learn More'
          });
        }
      }
      
      // Sort recommendations by match score
      newRecommendations.sort((a, b) => b.matchScore - a.matchScore);
      
      // Apply filter if active
      let filteredRecommendations = newRecommendations;
      if (filter) {
        filteredRecommendations = newRecommendations.filter(rec => rec.type === filter);
      }
      
      // Limit number of recommendations
      const limitedRecommendations = filteredRecommendations.slice(0, maxRecommendations);
      
      setRecommendations(limitedRecommendations);
      setLoading(false);
    }, 1000);
  }, [customer, bankAccount, creditCard, loan, documents, kycResult, filter, maxRecommendations, portfolios, retirementData, mode, auditTrail]);
  
  // Filter options
  const filterOptions = [
    { label: 'All Products', value: null },
    { label: 'Accounts', value: 'account' },
    { label: 'Credit Cards', value: 'credit-card' },
    { label: 'Loans', value: 'loan' },
    { label: 'Investments', value: 'investment' },
    { label: 'Services', value: 'service' }
  ];
  
  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-indigo-600';
    return 'text-gray-600';
  };
  
  // If not enough customer data, show a message
  if (!customer) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Not Enough Data</h3>
        <p className="text-gray-600 mb-4">
          We need more information to generate personalized product recommendations.
        </p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Customer Profile</h3>
        <p className="text-gray-600">
          Our AI is analyzing your customer profile to generate personalized product recommendations...
        </p>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
        <p className="text-gray-600 mb-4">
          We don't have any product recommendations matching your criteria at this time.
        </p>
        {filter && (
          <button
            onClick={() => setFilter(null)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View All Recommendations
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <h3 className="flex items-center font-medium text-indigo-900">
            <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
            AI-Powered Product Recommendations
          </h3>
          
          <div className="flex space-x-2">
            {filterOptions.map(option => (
              <button
                key={option.value || 'all'}
                className={`px-2.5 py-1 rounded-md text-xs ${
                  filter === option.value 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}>
          {recommendations.map(recommendation => (
            <div 
              key={recommendation.id}
              className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-indigo-200 transition-colors ${
                layout === 'list' ? 'flex' : ''
              }`}
            >
              {/* Card header */}
              <div className={`p-4 ${layout === 'list' ? 'flex-shrink-0 w-64 border-r border-gray-200' : 'border-b border-gray-200'}`}>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <div className="text-indigo-600">
                      {recommendation.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                    
                    {/* Match score */}
                    {showMatchScores && (
                      <div className="flex items-center mt-1">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-1.5 rounded-full bg-indigo-600" 
                            style={{width: `${recommendation.matchScore}%`}}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${getMatchScoreColor(recommendation.matchScore)}`}>
                          {recommendation.matchScore}% match
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {layout !== 'list' && (
                  <p className="text-sm text-gray-600 mt-3">
                    {recommendation.description}
                  </p>
                )}
              </div>
              
              {/* Card body */}
              <div className={`${layout === 'list' ? 'flex-1 p-4 flex flex-col' : 'p-4'}`}>
                {layout === 'list' && (
                  <p className="text-sm text-gray-600 mb-4">
                    {recommendation.description}
                  </p>
                )}
                
                <div className={layout === 'list' ? 'flex-1 grid grid-cols-2 gap-4' : ''}>
                  {/* Key benefits */}
                  <div className={layout === 'list' ? '' : 'mb-4'}>
                    <h5 className="text-xs font-medium text-gray-900 mb-2">Key Benefits</h5>
                    <ul className="space-y-1">
                      {recommendation.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start text-xs">
                          <ChevronRight className="h-3 w-3 text-indigo-600 mt-0.5 mr-1 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Why we recommend */}
                  {layout === 'list' && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-900 mb-2">Why We Recommend</h5>
                      <ul className="space-y-1">
                        {recommendation.reasonCodes.map((reason, index) => (
                          <li key={index} className="flex items-start text-xs">
                            <ChevronRight className="h-3 w-3 text-green-600 mt-0.5 mr-1 flex-shrink-0" />
                            <span className="text-gray-600">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className={`flex ${layout === 'list' ? 'mt-4' : 'mt-2'}`}>
                  <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    {recommendation.primaryCTA}
                  </button>
                  
                  {recommendation.secondaryCTA && (
                    <button className="ml-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      {recommendation.secondaryCTA}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
            <Lightbulb className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              These recommendations are personalized based on your profile and banking relationship. Our AI continuously updates them based on your evolving financial needs and behaviors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrossProductRecommendationEngine;