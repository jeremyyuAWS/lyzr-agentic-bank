import React, { useRef, useEffect, useState } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import * as d3 from 'd3';
import { 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  PieChart, 
  Map, 
  Calendar, 
  Clock, 
  TrendingUp,
  User,
  CreditCard,
  ExternalLink,
  Undo2,
  Info
} from 'lucide-react';

// Define pattern types for fraud detection
interface PatternNode {
  id: string;
  name: string;
  category: 'transaction' | 'login' | 'device' | 'location' | 'account' | 'pattern';
  count: number;
  abnormalityScore: number; // 0-100
  description: string;
  details?: string[];
  relatedNodes?: string[];
}

const FraudDetectionVisualization: React.FC = () => {
  const { auditTrail } = useBankingContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [patternNodes, setPatternNodes] = useState<PatternNode[]>([]);
  const [viewMode, setViewMode] = useState<'network' | 'stats'>('network');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate mock pattern nodes
  useEffect(() => {
    const mockPatterns: PatternNode[] = [
      {
        id: 'multi-device-access',
        name: 'Multi-Device Access',
        category: 'pattern',
        count: 3,
        abnormalityScore: 75,
        description: 'Account accessed from multiple devices in different locations within short timeframe',
        details: [
          'Windows PC in New York - 10:15 AM',
          'Android Device in Chicago - 10:23 AM', 
          'iPhone in Los Angeles - 10:42 AM'
        ],
        relatedNodes: ['login-attempts', 'high-risk-locations', 'new-device-registration']
      },
      {
        id: 'login-attempts',
        name: 'Failed Login Attempts',
        category: 'login',
        count: 5,
        abnormalityScore: 85,
        description: 'Multiple failed login attempts followed by successful access',
        details: [
          '5 failed attempts in 3 minutes', 
          'Password finally succeeded on 6th attempt', 
          'No 2FA challenge response'
        ],
        relatedNodes: ['multi-device-access', 'credential-stuffing']
      },
      {
        id: 'transaction-velocity',
        name: 'Transaction Velocity',
        category: 'transaction',
        count: 12,
        abnormalityScore: 92,
        description: 'High number of transactions in short time period',
        details: [
          '12 transactions in 4 minutes',
          'Total value: $4,359.28',
          'Spread across multiple merchants'
        ],
        relatedNodes: ['unusual-merchants', 'card-testing']
      },
      {
        id: 'high-risk-locations',
        name: 'High-Risk Locations',
        category: 'location',
        count: 2,
        abnormalityScore: 68,
        description: 'Transactions from countries associated with higher fraud rates',
        details: [
          'IP address from Lagos, Nigeria',
          'Transaction attempted in Moscow, Russia'
        ],
        relatedNodes: ['multi-device-access', 'login-attempts']
      },
      {
        id: 'new-device-registration',
        name: 'New Device Registration',
        category: 'device',
        count: 3,
        abnormalityScore: 45,
        description: 'Multiple new devices registered to account recently',
        details: [
          'New Android device added yesterday',
          'New Windows PC added 3 days ago',
          'New iPhone added today'
        ],
        relatedNodes: ['multi-device-access']
      },
      {
        id: 'unusual-merchants',
        name: 'Unusual Merchant Categories',
        category: 'transaction',
        count: 8,
        abnormalityScore: 65,
        description: 'Transactions in merchant categories not typically used by customer',
        details: [
          'Multiple electronics retailers',
          'Online gaming/gambling sites',
          'Digital goods/gift cards'
        ],
        relatedNodes: ['transaction-velocity', 'card-testing']
      },
      {
        id: 'card-testing',
        name: 'Card Testing Pattern',
        category: 'pattern',
        count: 4,
        abnormalityScore: 88,
        description: 'Small test transactions followed by larger purchases',
        details: [
          '$1.00 test transaction at digital goods merchant',
          '$3.51 test transaction at gas station',
          'Followed by $899.99 at electronics store'
        ],
        relatedNodes: ['transaction-velocity', 'unusual-merchants']
      },
      {
        id: 'credential-stuffing',
        name: 'Credential Stuffing',
        category: 'pattern',
        count: 1,
        abnormalityScore: 95,
        description: 'Pattern consistent with automated credential stuffing attack',
        details: [
          'Multiple login attempts with different password variations',
          'Systematic password pattern detected',
          'Access attempts from multiple IP addresses'
        ],
        relatedNodes: ['login-attempts', 'account-takeover']
      },
      {
        id: 'account-takeover',
        name: 'Account Takeover',
        category: 'account',
        count: 1,
        abnormalityScore: 90,
        description: 'Signs of account takeover including unusual account changes',
        details: [
          'Email address changed within last 24 hours',
          'Phone number updated within last 24 hours',
          'Password reset within last 48 hours'
        ],
        relatedNodes: ['credential-stuffing', 'profile-changes']
      },
      {
        id: 'profile-changes',
        name: 'Profile Information Changes',
        category: 'account',
        count: 4,
        abnormalityScore: 60,
        description: 'Multiple profile information changes in short timeframe',
        details: [
          'Address changed to out-of-state location',
          'Contact preferences modified',
          'Security questions updated'
        ],
        relatedNodes: ['account-takeover']
      }
    ];
    
    setPatternNodes(mockPatterns);
  }, []);

  // Initialize the D3 force simulation
  useEffect(() => {
    if (!svgRef.current || patternNodes.length === 0) return;
    
    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create an array of links from relatedNodes
    const links: {source: string, target: string, value: number}[] = [];
    patternNodes.forEach(node => {
      if (node.relatedNodes) {
        node.relatedNodes.forEach(relatedNode => {
          links.push({
            source: node.id,
            target: relatedNode,
            value: 1
          });
        });
      }
    });
    
    // Create nodes with proper D3 simulation properties
    const nodes = patternNodes.map(node => ({
      ...node,
      x: undefined,
      y: undefined,
      radius: Math.max(30, Math.min(50, 20 + node.abnormalityScore / 5))
    }));
    
    // SVG setup
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);
      
    // Create background
    svg.append('rect')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('fill', '#f8fafc') // slate-50
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 10))
      .on('tick', ticked);
    
    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#cbd5e1') // slate-300
      .attr('stroke-opacity', 0.7)
      .attr('stroke-width', 1.5);
    
    // Create node groups
    const nodeGroups = svg.append('g')
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('click', (event, d) => {
        setSelectedNode(selectedNode === d.id ? null : d.id);
      })
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles for each node
    nodeGroups.append('circle')
      .attr('r', (d: any) => d.radius)
      .attr('fill', (d: any) => {
        if (d.abnormalityScore >= 80) return '#fee2e2'; // red-100
        if (d.abnormalityScore >= 60) return '#ffedd5'; // orange-100
        if (d.abnormalityScore >= 40) return '#fef9c3'; // yellow-100
        return '#dbeafe'; // blue-100
      })
      .attr('stroke', (d: any) => {
        if (d.abnormalityScore >= 80) return '#ef4444'; // red-500
        if (d.abnormalityScore >= 60) return '#f97316'; // orange-500
        if (d.abnormalityScore >= 40) return '#eab308'; // yellow-500
        return '#3b82f6'; // blue-500
      })
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer');
      
    // Add icons to nodes
    nodeGroups.each(function(d: any) {
      const group = d3.select(this);
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      icon.setAttribute('width', '20');
      icon.setAttribute('height', '20');
      icon.setAttribute('x', '-10');
      icon.setAttribute('y', '-10');
      
      const iconDiv = document.createElement('div');
      iconDiv.style.width = '100%';
      iconDiv.style.height = '100%';
      iconDiv.style.display = 'flex';
      iconDiv.style.alignItems = 'center';
      iconDiv.style.justifyContent = 'center';
      
      let iconColor = d.abnormalityScore >= 80 ? '#ef4444' : // red-500
                    d.abnormalityScore >= 60 ? '#f97316' : // orange-500
                    d.abnormalityScore >= 40 ? '#eab308' : // yellow-500
                    '#3b82f6'; // blue-500
      
      iconDiv.style.color = iconColor;
      
      // Decide which icon to use based on category
      let iconSvg = '';
      switch(d.category) {
        case 'transaction':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>';
          break;
        case 'login':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>';
          break;
        case 'device':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
          break;
        case 'location':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';
          break;
        case 'account':
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
          break;
        case 'pattern':
        default:
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>';
      }
      
      iconDiv.innerHTML = iconSvg;
      icon.appendChild(iconDiv);
      this.appendChild(icon);
    });
      
    // Add labels
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.radius + 15)
      .text((d: any) => d.name)
      .attr('fill', '#334155') // slate-700
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');
      
    // Add count labels
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.radius + 30)
      .text((d: any) => `Count: ${d.count}`)
      .attr('fill', '#64748b') // slate-500
      .attr('font-size', '9px')
      .attr('pointer-events', 'none');
    
    // Tooltip/title
    nodeGroups.append('title')
      .text((d: any) => `${d.name}\nAbnormality: ${d.abnormalityScore}%\n${d.description}`);
    
    // Tick function for simulation
    function ticked() {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      
      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    }
    
    // Drag functions
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
    
    // Handle window resize
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
  }, [patternNodes, dimensions, selectedNode]);
  
  // Simulate fraud detection processing when triggered by audit trail
  useEffect(() => {
    // Detect fraud-related audit events
    const fraudRelatedEvents = auditTrail.filter(event => 
      event.event.includes('Login') || 
      event.event.includes('Transaction') || 
      event.event.includes('Document') ||
      event.event.includes('Device') ||
      event.event.includes('Verification')
    );
    
    // If we have recent fraud-related events, trigger a processing animation
    if (fraudRelatedEvents.length > 0 && !isProcessing) {
      const latestEvent = fraudRelatedEvents[fraudRelatedEvents.length - 1];
      
      // Extract a timestamp from the past 5 minutes to simulate a recent event
      const eventTime = new Date(Date.now() - Math.floor(Math.random() * 5 * 60 * 1000));
      
      // Simulate processing
      setIsProcessing(true);
      
      // After processing, update the visualization
      setTimeout(() => {
        setIsProcessing(false);
        
        // Add a new pattern node if appropriate
        if (Math.random() > 0.5) {
          const newPatternTypes = [
            {
              id: 'rapid-balance-check',
              name: 'Rapid Balance Checks',
              category: 'pattern' as const,
              count: 8,
              abnormalityScore: 55 + Math.floor(Math.random() * 20),
              description: 'Multiple balance checks in short time period before transaction',
              details: [
                '8 balance checks in 3 minutes',
                'Followed by withdrawal attempt',
                'Pattern consistent with account probing'
              ],
              relatedNodes: ['transaction-velocity', 'new-device-registration']
            },
            {
              id: 'cross-border-transactions',
              name: 'Cross-Border Activity',
              category: 'transaction' as const,
              count: 2,
              abnormalityScore: 65 + Math.floor(Math.random() * 20),
              description: 'Transactions initiated across multiple countries in short timeframe',
              details: [
                'Login from United States',
                'Transaction initiated from Europe',
                'Time between events: 30 minutes'
              ],
              relatedNodes: ['high-risk-locations', 'transaction-velocity']
            },
            {
              id: 'weekend-activity',
              name: 'Unusual Time Pattern',
              category: 'pattern' as const,
              count: 5,
              abnormalityScore: 40 + Math.floor(Math.random() * 30),
              description: 'Account activity during unusual hours for this customer',
              details: [
                'Activity at 3:45 AM local time',
                'No previous history of late-night access',
                'Multiple transactions during abnormal hours'
              ],
              relatedNodes: ['transaction-velocity', 'login-attempts']
            }
          ];
          
          const newPattern = newPatternTypes[Math.floor(Math.random() * newPatternTypes.length)];
          
          // Check if this pattern already exists
          if (!patternNodes.find(p => p.id === newPattern.id)) {
            setPatternNodes(prev => [...prev, newPattern]);
          }
        }
      }, 3000);
    }
  }, [auditTrail, isProcessing, patternNodes]);
  
  // Helper function to get the category icon
  const getCategoryIcon = (category: PatternNode['category']) => {
    switch(category) {
      case 'transaction':
        return <Activity className="h-5 w-5" />;
      case 'login':
        return <User className="h-5 w-5" />;
      case 'device':
        return <CreditCard className="h-5 w-5" />;
      case 'location':
        return <Map className="h-5 w-5" />;
      case 'account':
        return <TrendingUp className="h-5 w-5" />;
      case 'pattern':
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };
  
  // Helper function to get the abnormality color
  const getAbnormalityColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };
  
  // Helper function to render statistics
  const renderStatistics = () => {
    // Count patterns by category
    const categoryCounts: Record<string, number> = {};
    patternNodes.forEach(node => {
      categoryCounts[node.category] = (categoryCounts[node.category] || 0) + 1;
    });
    
    // Calculate average abnormality scores
    const avgAbnormality = patternNodes.reduce((sum, node) => sum + node.abnormalityScore, 0) / patternNodes.length;
    
    // Get nodes sorted by abnormality
    const topRiskPatterns = [...patternNodes].sort((a, b) => b.abnormalityScore - a.abnormalityScore).slice(0, 3);
    
    return (
      <div className="space-y-6 h-full overflow-y-auto">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Detected Patterns</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{patternNodes.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total abnormal patterns</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 text-orange-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Risk Level</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{Math.round(avgAbnormality)}%</p>
            <p className="text-xs text-gray-500 mt-1">Average abnormality score</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Time Period</h4>
            </div>
            <p className="text-lg font-bold text-gray-900">Last 24 Hours</p>
            <p className="text-xs text-gray-500 mt-1">Detection window</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Detection Rate</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">98.2%</p>
            <p className="text-xs text-gray-500 mt-1">True positive rate</p>
          </div>
        </div>
        
        {/* Highest Risk Patterns */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Highest Risk Patterns</h3>
          <div className="space-y-3">
            {topRiskPatterns.map(pattern => (
              <div 
                key={pattern.id}
                className={`p-4 rounded-lg border ${getAbnormalityColor(pattern.abnormalityScore)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getCategoryIcon(pattern.category)}
                    <h4 className="font-medium ml-2">{pattern.name}</h4>
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-white">
                    {pattern.abnormalityScore}% Abnormal
                  </div>
                </div>
                
                <p className="text-sm mb-3">{pattern.description}</p>
                
                {pattern.details && (
                  <div className="text-xs space-y-1">
                    {pattern.details.map((detail, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-current mr-1.5"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Pattern Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Pattern Categories</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center">
                    {getCategoryIcon(category as PatternNode['category'])}
                    <h5 className="text-sm font-medium text-gray-900 ml-2 capitalize">{category}</h5>
                  </div>
                  <p className="text-lg font-bold mt-1">{count} {count === 1 ? 'pattern' : 'patterns'}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{width: `${(count / patternNodes.length) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Time Distribution */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Time Distribution</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="h-40 relative">
              {/* Simple mock chart bars */}
              <div className="absolute inset-0 flex items-end space-x-2 pb-8">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-indigo-100 rounded-t-sm relative"
                    style={{ 
                      height: `${Math.max(10, Math.min(100, (i === 3 || i === 15 || i === 22) ? 80 : Math.random() * 30))}%`,
                      backgroundColor: (i === 3 || i === 15 || i === 22) ? '#e0f2fe' : '#dbeafe'
                    }}
                  >
                    {(i === 3 || i === 15 || i === 22) && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-500 w-2 h-2 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-between text-xs text-gray-500">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              Red indicators show times with highest abnormal activity
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
          <div>
            <h3 className="font-medium text-indigo-900">AI Fraud Detection Patterns</h3>
            <p className="text-xs text-indigo-700">
              Visualizing abnormal patterns and fraud indicators
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 text-sm border ${
              viewMode === 'network'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-md transition-colors`}
            onClick={() => setViewMode('network')}
          >
            Network View
          </button>
          
          <button
            className={`px-3 py-1.5 text-sm border ${
              viewMode === 'stats'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-md transition-colors`}
            onClick={() => setViewMode('stats')}
          >
            Statistics View
          </button>
          
          <button
            className={`px-3 py-1.5 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md flex items-center`}
            onClick={() => {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
              }, 3000);
            }}
            disabled={isProcessing}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? 'Processing...' : 'Analyze Now'}
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">High Risk (80-100%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Medium Risk (60-79%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Low Risk (40-59%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">Very Low Risk (0-39%)</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
            <span className="text-xs text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 relative">
        {viewMode === 'network' ? (
          <React.Fragment>
            <svg 
              ref={svgRef} 
              width={dimensions.width}
              height={dimensions.height}
              className="mx-auto"
            ></svg>
            
            {/* Selected node details panel */}
            {selectedNode && (
              <div className="absolute right-4 top-4 w-72 bg-white rounded-lg border border-gray-200 shadow-lg p-4">
                {patternNodes.filter(node => node.id === selectedNode).map(node => (
                  <div key={node.id}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="p-1 rounded-full mr-2" style={{
                          backgroundColor: node.abnormalityScore >= 80 ? '#fee2e2' : // red-100
                                        node.abnormalityScore >= 60 ? '#ffedd5' : // orange-100
                                        node.abnormalityScore >= 40 ? '#fef9c3' : // yellow-100
                                        '#dbeafe' // blue-100
                        }}>
                          {getCategoryIcon(node.category)}
                        </div>
                        <h3 className="font-medium text-gray-900">{node.name}</h3>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setSelectedNode(null)}
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className={`p-2 rounded-lg mb-3 text-xs ${getAbnormalityColor(node.abnormalityScore)}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Abnormality Score</span>
                        <span className="font-bold">{node.abnormalityScore}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-40 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            node.abnormalityScore >= 80 ? 'bg-red-500' :
                            node.abnormalityScore >= 60 ? 'bg-orange-500' :
                            node.abnormalityScore >= 40 ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${node.abnormalityScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600">{node.description}</p>
                    </div>
                    
                    {node.details && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Details</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {node.details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 mr-1.5 flex-shrink-0"></div>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {node.relatedNodes && node.relatedNodes.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-700 mb-1">Related Patterns</h4>
                        <div className="flex flex-wrap gap-2">
                          {node.relatedNodes.map(relatedId => {
                            const relatedNode = patternNodes.find(p => p.id === relatedId);
                            return relatedNode ? (
                              <button 
                                key={relatedId}
                                className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                onClick={() => setSelectedNode(relatedId)}
                              >
                                {relatedNode.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View Full Details
                      </button>
                      
                      <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center">
                        <Undo2 className="h-3.5 w-3.5 mr-1" />
                        Mark as Reviewed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ) : (
          renderStatistics()
        )}
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <h3 className="text-lg font-medium text-indigo-900 mb-2">AI Analysis in Progress</h3>
            <p className="text-indigo-600 text-sm max-w-xs text-center">
              Analyzing transaction patterns, login behavior, and account activity to detect potential fraud
            </p>
          </div>
        )}
      </div>
      
      {/* Info footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Info className="h-3.5 w-3.5 text-gray-400 mr-1.5" />
          <span>Patterns are analyzed in real-time as new activity occurs</span>
        </div>
        
        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
          <ExternalLink className="h-3.5 w-3.5 mr-1" />
          View Detection Rules
        </a>
      </div>
    </div>
  );
};

export default FraudDetectionVisualization;