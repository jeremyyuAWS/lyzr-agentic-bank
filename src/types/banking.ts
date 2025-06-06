import React from 'react';

export type BankingMode = 'account-opening' | 'credit-card' | 'loan' | 'fraud-detection' | 'treasury-ops';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: Address;
  dateOfBirth: string;
  ssn: string;
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'retired';
  annualIncome: number;
  verified: boolean;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Document {
  id: string;
  type: 'id' | 'passport' | 'driver-license' | 'utility-bill' | 'bank-statement' | 'pay-stub' | 'tax-return';
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  verifiedAt?: Date;
  path: string; // simulated path, not a real file
  metadata?: Record<string, any>;
}

// Account Opening Types
export interface BankAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  balance: number;
  openedAt: Date;
  status: 'pending' | 'active' | 'closed' | 'frozen';
}

export interface KycResult {
  customerId: string;
  status: 'passed' | 'failed' | 'pending-review';
  riskScore: number; // 0-1 scale, where 0 is lowest risk
  checkDate: Date;
  flags: KycFlag[];
  notes?: string;
}

export interface KycFlag {
  type: 'identity' | 'address' | 'watchlist' | 'fraud' | 'other';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// Credit Card Types
export interface CreditCard {
  id: string;
  customerId: string;
  cardNumber: string;
  cardType: 'standard' | 'premium' | 'secured';
  creditLimit: number;
  apr: number;
  cashBackRate: number;
  expiryDate: string;
  cvv: string;
  status: 'pending' | 'approved' | 'active' | 'denied' | 'cancelled';
  issuedAt?: Date;
  activatedAt?: Date;
}

export interface CreditApplication {
  id: string;
  customerId: string;
  applicationDate: Date;
  creditScore: number;
  debtToIncome: number; // percentage
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebt: number;
  employmentYears: number;
  status: 'pending' | 'approved' | 'denied';
  cardOfferId?: string; // which card was offered/approved
}

// Loan Types
export interface Loan {
  id: string;
  customerId: string;
  loanType: 'personal' | 'home' | 'auto';
  purpose?: string;
  amount: number;
  term: number; // months
  interestRate: number;
  monthlyPayment: number;
  originationFee: number;
  startDate?: Date;
  status: 'pending' | 'approved' | 'funded' | 'denied' | 'closed';
  schedule?: PaymentSchedule[];
}

export interface LoanApplication {
  id: string;
  customerId: string;
  loanType: 'personal' | 'home' | 'auto';
  applicationDate: Date;
  requestedAmount: number;
  requestedTerm: number; // months
  purpose: string;
  creditScore: number;
  debtToIncome: number; // percentage
  employmentVerified: boolean;
  incomeVerified: boolean;
  status: 'pending' | 'in-review' | 'approved' | 'denied';
  decisionReason?: string;
}

export interface PaymentSchedule {
  paymentNumber: number;
  date: string;
  totalPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;
}

// Fraud Detection Types
export interface FraudAlert {
  id: string;
  customerId: string;
  alertType: 'transaction' | 'login' | 'device' | 'account-change' | 'identity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'new' | 'in-progress' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  affectedAccountId?: string;
  affectedCardId?: string;
  transactionAmount?: number;
  location?: string;
  deviceInfo?: string;
  ipAddress?: string;
  riskScore: number; // 0-100 scale
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Treasury Operations Types
export interface TreasuryPosition {
  id: string;
  asset: string;
  type: 'cash' | 'investment' | 'collateral' | 'reserve';
  amount: number;
  currency: string;
  maturity?: Date;
  yield?: number;
  riskWeight: number;
  location: string;
  category: 'operational' | 'reserve' | 'investment' | 'regulatory';
  liquidity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface InterBankTransfer {
  id: string;
  fromBank: string;
  toBank: string;
  amount: number;
  currency: string;
  type: 'nostro' | 'vostro' | 'swift' | 'fedwire' | 'ach' | 'chaps' | 'sepa';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'returned';
  settlementDate: Date;
  valueDate: Date;
  reference: string;
  purpose: string;
  fees?: number;
  exchangeRate?: number;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: Date;
  completedAt?: Date;
}

export interface BaselMetric {
  id: string;
  category: 'capital' | 'liquidity' | 'leverage';
  name: string;
  value: number;
  target: number;
  minimum: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  trend: 'improving' | 'stable' | 'declining';
  date: Date;
}

export interface RegulatoryReport {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  status: 'pending' | 'in-progress' | 'submitted' | 'accepted' | 'rejected';
  dueDate: Date;
  submissionDate?: Date;
  authority: string;
  description: string;
  metrics: string[];
  assignedTo?: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Audit and Compliance Types
export interface AuditLog {
  id: string;
  timestamp: Date;
  entityId: string; // ID of customer, account, card, or loan
  entityType: 'customer' | 'account' | 'card' | 'loan' | 'document';
  action: string;
  performedBy: string; // agent name or user ID
  details: string;
  ipAddress?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface ComplianceCheck {
  id: string;
  customerId: string;
  checkType: 'kyc' | 'aml' | 'fraud' | 'sanctions' | 'pep' | 'identity';
  status: 'passed' | 'failed' | 'pending-review' | 'in-progress';
  timestamp: Date;
  details: string;
  riskScore: number; // 0-100 scale
  flags: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

// Agent Message Types
export interface BankingMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  timestamp: Date;
  agentType?: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan' | 'fraud' | 'security' | 'treasury';
  attachments?: DocumentAttachment[];
  actions?: AgentAction[];
}

export interface DocumentAttachment {
  id: string;
  documentType: Document['type'];
  name: string;
  size: number; // in bytes
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'verified' | 'rejected';
}

export type AgentAction = 
  | { type: 'request-document'; documentType: Document['type'] }
  | { type: 'verify-identity'; method: string }
  | { type: 'calculate-risk'; factors: string[] }
  | { type: 'create-account'; accountType: string }
  | { type: 'issue-card'; cardType: string }
  | { type: 'process-loan'; loanType: string; amount: number; term: number }
  | { type: 'flag-fraud'; alertType: string; severity: string }
  | { type: 'transfer-funds'; amount: number; destination: string }
  | { type: 'reserve-calculation'; reserveType: string };

export interface BankingChatThread {
  id: string;
  mode: BankingMode;
  messages: BankingMessage[];
  customerId?: string;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: Date;
  completedAt?: Date;
  outcome?: string;
}

// Agent visualization types
export interface Agent {
  id: string;
  name: string;
  role: string;
  type: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan' | 'compliance' | 'fraud' | 'security' | 'treasury';
  position: { x: number; y: number };
  status: 'idle' | 'working' | 'success' | 'error';
  currentTask?: string;
  color: string;
}