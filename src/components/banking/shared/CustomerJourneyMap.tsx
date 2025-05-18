import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  User, 
  FileCheck, 
  Shield, 
  CreditCard, 
  Landmark, 
  Wallet,
  Bell,
  ArrowRight,
  CheckCircle,
  DollarSign,
  Home,
  Clock,
  Calendar,
  ArrowUp,
  Award,
  Heart,
  Star
} from 'lucide-react';

// Define journey milestone types
type Milestone = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: Date;
  status: 'completed' | 'active' | 'upcoming' | 'skipped';
  type: 'account' | 'credit-card' | 'loan' | 'event';
  details?: string;
};

interface CustomerJourneyMapProps {
  customerId?: string;
  showFutureMilestones?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const CustomerJourneyMap: React.FC<CustomerJourneyMapProps> = ({
  customerId,
  showFutureMilestones = true,
  layout = 'horizontal'
}) => {
  const { 
    customer, 
    bankAccount, 
    creditCard, 
    loan, 
    documents,
    kycResult,
    auditTrail
  } = useBankingContext();
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  
  // Generate milestones based on customer journey
  useEffect(() => {
    const newMilestones: Milestone[] = [];
    
    // Account opening milestones
    if (auditTrail.length > 0) {
      // Journey started
      newMilestones.push({
        id: 'journey-start',
        title: 'Banking Journey Started',
        description: 'Customer initiated banking relationship',
        icon: <User />,
        date: auditTrail[0].timestamp,
        status: 'completed',
        type: 'event',
        details: 'Customer first interaction with Agentic Bank'
      });
    }
    
    // Document verification
    const verifiedDocs = documents.filter(doc => doc.status === 'verified');
    if (verifiedDocs.length > 0) {
      newMilestones.push({
        id: 'document-verification',
        title: 'Document Verification',
        description: `${verifiedDocs.length} documents verified successfully`,
        icon: <FileCheck />,
        date: verifiedDocs[0].verifiedAt || verifiedDocs[0].uploadedAt,
        status: 'completed',
        type: 'account',
        details: verifiedDocs.map(d => d.type.replace(/-/g, ' ')).join(', ')
      });
    }
    
    // KYC verification
    if (kycResult) {
      newMilestones.push({
        id: 'kyc-verification',
        title: 'Identity Verification',
        description: `KYC/AML check ${kycResult.status}`,
        icon: <Shield />,
        date: kycResult.checkDate,
        status: kycResult.status === 'passed' ? 'completed' : 'active',
        type: 'account',
        details: `Risk score: ${(kycResult.riskScore * 100).toFixed(0)}%, Status: ${kycResult.status}`
      });
    }
    
    // Bank account creation
    if (bankAccount) {
      newMilestones.push({
        id: 'account-creation',
        title: 'Account Opening',
        description: `${bankAccount.accountType.charAt(0).toUpperCase() + bankAccount.accountType.slice(1)} account opened`,
        icon: <Wallet />,
        date: bankAccount.openedAt,
        status: 'completed',
        type: 'account',
        details: `Account #: ${bankAccount.accountNumber.slice(-4)}, Initial balance: $0`
      });
    }
    
    // Credit card application
    if (creditCard) {
      newMilestones.push({
        id: 'credit-card-issuance',
        title: 'Credit Card Issuance',
        description: `${creditCard.cardType.charAt(0).toUpperCase() + creditCard.cardType.slice(1)} card issued`,
        icon: <CreditCard />,
        date: creditCard.issuedAt || new Date(),
        status: 'completed',
        type: 'credit-card',
        details: `Card ending in ${creditCard.cardNumber.slice(-4)}, Limit: $${creditCard.creditLimit.toLocaleString()}`
      });
    }
    
    // Loan application
    if (loan) {
      newMilestones.push({
        id: 'loan-origination',
        title: 'Loan Origination',
        description: `${loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} loan approved`,
        icon: <Landmark />,
        date: new Date(), // Would be loan.approvedAt in a real implementation
        status: 'completed',
        type: 'loan',
        details: `Amount: $${loan.amount.toLocaleString()}, Term: ${loan.term} months, Rate: ${loan.interestRate.toFixed(2)}%`
      });
    }
    
    // Add potential future milestones if requested
    if (showFutureMilestones) {
      // Only add future milestones if we have at least one completed milestone
      if (newMilestones.length > 0) {
        const lastDate = newMilestones[newMilestones.length - 1].date;
        
        // Add credit card milestone if not already present
        if (!creditCard) {
          const futureDate = new Date(lastDate);
          futureDate.setMonth(futureDate.getMonth() + 1);
          
          newMilestones.push({
            id: 'future-credit-card',
            title: 'Credit Card Opportunity',
            description: 'Eligible for premium credit card',
            icon: <CreditCard />,
            date: futureDate,
            status: 'upcoming',
            type: 'credit-card',
            details: 'Based on your profile, you may qualify for our Premium Rewards card with cash back benefits'
          });
        }
        
        // Add loan milestone if not already present
        if (!loan) {
          const futureDate = new Date(lastDate);
          futureDate.setMonth(futureDate.getMonth() + 3);
          
          newMilestones.push({
            id: 'future-loan',
            title: 'Loan Opportunity',
            description: 'Personal loan pre-approval',
            icon: <Landmark />,
            date: futureDate,
            status: 'upcoming',
            type: 'loan',
            details: 'Pre-approved for a personal loan up to $15,000 with competitive rates'
          });
        }
        
        // Add future relationship milestone
        const anniversaryDate = new Date(newMilestones[0].date);
        anniversaryDate.setFullYear(anniversaryDate.getFullYear() + 1);
        
        if (anniversaryDate > new Date()) {
          newMilestones.push({
            id: 'relationship-anniversary',
            title: '1-Year Anniversary',
            description: 'Banking relationship milestone',
            icon: <Award />,
            date: anniversaryDate,
            status: 'upcoming',
            type: 'event',
            details: 'Relationship anniversary with special offers and benefits'
          });
        }
        
        // Add potential home loan milestone if they have a bank account but no home loan
        if (bankAccount && (!loan || loan.loanType !== 'home')) {
          const futureDate = new Date(lastDate);
          futureDate.setMonth(futureDate.getMonth() + 6);
          
          newMilestones.push({
            id: 'future-mortgage',
            title: 'Mortgage Opportunity',
            description: 'Home loan consultation',
            icon: <Home />,
            date: futureDate,
            status: 'upcoming',
            type: 'loan',
            details: 'Schedule a consultation to explore home loan options with competitive rates'
          });
        }
      }
    }
    
    // Sort milestones by date
    newMilestones.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Find the active milestone index
    const activeIdx = newMilestones.findIndex(m => m.status === 'active');
    if (activeIdx >= 0) {
      setActiveIndex(activeIdx);
    } else {
      // If no active milestone, set the last completed one as active
      const lastCompletedIdx = newMilestones.map(m => m.status).lastIndexOf('completed');
      setActiveIndex(lastCompletedIdx >= 0 ? lastCompletedIdx : 0);
    }
    
    setMilestones(newMilestones);
  }, [customer, bankAccount, creditCard, loan, documents, kycResult, auditTrail, showFutureMilestones]);
  
  // Get status icon
  const getStatusIcon = (status: Milestone['status']) => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'active':
        return <Bell className="h-5 w-5 text-indigo-600" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'skipped':
        return <ArrowRight className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get status color
  const getStatusColor = (status: Milestone['status']) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'skipped':
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // If no milestones, show empty state
  if (milestones.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Journey Data Yet</h3>
        <p className="text-gray-600 mb-4">
          Start your banking journey by opening an account, applying for a credit card, or exploring loan options.
        </p>
      </div>
    );
  }
  
  // Render horizontal journey map
  if (layout === 'horizontal') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <h3 className="font-medium text-indigo-900">Customer Journey Map</h3>
          <p className="text-sm text-indigo-700">
            Track your banking relationship milestones and future opportunities
          </p>
        </div>
        
        <div className="p-6">
          {/* Journey timeline */}
          <div className="relative pb-12">
            {/* Timeline line */}
            <div className="absolute h-1 w-full bg-gray-200 top-5 left-0"></div>
            
            {/* Timeline nodes */}
            <div className="relative flex justify-between">
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.id} 
                  className="flex flex-col items-center w-36"
                  onMouseEnter={() => setSelectedMilestone(milestone.id)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                >
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                      activeIndex === index ? 'ring-4 ring-indigo-100' : ''
                    } ${
                      milestone.status === 'completed' ? 'bg-green-100' :
                      milestone.status === 'active' ? 'bg-indigo-100' :
                      'bg-gray-100'
                    }`}
                  >
                    <div className="text-lg">
                      {milestone.status === 'completed' ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                       milestone.status === 'active' ? 
                        milestone.icon :
                        milestone.status === 'upcoming' ?
                        <Clock className="h-5 w-5 text-gray-400" /> :
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      }
                    </div>
                  </div>
                  
                  <div 
                    className={`text-center mt-3 ${
                      selectedMilestone === milestone.id ? 'opacity-100' : 'opacity-80'
                    }`}
                  >
                    <p className={`text-xs font-medium ${
                      milestone.status === 'completed' ? 'text-green-600' :
                      milestone.status === 'active' ? 'text-indigo-600' :
                      'text-gray-500'
                    }`}>
                      {formatDate(milestone.date)}
                    </p>
                    <p className="text-sm font-medium mt-1">{milestone.title}</p>
                  </div>
                  
                  {/* Selected milestone details */}
                  {selectedMilestone === milestone.id && (
                    <div className="absolute top-16 left-0 right-0 z-20">
                      <div className={`p-3 rounded-lg shadow-lg border mt-2 text-left ${getStatusColor(milestone.status)}`}>
                        <p className="text-sm font-medium mb-1">{milestone.title}</p>
                        <p className="text-xs mb-2">{milestone.description}</p>
                        {milestone.details && (
                          <p className="text-xs">
                            {milestone.details}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected milestone details panel */}
          <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-3">Current Stage Details</h4>
            
            {activeIndex >= 0 && activeIndex < milestones.length ? (
              <div className={`p-4 rounded-lg border ${getStatusColor(milestones[activeIndex].status)}`}>
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-white">
                    {milestones[activeIndex].icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">{milestones[activeIndex].title}</h5>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(milestones[activeIndex].status)
                      }`}>
                        {milestones[activeIndex].status.charAt(0).toUpperCase() + milestones[activeIndex].status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-1">{milestones[activeIndex].description}</p>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(milestones[activeIndex].date)}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium capitalize">{milestones[activeIndex].type.replace('-', ' ')}</p>
                      </div>
                      
                      {milestones[activeIndex].details && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Details</p>
                          <p className="font-medium">{milestones[activeIndex].details}</p>
                        </div>
                      )}
                    </div>
                    
                    {milestones[activeIndex].status === 'upcoming' && (
                      <div className="mt-3">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                          Explore This Opportunity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-500">No active milestone selected</p>
              </div>
            )}
          </div>
          
          {/* Lifecycle Events */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-1.5" />
              Potential Lifecycle Events
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-gray-900">Home Purchase</h5>
                </div>
                <p className="text-xs text-gray-600">Buying a home? Explore our mortgage options with competitive rates.</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  </div>
                  <h5 className="font-medium text-gray-900">Income Increase</h5>
                </div>
                <p className="text-xs text-gray-600">Recently got a raise? Update your profile for better offers.</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <h5 className="font-medium text-gray-900">Family Changes</h5>
                </div>
                <p className="text-xs text-gray-600">Getting married or having children? We have financial solutions for life events.</p>
              </div>
            </div>
          </div>
          
          {/* Relationship Value */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Star className="h-5 w-5 text-indigo-600" />
              </div>
              
              <div className="flex-1">
                <h5 className="font-medium text-indigo-900 mb-1">Relationship Value</h5>
                <p className="text-sm text-indigo-700 mb-3">
                  {customer && bankAccount ? (
                    credit && loan ? 
                      "You're a valued customer with multiple products. Thank you for your trust!" :
                      "Thank you for banking with us. Explore our other products to maximize your benefits."
                  ) : (
                    "Start your banking relationship with us to unlock personalized recommendations and offers."
                  )}
                </p>
                
                <div className="flex items-center">
                  <div className="flex-1 h-2 bg-indigo-200 rounded-full mr-3">
                    <div 
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ 
                        width: `${
                          (bankAccount ? 25 : 0) + 
                          (creditCard ? 25 : 0) + 
                          (loan ? 25 : 0) + 
                          (documents.length > 0 ? 25 : 0)
                        }%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-indigo-900">
                    {(bankAccount ? 25 : 0) + 
                     (creditCard ? 25 : 0) + 
                     (loan ? 25 : 0) + 
                     (documents.length > 0 ? 25 : 0)
                    }%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render vertical journey map (alternative layout)
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <h3 className="font-medium text-indigo-900">Customer Journey Timeline</h3>
        <p className="text-sm text-indigo-700">
          Your banking journey milestones and future opportunities
        </p>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute top-0 bottom-0 left-5 w-1 bg-gray-200"></div>
          
          {/* Timeline nodes */}
          <div className="space-y-8 relative">
            {milestones.map((milestone, index) => (
              <div 
                key={milestone.id} 
                className={`flex ${index === activeIndex ? 'opacity-100' : 'opacity-80'}`}
              >
                <div 
                  className={`h-10 w-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                    milestone.status === 'completed' ? 'bg-green-100' :
                    milestone.status === 'active' ? 'bg-indigo-100' :
                    'bg-gray-100'
                  }`}
                >
                  <div className="text-lg">
                    {getStatusIcon(milestone.status)}
                  </div>
                </div>
                
                <div 
                  className={`ml-4 ${
                    selectedMilestone === milestone.id ? 'bg-gray-50' : ''
                  } p-3 rounded-lg flex-1`}
                  onMouseEnter={() => setSelectedMilestone(milestone.id)}
                  onMouseLeave={() => setSelectedMilestone(null)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(milestone.status)
                    }`}>
                      {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                  
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(milestone.date)}
                    </div>
                    
                    {selectedMilestone === milestone.id && milestone.details && (
                      <p className="text-xs text-gray-600 italic">{milestone.details}</p>
                    )}
                    
                    {milestone.status === 'upcoming' && (
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Explore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Relationship Value */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h4 className="font-medium text-indigo-900 mb-2 flex items-center">
            <DollarSign className="h-5 w-5 text-indigo-600 mr-1.5" />
            Relationship Value
          </h4>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-3 bg-white rounded-lg border border-indigo-200 flex flex-col items-center">
              <User className="h-6 w-6 text-indigo-500 mb-1" />
              <p className="text-xs font-medium">Profile</p>
              <div className="h-1 w-full mt-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${customer ? 'bg-green-500' : 'bg-gray-300'}`}
                  style={{ width: customer ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg border border-indigo-200 flex flex-col items-center">
              <Wallet className="h-6 w-6 text-indigo-500 mb-1" />
              <p className="text-xs font-medium">Accounts</p>
              <div className="h-1 w-full mt-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${bankAccount ? 'bg-green-500' : 'bg-gray-300'}`}
                  style={{ width: bankAccount ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg border border-indigo-200 flex flex-col items-center">
              <CreditCard className="h-6 w-6 text-indigo-500 mb-1" />
              <p className="text-xs font-medium">Credit Card</p>
              <div className="h-1 w-full mt-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${creditCard ? 'bg-green-500' : 'bg-gray-300'}`}
                  style={{ width: creditCard ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded-lg border border-indigo-200 flex flex-col items-center">
              <Landmark className="h-6 w-6 text-indigo-500 mb-1" />
              <p className="text-xs font-medium">Loans</p>
              <div className="h-1 w-full mt-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${loan ? 'bg-green-500' : 'bg-gray-300'}`}
                  style={{ width: loan ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-indigo-700 flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <p>
              {customer && (bankAccount || creditCard || loan) ? (
                (bankAccount && creditCard && loan) ? 
                  "Platinum relationship status achieved! You're enjoying our full suite of products." :
                  "Grow your relationship with us by exploring additional products tailored for you."
              ) : (
                "Start your banking journey today to build a relationship with personalized benefits."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJourneyMap;