import React from 'react';

/**
 * Predefined conversations for the Loan workflow.
 * Each conversation has a trigger question and a sequence of messages
 * that simulate a complete interaction with visualizations.
 */

export type MessageType = {
  sender: 'user' | 'agent';
  content: string;
  agentType?: 'loan' | 'document' | 'kyc-aml' | 'account';
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

export const loanConversations: ConversationType[] = [
  {
    id: 'loan-types',
    trigger: 'What types of loans do you offer?',
    title: 'Loan Types',
    description: 'Explains the different loan types available',
    messages: [
      {
        sender: 'user',
        content: 'What types of loans do you offer?',
      },
      {
        sender: 'agent',
        content: 'We offer a variety of loan products to meet different needs:',
        agentType: 'loan',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Our Loan Products:**

1. **Personal Loans**
   - Amounts: $2,000 to $50,000
   - Terms: 12 to 60 months
   - Fixed rates starting at 6.99% APR
   - No collateral required
   - Use for debt consolidation, home improvements, or major expenses

2. **Home Mortgage Loans**
   - Conventional, FHA, and VA options
   - Fixed rates starting at 5.25% APR
   - Terms: 15, 20, or 30 years
   - Down payments as low as 3% (5% for best rates)
   - Jumbo loans available up to $3 million

3. **Home Equity Loans/Lines**
   - HELOC rates starting at 7.25% APR
   - Fixed home equity loans starting at 6.75% APR
   - Borrow up to 85% of home value minus mortgage balance
   - Tax-deductible interest for qualifying borrowers

4. **Auto Loans**
   - New auto rates starting at 4.99% APR
   - Used auto rates starting at 5.49% APR
   - Terms: 36 to 72 months
   - Up to 100% financing available
   - No application fee

Which loan type are you most interested in learning more about?`,
        agentType: 'loan',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'I'm interested in a personal loan for debt consolidation. What documentation will I need?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Personal Loan Documentation Requirements:**

For a personal loan application, you'll need to provide:

1. **Proof of Identity**
   - Government-issued photo ID (driver's license, passport, etc.)
   - Social Security Number or Tax Identification Number

2. **Proof of Income**
   - Recent pay stubs (last 30 days)
   - W-2 forms or tax returns for the past 2 years
   - Bank statements (last 2-3 months)
   - For self-employed: Profit and loss statements, business tax returns

3. **Verification of Residence**
   - Utility bill, bank statement, or lease agreement
   - Should be dated within the last 60 days

4. **Existing Debt Information**
   - Account statements for debts you want to consolidate
   - Credit card statements
   - Loan statements with payoff amounts

For debt consolidation specifically, having the details of all accounts you want to consolidate is particularly important.`,
        agentType: 'document',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'What's the typical timeline from application to funding for a personal loan?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Personal Loan Application Timeline:**

The typical timeline for our personal loans is:

1. **Application: 5-15 minutes**
   - Submit application online or through this chat interface
   - Provide basic personal and financial information

2. **Initial Decision: Instant to 24 hours**
   - Many applicants receive an initial decision instantly
   - Some applications require manual review (up to 24 hours)

3. **Document Verification: 1-3 business days**
   - Upload required documents
   - Our team verifies your information
   - May require additional documentation in some cases

4. **Final Approval: 1-2 business days**
   - Full review of application and documentation
   - Credit decision and loan terms finalized

5. **Funding: 1-2 business days after approval**
   - Direct deposit to your bank account
   - Debt consolidation payments can be sent directly to creditors

**Total Timeline: As fast as 3 business days** from application to funding for straightforward cases with complete documentation.

Would you like to start a personal loan application now? I can guide you through the process.`,
        agentType: 'loan',
        delay: 1800,
      }
    ]
  },
  {
    id: 'interest-rates',
    trigger: 'How are loan interest rates determined?',
    title: 'Loan Interest Rate Factors',
    description: 'Explains how loan interest rates are determined',
    messages: [
      {
        sender: 'user',
        content: 'How are loan interest rates determined?',
      },
      {
        sender: 'agent',
        content: `Loan interest rates are determined by several key factors:`,
        agentType: 'loan',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Key Factors That Determine Your Interest Rate:**

1. **Credit Score and History**
   - Higher scores qualify for lower rates
   - Payment history impacts rate significantly
   - Recent credit inquiries and new accounts are considered
   - Score ranges and typical rate impacts:
     * Excellent (740+): Best available rates
     * Good (700-739): Slightly higher than best rates
     * Fair (640-699): Moderately higher rates
     * Poor (below 640): Significantly higher rates or may not qualify

2. **Loan-Specific Factors**
   - Loan amount and term (longer terms usually have higher rates)
   - Loan-to-value ratio for secured loans
   - Purpose of the loan (some purposes qualify for better rates)
   - Fixed vs. variable rate options

3. **Financial Profile**
   - Debt-to-income ratio
   - Income stability and employment history
   - Relationship with our bank
   - Other assets and liabilities

4. **Market Factors**
   - Federal Reserve benchmark rates
   - Overall economic conditions
   - Competitive environment

Would you like me to explain which of these factors might have the biggest impact in your specific situation?`,
        agentType: 'loan',
        delay: 1800,
      },
      {
        sender: 'user',
        content: 'Yes, I have a credit score around 720. How would that affect my rate?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Impact of 720 Credit Score on Loan Rates:**

With a credit score of 720, you fall in the "Good" credit tier, which positions you favorably:

**For Personal Loans:**
- You would qualify for rates approximately 0.5-1.5% above our best rates
- Current estimated rate range: 7.49-9.99% APR
- This is better than the average approved applicant
- You'd likely qualify for higher loan amounts (up to $35,000)

**For Home Loans:**
- Conventional mortgage rate approximately 0.25-0.5% above best rates
- Current estimated range: 5.50-5.75% APR for a 30-year fixed
- Down payment requirements would be standard (5-20%)

**For Auto Loans:**
- Slightly above best rates by about 0.25-0.75%
- Current estimated range: 5.24-5.99% APR for a new vehicle

**Ways to Potentially Improve Your Rate:**
- Adding a co-signer with excellent credit
- Making a larger down payment (for secured loans)
- Choosing a shorter loan term
- Establishing a banking relationship with us first

Would you like to see a side-by-side comparison of how different credit score tiers affect rates and payments?`,
        agentType: 'loan',
        delay: 2200,
      },
      {
        sender: 'user',
        content: 'Yes, please show me a comparison of rates by credit score tier.',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `**Rate Comparison by Credit Score Tier (Personal Loan)**

Assuming a $15,000 personal loan with a 3-year term:

| Credit Tier | Score Range | Typical APR | Monthly Payment | Total Interest |
|-------------|-------------|-------------|-----------------|----------------|
| Excellent   | 740+        | 6.99-7.49%  | $463-$467       | $1,668-$1,812  |
| Good        | 700-739     | 7.49-9.99%  | $467-$484       | $1,812-$2,424  |
| Fair        | 640-699     | 9.99-14.99% | $484-$524       | $2,424-$3,864  |
| Poor        | 580-639     | 14.99-19.99%| $524-$565       | $3,864-$5,340  |

**Your Position (720 Score):**
- You're in the Good tier, but at the higher end
- Your estimated APR would be closer to the lower end of that range (around 7.99%)
- Monthly payment approximately $470
- Total interest approximately $1,920 over the life of the loan

This is just an estimate. Your exact rate will depend on the complete evaluation of your application and other factors we discussed earlier.

Would you like to start a loan application to get your personalized rate offer?`,
        agentType: 'loan',
        delay: 2200,
      }
    ]
  },
  {
    id: 'debt-consolidation',
    trigger: 'How can I consolidate my existing debt?',
    title: 'Debt Consolidation Options',
    description: 'Explores options for debt consolidation',
    messages: [
      {
        sender: 'user',
        content: 'How can I consolidate my existing debt?',
      },
      {
        sender: 'agent',
        content: `Debt consolidation can simplify your finances and potentially save you money. Here are your options:`,
        agentType: 'loan',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Debt Consolidation Options:**

1. **Personal Consolidation Loan**
   - Best for: Multiple high-interest debts (credit cards, store cards)
   - How it works: Take one loan to pay off all other debts
   - Benefits: Fixed monthly payment, fixed payoff date, potentially lower interest
   - Requirements: Good credit score (640+) for best rates
   - Available amounts: $2,000-$50,000

2. **Home Equity Options**
   - Best for: Large debt amounts, homeowners with equity
   - Types: Home equity loan (fixed) or HELOC (variable)
   - Benefits: Lower rates than personal loans, possible tax benefits
   - Considerations: Your home is collateral; longer application process
   - Available amounts: Based on your home equity

3. **Balance Transfer Credit Card**
   - Best for: Credit card debt, good credit score holders
   - How it works: 0% intro APR for 12-18 months
   - Benefits: Zero interest during promo period
   - Considerations: Transfer fees (typically 3-5%), regular APR after promo
   - Available amounts: Based on approved credit limit

4. **Debt Management Plan**
   - Best for: Multiple debts, struggling with minimum payments
   - How it works: Credit counseling agency negotiates with creditors
   - Benefits: Reduced interest rates, waived fees, single monthly payment
   - Considerations: May require closing credit accounts

Which option sounds most applicable to your situation?`,
        agentType: 'loan',
        delay: 1800,
      },
      {
        sender: 'user',
        content: 'I have about $20,000 in credit card debt across four cards with rates between 18-24%. Would a personal loan make sense?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Personal Loan for Your Credit Card Debt:**

Based on your situation ($20,000 across four high-interest cards), a personal loan likely makes excellent sense for consolidation. Let me show you why:

**Current Situation Analysis:**
- $20,000 in credit card debt at 18-24% APR
- Assuming minimum payments (approximately 2% of balance)
- Monthly payment: ~$400-$500 (varies as balance decreases)
- Payoff time: Approximately 30+ years
- Total interest paid: ~$28,000-$36,000

**With a Personal Consolidation Loan (assuming 8.99% APR, 5-year term):**
- Fixed monthly payment: $415
- Payoff time: Exactly 5 years (60 months)
- Total interest paid: ~$4,900
- Potential savings: $23,000-$31,000 in interest

**Additional Benefits:**
- Single monthly payment instead of four
- Fixed payoff date with no temptation to pay only minimums
- May improve credit score by reducing credit utilization
- Structured plan to become debt-free

Would you like to proceed with a personal loan application for debt consolidation?`,
        agentType: 'loan',
        delay: 2200,
      },
      {
        sender: 'user',
        content: 'Yes, that sounds like it would help. What's the application process like?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Personal Loan Application Process:**

1. **Initial Application (5-10 minutes)**
   - Basic personal information
   - Income and employment details
   - Loan amount and purpose
   - Create your online account

2. **Document Collection & Submission**
   - Upload or take photos of required documents:
     * Government ID
     * Recent pay stubs or proof of income
     * Credit card statements for accounts to be paid off
   - Secure document upload system

3. **Verification & Review (1-2 business days)**
   - We verify your information and documents
   - Credit check and loan underwriting
   - Verification calls or emails if needed

4. **Approval & Acceptance**
   - Receive loan offer with approved terms
   - Review and accept the terms electronically
   - E-sign loan agreement

5. **Funding & Debt Payoff (1-3 business days after approval)**
   - Option to send funds directly to creditors or to your account
   - Confirmation of payments to creditors
   - Set up automatic payments for your new loan

The entire process typically takes 3-5 business days from application to funding. Most of our customers find it straightforward and much easier than managing multiple credit card payments.

Would you like to start your application now?`,
        agentType: 'loan',
        delay: 2000,
      }
    ]
  },
  {
    id: 'mortgage-process',
    trigger: 'What's involved in getting a mortgage?',
    title: 'Mortgage Process',
    description: 'Explains the mortgage application and approval process',
    messages: [
      {
        sender: 'user',
        content: 'What's involved in getting a mortgage?',
      },
      {
        sender: 'agent',
        content: `The mortgage process has several key steps:`,
        agentType: 'loan',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**The Mortgage Process: Step-by-Step Guide**

1. **Pre-Qualification (1 day)**
   - Quick assessment based on self-reported information
   - No documentation required
   - Provides estimated loan amount and rate
   - No impact on credit score

2. **Pre-Approval (3-5 days)**
   - Formal application with documentation
   - Credit check (hard inquiry)
   - Detailed financial review
   - Results in a pre-approval letter (valid for 60-90 days)
   - Required when making offers in competitive markets

3. **Home Shopping & Offer**
   - Work with a real estate agent to find homes
   - Make offer with pre-approval letter
   - Negotiate terms and price
   - Sign purchase agreement

4. **Loan Processing (2-3 weeks)**
   - Complete full mortgage application
   - Provide comprehensive documentation
   - Property appraisal ordered
   - Title search conducted
   - Underwriting begins

5. **Underwriting (1-2 weeks)**
   - Detailed analysis of your financial situation
   - Property evaluation
   - May request additional documentation
   - Results in formal loan approval

6. **Closing (1 day)**
   - Final walkthrough of property
   - Review and sign loan documents
   - Pay closing costs
   - Receive keys to your new home

From application to closing, the typical timeline is 30-45 days, though it can be faster or slower depending on complexity.`,
        agentType: 'loan',
        delay: 2000,
      },
      {
        sender: 'user',
        content: 'What documentation will I need for the mortgage application?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Mortgage Documentation Requirements:**

Here's a comprehensive checklist of documents typically needed:

1. **Personal Identification**
   - Government-issued photo ID
   - Social Security Number/card
   - Contact information

2. **Income Verification**
   - W-2 forms (past 2 years)
   - Recent pay stubs (past 30 days)
   - Tax returns (past 2 years, all schedules)
   - If self-employed:
     * Business tax returns (2 years)
     * Profit & loss statements
     * Business licenses/CPA letter

3. **Asset Documentation**
   - Bank statements (past 2-3 months, all pages)
   - Investment/retirement account statements
   - Documentation for down payment source
   - Gift letters (if applicable)

4. **Debt Information**
   - Current mortgage/rent payment history
   - Auto loan statements
   - Student loan statements
   - Credit card statements
   - Any other existing debt obligations

5. **Property Information**
   - Purchase agreement/contract
   - Property address and details
   - Real estate agent contact information
   - Homeowners insurance information

6. **Additional Situational Documents**
   - Divorce decree/separation agreement (if applicable)
   - Bankruptcy discharge papers (if applicable)
   - HOA information (if applicable)
   - Rental income documentation (if applicable)

Our mortgage team will guide you through exactly which documents are needed for your specific situation.`,
        agentType: 'document',
        delay: 2200,
      },
      {
        sender: 'user',
        content: 'What's the difference between fixed-rate and adjustable-rate mortgages?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Fixed-Rate vs. Adjustable-Rate Mortgages (ARMs):**

**Fixed-Rate Mortgages:**

- **Interest Rate**: Remains the same for the entire loan term
- **Monthly Payment**: Principal and interest payments stay consistent
- **Loan Terms**: Typically 15, 20, or 30 years
- **Best For**: 
  * Long-term homeowners
  * Those who prefer payment stability
  * When interest rates are low
  * Those on fixed incomes
- **Current Rates**: Starting at 5.25% for 30-year, 4.75% for 15-year

**Adjustable-Rate Mortgages (ARMs):**

- **Interest Rate**: Starts fixed, then adjusts periodically based on market
- **Monthly Payment**: Can increase or decrease after initial fixed period
- **Loan Terms**: 5/1, 7/1, 10/1 ARMs (fixed for 5, 7, or 10 years, then adjusts annually)
- **Rate Caps**: Limits on how much rates can increase per adjustment and lifetime
- **Best For**:
  * Those who plan to move/refinance before fixed period ends
  * When fixed rates are high and expected to decrease
  * Borrowers who can handle payment variations
- **Current Rates**: Starting at 4.50% for 5/1 ARM, 4.75% for 7/1 ARM

**Comparison Example:**
On a $300,000 mortgage:
- 30-year fixed at 5.25%: $1,656/month (guaranteed for 30 years)
- 5/1 ARM at 4.50%: $1,520/month for 5 years, then variable

Would you like to discuss which option might be better for your specific situation?`,
        agentType: 'loan',
        delay: 2500,
      }
    ]
  },
  {
    id: 'loan-eligibility',
    trigger: 'What factors determine my loan eligibility?',
    title: 'Loan Eligibility Factors',
    description: 'Explains what determines loan eligibility',
    messages: [
      {
        sender: 'user',
        content: 'What factors determine my loan eligibility?',
      },
      {
        sender: 'agent',
        content: `Loan eligibility is determined by several key factors:`,
        agentType: 'loan',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Key Loan Eligibility Factors:**

1. **Credit Profile (35-40% impact)**
   - Credit score (minimum requirements vary by loan type)
   - Payment history and delinquencies
   - Credit utilization
   - Length of credit history
   - Recent credit inquiries
   - Public records (bankruptcies, foreclosures, etc.)

2. **Income & Employment (25-30% impact)**
   - Income stability and amount
   - Employment history (typically want 2+ years)
   - Employment type (salaried, hourly, self-employed)
   - Income verification documents
   - Future earning potential

3. **Debt-to-Income Ratio (15-20% impact)**
   - Maximum DTI ratio (typically 43-50% depending on loan type)
   - Existing debt obligations
   - Proposed new loan payment
   - Housing expense ratio (mortgage/rent vs. income)

4. **Down Payment/Collateral (10-15% impact)**
   - Down payment amount (for mortgages, auto loans)
   - Source of down payment funds
   - Collateral value and type
   - Loan-to-value ratio

5. **Other Factors (5-10% impact)**
   - Relationship with the bank
   - Loan purpose
   - Loan term and amount
   - Market conditions
   - Property type (for secured loans)

Our AI-powered underwriting system evaluates all these factors to determine eligibility and loan terms.`,
        agentType: 'loan',
        delay: 1800,
      },
      {
        sender: 'user',
        content: 'How is the debt-to-income ratio calculated exactly?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Debt-to-Income (DTI) Ratio Calculation:**

The DTI ratio is a key metric in loan decisions. Here's exactly how we calculate it:

**Formula:**
DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100

**What's Included in Monthly Debt Payments:**
- Mortgage/rent payments
- Car loans/leases
- Student loans
- Personal loans
- Minimum credit card payments
- Child support/alimony
- Other recurring debt obligations
- **Proposed new loan payment**

**What's NOT Included:**
- Utilities (electric, water, internet)
- Cell phone bills
- Insurance premiums
- Groceries and discretionary spending
- Taxes (unless part of mortgage payment)

**Example Calculation:**
- Gross monthly income: $6,000
- Current rent: $1,500
- Car payment: $400
- Student loans: $350
- Credit card minimums: $200
- Proposed loan payment: $300

DTI = ($1,500 + $400 + $350 + $200 + $300) ÷ $6,000 = 0.458 or 45.8%

**DTI Thresholds:**
- Under 36%: Excellent position for loan approval
- 36-43%: Generally acceptable for most loans
- 43-50%: May still qualify with strong compensating factors
- Above 50%: Difficulty qualifying for most loans

For mortgage loans, we also look at the front-end ratio (housing costs only divided by income), which typically should be below 28-31%.`,
        agentType: 'loan',
        delay: 2200,
      },
      {
        sender: 'user',
        content: 'If my credit score isn't great, are there other factors that can help me qualify?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Compensating Factors for Lower Credit Scores:**

Yes, even with a less-than-ideal credit score, these factors can improve your approval chances:

1. **Substantial Down Payment**
   - For mortgage loans: 20% or higher down payment
   - For auto loans: 20-30% down payment
   - Shows commitment and reduces lender risk

2. **Strong Income and Employment**
   - Higher income relative to loan amount
   - Long-term employment stability (5+ years)
   - Career with growth potential or specialized skills

3. **Low Debt-to-Income Ratio**
   - DTI well below maximum thresholds (under 36% ideally)
   - Few existing debt obligations
   - Significant disposable income after expenses

4. **Substantial Cash Reserves**
   - Several months of loan payments in savings
   - Retirement accounts and other assets
   - Shows ability to handle financial emergencies

5. **Alternative Credit History**
   - Rent payment history (12+ months of on-time payments)
   - Utility payment records
   - Insurance payment history

6. **Relationship with Bank**
   - Existing accounts in good standing
   - Deposit or investment relationship
   - Previous loans paid as agreed

7. **Secured Loan Options**
   - Offering additional collateral
   - Secured credit cards to rebuild credit
   - Share-secured loans

8. **Qualified Co-Signer**
   - Someone with strong credit who co-signs your loan
   - Co-signer takes responsibility if you default
   - Must have good credit and income

Would you like to discuss your specific situation to see which of these factors might help strengthen your application?`,
        agentType: 'loan',
        delay: 2300,
      }
    ]
  }
];