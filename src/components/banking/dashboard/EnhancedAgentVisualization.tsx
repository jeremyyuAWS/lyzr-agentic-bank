import React, { useState, useEffect, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Bot, 
  User, 
  ArrowRight, 
  FileCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Lock, 
  Shield, 
  CreditCard, 
  Banknote, 
  FileSearch,
  UserCheck,
  Database,
  ListChecks,
  Cog,
  BrainCog
} from 'lucide-react';

// Define agent types and configurations
interface AgentNode {
  id: string;
  name: string;
  role: string;
  type: 'core' | 'processing' | 'decision';
  position: { x: number; y: number };
  status: 'idle' | 'working' | 'success' | 'error';
  currentTask?: string;
  color: string;
  icon: React.ReactNode;
  connections: string[]; // IDs of connected agents
}

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type?: 'message' | 'data' | 'request' | 'response';
}

interface AgentTask {
  id: string;
  from: string;
  to: string;
  type: 'document' | 'message' | 'verification' | 'check' | 'alert';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  content: string;
  createdAt: Date;
  completedAt?: Date;
}

const EnhancedAgentVisualization: React.FC = () => {
  const { auditTrail, mode } = useBankingContext();
  const [agents, setAgents] = useState<AgentNode[]>([
    {
      id: 'customer-service',
      name: 'Customer Service Agent',
      role: 'Primary user interface and coordination',
      type: 'core',
      position: { x: 50, y: 15 },
      status: 'idle',
      color: '#4f46e5', // indigo-600
      icon: <Bot />,
      connections: ['document', 'kyc', 'account', 'credit', 'compliance']
    },
    {
      id: 'document',
      name: 'Document Processing Agent',
      role: 'Verifies identity and other documents',
      type: 'processing',
      position: { x: 15, y: 40 },
      status: 'idle',
      color: '#fb923c', // orange-400
      icon: <FileSearch />,
      connections: ['customer-service', 'kyc', 'data']
    },
    {
      id: 'kyc',
      name: 'KYC/AML Agent',
      role: 'Performs regulatory compliance checks',
      type: 'processing',
      position: { x: 35, y: 65 },
      status: 'idle',
      color: '#8b5cf6', // purple-500
      icon: <Shield />,
      connections: ['customer-service', 'document', 'account', 'compliance', 'data']
    },
    {
      id: 'account',
      name: 'Account Management Agent',
      role: 'Creates and manages banking accounts',
      type: 'decision',
      position: { x: 65, y: 65 },
      status: 'idle',
      color: '#10b981', // emerald-500
      icon: <Banknote />,
      connections: ['customer-service', 'kyc', 'credit', 'data']
    },
    {
      id: 'credit',
      name: 'Credit Decision Agent',
      role: 'Evaluates creditworthiness and loan applications',
      type: 'decision',
      position: { x: 85, y: 40 },
      status: 'idle',
      color: '#ec4899', // pink-500
      icon: <CreditCard />,
      connections: ['customer-service', 'account', 'data']
    },
    {
      id: 'compliance',
      name: 'Compliance Monitoring Agent',
      role: 'Ensures regulatory compliance and manages risk',
      type: 'core',
      position: { x: 50, y: 85 },
      status: 'idle',
      color: '#f43f5e', // rose-500
      icon: <ListChecks />,
      connections: ['kyc', 'customer-service', 'data']
    },
    {
      id: 'data',
      name: 'Data Integration Agent',
      role: 'Manages data flow between systems and databases',
      type: 'core',
      position: { x: 50, y: 50 },
      status: 'idle',
      color: '#3b82f6', // blue-500
      icon: <Database />,
      connections: ['document', 'kyc', 'account', 'credit', 'compliance']
    },
  ]);
  
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    messagesProcessed: 0,
    decisionsRendered: 0,
    documentsVerified: 0,
    complianceChecks: 0
  });
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef<boolean>(false);
  
  // Initialize active agents based on current banking mode
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      
      // Initial active agents based on mode
      let initialActiveAgents: string[] = ['customer-service', 'data'];
      
      switch (mode) {
        case 'account-opening':
          initialActiveAgents.push('document', 'kyc', 'account');
          break;
        case 'credit-card':
          initialActiveAgents.push('document', 'credit', 'account');
          break;
        case 'loan':
          initialActiveAgents.push('document', 'kyc', 'credit');
          break;
        default:
          break;
      }
      
      setActiveAgents(initialActiveAgents);
      
      // Set initial agent statuses
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: initialActiveAgents.includes(agent.id) ? 'idle' : 'idle'
      })));
      
      // Simulate some initial communication
      setTimeout(() => simulateAgentActivity('Initial System Startup'), 1000);
    }
  }, [mode]);

  // Watch audit trail to trigger new agent activities
  useEffect(() => {
    if (auditTrail.length > 0) {
      const latestEvent = auditTrail[auditTrail.length - 1];
      
      if (latestEvent.event.includes('User Message') || 
          latestEvent.event.includes('Document') || 
          latestEvent.event.includes('KYC') || 
          latestEvent.event.includes('Session')) {
        simulateAgentActivity(latestEvent.event);
      }
      
      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        messagesProcessed: prev.messagesProcessed + (latestEvent.event.includes('Message') ? 1 : 0),
        documentsVerified: prev.documentsVerified + (latestEvent.event.includes('Document') && latestEvent.event.includes('verified') ? 1 : 0),
        complianceChecks: prev.complianceChecks + (latestEvent.event.includes('KYC') || latestEvent.event.includes('Compliance') ? 1 : 0),
        decisionsRendered: prev.decisionsRendered + (latestEvent.event.includes('approved') || latestEvent.event.includes('denied') ? 1 : 0)
      }));
    }
  }, [auditTrail]);
  
  // Cleanup old messages and tasks
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = new Date();
      
      // Remove messages older than 10 seconds
      setMessages(prev => prev.filter(msg => 
        now.getTime() - msg.timestamp.getTime() < 10000
      ));
      
      // Remove completed/failed tasks older than 15 seconds
      setTasks(prev => prev.filter(task => 
        task.status === 'pending' || task.status === 'processing' ||
        now.getTime() - (task.completedAt || task.createdAt).getTime() < 15000
      ));
    }, 5000);
    
    return () => clearInterval(cleanupInterval);
  }, []);
  
  // Simulate agent activity based on events
  const simulateAgentActivity = (eventType: string) => {
    setIsAnimating(true);
    
    // Determine which agents should respond based on the event type
    if (eventType.includes('User Message')) {
      // User message goes to customer service agent
      setAgents(prev => prev.map(agent => 
        agent.id === 'customer-service' 
          ? { ...agent, status: 'working', currentTask: 'Processing user request' }
          : agent
      ));
      
      // Create a message from user to customer service
      const newMessage: AgentMessage = {
        id: `msg-${Date.now()}-1`,
        from: 'user',
        to: 'customer-service',
        content: 'User request received',
        timestamp: new Date(),
        type: 'message'
      };
      setMessages(prev => [...prev, newMessage]);
      
      // After a delay, customer service analyzes and responds
      setTimeout(() => {
        // Message from customer service to appropriate agent based on content
        let targetAgentId = '';
        
        if (eventType.toLowerCase().includes('document') || eventType.toLowerCase().includes('upload')) {
          targetAgentId = 'document';
        } else if (eventType.toLowerCase().includes('account')) {
          targetAgentId = 'account';
        } else if (eventType.toLowerCase().includes('loan') || eventType.toLowerCase().includes('credit')) {
          targetAgentId = 'credit';
        } else if (eventType.toLowerCase().includes('kyc') || eventType.toLowerCase().includes('identity')) {
          targetAgentId = 'kyc';
        } else {
          // Default to a random service agent
          const serviceAgents = ['document', 'account', 'credit'];
          targetAgentId = serviceAgents[Math.floor(Math.random() * serviceAgents.length)];
        }
        
        // Create message from customer service to target agent
        const serviceMessage: AgentMessage = {
          id: `msg-${Date.now()}-2`,
          from: 'customer-service',
          to: targetAgentId,
          content: `Routing user request to ${targetAgentId} agent`,
          timestamp: new Date(),
          type: 'request'
        };
        setMessages(prev => [...prev, serviceMessage]);
        
        // Set target agent to working
        setAgents(prev => prev.map(agent => 
          agent.id === targetAgentId 
            ? { ...agent, status: 'working', currentTask: `Processing request from customer service` }
            : agent.id === 'customer-service'
            ? { ...agent, status: 'idle', currentTask: undefined }
            : agent
        ));
        
        // After another delay, target agent processes and sends data to data agent
        setTimeout(() => {
          const dataMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: targetAgentId,
            to: 'data',
            content: `Requesting data for user processing`,
            timestamp: new Date(),
            type: 'data'
          };
          setMessages(prev => [...prev, dataMessage]);
          
          setAgents(prev => prev.map(agent => 
            agent.id === 'data' 
              ? { ...agent, status: 'working', currentTask: `Retrieving data for ${targetAgentId}` }
              : agent
          ));
          
          // Data agent responds to target agent
          setTimeout(() => {
            const dataResponse: AgentMessage = {
              id: `msg-${Date.now()}-4`,
              from: 'data',
              to: targetAgentId,
              content: `Data retrieved successfully`,
              timestamp: new Date(),
              type: 'response'
            };
            setMessages(prev => [...prev, dataResponse]);
            
            // Update agent statuses
            setAgents(prev => prev.map(agent => 
              agent.id === 'data' 
                ? { ...agent, status: 'success', currentTask: undefined }
                : agent
            ));
            
            // Target agent finishes processing and responds to customer service
            setTimeout(() => {
              const finalResponse: AgentMessage = {
                id: `msg-${Date.now()}-5`,
                from: targetAgentId,
                to: 'customer-service',
                content: `Processed request, returning response`,
                timestamp: new Date(),
                type: 'response'
              };
              setMessages(prev => [...prev, finalResponse]);
              
              setAgents(prev => prev.map(agent => 
                agent.id === targetAgentId 
                  ? { ...agent, status: 'success', currentTask: undefined }
                  : agent.id === 'data'
                  ? { ...agent, status: 'idle', currentTask: undefined }
                  : agent
              ));
              
              // Customer service prepares response to user
              setTimeout(() => {
                const userResponse: AgentMessage = {
                  id: `msg-${Date.now()}-6`,
                  from: 'customer-service',
                  to: 'user',
                  content: `Response prepared for user`,
                  timestamp: new Date(),
                  type: 'response'
                };
                setMessages(prev => [...prev, userResponse]);
                
                setAgents(prev => prev.map(agent => 
                  agent.id === 'customer-service'
                    ? { ...agent, status: 'working', currentTask: `Responding to user` }
                    : agent.id === targetAgentId
                    ? { ...agent, status: 'idle', currentTask: undefined }
                    : agent
                ));
                
                // Finally, return all agents to idle
                setTimeout(() => {
                  setAgents(prev => prev.map(agent => ({ 
                    ...agent, 
                    status: 'idle', 
                    currentTask: undefined 
                  })));
                  setIsAnimating(false);
                }, 1500);
                
              }, 1000);
            }, 1500);
          }, 1500);
        }, 2000);
      }, 1500);
    }
    // Document verification flow
    else if (eventType.includes('Document')) {
      // Create task for document agent
      const docTask: AgentTask = {
        id: `task-${Date.now()}`,
        from: 'user',
        to: 'document',
        type: 'document',
        status: 'processing',
        content: 'Document uploaded for verification',
        progress: 0,
        createdAt: new Date()
      };
      setTasks(prev => [...prev, docTask]);
      
      // Set document agent to working
      setAgents(prev => prev.map(agent => 
        agent.id === 'document' 
          ? { ...agent, status: 'working', currentTask: 'Processing document' }
          : agent
      ));
      
      // Simulate document processing progress
      const progressInterval = setInterval(() => {
        setTasks(prev => prev.map(task => 
          task.id === docTask.id 
            ? { 
                ...task, 
                progress: Math.min((task.progress || 0) + 10, 100)
              }
            : task
        ));
      }, 500);
      
      // After document is processed, document agent communicates with KYC
      setTimeout(() => {
        clearInterval(progressInterval);
        
        // Document processed, update task
        setTasks(prev => prev.map(task => 
          task.id === docTask.id 
            ? { 
                ...task, 
                status: 'completed', 
                progress: 100, 
                completedAt: new Date() 
              }
            : task
        ));
        
        // Send message to KYC agent
        const kycMessage: AgentMessage = {
          id: `msg-${Date.now()}-1`,
          from: 'document',
          to: 'kyc',
          content: 'Document verified, requesting KYC check',
          timestamp: new Date(),
          type: 'request'
        };
        setMessages(prev => [...prev, kycMessage]);
        
        // Set document agent to success and KYC to working
        setAgents(prev => prev.map(agent => 
          agent.id === 'document' 
            ? { ...agent, status: 'success', currentTask: undefined }
            : agent.id === 'kyc'
            ? { ...agent, status: 'working', currentTask: 'Performing KYC check' }
            : agent
        ));
        
        // Create KYC task
        const kycTask: AgentTask = {
          id: `task-${Date.now()}-2`,
          from: 'document',
          to: 'kyc',
          type: 'verification',
          status: 'processing',
          content: 'Identity verification against watchlists',
          createdAt: new Date()
        };
        setTasks(prev => [...prev, kycTask]);
        
        // After KYC check, communicate results
        setTimeout(() => {
          // KYC check completed
          setTasks(prev => prev.map(task => 
            task.id === kycTask.id 
              ? { 
                  ...task, 
                  status: 'completed', 
                  completedAt: new Date() 
                }
              : task
          ));
          
          // KYC communicates with compliance
          const complianceMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'kyc',
            to: 'compliance',
            content: 'KYC check completed, logging compliance record',
            timestamp: new Date(),
            type: 'data'
          };
          setMessages(prev => [...prev, complianceMessage]);
          
          // KYC also communicates with account agent
          const accountMessage: AgentMessage = {
            id: `msg-${Date.now()}-4`,
            from: 'kyc',
            to: 'account',
            content: 'Identity verified, account can be created',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [...prev, accountMessage]);
          
          // Update agent statuses
          setAgents(prev => prev.map(agent => 
            agent.id === 'kyc' 
              ? { ...agent, status: 'success', currentTask: undefined }
              : agent.id === 'account'
              ? { ...agent, status: 'working', currentTask: 'Preparing account creation' }
              : agent.id === 'compliance'
              ? { ...agent, status: 'working', currentTask: 'Logging compliance record' }
              : agent.id === 'document'
              ? { ...agent, status: 'idle', currentTask: undefined }
              : agent
          ));
          
          // Return all agents to idle eventually
          setTimeout(() => {
            setAgents(prev => prev.map(agent => ({ 
              ...agent, 
              status: 'idle', 
              currentTask: undefined 
            })));
            setIsAnimating(false);
          }, 3000);
        }, 2500);
      }, 5000);
    }
    // KYC or other system events
    else {
      // Create some general system activity
      const randomAgents = [...agents]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(a => a.id);
      
      // First agent starts working
      setAgents(prev => prev.map(agent => 
        agent.id === randomAgents[0] 
          ? { ...agent, status: 'working', currentTask: 'Processing system task' }
          : agent
      ));
      
      // Create a message between two random agents
      setTimeout(() => {
        const systemMessage: AgentMessage = {
          id: `msg-${Date.now()}-sys1`,
          from: randomAgents[0],
          to: randomAgents[1],
          content: 'System maintenance task',
          timestamp: new Date(),
          type: 'data'
        };
        setMessages(prev => [...prev, systemMessage]);
        
        // Second agent starts working
        setAgents(prev => prev.map(agent => 
          agent.id === randomAgents[1] 
            ? { ...agent, status: 'working', currentTask: 'Processing system data' }
            : agent.id === randomAgents[0]
            ? { ...agent, status: 'idle', currentTask: undefined }
            : agent
        ));
        
        // After a delay, second agent responds
        setTimeout(() => {
          const responseMessage: AgentMessage = {
            id: `msg-${Date.now()}-sys2`,
            from: randomAgents[1],
            to: randomAgents[2],
            content: 'System data processed',
            timestamp: new Date(),
            type: 'response'
          };
          setMessages(prev => [...prev, responseMessage]);
          
          // Third agent starts working
          setAgents(prev => prev.map(agent => 
            agent.id === randomAgents[2] 
              ? { ...agent, status: 'working', currentTask: 'Finalizing system task' }
              : agent.id === randomAgents[1]
              ? { ...agent, status: 'idle', currentTask: undefined }
              : agent
          ));
          
          // Finally, return all to idle
          setTimeout(() => {
            setAgents(prev => prev.map(agent => ({ 
              ...agent, 
              status: 'idle', 
              currentTask: undefined 
            })));
            setIsAnimating(false);
          }, 1500);
        }, 1500);
      }, 1000);
    }
  };
  
  // Calculate position for a message between agents
  const getMessagePosition = (from: string, to: string, progress: number) => {
    // Handle special cases for user
    const fromNode = from === 'user' 
      ? { position: { x: 0, y: 50 } } 
      : agents.find(a => a.id === from);
    
    const toNode = to === 'user'
      ? { position: { x: 0, y: 50 } } 
      : agents.find(a => a.id === to);
    
    if (!fromNode || !toNode) return null;
    
    // Bezier curve positions for more natural-looking message paths
    const startX = fromNode.position.x;
    const startY = fromNode.position.y;
    const endX = toNode.position.x;
    const endY = toNode.position.y;
    
    // Calculate control point (for curved paths)
    const controlX = (startX + endX) / 2;
    const controlY = ((startY + endY) / 2) - 10; // Offset to create curve
    
    // Calculate point along the bezier curve
    const x = Math.pow(1 - progress, 2) * startX + 
              2 * (1 - progress) * progress * controlX + 
              Math.pow(progress, 2) * endX;
              
    const y = Math.pow(1 - progress, 2) * startY + 
              2 * (1 - progress) * progress * controlY + 
              Math.pow(progress, 2) * endY;
    
    return { x, y };
  };
  
  // Get path for connecting lines
  const getConnectionPath = (fromX: number, fromY: number, toX: number, toY: number) => {
    // Bezier curve for curved connection lines
    const controlX = (fromX + toX) / 2;
    const controlY = ((fromY + toY) / 2) - 10; // Offset for curve
    
    return `M${fromX},${fromY} Q${controlX},${controlY} ${toX},${toY}`;
  };
  
  // Handle agent node click
  const handleAgentClick = (agentId: string) => {
    if (selectedAgent === agentId) {
      setSelectedAgent(null);
    } else {
      setSelectedAgent(agentId);
    }
  };
  
  // Get color for agent status
  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'working': return '#4f46e5'; // indigo
      case 'success': return '#10b981'; // emerald
      case 'error': return '#ef4444';   // red
      default: return '#6b7280';        // gray
    }
  };
  
  // Get style for message type
  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'request': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'response': return 'bg-green-100 border-green-200 text-green-800';
      case 'data': return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'alert': return 'bg-red-100 border-red-200 text-red-800';
      default: return 'bg-indigo-100 border-indigo-200 text-indigo-800';
    }
  };
  
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="absolute left-4 top-4 z-10 flex flex-col space-y-2">
        {/* Agent information */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-xs w-48">
          <h4 className="font-medium text-gray-900 mb-1 flex items-center">
            <BrainCog className="h-3.5 w-3.5 text-indigo-600 mr-1" />
            Agent System Metrics
          </h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Messages:</span>
              <span className="font-medium text-gray-900">{systemMetrics.messagesProcessed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Documents:</span>
              <span className="font-medium text-gray-900">{systemMetrics.documentsVerified}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Compliance:</span>
              <span className="font-medium text-gray-900">{systemMetrics.complianceChecks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Decisions:</span>
              <span className="font-medium text-gray-900">{systemMetrics.decisionsRendered}</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-xs w-48">
          <h4 className="font-medium text-gray-900 mb-2">Agent Types</h4>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-indigo-600 mr-1.5"></div>
              <span>Core Services</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></div>
              <span>Processing Agents</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
              <span>Decision Agents</span>
            </div>
          </div>
          
          <h4 className="font-medium text-gray-900 mt-3 mb-2">Status</h4>
          <div className="space-y-1.5">
            <div className="flex items-center">
              <Cog className="h-3.5 w-3.5 text-blue-600 mr-1.5 animate-spin" />
              <span>Working</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-1.5" />
              <span>Success</span>
            </div>
            <div className="flex items-center">
              <XCircle className="h-3.5 w-3.5 text-red-600 mr-1.5" />
              <span>Error</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-full p-8" ref={canvasRef}>
        <div className="w-full h-full relative">
          {/* SVG for lines connecting agents */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* Connection lines between agents */}
            {agents.map(agent =>
              agent.connections.map(targetId => {
                const targetAgent = agents.find(a => a.id === targetId);
                if (!targetAgent) return null;
                
                // Calculate positions based on percentages
                const startX = agent.position.x * canvasRef.current!.clientWidth / 100;
                const startY = agent.position.y * canvasRef.current!.clientHeight / 100;
                const endX = targetAgent.position.x * canvasRef.current!.clientWidth / 100;
                const endY = targetAgent.position.y * canvasRef.current!.clientHeight / 100;
                
                // Only show connections for active agents
                const isActive = activeAgents.includes(agent.id) && activeAgents.includes(targetId);
                
                return (
                  <path
                    key={`${agent.id}-${targetId}`}
                    d={getConnectionPath(startX, startY, endX, endY)}
                    stroke={isActive ? '#d1d5db' : '#e5e7eb'} // gray-300 or gray-200
                    strokeWidth={isActive ? 1.5 : 1}
                    strokeDasharray={isActive ? 'none' : '3,3'}
                    fill="none"
                    opacity={isActive ? 1 : 0.5}
                  />
                );
              })
            )}
          </svg>
          
          {/* User node */}
          <div 
            className="absolute flex flex-col items-center"
            style={{ left: '0%', top: '50%', transform: 'translate(0, -50%)' }}
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-1">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-xs font-medium text-gray-700">User</div>
            <div className="text-xs text-gray-500 max-w-[100px] text-center">Banking customer</div>
          </div>
          
          {/* Agent nodes */}
          {agents.map(agent => {
            const isActive = activeAgents.includes(agent.id);
            const isSelected = selectedAgent === agent.id;
            
            return (
              <div 
                key={agent.id}
                className={`absolute flex flex-col items-center transition-all duration-300 ${
                  agent.status === 'working' ? 'animate-pulse' : ''
                } ${isSelected ? 'z-20' : 'z-10'}`}
                style={{ 
                  left: `${agent.position.x}%`, 
                  top: `${agent.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isActive ? 1 : 0.6,
                  scale: isSelected ? '1.1' : '1'
                }}
                onClick={() => handleAgentClick(agent.id)}
              >
                <div 
                  className={`h-16 w-16 rounded-lg flex items-center justify-center mb-1 transition-all duration-300 shadow-md ${
                    isSelected ? 'shadow-lg ring-2 ring-indigo-300' : ''
                  }`}
                  style={{ 
                    backgroundColor: agent.type === 'core' 
                      ? '#eff6ff' // blue-50
                      : agent.type === 'processing'
                      ? '#fff7ed' // orange-50
                      : '#f0fdf4', // green-50
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: agent.status === 'idle' 
                      ? agent.type === 'core' 
                        ? '#3b82f6' // blue-500
                        : agent.type === 'processing'
                        ? '#f97316' // orange-500
                        : '#10b981' // emerald-500
                      : getAgentStatusColor(agent.status)
                  }}
                >
                  <div className="text-2xl" style={{ color: agent.color }}>
                    {agent.icon}
                  </div>
                  
                  {agent.currentTask && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white text-xs px-2 py-1 rounded-full shadow border border-gray-200 whitespace-nowrap max-w-[150px] truncate">
                      {agent.currentTask}
                    </div>
                  )}
                </div>
                
                <div className="text-xs font-medium max-w-[120px] text-center">{agent.name}</div>
                
                {/* Only show role on hover/selection */}
                {isSelected && (
                  <div className="mt-1 text-xs text-gray-500 max-w-[140px] text-center transition-all duration-300">
                    {agent.role}
                  </div>
                )}
                
                {/* Status indicator */}
                <div className={`absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  agent.status === 'working' ? 'bg-blue-500 animate-pulse' :
                  agent.status === 'success' ? 'bg-green-500' :
                  agent.status === 'error' ? 'bg-red-500' :
                  'bg-gray-500'
                }`}></div>
              </div>
            );
          })}
          
          {/* Message bubbles */}
          {messages.map((message) => {
            // Calculate position based on age of message
            const createdTime = message.timestamp.getTime();
            const now = new Date().getTime();
            const elapsed = now - createdTime;
            const duration = 3000; // 3 seconds for animation
            const progress = Math.min(1, elapsed / duration);
            
            const position = getMessagePosition(message.from, message.to, progress);
            if (!position) return null;
            
            // Scale the percentages to actual pixels
            const x = position.x * canvasRef.current!.clientWidth / 100;
            const y = position.y * canvasRef.current!.clientHeight / 100;
            
            return (
              <div 
                key={message.id}
                className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                  left: `${x}px`,
                  top: `${y}px`,
                  opacity: progress >= 0.95 ? (1 - (progress - 0.95) * 20) : 1 // Fade out at the end
                }}
              >
                <div className={`px-2 py-1 rounded-lg border text-xs whitespace-nowrap ${getMessageStyle(message.type)}`}>
                  {message.content}
                </div>
              </div>
            );
          })}
          
          {/* Task icons */}
          {tasks.map((task) => {
            // For tasks with a specific progress, calculate position
            if (task.progress !== undefined) {
              const fromAgent = task.from === 'user' 
                ? { position: { x: 0, y: 50 } } 
                : agents.find(a => a.id === task.from);
              
              const toAgent = task.to === 'user'
                ? { position: { x: 0, y: 50 } } 
                : agents.find(a => a.id === task.to);
              
              if (!fromAgent || !toAgent) return null;
              
              // Use progress directly from task for more controlled animations
              const progress = task.progress / 100;
              
              const position = getMessagePosition(task.from, task.to, progress);
              if (!position) return null;
              
              // Scale the percentages to actual pixels
              const x = position.x * canvasRef.current!.clientWidth / 100;
              const y = position.y * canvasRef.current!.clientHeight / 100;
              
              return (
                <div 
                  key={task.id}
                  className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${x}px`,
                    top: `${y}px`
                  }}
                >
                  <div className={`p-1.5 rounded-lg shadow-md ${
                    task.type === 'document' 
                      ? 'bg-amber-100' 
                      : task.type === 'verification'
                      ? 'bg-purple-100'
                      : task.type === 'check'
                      ? 'bg-blue-100'
                      : task.type === 'alert'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                  }`}>
                    {task.type === 'document' && <FileText className="h-4 w-4 text-amber-700" />}
                    {task.type === 'verification' && <UserCheck className="h-4 w-4 text-purple-700" />}
                    {task.type === 'check' && <Shield className="h-4 w-4 text-blue-700" />}
                    {task.type === 'alert' && <AlertTriangle className="h-4 w-4 text-red-700" />}
                    {task.type === 'message' && <MessageSquare className="h-4 w-4 text-gray-700" />}
                  </div>
                </div>
              );
            }
            
            return null;
          })}
        </div>
        
        {/* System status overlay - only shown when not animating */}
        {!isAnimating && !selectedAgent && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-30">
            <div className="text-center p-6 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-indigo-100 mx-auto mb-3 flex items-center justify-center">
                <Bot className="h-6 w-6 text-indigo-600" />
              </div>
              <p className="text-lg font-medium text-gray-800">Agentic Banking System</p>
              <p className="text-gray-600 mb-1">AI Agents in standby mode</p>
              <p className="text-xs text-gray-500">Explore banking workflows to see agents in action</p>
            </div>
          </div>
        )}
        
        {/* Selected agent details panel */}
        {selectedAgent && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md w-full z-30">
            {(() => {
              const agent = agents.find(a => a.id === selectedAgent);
              if (!agent) return null;
              
              return (
                <div>
                  <div className="flex items-start">
                    <div 
                      className="h-12 w-12 rounded-lg flex items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: agent.type === 'core' 
                          ? '#eff6ff' // blue-50
                          : agent.type === 'processing'
                          ? '#fff7ed' // orange-50
                          : '#f0fdf4', // green-50
                        borderWidth: 2,
                        borderStyle: 'solid',
                        borderColor: agent.color
                      }}
                    >
                      <div className="text-xl" style={{ color: agent.color }}>
                        {agent.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-600">{agent.role}</p>
                      
                      <div className="flex items-center mt-1 text-xs">
                        <div className={`px-2 py-0.5 rounded-full ${
                          agent.type === 'core' 
                            ? 'bg-blue-100 text-blue-800'
                            : agent.type === 'processing'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {agent.type === 'core' ? 'Core Service' : 
                           agent.type === 'processing' ? 'Processing Agent' : 
                           'Decision Agent'}
                        </div>
                        
                        <div className={`ml-2 flex items-center px-2 py-0.5 rounded-full ${
                          agent.status === 'working' ? 'bg-blue-100 text-blue-800' :
                          agent.status === 'success' ? 'bg-green-100 text-green-800' :
                          agent.status === 'error' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status === 'working' ? 
                            <Cog className="animate-spin h-3 w-3 mr-1" /> :
                           agent.status === 'success' ? 
                            <CheckCircle className="h-3 w-3 mr-1" /> :
                           agent.status === 'error' ? 
                            <XCircle className="h-3 w-3 mr-1" /> :
                           <div className="h-3 w-3 rounded-full bg-gray-400 mr-1"></div>
                          }
                          <span>{agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setSelectedAgent(null)}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Connected Agents:</h5>
                    <div className="flex flex-wrap gap-1">
                      {agent.connections.map(connId => {
                        const connectedAgent = agents.find(a => a.id === connId);
                        if (!connectedAgent) return null;
                        
                        return (
                          <div 
                            key={connId}
                            className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 flex items-center"
                          >
                            <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: connectedAgent.color }}></div>
                            {connectedAgent.name.split(' ')[0]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
                    <span>Agent is active and operational</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAgentVisualization;