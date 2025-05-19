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
  KycResult,
  ComplianceCheck,
  FraudAlert,
  TreasuryPosition,
  InterBankTransfer,
  BaselMetric,
  RegulatoryReport
} from '../types/banking';
import { 
  generateMockCustomer, 
  generateMockAccount, 
  generateMockCreditCard,
  generateMockLoan,
  generateMockDocumentVerification,
  generateMockKycResult,
  generateMockComplianceCheck,
  generateMockFraudAlert
} from '../data/mockBankingData';
import {
  generateTreasuryPositions,
  generateInterBankTransfers,
  generateBaselMetrics,
  generateRegulatoryReports
} from '../data/mockTreasuryData';

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
  
  // Compliance checks
  complianceChecks: ComplianceCheck[];
  addComplianceCheck: (check: ComplianceCheck) => void;
  
  // Fraud alerts
  fraudAlerts: FraudAlert[];
  addFraudAlert: (alert: FraudAlert) => void;
  updateFraudAlert: (id: string, updates: Partial<FraudAlert>) => FraudAlert | null;
  
  // Treasury operations data
  treasuryPositions: TreasuryPosition[];
  interBankTransfers: InterBankTransfer[];
  baselMetrics: BaselMetric[];
  regulatoryReports: RegulatoryReport[];
  updateTreasuryData: () => void;
  
  // Chat threads
  chatThreads: Record<BankingMode, BankingChatThread>;
  addMessageToChatThread: (mode: BankingMode, message: Omit<BankingMessage, 'id' | 'timestamp'>) => void;
  
  // Audit trail
  auditTrail: {timestamp: Date, event: string, details: string}[];
  addAuditEvent: (event: string, details: string) => void;
  
  // Reset workflows
  resetWorkflow: (mode: BankingMode) => void;
  resetAll: () => void;
  
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
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [auditTrail, setAuditTrail] = useState<{timestamp: Date, event: string, details: string}[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  // Treasury operations data
  const [treasuryPositions, setTreasuryPositions] = useState<TreasuryPosition[]>([]);
  const [interBankTransfers, setInterBankTransfers] = useState<InterBankTransfer[]>([]);
  const [baselMetrics, setBaselMetrics] = useState<BaselMetric[]>([]);
  const [regulatoryReports, setRegulatoryReports] = useState<RegulatoryReport[]>([]);
  
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
    },
    'fraud-detection': {
      id: 'fraud-detection-thread',
      mode: 'fraud-detection',
      messages: [],
      status: 'active',
      startedAt: new Date()
    },
    'treasury-ops': {
      id: 'treasury-ops-thread',
      mode: 'treasury-ops',
      messages: [],
      status: 'active',
      startedAt: new Date()
    }
  });
  
  // Initialize treasury operations data
  useEffect(() => {
    updateTreasuryData();
  }, []);
  
  // Update treasury data
  const updateTreasuryData = useCallback(() => {
    setTreasuryPositions(generateTreasuryPositions(20));
    setInterBankTransfers(generateInterBankTransfers(15));
    setBaselMetrics(generateBaselMetrics());
    setRegulatoryReports(generateRegulatoryReports(10));
    
    // Add audit event
    addAuditEvent('Treasury Data', 'Treasury operations data refreshed');
  }, []);
  
  // Add a message to a specific chat thread
  const addMessageToChatThread = useCallback((mode: BankingMode, message: Omit<BankingMessage, 'id' | 'timestamp'>) => {
    const newMessage = {
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
    
    // Log to audit trail
    if (message.sender === 'user') {
      addAuditEvent('Chat Message', `User sent message in ${mode} workflow: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`);
    } else {
      addAuditEvent('Agent Response', `Agent responded in ${mode} workflow: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`);
    }
    
    // Simulate user and agent messages in demo mode
    const simulateAgentResponse = (eventType: string, details: string) => {
      // Treasury operations simulation
      if (mode === 'treasury-ops') {
        setTimeout(() => {
          if (message.content.toLowerCase().includes('liquidity') || 
              message.content.toLowerCase().includes('cash') || 
              message.content.toLowerCase().includes('position')) {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "I can help with liquidity management and position monitoring. Our current liquidity position is strong with coverage ratios exceeding regulatory requirements. Would you like to see a detailed breakdown of our high-quality liquid assets or cash flow projections?",
              agentType: 'treasury'
            });
          } else if (message.content.toLowerCase().includes('basel') || 
                     message.content.toLowerCase().includes('regulatory') || 
                     message.content.toLowerCase().includes('compliance')) {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "Our Basel III compliance is currently within acceptable parameters. All key metrics including CET1 Ratio, LCR, and NSFR are above regulatory minimums, though we're monitoring two metrics that are showing a downward trend. Would you like to review the detailed compliance dashboard?",
              agentType: 'treasury'
            });
          } else if (message.content.toLowerCase().includes('transfer') || 
                     message.content.toLowerCase().includes('interbank') || 
                     message.content.toLowerCase().includes('swift')) {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "I can assist with interbank transfers and correspondent banking activities. We currently have 8 pending transfers and completed 15 in the past 72 hours. Would you like to initiate a new transfer or review the status of existing transfers?",
              agentType: 'treasury'
            });
          } else if (message.content.toLowerCase().includes('report') || 
                     message.content.toLowerCase().includes('filing')) {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "We have 3 regulatory reports due in the next 15 days, including the FR 2052a Liquidity Monitoring Report. Two reports are currently in preparation phase. Would you like to see the complete regulatory reporting calendar or focus on upcoming deadlines?",
              agentType: 'treasury'
            });
          } else if (message.content.toLowerCase().includes('capital') || 
                     message.content.toLowerCase().includes('allocation') || 
                     message.content.toLowerCase().includes('rwa')) {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "I can provide information on our capital allocation and management. Currently, our CET1 ratio is strong at 13.5% with risk-weighted assets of approximately $190 billion. Our capital allocation strategy focuses on optimizing returns while maintaining regulatory compliance. Would you like to see the full capital breakdown by business unit?",
              agentType: 'treasury'
            });
          } else {
            addMessageToChatThread(mode, {
              sender: 'agent',
              content: "I'm your Treasury Operations Assistant, ready to help with liquidity management, regulatory compliance, interbank transfers, capital allocation, and reporting requirements. I can provide real-time insights on our financial positions and help optimize treasury operations. What specific area would you like to explore today?",
              agentType: 'treasury'
            });
          }
        }, 1000);
        return;
      }
      
      // Determine which agents should react based on event type
      if (message.content.toLowerCase().includes('fraud') || 
          message.content.toLowerCase().includes('suspicious') || 
          message.content.toLowerCase().includes('alert')) {
        setTimeout(() => {
          addMessageToChatThread(mode, {
            sender: 'agent',
            content: "I can help you with fraud concerns. Our AI-powered fraud detection system continuously monitors your accounts for suspicious activity. If you've received an alert, we should review the transactions in question right away. Can you tell me more about the alert you received?",
            agentType: 'fraud'
          });
        }, 1000);
      } else if (message.content.toLowerCase().includes('transaction') || 
                 message.content.toLowerCase().includes('purchase')) {
        setTimeout(() => {
          addMessageToChatThread(mode, {
            sender: 'agent',
            content: "I'll help you review any suspicious transactions. Our system analyzes each transaction against your typical spending patterns, looking for anomalies in location, amount, merchant type, and timing. Would you like me to check for any unusual transactions on your account now?",
            agentType: 'fraud'
          });
        }, 1000);
      } else if (message.content.toLowerCase().includes('password') || 
                 message.content.toLowerCase().includes('secure') || 
                 message.content.toLowerCase().includes('protect')) {
        setTimeout(() => {
          addMessageToChatThread(mode, {
            sender: 'agent',
            content: "Account security is our top priority. To help protect your account, ensure you're using a strong unique password, enable two-factor authentication, regularly monitor your accounts for unauthorized activity, and be cautious of phishing attempts. Would you like me to help you enhance your account security?",
            agentType: 'security'
          });
        }, 1000);
      } else {
        setTimeout(() => {
          addMessageToChatThread(mode, {
            sender: 'agent',
            content: "I understand you're concerned about security. Our fraud detection system uses advanced AI to identify unusual patterns and protect your accounts. We look at factors like transaction location, amount, timing, and merchant category, comparing each activity against your typical behavior. How else can I help address your security concerns?",
            agentType: 'fraud'
          });
        }, 1000);
      }
    };

    // If message from user, simulate agent response
    if (message.sender === 'user') {
      simulateAgentResponse(mode, message.content);
    }
  }, []);

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
    
    // Simulate document verification after a delay
    setTimeout(() => {
      const verificationResult = generateMockDocumentVerification(document.type);
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
        
        // Also add a compliance check
        const mockComplianceCheck = generateMockComplianceCheck(customer.id, 'kyc');
        addComplianceCheck(mockComplianceCheck);
        
        // Generate fraud alerts occasionally based on document verification
        if (Math.random() < 0.3) {
          const mockFraudAlert = generateMockFraudAlert(
            customer?.id || 'unknown-customer', 
            'identity',
            (document.type === 'id' || document.type === 'passport') ? 'medium' : 'low'
          );
          addFraudAlert(mockFraudAlert);
          
          addAuditEvent('Fraud Alert', `Fraud alert generated: ${mockFraudAlert.title}`);
        }
      }
    }, 2000);
  }, [customer]);
  
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
  
  // Add a compliance check
  const addComplianceCheck = useCallback((check: ComplianceCheck) => {
    setComplianceChecks(prev => [check, ...prev]);
    
    // Add to audit trail
    addAuditEvent(
      'Compliance Check', 
      `${check.checkType.toUpperCase()} compliance check ${check.status} with risk score ${check.riskScore.toFixed(0)}`
    );
  }, []);
  
  // Add a fraud alert
  const addFraudAlert = useCallback((alert: FraudAlert) => {
    setFraudAlerts(prev => [alert, ...prev]);
    
    // Add to audit trail
    addAuditEvent(
      'Fraud Alert', 
      `${alert.severity.toUpperCase()} ${alert.alertType} alert created: ${alert.title}`
    );
  }, []);
  
  // Update a fraud alert
  const updateFraudAlert = useCallback((id: string, updates: Partial<FraudAlert>) => {
    let updatedAlert: FraudAlert | null = null;
    
    setFraudAlerts(prev => {
      const updatedAlerts = prev.map(alert => {
        if (alert.id === id) {
          updatedAlert = { ...alert, ...updates };
          return updatedAlert;
        }
        return alert;
      });
      
      return updatedAlerts;
    });
    
    // Add to audit trail if status changed
    if (updatedAlert && updates.status) {
      addAuditEvent(
        'Fraud Alert Updated', 
        `Alert ID ${id} status changed to ${updates.status}`
      );
    }
    
    return updatedAlert;
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
        
      case 'fraud-detection':
        // Reset fraud alerts
        setFraudAlerts([]);
        break;
        
      case 'treasury-ops':
        // Reset treasury data
        updateTreasuryData();
        break;
    }
    
    addAuditEvent('Workflow Reset', `The ${mode} workflow was reset`);
  }, [addAuditEvent, updateTreasuryData]);
  
  // Reset everything
  const resetAll = useCallback(() => {
    setCustomer(null);
    setBankAccount(null);
    setCreditCard(null);
    setLoan(null);
    setDocuments([]);
    setKycResult(null);
    setComplianceChecks([]);
    setFraudAlerts([]);
    updateTreasuryData();
    
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
      },
      'fraud-detection': {
        id: 'fraud-detection-thread-new',
        mode: 'fraud-detection',
        messages: [],
        status: 'active',
        startedAt: new Date()
      },
      'treasury-ops': {
        id: 'treasury-ops-thread-new',
        mode: 'treasury-ops',
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
  }, [updateTreasuryData]);
  
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
        complianceChecks,
        addComplianceCheck,
        fraudAlerts,
        addFraudAlert,
        updateFraudAlert,
        treasuryPositions,
        interBankTransfers,
        baselMetrics,
        regulatoryReports,
        updateTreasuryData,
        chatThreads,
        addMessageToChatThread,
        auditTrail,
        addAuditEvent,
        resetWorkflow,
        resetAll,
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