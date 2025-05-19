import React from 'react';

/**
 * Predefined conversations for the Fraud Detection workflow.
 * Each conversation has a trigger question and a sequence of messages
 * that simulate a complete interaction with visualizations.
 */

export type MessageType = {
  sender: 'user' | 'agent';
  content: string;
  agentType?: 'fraud' | 'security' | 'account';
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

export const fraudDetectionConversations: ConversationType[] = [
  {
    id: 'suspicious-activity',
    trigger: "I received a fraud alert about suspicious activity. What should I do?",
    title: 'Suspicious Activity Response',
    description: 'How to respond to a fraud alert notification',
    messages: [
      {
        sender: 'user',
        content: "I received a fraud alert about suspicious activity. What should I do?",
      },
      {
        sender: 'agent',
        content: "I understand your concern about the fraud alert. Let me help you address this right away.",
        agentType: 'fraud',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `First, I need to verify your identity for security purposes. Could you please confirm:

1. The last 4 digits of your account number
2. Your full name as it appears on the account`,
        agentType: 'fraud',
        delay: 1200,
      },
      {
        sender: 'user',
        content: "My account ends in 4321 and my name is John Smith.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: "Thank you for verifying your information, Mr. Smith. I can now see the fraud alert on your account. Let me explain what happened and what we should do next.",
        agentType: 'fraud',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `**About the Fraud Alert:**

Our fraud detection system flagged two transactions that occurred within the last 24 hours:

1. A $499.99 transaction at ElectroMart in Las Vegas, NV at 3:45 PM yesterday
2. A $899.50 transaction at TechWorld in Miami, FL at 7:23 PM yesterday

These were flagged because:
- They occurred in different geographic locations within a short time frame
- They are at merchants you haven't previously shopped at
- They fall outside your normal spending patterns

**To address this situation, we need to confirm if these transactions were authorized by you.**`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "I didn't make either of those transactions. I haven't been to Las Vegas or Miami.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: "Thank you for confirming. I'll mark these transactions as fraudulent and take immediate action to protect your account.",
        agentType: 'fraud',
        delay: 1000,
      },
      {
        sender: 'agent',
        content: `**I've taken the following actions:**

1. **Card Block**: Your current card has been blocked to prevent any further unauthorized transactions
2. **Dispute Filed**: Disputes have been initiated for both fraudulent transactions
3. **New Card**: A replacement card has been ordered and will arrive within 3-5 business days
4. **Refunds**: Temporary credits of $499.99 and $899.50 have been applied to your account while we investigate

**Next Steps:**
- You'll receive a confirmation email with a case number for these disputes
- You can use your digital card in your mobile wallet immediately
- We recommend you review your recent transactions for any other suspicious activity
- Please watch for your new card in the mail

Is there anything else you'd like me to help you with regarding this situation?`,
        agentType: 'fraud',
        delay: 2500,
      },
      {
        sender: 'user',
        content: "Should I change my password or take other security measures?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `That's an excellent question and a great security practice.

**Additional Security Recommendations:**

1. **Password Update**: Yes, please change your online banking password immediately
   - Use a strong, unique password you don't use elsewhere
   - Include a mix of uppercase, lowercase, numbers, and special characters

2. **Enable Two-Factor Authentication**
   - If not already enabled, activate this in the Security section of your account
   - This adds an extra verification step when logging in

3. **Update Contact Information**
   - Verify your phone number and email are current so we can reach you

4. **Monitor Your Credit Report**
   - Watch for unauthorized accounts or inquiries
   - Consider setting up a free fraud alert with the credit bureaus

These measures will help further secure your account from unauthorized access. Would you like me to guide you through changing your password right now?`,
        agentType: 'security',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Yes, please help me change my password.",
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `I'll guide you through changing your password:

1. Go to the "Settings" section in the top right corner of your online banking dashboard
2. Select "Security Settings"
3. Click on "Change Password"
4. Enter your current password
5. Create a new password that is:
   - At least 12 characters long
   - Includes uppercase and lowercase letters
   - Contains numbers and special characters
   - Is not a previously used password

For extra security, avoid using:
- Personal information (birthdates, names)
- Dictionary words
- Sequential numbers or letters

Once complete, you'll receive a confirmation email that your password was changed. You'll need to log in again with your new password on all devices.

Is there anything else about account security you'd like help with today?`,
        agentType: 'security',
        delay: 2000,
      }
    ]
  },
  {
    id: 'fraud-prevention',
    trigger: "How can I protect my account from fraud?",
    title: 'Fraud Prevention Strategies',
    description: 'Best practices to protect your account from fraud',
    messages: [
      {
        sender: 'user',
        content: "How can I protect my account from fraud?",
      },
      {
        sender: 'agent',
        content: "That's a great question. I'm happy to share some effective fraud prevention strategies to help keep your account secure.",
        agentType: 'security',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Account Protection Best Practices:**

1. **Strengthen Your Login Security**
   - Use a strong, unique password with 12+ characters
   - Enable two-factor authentication (2FA)
   - Never share your password or security codes with anyone
   - Set up biometric authentication (fingerprint/face recognition)

2. **Monitor Your Accounts Regularly**
   - Check your transactions at least weekly
   - Sign up for real-time transaction alerts
   - Review your statements carefully each month
   - Report suspicious activities immediately

3. **Protect Your Personal Information**
   - Be cautious about sharing personal details online
   - Check your credit report regularly
   - Shred sensitive documents before disposal
   - Use a secure mailbox for financial mail

4. **Practice Safe Online Habits**
   - Only access your account on secure networks
   - Verify website URLs before entering credentials
   - Keep your devices and apps updated
   - Use antivirus and anti-malware software

Would you like me to explain any of these strategies in more detail?`,
        agentType: 'security',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "How do I set up transaction alerts?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Setting Up Transaction Alerts:**

You can set up customized transaction alerts in just a few steps:

1. **Log in to your online banking account or mobile app**

2. **Navigate to "Settings" or "Account Settings"**

3. **Select "Notifications" or "Alerts"**

4. **Choose from available alert types:**
   - All transactions
   - Transactions above a specified amount
   - Card-not-present transactions
   - International transactions
   - ATM withdrawals
   - Large withdrawals
   - Low balance alerts
   - Login attempts

5. **Select your preferred notification method:**
   - Push notifications (mobile app)
   - Email alerts
   - SMS text messages

6. **Set thresholds if applicable**
   For example: "Alert me for any transaction over $100"

7. **Save your preferences**

Once set up, you'll receive instant notifications based on your preferences, allowing you to quickly identify any unauthorized transactions.

Would you like me to walk you through setting up a specific type of alert now?`,
        agentType: 'security',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "What should I do if I notice a transaction I don't recognize?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**If You Spot an Unrecognized Transaction:**

Act quickly with these steps:

1. **Don't Panic, but Act Promptly**
   - The sooner you report, the better protected you are

2. **Contact Us Immediately**
   - Call our 24/7 fraud hotline: 1-800-123-4567
   - Use the "Report Suspicious Activity" feature in the mobile app
   - Message us securely through online banking

3. **Document the Details**
   - Note the transaction date, amount, and merchant
   - Take screenshots if possible
   - Write down when you discovered the transaction

4. **Prepare for Verification**
   - Have your account information ready
   - Be prepared to verify your identity
   - Know which transactions you did authorize

5. **Follow-Up Actions We May Take:**
   - Temporarily freeze your card
   - Issue a replacement card
   - File a dispute for the transaction
   - Credit your account while we investigate
   - Request a fraud affidavit

Remember, our Zero Liability Policy protects you from unauthorized transactions when reported promptly.

For extra protection, consider changing your password and reviewing other recent transactions for any additional suspicious activity.`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Is it safe to use public Wi-Fi for banking?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Public Wi-Fi Safety for Banking:**

Using public Wi-Fi for banking is generally **not recommended** due to significant security risks.

**Potential Risks:**
- Man-in-the-middle attacks
- Network spoofing (fake Wi-Fi networks)
- Packet sniffing to intercept data
- Malware distribution on public networks
- Session hijacking

**Safer Alternatives:**

1. **Use Cellular Data**
   - Your mobile carrier's network is more secure than public Wi-Fi
   - Worth the data usage for financial transactions

2. **Wait Until You're on a Secure Network**
   - Home or work networks with proper security

3. **Use a VPN (Virtual Private Network)**
   - Creates an encrypted tunnel for your data
   - Choose a reputable VPN service
   - Enable before connecting to public Wi-Fi

4. **Our Banking App Security Features**
   - End-to-end encryption
   - Automatic session timeouts
   - No storage of sensitive information

If you absolutely must use public Wi-Fi for banking:
- Verify you're connected to the legitimate network
- Enable two-factor authentication
- Look for HTTPS (lock icon) in the browser
- Log out completely when finished
- Disable auto-connect to public networks

Would you like recommendations for secure VPN services?`,
        agentType: 'security',
        delay: 2500,
      }
    ]
  },
  {
    id: 'identity-theft',
    trigger: "I think my identity has been stolen. What should I do?",
    title: 'Identity Theft Response',
    description: 'Steps to take if you suspect identity theft',
    messages: [
      {
        sender: 'user',
        content: "I think my identity has been stolen. What should I do?",
      },
      {
        sender: 'agent',
        content: "I'm very sorry to hear you're concerned about identity theft. This is a serious situation that requires immediate action, and I'll help you through the necessary steps.",
        agentType: 'fraud',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Immediate Steps for Suspected Identity Theft:**

1. **Place a Fraud Alert**
   - Contact one of the three credit bureaus (Equifax, Experian, or TransUnion)
   - A fraud alert is free and lasts one year
   - The bureau you contact must tell the other two

2. **Request Credit Reports**
   - Get free reports from all three bureaus at annualcreditreport.com
   - Review for unauthorized accounts or inquiries
   - Dispute any fraudulent information

3. **Freeze Your Credit**
   - Prevents new accounts from being opened
   - Must be done separately with each credit bureau
   - Free to place and lift when needed

4. **Report to the Federal Trade Commission (FTC)**
   - Visit IdentityTheft.gov
   - Complete an identity theft report
   - Get a customized recovery plan

5. **File a Police Report**
   - Bring your FTC Identity Theft Report
   - Bring government ID and proof of address
   - Get a copy of the police report for your records

These initial steps help limit the damage and start the recovery process. Would you like me to explain what specific steps to take with our bank?`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Yes, please tell me what to do with my bank accounts.",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Bank-Specific Identity Theft Protection Steps:**

1. **Secure Your Accounts Immediately**
   - Change your online banking password
   - Update security questions/answers
   - Enable two-factor authentication if not already active

2. **Review Recent Activity**
   - Check all accounts for unauthorized transactions
   - Look back at least 60 days of activity
   - Flag any suspicious transactions for us to investigate

3. **Request Account Protection Measures**
   - We can add extra verification requirements
   - Place alerts on your accounts for suspicious activity
   - Consider switching to new account numbers if necessary

4. **Document Everything**
   - Note dates, times, and details of suspicious activity
   - Keep a log of all communications about the identity theft
   - Save copies of all reports and correspondence

5. **Consider Our Identity Protection Services**
   - We offer identity monitoring tools
   - Alerts for changes to your credit report
   - Recovery assistance if your identity is compromised

I can help you with any of these steps right now. Which would you like to start with?`,
        agentType: 'fraud',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "I'd like to check my accounts for unauthorized transactions first.",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: "I'll help you review your accounts for suspicious activity. First, I need to verify your identity with a few additional security questions.",
        agentType: 'security',
        delay: 1500,
      },
      {
        sender: 'agent',
        content: `After reviewing your accounts, I've identified the following potential unauthorized transactions from the past 30 days:

**Checking Account Ending in 4321:**
- March 15: Online Purchase - TechGadgetStore - $459.99
- March 16: ATM Withdrawal - Las Vegas, NV - $500.00
- March 17: Online Purchase - DigitalDownloads - $199.99

**Credit Card Ending in 5678:**
- March 14: Gas Station - Phoenix, AZ - $75.32
- March 16: Department Store - Miami, FL - $312.87
- March 17: Online Subscription - StreamFlix Premium - $19.99

Please confirm which of these transactions are unauthorized so we can dispute them and secure your accounts.`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "I didn't make any of those transactions! I haven't been to Las Vegas, Phoenix, or Miami, and I didn't make those online purchases.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `Thank you for confirming. I'm flagging all these transactions as fraudulent and taking immediate protective measures for your accounts.

**Actions I've taken immediately:**

1. **Locked all affected accounts** to prevent further unauthorized activity
2. **Initiated the dispute process** for all six unauthorized transactions ($1,568.17 total)
3. **Ordered new cards** with new numbers to replace potentially compromised cards
4. **Added an extra verification layer** to your accounts
5. **Generated a fraud investigation case number**: FRD-23789456

**Your temporary credits totaling $1,568.17 should appear in your accounts within 1-2 business days** while we investigate these transactions.

Would you like me to place a complete freeze on all your accounts until you receive your new cards? This would prevent all transactions but also pause any scheduled payments or direct deposits.`,
        agentType: 'fraud',
        delay: 2500,
      },
      {
        sender: 'user',
        content: "I still have bills to pay. Can I keep using my accounts safely but with extra monitoring?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `Absolutely. We can implement enhanced security measures while keeping your accounts functional:

**Enhanced Security Plan:**

1. **Real-time transaction monitoring**
   - Our fraud team will actively monitor your accounts 24/7
   - Suspicious transactions will require immediate verification

2. **Verification for larger transactions**
   - Any transaction over $100 will require verification
   - You'll receive an immediate push notification or text message

3. **Digital wallet priority**
   - Use Apple Pay, Google Pay, or our bank's digital wallet
   - These use tokenized transactions that are more secure than physical cards

4. **Location-based restrictions**
   - We'll limit transactions to your current geographic area
   - Online purchases will require additional verification

5. **Daily transaction summaries**
   - You'll receive an end-of-day summary of all account activity

I've implemented these measures effective immediately. Your new cards should arrive within 3-5 business days. 

Is there anything else you'd like me to help you with regarding this situation?`,
        agentType: 'security',
        delay: 2500,
      }
    ]
  },
  {
    id: 'unusual-transactions',
    trigger: "What makes a transaction look suspicious to your system?",
    title: 'Suspicious Transaction Indicators',
    description: 'Explains how the fraud detection system identifies suspicious transactions',
    messages: [
      {
        sender: 'user',
        content: "What makes a transaction look suspicious to your system?",
      },
      {
        sender: 'agent',
        content: "That's an excellent question about how our fraud detection system works. Our AI-powered system uses multiple factors to identify potentially suspicious transactions.",
        agentType: 'fraud',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Key Indicators That Flag Suspicious Transactions:**

1. **Unusual Spending Patterns**
   - Transactions that deviate from your established spending habits
   - Sudden large purchases outside your normal price range
   - Multiple transactions in rapid succession (velocity)
   - Spending in categories you rarely use

2. **Geographic Anomalies**
   - Transactions in locations far from your usual area
   - Multiple transactions in different geographic regions within a short time
   - Transactions in high-risk countries or regions
   - In-person purchases in locations that conflict with your device location

3. **Unusual Timing and Frequency**
   - Transactions at odd hours not typical for your activity
   - Multiple similar transactions within minutes
   - Rapid testing of small amounts followed by larger transactions
   - Atypical frequency of ATM withdrawals or transfers

4. **Device and Channel Behavior**
   - Login from an unrecognized device or IP address
   - Unusual browser or device characteristics
   - Multiple failed authentication attempts
   - Changes to account information from new devices

5. **Merchant Risk Factors**
   - Transactions with merchants known for high fraud rates
   - Unusual combinations of merchants
   - Digital goods or gift card purchases (high-risk categories)
   - Multiple declined transactions at the same merchant

Our system assigns risk scores to each transaction based on these and many other factors, using both rules-based analysis and machine learning models that continuously improve.`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Does traveling usually trigger fraud alerts? I'll be going abroad soon.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Travel and Fraud Alerts:**

Yes, international travel often triggers fraud alerts because sudden location changes are a strong fraud indicator. Here's how travel impacts our fraud detection system:

**Why Travel Triggers Alerts:**
- Geographic anomalies (transactions far from home)
- Unusual merchant categories (hotels, foreign restaurants)
- Different currencies and conversion patterns
- New devices or networks accessing your account

**How to Prevent Travel-Related Fraud Alerts:**

1. **Set Up a Travel Notice**
   - Log into your app or online banking
   - Go to "Card Services" > "Travel Notifications"
   - Enter your destinations and travel dates
   - Include all countries you'll visit, even briefly

2. **Update Contact Information**
   - Ensure your mobile number is current
   - Verify we can reach you via SMS internationally
   - Consider adding a temporary travel email if needed

3. **Prepare Backup Payment Methods**
   - Bring multiple cards from different networks
   - Carry some local currency for emergencies
   - Set up mobile payment options in advance

4. **Monitor Your Accounts While Traveling**
   - Check your accounts regularly during your trip
   - Respond promptly to any verification requests
   - Use the app's secure messaging if you need assistance

Would you like me to set up a travel notice for your upcoming trip now?`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Yes, I'm traveling to Italy and France next month from the 10th to the 24th.",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `I'll set up a travel notice for your trip to Italy and France. To ensure I create the most effective travel notice, I need to confirm a few details:

1. Will you be traveling to any countries besides Italy and France?
2. Would you like the travel notice for all your cards with us, or specific cards only?
3. Will you be making any large purchases while traveling that might be outside your normal spending patterns?`,
        agentType: 'fraud',
        delay: 1500,
      },
      {
        sender: 'user',
        content: "Just Italy and France. Please add the notice to all my cards. And I might buy some jewelry in France, maybe up to $2,000.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Travel Notice Confirmation**

I've successfully added a travel notice with the following details:

- **Destinations**: Italy and France
- **Travel Dates**: May 10, 2025 to May 24, 2025
- **Cards Included**: All cards on your account
- **Special Notes**: Potential jewelry purchase up to $2,000

**Travel Notice Reference:** TN-82915437

**Additional European Travel Tips:**
- Many European merchants prefer chip & PIN over signatures
- Contactless payments are widely accepted
- Inform merchants you want to pay in local currency (not USD) to avoid poor conversion rates
- Keep transaction receipts for customs purposes when returning home
- Italy and France both use the Euro (€) as currency

Your travel notice helps prevent legitimate transactions from being declined, but our fraud detection system will still protect you from truly suspicious activity.

Is there anything else you'd like to know about using your cards while traveling abroad?`,
        agentType: 'fraud',
        delay: 2500,
      },
      {
        sender: 'user',
        content: "What should I do if my card gets declined while I'm traveling despite the notice?",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**If Your Card Is Declined While Traveling:**

If your card is declined despite the travel notice, follow these steps:

1. **Check for a Verification Message**
   - Look for a text or email asking you to verify the transaction
   - Respond to confirm it's legitimate

2. **Try a Smaller Transaction**
   - Sometimes large amounts trigger additional verification
   - Try a smaller purchase and then contact us

3. **Call the International Support Number**
   - Call +1-800-123-4567 (collect calls accepted)
   - This number is also on the back of your card
   - Available 24/7 with priority for international calls

4. **Use the Mobile App**
   - Check for any card blocks or notifications
   - Use the "Verify Transaction" feature
   - Send a secure message through the app

5. **Alternative Payment Methods**
   - Use another card from your wallet temporarily
   - Access emergency cash withdrawal if needed
   - Use your mobile wallet if the physical card is declined

Pro Tip: When making large purchases abroad (like the jewelry you mentioned), consider making a small purchase at the same merchant first. This helps establish a pattern and reduces the chance of the larger purchase being declined.

I've also added a note to your travel profile about the potential jewelry purchase to further reduce the chance of a decline.`,
        agentType: 'fraud',
        delay: 2500,
      }
    ]
  },
  {
    id: 'transaction-monitoring',
    trigger: "How does your transaction monitoring work?",
    title: 'Transaction Monitoring System',
    description: 'Explains how the AI transaction monitoring system works',
    messages: [
      {
        sender: 'user',
        content: "How does your transaction monitoring work?",
      },
      {
        sender: 'agent',
        content: "I'd be happy to explain how our AI-powered transaction monitoring system works to keep your accounts secure.",
        agentType: 'fraud',
        delay: 800,
      },
      {
        sender: 'agent',
        content: `**Our Transaction Monitoring System:**

Our multi-layered fraud detection and transaction monitoring system works 24/7 to protect your accounts:

1. **Real-Time Analysis**
   - Every transaction is analyzed in milliseconds
   - 1,000+ data points evaluated per transaction
   - Decisions made before a transaction is completed
   - Both approved and declined transactions are analyzed

2. **AI and Machine Learning Models**
   - Self-improving algorithms adapt to new fraud patterns
   - Your personal transaction history creates a unique profile
   - Behavioral biometrics analyze how you interact with devices
   - Pattern recognition identifies anomalies across multiple accounts

3. **Risk-Based Authentication**
   - Low-risk transactions proceed without interruption
   - Medium-risk may require simple verification (text/email code)
   - High-risk transactions trigger additional security steps
   - Extremely high-risk transactions may be temporarily blocked

4. **Multi-Factor Detection**
   - Transaction details (amount, merchant, location)
   - Device and network characteristics
   - Authentication method and accuracy
   - Behavioral patterns (time of day, transaction velocity)
   - Merchant risk category and history

Would you like me to explain how we balance security with convenience in our monitoring system?`,
        agentType: 'security',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "Yes, I'm wondering how you avoid too many false alarms.",
        delay: 1800,
      },
      {
        sender: 'agent',
        content: `**Balancing Security and Convenience:**

Reducing false positives (incorrectly flagged legitimate transactions) while catching actual fraud is one of our biggest challenges. Here's how we achieve this balance:

1. **Adaptive Customer Profiling**
   - We analyze 3-6 months of your transaction history
   - Your profile continuously updates as your habits change
   - New patterns become "normal" after consistent behavior
   - Seasonal variations are accounted for (e.g., holiday shopping)

2. **Risk-Appropriate Responses**
   - Low-risk flags: Monitored but not blocked
   - Medium-risk: Simple verification (text with code)
   - High-risk: Only these trigger calls or temporary blocks
   - We adjust thresholds based on customer feedback

3. **Contextual Analysis**
   - We connect related activities for context
   - Booking a flight then hotel in same location reduces flags
   - Gradual spending increases are treated differently than sudden spikes
   - Life events (moves, travel) are factored in when known

4. **Customer Preferences**
   - You can set transaction monitoring preferences
   - Adjust alert thresholds for different types of activity
   - Whitelist trusted merchants or locations
   - Customize how we contact you about suspicious activity

5. **Continuous Optimization**
   - We track false positive and false negative rates
   - Customer feedback refines our models
   - Regular system testing and upgrades
   - Benchmark against industry standards

Our goal is to stop fraud while allowing your legitimate transactions to proceed smoothly. We've reduced false positives by 35% in the past year while maintaining a 99.95% fraud detection rate.`,
        agentType: 'fraud',
        delay: 2200,
      },
      {
        sender: 'user',
        content: "Can I see what patterns or behaviors your system has learned about my transaction habits?",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Your Personalized Transaction Profile:**

Yes, I can provide an overview of the patterns our system has learned about your transaction habits. Here's what our system has observed:

**Your Normal Transaction Patterns:**

1. **Geographic Patterns**
   - Most common locations: New York metro area
   - Regular transactions in: Manhattan, Brooklyn, Jersey City
   - Occasional: Boston (monthly), Chicago (quarterly)

2. **Timing Patterns**
   - Active hours: Primarily 7am-10pm Eastern Time
   - Most active days: Wednesday-Saturday
   - Typical grocery shopping: Sunday mornings
   - Regular monthly transactions: 1st-3rd of month (bills)

3. **Merchant Categories**
   - High frequency: Restaurants, grocery, transit
   - Moderate: Entertainment, retail
   - Low: Travel, automotive
   - Recurring: Streaming services, utilities

4. **Transaction Value Patterns**
   - Average transaction: $67.42
   - Small transactions (<$25): Several times weekly
   - Medium ($25-$100): 3-5 times weekly
   - Large ($100-$500): 2-3 times monthly
   - Very large (>$500): Rare (quarterly)

5. **Payment Methods**
   - In-person: Typically contactless/tap
   - Online: Saved card on trusted sites
   - Mobile wallet: Increasing usage pattern
   - ATM usage: Approximately twice monthly

**What Would Trigger Alerts:**
Transactions deviating significantly from these patterns, especially combinations of unusual behaviors (e.g., large purchases in new locations during off-hours).

Would you like to update any of these pattern assumptions or set custom monitoring preferences?`,
        agentType: 'fraud',
        delay: 2500,
      },
      {
        sender: 'user',
        content: "This is really detailed! Can I adjust the alert threshold for large purchases?",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Adjusting Your Large Purchase Alert Threshold:**

Absolutely! I can help you customize your large purchase alert threshold. Currently, your settings are:

- Purchases over $500 trigger additional verification
- This applies to both in-person and online transactions
- Current verification method: Text message with code

**Would you like to:**

1. Increase the threshold amount? (e.g., only verify purchases above $750 or $1,000)
2. Have different thresholds for in-person vs. online purchases?
3. Change your verification method? (Options: text message, email, push notification, or phone call)
4. Apply special rules to specific merchant categories? (e.g., higher limits for travel)

Let me know which changes you'd prefer, and I can update your settings immediately.`,
        agentType: 'security',
        delay: 2000,
      },
      {
        sender: 'user',
        content: "I'd like to increase the threshold to $750 for in-person purchases but keep it at $500 for online transactions. And I prefer text verification.",
        delay: 2000,
      },
      {
        sender: 'agent',
        content: `**Alert Settings Updated Successfully**

I've updated your large purchase alert thresholds as requested:

- In-person purchases: Verification required for amounts over $750
- Online purchases: Verification required for amounts over $500
- Verification method: Text message with code (unchanged)

**These changes are effective immediately.**

Your customized settings help us better protect your account while minimizing interruptions to your legitimate transactions.

As a reminder, you can always review and adjust these settings through:
- The "Security" section in your mobile app
- The "Account Preferences" area in online banking
- Contacting our customer service team

Is there anything else you'd like to customize about your fraud protection settings?`,
        agentType: 'security',
        delay: 2000,
      }
    ]
  }
];