import React, { useRef, useEffect, useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import * as d3 from 'd3';
import { 
  Bot, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Shield,
  Download,
  FileText
} from 'lucide-react';

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type?: 'message' | 'data' | 'request' | 'response' | 'alert';
  status?: 'success' | 'warning' | 'error' | 'info';
}

const D3AgentCommunicationFlow: React.FC = () => {
  const { auditTrail } = useBankingContext();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [maxMessages, setMaxMessages] = useState(15);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortByTime, setSortByTime] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Predefined agent nodes with their visual properties and positions
  const agents = [
    { id: 'user', name: 'User', x: 100, y: 70, color: '#6366f1' },
    { id: 'onboarding', name: 'Onboarding', x: 220, y: 30, color: '#a855f7' },
    { id: 'document', name: 'Document', x: 340, y: 70, color: '#f97316' },
    { id: 'kyc', name: 'KYC/AML', x: 460, y: 30, color: '#0ea5e9' },
    { id: 'account', name: 'Account', x: 580, y: 70, color: '#10b981' },
    { id: 'credit', name: 'Credit', x: 700, y: 30, color: '#ec4899' },
    { id: 'security', name: 'Security', x: 340, y: 110, color: '#ef4444' },
    { id: 'system', name: 'System', x: 460, y: 110, color: '#64748b' }
  ];
  
  // Generate simulated agent messages based on audit trail
  useEffect(() => {
    // Only process new audit trail entries
    if (auditTrail.length > 0) {
      const latestEvent = auditTrail[auditTrail.length - 1];
      
      // For demonstration, generate agent messages based on specific audit events
      if (latestEvent.event.includes('Message')) {
        // User message received, simulate onboarding agent processing it
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-1`,
            from: 'user',
            to: 'onboarding',
            content: 'User query received',
            timestamp: new Date(),
            type: 'message'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 800);
        
        // Then simulate agent decision-making
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-2`,
            from: 'onboarding',
            to: 'document',
            content: 'Requesting document verification',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 1600);
        
        // Document agent response
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'document',
            to: 'onboarding',
            content: 'Verification requirements sent',
            timestamp: new Date(),
            type: 'response'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 2400);
      } 
      else if (latestEvent.event.includes('Document') || latestEvent.event.includes('Upload')) {
        // Document event, simulate document processing workflow
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-1`,
            from: 'user',
            to: 'document',
            content: 'Document uploaded',
            timestamp: new Date(),
            type: 'data'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 800);
        
        // Document processing
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-2`,
            from: 'document',
            to: 'system',
            content: 'Processing document with OCR',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 1600);
        
        // System response
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'system',
            to: 'document',
            content: 'OCR processing complete',
            timestamp: new Date(),
            type: 'response',
            status: 'success'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 2400);
        
        // Document validation
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-4`,
            from: 'document',
            to: 'kyc',
            content: 'Document validated, starting KYC',
            timestamp: new Date(),
            type: 'data'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 3200);
        
        // KYC agent processing
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-5`,
            from: 'kyc',
            to: 'security',
            content: 'Running watchlist checks',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 4000);
        
        // Security response
        setTimeout(() => {
          const success = Math.random() > 0.2; // 80% success rate
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-6`,
            from: 'security',
            to: 'kyc',
            content: success ? 'No security flags found' : 'Security check flags detected',
            timestamp: new Date(),
            type: 'response',
            status: success ? 'success' : 'warning'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 4800);
        
        // KYC agent result
        setTimeout(() => {
          const success = Math.random() > 0.2; // 80% success rate
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-7`,
            from: 'kyc',
            to: 'account',
            content: success ? 'KYC passed, proceed with account' : 'KYC issues found, manual review needed',
            timestamp: new Date(),
            type: 'data',
            status: success ? 'success' : 'warning'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 5600);
      }
      else if (latestEvent.event.includes('KYC')) {
        // KYC event, simulate verification workflow
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-1`,
            from: 'kyc',
            to: 'system',
            content: 'Performing identity verification',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 800);
        
        // System response
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-2`,
            from: 'system',
            to: 'kyc',
            content: 'Identity verification complete',
            timestamp: new Date(),
            type: 'response'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 1600);
        
        // KYC checks
        setTimeout(() => {
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-3`,
            from: 'kyc',
            to: 'security',
            content: 'Checking AML and sanctions lists',
            timestamp: new Date(),
            type: 'request'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 2400);
        
        // Security response
        setTimeout(() => {
          const status = Math.random() > 0.2 ? 'success' : 'warning';
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-4`,
            from: 'security',
            to: 'kyc',
            content: status === 'success' ? 'No matches found in watchlists' : 'Potential match requires review',
            timestamp: new Date(),
            type: 'response',
            status
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 3200);
        
        // KYC decision
        setTimeout(() => {
          const success = Math.random() > 0.3;
          const newMessage: AgentMessage = {
            id: `msg-${Date.now()}-5`,
            from: 'kyc',
            to: 'onboarding',
            content: success ? 'Customer verification successful' : 'Verification requires manual review',
            timestamp: new Date(),
            type: 'data',
            status: success ? 'success' : 'warning'
          };
          setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
        }, 4000);
      }
      else {
        // Other events - generate some system messages
        const randomAgentIds = [...agents]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
          .map(a => a.id)
          .filter(id => id !== 'user'); // Filter out user
        
        if (randomAgentIds.length >= 2) {
          setTimeout(() => {
            const newMessage: AgentMessage = {
              id: `msg-${Date.now()}-1`,
              from: randomAgentIds[0],
              to: randomAgentIds[1],
              content: 'System monitoring and maintenance',
              timestamp: new Date(),
              type: 'info'
            };
            setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
          }, 1000);
        }
      }
    }
  }, [auditTrail, maxMessages]);
  
  // Draw the flow visualization using D3
  useEffect(() => {
    if (!svgRef.current || messages.length === 0) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Set up the SVG
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.parentElement?.clientWidth || 800;
    const height = 280; // Fixed height
    
    svg.attr('width', width)
       .attr('height', height);
    
    // Define agent nodes on top row
    const drawAgents = () => {
      const agentGroups = svg.append('g')
        .selectAll('g')
        .data(agents)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .attr('class', d => `agent-${d.id}`);
      
      // Agent circles
      agentGroups.append('circle')
        .attr('r', 15)
        .attr('fill', d => d.id === 'user' ? '#f1f5f9' : '#f8fafc') // slate-100/50
        .attr('stroke', d => d.color)
        .attr('stroke-width', 2);
      
      // Agent icons
      agentGroups.each(function(d) {
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        icon.setAttribute('x', '-8');
        icon.setAttribute('y', '-8');
        icon.setAttribute('width', '16');
        icon.setAttribute('height', '16');
        
        const iconDiv = document.createElement('div');
        iconDiv.style.width = '100%';
        iconDiv.style.height = '100%';
        iconDiv.style.display = 'flex';
        iconDiv.style.alignItems = 'center';
        iconDiv.style.justifyContent = 'center';
        iconDiv.style.color = d.color;
        
        let iconSvg = '';
        
        switch(d.id) {
          case 'user':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
            break;
          case 'onboarding':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>';
            break;
          case 'document':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>';
            break;
          case 'kyc':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
            break;
          case 'account':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
            break;
          case 'credit':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>';
            break;
          case 'security':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 2a5.5 5.5 0 0 0 0 11h1a5.5 5.5 0 1 0 0-11h-1z"></path><path d="M11.5 7a1 1 0 1 0 1 -1"></path><path d="M11.5 4.5v5"></path></svg>';
            break;
          case 'system':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M11 7h.01"></path><path d="M15 7h.01"></path><path d="M7 11h.01"></path><path d="M11 11h.01"></path><path d="M15 11h.01"></path><path d="M7 15h.01"></path><path d="M11 15h.01"></path><path d="M15 15h.01"></path></svg>';
            break;
        }
        
        iconDiv.innerHTML = iconSvg;
        icon.appendChild(iconDiv);
        this.appendChild(icon);
      });
      
      // Agent labels
      agentGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 30)
        .text(d => d.name)
        .attr('fill', '#334155') // slate-700
        .attr('font-size', '10px')
        .style('pointer-events', 'none');
    };
    
    // Draw the agents
    drawAgents();
    
    // Filter and sort messages for display
    let displayMessages = [...messages];
    
    // Apply filtering
    if (filter) {
      displayMessages = displayMessages.filter(msg => 
        msg.from === filter || msg.to === filter
      );
    }
    
    // Apply sorting
    if (sortByTime) {
      displayMessages = displayMessages.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );
    }
    
    // Limit to maxMessages
    displayMessages = displayMessages.slice(0, maxMessages);
    
    // Draw the messages flow
    const messageHeight = 38;
    const messageSpacing = 8;
    const messageStartY = 150;
    
    // Draw message boxes
    const messageGroups = svg.append('g')
      .selectAll('g')
      .data(displayMessages)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${width / 2}, ${messageStartY + i * (messageHeight + messageSpacing)})`)
      .attr('class', 'message');
    
    // Message rectangles
    messageGroups.append('rect')
      .attr('x', -120)
      .attr('y', -15)
      .attr('width', 240)
      .attr('height', messageHeight)
      .attr('rx', 4)
      .attr('fill', d => {
        if (d.status === 'success') return '#f0fdf4'; // green-50
        if (d.status === 'warning') return '#fefce8'; // yellow-50
        if (d.status === 'error') return '#fef2f2';   // red-50
        
        switch(d.type) {
          case 'message': return '#eff6ff'; // blue-50
          case 'data': return '#f3e8ff';    // purple-50
          case 'request': return '#ecfdf5';  // emerald-50
          case 'response': return '#fff7ed'; // orange-50
          case 'alert': return '#fef2f2';    // red-50
          default: return '#f8fafc';        // slate-50
        }
      })
      .attr('stroke', d => {
        if (d.status === 'success') return '#22c55e'; // green-500
        if (d.status === 'warning') return '#eab308'; // yellow-500
        if (d.status === 'error') return '#ef4444';   // red-500
        
        switch(d.type) {
          case 'message': return '#3b82f6'; // blue-500
          case 'data': return '#a855f7';    // purple-500
          case 'request': return '#10b981';  // emerald-500
          case 'response': return '#f97316'; // orange-500
          case 'alert': return '#ef4444';    // red-500
          default: return '#cbd5e1';        // slate-300
        }
      })
      .attr('stroke-width', 1);
    
    // Add 'FROM' agent indicators
    messageGroups.append('line')
      .attr('x1', -140)
      .attr('y1', 0)
      .attr('x2', -120)
      .attr('y2', 0)
      .attr('stroke', d => {
        const agent = agents.find(a => a.id === d.from);
        return agent ? agent.color : '#94a3b8'; // slate-400 as default
      })
      .attr('stroke-width', 2);
      
    messageGroups.append('circle')
      .attr('cx', -140)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', d => {
        const agent = agents.find(a => a.id === d.from);
        return agent ? agent.color : '#94a3b8'; // slate-400 as default
      });
      
    // Add 'TO' agent indicators
    messageGroups.append('line')
      .attr('x1', 120)
      .attr('y1', 0)
      .attr('x2', 140)
      .attr('y2', 0)
      .attr('stroke', d => {
        const agent = agents.find(a => a.id === d.to);
        return agent ? agent.color : '#94a3b8'; // slate-400 as default
      })
      .attr('stroke-width', 2);
      
    messageGroups.append('circle')
      .attr('cx', 140)
      .attr('cy', 0)
      .attr('r', 5)
      .attr('fill', d => {
        const agent = agents.find(a => a.id === d.to);
        return agent ? agent.color : '#94a3b8'; // slate-400 as default
      });
    
    // Message content
    messageGroups.append('text')
      .attr('x', -110)
      .attr('y', -3)
      .attr('fill', '#334155') // slate-700
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .style('text-transform', 'capitalize')
      .text(d => {
        const fromAgent = agents.find(a => a.id === d.from);
        const toAgent = agents.find(a => a.id === d.to);
        return `${fromAgent?.name || d.from} → ${toAgent?.name || d.to}`;
      });
      
    messageGroups.append('foreignObject')
      .attr('x', -110)
      .attr('y', 0)
      .attr('width', 220)
      .attr('height', 20)
      .append('xhtml:div')
      .style('font-size', '9px')
      .style('color', '#475569') // slate-600
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')
      .style('white-space', 'nowrap')
      .html(d => d.content);
    
    // Add timestamp
    messageGroups.append('text')
      .attr('x', -110)
      .attr('y', 16)
      .attr('fill', '#94a3b8') // slate-400
      .attr('font-size', '8px')
      .text(d => {
        // Format the timestamp as HH:MM:SS
        return d.timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
      });
    
    // Add message type icon
    messageGroups.each(function(d) {
      const g = d3.select(this);
      const iconX = 95;
      const iconY = -5;
      
      let iconSvg = '';
      
      switch(d.type) {
        case 'message':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
          break;
        case 'data':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>';
          break;
        case 'request':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
          break;
        case 'response':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          break;
        case 'alert':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
          break;
        default:
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="16"></line><line x1="8" x2="16" y1="12" y2="12"></line></svg>';
      }
      
      const foreignObject = g.append('foreignObject')
        .attr('x', iconX)
        .attr('y', iconY)
        .attr('width', 16)
        .attr('height', 16);
      
      const iconDiv = document.createElement('div');
      iconDiv.style.width = '100%';
      iconDiv.style.height = '100%';
      iconDiv.style.display = 'flex';
      iconDiv.style.alignItems = 'center';
      iconDiv.style.justifyContent = 'center';
      
      switch(d.type) {
        case 'message': iconDiv.style.color = '#3b82f6'; break; // blue-500
        case 'data': iconDiv.style.color = '#a855f7'; break;    // purple-500
        case 'request': iconDiv.style.color = '#10b981'; break;  // emerald-500
        case 'response': iconDiv.style.color = '#f97316'; break; // orange-500
        case 'alert': iconDiv.style.color = '#ef4444'; break;    // red-500
        default: iconDiv.style.color = '#94a3b8'; break;        // slate-400
      }
      
      // If there's a status, override the color
      if (d.status === 'success') iconDiv.style.color = '#22c55e'; // green-500
      if (d.status === 'warning') iconDiv.style.color = '#eab308'; // yellow-500
      if (d.status === 'error') iconDiv.style.color = '#ef4444';   // red-500
      
      iconDiv.innerHTML = iconSvg;
      foreignObject.node()?.appendChild(iconDiv);
    });
    
    // Draw connecting lines between agent nodes
    const connections = [
      { source: 'user', target: 'onboarding' },
      { source: 'onboarding', target: 'document' },
      { source: 'document', target: 'kyc' },
      { source: 'kyc', target: 'security' },
      { source: 'kyc', target: 'account' },
      { source: 'account', target: 'credit' },
      { source: 'document', target: 'system' },
      { source: 'kyc', target: 'system' },
    ];
    
    const lineGenerator = d3.line<{x: number, y: number}>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);
    
    connections.forEach(conn => {
      const source = agents.find(a => a.id === conn.source);
      const target = agents.find(a => a.id === conn.target);
      
      if (source && target) {
        // Create curved path between agents
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        
        // Adjust the curve if the two agents are on the same row
        const curveOffset = Math.abs(source.y - target.y) < 10 ? 20 : 0;
        
        const path = [
          { x: source.x, y: source.y },
          { x: midX, y: midY - curveOffset },
          { x: target.x, y: target.y }
        ];
        
        svg.append('path')
          .attr('d', lineGenerator(path))
          .attr('fill', 'none')
          .attr('stroke', '#e2e8f0') // slate-200
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');
      }
    });
    
    // No data message if needed
    if (messages.length === 0) {
      const noDataGroup = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
      
      noDataGroup.append('rect')
        .attr('x', -100)
        .attr('y', -40)
        .attr('width', 200)
        .attr('height', 80)
        .attr('rx', 8)
        .attr('fill', '#f8fafc') // slate-50
        .attr('stroke', '#e2e8f0') // slate-200
        .attr('stroke-width', 1);
      
      noDataGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -10)
        .attr('fill', '#475569') // slate-600
        .attr('font-size', '14px')
        .text('No agent communications yet');
      
      noDataGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 15)
        .attr('fill', '#64748b') // slate-500
        .attr('font-size', '12px')
        .text('Interact with the system to');
      
      noDataGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 35)
        .attr('fill', '#64748b') // slate-500
        .attr('font-size', '12px')
        .text('see agents communicate');
    }
    
  }, [messages, filter, sortByTime, maxMessages]);
  
  // Simulate new messages when needed
  const simulateNewMessages = () => {
    // Create a random message between two random agents
    const randomAgentIds = [...agents]
      .map(a => a.id)
      .filter(id => id !== 'user') // Filter out user for simulation
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    if (randomAgentIds.length >= 2) {
      const messageTypes: AgentMessage['type'][] = ['message', 'data', 'request', 'response', 'alert'];
      const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      
      const randomMessages = [
        'Processing customer data',
        'Verifying account details',
        'Checking compliance requirements',
        'Updating customer profile',
        'Calculating risk score',
        'Monitoring for suspicious activity',
        'Preparing document verification',
        'Analyzing transaction patterns',
        'Initiating identity check',
        'Syncing data between systems'
      ];
      
      const newMessage: AgentMessage = {
        id: `sim-msg-${Date.now()}`,
        from: randomAgentIds[0],
        to: randomAgentIds[1],
        content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: new Date(),
        type: randomType,
        status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'warning' : 'error') : undefined
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, maxMessages));
    }
  };
  
  // Helper function to get agent color
  const getAgentColor = (agentId: string): string => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.color : '#94a3b8'; // slate-400 as default
  };
  
  // Create filterable list of agent names for the dropdown
  const agentOptions = [
    { id: null, name: 'All Agents' },
    ...agents
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="font-medium text-indigo-900 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
          Agent Communication Flow
        </h3>
        
        <div className="flex space-x-2">
          <select 
            className="text-xs border border-gray-300 rounded-md p-1 bg-white"
            value={filter || ''}
            onChange={(e) => setFilter(e.target.value || null)}
          >
            {agentOptions.map(agent => (
              <option key={agent.id || 'all'} value={agent.id || ''}>
                {agent.name}
              </option>
            ))}
          </select>
          
          <button
            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center"
            onClick={simulateNewMessages}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Simulate
          </button>
        </div>
      </div>
      
      <div className="p-4 h-[340px] overflow-hidden">
        <svg 
          ref={svgRef} 
          className="w-full"
          style={{ height: 'calc(100% - 48px)' }}
        ></svg>
        
        <div className="mt-1 flex justify-between items-center px-1">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Displaying {messages.length} of {maxMessages} messages
          </div>
          
          <div className="flex space-x-2">
            <button
              className={`px-2 py-1 text-xs rounded-md ${sortByTime ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSortByTime(true)}
            >
              Newest First
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-md ${!sortByTime ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSortByTime(false)}
            >
              Sequential
            </button>
          </div>
        </div>
      </div>
      
      {/* Message type legend */}
      <div className="px-4 pb-3 border-t border-gray-100 pt-2">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-600">Message</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-1"></div>
            <span className="text-xs text-gray-600">Data</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1"></div>
            <span className="text-xs text-gray-600">Request</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-1"></div>
            <span className="text-xs text-gray-600">Response</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs text-gray-600">Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3AgentCommunicationFlow;