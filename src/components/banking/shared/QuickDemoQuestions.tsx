import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { MessageSquare, PanelLeft, ChevronUp, ChevronDown, Sparkles, PlayCircle } from 'lucide-react';
import { ConversationType } from '../conversations/AccountOpeningConversations';
import { accountOpeningConversations } from '../conversations/AccountOpeningConversations';
import { creditCardConversations } from '../conversations/CreditCardConversations';
import { loanConversations } from '../conversations/LoanConversations';
import { fraudDetectionConversations } from '../conversations/FraudDetectionConversations';
import ConversationPlayer from './ConversationPlayer';

interface QuickDemoQuestionsProps {
  mode: 'account-opening' | 'credit-card' | 'loan' | 'fraud-detection';
  collapsed?: boolean;
}

const QuickDemoQuestions: React.FC<QuickDemoQuestionsProps> = ({ 
  mode, 
  collapsed = false 
}) => {
  const { addAuditEvent } = useBankingContext();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>([]);

  // Set available conversations based on mode
  useEffect(() => {
    switch(mode) {
      case 'account-opening':
        setConversations(accountOpeningConversations);
        break;
      case 'credit-card':
        setConversations(creditCardConversations);
        break;
      case 'loan':
        setConversations(loanConversations);
        break;
      case 'fraud-detection':
        setConversations(fraudDetectionConversations);
        break;
      default:
        setConversations([]);
    }
  }, [mode]);

  const handleQuestionClick = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    addAuditEvent('Demo Started', `User started conversation demo: ${conversation.title}`);
  };

  const handleDemoComplete = () => {
    addAuditEvent('Demo Completed', `Conversation demo completed: ${selectedConversation?.title}`);
  };

  const handleDemoCancel = () => {
    setSelectedConversation(null);
    addAuditEvent('Demo Cancelled', `Conversation demo cancelled: ${selectedConversation?.title}`);
  };

  // If showing a specific conversation, render the player
  if (selectedConversation) {
    return (
      <ConversationPlayer 
        conversation={selectedConversation}
        onComplete={handleDemoComplete}
        onCancel={handleDemoCancel}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div 
        className="p-3 bg-indigo-50 border-b border-indigo-100 cursor-pointer flex justify-between items-center"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
          <div>
            <h3 className="font-medium text-indigo-900">Demo Conversations</h3>
            <p className="text-xs text-indigo-700">Click to see common questions</p>
          </div>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition-colors">
          {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="p-3">
          <p className="text-sm text-gray-600 mb-3">
            Select a conversation to see a demonstration of AI-powered responses:
          </p>
          
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className="flex items-center p-3 border border-gray-200 hover:border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors"
                onClick={() => handleQuestionClick(conversation)}
              >
                <div className="mr-3 bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                  <PlayCircle className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{conversation.title}</p>
                  <p className="text-xs text-gray-500 truncate">{conversation.description}</p>
                </div>
                
                <div className="ml-2 flex items-center text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>Interactive Demo</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-start">
            <PanelLeft className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600">These interactive demos showcase common customer conversations. Click any question to see how the AI assistant would handle the interaction.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickDemoQuestions;