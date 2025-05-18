import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { Send, Bot, User, Upload, CheckCircle2, XCircle, AlertTriangle, Timer, FileX, FileText, Camera, BarChart2, PieChart, TrendingUp, DollarSign, LineChart, ArrowRight } from 'lucide-react';
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
  const [showVisualization, setShowVisualization] = useState<string | null>(null);
  const [needMoreInfo, setNeedMoreInfo] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
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
          setSuggestedQuestions([
            "What types of checking accounts do you offer?",
            "What are the fees for savings accounts?",
            "What documents do I need to open an account?"
          ]);
          break;
        case 'credit-card':
          initialMessage = "Welcome! I'm your Credit Card Assistant. I can help you apply for a credit card that fits your needs and financial profile. To get started, I'll need to gather some information about you. What type of credit card are you interested in? We offer standard, premium, and secured options with different rewards and benefits.";
          agentType = 'credit';
          setSuggestedQuestions([
            "What are the different rewards programs?",
            "Do you offer cards with no annual fee?",
            "What credit score do I need to qualify?"
          ]);
          break;
        case 'loan':
          initialMessage = "Hello! I'm your Loan Assistant. I'll help you apply for a loan and guide you through the process. To begin, could you tell me what type of loan you're interested in? We offer personal loans, home loans, and auto loans with competitive rates.";
          agentType = 'loan';
          setSuggestedQuestions([
            "What are the current interest rates?",
            "How much can I borrow for a personal loan?",
            "What documents will I need for a mortgage?"
          ]);
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
    setNeedMoreInfo(false);
    
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
      // Generate contextual responses based on user input
      const userInputLower = input.toLowerCase();
      
      // Create a more engaging multi-turn conversation
      setTimeout(() => {
        let response = '';
        let followUpQuestions: string[] = [];
        let visualization = null;
        
        if (mode === 'account-opening') {
          if (userInputLower.includes('checking') || userInputLower.includes('account type')) {
            response = "We offer several checking account options to meet your needs:\n\n1. **Basic Checking** - No monthly fee with direct deposit\n2. **Premium Checking** - Higher interest rates and additional benefits for maintaining a $5,000 minimum balance\n3. **Student Checking** - No minimum balance requirements and no monthly fees for students\n\nWhich one sounds most appropriate for your banking needs?";
            visualization = 'account-comparison';
            followUpQuestions = [
              "What are the interest rates for Premium Checking?",
              "Are there any sign-up bonuses?",
              "Can I open an account online?"
            ];
          } else if (userInputLower.includes('fee') || userInputLower.includes('charge') || userInputLower.includes('cost')) {
            response = "Our Basic Checking account has no monthly maintenance fee when you set up direct deposit of at least $500 per month. Otherwise, there's a $5 monthly fee that can also be waived by maintaining a daily balance of $1,500 or more. Our Premium Checking has a $12 monthly fee that's waived with a $5,000 minimum daily balance. Would you like me to explain any specific fees in more detail?";
            visualization = 'fee-comparison';
            followUpQuestions = [
              "Are there any ATM fees?",
              "What about overdraft fees?",
              "Do you offer fee waivers for seniors?"
            ];
          } else if (userInputLower.includes('interest') || userInputLower.includes('rate') || userInputLower.includes('apy')) {
            response = "Our current interest rates are:\n\n- Basic Checking: 0.01% APY\n- Premium Checking: 0.05% APY\n- Money Market Savings: up to 0.15% APY (tiered based on balance)\n- High-Yield Savings: up to 0.50% APY\n\nInterest rates are variable and subject to change. Would you like information about our Certificate of Deposit rates as well?";
            visualization = 'interest-rates';
            followUpQuestions = [
              "What's the minimum deposit for high-yield savings?",
              "How often is interest compounded?",
              "Do rates change with Fed rate changes?"
            ];
          } else {
            response = "Thank you for your interest in opening an account with us. To provide you with the best recommendations, I'd like to understand your banking needs better. Are you primarily looking for a checking account for daily transactions, a savings account to grow your money, or perhaps both? Also, would features like mobile banking, branch access, or high interest rates be important to you?";
            setNeedMoreInfo(true);
            followUpQuestions = [
              "What are your most popular accounts?",
              "What documents do I need to open an account?",
              "Do you offer joint accounts?"
            ];
          }
        } else if (mode === 'credit-card') {
          if (userInputLower.includes('rewards') || userInputLower.includes('points') || userInputLower.includes('cashback')) {
            response = "We offer several reward structures depending on your preferences:\n\n1. **Cash Back Card** - 2% on all purchases, 3% on groceries and gas\n2. **Travel Rewards** - 2X points on travel and dining, 1X on everything else, with points transferable to airline and hotel partners\n3. **Premium Rewards** - 3X on your top spending category each month, 2X on dining, 1X on everything else\n\nHow do you typically spend each month? This helps me recommend the best card for your lifestyle.";
            visualization = 'rewards-comparison';
            followUpQuestions = [
              "Are there caps on cash back categories?",
              "Do points expire?",
              "What's the redemption value for travel points?"
            ];
          } else if (userInputLower.includes('interest') || userInputLower.includes('apr')) {
            response = "Our credit card interest rates (APRs) currently range from 14.99% to 24.99% based on your creditworthiness. For qualified applicants, we also offer a 0% introductory APR on purchases and balance transfers for the first 15 months. After the introductory period, the standard APR will apply. Would you like to know more about how we determine your rate?";
            visualization = 'apr-explainer';
            followUpQuestions = [
              "What factors determine my APR?",
              "Can my rate increase after approval?",
              "Do you offer fixed-rate cards?"
            ];
          } else if (userInputLower.includes('limit') || userInputLower.includes('credit line')) {
            response = "Credit limits are personalized based on several factors including your credit score, income, existing debt obligations, and credit history. For our cards, initial limits typically range from $500 for secured cards to $25,000+ for premium cards with excellent credit. After establishing a positive payment history, you may become eligible for credit line increases. Would you like to discuss what might influence your specific credit limit?";
            visualization = 'credit-limit-factors';
            followUpQuestions = [
              "How often can I request limit increases?",
              "Will checking my limit affect my credit score?",
              "What's the average limit for new customers?"
            ];
          } else {
            response = "Thanks for your interest in our credit card offerings. To help find the perfect card for you, could you share a bit about what you're looking for? Are you interested in cash back, travel rewards, or perhaps a low interest rate? Also, do you have a particular credit score range we should consider in our recommendation?";
            setNeedMoreInfo(true);
            followUpQuestions = [
              "What's your most popular credit card?",
              "Do you have any special offers right now?",
              "What's the application process like?"
            ];
          }
        } else if (mode === 'loan') {
          if (userInputLower.includes('rate') || userInputLower.includes('interest')) {
            response = "Our current interest rates vary by loan type and term:\n\n**Personal Loans**: 7.99% - 15.99% APR\n**Auto Loans**: 4.49% - 8.99% APR\n**Home Loans**: 6.25% - 7.75% APR (30-year fixed)\n                    5.75% - 7.25% APR (15-year fixed)\n\nThese rates depend on your credit score, loan amount, term length, and other factors. Would you like to know what rate you might qualify for?";
            visualization = 'loan-rates';
            followUpQuestions = [
              "How do points affect my mortgage rate?",
              "Do you offer rate locks?",
              "What's the difference between fixed and variable rates?"
            ];
          } else if (userInputLower.includes('term') || userInputLower.includes('duration') || userInputLower.includes('length')) {
            response = "We offer flexible loan terms to fit your needs:\n\n- **Personal Loans**: 1-7 years\n- **Auto Loans**: 2-7 years\n- **Home Loans**: 10, 15, 20, or 30 years\n\nShorter terms typically mean higher monthly payments but less total interest paid over the life of the loan. Longer terms reduce your monthly payment but increase the total interest cost. What term length are you considering?";
            visualization = 'term-comparison';
            followUpQuestions = [
              "How much would my payments be for different terms?",
              "Can I pay off my loan early without penalties?",
              "Do you offer custom term lengths?"
            ];
          } else if (userInputLower.includes('amount') || userInputLower.includes('borrow') || userInputLower.includes('how much')) {
            response = "The amount you can borrow depends on several factors including your income, credit score, existing debt obligations, and the type of loan:\n\n- **Personal Loans**: $1,000 - $50,000\n- **Auto Loans**: Up to 100% of the vehicle's value\n- **Home Loans**: Typically up to 80-97% of the property value, depending on the loan program\n\nWould you like me to help estimate how much you might qualify for based on your specific situation?";
            visualization = 'borrowing-power';
            followUpQuestions = [
              "What's the debt-to-income ratio you look for?",
              "How does my credit score affect my borrowing limit?",
              "What documentation will I need to provide?"
            ];
          } else {
            response = "I appreciate your interest in our loan products. To provide you with the most relevant information, could you tell me which type of loan you're considering (personal, auto, or home), and what your primary concerns are? For example, are you most interested in understanding rates, loan amounts, or the application process?";
            setNeedMoreInfo(true);
            followUpQuestions = [
              "What are the current mortgage rates?",
              "How long does the approval process take?",
              "Are there any loan fees I should know about?"
            ];
          }
        }
        
        addMessageToChatThread(mode, {
          sender: 'agent',
          content: response,
          agentType: mode === 'account-opening' ? 'onboarding' : mode === 'credit-card' ? 'credit' : 'loan'
        });
        
        setIsTyping(false);
        setShowVisualization(visualization);
        setSuggestedQuestions(followUpQuestions);
        
        // If we need more information, ask a follow-up question after a brief delay
        if (needMoreInfo) {
          setTimeout(() => {
            setIsTyping(true);
            
            setTimeout(() => {
              let followUpQuestion = '';
              
              if (mode === 'account-opening') {
                followUpQuestion = "To better assist you, could you tell me a bit more about how you plan to use your account? For example, will this be your primary bank account? Do you make frequent deposits and withdrawals?";
              } else if (mode === 'credit-card') {
                followUpQuestion = "To help find the right card for you, could you share what's most important to you in a credit card? Is it rewards, low interest rates, no annual fee, or something else?";
              } else if (mode === 'loan') {
                followUpQuestion = "To provide you with the most accurate information, could you share approximately how much you're looking to borrow and what timeframe you're considering for repayment?";
              }
              
              addMessageToChatThread(mode, {
                sender: 'agent',
                content: followUpQuestion,
                agentType: mode === 'account-opening' ? 'onboarding' : mode === 'credit-card' ? 'credit' : 'loan'
              });
              
              setIsTyping(false);
            }, 2000);
          }, 5000);
        }
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
                  setShowVisualization('verification-complete');
                  break;
                case 'credit-card':
                  nextStepMessage = "Thank you for verifying your income. Based on the information you've provided, I can now evaluate your credit card application. I'll need to ask a few more questions about your existing debt obligations and monthly expenses. Is that okay?";
                  nextAgentType = 'credit';
                  setShowVisualization('income-verified');
                  break;
                case 'loan':
                  nextStepMessage = "With your tax return verified, I now have a better understanding of your income. For your loan application, I'll need to know about your existing debt obligations and the specific purpose of this loan. Could you share those details with me?";
                  nextAgentType = 'loan';
                  setShowVisualization('tax-analysis');
                  break;
              }
              
              addMessageToChatThread(mode, {
                sender: 'agent',
                content: nextStepMessage,
                agentType: nextAgentType
              });
            }, 2000);
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
  
  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    
    // Simulate typing and then send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 500);
  };
  
  const openDocumentVerification = () => {
    // Navigate to document verification tab
    setActiveTab('document-verification');
  };

  // Renders a visualization based on the current context
  const renderVisualization = () => {
    if (!showVisualization) return null;
    
    switch (showVisualization) {
      case 'account-comparison':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" /> Account Type Comparison
            </h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Checking</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium Checking</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Checking</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2">Monthly Fee</td>
                    <td className="px-3 py-2">$5 (waivable)</td>
                    <td className="px-3 py-2">$12 (waivable)</td>
                    <td className="px-3 py-2">$0</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Minimum Balance</td>
                    <td className="px-3 py-2">$1,500 to waive fee</td>
                    <td className="px-3 py-2">$5,000 to waive fee</td>
                    <td className="px-3 py-2">$0</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Interest Rate</td>
                    <td className="px-3 py-2">0.01% APY</td>
                    <td className="px-3 py-2">0.05% APY</td>
                    <td className="px-3 py-2">0.01% APY</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">ATM Fee Reimbursement</td>
                    <td className="px-3 py-2">No</td>
                    <td className="px-3 py-2">Yes, up to $15/mo</td>
                    <td className="px-3 py-2">Yes, up to $5/mo</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Overdraft Protection</td>
                    <td className="px-3 py-2">Available</td>
                    <td className="px-3 py-2">Free</td>
                    <td className="px-3 py-2">Available</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'fee-comparison':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-indigo-500" /> Fee Structure Breakdown
            </h5>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Basic Checking Monthly Fee ($5)</span>
                  <span className="text-xs text-gray-500">Waived with $500 direct deposit</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-indigo-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Premium Checking Monthly Fee ($12)</span>
                  <span className="text-xs text-gray-500">Waived with $5,000 balance</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Overdraft Fee ($35)</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-red-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">ATM Fee ($2.50)</span>
                  <span className="text-xs text-gray-500">Free at in-network ATMs</span>
                </div>
                <div className="h-2.5 w-full bg-gray-200 rounded-full">
                  <div className="h-2.5 bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Our Premium Checking account offers the best overall value with more fee waivers and reimbursements.
            </p>
          </div>
        );
      
      case 'interest-rates':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" /> Current Interest Rate Comparison
            </h5>
            <div className="space-y-3">
              {[
                { name: 'Basic Checking', rate: 0.01 },
                { name: 'Premium Checking', rate: 0.05 },
                { name: 'Money Market Savings', rate: 0.15 },
                { name: 'High-Yield Savings', rate: 0.50 },
                { name: '12-Month CD', rate: 1.25 },
                { name: '5-Year CD', rate: 2.00 }
              ].map((account, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{account.name}</span>
                    <span className="text-xs font-medium text-indigo-600">{account.rate.toFixed(2)}% APY</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-indigo-500 rounded-full" 
                      style={{ width: `${(account.rate / 2) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center mt-3 p-2 bg-blue-50 text-xs text-blue-700 rounded">
              <InfoIcon className="h-3.5 w-3.5 mr-1.5" />
              <p>Rates effective as of today and subject to change without notice. $1,000 minimum to open CDs.</p>
            </div>
          </div>
        );

      case 'rewards-comparison':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" /> Rewards Program Comparison
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-2">Cash Back Card</h6>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">General Purchases</span>
                    <span className="text-xs font-medium">2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Groceries & Gas</span>
                    <span className="text-xs font-medium">3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Annual Fee</span>
                    <span className="text-xs font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Sign-up Bonus</span>
                    <span className="text-xs font-medium">$200</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">Best for everyday spending</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-2">Travel Rewards</h6>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">General Purchases</span>
                    <span className="text-xs font-medium">1X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Travel & Dining</span>
                    <span className="text-xs font-medium">2X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Annual Fee</span>
                    <span className="text-xs font-medium">$95</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Sign-up Bonus</span>
                    <span className="text-xs font-medium">50,000 pts</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">Best for frequent travelers</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-2">Premium Rewards</h6>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">General Purchases</span>
                    <span className="text-xs font-medium">1X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Top Category</span>
                    <span className="text-xs font-medium">3X</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Annual Fee</span>
                    <span className="text-xs font-medium">$195</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Sign-up Bonus</span>
                    <span className="text-xs font-medium">75,000 pts</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">Best for high spenders</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'apr-explainer':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <LineChart className="h-4 w-4 mr-2 text-indigo-500" /> Understanding APR Impact
            </h5>
            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
              <p className="text-xs text-gray-700 mb-2">Interest paid over 1 year on $3,000 balance:</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Low APR (14.99%)</span>
                    <span className="text-xs font-medium text-green-600">$449.70</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">Medium APR (19.99%)</span>
                    <span className="text-xs font-medium text-amber-600">$599.70</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">High APR (24.99%)</span>
                    <span className="text-xs font-medium text-red-600">$749.70</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-red-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              The APR (Annual Percentage Rate) directly impacts how much you'll pay in interest if you carry a balance. Paying your balance in full each month allows you to avoid interest charges altogether.
            </p>
          </div>
        );

      case 'credit-limit-factors':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-indigo-500" /> Credit Limit Determining Factors
            </h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-1">Credit Score Impact</h6>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                    <span className="text-xs">750+ score: Premium limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                    <span className="text-xs">700-749: Good limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>
                    <span className="text-xs">650-699: Moderate limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
                    <span className="text-xs">Below 650: Limited offers</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-1">Income Guidelines</h6>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                    <span className="text-xs">$100k+: Higher limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></div>
                    <span className="text-xs">$60-99k: Good limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></div>
                    <span className="text-xs">$30-59k: Moderate limits</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
                    <span className="text-xs">Below $30k: Lower limits</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 bg-white rounded-lg border border-gray-200 p-3">
              <h6 className="text-xs font-medium text-gray-800 mb-2">Other Key Factors</h6>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 text-indigo-500 mr-1" />
                  <span className="text-xs text-gray-600">Credit history length</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 text-indigo-500 mr-1" />
                  <span className="text-xs text-gray-600">Existing debt obligations</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 text-indigo-500 mr-1" />
                  <span className="text-xs text-gray-600">Payment history</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 text-indigo-500 mr-1" />
                  <span className="text-xs text-gray-600">Recent credit inquiries</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'loan-rates':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <LineChart className="h-4 w-4 mr-2 text-indigo-500" /> Current Loan Rate Trends
            </h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 py-2">30-Year Fixed Mortgage</td>
                    <td className="px-3 py-2">6.25%</td>
                    <td className="px-3 py-2">740+</td>
                    <td className="px-3 py-2">6.75%</td>
                    <td className="px-3 py-2">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-500 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">15-Year Fixed Mortgage</td>
                    <td className="px-3 py-2">5.75%</td>
                    <td className="px-3 py-2">740+</td>
                    <td className="px-3 py-2">6.25%</td>
                    <td className="px-3 py-2">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-500 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Auto Loan (60-mo new)</td>
                    <td className="px-3 py-2">4.49%</td>
                    <td className="px-3 py-2">720+</td>
                    <td className="px-3 py-2">5.99%</td>
                    <td className="px-3 py-2">
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Personal Loan (36-mo)</td>
                    <td className="px-3 py-2">7.99%</td>
                    <td className="px-3 py-2">720+</td>
                    <td className="px-3 py-2">11.99%</td>
                    <td className="px-3 py-2">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500 inline" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">Rates updated daily. Your actual rate may vary based on credit score, loan amount, and term length.</p>
          </div>
        );

      case 'term-comparison':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" /> Loan Term Comparison
            </h5>
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <h6 className="text-xs font-medium text-gray-800 mb-2">$10,000 Personal Loan at 7.99% APR</h6>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">3-Year Term</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-900 mr-2">$313/mo</span>
                        <span className="text-xs text-green-600">Total: $11,268</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div className="h-2.5 bg-green-500 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">5-Year Term</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-900 mr-2">$203/mo</span>
                        <span className="text-xs text-amber-600">Total: $12,180</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div className="h-2.5 bg-amber-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">7-Year Term</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-gray-900 mr-2">$158/mo</span>
                        <span className="text-xs text-red-600">Total: $13,272</span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full">
                      <div className="h-2.5 bg-red-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-xs text-blue-700">
                <p className="flex items-start">
                  <InfoIcon className="h-3.5 w-3.5 mt-0.5 mr-1.5 flex-shrink-0" />
                  <span>Shorter terms mean higher monthly payments but less interest paid overall. Longer terms reduce your monthly payment but increase the total cost of the loan.</span>
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'borrowing-power':
        return (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
            <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <BarChart2 className="h-4 w-4 mr-2 text-indigo-500" /> Estimated Borrowing Power
            </h5>
            <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
              <h6 className="text-xs font-medium text-gray-800 mb-2">Based on $75,000 Annual Income</h6>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-700">Personal Loan</span>
                    <span className="text-xs font-medium">Up to $30,000</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-700">Auto Loan</span>
                    <span className="text-xs font-medium">Up to $45,000</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-700">Home Loan</span>
                    <span className="text-xs font-medium">Up to $300,000</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full">
                    <div className="h-2.5 bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <h6 className="text-xs font-medium text-gray-800 mb-2">Key Factors Affecting Your Borrowing Power</h6>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-start">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                  <span>Debt-to-income ratio (ideally below 36%)</span>
                </div>
                <div className="flex items-start">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                  <span>Credit utilization (ideally below 30%)</span>
                </div>
                <div className="flex items-start">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                  <span>Credit score (higher = more borrowing power)</span>
                </div>
                <div className="flex items-start">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                  <span>Employment stability (2+ years preferred)</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'verification-complete':
        return (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h6 className="text-sm font-medium text-indigo-900 mb-1">Identity Verification Successful</h6>
                <p className="text-xs text-indigo-700 mb-2">Your identity has been successfully verified. This helps us:</p>
                <ul className="text-xs text-indigo-700 space-y-1 pl-4">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-700 mr-1.5"></div>
                    <span>Protect your account from fraud</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-700 mr-1.5"></div>
                    <span>Comply with banking regulations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-700 mr-1.5"></div>
                    <span>Streamline your account opening process</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'income-verified':
        return (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h6 className="text-sm font-medium text-indigo-900 mb-1">Income Successfully Verified</h6>
                <p className="text-xs text-indigo-700 mb-2">Based on the document you provided, we've verified your income of approximately $75,000 annually.</p>
                <div className="p-2 bg-white rounded border border-indigo-200 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Debt-to-Income Ratio</span>
                    <span className="font-medium text-indigo-700">28%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full mb-2">
                    <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                  <p className="text-gray-600">Your ratio is within our preferred range (under 36%), which is favorable for credit approval.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tax-analysis':
        return (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in">
            <div className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h6 className="text-sm font-medium text-indigo-900 mb-1">Tax Return Analysis Complete</h6>
                <p className="text-xs text-indigo-700 mb-2">We've analyzed your tax return to verify your income and assess your loan eligibility.</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded border border-indigo-200">
                    <p className="text-xs text-gray-600">Verified Annual Income</p>
                    <p className="text-sm font-medium text-indigo-800">$82,750</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-indigo-200">
                    <p className="text-xs text-gray-600">Estimated Monthly Income</p>
                    <p className="text-sm font-medium text-indigo-800">$6,896</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-indigo-200">
                    <p className="text-xs text-gray-600">Income Stability</p>
                    <p className="text-sm font-medium text-green-600">Strong (2+ years)</p>
                  </div>
                  <div className="p-2 bg-white rounded border border-indigo-200">
                    <p className="text-xs text-gray-600">Est. Borrowing Power</p>
                    <p className="text-sm font-medium text-indigo-800">$240,000 - $330,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                
                {/* If message contains document verification prompt, add action button */}
                {message.sender === 'agent' && message.content.includes('document') && message.content.includes('verification') && (
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
        
        {/* Render any active visualizations */}
        {showVisualization && renderVisualization()}
        
        {/* Suggested questions */}
        {suggestedQuestions.length > 0 && !isTyping && (
          <div className="pl-10 animate-fade-in">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button 
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="px-3 py-1.5 bg-white text-indigo-600 text-xs rounded-full border border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  {question}
                </button>
              ))}
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

// Add missing InfoIcon component
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

export default BankingChat;