import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Send, Bot, User, Upload, CheckCircle2, XCircle, AlertTriangle, Timer, BarChart, Calendar, DollarSign, Landmark } from 'lucide-react';

const TreasuryAgentChat: React.FC = () => {
  const { 
    chatThreads, 
    addMessageToChatThread, 
    addAuditEvent,
    treasuryPositions,
    interBankTransfers,
    regulatoryReports
  } = useBankingContext();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
    
    // Log to audit trail
    addAuditEvent('Treasury Ops', `User query: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
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
        
        {/* Sample queries */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Sample queries:</p>
          <div className="flex flex-wrap gap-2">
            <button 
              className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors flex items-center"
              onClick={() => setInput("What is our current liquidity position?")}
            >
              <BarChart className="h-3 w-3 mr-1" />
              Current liquidity
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryAgentChat;