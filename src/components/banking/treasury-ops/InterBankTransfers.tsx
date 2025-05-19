import React, { useState, useEffect, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  Landmark, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import * as d3 from 'd3';
import { InterBankTransfer } from '../../../types/banking';

// D3 visualization component for transfer network graph
const BankNetworkGraph: React.FC<{
  transfers: InterBankTransfer[],
  width: number,
  height: number
}> = ({ transfers, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !transfers || transfers.length === 0) return;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Extract all unique banks
    const banks = Array.from(new Set([
      ...transfers.map(t => t.fromBank),
      ...transfers.map(t => t.toBank)
    ]));
    
    // Create links data
    const links = transfers.map(t => ({
      source: t.fromBank,
      target: t.toBank,
      value: t.amount,
      status: t.status,
      id: t.id
    }));
    
    // Create transfer volume by bank
    const bankVolumes: {[key: string]: number} = {};
    banks.forEach(bank => {
      const outgoing = transfers
        .filter(t => t.fromBank === bank)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const incoming = transfers
        .filter(t => t.toBank === bank)
        .reduce((sum, t) => sum + t.amount, 0);
        
      bankVolumes[bank] = outgoing + incoming;
    });
    
    // Setup the SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Add a background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f8fafc') // slate-50
      .attr('rx', 8)
      .attr('ry', 8);
    
    // Create a simulation
    const simulation = d3.forceSimulation(banks.map(name => ({ id: name })))
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));
    
    // Create links
    const link = svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('stroke', (d: any) => {
        if (d.status === 'completed') return '#10b981'; // green-500
        if (d.status === 'failed') return '#ef4444';    // red-500
        if (d.status === 'returned') return '#f97316'; // orange-500
        return '#6366f1'; // indigo-500
      })
      .attr('stroke-width', (d: any) => Math.log(d.value) * 0.000000005)
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none')
      .attr('marker-end', (d: any) => {
        if (d.status === 'completed') return 'url(#completed)';
        if (d.status === 'failed') return 'url(#failed)';
        if (d.status === 'returned') return 'url(#returned)';
        return 'url(#pending)';
      });
    
    // Create arrow markers
    const defs = svg.append('defs');
    
    const createMarker = (id: string, color: string) => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', color)
        .attr('d', 'M0,-5L10,0L0,5');
    };
    
    createMarker('completed', '#10b981');
    createMarker('failed', '#ef4444');
    createMarker('returned', '#f97316');
    createMarker('pending', '#6366f1');
    
    // Create nodes
    const node = svg.append('g')
      .selectAll('.node')
      .data(banks.map(name => ({ id: name })))
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', (d: any) => {
        const volume = bankVolumes[d.id] || 0;
        return 15 + Math.log(volume) * 0.000000003;
      })
      .attr('fill', '#e0e7ff') // indigo-100
      .attr('stroke', '#6366f1') // indigo-500
      .attr('stroke-width', 2);
    
    // Add text labels
    node.append('text')
      .attr('dx', 0)
      .attr('dy', -20)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.id.split(' ')[0]) // First word of bank name
      .attr('fill', '#1e293b') // slate-800
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');
    
    // Add bank icons
    node.append('text')
      .attr('dx', 0)
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .text('🏦')
      .attr('fill', '#6366f1'); // indigo-500
    
    // Create ticked function
    function ticked() {
      link.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // curve factor
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      
      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    }
    
    simulation.nodes(banks.map(name => ({ id: name })) as any)
      .on('tick', ticked);
    
    (simulation.force('link') as d3.ForceLink<any, any>)
      .links(links);
    
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${height - 100})`);
    
    const legendData = [
      { label: 'Completed Transfer', color: '#10b981' },
      { label: 'Pending Transfer', color: '#6366f1' },
      { label: 'Failed Transfer', color: '#ef4444' },
      { label: 'Returned Transfer', color: '#f97316' },
    ];
    
    legendData.forEach((item, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendItem.append('line')
        .attr('x1', 0)
        .attr('y1', 5)
        .attr('x2', 20)
        .attr('y2', 5)
        .attr('stroke', item.color)
        .attr('stroke-width', 2);
      
      legendItem.append('text')
        .attr('x', 25)
        .attr('y', 9)
        .attr('font-size', '10px')
        .attr('fill', '#64748b') // slate-500
        .text(item.label);
    });
    
    return () => {
      simulation.stop();
    };
  }, [transfers, width, height]);

  return <svg ref={svgRef} />;
};

const InterBankTransfers: React.FC = () => {
  const { interBankTransfers, updateTreasuryData } = useBankingContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTransfer, setExpandedTransfer] = useState<string | null>(null);
  
  // Filter transfers
  const filteredTransfers = interBankTransfers.filter(transfer => {
    // Apply status filter
    if (statusFilter !== 'all' && transfer.status !== statusFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transfer.id.toLowerCase().includes(query) ||
        transfer.fromBank.toLowerCase().includes(query) ||
        transfer.toBank.toLowerCase().includes(query) ||
        transfer.reference.toLowerCase().includes(query) ||
        transfer.purpose.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get status badge
  const getStatusBadge = (status: InterBankTransfer['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </span>
        );
      case 'returned':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Returned
          </span>
        );
      default:
        return null;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: InterBankTransfer['priority']) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
            High
          </span>
        );
      case 'normal':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            Normal
          </span>
        );
      default:
        return null;
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    updateTreasuryData();
    setTimeout(() => setIsLoading(false), 1000);
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Landmark className="h-6 w-6 text-indigo-600 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-indigo-900">InterBank Transfers</h2>
              <p className="text-sm text-indigo-700">Manage and monitor correspondent banking and liquidity transfers</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search transfers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-500 mr-1.5" />
              <span className="text-xs text-gray-600 mr-2">Status:</span>
            </div>
            
            <div className="flex space-x-1 overflow-x-auto">
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'all' 
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All Transfers
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'completed' 
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('completed')}
              >
                <CheckCircle className="inline-block h-3 w-3 mr-1" />
                Completed
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'processing' 
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('processing')}
              >
                <RefreshCw className="inline-block h-3 w-3 mr-1" />
                Processing
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('pending')}
              >
                <Clock className="inline-block h-3 w-3 mr-1" />
                Pending
              </button>
              
              <button
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  statusFilter === 'failed' 
                    ? 'bg-red-100 text-red-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setStatusFilter('failed')}
              >
                <XCircle className="inline-block h-3 w-3 mr-1" />
                Failed
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
        {/* Transfer Network Visualization */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Transfer Network</h3>
          <div className="h-[400px]">
            <BankNetworkGraph 
              transfers={interBankTransfers}
              width={600}
              height={400}
            />
          </div>
        </div>
        
        {/* Transfer List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Recent Transfers</h3>
            <p className="text-sm text-gray-500">Showing {filteredTransfers.length} of {interBankTransfers.length} transfers</p>
          </div>
          
          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            {filteredTransfers.map(transfer => (
              <div 
                key={transfer.id} 
                className={`border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors ${
                  expandedTransfer === transfer.id ? 'bg-indigo-50' : ''
                }`}
              >
                <div 
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => setExpandedTransfer(expandedTransfer === transfer.id ? null : transfer.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {transfer.fromBank} → {transfer.toBank}
                        </span>
                        {getStatusBadge(transfer.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(transfer.settlementDate)}
                        </span>
                        <span className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          {transfer.type.toUpperCase()}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(transfer.amount, transfer.currency)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {getPriorityBadge(transfer.priority)}
                    </div>
                  </div>
                </div>
                
                {/* Expanded view */}
                {expandedTransfer === transfer.id && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Transfer ID</p>
                        <p className="text-sm font-medium">{transfer.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Reference</p>
                        <p className="text-sm font-medium">{transfer.reference}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Settlement Date</p>
                        <p className="text-sm font-medium">{formatDate(transfer.settlementDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Value Date</p>
                        <p className="text-sm font-medium">{formatDate(transfer.valueDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Purpose</p>
                        <p className="text-sm font-medium">{transfer.purpose}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Fees</p>
                        <p className="text-sm font-medium">
                          {transfer.fees ? formatCurrency(transfer.fees, transfer.currency) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {transfer.status === 'failed' && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Transfer Failed</p>
                            <p className="text-xs text-red-700 mt-0.5">
                              Reason: Insufficient funds in correspondent account
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {transfer.status === 'returned' && (
                      <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">Transfer Returned</p>
                            <p className="text-xs text-orange-700 mt-0.5">
                              Reason: Invalid beneficiary account information
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <button className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                        View Full Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterBankTransfers;