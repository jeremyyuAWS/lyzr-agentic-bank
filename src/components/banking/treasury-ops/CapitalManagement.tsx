import React, { useState, useEffect, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { Landmark as Landmark2, PieChart, RefreshCw, Download, TrendingUp, BarChart, ArrowRight, BarChart2 } from 'lucide-react';
import { generateCapitalAllocation } from '../../../data/mockTreasuryData';
import * as d3 from 'd3';

// D3 component for capital allocation sunburst chart
const CapitalAllocationChart: React.FC<{
  data: {
    businessUnit: string;
    allocatedCapital: number;
    riskWeightedAssets: number;
    returnOnAllocatedCapital: number;
  }[];
  width: number;
  height: number;
}> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Define dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create a group for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.businessUnit))
      .range([0, innerWidth])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.allocatedCapital) || 0])
      .range([innerHeight, 0]);
    
    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.businessUnit))
      .range(['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']);
    
    // Create X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('y', 10)
      .attr('x', -5)
      .attr('transform', 'rotate(-25)')
      .attr('text-anchor', 'end')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    // Create Y axis with formatted values
    const formatCapital = (value: number) => {
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toLocaleString()}`;
    };
    
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => formatCapital(d as number)))
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    // Create bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.businessUnit) || 0)
      .attr('y', d => yScale(d.allocatedCapital))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.allocatedCapital))
      .attr('fill', d => colorScale(d.businessUnit))
      .attr('rx', 3)
      .attr('ry', 3);
    
    // Add ROAC as text on bars
    g.selectAll('.bar-text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-text')
      .attr('x', d => (xScale(d.businessUnit) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.allocatedCapital) - 5)
      .attr('text-anchor', 'middle')
      .text(d => `${(d.returnOnAllocatedCapital * 100).toFixed(1)}%`)
      .attr('fill', '#4B5563')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');
    
    // Add axis labels
    // X axis label
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2},${innerHeight + 35})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4B5563')
      .attr('font-size', '12px')
      .text('Business Unit');
    
    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4B5563')
      .attr('font-size', '12px')
      .text('Allocated Capital');
  }, [data, width, height]);
  
  return <svg ref={svgRef} />;
};

// D3 component for ROAC-RWA bubble chart
const ROACvsRWABubbleChart: React.FC<{
  data: {
    businessUnit: string;
    allocatedCapital: number;
    riskWeightedAssets: number;
    returnOnAllocatedCapital: number;
    capitalEfficiency: number;
  }[];
  width: number;
  height: number;
}> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Define dimensions
    const margin = { top: a20, right: 80, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create a group for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.riskWeightedAssets) || 0])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.returnOnAllocatedCapital) || 0])
      .range([innerHeight, 0]);
    
    const bubbleScale = d3.scaleSqrt()
      .domain([d3.min(data, d => d.allocatedCapital) || 0, d3.max(data, d => d.allocatedCapital) || 0])
      .range([10, 40]);
    
    // Color scale
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([
        d3.min(data, d => d.capitalEfficiency) || 0, 
        d3.max(data, d => d.capitalEfficiency) || 1
      ]);
    
    // Create X axis with formatted values
    const formatRWA = (value: number) => {
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toLocaleString()}`;
    };
    
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => formatRWA(d as number)))
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    // Create Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${(+d * 100).toFixed(1)}%`))
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    // Create bubbles
    const bubbles = g.selectAll('.bubble')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.riskWeightedAssets))
      .attr('cy', d => yScale(d.returnOnAllocatedCapital))
      .attr('r', d => bubbleScale(d.allocatedCapital))
      .attr('fill', d => colorScale(d.capitalEfficiency))
      .attr('stroke', '#FFF')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8);
    
    // Add labels inside bubbles
    g.selectAll('.bubble-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bubble-label')
      .attr('x', d => xScale(d.riskWeightedAssets))
      .attr('y', d => yScale(d.returnOnAllocatedCapital))
      .attr('text-anchor', 'middle')
      .attr('dy', '.3em')
      .text(d => d.businessUnit.split(' ')[0]) // First word only for space reasons
      .attr('fill', '#FFF')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');
    
    // Add axis labels
    // X axis label
    g.append('text')
      .attr('transform', `translate(${innerWidth / 2},${innerHeight + 40})`)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4B5563')
      .attr('font-size', '12px')
      .text('Risk-Weighted Assets (RWA)');
    
    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4B5563')
      .attr('font-size', '12px')
      .text('Return on Allocated Capital (ROAC)');
      
    // Add legend for bubble size
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
    
    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#4B5563')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text('Allocated Capital');
    
    // Small bubble
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 20)
      .attr('r', 5)
      .attr('fill', 'none')
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1);
    
    legend.append('text')
      .attr('x', 20)
      .attr('y', 23)
      .attr('fill', '#6B7280')
      .attr('font-size', '9px')
      .text('$1B');
    
    // Medium bubble
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 40)
      .attr('r', 10)
      .attr('fill', 'none')
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1);
    
    legend.append('text')
      .attr('x', 25)
      .attr('y', 43)
      .attr('fill', '#6B7280')
      .attr('font-size', '9px')
      .text('$4B');
    
    // Large bubble
    legend.append('circle')
      .attr('cx', 10)
      .attr('cy', 65)
      .attr('r', 15)
      .attr('fill', 'none')
      .attr('stroke', '#6B7280')
      .attr('stroke-width', 1);
    
    legend.append('text')
      .attr('x', 30)
      .attr('y', 68)
      .attr('fill', '#6B7280')
      .attr('font-size', '9px')
      .text('$7B');
    
  }, [data, width, height]);
  
  return <svg ref={svgRef} />;
};

const CapitalManagement: React.FC = () => {
  const { updateTreasuryData } = useBankingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [capitalData, setCapitalData] = useState<ReturnType<typeof generateCapitalAllocation>>([]);
  
  useEffect(() => {
    setCapitalData(generateCapitalAllocation());
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(2)}B`;
    } else if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(2)}M`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };
  
  // Calculate total capital allocation
  const totalCapital = capitalData.reduce((sum, item) => sum + item.allocatedCapital, 0);
  
  // Calculate total RWA
  const totalRWA = capitalData.reduce((sum, item) => sum + item.riskWeightedAssets, 0);
  
  // Calculate average ROAC
  const avgROAC = capitalData.reduce((sum, item) => sum + (item.returnOnAllocatedCapital * item.allocatedCapital), 0) / totalCapital;
  
  const handleRefresh = () => {
    setIsLoading(true);
    updateTreasuryData();
    setCapitalData(generateCapitalAllocation());
    setTimeout(() => setIsLoading(false), 1000);
  };
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-indigo-50 border-b border-indigo-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Landmark2 className="h-6 w-6 text-indigo-600 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-indigo-900">Capital Management</h2>
              <p className="text-sm text-indigo-700">Optimize capital allocation and monitor regulatory capital metrics</p>
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
            
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 flex items-center">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <Landmark2 className="h-5 w-5 text-indigo-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Total Allocated Capital</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalCapital)}
              </span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                3.2%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all business units</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <BarChart className="h-5 w-5 text-blue-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Risk-Weighted Assets</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRWA)}
              </span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                1.5%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Basel III standard calculation</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-5 w-5 text-green-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Avg. Return on Allocated Capital</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{(avgROAC * 100).toFixed(1)}%</span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                4.3%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Weighted average across business units</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Capital Allocation Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Capital Allocation by Business Unit</h3>
            <div className="h-[400px]">
              <CapitalAllocationChart 
                data={capitalData}
                width={500}
                height={400}
              />
            </div>
          </div>
          
          {/* ROAC vs RWA Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">ROAC vs Risk-Weighted Assets (Size = Capital)</h3>
            <div className="h-[400px]">
              <ROACvsRWABubbleChart 
                data={capitalData}
                width={500}
                height={400}
              />
            </div>
          </div>
          
          {/* Detailed Table */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Business Unit Performance</h3>
              <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                <BarChart2 className="h-3.5 w-3.5 mr-1.5" />
                View Historical Trends
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Unit</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Capital</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RWA</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAC</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital Efficiency</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {capitalData.map((unit) => (
                    <tr key={unit.businessUnit} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {unit.businessUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(unit.allocatedCapital)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(unit.riskWeightedAssets)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {(unit.returnOnAllocatedCapital * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${
                                unit.capitalEfficiency > 0.9 ? 'bg-green-500' : 
                                unit.capitalEfficiency > 0.8 ? 'bg-blue-500' : 
                                'bg-amber-500'
                              }`}
                              style={{ width: `${unit.capitalEfficiency * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-900">
                            {(unit.capitalEfficiency * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapitalManagement;