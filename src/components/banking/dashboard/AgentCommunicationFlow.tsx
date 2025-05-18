import React, { useEffect, useState, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Bot, ArrowRight, MessageSquare, Clock } from 'lucide-react';

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
}

const AgentCommunicationFlow: React.FC = () => {
  const { auditTrail } = useBankingContext();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate simulated agent-to-agent messages based on audit trail
  useEffect(() => {
    // Only process new audit trail entries
    if (auditTrail.length > 0) {
      const latestEvent = auditTrail[auditTrail.length - 1];
      
      // For demonstration, generate agent messages based on specific audit events
      if (latestEvent.event.includes('User Message')) {
        // User message received, simulate onboarding agent processing it
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-1`,
            from: 'OnboardingAgent',
            to: 'System',
            content: 'Processing user input: analyzing intent and extracting entities',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 800);
        
        // Then simulate agent decision-making
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-2`,
            from: 'OnboardingAgent',
            to: 'DocumentAgent',
            content: 'User intent detected: document verification required',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 1600);
        
        // Document agent response
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'DocumentAgent',
            to: 'OnboardingAgent',
            content: 'Preparing document verification request',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 2400);
      } 
      else if (latestEvent.event.includes('Document') || latestEvent.event.includes('Upload')) {
        // Document event, simulate document processing workflow
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-1`,
            from: 'DocumentAgent',
            to: 'System',
            content: 'Document received: initiating OCR and validation',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 800);
        
        // Document validation
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-2`,
            from: 'DocumentAgent',
            to: 'KYCAgent',
            content: 'Document validated: forwarding for KYC verification',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 1800);
        
        // KYC agent processing
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'KYCAgent',
            to: 'System',
            content: 'Running identity verification checks against databases',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 2600);
        
        // KYC agent result
        setTimeout(() => {
          const success = Math.random() > 0.2; // 80% success rate
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-4`,
            from: 'KYCAgent',
            to: 'AccountAgent',
            content: success 
              ? 'KYC verification passed: customer cleared for account opening' 
              : 'KYC verification flags detected: manual review required',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }, 3400);
      }
    }
  }, [auditTrail]);
  
  // Remove older messages to keep the list manageable
  useEffect(() => {
    if (messages.length > 10) {
      setMessages(prev => prev.slice(-10));
    }
    
    // Auto-scroll to the most recent message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Get agent color
  const getAgentColor = (agentName: string) => {
    switch (agentName) {
      case 'OnboardingAgent':
        return 'bg-blue-100 text-blue-800';
      case 'DocumentAgent':
        return 'bg-amber-100 text-amber-800';
      case 'KYCAgent':
        return 'bg-indigo-100 text-indigo-800';
      case 'AccountAgent':
        return 'bg-green-100 text-green-800';
      case 'System':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-indigo-600" />
          Agent Communication Flow
        </h3>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1 text-green-500" />
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>
      
      <div className="p-4 max-h-64 overflow-y-auto" style={{ minHeight: '256px' }}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Bot className="h-8 w-8 mb-2" />
            <p className="text-sm">No agent communications yet</p>
            <p className="text-xs mt-1">Interact with the system to see agents communicate</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(message => (
              <div 
                key={message.id}
                className="flex items-start animate-fade-in-right"
              >
                <div className="mr-2 flex-shrink-0">
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${getAgentColor(message.from)}`}>
                    <Bot className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <p className={`text-xs font-medium ${getAgentColor(message.from).split(' ')[1]}`}>
                      {message.from}
                    </p>
                    <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                    <p className={`text-xs font-medium ${getAgentColor(message.to).split(' ')[1]}`}>
                      {message.to}
                    </p>
                    <span className="ml-auto text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg text-sm ${
                    message.content.includes('error') || message.content.includes('failed') 
                      ? 'bg-red-50 border border-red-100' 
                      : message.content.includes('passed') || message.content.includes('success') 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-gray-50 border border-gray-200'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCommunicationFlow;