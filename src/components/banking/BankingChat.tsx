import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { Send, Bot, User, Upload, CheckCircle2, XCircle, AlertTriangle, Timer, FileX, FileText, Camera } from 'lucide-react';
import { BankingMode, Document, DocumentAttachment } from '../../types/banking';

interface BankingChatProps {
  mode: BankingMode;
  standalone?: boolean;
  onRequestDocumentVerification?: (documentType: string) => void;
}

const BankingChat: React.FC<BankingChatProps> = ({ 
  mode,
  standalone = true,
  onRequestDocumentVerification
}) => {
  const { 
    chatThreads, 
    addMessageToChatThread, 
    addDocument, 
    documents, 
    addAuditEvent,
    setActiveTab
  } = useBankingContext();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fileUploading, setFileUploading] = useState<DocumentAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const chatThread = chatThreads[mode];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThread?.messages]);

  // Initialize chat with a welcome message if empty
  useEffect(() => {
    if (chatThread && chatThread.messages.length === 0) {
      let initialMessage = '';
      let agentType: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan' = 'onboarding';
      
      switch (mode) {
        case 'account-opening':
          initialMessage = "Hello! I'm your Account Opening Assistant. I'll guide you through the process of opening a new bank account with us. To get started, could you tell me what type of account you're interested in? We offer checking and savings accounts with various features.";
          agentType = 'onboarding';
          break;
        case 'credit-card':
          initialMessage = "Welcome! I'm your Credit Card Assistant. I can help you apply for a credit card that fits your needs and financial profile. To get started, I'll need to gather some information about you. What type of credit card are you interested in? We offer standard, premium, and secured options with different rewards and benefits.";
          agentType = 'credit';
          break;
        case 'loan':
          initialMessage = "Hello! I'm your Loan Assistant. I'll help you apply for a loan and guide you through the process. To begin, could you tell me what type of loan you're interested in? We offer personal loans, home loans, and auto loans with competitive rates.";
          agentType = 'loan';
          break;
      }
      
      addMessageToChatThread(mode, {
        sender: 'agent',
        content: initialMessage,
        agentType
      });
    }
  }, [mode, chatThread?.messages.length, addMessageToChatThread]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    addMessageToChatThread(mode, {
      sender: 'user',
      content: input,
    });
    
    setInput('');
    setIsTyping(true);
    
    // Log to audit trail
    addAuditEvent('Chat Message', `User sent message in ${mode} workflow: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`);
    
    // If message contains words related to documents, suggest document verification tab
    if (input.toLowerCase().includes('document') || 
        input.toLowerCase().includes('upload') || 
        input.toLowerCase().includes('id') || 
        input.toLowerCase().includes('license') || 
        input.toLowerCase().includes('passport') ||
        input.toLowerCase().includes('verify')) {
      
      setTimeout(() => {
        addMessageToChatThread(mode, {
          sender: 'agent',
          content: `I'll need to verify your identity to proceed with your ${mode.replace('-', ' ')} application. Please click on the "Document Verification" tab to securely upload your identification document.`,
          agentType: 'document'
        });
        
        setIsTyping(false);
      }, 1500);
    } else {
      // Regular message flow
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Determine document type based on context/conversation or let user specify
    // For simplicity, we'll use a fixed type based on the workflow
    let documentType: Document['type'];
    
    switch (mode) {
      case 'account-opening':
        documentType = 'id';
        break;
      case 'credit-card':
        documentType = 'pay-stub';
        break;
      case 'loan':
        documentType = 'tax-return';
        break;
      default:
        documentType = 'id';
    }
    
    // If we have an onRequestDocumentVerification handler, use it instead
    if (onRequestDocumentVerification) {
      onRequestDocumentVerification(documentType);
      return;
    }
    
    // Create attachment for the message
    const attachment: DocumentAttachment = {
      id: `attach-${Date.now()}`,
      documentType,
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'uploading'
    };
    
    setFileUploading(attachment);
    
    // Add message with attachment
    addMessageToChatThread(mode, {
      sender: 'user',
      content: `I'm uploading my ${documentType.replace('-', ' ')}.`,
      attachments: [attachment]
    });
    
    // Log to audit trail
    addAuditEvent('Document Upload', `User uploaded ${documentType} document: ${file.name}`);
    
    // Simulate file upload and processing
    setTimeout(() => {
      // Update attachment status
      setFileUploading(prev => prev ? { ...prev, status: 'processing' } : null);
      
      // Add document to the system
      addDocument({
        type: documentType,
        status: 'pending',
        path: URL.createObjectURL(file), // This creates a temporary URL for the file
        metadata: {
          filename: file.name,
          size: file.size,
          type: file.type
        }
      });
      
      // Simulate processing time
      setTimeout(() => {
        // Processing complete
        setFileUploading(null);
        
        // Add agent response about the document
        addMessageToChatThread(mode, {
          sender: 'agent',
          content: `Thank you for uploading your ${documentType.replace('-', ' ')}. I'm reviewing it now. This typically takes just a few moments.`,
          agentType: 'document'
        });
        
        // Simulate document verification after a delay
        setTimeout(() => {
          // Verification result (simulated - 90% success rate)
          const isVerified = Math.random() > 0.1;
          
          addMessageToChatThread(mode, {
            sender: 'agent',
            content: isVerified 
              ? `Your ${documentType.replace('-', ' ')} has been successfully verified! We'll use this information to continue with your ${mode.replace('-', ' ')} application.` 
              : `I'm having some trouble verifying your ${documentType.replace('-', ' ')}. The image quality may not be clear enough. Could you please try uploading it again?`,
            agentType: 'document'
          });
          
          if (isVerified) {
            // Proceed with next steps based on workflow
            setTimeout(() => {
              let nextStepMessage = '';
              let nextAgentType: 'onboarding' | 'document' | 'kyc-aml' | 'account' | 'credit' | 'loan' = 'onboarding';
              
              switch (mode) {
                case 'account-opening':
                  nextStepMessage = "Now that your ID is verified, I need to collect some personal information to complete your account application. Could you please provide your full name, date of birth, and current address?";
                  nextAgentType = 'onboarding';
                  break;
                case 'credit-card':
                  nextStepMessage = "Thank you for verifying your income. Based on the information you've provided, I can now evaluate your credit card application. I'll need to ask a few more questions about your existing debt obligations and monthly expenses. Is that okay?";
                  nextAgentType = 'credit';
                  break;
                case 'loan':
                  nextStepMessage = "With your tax return verified, I now have a better understanding of your income. For your loan application, I'll need to know about your existing debt obligations and the specific purpose of this loan. Could you share those details with me?";
                  nextAgentType = 'loan';
                  break;
              }
              
              addMessageToChatThread(mode, {
                sender: 'agent',
                content: nextStepMessage,
                agentType: nextAgentType
              });
            }, 1000);
          }
        }, 2000);
      }, 3000);
    }, 2000);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    // If we have an onRequestDocumentVerification handler, use it instead of file input
    if (onRequestDocumentVerification) {
      let documentType: Document['type'] = 'id';
      
      switch (mode) {
        case 'account-opening':
          documentType = 'id';
          break;
        case 'credit-card':
          documentType = 'pay-stub';
          break;
        case 'loan':
          documentType = 'tax-return';
          break;
      }
      
      onRequestDocumentVerification(documentType);
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const openDocumentVerification = () => {
    // Navigate to document verification tab
    setActiveTab('document-verification');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Chat header */}
      <div className="border-b border-gray-200 px-4 py-3 bg-indigo-50">
        <h3 className="font-medium text-indigo-900 flex items-center">
          <Bot className="w-5 h-5 mr-2 text-indigo-600" />
          {mode === 'account-opening' ? 'Account Opening Assistant' : 
           mode === 'credit-card' ? 'Credit Card Assistant' : 
           'Loan Assistant'}
        </h3>
        <p className="text-xs text-indigo-700">
          {mode === 'account-opening' ? 'I\'ll guide you through opening a new bank account' : 
           mode === 'credit-card' ? 'I\'ll help you apply for a credit card' : 
           'I\'ll help you with your loan application'}
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
                <p className="text-sm">{message.content}</p>
                
                {/* If message contains document verification prompt, add action button */}
                {message.sender === 'agent' && message.content.includes('Document Verification') && (
                  <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end">
                    <button 
                      className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded flex items-center"
                      onClick={() => onRequestDocumentVerification && onRequestDocumentVerification('id')}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Verify Documents
                    </button>
                  </div>
                )}
                
                {/* Document attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    {message.attachments.map(attachment => (
                      <div 
                        key={attachment.id}
                        className="flex items-center text-xs mt-1"
                      >
                        {attachment.status === 'uploading' && (
                          <>
                            <Upload className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                            <span>Uploading {attachment.name}...</span>
                          </>
                        )}
                        {attachment.status === 'processing' && (
                          <>
                            <Timer className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                            <span>Processing {attachment.name}...</span>
                          </>
                        )}
                        {attachment.status === 'verified' && (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                            <span className="text-green-500">Verified: {attachment.name}</span>
                          </>
                        )}
                        {attachment.status === 'rejected' && (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
                            <span className="text-red-500">Rejected: {attachment.name}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
      
      {/* File upload input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleFileUpload}
      />
      
      {/* Chat input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={triggerFileUpload}
            className="p-2 rounded-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Upload document"
          >
            <Upload className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => onRequestDocumentVerification && onRequestDocumentVerification('id')}
            className="p-2 rounded-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Take photo"
          >
            <Camera className="h-5 w-5" />
          </button>
          
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your message..."
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
        
        {fileUploading && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            {fileUploading.status === 'uploading' && (
              <>
                <Upload className="h-4 w-4 text-indigo-500 mr-1 animate-pulse" />
                <span>Uploading {fileUploading.name}...</span>
              </>
            )}
            {fileUploading.status === 'processing' && (
              <>
                <Timer className="h-4 w-4 text-indigo-500 mr-1 animate-pulse" />
                <span>Processing {fileUploading.name}...</span>
              </>
            )}
          </div>
        )}
        
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-400">
            This is a demo - no real data is stored or processed
          </p>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <p className="text-xs text-gray-400">Agent is online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingChat;