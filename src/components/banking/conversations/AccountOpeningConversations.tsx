import React from 'react';

/**
 * Predefined conversations for the Account Opening workflow.
 * Each conversation has a trigger question and a sequence of messages
 * that simulate a complete interaction with visualizations.
 */

export type MessageType = {
  sender: 'user' | 'agent';
  content: string;
  agentType?: 'onboarding' | 'document' | 'kyc-aml' | 'account';
  delay?: number; // delay in ms before showing this message
  visualization?: React.ReactNode;
};

export type ConversationType = {
  id: string;
  trigger: string; // The phrase that triggers this conversation
  title: string;
  description: string;
  messages: MessageType[];
};

export const accountOpeningConversations: ConversationType[] = [
  {
    id: 'account-types',
    trigger: 'What types of accounts do you offer?',
    title: 'Account Types',
    description: 'Explains the different account types available',
    messages: [
      {
        sender: 'user',
        content: 'What types of accounts do you offer?',
      },
      {
        sender: 'agent',
        content: 'We offer several types of accounts to meet your financial needs:',
        agentType: 'onboarding',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `
1. **Premium Checking Account**
   - No monthly maintenance fees
   - Free unlimited transfers
   - 0.1% APY on all balances
   - No minimum balance requirements

2. **High-Yield Savings Account**
   - 4.05% APY on all balances
   - No monthly fees
   - FDIC insured up to $250,000
   - Up to 6 withdrawals per month

3. **Money Market Account**
   - Tiered interest rates up to 3.75% APY
   - Check-writing privileges
   - Minimum balance of $2,500
   - FDIC insured

Which account type are you most interested in?`,
        agentType: 'onboarding',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'I'm interested in the Premium Checking Account. What documents do I need to open one?',
        delay: 2500,
      },
      {
        sender: 'agent',
        content: `For the Premium Checking Account, we'll need the following documents:

1. A government-issued photo ID (passport, driver's license, or state ID)
2. Proof of address (utility bill, bank statement dated within last 60 days)
3. Social Security Number or Tax ID

Would you like to start the application process now?`,
        agentType: 'document',
        delay: 1200,
      },
      {
        sender: 'user',
        content: 'Yes, I'd like to apply for the Premium Checking Account.',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: 'Great! I'll guide you through the account opening process. First, let's gather some basic information. What is your full legal name?',
        agentType: 'onboarding',
        delay: 1000,
      }
    ]
  },
  {
    id: 'kyc-requirements',
    trigger: 'Why do you need all this personal information?',
    title: 'KYC Requirements Explanation',
    description: 'Explains why personal information is required',
    messages: [
      {
        sender: 'user',
        content: 'Why do you need all this personal information?',
      },
      {
        sender: 'agent',
        content: `That's a great question. Banks are required to collect personal information as part of Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations.`,
        agentType: 'kyc-aml',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `These regulations serve several important purposes:

1. **Verifying your identity**: To ensure accounts aren't opened fraudulently
2. **Preventing financial crimes**: To detect and prevent money laundering, fraud, and terrorist financing
3. **Protecting your account**: To ensure only you have access to your funds
4. **Regulatory compliance**: Banks are legally required to verify customers' identities

All your information is protected by strong encryption and our strict privacy policies. We only collect what's necessary, and we never sell your personal information to third parties.`,
        agentType: 'kyc-aml',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'How secure is the verification process?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `Our verification process uses bank-grade security:

1. **256-bit encryption** for all data transmission
2. **Secure document processing** that automatically deletes sensitive data after verification
3. **Multi-factor authentication** to prevent unauthorized access
4. **Regular security audits** by independent cybersecurity firms
5. **Compliance** with GDPR, CCPA, and banking industry regulations

Your documents are processed in a secure environment and are never stored longer than necessary for verification.`,
        agentType: 'kyc-aml',
        delay: 1200,
      },
      {
        sender: 'user',
        content: 'That makes sense. I can provide my driver's license for verification.',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `Perfect! You can upload your driver's license by clicking the "Document Verification" tab. Our system will securely process it and verify your identity.

After we verify your ID, we'll need just a bit more information to complete your application. Do you have any other questions about the process?`,
        agentType: 'document',
        delay: 1000,
      }
    ]
  },
  {
    id: 'account-benefits',
    trigger: 'What are the benefits of banking with you?',
    title: 'Banking Benefits',
    description: 'Explains the benefits of our banking services',
    messages: [
      {
        sender: 'user',
        content: 'What are the benefits of banking with you?',
      },
      {
        sender: 'agent',
        content: `Our banking services come with several key benefits:`,
        agentType: 'onboarding',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Core Banking Benefits:**

1. **No Hidden Fees**
   - No monthly maintenance fees
   - No minimum balance requirements
   - No overdraft fees with overdraft protection

2. **Higher Interest Rates**
   - Premium Checking: 0.1% APY (5x national average)
   - High-Yield Savings: 4.05% APY
   - Money Market: Up to 3.75% APY

3. **Digital-First Experience**
   - 24/7 account access via mobile and web
   - AI-powered financial insights and recommendations
   - Real-time transaction notifications

4. **Exceptional Security**
   - Advanced fraud monitoring
   - Zero liability protection
   - Biometric authentication

Which of these benefits is most important to you?`,
        agentType: 'onboarding',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'I'm most interested in the higher interest rates. How do you offer such high rates compared to traditional banks?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `We're able to offer higher interest rates for several reasons:

1. **Digital-first model**: By operating primarily online without physical branches, we save on overhead costs and pass those savings to customers through higher rates.

2. **Efficient operations**: Our AI-powered systems automate many processes that traditional banks handle manually, reducing operational costs.

3. **Strategic partnerships**: We partner with a network of FDIC-insured banks to access wholesale banking rates.

4. **Focused product offerings**: We offer carefully selected products rather than hundreds of legacy offerings, allowing us to optimize returns.

Your deposits are still FDIC insured up to $250,000, just like at traditional banks, but you earn significantly more on your money.`,
        agentType: 'account',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'That sounds great. How quickly can I open an account?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `You can open an account in as little as 5 minutes if you have your documents ready!

The application process is:

1. Complete the online application (2-3 minutes)
2. Upload your ID and proof of address (1-2 minutes)
3. Verify your identity (instant in most cases)
4. Fund your account (same-day ACH or instant with debit card)

Most customers are approved instantly, and your account will be ready to use as soon as your initial deposit is processed.

Would you like to start the application process now?`,
        agentType: 'onboarding',
        delay: 1300,
      }
    ]
  },
  {
    id: 'account-security',
    trigger: 'How do you protect my account?',
    title: 'Account Security Measures',
    description: 'Explains how accounts are secured',
    messages: [
      {
        sender: 'user',
        content: 'How do you protect my account?',
      },
      {
        sender: 'agent',
        content: `We take account security very seriously. Your account is protected by multiple layers of security:`,
        agentType: 'account',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Multi-Layered Security Approach:**

1. **Authentication Security**
   - Multi-factor authentication
   - Biometric verification options
   - Device recognition
   - Login anomaly detection

2. **Transaction Security**
   - Real-time fraud monitoring
   - Transaction verification for unusual activity
   - Encrypted connections (256-bit encryption)
   - Instant alerts for suspicious activities

3. **Policy Protections**
   - Zero liability protection for unauthorized transactions
   - 24/7 fraud monitoring team
   - Regular security audits

Additionally, all deposits are FDIC insured up to $250,000 per depositor.`,
        agentType: 'account',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'What happens if someone gains unauthorized access to my account?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `If there's unauthorized access to your account:

1. **Zero Liability Protection**: You won't be responsible for unauthorized transactions reported promptly.

2. **Immediate Response**: Our security team will:
   - Lock your account to prevent further access
   - Issue new account credentials
   - Investigate the unauthorized activity
   - Reverse fraudulent transactions

3. **Recovery Support**: A dedicated fraud specialist will:
   - Guide you through the recovery process
   - Help you file any necessary reports
   - Ensure your new account is secure

For maximum protection, we recommend enabling all security features including:
- Push notification approval for all transactions
- Two-factor authentication
- Transaction alerts
- Regular password changes

Would you like me to explain how to enable these security features?`,
        agentType: 'account',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'Yes, that would be helpful.',
        delay: 1200,
      },
      {
        sender: 'agent',
        content: `Once your account is opened, you can enable all security features through the "Security" section of our mobile app or online banking:

1. **Two-Factor Authentication**:
   - Go to Settings > Security > Two-Factor Authentication
   - Choose your preferred method (SMS, authenticator app, or security key)

2. **Transaction Notifications**:
   - Go to Settings > Notifications
   - Toggle on "Transaction Alerts" and select your preferences

3. **Approval Requirements**:
   - Go to Settings > Security > Transaction Approval
   - Set transaction amount thresholds requiring approval

4. **Device Management**:
   - Go to Settings > Security > Trusted Devices
   - Review and remove any unrecognized devices

Would you like to proceed with opening an account with these enhanced security features enabled?`,
        agentType: 'account',
        delay: 1500,
      }
    ]
  },
  {
    id: 'account-fees',
    trigger: 'Are there any monthly fees or minimum balances?',
    title: 'Account Fees and Minimums',
    description: 'Explains account fees and minimum balance requirements',
    messages: [
      {
        sender: 'user',
        content: 'Are there any monthly fees or minimum balances?',
      },
      {
        sender: 'agent',
        content: `For our Premium Checking Account:`,
        agentType: 'account',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Fee Structure for Premium Checking:**

• **Monthly Maintenance Fee**: $0
• **Minimum Opening Deposit**: $25
• **Minimum Balance Requirement**: $0
• **ATM Fees**: None at our network, up to $15/month in refunds for other ATMs
• **Overdraft Fee**: $0 with Overdraft Protection
• **Wire Transfer**: Free domestic incoming, $15 domestic outgoing
• **Foreign Transaction Fee**: None
• **Replacement Debit Card**: Free
• **Paper Statements**: $3/month (eStatements are free)

Unlike traditional banks, we don't charge many common fees such as:
- Account maintenance fees
- Minimum balance fees
- ACH transfer fees
- Internal transfer fees
- Early account closure fees
- Inactive account fees`,
        agentType: 'account',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'That's great! What about the High-Yield Savings account?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Fee Structure for High-Yield Savings:**

• **Monthly Maintenance Fee**: $0
• **Minimum Opening Deposit**: $100
• **Minimum Balance Requirement**: $0
• **Withdrawal Limit**: 6 free withdrawals per month
• **Excess Withdrawal Fee**: $5 per withdrawal over the limit
• **Account Interest Rate**: 4.05% APY on all balances
• **Wire Transfer**: Same as checking account
• **Paper Statements**: $3/month (eStatements are free)

The High-Yield Savings Account is designed for growing your savings, not for frequent transactions. That's why there's a limit of 6 withdrawals per month, which is standard for savings accounts under Federal Regulation D.`,
        agentType: 'account',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'How do I avoid ever paying fees?',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `**Tips to Completely Avoid Fees:**

1. **Use eStatements** instead of paper statements (saves $3/month)

2. **Use in-network ATMs** or stay within the $15 monthly reimbursement limit for out-of-network ATMs

3. **Enroll in Overdraft Protection** by linking your checking account to a savings account

4. **Stay within the 6 withdrawals per month** limit for savings accounts

5. **Use online transfers** instead of wire transfers when possible

For most customers who use digital banking, it's completely possible to avoid paying any fees at all with our accounts. We've designed our fee structure to be transparent and minimal compared to traditional banks.

Would you like to proceed with opening an account or do you have other questions about fees?`,
        agentType: 'account',
        delay: 1700,
      }
    ]
  }
];