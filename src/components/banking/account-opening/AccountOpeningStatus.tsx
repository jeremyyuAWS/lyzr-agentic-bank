import React from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck, 
  User, 
  ShieldCheck, 
  CreditCard,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AccountOpeningStatus: React.FC = () => {
  const { 
    customer, 
    bankAccount, 
    documents, 
    kycResult, 
    chatThreads 
  } = useBankingContext();
  
  const [expandedSection, setExpandedSection] = React.useState<string | null>('kyc');
  
  // Determine overall application status
  const isApplicationStarted = chatThreads['account-opening'].messages.length > 0;
  const areDocumentsUploaded = documents.some(doc => 
    (doc.type === 'id' || doc.type === 'passport' || doc.type === 'driver-license') && 
    doc.status === 'verified'
  );
  const isKycCompleted = kycResult !== null;
  const isAccountCreated = bankAccount !== null;
  
  const applicationProgress = isApplicationStarted 
    ? isAccountCreated
      ? 100
      : isKycCompleted
        ? 75
        : areDocumentsUploaded
          ? 50
          : 25
    : 0;
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  // Get ID document if available
  const idDocument = documents.find(doc => 
    (doc.type === 'id' || doc.type === 'passport' || doc.type === 'driver-license') && 
    doc.status === 'verified'
  );
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Account Opening Status</h2>
          <p className="mt-1 text-sm text-gray-600">
            Track the progress of your account application
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
                    ? `Started on ${chatThreads['account-opening'].startedAt.toLocaleString()}`
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
          
          {/* Document Verification */}
          <div 
            className={`mb-5 ${isApplicationStarted ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => isApplicationStarted && toggleSection('documents')}
          >
            <div className="flex items-center cursor-pointer">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                areDocumentsUploaded ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {areDocumentsUploaded ? (
                  <FileCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <FileCheck className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Identity Verification</h3>
                <p className="text-sm text-gray-500">
                  {areDocumentsUploaded
                    ? 'Identity document verified successfully'
                    : 'Government-issued ID required'}
                </p>
              </div>
              <div className="flex items-center">
                {areDocumentsUploaded && (
                  <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium mr-2">
                    Verified
                  </div>
                )}
                {isApplicationStarted && (
                  expandedSection === 'documents' ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )
                )}
              </div>
            </div>
            
            {/* Expanded Document Section */}
            {expandedSection === 'documents' && (
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
                          Government-issued photo ID (Driver's License, Passport, etc.)
                        </li>
                        <li className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"></span>
                          Proof of address (Utility bill, Bank statement, etc.)
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* KYC/AML Check */}
          <div 
            className={`mb-5 ${areDocumentsUploaded ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => areDocumentsUploaded && toggleSection('kyc')}
          >
            <div className="flex items-center cursor-pointer">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                isKycCompleted ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {isKycCompleted ? (
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                ) : (
                  <ShieldCheck className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">KYC/AML Check</h3>
                <p className="text-sm text-gray-500">
                  {isKycCompleted
                    ? kycResult?.status === 'passed'
                      ? 'Identity verification passed'
                      : 'Identity verification requires review'
                    : 'Pending identity verification'}
                </p>
              </div>
              <div className="flex items-center">
                {isKycCompleted && (
                  <div className={`py-1 px-2.5 rounded-full text-xs font-medium mr-2 ${
                    kycResult?.status === 'passed'
                      ? 'bg-green-100 text-green-800'
                      : kycResult?.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {kycResult?.status}
                  </div>
                )}
                {areDocumentsUploaded && (
                  expandedSection === 'kyc' ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )
                )}
              </div>
            </div>
            
            {/* Expanded KYC Section */}
            {expandedSection === 'kyc' && (
              <div className="mt-3 ml-13 pl-6 border-l-2 border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  {kycResult ? (
                    <>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-medium text-gray-700">KYC/AML Results</h4>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-1.5 ${
                            kycResult.status === 'passed'
                              ? 'bg-green-500'
                              : kycResult.status === 'failed'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          }`}></div>
                          <span className="text-xs text-gray-600">
                            Check completed at {kycResult.checkDate.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Risk Score</p>
                          <div className="flex items-center">
                            <div className="flex-1">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    kycResult.riskScore < 0.3
                                      ? 'bg-green-500'
                                      : kycResult.riskScore < 0.7
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${kycResult.riskScore * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="ml-2 text-sm font-medium">
                              {(kycResult.riskScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className={`text-sm font-medium ${
                            kycResult.status === 'passed'
                              ? 'text-green-600'
                              : kycResult.status === 'failed'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}>
                            {kycResult.status.charAt(0).toUpperCase() + kycResult.status.slice(1)}
                          </p>
                        </div>
                      </div>
                      
                      {kycResult.flags.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Identified Flags:</p>
                          <div className="space-y-2">
                            {kycResult.flags.map((flag, index) => (
                              <div key={index} className="flex items-start bg-white p-2 rounded border border-gray-200">
                                <AlertTriangle className={`h-4 w-4 mt-0.5 mr-2 ${
                                  flag.severity === 'high'
                                    ? 'text-red-500'
                                    : flag.severity === 'medium'
                                    ? 'text-amber-500'
                                    : 'text-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-700">
                                    {flag.type.charAt(0).toUpperCase() + flag.type.slice(1)} - {flag.severity.toUpperCase()}
                                  </p>
                                  <p className="text-xs text-gray-600">{flag.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {kycResult.notes && (
                        <div className="text-xs text-gray-500 p-2 border-t border-gray-200 mt-2 pt-2">
                          <span className="font-medium">Notes: </span>
                          {kycResult.notes}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center py-3">
                      <Clock className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">KYC/AML check not started yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        This check will begin automatically after document verification
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Account Creation */}
          <div className={`mb-5 ${isKycCompleted ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                isAccountCreated ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {isAccountCreated ? (
                  <CreditCard className="h-6 w-6 text-green-600" />
                ) : (
                  <CreditCard className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">Account Creation</h3>
                <p className="text-sm text-gray-500">
                  {isAccountCreated
                    ? `Account created on ${bankAccount?.openedAt.toLocaleDateString()}`
                    : 'Pending KYC/AML verification'}
                </p>
              </div>
              {isAccountCreated && (
                <div className="bg-green-100 text-green-800 py-1 px-2.5 rounded-full text-xs font-medium">
                  Completed
                </div>
              )}
            </div>
            
            {/* Account Details (if created) */}
            {isAccountCreated && (
              <div className="mt-3 ml-13 pl-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <h4 className="text-sm font-medium text-indigo-800 mb-3">Your New Account Details</h4>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Account Number</p>
                        <p className="text-sm font-medium text-gray-900">{bankAccount?.accountNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Routing Number</p>
                        <p className="text-sm font-medium text-gray-900">{bankAccount?.routingNumber}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Account Type</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {bankAccount?.accountType}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          bankAccount?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            bankAccount?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                          {bankAccount?.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                        <p className="text-xs text-gray-600">Your account is now ready to use</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-indigo-600 mt-3">
                    Check your email for additional details and next steps to access your new account.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOpeningStatus;