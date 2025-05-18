import React, { useRef, useEffect, useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import * as d3 from 'd3';
import { 
  User, 
  Bot, 
  Shield, 
  FileText, 
  Database, 
  CreditCard, 
  Landmark, 
  Key, 
  ArrowRight 
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  type: string;
  color: string;
  icon: React.ReactNode;
}

interface Link {
  source: string;
  target: string;
  strength: number;
  status: 'active' | 'inactive';
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  role: string;
  type: string;
  color: string;
  status: 'idle' | 'working' | 'success' | 'error';
  icon: React.ReactNode;
  x?: number;
  y?: number;
}

const D3AgentNetworkVisualization: React.FC = () => {
  const { mode, auditTrail } = useBankingContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Define agents
  const agents: Agent[] = [
    {
      id: 'user',
      name: 'Customer',
      role: 'Banking customer interacting with the system',
      type: 'external',
      color: '#6366f1', // indigo-500
      icon: <User />
    },
    {
      id: 'customer-service',
      name: 'Customer Service Agent',
      role: 'Primary user interface and coordination',
      type: 'core',
      color: '#8b5cf6', // purple-500
      icon: <Bot />
    },
    {
      id: 'document',
      name: 'Document Agent',
      role: 'Processes and verifies identity documents',
      type: 'processing',
      color: '#f97316', // orange-500
      icon: <FileText />
    },
    {
      id: 'kyc',
      name: 'KYC/AML Agent',
      role: 'Performs compliance and identity checks',
      type: 'processing',
      color: '#0ea5e9', // sky-500
      icon: <Shield />
    },
    {
      id: 'account',
      name: 'Account Agent',
      role: 'Creates and manages banking accounts',
      type: 'decision',
      color: '#10b981', // emerald-500
      icon: <Landmark />
    },
    {
      id: 'credit',
      name: 'Credit Agent',
      role: 'Evaluates creditworthiness and manages credit products',
      type: 'decision',
      color: '#ec4899', // pink-500
      icon: <CreditCard />
    },
    {
      id: 'security',
      name: 'Security Agent',
      role: 'Monitors for suspicious activities',
      type: 'core',
      color: '#ef4444', // red-500
      icon: <Key />
    },
    {
      id: 'data',
      name: 'Data Integration Agent',
      role: 'Manages data flow between systems',
      type: 'core',
      color: '#3b82f6', // blue-500
      icon: <Database />
    }
  ];
  
  // Define links between agents
  const links: Link[] = [
    { source: 'user', target: 'customer-service', strength: 1, status: 'active' },
    { source: 'customer-service', target: 'document', strength: 0.8, status: 'active' },
    { source: 'customer-service', target: 'account', strength: 0.8, status: 'active' },
    { source: 'customer-service', target: 'credit', strength: 0.8, status: 'active' },
    { source: 'document', target: 'kyc', strength: 0.9, status: 'active' },
    { source: 'kyc', target: 'security', strength: 0.7, status: 'active' },
    { source: 'kyc', target: 'account', strength: 0.6, status: 'active' },
    { source: 'account', target: 'credit', strength: 0.5, status: 'active' },
    { source: 'data', target: 'document', strength: 0.4, status: 'active' },
    { source: 'data', target: 'kyc', strength: 0.4, status: 'active' },
    { source: 'data', target: 'account', strength: 0.4, status: 'active' },
    { source: 'data', target: 'credit', strength: 0.4, status: 'active' },
    { source: 'security', target: 'customer-service', strength: 0.3, status: 'active' }
  ];
  
  // Set up the D3 force simulation
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Get dimensions
    const width = dimensions.width;
    const height = dimensions.height;
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
      
    // Create nodes with status
    const nodes: Node[] = agents.map(agent => ({
      ...agent,
      status: 'idle'
    }));
    
    // Create the force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links.map(link => ({
        ...link,
        source: nodes.findIndex(node => node.id === link.source),
        target: nodes.findIndex(node => node.id === link.target)
      })))
      .id((d: any) => d.id)
      .distance(100)
      .strength((d: any) => d.strength))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))
      .on('tick', ticked);
    
    // Add a background for the graph
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc') // slate-50
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#cbd5e1') // slate-300
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.strength) * 2);
    
    // Create a group for each node
    const nodeGroup = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        setSelectedNode(selectedNode === d.id ? null : d.id);
      });
    
    // Add a background circle for each node
    nodeGroup.append('circle')
      .attr('r', 30)
      .attr('fill', (d) => {
        return d.type === 'core' 
          ? '#eff6ff' // blue-50
          : d.type === 'processing'
          ? '#fff7ed' // orange-50
          : d.type === 'decision'
          ? '#ecfdf5' // emerald-50
          : '#f1f5f9'; // slate-100
      })
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2)
      .attr('class', 'node-circle');
    
    // Add a smaller circle with the node icon
    nodeGroup.each(function(d) {
      const node = d3.select(this);
      
      // Add icon background
      node.append('circle')
        .attr('r', 16)
        .attr('fill', (d) => d.color)
        .attr('class', 'icon-background');
      
      // Create a foreignObject for the React icon
      const fo = node.append('foreignObject')
        .attr('x', -12)
        .attr('y', -12)
        .attr('width', 24)
        .attr('height', 24);
      
      // Create a div inside the foreignObject
      const div = fo.append('xhtml:div')
        .style('width', '100%')
        .style('height', '100%')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('color', 'white');
      
      // Clone the React icon and add it to the div
      const iconElement = document.createElement('div');
      iconElement.style.display = 'flex';
      iconElement.style.alignItems = 'center';
      iconElement.style.justifyContent = 'center';
      
      // Render the icon (this is a simplified approach)
      if (d.id === 'user') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
      } else if (d.id === 'customer-service') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>';
      } else if (d.id === 'document') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>';
      } else if (d.id === 'kyc') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path><path d="M14 3v5h5M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path><path d="m22 22-3.5-3.5"></path></svg>';
      } else if (d.id === 'account') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="9" x2="9" y1="21" y2="9"></line></svg>';
      } else if (d.id === 'credit') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>';
      } else if (d.id === 'security') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>';
      } else if (d.id === 'data') {
        iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>';
      }
      
      div.node().appendChild(iconElement);
    });
    
    // Add a label with the node name
    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 45)
      .text((d) => d.name)
      .attr('fill', '#334155') // slate-700
      .attr('font-size', '12px')
      .style('pointer-events', 'none');
    
    // Status indicator
    nodeGroup.append('circle')
      .attr('r', 6)
      .attr('cx', 22)
      .attr('cy', -22)
      .attr('fill', '#94a3b8') // slate-400
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('class', 'status-indicator');
    
    // Add titles for tooltips
    nodeGroup.append('title')
      .text(d => `${d.name}\nRole: ${d.role}`);
    
    function ticked() {
      link
        .attr('x1', (d: any) => nodes[d.source.index].x!)
        .attr('y1', (d: any) => nodes[d.source.index].y!)
        .attr('x2', (d: any) => nodes[d.target.index].x!)
        .attr('y2', (d: any) => nodes[d.target.index].y!);
      
      nodeGroup
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    }
    
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Start with agents in specific positions
    nodes.forEach(node => {
      if (node.id === 'user') {
        node.x = width * 0.1;
        node.y = height * 0.5;
        node.fx = width * 0.1;
        node.fy = height * 0.5;
      } else if (node.id === 'customer-service') {
        node.x = width * 0.3;
        node.y = height * 0.3;
      } else if (node.id === 'document') {
        node.x = width * 0.3;
        node.y = height * 0.7;
      } else if (node.id === 'kyc') {
        node.x = width * 0.5;
        node.y = height * 0.7;
      } else if (node.id === 'account') {
        node.x = width * 0.7;
        node.y = height * 0.7;
      } else if (node.id === 'credit') {
        node.x = width * 0.7;
        node.y = height * 0.3;
      } else if (node.id === 'security') {
        node.x = width * 0.5;
        node.y = height * 0.2;
      } else if (node.id === 'data') {
        node.x = width * 0.5;
        node.y = height * 0.5;
      }
    });
    
    // Trigger simulation update
    simulation.alpha(1).restart();
    
    // Handle viewport resize
    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.parentElement?.clientWidth || dimensions.width;
        const containerHeight = svgRef.current.parentElement?.clientHeight || dimensions.height;
        
        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };
    
    // Initial call to set dimensions
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      simulation.stop();
    };
  }, [dimensions, agents, links, selectedNode]);
  
  // Monitor for audit trail events to trigger simulation
  useEffect(() => {
    if (auditTrail.length > 0 && svgRef.current) {
      const lastEvent = auditTrail[auditTrail.length - 1];
      
      // Don't re-trigger if we're already simulating
      if (isSimulating) return;
      
      // Check if the event should trigger agent interactions
      if (lastEvent.event.includes('Message') || 
          lastEvent.event.includes('Document') || 
          lastEvent.event.includes('Verification') ||
          lastEvent.event.includes('KYC')
      ) {
        simulateAgentActivity(lastEvent.event);
      }
    }
  }, [auditTrail, isSimulating]);
  
  // Simulate agent activity
  const simulateAgentActivity = (eventType: string) => {
    setIsSimulating(true);
    
    const svg = d3.select(svgRef.current);
    
    // Determine which agents are involved based on the event
    if (eventType.includes('Message')) {
      // User message flow: user -> customer service -> data -> document/account/credit
      updateAgentStatus('user', 'working');
      
      // Create a message animation from user to customer service
      animateMessage('user', 'customer-service', '#6366f1');
      
      setTimeout(() => {
        updateAgentStatus('user', 'idle');
        updateAgentStatus('customer-service', 'working');
        
        setTimeout(() => {
          animateMessage('customer-service', 'data', '#8b5cf6');
          
          setTimeout(() => {
            updateAgentStatus('data', 'working');
            
            setTimeout(() => {
              // Randomly choose a target agent
              const targetAgents = ['document', 'account', 'credit'];
              const target = targetAgents[Math.floor(Math.random() * targetAgents.length)];
              
              animateMessage('data', target, '#3b82f6');
              
              setTimeout(() => {
                updateAgentStatus('data', 'success');
                updateAgentStatus(target, 'working');
                
                setTimeout(() => {
                  updateAgentStatus(target, 'success');
                  
                  setTimeout(() => {
                    // Return all agents to idle
                    agents.forEach(agent => {
                      updateAgentStatus(agent.id, 'idle');
                    });
                    
                    setIsSimulating(false);
                  }, 1000);
                }, 1500);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    } else if (eventType.includes('Document')) {
      // Document flow: user -> document -> kyc -> account
      updateAgentStatus('user', 'working');
      animateMessage('user', 'document', '#6366f1');
      
      setTimeout(() => {
        updateAgentStatus('user', 'idle');
        updateAgentStatus('document', 'working');
        
        setTimeout(() => {
          updateAgentStatus('document', 'success');
          animateMessage('document', 'kyc', '#f97316');
          
          setTimeout(() => {
            updateAgentStatus('kyc', 'working');
            
            setTimeout(() => {
              updateAgentStatus('kyc', 'success');
              animateMessage('kyc', 'account', '#0ea5e9');
              
              setTimeout(() => {
                updateAgentStatus('account', 'working');
                
                setTimeout(() => {
                  updateAgentStatus('account', 'success');
                  
                  setTimeout(() => {
                    // Return all agents to idle
                    agents.forEach(agent => {
                      updateAgentStatus(agent.id, 'idle');
                    });
                    
                    setIsSimulating(false);
                  }, 1000);
                }, 1500);
              }, 1000);
            }, 1500);
          }, 1000);
        }, 1500);
      }, 1000);
    } else if (eventType.includes('KYC') || eventType.includes('Verification')) {
      // KYC flow: kyc -> security -> customer-service
      updateAgentStatus('kyc', 'working');
      
      setTimeout(() => {
        animateMessage('kyc', 'security', '#0ea5e9');
        
        setTimeout(() => {
          updateAgentStatus('security', 'working');
          
          setTimeout(() => {
            // Randomly decide if there's a security issue
            const securityIssue = Math.random() > 0.8;
            updateAgentStatus('security', securityIssue ? 'error' : 'success');
            
            setTimeout(() => {
              animateMessage('security', 'customer-service', securityIssue ? '#ef4444' : '#10b981');
              
              setTimeout(() => {
                updateAgentStatus('customer-service', 'working');
                
                setTimeout(() => {
                  updateAgentStatus('customer-service', 'success');
                  
                  setTimeout(() => {
                    // Return all agents to idle
                    agents.forEach(agent => {
                      updateAgentStatus(agent.id, 'idle');
                    });
                    
                    setIsSimulating(false);
                  }, 1000);
                }, 1500);
              }, 1000);
            }, 1000);
          }, 1500);
        }, 1000);
      }, 1000);
    } else {
      // Generic event - just animate a few random agents
      const randomAgents = [...agents]
        .filter(a => a.id !== 'user')
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(a => a.id);
      
      updateAgentStatus(randomAgents[0], 'working');
      
      setTimeout(() => {
        animateMessage(randomAgents[0], randomAgents[1], '#6366f1');
        
        setTimeout(() => {
          updateAgentStatus(randomAgents[0], 'success');
          updateAgentStatus(randomAgents[1], 'working');
          
          setTimeout(() => {
            animateMessage(randomAgents[1], randomAgents[2], '#8b5cf6');
            
            setTimeout(() => {
              updateAgentStatus(randomAgents[1], 'success');
              updateAgentStatus(randomAgents[2], 'working');
              
              setTimeout(() => {
                updateAgentStatus(randomAgents[2], 'success');
                
                setTimeout(() => {
                  // Return all agents to idle
                  agents.forEach(agent => {
                    updateAgentStatus(agent.id, 'idle');
                  });
                  
                  setIsSimulating(false);
                }, 1000);
              }, 1500);
            }, 1000);
          }, 1500);
        }, 1000);
      }, 1000);
    }
  };
  
  // Update agent status
  const updateAgentStatus = (agentId: string, status: 'idle' | 'working' | 'success' | 'error') => {
    const svg = d3.select(svgRef.current);
    
    // Find all node groups
    const nodeGroups = svg.selectAll('g').filter(function() {
      // Check if this is a node group with data
      const nodeData = d3.select(this).datum();
      return nodeData && typeof nodeData === 'object' && 'id' in nodeData && nodeData.id === agentId;
    });
    
    // Update status indicator color
    nodeGroups.select('.status-indicator')
      .transition()
      .duration(300)
      .attr('fill', status === 'idle' ? '#94a3b8' : 
                    status === 'working' ? '#3b82f6' :
                    status === 'success' ? '#10b981' : 
                    '#ef4444');
    
    // Pulse animation for working status
    if (status === 'working') {
      nodeGroups.select('.node-circle')
        .transition()
        .duration(800)
        .attr('stroke-width', 3)
        .style('stroke-opacity', 0.8)
        .transition()
        .duration(800)
        .attr('stroke-width', 2)
        .style('stroke-opacity', 1)
        .on('end', function repeat() {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('stroke-width', 3)
            .style('stroke-opacity', 0.8)
            .transition()
            .duration(800)
            .attr('stroke-width', 2)
            .style('stroke-opacity', 1)
            .on('end', repeat);
        });
    } else {
      // Stop any pulse animations
      nodeGroups.select('.node-circle')
        .transition()
        .duration(300)
        .attr('stroke-width', 2)
        .style('stroke-opacity', 1);
    }
  };
  
  // Animate a message between agents
  const animateMessage = (sourceId: string, targetId: string, color: string) => {
    const svg = d3.select(svgRef.current);
    
    // Find source and target coordinates
    const nodes = agents.map(a => ({
      ...a,
      x: 0,
      y: 0
    }));
    
    // Find all node groups and get their positions
    svg.selectAll('g').each(function() {
      const nodeData = d3.select(this).datum() as any;
      if (nodeData && nodeData.id) {
        const transform = d3.select(this).attr('transform');
        if (transform) {
          // Extract translate values from transform attribute
          const translateMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
          if (translateMatch && translateMatch.length === 3) {
            const x = parseFloat(translateMatch[1]);
            const y = parseFloat(translateMatch[2]);
            
            // Update node coordinates
            const nodeIndex = nodes.findIndex(n => n.id === nodeData.id);
            if (nodeIndex !== -1) {
              nodes[nodeIndex].x = x;
              nodes[nodeIndex].y = y;
            }
          }
        }
      }
    });
    
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    
    if (!source || !target || typeof source.x !== 'number' || typeof source.y !== 'number' || 
        typeof target.x !== 'number' || typeof target.y !== 'number') {
      console.error('Could not find source or target coordinates for message animation');
      return;
    }
    
    // Calculate control point for curved path
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2 - 30; // Offset to create curve
    
    // Create a curved path for the message to follow
    const path = svg.append('path')
      .attr('d', `M${source.x},${source.y} Q${midX},${midY} ${target.x},${target.y}`)
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('id', `message-path-${Date.now()}`); // Unique ID
    
    // Create a message circle
    const message = svg.append('circle')
      .attr('r', 8)
      .attr('fill', color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);
    
    // Add glow effect filter
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', `glow-${Date.now()}`)
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
      
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
      
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');
    
    message.attr('filter', `url(#glow-${Date.now()})`);
    
    // Animate message along the path
    const pathLength = path.node()!.getTotalLength();
    
    message.transition()
      .duration(1000)
      .attrTween('transform', function() {
        return function(t) {
          const point = path.node()!.getPointAtLength(t * pathLength);
          return `translate(${point.x}, ${point.y})`;
        };
      })
      .on('end', function() {
        // Remove the message and path after animation is complete
        message.remove();
        path.remove();
        defs.remove();
      });
  };
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
        const containerHeight = svgRef.current.parentElement?.clientHeight || 600;
        
        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };
    
    // Initial call to set dimensions
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="font-medium text-indigo-900">Agent Network Visualization</h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Core</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Processing</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Decision</span>
            </div>
          </div>
          
          <button 
            className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md"
            onClick={() => {
              const randomEvent = ['User Message', 'Document Verification', 'KYC Check'][Math.floor(Math.random() * 3)];
              simulateAgentActivity(randomEvent);
            }}
            disabled={isSimulating}
          >
            Simulate Activity
          </button>
        </div>
      </div>
      
      <div className="p-4 h-[500px] relative">
        <svg 
          ref={svgRef} 
          className="w-full h-full"
          style={{ maxHeight: 'calc(100% - 10px)' }}
        ></svg>
        
        {/* Selected node information panel */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 p-4 bg-white rounded-lg border border-gray-200 shadow-md max-w-xs">
            {agents.filter(a => a.id === selectedNode).map(agent => (
              <div key={agent.id}>
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: `${agent.color}20`, color: agent.color }}>
                    {agent.icon}
                  </div>
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span>Type: <span className="font-medium capitalize">{agent.type}</span></span>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                    onClick={() => setSelectedNode(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Loading overlay for simulating */}
        {isSimulating && !selectedNode && (
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-900 bg-opacity-10">
            <div className="bg-white p-3 rounded-lg shadow-lg flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-3"></div>
              <p className="text-sm text-indigo-900">Agents communicating...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default D3AgentNetworkVisualization;