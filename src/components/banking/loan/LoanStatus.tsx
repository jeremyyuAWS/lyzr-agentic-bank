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
  Gauge,
  Calculator,
  FileText
} from 'lucide-react';

const LoanStatus: React.FC = () => {
  const { loan, documents, customer } = useBankingContext();
  const [expandedSection, setExpandedSection] = useState<string | null>('details');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Placeholder loan for UI if no real loan exists yet
  const placeholderLoan = loan || {
    id: '',
    customerId: '',
    loanType: 'personal' as const,
    amount: 15000,
    term: 36,
    interestRate: 7.99,
    monthlyPayment: 467.83,
    originationFee: 300,
    status: 'pending' as const,
    schedule: []
  };
  
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Determine application status
  const isApplicationStarted = customer !== null;
  const areDocumentsUploaded = documents.some(doc => 
    (doc.type === 'pay-stub' || doc.type === 'tax-return') && 
    doc.status === 'verified'
  );
  const isLoanApproved = loan !== null && (loan.status === 'approved' || loan.status === 'funded');
  
  const applicationProgress = isApplicationStarted 
    ? isLoanApproved
      ? 100
      : areDocumentsUploaded
        ? 66
        : 33
    : 0;
    
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Loan Application Status</h2>
          <p className="mt-1 text-sm text-gray-600">
            {isLoanApproved 
              ? 'Your loan application has been approved!' 
              : 'Track the progress of your loan application'}
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
          {isLoanApproved ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-green-800 mb-1">Loan Application Approved!</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Your loan application has been approved. Here are the details of your loan.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Loan Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Loan Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{loan?.loanType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(loan?.amount || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Loan Term</p>
                          <p className="text-sm font-medium text-gray-900">{loan?.term} months</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                          <p className="text-sm font-medium text-gray-900">{loan?.interestRate.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Details</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
                          <p className="text-lg font-medium text-gray-900">{formatCurrency(loan?.monthlyPayment || 0)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency((loan?.monthlyPayment || 0) * (loan?.term || 0) - (loan?.amount || 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency((loan?.monthlyPayment || 0) * (loan?.term || 0) + (loan?.originationFee || 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Origination Fee</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(loan?.originationFee || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="bg-white rounded-lg p-4 border border-green-200 cursor-pointer"
                    onClick={() => toggleSection('schedule')}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Amortization Schedule</h4>
                      {expandedSection === 'schedule' ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    {expandedSection === 'schedule' && loan?.schedule && (
                      <div className="mt-3 max-h-60 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                #
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Date
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Payment
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Principal
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Interest
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                                Remaining
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {loan.schedule.slice(0, 12).map((payment) => (
                              <tr key={payment.paymentNumber} className="hover:bg-gray-50">
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  {payment.paymentNumber}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  {payment.date}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  ${payment.totalPayment.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  ${payment.principalPayment.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  ${payment.interestPayment.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  ${payment.remainingPrincipal.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {loan.schedule.length > 12 && (
                          <p className="text-center text-xs text-gray-500 mt-2">
                            Showing first 12 months of payments out of {loan.term} months total
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-sm text-green-700">
                      Next Steps: The approved funds will be deposited into your account within 1-2 business days. Your first payment is due on {loan?.schedule[0].date}.
                    </p>
                  </div>
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
                      <FileText className="h-6 w-6 text-green-600" />
                    ) : (
                      <FileText className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Documentation</h3>
                    <p className="text-sm text-gray-500">
                      {areDocumentsUploaded
                        ? 'Required documents verified'
                        : 'Income and identity verification required'}
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
                
                {/* Expanded Document Section */}
                {expandedSection === 'income' && (
                  <div className="mt-3 ml-13 pl-6 border-l-2 border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Document Status</h4>
                      
                      {/* Document list */}
                      <div className="space-y-3">
                        {documents.length > 0 ? (
                          documents.map(doc => (
                            <div key={doc.id} className="flex items-center">
                              {doc.status === 'verified' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                              ) : doc.status === 'rejected' ? (
                                <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                              ) : (
                                <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {doc.type.replace(/-/g, ' ')}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Uploaded {doc.uploadedAt.toLocaleString()}
                                </p>
                              </div>
                              
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                doc.status === 'verified'
                                  ? 'bg-green-100 text-green-800'
                                  : doc.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No documents uploaded yet</p>
                        )}
                      </div>
                      
                      {/* Document requirements */}
                      {!areDocumentsUploaded && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-700 font-medium mb-2">Required Documents:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"></span>
                              Identity verification (ID, Passport)
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"></span>
                              Proof of income (Pay stubs, Tax returns)
                            </li>
                            <li className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"></span>
                              {placeholderLoan.loanType === 'home' ? 'Property documentation' : 
                                placeholderLoan.loanType === 'auto' ? 'Vehicle information' : 
                                'Proof of address'}
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Loan Calculation */}
              <div 
                className={`mb-5 ${areDocumentsUploaded ? 'opacity-100' : 'opacity-50'}`}
                onClick={() => areDocumentsUploaded && toggleSection('calculation')}
              >
                <div className="flex items-center cursor-pointer">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    isLoanApproved ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isLoanApproved ? (
                      <Calculator className="h-6 w-6 text-green-600" />
                    ) : (
                      <Calculator className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Loan Calculation</h3>
                    <p className="text-sm text-gray-500">
                      {isLoanApproved
                        ? 'Loan terms calculated'
                        : 'Pending document verification'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isLoanApproved && (
                      <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium mr-2">
                        Calculated
                      </div>
                    )}
                    {areDocumentsUploaded && (
                      expandedSection === 'calculation' ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )
                    )}
                  </div>
                </div>
                
                {/* Expanded Calculation Section */}
                {expandedSection === 'calculation' && (
                  <div className="mt-3 ml-13 pl-6 border-l-2 border-gray-200">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Loan Details</h4>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Loan Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {placeholderLoan.loanType}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Loan Amount</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(placeholderLoan.amount)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Loan Term</p>
                          <p className="text-sm font-medium text-gray-900">
                            {placeholderLoan.term} months
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                          <p className="text-sm font-medium text-gray-900">
                            {placeholderLoan.interestRate.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200 text-center mb-4">
                        <p className="text-sm text-gray-700 mb-1">Monthly Payment</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatCurrency(placeholderLoan.monthlyPayment)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          for {placeholderLoan.term} months
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Total Interest</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(placeholderLoan.monthlyPayment * placeholderLoan.term - placeholderLoan.amount)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Origination Fee</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(placeholderLoan.originationFee)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Total Cost</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(placeholderLoan.monthlyPayment * placeholderLoan.term + placeholderLoan.originationFee)}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">APR</p>
                          <p className="text-sm font-medium text-gray-900">
                            {(placeholderLoan.interestRate + 0.5).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Approval */}
              <div className={`mb-5 ${isLoanApproved ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 bg-gray-100`}>
                    <DollarSign className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">Loan Approval</h3>
                    <p className="text-sm text-gray-500">
                      Pending loan calculation
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

export default LoanStatus;