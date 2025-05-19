import React from 'react';

/**
 * Predefined conversations for the Credit Card workflow.
 * Each conversation has a trigger question and a sequence of messages
 * that simulate a complete interaction with visualizations.
 */

export type MessageType = {
  sender: 'user' | 'agent';
  content: string;
  agentType?: 'credit' | 'document' | 'kyc-aml' | 'account';
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

export const creditCardConversations: ConversationType[] = [
  {
    id: 'card-options',
    trigger: 'What credit cards do you offer?',
    title: 'Credit Card Options',
    description: 'Explains the different credit card types available',
    messages: [
      {
        sender: 'user',
        content: 'What credit cards do you offer?',
      },
      {
        sender: 'agent',
        content: 'We offer several credit card options designed to fit different needs and preferences:',
        agentType: 'credit',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Our Credit Card Options:**

1. **Cash Rewards Card**
   - 2% cash back on all purchases
   - No annual fee
   - 0% intro APR for 15 months
   - Regular APR: 14.99-24.99%
   - $200 welcome bonus after $1,000 spend in first 3 months

2. **Premium Rewards Card**
   - 3x points on travel & dining
   - 2x points on all other purchases
   - $95 annual fee
   - 50,000 bonus points ($750 value) after $4,000 spend in first 3 months
   - Annual $300 travel credit

3. **Secured Credit Builder Card**
   - For building or rebuilding credit
   - 1% cash back on all purchases
   - No annual fee
   - Security deposit of $200-$2,500 required
   - Reports to all three credit bureaus

Which card interests you most?`,
        agentType: 'credit',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'The Cash Rewards Card sounds interesting. What kind of credit score do I need?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `For the Cash Rewards Card:

- **Recommended Credit Score**: 670 or higher (Good to Excellent)
- **Income Requirements**: Verifiable regular income source
- **Debt-to-Income Ratio**: Typically below 40%

If your credit score is below 670, you might still qualify, but you may receive a higher interest rate or lower credit limit initially. If your credit score is below 600, the Secured Credit Builder Card would be a better option to build your credit history.

Would you like to check if you pre-qualify without affecting your credit score?`,
        agentType: 'credit',
        delay: 1300,
      },
      {
        sender: 'user',
        content: "Yes, I'd like to check if I pre-qualify for the Cash Rewards Card.",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `Great! I'll help you check your pre-qualification status without a hard credit pull.

To get started, I'll need to collect some basic information:

1. Your full name
2. Date of birth
3. Address
4. Annual income
5. Employment status

This preliminary check won't affect your credit score. After pre-qualification, we'll guide you through the formal application process if you decide to proceed.

Shall we begin with your full name?`,
        agentType: 'credit',
        delay: 1500,
      }
    ]
  },
  {
    id: 'interest-rates',
    trigger: 'How is credit card interest calculated?',
    title: 'Credit Card Interest Calculation',
    description: 'Explains how interest is calculated on credit cards',
    messages: [
      {
        sender: 'user',
        content: 'How is credit card interest calculated?',
      },
      {
        sender: 'agent',
        content: `Credit card interest calculation can seem complex, but I'll break it down clearly:`,
        agentType: 'credit',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Credit Card Interest Calculation Process:**

1. **Understanding APR**
   - Your Annual Percentage Rate (APR) is the yearly interest rate
   - Our cards have APRs ranging from 14.99% to 24.99%

2. **Daily Periodic Rate**
   - Your APR is divided by 365 to get the Daily Periodic Rate
   - For example, a 16.99% APR gives a daily rate of about 0.0465%

3. **Average Daily Balance Method**
   - We add your balance each day of the billing cycle
   - Divide by the number of days to get your average daily balance
   - Multiply by the daily rate, then by days in billing cycle

4. **Interest-Free Grace Period**
   - If you pay your statement balance in full by the due date each month, you won't pay any interest on purchases
   - This grace period is typically 21-25 days

Would you like me to show you a specific example of how this works?`,
        agentType: 'credit',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'Yes, can you show me a specific example?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Example Interest Calculation:**

Let's say you have:
- Credit card with 16.99% APR (Daily rate = 0.0465%)
- Billing cycle: 30 days
- Starting balance: $0
- Day 5: $1,000 purchase
- Day 15: $500 purchase
- Day 25: $200 payment

**Step 1: Calculate Average Daily Balance**
- Days 1-4: $0 balance (4 days)
- Days 5-14: $1,000 balance (10 days)
- Days 15-24: $1,500 balance (10 days)
- Days 25-30: $1,300 balance (6 days)

Average Daily Balance = 
($0×4 + $1,000×10 + $1,500×10 + $1,300×6) ÷ 30 = $1,000

**Step 2: Calculate Interest**
Interest = $1,000 × 0.0465% × 30 days = $13.95

If you had paid your previous statement balance in full, you would have a grace period and might not be charged this interest on new purchases.`,
        agentType: 'credit',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "So if I pay off my balance in full each month, I won't pay interest?",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `Exactly! That's one of the most important credit card strategies.

**Avoiding Interest: The Full Payment Strategy**

If you pay your statement balance in full by the due date each month, you'll typically:
- Pay zero interest on purchases
- Benefit from the full grace period (21-25 days)
- Still earn all your cash back or rewards
- Build excellent credit history

This is why we always recommend paying your statement balance in full each month if possible. It's the most cost-effective way to use a credit card.

However, note that certain transactions like cash advances usually have no grace period and begin accruing interest immediately.

Would you like to learn about any other aspects of credit cards, such as how to maximize rewards or improve your credit score?`,
        agentType: 'credit',
        delay: 1500,
      }
    ]
  },
  {
    id: 'credit-approval',
    trigger: 'How is my credit limit determined?',
    title: 'Credit Limit Determination',
    description: 'Explains how credit limits are determined',
    messages: [
      {
        sender: 'user',
        content: 'How is my credit limit determined?',
      },
      {
        sender: 'agent',
        content: `Your credit limit is determined by evaluating multiple factors in your financial profile:`,
        agentType: 'credit',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Credit Limit Determination Factors:**

1. **Credit Score and History**
   - Your FICO or VantageScore (higher scores typically qualify for higher limits)
   - Length of credit history
   - Payment history and reliability
   - Number of other credit accounts and their limits

2. **Income and Employment**
   - Your annual income
   - Employment stability
   - Income-to-debt ratio

3. **Existing Debt Obligations**
   - Current outstanding debt
   - Monthly payment obligations
   - Debt-to-income ratio (typically looking for under 40%)

4. **Bank Relationship**
   - Existing accounts with our bank
   - History with our financial institution
   - Deposit and investment balances

Our AI analyzes all these factors to determine an appropriate credit limit that aligns with your financial situation.`,
        agentType: 'credit',
        delay: 1600,
      },
      {
        sender: 'user',
        content: 'Can I request a specific credit limit when applying?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `Yes, you can request a specific credit limit when applying, though the final limit will still be subject to approval:

**Requesting Your Preferred Credit Limit:**

- During the application, you'll have the opportunity to indicate your desired credit limit
- This request is considered along with all other factors in our evaluation
- We may approve the full requested amount or a different amount based on your financial profile
- Requesting an unrealistically high limit won't negatively impact your application, but we'll adjust it appropriately

**If You Need a Higher Limit:**

If you're approved for a lower limit than requested, you can:

1. Use the card responsibly for 6-12 months
2. Keep your credit utilization low (under 30%)
3. Make payments on time
4. Request a credit limit increase after demonstrating good management

Would you like to know the typical initial credit limits for our different card types?`,
        agentType: 'credit',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'Yes, what are the typical initial credit limits?',
        delay: 1200,
      },
      {
        sender: 'agent',
        content: `**Typical Initial Credit Limits:**

1. **Cash Rewards Card**
   - $1,000 - $10,000 for most new customers
   - Average initial limit: $5,000
   - Excellent credit/income profiles may receive up to $15,000

2. **Premium Rewards Card**
   - $5,000 - $20,000 for most new customers
   - Average initial limit: $10,000
   - Excellent credit/income profiles may receive up to $30,000

3. **Secured Credit Builder Card**
   - Equal to your security deposit ($200 - $2,500)
   - After 12 months of responsible use, you may qualify to convert to an unsecured card

These ranges are general guidelines. Your specific limit will be determined by the factors we discussed earlier.

Would you like to begin an application to see what credit limit you might qualify for?`,
        agentType: 'credit',
        delay: 1700,
      }
    ]
  },
  {
    id: 'credit-building',
    trigger: 'How can I build my credit with your card?',
    title: 'Credit Building Strategies',
    description: 'Provides strategies for building credit with a credit card',
    messages: [
      {
        sender: 'user',
        content: 'How can I build my credit with your card?',
      },
      {
        sender: 'agent',
        content: `Building credit with our credit cards is straightforward when you follow these key strategies:`,
        agentType: 'credit',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Credit Building Strategies:**

1. **Make On-Time Payments**
   - Payment history accounts for 35% of your FICO score
   - Set up automatic payments to never miss a due date
   - Even one late payment can significantly impact your score

2. **Keep Utilization Low**
   - Aim to keep your credit utilization under 30%
   - Credit utilization accounts for 30% of your score
   - For a $1,000 limit, try to keep your balance under $300

3. **Don't Close Old Accounts**
   - Credit history length accounts for 15% of your score
   - Keeping accounts open extends your history
   - Use the card for small purchases occasionally to keep it active

4. **Monitor Your Credit**
   - We provide free credit score monitoring
   - Check for errors or fraud regularly
   - Track your progress over time

If you're new to credit or rebuilding, our Secured Credit Builder Card is specifically designed to help establish or improve your credit profile.`,
        agentType: 'credit',
        delay: 1500,
      },
      {
        sender: 'user',
        content: 'How long does it usually take to see an improvement in my credit score?',
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Credit Improvement Timeline:**

Credit score improvements vary by individual, but here's a general timeline:

**Short-term** (1-3 months):
- Decreased credit utilization can show impact quickly
- New accounts report to credit bureaus within 30-45 days
- Error corrections can show results within one reporting cycle

**Medium-term** (3-6 months):
- Consistent on-time payments start to strengthen your profile
- Positive account management begins to establish a pattern
- Credit mix improvements may be reflected

**Long-term** (6-12+ months):
- Significant score improvements typically occur
- Length of credit history begins to have more impact
- Negative items have reduced influence over time

**Important factors affecting your timeline:**
- Starting credit score
- Credit history length
- Severity of past negative items
- Current credit utilization
- Number of accounts

All our credit cards report to all three major credit bureaus (Experian, Equifax, TransUnion), which helps ensure your credit-building efforts are fully recognized.`,
        agentType: 'credit',
        delay: 2000,
      },
      {
        sender: 'user',
        content: 'Should I pay off my balance in full or keep a small balance?',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `**Pay in Full vs. Carry a Balance:**

This is an excellent question, and there's a common misconception about it!

**The Truth: Pay in Full**
- Paying your balance in full each month is the best strategy
- You do NOT need to carry a balance to build credit
- The myth that carrying a balance helps your score is incorrect
- Credit bureaus see your activity and utilization regardless

**Benefits of Paying in Full:**
- Avoid interest charges completely
- Demonstrate responsible credit management
- Maintain low utilization ratios
- Build the same positive payment history

**How It Works:**
1. Make purchases during your billing cycle
2. Wait for your statement to close
3. Pay the full statement balance by the due date
4. The card issuer still reports your activity to the bureaus

By paying in full, you get all the credit-building benefits without the cost of interest charges. It's the most financially savvy approach to building credit.

Would you like me to help you apply for a card that matches your credit-building goals?`,
        agentType: 'credit',
        delay: 2200,
      }
    ]
  },
  {
    id: 'rewards-programs',
    trigger: 'How do credit card rewards work?',
    title: 'Credit Card Rewards',
    description: 'Explains how credit card rewards programs work',
    messages: [
      {
        sender: 'user',
        content: 'How do credit card rewards work?',
      },
      {
        sender: 'agent',
        content: `Credit card rewards programs let you earn value back on your spending. Here's how our rewards programs work:`,
        agentType: 'credit',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Credit Card Rewards Explained:**

1. **Earning Rewards**
   - **Cash Rewards Card**: Earn 2% cash back on all purchases
   - **Premium Rewards Card**: Earn 3x points on travel & dining, 2x points on everything else
   - **Secured Card**: Earn 1% cash back on all purchases
   - Points/cash back are earned on the purchase amount, not including fees, interest, or cash advances

2. **Redemption Options**
   - **Statement credits** (apply rewards to your balance)
   - **Direct deposit** to your bank account
   - **Gift cards** from popular retailers (sometimes with bonuses)
   - **Travel bookings** through our travel portal (Premium card)
   - **Point transfers** to airline/hotel partners (Premium card)
   - **Merchandise** through our online rewards catalog

3. **Value & Expiration**
   - Cash back: 1% = 1 cent per dollar spent
   - Points: 1 point = 1-1.5 cents depending on redemption method
   - Our rewards never expire as long as your account remains open
   - No minimum redemption amount for statement credits

Do you have questions about a specific rewards program?`,
        agentType: 'credit',
        delay: 1800,
      },
      {
        sender: 'user',
        content: 'For the Premium Rewards Card, how much are the points worth when booking travel?',
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Premium Rewards Card Points Value for Travel:**

When redeeming points for travel with the Premium Rewards Card:

1. **Direct Travel Portal Bookings**
   - Points are worth **1.5 cents each** when booking through our travel portal
   - Example: 50,000 points = $750 in travel value
   - This applies to flights, hotels, rental cars, and vacation packages
   - No blackout dates or travel restrictions

2. **Transfer Partners Value**
   - Points transfer 1:1 to over 15 airline and hotel partners
   - Value can range from 1-3+ cents per point depending on the booking
   - Premium cabin flights often provide the highest value per point
   - Examples of transfer partners: United, Delta, Marriott, Hyatt, IHG

3. **Travel Statement Credits**
   - Points are worth 1 cent each for travel statement credits
   - Can be applied to any travel purchase made with your card
   - Includes airlines, hotels, cruises, trains, taxis, ride-shares

Would you like to see an example of how many points you'd earn on typical spending with the Premium Rewards Card?`,
        agentType: 'credit',
        delay: 2000,
      },
      {
        sender: 'user',
        content: 'Yes, please show me an example based on typical spending.',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `**Example Premium Rewards Card Earnings:**

Based on average monthly spending of $2,500:

| Category | Monthly Spend | Points Multiplier | Points Earned |
|----------|--------------|-------------------|---------------|
| Dining   | $500         | 3x                | 1,500         |
| Travel   | $300         | 3x                | 900           |
| Other    | $1,700       | 2x                | 3,400         |
| **Total**    | **$2,500**   |                   | **5,800**     |

**Monthly Points Value:**
- Travel Portal (1.5¢/point): $87 value
- Statement Credit (1¢/point): $58 value
- Potential Transfer Value (varies): $58-$174 value

**Annual Points (without bonus):**
- 69,600 points = $1,044 in travel portal value

**First Year Value (including 50,000 point bonus):**
- 119,600 points = $1,794 in travel value
- Minus $95 annual fee = **$1,699 net first-year value**
- Plus $300 travel credit = **$1,999 total first-year value**

This means an effective return of 6.7% on your spending in the first year, and about 4.5% in subsequent years.

Would you like to apply for the Premium Rewards Card?`,
        agentType: 'credit',
        delay: 2200,
      }
    ]
  }
];