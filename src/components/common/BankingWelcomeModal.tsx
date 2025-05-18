import React from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { X, Shield, CreditCard, Landmark, User, FileCheck, AlertTriangle } from 'lucide-react';

const BankingWelcomeModal: React.FC = () => {
  const { showWelcomeModal, setShowWelcomeModal } = useBankingContext();

  if (!showWelcomeModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowWelcomeModal(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-14 sm:w-14">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-4" id="modal-title">
                  Welcome to AgenticBank
                </h3>
                <div className="mt-2 space-y-4">
                  <p className="text-base text-gray-500">
                    Experience the future of banking with our AI-powered agents that guide you through common banking workflows.
                    This demo showcases how intelligent agents can transform banking processes.
                  </p>
                  
                  <div className="mt-6 border-t border-b border-gray-200 py-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Banking Workflows</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <User className="h-5 w-5 text-indigo-600 mr-2" />
                          <h4 className="font-medium text-indigo-800">Account Opening</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Open a new bank account with our guided process that handles identity verification, document uploads, and KYC checks.
                        </p>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
                          <h4 className="font-medium text-indigo-800">Credit Card Issuance</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Apply for a credit card with an agent that evaluates your eligibility, determines your limit, and issues a virtual card.
                        </p>
                      </div>
                      
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <Landmark className="h-5 w-5 text-indigo-600 mr-2" />
                          <h4 className="font-medium text-indigo-800">Loan Origination</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Request a loan with our intelligent agent that guides you through the application, verifies documents, and calculates your terms.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-b border-gray-200 pb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm mr-3 mt-0.5">
                          1
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Choose a workflow</span> - Select the banking process you want to experience
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm mr-3 mt-0.5">
                          2
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Chat with the AI agent</span> - Engage in a natural conversation to complete your request
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm mr-3 mt-0.5">
                          3
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Upload documents</span> - Provide necessary information through our secure interface
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm mr-3 mt-0.5">
                          4
                        </div>
                        <div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Receive instant decisions</span> - Get immediate feedback and see the outcome of your request
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg mt-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-amber-800 mb-1">Demo Information</h5>
                      <p className="text-sm text-amber-700">
                        This is a demonstration application. All data is simulated and no real financial transactions occur.
                        The agents, KYC checks, and credit decisions are simulated for demonstration purposes only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowWelcomeModal(false)}
            >
              Get Started
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setShowWelcomeModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingWelcomeModal;