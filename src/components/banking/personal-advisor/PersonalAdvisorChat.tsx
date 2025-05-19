import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Send, Bot, User, Briefcase, Home, GraduationCap, Heart, TrendingUp, DollarSign } from 'lucide-react';

const PersonalAdvisorChat: React.FC = () => {
  const { 
    chatThreads, 
    addMessageToChatThread, 
    addAuditEvent,
    customer,
    bankAccount,
    creditCard,
    loan
  } = useBankingContext();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Create a separate chat thread for personal advisor if it doesn't exist
  const chatThread = chatThreads['treasury-ops']; // Reusing treasury-ops mode for now
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread?.messages]);

  // Initialize chat with a welcome message if empty
  useEffect(() => {
    if (chatThread && chatThread.messages.length === 0) {
      addMessageToChatThread('treasury-ops', {
        sender: 'agent',
        content: `Hello ${customer?.firstName || 'there'}! I'm your Personal Financial Advisor. I'm here to help you achieve your financial goals through personalized advice and planning. How can I assist you today? I can help with retirement planning, education savings, home buying, budgeting, or investment strategies.`,
        agentType: 'treasury' // Reusing treasury agent type for now
      });
    }
  }, [chatThread?.messages.length, addMessageToChatThread, customer]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    addMessageToChatThread('treasury-ops', {
      sender: 'user',
      content: input,
    });
    
    setInput('');
    setIsTyping(true);
    
    // Log to audit trail
    addAuditEvent('Personal Advisor', `User query: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`);
    
    // Simulate typing delay
    setTimeout(() => {
      generatePersonalizedResponse(input);
      setIsTyping(false);
    }, 1500);
  };

  const generatePersonalizedResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let responseContent = "";
    
    // Basic financial profile based on existing data
    const monthlyIncome = customer?.annualIncome ? customer.annualIncome / 12 : 5000;
    const currentDebt = (loan?.monthlyPayment || 0) + (creditCard ? creditCard.creditLimit * 0.03 : 0);
    const cashReserves = bankAccount?.balance || 10000;
    const debtToIncomeRatio = (currentDebt / monthlyIncome) * 100;
    const monthsOfEmergencySavings = cashReserves / monthlyIncome;
    
    // Generate personalized response based on query
    if (lowerQuery.includes('retirement') || lowerQuery.includes('retire')) {
      responseContent = `Based on your current financial profile, here's my assessment for your retirement planning:

- Current age: ${customer?.dateOfBirth ? new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear() : '35'}
- Estimated retirement age: 65
- Current savings: ${bankAccount ? `$${bankAccount.balance.toLocaleString()}` : 'Not enough data'}
- Monthly income: $${Math.round(monthlyIncome).toLocaleString()}

To reach a comfortable retirement with 80% income replacement, I recommend:
1. Increasing your retirement contributions to at least 15% of your income
2. Diversifying your portfolio based on your age and risk tolerance
3. Considering tax-advantaged accounts like a Roth IRA or 401(k)

Would you like me to create a detailed retirement plan or calculate how much you should be saving monthly to reach your retirement goals?`;
    } 
    else if (lowerQuery.includes('education') || lowerQuery.includes('college') || lowerQuery.includes('school') || lowerQuery.includes('university')) {
      responseContent = `For education planning, here are my recommendations:

- Consider a 529 College Savings Plan for tax-advantaged education savings
- Based on your profile, you should aim to save $500/month for future education expenses
- Current average annual cost for public universities is ~$25,000 and private universities ~$55,000
- With consistent contributions and compound growth, you could accumulate approximately $150,000 over 15 years

Would you like to explore specific education savings options, calculate custom savings targets based on specific schools, or discuss tax benefits of different education savings vehicles?`;
    }
    else if (lowerQuery.includes('home') || lowerQuery.includes('house') || lowerQuery.includes('mortgage') || lowerQuery.includes('property')) {
      const affordableHomePrice = monthlyIncome * 4 * 12; // Simple 4x annual income calculation
      
      responseContent = `Based on your financial profile, here's my home buying assessment:

- Estimated affordable home price: $${Math.round(affordableHomePrice).toLocaleString()}
- Recommended down payment (20%): $${Math.round(affordableHomePrice * 0.2).toLocaleString()}
- Estimated monthly mortgage payment: $${Math.round(affordableHomePrice * 0.8 * 0.005).toLocaleString()} (30-year fixed at current rates)
- Current down payment savings: ${bankAccount ? `$${bankAccount.balance.toLocaleString()}` : 'Not enough data'}

To prepare for homeownership, I recommend:
1. Build your down payment savings to avoid PMI
2. Reduce existing debt to improve your debt-to-income ratio
3. Check and improve your credit score to qualify for better rates
4. Account for additional costs like property taxes, insurance, and maintenance

Would you like me to create a savings plan for your down payment, calculate a more precise affordability estimate, or discuss mortgage options?`;
    }
    else if (lowerQuery.includes('budget') || lowerQuery.includes('spend') || lowerQuery.includes('saving') || lowerQuery.includes('expense')) {
      responseContent = `Based on your financial profile, here's a suggested monthly budget breakdown:

Income: $${Math.round(monthlyIncome).toLocaleString()}/month

Recommended allocations:
- Housing (25-30%): $${Math.round(monthlyIncome * 0.3).toLocaleString()}
- Transportation (10-15%): $${Math.round(monthlyIncome * 0.12).toLocaleString()}
- Food (10-15%): $${Math.round(monthlyIncome * 0.12).toLocaleString()}
- Utilities & Insurance (5-10%): $${Math.round(monthlyIncome * 0.08).toLocaleString()}
- Savings/Investments (15-20%): $${Math.round(monthlyIncome * 0.15).toLocaleString()}
- Debt Repayment (15% max): $${Math.round(monthlyIncome * 0.15).toLocaleString()}
- Discretionary (10-15%): $${Math.round(monthlyIncome * 0.1).toLocaleString()}

Your current debt-to-income ratio: ${debtToIncomeRatio.toFixed(1)}% (${debtToIncomeRatio < 36 ? 'Good' : debtToIncomeRatio < 43 ? 'Acceptable' : 'High'})
Emergency fund: ${monthsOfEmergencySavings.toFixed(1)} months of expenses (${monthsOfEmergencySavings >= 6 ? 'Excellent' : monthsOfEmergencySavings >= 3 ? 'Good' : 'Needs attention'})

Would you like a detailed cash flow analysis, personalized savings plan, or debt reduction strategy?`;
    }
    else if (lowerQuery.includes('invest') || lowerQuery.includes('portfolio') || lowerQuery.includes('stock') || lowerQuery.includes('bond')) {
      responseContent = `Here's my assessment of your investment situation:

Current assets: ${bankAccount ? `$${bankAccount.balance.toLocaleString()} in deposit accounts` : 'Not enough data'}
Risk tolerance: ${loan?.loanType === 'home' ? 'Moderate' : creditCard?.cardType === 'premium' ? 'Aggressive' : 'Conservative'} (based on your profile)

Recommended portfolio allocation:
- US Stocks: 50%
- International Stocks: 20%
- Bonds: 25%
- Alternatives/REITs: 5%

Investment strategy recommendations:
1. Maximize tax-advantaged accounts first (401(k), IRA)
2. Consider low-cost index funds or ETFs to minimize fees
3. Rebalance annually to maintain your target allocation
4. Dollar-cost average to reduce market timing risk

Would you like me to recommend specific investment vehicles, explain tax-efficient investing strategies, or discuss retirement portfolio optimization?`;
    }
    else if (lowerQuery.includes('marriage') || lowerQuery.includes('child') || lowerQuery.includes('baby') || lowerQuery.includes('family')) {
      responseContent = `Life events like marriage and children have significant financial implications. Here's my guidance based on your profile:

For marriage financial planning:
1. Combine and coordinate emergency funds (aim for 6 months of joint expenses)
2. Evaluate and potentially consolidate insurance policies
3. Update beneficiaries on all accounts and policies
4. Consider joint financial goals and investment strategies

For family planning with children:
1. Estimated cost to raise a child to age 18: $250,000+ (excluding college)
2. Education savings options: 529 plans, Coverdell ESAs
3. Insurance needs: Life insurance ($500k-$1M recommended per parent)
4. Estate planning: Wills, guardianship designations

Financial action plan:
1. Increase emergency fund by $${Math.round(monthlyIncome * 3).toLocaleString()}
2. Review insurance coverage (life, disability, health)
3. Start education savings of $250-500/month per child
4. Update or create essential legal documents

Would you like specific guidance on merging finances with a spouse, creating a new baby financial checklist, or education funding strategies?`;
    }
    else if (lowerQuery.includes('debt') || lowerQuery.includes('loan') || lowerQuery.includes('credit')) {
      responseContent = `Based on your current financial profile, here's my debt management assessment:

Current debt: 
${loan ? `- ${loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} loan: $${loan.amount.toLocaleString()} at ${loan.interestRate}% APR` : ''}
${creditCard ? `- Credit card: $${(creditCard.creditLimit * 0.3).toLocaleString()} estimated balance at ${creditCard.apr}% APR` : ''}

Your debt-to-income ratio: ${debtToIncomeRatio.toFixed(1)}% (${debtToIncomeRatio < 36 ? 'Healthy' : debtToIncomeRatio < 43 ? 'Acceptable' : 'High'})

Debt management recommendations:
1. Prioritize high-interest debt first (typically credit cards)
2. Consider refinancing options for any loans above 5% interest rate
3. Aim to keep your total debt payments under 36% of your gross income
4. Build an emergency fund alongside debt repayment to avoid new debt

Would you like a customized debt reduction plan, refinancing analysis, or consolidation options?`;
    }
    else {
      // General advice or unclear query
      responseContent = `As your personal financial advisor, I can help with a variety of financial planning needs. Based on your current profile, here are some key observations:

Financial health overview:
- Income: $${Math.round(customer?.annualIncome || 60000).toLocaleString()}/year
- Debt-to-income ratio: ${debtToIncomeRatio.toFixed(1)}% (${debtToIncomeRatio < 36 ? 'Healthy' : debtToIncomeRatio < 43 ? 'Acceptable' : 'High'})
- Emergency fund: ${monthsOfEmergencySavings.toFixed(1)} months (${monthsOfEmergencySavings >= 6 ? 'Excellent' : monthsOfEmergencySavings >= 3 ? 'Good' : 'Needs attention'})

Priority recommendations:
1. ${monthsOfEmergencySavings < 3 ? 'Build emergency savings to at least 3 months of expenses' : 'Continue maintaining your emergency fund'}
2. ${debtToIncomeRatio > 36 ? 'Work on reducing high-interest debt' : 'Maintain your healthy debt levels'}
3. Ensure you're contributing at least 15% to retirement accounts
4. Review your insurance coverage to ensure adequate protection

I can help you with:
- Retirement planning
- Education funding
- Home buying strategy
- Budgeting and cash flow
- Investment portfolio optimization
- Life event planning (marriage, children, etc.)
- Debt management and reduction

What specific area of your financial life would you like to discuss today?`;
    }
    
    // Add agent response
    addMessageToChatThread('treasury-ops', {
      sender: 'agent',
      content: responseContent,
      agentType: 'treasury' // Reusing treasury agent type for now
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-indigo-50">
        <h3 className="font-medium text-indigo-900 flex items-center">
          <Bot className="w-5 h-5 mr-2 text-indigo-600" />
          Personal Financial Advisor
        </h3>
        <p className="text-xs text-indigo-700">
          I'll help you achieve your financial goals with personalized advice and planning
        </p>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatThread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2.5 ${
              message.sender === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.sender === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <div
              className={`flex flex-col max-w-[80%] leading-1.5 ${
                message.sender === 'user'
                  ? 'items-end'
                  : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="flex flex-col max-w-[80%] leading-1.5 items-start">
              <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask about retirement, education, home buying, budgeting, or investments..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {/* Quick access buttons */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Help me plan for retirement")}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            Retirement
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("I'm planning to buy a home")}
          >
            <Home className="h-3 w-3 mr-1" />
            Home Buying
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Help me save for education")}
          >
            <GraduationCap className="h-3 w-3 mr-1" />
            Education
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("I'm planning to have a child soon")}
          >
            <Heart className="h-3 w-3 mr-1" />
            Life Events
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Help me pay down my debt")}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            Debt Planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalAdvisorChat;