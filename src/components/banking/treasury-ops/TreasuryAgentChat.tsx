import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Send, Bot, User, Upload, CheckCircle2, XCircle, AlertTriangle, Timer, BarChart, Calendar, DollarSign, Landmark, ChevronDown, ChevronUp, Briefcase, Activity } from 'lucide-react';

const TreasuryAgentChat: React.FC = () => {
  const { 
    chatThreads, 
    addMessageToChatThread, 
    addAuditEvent,
    treasuryPositions,
    interBankTransfers,
    regulatoryReports,
    baselMetrics
  } = useBankingContext();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatThread = chatThreads['treasury-ops'];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread?.messages]);

  // Initialize chat with a welcome message if empty
  useEffect(() => {
    if (chatThread && chatThread.messages.length === 0) {
      addMessageToChatThread('treasury-ops', {
        sender: 'agent',
        content: `Welcome to the Treasury Operations Dashboard. I'm your Treasury Operations AI Assistant, ready to help you manage liquidity, monitor regulatory compliance, and oversee interbank transfers. How can I assist you today?`,
        agentType: 'treasury'
      });

      // Add initial suggested queries
      setSuggestedQueries([
        "What's our current liquidity position?", 
        "Show our Basel III compliance status", 
        "Summarize recent interbank transfers", 
        "What regulatory reports are due soon?", 
        "How is our capital allocation performing?"
      ]);
    }
  }, [chatThread?.messages.length, addMessageToChatThread]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    addMessageToChatThread('treasury-ops', {
      sender: 'user',
      content: input,
    });
    
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Log to audit trail
    addAuditEvent('Treasury Ops', `User query: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`);
    
    // Generate context-aware suggestions based on user input
    generateContextAwareSuggestions(input.toLowerCase());
    
    // Simulate typing delay
    setTimeout(() => {
      generateTreasuryResponse(input);
      setIsTyping(false);
    }, 1500);
  };

  const generateContextAwareSuggestions = (query: string) => {
    let newSuggestions: string[] = [];
    
    if (query.includes('liquidity')) {
      newSuggestions = [
        "Show me our liquidity stress test results",
        "What's our current LCR ratio?", 
        "How has our HQLA changed month-over-month?",
        "What's our liquidity forecast for next month?"
      ];
    } else if (query.includes('basel') || query.includes('compliance') || query.includes('regulatory')) {
      newSuggestions = [
        "What regulatory reports are due in the next 30 days?",
        "Show me our CET1 ratio trend",
        "Are we compliant with NSFR requirements?",
        "What's our current leverage ratio?"
      ];
    } else if (query.includes('transfer') || query.includes('interbank')) {
      newSuggestions = [
        "Show pending interbank transfers",
        "What's our largest correspondent banking relationship?",
        "Any failed transfers in the last week?",
        "What's our average daily settlement volume?"
      ];
    } else if (query.includes('capital') || query.includes('allocation')) {
      newSuggestions = [
        "Show capital allocation by business unit",
        "What's our best performing business unit by ROAC?",
        "How much capital is allocated to treasury operations?",
        "What's our capital efficiency across business lines?"
      ];
    } else {
      // General suggestions
      newSuggestions = [
        "Show me our key risk metrics",
        "What's our most urgent treasury priority?",
        "Compare our current position to last quarter",
        "Generate a treasury executive summary"
      ];
    }
    
    setSuggestedQueries(newSuggestions);
    setTimeout(() => {
      setShowSuggestions(true);
    }, 2000);
  };

  const generateTreasuryResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let responseContent = "";
    
    // Generate response based on user query
    if (lowerQuery.includes('liquidity') || lowerQuery.includes('lcr') || lowerQuery.includes('hqla')) {
      // Liquidity related query
      const liquidityMetrics = baselMetrics.filter(m => m.category === 'liquidity');
      const lcrMetric = liquidityMetrics.find(m => m.name.includes('LCR'));
      const hqlaMetric = liquidityMetrics.find(m => m.name.includes('HQLA'));
      
      responseContent = `Based on our current treasury positions, our liquidity metrics are as follows:

- Liquidity Coverage Ratio (LCR): ${lcrMetric ? `${lcrMetric.value.toFixed(2)}% (minimum requirement: ${lcrMetric.minimum}%)` : '128.5% (minimum requirement: 100%)'}
- High Quality Liquid Assets (HQLA): ${hqlaMetric ? `$${(hqlaMetric.value / 1_000_000_000).toFixed(2)}B` : '$32.7B'}
- Net Stable Funding Ratio (NSFR): 112.3% (minimum requirement: 100%)

Our liquidity position is currently ${liquidityMetrics.every(m => m.status === 'compliant') ? 'compliant with all regulatory requirements' : 'showing some stress in certain metrics'}. Cash flow projections for the next 30 days indicate sufficient liquidity to meet all obligations.

Would you like to see our liquidity stress test results or our detailed liquidity breakdown by currency?`;
    } 
    else if (lowerQuery.includes('basel') || lowerQuery.includes('compliance') || lowerQuery.includes('regulatory') || lowerQuery.includes('report')) {
      // Basel/Compliance related query
      const capitalMetrics = baselMetrics.filter(m => m.category === 'capital');
      const leverageMetrics = baselMetrics.filter(m => m.category === 'leverage');
      const upcomingReports = regulatoryReports.filter(r => 
        r.status !== 'submitted' && r.status !== 'accepted' &&
        r.dueDate > new Date() && 
        r.dueDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      );
      
      responseContent = `Our Basel III compliance status is currently ${baselMetrics.every(m => m.status === 'compliant') ? 'fully compliant' : 'partially compliant with some metrics under close monitoring'}.

Key metrics:
- CET1 Capital Ratio: ${capitalMetrics[0]?.value.toFixed(2)}% (minimum: ${capitalMetrics[0]?.minimum}%)
- Tier 1 Capital Ratio: ${capitalMetrics[1]?.value.toFixed(2)}% (minimum: ${capitalMetrics[1]?.minimum}%)
- Leverage Ratio: ${leverageMetrics[0]?.value.toFixed(2)}% (minimum: ${leverageMetrics[0]?.minimum}%)

Upcoming regulatory reports (next 30 days): ${upcomingReports.length}
${upcomingReports.slice(0, 3).map(r => `- ${r.name} due on ${r.dueDate.toLocaleDateString()} (${r.status})`).join('\n')}

Would you like to see our full regulatory calendar, detailed capital metrics, or stress test results?`;
    } 
    else if (lowerQuery.includes('transfer') || lowerQuery.includes('interbank') || lowerQuery.includes('correspondent')) {
      // Interbank transfers related query
      const pendingTransfers = interBankTransfers.filter(t => t.status === 'pending' || t.status === 'processing');
      const recentTransfers = interBankTransfers.slice(0, 5);
      
      responseContent = `I've analyzed our interbank transfer activity:

Pending transfers: ${pendingTransfers.length}
Recently completed transfers: ${interBankTransfers.filter(t => t.status === 'completed').length}
Transfer volume (last 7 days): $${(interBankTransfers.reduce((sum, t) => sum + (t.status === 'completed' ? t.amount : 0), 0) / 1_000_000).toFixed(2)}M

Recent significant transfers:
${recentTransfers.map(t => `- ${t.fromBank} to ${t.toBank}: $${(t.amount / 1_000_000).toFixed(2)}M (${t.status})`).join('\n')}

Would you like to see transfer network visualization, correspondent bank exposures, or failed transfer analysis?`;
    } 
    else if (lowerQuery.includes('capital') || lowerQuery.includes('allocation') || lowerQuery.includes('business unit')) {
      // Capital allocation related query
      responseContent = `Our capital allocation across business units is currently as follows:

- Retail Banking: $5.2B (ROAC: 14.5%)
- Corporate Banking: $6.7B (ROAC: 16.8%)
- Investment Banking: $4.5B (ROAC: 19.5%)
- Asset Management: $1.8B (ROAC: 22.0%)
- Wealth Management: $1.2B (ROAC: 20.5%)
- Treasury Operations: $3.5B (ROAC: 13.2%)

Total allocated capital: $22.9B
Risk-weighted assets: $150B
Average return on allocated capital: 17.3%

Would you like to see capital efficiency analysis, risk-adjusted returns by business unit, or capital optimization recommendations?`;
    }
    else if (lowerQuery.includes('stress test') || lowerQuery.includes('scenario')) {
      // Stress test related query
      responseContent = `Our latest stress tests show the following impacts across multiple scenarios:

1. Rapid Rate Increase (100bps): 
   - NII impact: -$1.2B over 12 months
   - Capital impact: -45bps on CET1 ratio
   - Probability: 15%

2. Severe Market Stress (1-in-10 year event):
   - LCR impact: -28% (to 101%)
   - Trading book impact: -$780M
   - Probability: 8%

3. Operational Risk Event: 
   - Expected loss: $350M
   - Capital impact: -25bps on CET1 ratio
   - Probability: 12%

All scenarios maintain regulatory compliance, though scenario #2 brings LCR close to the regulatory minimum. Would you like to see detailed scenario assumptions or specific business unit impacts?`;
    }
    else {
      // General treasury operations query
      responseContent = `As your Treasury Operations Assistant, I can provide insights across several key areas:

1. Liquidity Management: Our current LCR is 128.5% with $32.7B in HQLA. Cash forecasting shows sufficient coverage for all obligations through Q3.

2. Regulatory Status: We're fully compliant with Basel III requirements with a CET1 ratio of 13.5%, well above the 7% minimum.

3. Interbank Activity: We have ${interBankTransfers.filter(t => t.status === 'pending' || t.status === 'processing').length} pending transfers and completed ${interBankTransfers.filter(t => t.status === 'completed').length} in the last period.

4. Capital Allocation: Our $22.9B capital is allocated across business units with an average ROAC of 17.3%.

5. Upcoming Obligations: ${regulatoryReports.filter(r => r.status !== 'submitted' && r.status !== 'accepted' && r.dueDate > new Date()).length} regulatory reports are due in the coming weeks.

What specific area would you like to explore further?`;
    }
    
    // Add agent response
    addMessageToChatThread('treasury-ops', {
      sender: 'agent',
      content: responseContent,
      agentType: 'treasury'
    });
  };
  
  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-indigo-50">
        <h3 className="font-medium text-indigo-900 flex items-center">
          <Bot className="w-5 h-5 mr-2 text-indigo-600" />
          Treasury Operations Assistant
        </h3>
        <p className="text-xs text-indigo-700">
          I'll help you with liquidity monitoring, capital planning, and regulatory compliance
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
      
      {/* Suggested queries */}
      {showSuggestions && suggestedQueries.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">Suggested queries:</p>
            <button onClick={() => setShowSuggestions(false)} className="text-xs text-gray-400 hover:text-gray-600">
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query, index) => (
              <button 
                key={index}
                className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
                onClick={() => handleSuggestedQuery(query)}
              >
                {query.length > 40 ? query.substring(0, 40) + '...' : query}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask about liquidity positions, regulatory compliance, or capital metrics..."
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
            onClick={() => setInput("What's our current liquidity position?")}
          >
            <BarChart className="h-3 w-3 mr-1" />
            Liquidity overview
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Show upcoming regulatory reports")}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Regulatory deadlines
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("What is our current Basel III compliance status?")}
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Basel III compliance
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Summarize recent interbank transfers")}
          >
            <Landmark className="h-3 w-3 mr-1" />
            Recent transfers
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Run a liquidity stress test scenario")}
          >
            <Activity className="h-3 w-3 mr-1" />
            Run stress test
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
            onClick={() => setInput("Show capital allocation by business unit")}
          >
            <Briefcase className="h-3 w-3 mr-1" />
            Business units
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreasuryAgentChat;