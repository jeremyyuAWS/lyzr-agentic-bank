import React, { useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard, 
  DollarSign, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Gauge
} from 'lucide-react';

const CreditCardStatus: React.FC = () => {
  const { creditCard, documents, customer } = useBankingContext();
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Determine application status
  const isApplicationStarted = customer !== null;
  const areDocumentsUploaded = documents.some(doc => 
    (doc.type === 'pay-stub' || doc.type === 'tax-return') && 
    doc.status === 'verified'
  );
  const isCardApproved = creditCard !== null;
  
  const applicationProgress = isApplicationStarted 
    ? isCardApproved
      ? 100
      : areDocumentsUploaded
        ? 66
        : 33
    : 0;

  // Get credit score from generated data
  // In a real app, this would come from actual credit score data
  const creditScore = Math.floor(Math.random() * (800 - 650)) + 650;
  const creditGrade = creditScore >= 750 ? 'Excellent' : 
                      creditScore >= 700 ? 'Very Good' : 
                      creditScore >= 650 ? 'Good' : 
                      creditScore >= 600 ? 'Fair' : 'Poor';
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Credit Card Application Status</h2>
          <p className="mt-1 text-sm text-gray-600">
            {isCardApproved 
              ? 'Your application has been approved' 
              : 'Track the progress of your credit card application'}
          </p>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>Application Progress</span>
              <span>{applicationProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-700" 
                style={{ width: `${applicationProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-5">
          {isCardApproved ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-green-800 mb-1">Application Approved!</h3>
                  <p className="text-green-700 text-sm mb-3">
                    Your credit card has been approved and is ready to use.
                  </p>
                  
                  {/* Card details */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 shadow-md text-white max-w-sm">
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
                        **** **** **** {creditCard?.cardNumber.slice(-4)}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs opacity-90 mb-1">Card Holder</p>
                        <p className="font-medium">{customer?.firstName} {customer?.lastName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-90 mb-1">Expires</p>
                        <p className="font-medium">{creditCard?.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border border-green-200 p-3">
                      <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${creditCard?.creditLimit.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg border border-green-200 p-3">
                      <p className="text-xs text-gray-500 mb-1">APR</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {creditCard?.apr.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-green-700 mt-4">
                    Your physical card will arrive in 5-7 business days. You can start using your virtual card immediately.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Application Started */}
              <div className="mb-5">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    isApplicationStarted ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isApplicationStarted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <Clock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Application Started</h3>
                    <p className="text-sm text-gray-500">
                      {isApplicationStarted
                        ? 'Your application is being processed'
                        : 'Not started yet'}
                    </p>
                  </div>
                  {isApplicationStarted && (
                    <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium">
                      Completed
                    </div>
                  )}
                </div>
              </div>
              
              {/* Income Verification */}
              <div 
                className={`mb-5 ${isApplicationStarted ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => isApplicationStarted && toggleSection('income')}
              >
                <div className="flex items-center cursor-pointer">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    areDocumentsUploaded ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {areDocumentsUploaded ? (
                      <DollarSign className="h-6 w-6 text-green-600" />
                    ) : (
                      <DollarSign className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Income Verification</h3>
                    <p className="text-sm text-gray-500">
                      {areDocumentsUploaded
                        ? 'Income verified successfully'
                        : 'Proof of income required'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {areDocumentsUploaded && (
                      <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium mr-2">
                        Verified
                      </div>
                    )}
                    {isApplicationStarted && (
                      expandedSection === 'income' ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
                
                {/* Expanded Income Verification Section */}
                {expandedSection === 'income' && (
                  <div className="mt-3 ml-13 pl-6 border-l-2 border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Income Details</h4>
                      
                      {areDocumentsUploaded ? (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Annual Income</p>
                              <p className="text-sm font-medium text-gray-900">
                                ${customer?.annualIncome.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">Employment</p>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {customer?.employmentStatus}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start bg-green-50 p-3 rounded-lg border border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" />
                            <p className="text-sm text-green-800">
                              Your income has been verified and meets our requirements for a credit card.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            Please provide one of the following documents to verify your income:
                          </p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <ArrowRight className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              Recent pay stub (last 30 days)
                            </li>
                            <li className="flex items-center">
                              <ArrowRight className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              W-2 form (most recent tax year)
                            </li>
                            <li className="flex items-center">
                              <ArrowRight className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              Tax return (most recent tax year)
                            </li>
                            <li className="flex items-center">
                              <ArrowRight className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
                              Bank statements (last 3 months)
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Credit Check */}
              <div 
                className={`mb-5 ${areDocumentsUploaded ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => areDocumentsUploaded && toggleSection('credit')}
              >
                <div className="flex items-center cursor-pointer">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    isCardApproved ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isCardApproved ? (
                      <Gauge className="h-6 w-6 text-green-600" />
                    ) : (
                      <Gauge className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Credit Evaluation</h3>
                    <p className="text-sm text-gray-500">
                      {isCardApproved
                        ? 'Credit check complete'
                        : 'Pending income verification'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isCardApproved && (
                      <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium mr-2">
                        Approved
                      </div>
                    )}
                    {areDocumentsUploaded && (
                      expandedSection === 'credit' ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
                
                {/* Expanded Credit Check Section */}
                {expandedSection === 'credit' && (
                  <div className="mt-3 ml-13 pl-6 border-l-2 border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-4">
                      {isCardApproved ? (
                        <>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Credit Evaluation Results</h4>
                          
                          <div className="grid grid-cols-1 gap-4 mb-3">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-900">Credit Score</h5>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  creditGrade === 'Excellent' || creditGrade === 'Very Good'
                                    ? 'bg-green-100 text-green-800'
                                    : creditGrade === 'Good'
                                    ? 'bg-blue-100 text-blue-800'
                                    : creditGrade === 'Fair'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {creditGrade}
                                </div>
                              </div>
                              
                              <div className="relative pt-5">
                                <div className="flex mb-1 justify-between text-xs text-gray-600">
                                  <span>Poor</span>
                                  <span>Fair</span>
                                  <span>Good</span>
                                  <span>Very Good</span>
                                  <span>Excellent</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full">
                                  <div className="absolute left-0 bottom-0 h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500" style={{width: '100%'}}></div>
                                </div>
                                <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-indigo-600 transform -translate-y-1/2" style={{
                                  left: `${((creditScore - 300) / (850 - 300)) * 100}%`,
                                  top: '5px'
                                }}></div>
                                <div className="mt-2 text-center">
                                  <span className="text-lg font-bold text-gray-900">{creditScore}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Credit Card Type</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">{creditCard?.cardType}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                                <p className="text-sm font-medium text-gray-900">${creditCard?.creditLimit.toLocaleString()}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">APR</p>
                                <p className="text-sm font-medium text-gray-900">{creditCard?.apr.toFixed(2)}%</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Cash Back</p>
                                <p className="text-sm font-medium text-gray-900">{creditCard?.cashBackRate}%</p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center py-3">
                          <Clock className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Credit evaluation not started yet</p>
                          <p className="text-xs text-gray-500 mt-1">
                            This check will begin automatically after income verification
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card Issuance */}
              <div className={`mb-5 ${isCardApproved ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-gray-100`}>
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Card Issuance</h3>
                    <p className="text-sm text-gray-500">
                      Pending credit approval
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardStatus;