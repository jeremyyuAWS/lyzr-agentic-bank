import React, { useState, useEffect } from 'react';
import { Bot, User, ArrowRight, FileCheck, FileText, AlertTriangle, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useBankingContext } from '../../../context/BankingContext';

// Define agent types and positions
interface Agent {
  id: string;
  name: string;
  role: string;
  position: { x: number; y: number };
  status: 'idle' | 'working' | 'success' | 'error';
  currentTask?: string;
}

interface Task {
  id: string;
  from: string;
  to: string;
  type: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
}

const AgentVisualization: React.FC = () => {
  const { mode, auditTrail } = useBankingContext();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'onboarding',
      name: 'Onboarding Agent',
      role: 'Collects and validates customer information',
      position: { x: 20, y: 30 },
      status: 'idle'
    },
    {
      id: 'document',
      name: 'Document Agent',
      role: 'Processes and verifies documents',
      position: { x: 70, y: 30 },
      status: 'idle'
    },
    {
      id: 'kyc',
      name: 'KYC/AML Agent',
      role: 'Performs compliance checks',
      position: { x: 20, y: 70 },
      status: 'idle'
    },
    {
      id: 'account',
      name: 'Account Agent',
      role: 'Creates and manages accounts',
      position: { x: 70, y: 70 },
      status: 'idle'
    }
  ]);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use audit trail to drive agent activity visualization
  useEffect(() => {
    if (auditTrail.length > 0) {
      // Update agents based on the latest audit trail event
      const latestEvent = auditTrail[auditTrail.length - 1];
      
      // Demo code to simulate agent activity based on audit events
      if (latestEvent.event.includes('Message') || latestEvent.event.includes('Upload') || latestEvent.event.includes('Document')) {
        simulateAgentActivity(latestEvent.event, latestEvent.details);
      }
    }
  }, [auditTrail]);

  // Simulate agent activity for visualization
  const simulateAgentActivity = (eventType: string, details: string) => {
    // Clear any previous animation timer
    setIsAnimating(true);
    
    // Determine which agents should react based on event type
    if (eventType.includes('User Message')) {
      // User message triggers onboarding agent
      setAgents(prev => prev.map(agent => 
        agent.id === 'onboarding' 
          ? { ...agent, status: 'working', currentTask: 'Processing user message' }
          : agent
      ));
      
      // Create a new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        from: 'user',
        to: 'onboarding',
        type: 'message',
        content: details.substring(0, 30) + '...',
        status: 'processing',
        createdAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      
      // After a delay, show agent-to-agent communication
      setTimeout(() => {
        // Mark task as completed
        setTasks(prev => prev.map(task => 
          task.id === newTask.id ? { ...task, status: 'completed', completedAt: new Date() } : task
        ));
        
        // Set onboarding agent back to idle
        setAgents(prev => prev.map(agent => 
          agent.id === 'onboarding' ? { ...agent, status: 'idle', currentTask: undefined } : agent
        ));
        
        // Sometimes, create agent-to-agent communication
        if (Math.random() > 0.5) {
          const targetAgent = Math.random() > 0.5 ? 'document' : 'kyc';
          
          // Create agent-to-agent message
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            from: 'onboarding',
            to: targetAgent,
            content: targetAgent === 'document' 
              ? 'Requesting document verification' 
              : 'Customer profile ready for KYC check',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
          
          // Set target agent to working
          setAgents(prev => prev.map(agent => 
            agent.id === targetAgent 
              ? { ...agent, status: 'working', currentTask: targetAgent === 'document' ? 'Processing document' : 'Running KYC check' }
              : agent
          ));
          
          // After another delay, simulate completion
          setTimeout(() => {
            setAgents(prev => prev.map(agent => 
              agent.id === targetAgent ? { ...agent, status: 'success', currentTask: undefined } : agent
            ));
            
            // After success indication, return to idle
            setTimeout(() => {
              setAgents(prev => prev.map(agent => 
                agent.id === targetAgent ? { ...agent, status: 'idle' } : agent
              ));
            }, 1500);
            
          }, 3000);
        }
      }, 2000);
    } 
    else if (eventType.includes('Document Upload') || eventType.includes('Document Verification')) {
      // Document events trigger document agent
      setAgents(prev => prev.map(agent => 
        agent.id === 'document' 
          ? { ...agent, status: 'working', currentTask: 'Processing document' }
          : agent
      ));
      
      // Create a new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        from: eventType.includes('Upload') ? 'user' : 'system',
        to: 'document',
        type: 'document',
        content: details,
        status: 'processing',
        createdAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      
      // After a delay, simulate verification outcome
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        
        // Mark task as completed or failed
        setTasks(prev => prev.map(task => 
          task.id === newTask.id 
            ? { 
                ...task, 
                status: success ? 'completed' : 'failed', 
                completedAt: new Date() 
              } 
            : task
        ));
        
        // Update document agent status
        setAgents(prev => prev.map(agent => 
          agent.id === 'document' 
            ? { ...agent, status: success ? 'success' : 'error', currentTask: undefined }
            : agent
        ));
        
        if (success) {
          // Create agent-to-agent message to KYC agent
          const newMessage: Message = {
            id: `msg-${Date.now()}`,
            from: 'document',
            to: 'kyc',
            content: 'Document verified, initiating KYC check',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
          
          // Set KYC agent to working
          setAgents(prev => prev.map(agent => 
            agent.id === 'kyc' 
              ? { ...agent, status: 'working', currentTask: 'Running KYC/AML checks' }
              : agent
          ));
          
          // After a delay, KYC completes
          setTimeout(() => {
            setAgents(prev => prev.map(agent => 
              agent.id === 'kyc' ? { ...agent, status: 'success', currentTask: undefined } : agent
            ));
            
            // Communicate to account agent
            const accountMessage: Message = {
              id: `msg-${Date.now() + 1}`,
              from: 'kyc',
              to: 'account',
              content: 'KYC passed, ready for account creation',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, accountMessage]);
            
            // Set account agent to working
            setTimeout(() => {
              setAgents(prev => prev.map(agent => 
                agent.id === 'account' 
                  ? { ...agent, status: 'working', currentTask: 'Creating new account' }
                  : (agent.id === 'kyc' ? { ...agent, status: 'idle' } : agent)
              ));
              
              // After a delay, account is created
              setTimeout(() => {
                setAgents(prev => prev.map(agent => 
                  agent.id === 'account' ? { ...agent, status: 'success', currentTask: undefined } : agent
                ));
                
                // After success indication, return to idle
                setTimeout(() => {
                  setAgents(prev => prev.map(agent => 
                    agent.id === 'account' ? { ...agent, status: 'idle' } : agent
                  ));
                  setIsAnimating(false);
                }, 1500);
              }, 2500);
            }, 1000);
            
          }, 3000);
        } else {
          // After error indication, return to idle
          setTimeout(() => {
            setAgents(prev => prev.map(agent => 
              agent.id === 'document' ? { ...agent, status: 'idle' } : agent
            ));
            setIsAnimating(false);
          }, 1500);
        }
      }, 3500);
    }
    else {
      // For other events, just update the visualization state briefly
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 5000);
    }
  };

  // Calculate position for message animations
  const getMessagePosition = (from: string, to: string, progress: number) => {
    const fromAgent = from === 'user' 
      ? { position: { x: 0, y: 50 } } // User position
      : agents.find(a => a.id === from);
    
    const toAgent = to === 'user'
      ? { position: { x: 0, y: 50 } } // User position
      : agents.find(a => a.id === to);
    
    if (!fromAgent || !toAgent) return { x: 0, y: 0 };
    
    const startX = from === 'user' ? 5 : fromAgent.position.x;
    const startY = fromAgent.position.y;
    const endX = to === 'user' ? 5 : toAgent.position.x;
    const endY = toAgent.position.y;
    
    // Calculate position along the path based on progress (0 to 1)
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    
    return { x, y };
  };
  
  // Delete older messages and tasks to keep the visualization clean
  useEffect(() => {
    const messageCleanupInterval = setInterval(() => {
      const now = new Date();
      setMessages(prev => prev.filter(msg => now.getTime() - msg.timestamp.getTime() < 10000));
      setTasks(prev => prev.filter(task => now.getTime() - task.createdAt.getTime() < 15000));
    }, 5000);
    
    return () => clearInterval(messageCleanupInterval);
  }, []);
  
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 p-4">
        {/* Agent visualization */}
        <div className="w-full h-full relative">
          {/* Connecting lines between agents */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <line x1="25%" y1="30%" x2="75%" y2="30%" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="25%" y1="30%" x2="25%" y2="70%" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="75%" y1="30%" x2="75%" y2="70%" stroke="#e5e7eb" strokeWidth="2" />
            <line x1="25%" y1="70%" x2="75%" y2="70%" stroke="#e5e7eb" strokeWidth="2" />
            
            {/* User connection */}
            <line x1="5%" y1="50%" x2="25%" y2="30%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="5%" y1="50%" x2="75%" y2="30%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          
          {/* User node */}
          <div 
            className="absolute flex flex-col items-center animate-pulse"
            style={{ left: '5%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1 shadow-md">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-xs font-medium text-gray-700">User</div>
          </div>
          
          {/* Agent nodes */}
          {agents.map(agent => (
            <div 
              key={agent.id}
              className={`absolute flex flex-col items-center ${
                agent.status === 'working' ? 'animate-pulse' : ''
              }`}
              style={{ 
                left: `${agent.position.x}%`, 
                top: `${agent.position.y}%`, 
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center mb-1 shadow-md ${
                agent.status === 'idle' ? 'bg-gray-100' :
                agent.status === 'working' ? 'bg-blue-100' :
                agent.status === 'success' ? 'bg-green-100' :
                'bg-red-100'
              }`}>
                <Bot className={`w-8 h-8 ${
                  agent.status === 'idle' ? 'text-gray-500' :
                  agent.status === 'working' ? 'text-blue-500' :
                  agent.status === 'success' ? 'text-green-500' :
                  'text-red-500'
                }`} />
                {agent.currentTask && (
                  <div className="mt-1 px-2 py-0.5 text-xs bg-white rounded-full shadow-sm">
                    {agent.currentTask}
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-gray-700">{agent.name}</div>
              <div className="text-xs text-gray-500 text-center max-w-[120px]">{agent.role}</div>
            </div>
          ))}
          
          {/* Task animations */}
          {tasks.map((task) => {
            // Calculate position based on animation progress
            const createdTime = task.createdAt.getTime();
            const now = new Date().getTime();
            const elapsed = now - createdTime;
            const duration = 2000; // 2 seconds for animation
            const progress = Math.min(1, elapsed / duration);
            
            const { x, y } = getMessagePosition(task.from, task.to, progress);
            
            return (
              <div 
                key={task.id}
                className="absolute z-20"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)',
                  opacity: task.status === 'completed' || task.status === 'failed' ? 0 : 1,
                  transition: 'opacity 0.5s ease-in-out'
                }}
              >
                {task.type === 'document' ? (
                  <div className="bg-amber-100 text-amber-800 p-1.5 rounded-lg shadow-md flex items-center text-xs animate-bounce">
                    <FileText className="w-4 h-4 mr-1" />
                    <span className="whitespace-nowrap max-w-[100px] truncate">{task.content}</span>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 p-1.5 rounded-lg shadow-md flex items-center text-xs animate-bounce">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    <span className="whitespace-nowrap max-w-[100px] truncate">{task.content}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Agent-to-agent message animations */}
          {messages.map((message) => {
            // Calculate position based on age of message
            const createdTime = message.timestamp.getTime();
            const now = new Date().getTime();
            const elapsed = now - createdTime;
            const duration = 3000; // 3 seconds for animation
            const progress = Math.min(1, elapsed / duration);
            
            const { x, y } = getMessagePosition(message.from, message.to, progress);
            
            return (
              <div 
                key={message.id}
                className={`absolute z-20 transition-opacity duration-500 ${
                  progress >= 0.9 ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="bg-green-100 text-green-800 p-1.5 rounded-lg shadow-md flex items-center text-xs whitespace-nowrap">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  {message.content}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Status overlay - only shown when not animating */}
        {!isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
            <div className="text-center p-6 rounded-lg">
              <p className="text-lg font-medium text-gray-800">Agentic Bank System</p>
              <p className="text-gray-600 mb-4">Select a workflow to see agents in action</p>
              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-indigo-500 animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentVisualization;