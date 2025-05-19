import { 
  Customer, 
  Address, 
  BankAccount, 
  CreditCard, 
  Loan, 
  KycResult,
  KycFlag,
  Document,
  PaymentSchedule,
  ComplianceCheck,
  FraudAlert
} from '../types/banking';

// Generate a random string of specified length
const generateRandomString = (length: number, type: 'numeric' | 'alphanumeric' = 'numeric'): string => {
  let result = '';
  const characters = type === 'numeric' 
    ? '0123456789' 
    : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Generate a random date between start and end
const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format a date as MM/DD/YYYY
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

// Get a date N months in the future
const getDateMonthsFromNow = (months: number): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
};

// Generate a random SSN (for display purposes only - with X's for security)
const generateMaskedSSN = (): string => {
  return `XXX-XX-${generateRandomString(4)}`;
};

// Calculate a credit score between 300-850
const calculateCreditScore = (riskLevel: 'low' | 'medium' | 'high'): number => {
  switch (riskLevel) {
    case 'low':
      return Math.floor(Math.random() * (850 - 740) + 740);
    case 'medium':
      return Math.floor(Math.random() * (740 - 670) + 670);
    case 'high':
      return Math.floor(Math.random() * (670 - 300) + 300);
    default:
      return Math.floor(Math.random() * (850 - 300) + 300);
  }
};

// Generate mock customer data
export const generateMockCustomer = (): Customer => {
  const firstName = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Jennifer', 'William', 'Linda'][Math.floor(Math.random() * 10)];
  const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][Math.floor(Math.random() * 10)];
  
  const address: Address = {
    street1: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Maple', 'Washington', 'Park', 'Elm', 'Cedar', 'Pine', 'Walnut', 'Willow'][Math.floor(Math.random() * 10)]} ${['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr', 'Way', 'Pl', 'Ct', 'Terrace'][Math.floor(Math.random() * 10)]}`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'][Math.floor(Math.random() * 10)],
    state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA'][Math.floor(Math.random() * 10)],
    zipCode: generateRandomString(5),
    country: 'USA'
  };
  
  // Generate a random date between 21 and 70 years ago
  const now = new Date();
  const minDate = new Date(now);
  minDate.setFullYear(now.getFullYear() - 70);
  const maxDate = new Date(now);
  maxDate.setFullYear(now.getFullYear() - 21);
  
  const dateOfBirth = formatDate(generateRandomDate(minDate, maxDate));
  
  return {
    id: `cust-${generateRandomString(8)}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phoneNumber: `(${generateRandomString(3)}) ${generateRandomString(3)}-${generateRandomString(4)}`,
    address,
    dateOfBirth,
    ssn: generateMaskedSSN(),
    employmentStatus: ['employed', 'self-employed', 'unemployed', 'retired'][Math.floor(Math.random() * 4)] as 'employed' | 'self-employed' | 'unemployed' | 'retired',
    annualIncome: Math.floor(Math.random() * 150000) + 30000,
    verified: false
  };
};

// Generate a mock bank account
export const generateMockAccount = (customerId: string): BankAccount => {
  const accountNumber = generateRandomString(10);
  const routingNumber = '072000326'; // Example routing number
  const accountType = Math.random() > 0.5 ? 'checking' : 'savings';
  
  return {
    id: `acc-${generateRandomString(8)}`,
    customerId,
    accountNumber,
    routingNumber,
    accountType,
    balance: 0, // New accounts start with zero balance
    openedAt: new Date(),
    status: 'active'
  };
};

// Generate mock credit card
export const generateMockCreditCard = (customerId: string, creditScore: number): CreditCard => {
  // Determine card type and limit based on credit score
  let cardType: 'standard' | 'premium' | 'secured';
  let creditLimit: number;
  let apr: number;
  let cashBackRate: number;
  
  if (creditScore >= 740) {
    cardType = 'premium';
    creditLimit = Math.floor(Math.random() * 15000) + 10000;
    apr = Math.floor(Math.random() * 500 + 1199) / 100; // 11.99% to 16.99%
    cashBackRate = 2; // 2% cash back
  } else if (creditScore >= 670) {
    cardType = 'standard';
    creditLimit = Math.floor(Math.random() * 7000) + 3000;
    apr = Math.floor(Math.random() * 700 + 1499) / 100; // 14.99% to 21.99%
    cashBackRate = 1.5; // 1.5% cash back
  } else {
    cardType = 'secured';
    creditLimit = 500;
    apr = Math.floor(Math.random() * 500 + 1799) / 100; // 17.99% to 22.99%
    cashBackRate = 1; // 1% cash back
  }
  
  // Generate expiry date 4 years from now
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 4);
  const expiryMonth = (expiryDate.getMonth() + 1).toString().padStart(2, '0');
  const expiryYear = expiryDate.getFullYear().toString().slice(2);
  
  return {
    id: `card-${generateRandomString(8)}`,
    customerId,
    cardNumber: `4${generateRandomString(15)}`,
    cardType,
    creditLimit,
    apr,
    cashBackRate,
    expiryDate: `${expiryMonth}/${expiryYear}`,
    cvv: generateRandomString(3),
    status: 'approved',
    issuedAt: new Date()
  };
};

// Generate mock loan
export const generateMockLoan = (
  customerId: string, 
  loanType: 'personal' | 'home' | 'auto',
  amount: number,
  term: number, // months
  creditScore: number
): Loan => {
  // Determine interest rate based on credit score and loan type
  let baseRate: number;
  
  if (creditScore >= 740) {
    baseRate = loanType === 'home' ? 3.99 : loanType === 'auto' ? 4.99 : 7.99;
  } else if (creditScore >= 670) {
    baseRate = loanType === 'home' ? 4.99 : loanType === 'auto' ? 5.99 : 9.99;
  } else {
    baseRate = loanType === 'home' ? 5.99 : loanType === 'auto' ? 7.99 : 12.99;
  }
  
  // Adjust based on term
  const interestRate = baseRate + (term > 60 ? 0.5 : 0);
  
  // Calculate monthly payment: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
  
  // Generate payment schedule
  const schedule: PaymentSchedule[] = [];
  let remainingPrincipal = amount;
  
  for (let i = 1; i <= term; i++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;
    
    // Ensure the last payment exactly zeroes out the loan
    if (i === term) {
      remainingPrincipal = 0;
    }
    
    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() + i);
    
    schedule.push({
      paymentNumber: i,
      date: formatDate(paymentDate),
      totalPayment: monthlyPayment,
      principalPayment: principalPayment,
      interestPayment: interestPayment,
      remainingPrincipal: remainingPrincipal > 0 ? remainingPrincipal : 0
    });
  }
  
  // Origination fee (percentages, typically 0-6% of loan amount)
  let originationFee = 0;
  if (loanType === 'personal') {
    originationFee = amount * 0.02; // 2% for personal loans
  } else if (loanType === 'auto') {
    originationFee = amount * 0.01; // 1% for auto loans
  } else if (loanType === 'home') {
    originationFee = amount * 0.01; // 1% for home loans
  }
  
  return {
    id: `loan-${generateRandomString(8)}`,
    customerId,
    loanType,
    amount,
    term,
    interestRate,
    monthlyPayment,
    originationFee,
    status: 'approved',
    schedule
  };
};

// Generate mock document verification
export const generateMockDocumentVerification = (documentType: Document['type']): { 
  status: 'verified' | 'rejected'; 
  metadata: Record<string, any> 
} => {
  // Most documents pass verification (90%)
  const verified = Math.random() < 0.9;
  
  let metadata: Record<string, any> = {};
  
  switch (documentType) {
    case 'id':
    case 'passport':
    case 'driver-license':
      metadata = {
        idNumber: generateRandomString(8, 'alphanumeric'),
        expiryDate: formatDate(getDateMonthsFromNow(Math.floor(Math.random() * 48) + 12)), // 1-5 years in future
        issueDate: formatDate(new Date(Date.now() - (Math.floor(Math.random() * 1825) + 365) * 24 * 60 * 60 * 1000)), // 1-6 years ago
        issuingAuthority: ['Department of Motor Vehicles', 'State Department', 'Department of State'][Math.floor(Math.random() * 3)]
      };
      break;
      
    case 'utility-bill':
    case 'bank-statement':
      metadata = {
        issueDate: formatDate(new Date(Date.now() - (Math.floor(Math.random() * 60) + 1) * 24 * 60 * 60 * 1000)), // Last 60 days
        amount: `$${(Math.random() * 200 + 50).toFixed(2)}`,
        provider: ['Electric Company', 'Water Utility', 'Gas Services', 'Internet Provider'][Math.floor(Math.random() * 4)]
      };
      break;
      
    case 'pay-stub':
    case 'tax-return':
      metadata = {
        issueDate: formatDate(new Date(Date.now() - (Math.floor(Math.random() * 365) + 1) * 24 * 60 * 60 * 1000)), // Last year
        income: `$${(Math.random() * 5000 + 2000).toFixed(2)}`,
        period: ['Monthly', 'Bi-weekly', 'Weekly'][Math.floor(Math.random() * 3)]
      };
      break;
  }
  
  return {
    status: verified ? 'verified' : 'rejected',
    metadata
  };
};

// Generate mock KYC/AML check result
export const generateMockKycResult = (customerId: string): KycResult => {
  // Most KYC checks pass (85%)
  const passed = Math.random() < 0.85;
  const riskScore = passed ? Math.random() * 0.3 : 0.3 + Math.random() * 0.7;
  
  let flags: KycFlag[] = [];
  
  if (riskScore > 0.3) {
    // Add some flags for medium/high risk
    const possibleFlags: KycFlag[] = [
      {
        type: 'identity',
        severity: riskScore > 0.7 ? 'high' : 'medium',
        description: 'Identity information could not be fully verified'
      },
      {
        type: 'address',
        severity: riskScore > 0.7 ? 'high' : 'medium',
        description: 'Address history shows multiple recent changes'
      },
      {
        type: 'watchlist',
        severity: 'high',
        description: 'Potential name match with watchlist entry requires review'
      },
      {
        type: 'fraud',
        severity: riskScore > 0.7 ? 'high' : 'medium',
        description: 'Unusual account activity patterns detected'
      }
    ];
    
    // Add 1-3 flags randomly
    const numFlags = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numFlags; i++) {
      const randomFlag = possibleFlags[Math.floor(Math.random() * possibleFlags.length)];
      if (!flags.some(f => f.type === randomFlag.type)) {
        flags.push(randomFlag);
      }
    }
  }
  
  return {
    customerId,
    status: passed ? 'passed' : Math.random() > 0.5 ? 'failed' : 'pending-review',
    riskScore,
    checkDate: new Date(),
    flags,
    notes: flags.length > 0 
      ? 'Further review required due to identified risk factors'
      : 'Automated verification completed successfully'
  };
};

// Generate mock compliance check
export const generateMockComplianceCheck = (
  customerId: string,
  checkType: ComplianceCheck['checkType']
): ComplianceCheck => {
  // Most checks pass (85%)
  const passRate = checkType === 'sanctions' || checkType === 'pep' ? 0.9 : 0.85;
  const passed = Math.random() < passRate;
  
  // Risk score based on whether the check passed
  const riskScore = passed ? 
    Math.floor(Math.random() * 30) : // Low risk (0-29)
    Math.floor(Math.random() * 70) + 30; // Medium-high risk (30-99)
  
  // Status based on risk score
  let status: ComplianceCheck['status'];
  if (passed) {
    status = 'passed';
  } else if (riskScore >= 70) {
    status = 'failed';
  } else {
    status = 'pending-review';
  }
  
  // Generate flags based on risk and status
  const flags: ComplianceCheck['flags'] = [];
  
  if (riskScore >= 30) { // Medium or high risk
    // Create 1-3 flags for higher risk scores
    const flagCount = riskScore >= 70 ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
    
    const possibleTypes = [
      'identity',
      'address',
      'document',
      'watchlist',
      'transaction',
      'behavior',
      checkType // Always include the check type as a potential flag
    ];
    
    // Shuffle possible types to randomize selection
    const shuffledTypes = [...possibleTypes].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(flagCount, shuffledTypes.length); i++) {
      const flagType = shuffledTypes[i];
      const severity = riskScore >= 70 ? 'high' :
                      riskScore >= 50 ? 'medium' : 'low';
                      
      let description = '';
      switch (flagType) {
        case 'identity':
          description = 'Identity information inconsistency detected';
          break;
        case 'address':
          description = 'Multiple address changes in short time period';
          break;
        case 'document':
          description = 'Document validation failed quality checks';
          break;
        case 'watchlist':
          description = 'Potential name match with watchlist';
          break;
        case 'transaction':
          description = 'Unusual transaction pattern identified';
          break;
        case 'behavior':
          description = 'Suspicious login or application behavior';
          break;
        case 'kyc':
          description = 'KYC verification results require additional review';
          break;
        case 'aml':
          description = 'Potential AML risk patterns detected';
          break;
        case 'fraud':
          description = 'Possible fraudulent activity indicators';
          break;
        case 'sanctions':
          description = 'Partial match with sanctioned entity';
          break;
        case 'pep':
          description = 'Possible politically exposed person connection';
          break;
        default:
          description = 'Compliance check flagged for review';
      }
      
      flags.push({
        type: flagType,
        severity,
        description
      });
    }
  }
  
  return {
    id: `compliance-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerId,
    checkType,
    status,
    timestamp: new Date(),
    details: `${checkType.toUpperCase()} compliance check ${status}`,
    riskScore,
    flags
  };
};

// Generate mock fraud alert
export const generateMockFraudAlert = (
  customerId: string,
  alertType: FraudAlert['alertType'] = 'transaction',
  severityOverride?: FraudAlert['severity']
): FraudAlert => {
  
  // Define possible titles and descriptions based on alert type
  const alertDetails: Record<FraudAlert['alertType'], {titles: string[], descriptions: string[]}> = {
    'transaction': {
      titles: [
        'Unusual Transaction Detected',
        'Suspicious Purchase Activity',
        'Potential Card Misuse',
        'High-Risk Transaction Flagged'
      ],
      descriptions: [
        'Transaction in unusual location for this account',
        'Multiple large transactions in short timeframe',
        'Transaction at high-risk merchant category',
        'Unusual spending pattern detected'
      ]
    },
    'login': {
      titles: [
        'Suspicious Login Attempt',
        'Account Access from Unknown Location',
        'Multiple Failed Login Attempts',
        'Login from New Device'
      ],
      descriptions: [
        'Login attempt from unrecognized device and location',
        'Multiple failed password attempts followed by successful login',
        'Account accessed from suspicious IP address',
        'Login at unusual time from unfamiliar location'
      ]
    },
    'device': {
      titles: [
        'New Device Added to Account',
        'Unusual Device Activity',
        'Device Verification Failed',
        'Suspicious Device Behavior'
      ],
      descriptions: [
        'New device added to account without verification',
        'Multiple devices accessing account simultaneously',
        'Device fingerprint matches known fraudulent pattern',
        'Unusual browser or device characteristics detected'
      ]
    },
    'account-change': {
      titles: [
        'Suspicious Account Changes',
        'Profile Information Updated',
        'Contact Details Modified',
        'Security Settings Changed'
      ],
      descriptions: [
        'Multiple account settings changed in short timeframe',
        'Email and phone number changed simultaneously',
        'Password and security questions modified',
        'Account recovery options updated suspiciously'
      ]
    },
    'identity': {
      titles: [
        'Potential Identity Theft',
        'Identity Verification Failed',
        'Document Verification Issues',
        'Identity Information Mismatch'
      ],
      descriptions: [
        'Submitted ID doesn\'t match account information',
        'Multiple identity verification failures',
        'Potential synthetic identity detected',
        'Document appears altered or manipulated'
      ]
    }
  };
  
  // Select random title and description
  const titles = alertDetails[alertType].titles;
  const descriptions = alertDetails[alertType].descriptions;
  
  const title = titles[Math.floor(Math.random() * titles.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Determine severity
  const severity: FraudAlert['severity'] = severityOverride || 
    (Math.random() < 0.2 ? 'critical' :
     Math.random() < 0.5 ? 'high' :
     Math.random() < 0.8 ? 'medium' :
     'low');
  
  // Calculate risk score based on severity
  const riskScore = 
    severity === 'critical' ? 80 + Math.floor(Math.random() * 20) :
    severity === 'high' ? 60 + Math.floor(Math.random() * 20) :
    severity === 'medium' ? 40 + Math.floor(Math.random() * 20) :
    Math.floor(Math.random() * 40);
  
  // Add type-specific details
  const additionalDetails: Partial<FraudAlert> = {};
  
  if (alertType === 'transaction') {
    additionalDetails.transactionAmount = Math.floor(Math.random() * 1000) + 50;
    additionalDetails.location = ['New York, NY', 'Lagos, Nigeria', 'Moscow, Russia', 'Beijing, China', 'Miami, FL'][Math.floor(Math.random() * 5)];
    additionalDetails.affectedAccountId = `acct-${generateRandomString(8)}`;
    additionalDetails.affectedCardId = `card-${generateRandomString(8)}`;
  } else if (alertType === 'login') {
    additionalDetails.ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    additionalDetails.location = ['New York, NY', 'Lagos, Nigeria', 'Moscow, Russia', 'Beijing, China', 'Miami, FL'][Math.floor(Math.random() * 5)];
    additionalDetails.deviceInfo = `${['Windows', 'Mac', 'iPhone', 'Android', 'Linux'][Math.floor(Math.random() * 5)]} device`;
  } else if (alertType === 'device') {
    additionalDetails.deviceInfo = `New ${['Windows', 'Mac', 'iPhone', 'Android', 'Linux'][Math.floor(Math.random() * 5)]} device`;
    additionalDetails.ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  }
  
  return {
    id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    customerId,
    alertType,
    severity,
    timestamp: new Date(),
    status: 'new',
    title,
    description,
    riskScore,
    ...additionalDetails
  };
};

// Calculate debt to income ratio (DTI)
export const calculateDTI = (monthlyIncome: number, monthlyDebt: number): number => {
  return (monthlyDebt / monthlyIncome) * 100;
};

// Make a credit decision (approve/deny) based on risk factors
export const makeCreditDecision = (creditScore: number, dti: number, income: number): { 
  approved: boolean;
  reason: string;
  limit?: number;
} => {
  // Credit score thresholds
  const MIN_CREDIT_SCORE = 640;
  const PREFERRED_CREDIT_SCORE = 720;
  
  // DTI thresholds (lower is better)
  const MAX_DTI = 43; // Max for most loans
  const PREFERRED_DTI = 36;
  
  // Income thresholds
  const MIN_ANNUAL_INCOME = 24000; // $24,000 per year
  
  if (creditScore < MIN_CREDIT_SCORE) {
    return {
      approved: false,
      reason: 'Credit score below minimum requirement'
    };
  }
  
  if (dti > MAX_DTI) {
    return {
      approved: false,
      reason: 'Debt-to-income ratio too high'
    };
  }
  
  if (income < MIN_ANNUAL_INCOME) {
    return {
      approved: false,
      reason: 'Annual income below minimum requirement'
    };
  }
  
  // If we reached here, the application is approved
  let limit: number;
  
  // Calculate limit based on income, credit score, and DTI
  // This is a simplified approach - real banks use complex algorithms
  if (creditScore >= PREFERRED_CREDIT_SCORE && dti <= PREFERRED_DTI) {
    // Excellent profile
    limit = Math.min(income * 0.5, 50000); // Up to 50% of annual income, max $50,000
  } else if (creditScore >= PREFERRED_CREDIT_SCORE || dti <= PREFERRED_DTI) {
    // Good profile
    limit = Math.min(income * 0.3, 25000); // Up to 30% of annual income, max $25,000
  } else {
    // Acceptable profile
    limit = Math.min(income * 0.2, 10000); // Up to 20% of annual income, max $10,000
  }
  
  return {
    approved: true,
    reason: 'Application meets all criteria',
    limit: Math.round(limit / 100) * 100 // Round to nearest $100
  };
};