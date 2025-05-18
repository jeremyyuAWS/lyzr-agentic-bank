import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { 
  BankingMode, 
  Customer, 
  BankAccount,
  Document,
  CreditCard,
  Loan,
  BankingMessage,
  BankingChatThread,
  KycResult
} from '../types/banking';
import { 
  generateMockCustomer, 
  generateMockAccount, 
  generateMockCreditCard,
  generateMockLoan,
  generateMockDocumentVerification,
  generateMockKycResult
} from '../data/mockBankingData';

interface BankingContextType {
  mode: BankingMode;
  setMode: (mode: BankingMode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Customer data
  customer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  
  // Account data
  bankAccount: BankAccount | null;
  setBankAccount: (account: BankAccount | null) => void;
  
  // Document handling
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => Document | null;
  
  // Credit card data
  creditCard: CreditCard | null;
  setCreditCard: (card: CreditCard | null) => void;
  
  // Loan data
  loan: Loan | null;
  setLoan: (loan: Loan | null) => void;
  
  // KYC/AML results
  kycResult: KycResult | null;
  setKycResult: (result: KycResult | null) => void;
  
  // Chat threads
  chatThreads: Record<BankingMode, BankingChatThread>;
  addMessageToChatThread: (mode: BankingMode, message: Omit<BankingMessage, 'id' | 'timestamp'>) => void;
  
  // Audit trail
  auditTrail: {timestamp: Date, event: string, details: string}[];
  addAuditEvent: (event: string, details: string) => void;
  
  // Reset workflows
  resetWorkflow: (mode: BankingMode) => void;
  resetAll: () => void;
  
  // Demo mode
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  
  // Show welcome modal
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<BankingMode>('account-opening');
  const [activeTab, setActiveTab] = useState('home');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [creditCard, setCreditCard] = useState<CreditCard | null>(null);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [kycResult, setKycResult] = useState<KycResult | null>(null);
  const [auditTrail, setAuditTrail] = useState<{timestamp: Date, event: string, details: string}[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  // Initialize chat threads for each mode
  const [chatThreads, setChatThreads] = useState<Record<BankingMode, BankingChatThread>>({
    'account-opening': {
      id: 'account-opening-thread',
      mode: 'account-opening',
      messages: [],
      status: 'active',
      startedAt: new Date()
    },
    'credit-card': {
      id: 'credit-card-thread',
      mode: 'credit-card',
      messages: [],
      status: 'active',
      startedAt: new Date()
    },
    'loan': {
      id: 'loan-thread',
      mode: 'loan',
      messages: [],
      status: 'active',
      startedAt: new Date()
    }
  });
  
  // Add a message to a specific chat thread
  const addMessageToChatThread = useCallback((mode: BankingMode, message: Omit<BankingMessage, 'id' | 'timestamp'>) => {
    const newMessage: BankingMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date()
    };
    
    setChatThreads(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        messages: [...prev[mode].messages, newMessage]
      }
    }));
    
    // Log user-agent interactions to audit trail
    if (message.sender === 'user') {
      addAuditEvent('User Message', `User sent message in ${mode} workflow: ${message.content.substring(0, 50)}...`);
    } else {
      addAuditEvent('Agent Response', `Agent responded in ${mode} workflow: ${message.content.substring(0, 50)}...`);
    }
    
    // If in demo mode, simulate agent responses for user messages
    if (isDemoMode && message.sender === 'user') {
      simulateAgentResponse(mode, message.content);
    }
  }, [isDemoMode]);
  
  // Simulate agent responses in demo mode
  const simulateAgentResponse = useCallback((mode: BankingMode, userMessage: string) => {
    setTimeout(() => {
      // These are placeholder responses - in a real implementation, we would use more sophisticated logic
      let responseContent = '';
      let agentType: BankingMessage['agentType'] = 'onboarding';
      
      switch (mode) {
        case 'account-opening':
          if (userMessage.toLowerCase().includes('account')) {
            responseContent = "I'd be happy to help you open a new bank account. To get started, I'll need to collect some personal information and verify your identity. What type of account are you interested in opening? We offer checking and savings accounts.";
            agentType = 'onboarding';
          } else if (userMessage.toLowerCase().includes('document') || userMessage.toLowerCase().includes('id') || userMessage.toLowerCase().includes('license')) {
            responseContent = "To verify your identity, we'll need a government-issued photo ID (such as a driver's license or passport) and a proof of address (like a recent utility bill). You can upload these documents securely using our system.";
            agentType = 'document';
          } else {
            responseContent = "Thanks for providing that information. I'm processing your account application. Is there anything specific you'd like to know about our account offerings or the application process?";
            agentType = 'account';
          }
          break;
          
        case 'credit-card':
          if (userMessage.toLowerCase().includes('credit') || userMessage.toLowerCase().includes('card')) {
            responseContent = "I can help you apply for a credit card. We offer several options based on your credit profile and needs. To provide you with the best recommendation, I'll need to gather some information about your income, employment, and existing debt.";
            agentType = 'credit';
          } else if (userMessage.toLowerCase().includes('limit') || userMessage.toLowerCase().includes('rate')) {
            responseContent = "Credit limits and interest rates are determined based on your credit history, income, and existing debt obligations. Once we review your application, I can provide you with the specific terms for which you qualify.";
            agentType = 'credit';
          } else {
            responseContent = "Thank you for that information. I'm processing your credit card application. We'll need to perform a soft credit check to determine your eligibility and terms. This won't affect your credit score.";
            agentType = 'credit';
          }
          break;
          
        case 'loan':
          if (userMessage.toLowerCase().includes('loan')) {
            responseContent = "I can help you with a loan application. We offer personal loans, home loans, and auto loans. What type of loan are you interested in? I'll need to understand your loan purpose, desired amount, and term to get started.";
            agentType = 'loan';
          } else if (userMessage.toLowerCase().includes('rate') || userMessage.toLowerCase().includes('interest') || userMessage.toLowerCase().includes('payment')) {
            responseContent = "Loan interest rates depend on several factors including your credit score, loan amount, term, and purpose. Once we have your complete application, we can provide you with the specific rate and monthly payment details.";
            agentType = 'loan';
          } else {
            responseContent = "Thank you for providing that information about your loan request. I'll need to verify your income and run a credit check to determine your eligibility. Would you be able to provide some documentation to verify your income?";
            agentType = 'loan';
          }
          break;
      }
      
      addMessageToChatThread(mode, {
        sender: 'agent',
        content: responseContent,
        agentType
      });
    }, 1000); // Simulate processing time
  }, [addMessageToChatThread]);
  
  // Add a document
  const addDocument = useCallback((document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date()
    };
    
    setDocuments(prev => [...prev, newDocument]);
    
    // Add to audit trail
    addAuditEvent('Document Upload', `Document ${document.type} uploaded and pending verification`);
    
    // In demo mode, simulate document verification after a delay
    if (isDemoMode) {
      setTimeout(() => {
        const verificationResult = generateMockDocumentVerification(newDocument.type);
        updateDocument(newDocument.id, {
          status: verificationResult.status,
          verifiedAt: new Date(),
          metadata: verificationResult.metadata
        });
        
        // Add to audit trail
        addAuditEvent('Document Verification', `Document ${document.type} verification ${verificationResult.status}`);
        
        // If document is verified and it's an ID, generate KYC result
        if (verificationResult.status === 'verified' && 
            (document.type === 'id' || document.type === 'passport' || document.type === 'driver-license') && 
            customer) {
          const mockKycResult = generateMockKycResult(customer.id);
          setKycResult(mockKycResult);
          
          // Add to audit trail
          addAuditEvent('KYC Check', `KYC verification ${mockKycResult.status} with risk score ${mockKycResult.riskScore}`);
        }
      }, 2000);
    }
  }, [customer, isDemoMode]);
  
  // Update a document
  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    let updatedDocument: Document | null = null;
    
    setDocuments(prev => {
      const updatedDocuments = prev.map(doc => {
        if (doc.id === id) {
          updatedDocument = { ...doc, ...updates };
          return updatedDocument;
        }
        return doc;
      });
      
      return updatedDocuments;
    });
    
    return updatedDocument;
  }, []);
  
  // Add an audit event
  const addAuditEvent = useCallback((event: string, details: string) => {
    setAuditTrail(prev => [...prev, {
      timestamp: new Date(),
      event,
      details
    }]);
  }, []);
  
  // Reset a specific workflow
  const resetWorkflow = useCallback((mode: BankingMode) => {
    // Reset the chat thread for the specified mode
    setChatThreads(prev => ({
      ...prev,
      [mode]: {
        id: `${mode}-thread-${Date.now()}`,
        mode,
        messages: [],
        status: 'active',
        startedAt: new Date()
      }
    }));
    
    // Reset workflow-specific state
    switch (mode) {
      case 'account-opening':
        setCustomer(null);
        setBankAccount(null);
        setKycResult(null);
        // Clear documents related to account opening
        setDocuments(prev => prev.filter(doc => 
          !(doc.type === 'id' || doc.type === 'passport' || doc.type === 'driver-license' || doc.type === 'utility-bill')));
        break;
      
      case 'credit-card':
        setCreditCard(null);
        // Keep customer data if it exists
        break;
        
      case 'loan':
        setLoan(null);
        // Keep customer data if it exists
        break;
    }
    
    addAuditEvent('Workflow Reset', `The ${mode} workflow was reset`);
  }, [addAuditEvent]);
  
  // Reset everything
  const resetAll = useCallback(() => {
    setCustomer(null);
    setBankAccount(null);
    setCreditCard(null);
    setLoan(null);
    setDocuments([]);
    setKycResult(null);
    
    // Reset all chat threads
    setChatThreads({
      'account-opening': {
        id: 'account-opening-thread-new',
        mode: 'account-opening',
        messages: [],
        status: 'active',
        startedAt: new Date()
      },
      'credit-card': {
        id: 'credit-card-thread-new',
        mode: 'credit-card',
        messages: [],
        status: 'active',
        startedAt: new Date()
      },
      'loan': {
        id: 'loan-thread-new',
        mode: 'loan',
        messages: [],
        status: 'active',
        startedAt: new Date()
      }
    });
    
    // Clear audit trail or start a new session
    setAuditTrail([{
      timestamp: new Date(),
      event: 'Session Reset',
      details: 'All workflows and data have been reset'
    }]);
  }, []);
  
  // Initialize with an empty audit log entry
  useEffect(() => {
    setAuditTrail([{
      timestamp: new Date(),
      event: 'Session Started',
      details: 'Banking session initialized'
    }]);
  }, []);

  return (
    <BankingContext.Provider
      value={{
        mode,
        setMode,
        activeTab,
        setActiveTab,
        customer,
        setCustomer,
        bankAccount,
        setBankAccount,
        documents,
        addDocument,
        updateDocument,
        creditCard,
        setCreditCard,
        loan,
        setLoan,
        kycResult,
        setKycResult,
        chatThreads,
        addMessageToChatThread,
        auditTrail,
        addAuditEvent,
        resetWorkflow,
        resetAll,
        isDemoMode,
        setIsDemoMode,
        showWelcomeModal,
        setShowWelcomeModal
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBankingContext = () => {
  const context = useContext(BankingContext);
  if (context === undefined) {
    throw new Error('useBankingContext must be used within a BankingProvider');
  }
  return context;
};