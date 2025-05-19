import React, { useState, useEffect, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Bot, User, Play, PauseCircle, RotateCcw, CheckCircle, MessageSquare, FastForward } from 'lucide-react';
import { ConversationType, MessageType } from '../conversations/AccountOpeningConversations';

interface ConversationPlayerProps {
  conversation: ConversationType;
  onComplete?: () => void;
  onCancel?: () => void;
  autoPlayDelay?: number; // delay between messages in ms
}

const ConversationPlayer: React.FC<ConversationPlayerProps> = ({
  conversation,
  onComplete,
  onCancel,
  autoPlayDelay = 800, // default delay between messages
}) => {
  const { addMessageToChatThread, addAuditEvent } = useBankingContext();
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(-1);
  const [displayedMessages, setDisplayedMessages] = useState<MessageType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [messageQueue, setMessageQueue] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when conversation changes
    setCurrentMessageIndex(-1);
    setDisplayedMessages([]);
    setIsPlaying(false);
    setIsComplete(false);
    setMessageQueue([]);
  }, [conversation]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isPlaying && messageQueue.length > 0) {
      const nextMessageIndex = messageQueue[0];
      const message = conversation.messages[nextMessageIndex];
      const delay = message.delay || autoPlayDelay;
      
      timer = setTimeout(() => {
        displayMessage(nextMessageIndex);
        setMessageQueue(prev => prev.slice(1)); // Remove the processed message from queue
      }, delay);
    } else if (isPlaying && currentMessageIndex >= conversation.messages.length - 1) {
      setIsPlaying(false);
      setIsComplete(true);
      if (onComplete) onComplete();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, messageQueue, currentMessageIndex, conversation.messages, autoPlayDelay, onComplete]);

  const startPlayback = () => {
    if (isComplete) {
      // Restart if completed
      resetConversation();
      return;
    }
    
    setIsPlaying(true);
    
    // If we haven't started or are at the beginning, queue all messages
    if (currentMessageIndex < 0) {
      // Start with first message immediately
      displayMessage(0);
      // Queue the rest
      const remainingIndices = Array.from(
        { length: conversation.messages.length - 1 }, 
        (_, i) => i + 1
      );
      setMessageQueue(remainingIndices);
    } 
    // If we're in the middle, queue remaining messages
    else if (currentMessageIndex < conversation.messages.length - 1) {
      const remainingIndices = Array.from(
        { length: conversation.messages.length - currentMessageIndex - 1 }, 
        (_, i) => currentMessageIndex + i + 1
      );
      setMessageQueue(remainingIndices);
    }
  };

  const pausePlayback = () => {
    setIsPlaying(false);
  };

  const resetConversation = () => {
    setCurrentMessageIndex(-1);
    setDisplayedMessages([]);
    setIsPlaying(false);
    setIsComplete(false);
    setMessageQueue([]);
    
    // Log reset to audit trail
    addAuditEvent('Demo Reset', `Conversation demo "${conversation.title}" was reset`);
  };

  const skipToEnd = () => {
    // Show all messages immediately
    setDisplayedMessages([...conversation.messages]);
    setCurrentMessageIndex(conversation.messages.length - 1);
    setIsPlaying(false);
    setIsComplete(true);
    setMessageQueue([]);
    
    if (onComplete) onComplete();
    
    // Log skip to audit trail
    addAuditEvent('Demo Completed', `Conversation demo "${conversation.title}" was skipped to end`);
  };

  const displayMessage = (index: number) => {
    if (index < 0 || index >= conversation.messages.length) return;
    
    const message = conversation.messages[index];
    
    // Add to displayed messages
    setDisplayedMessages(prev => [...prev, message]);
    setCurrentMessageIndex(index);
    
    // Add to actual chat thread if this is a real chat message
    if (message.sender === 'user') {
      addAuditEvent('User Message', `Demo user sent message: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`);
    } else if (message.sender === 'agent') {
      addAuditEvent('Agent Response', `Demo agent sent message: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
          <div>
            <h3 className="font-medium text-indigo-900">{conversation.title}</h3>
            <p className="text-xs text-indigo-700">{conversation.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isComplete ? (
            <div className="flex items-center text-green-600 text-xs">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Completed</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              {currentMessageIndex >= 0 ? 
                `${currentMessageIndex + 1}/${conversation.messages.length}` : 
                'Ready to play'}
            </div>
          )}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="p-4 h-80 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {displayedMessages.map((message, index) => (
            <div
              key={index}
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
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString([], { 
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
          <div ref={messagesEndRef} />
        </div>
        
        {/* Empty state */}
        {displayedMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="h-12 w-12 mb-2" />
            <p className="text-sm mb-1">Press play to start the conversation demo</p>
            <p className="text-xs">{conversation.messages.length} messages in this demo</p>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-center gap-3">
          <button
            onClick={resetConversation}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Reset conversation"
            disabled={isPlaying}
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          {isPlaying ? (
            <button
              onClick={pausePlayback}
              className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors"
              title="Pause"
            >
              <PauseCircle className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={startPlayback}
              className={`p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors ${
                isComplete ? 'animate-pulse' : ''
              }`}
              title={isComplete ? "Restart conversation" : "Play conversation"}
            >
              <Play className={`h-6 w-6 ${isComplete ? 'fill-indigo-600' : ''}`} />
            </button>
          )}
          
          <button
            onClick={skipToEnd}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Skip to end"
            disabled={isPlaying || isComplete}
          >
            <FastForward className="h-5 w-5" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300"
              style={{ 
                width: `${
                  conversation.messages.length === 0 
                  ? 0 
                  : ((currentMessageIndex + 1) / conversation.messages.length) * 100
                }%` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Close Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPlayer;