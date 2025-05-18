import React from 'react';

export type BankingMode = 'account-opening' | 'credit-card' | 'loan';

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
  agentType?: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan';
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
  | { type: 'process-loan'; loanType: string; amount: number; term: number };

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
  type: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan' | 'compliance';
  position: { x: number; y: number };
  status: 'idle' | 'working' | 'success' | 'error';
  currentTask?: string;
  color: string;
}