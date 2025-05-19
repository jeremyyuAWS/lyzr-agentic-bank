import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  BarChart3, 
  PieChart, 
  Clock, 
  RefreshCw, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Calendar,
  BarChart2,
  ArrowRight,
  Filter
} from 'lucide-react';
import * as d3 from 'd3';
import { generateLiquidityTimeSeries } from '../../../data/mockTreasuryData';

// Use D3 to create a stacked area chart for liquidity time series
const LiquidityTimeSeriesChart: React.FC<{data: any[], width: number, height: number}> = ({ data, width, height }) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Group data by date and category
    const grouped = d3.group(data, d => d.date);
    const dates = Array.from(grouped.keys()).sort();
    
    // Get unique categories
    const categories = Array.from(new Set(data.map(d => d.category)));
    
    // Parse dates
    const parseDate = d3.timeParse("%Y-%m-%d");
    
    // Set up margins and dimensions
    const margin = { top: 20, right: 60, bottom: 40, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    // Create group for the chart content
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Format the data for stacked area chart
    const stack = d3.stack()
      .keys(categories)
      .value((date, key) => {
        const value = grouped.get(date)?.find(d => d.category === key)?.value || 0;
        return value;
      });
    
    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(dates.map(d => parseDate(d) as Date)) as [Date, Date])
      .range([0, innerWidth]);
    
    const yMax = d3.max(Array.from(grouped.values()).map(categoryValues => 
      d3.sum(categoryValues, d => d.value)
    )) || 0;
    
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);
    
    // Create area generator
    const area = d3.area<any>()
      .x(d => xScale(parseDate(d.data) as Date))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCatmullRom);
    
    // Create line generator for enhanced visibility
    const line = d3.line<any>()
      .x(d => xScale(parseDate(d.data) as Date))
      .y(d => yScale(d[1]))
      .curve(d3.curveCatmullRom);
    
    // Color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range(['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B']);
    
    // Format dates for each stack
    const stackedData = stack(dates as any);
    
    // Add areas
    g.selectAll('.area')
      .data(stackedData)
      .enter()
      .append('path')
      .attr('class', 'area')
      .attr('d', area)
      .attr('fill', d => colorScale(d.key as string))
      .attr('opacity', 0.8);
    
    // Add lines on top of areas for definition
    g.selectAll('.line')
      .data(stackedData)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', line)
      .attr('stroke', d => colorScale(d.key as string))
      .attr('stroke-width', 1.5)
      .attr('fill', 'none');
    
    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(width > 500 ? 5 : 3)
      .tickFormat(d => d3.timeFormat('%b %d')(d as Date));
    
    // Format large numbers with suffix
    const formatNumber = (num: number) => {
      if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
      return `$${num.toFixed(0)}`;
    };
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => formatNumber(d as number));
    
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#6B7280')
      .attr('font-size', '10px');
    
    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`);
    
    categories.forEach((category, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colorScale(category));
      
      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .attr('font-size', '10px')
        .attr('fill', '#6B7280')
        .text(category);
    });
    
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

const LiquidityDashboard: React.FC = () => {
  const { treasuryPositions, updateTreasuryData } = useBankingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [liquidityTimeSeries, setLiquidityTimeSeries] = useState<any[]>([]);
  
  // Calculate liquidity metrics and chart data
  useEffect(() => {
    const days = selectedPeriod === '7d' 
      ? 7 
      : selectedPeriod === '30d'
      ? 30
      : selectedPeriod === '90d'
      ? 90
      : 180;
      
    setLiquidityTimeSeries(generateLiquidityTimeSeries(days));
  }, [selectedPeriod, treasuryPositions]);
  
  // Calculate total HQLA (High Quality Liquid Assets)
  const calculateHQLA = () => {
    return treasuryPositions
      .filter(p => p.liquidity === 'high')
      .reduce((total, p) => total + p.amount, 0);
  };
  
  // Calculate LCR (Liquidity Coverage Ratio)
  const calculateLCR = () => {
    const hqla = calculateHQLA();
    // Simulate net cash outflows as a percentage of HQLA
    const netCashOutflows = hqla * (0.6 + Math.random() * 0.2); 
    return (hqla / netCashOutflows) * 100;
  };
  
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
  
  // Group positions by category
  const positionsByCategory = treasuryPositions.reduce((acc, pos) => {
    if (!acc[pos.category]) {
      acc[pos.category] = [];
    }
    acc[pos.category].push(pos);
    return acc;
  }, {} as Record<string, typeof treasuryPositions>);
  
  // Calculate total by category
  const totalByCategory = Object.entries(positionsByCategory).reduce((acc, [category, positions]) => {
    acc[category] = positions.reduce((sum, pos) => sum + pos.amount, 0);
    return acc;
  }, {} as Record<string, number>);
  
  // Filter positions by selected category
  const filteredPositions = selectedCategory 
    ? treasuryPositions.filter(p => p.category === selectedCategory)
    : treasuryPositions;
  
  // Refresh data
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
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
            <div>
              <h2 className="text-lg font-medium text-indigo-900">Liquidity Position Dashboard</h2>
              <p className="text-sm text-indigo-700">Monitor and manage bank-wide liquidity position and forecasts</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <DollarSign className="h-5 w-5 text-indigo-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Total Liquidity</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(treasuryPositions.reduce((sum, pos) => sum + pos.amount, 0))}
              </span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                2.4%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Updated {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <BarChart2 className="h-5 w-5 text-blue-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">HQLA (High Quality Liquid Assets)</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculateHQLA())}
              </span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                1.8%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">68% of total assets</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <TrendingUp className="h-5 w-5 text-green-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">LCR (Liquidity Coverage Ratio)</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{calculateLCR().toFixed(1)}%</span>
              <span className="flex items-center text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                3.2%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum requirement: 100%</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <Calendar className="h-5 w-5 text-purple-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Cash Flow Forecast (30d)</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(treasuryPositions
                  .filter(p => p.type === 'cash' || p.type === 'investment' && p.maturity && p.maturity <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                  .reduce((sum, pos) => sum + pos.amount, 0) * 1.05)}
              </span>
              <span className="flex items-center text-red-600 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                1.3%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Adequate coverage for all obligations</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Liquidity Trend Analysis</h3>
          
          <div className="flex items-center space-x-2">
            {/* Time period selector */}
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md">
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedPeriod === '7d' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
                onClick={() => setSelectedPeriod('7d')}
              >
                7D
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedPeriod === '30d' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
                onClick={() => setSelectedPeriod('30d')}
              >
                30D
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedPeriod === '90d' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
                onClick={() => setSelectedPeriod('90d')}
              >
                90D
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedPeriod === '180d' ? 'bg-indigo-600 text-white' : 'text-gray-600'
                }`}
                onClick={() => setSelectedPeriod('180d')}
              >
                180D
              </button>
            </div>
            
            {/* Category filter */}
            <div className="relative">
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 flex items-center"
              >
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="h-80">
            <LiquidityTimeSeriesChart 
              data={liquidityTimeSeries}
              width={1000}
              height={320}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Position Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 text-indigo-600 mr-1.5" />
                Position Breakdown
              </h3>
              
              {/* Category filters */}
              <div className="flex space-x-1">
                <button
                  className={`px-2 py-0.5 text-xs rounded ${
                    selectedCategory === null ? 'bg-indigo-100 text-indigo-800 font-medium' : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
                {Object.keys(positionsByCategory).map(category => (
                  <button
                    key={category}
                    className={`px-2 py-0.5 text-xs rounded capitalize ${
                      selectedCategory === category ? 'bg-indigo-100 text-indigo-800 font-medium' : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquidity</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Weight</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPositions.map(position => (
                    <tr key={position.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{position.asset}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{position.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(position.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          position.liquidity === 'high' 
                            ? 'bg-green-100 text-green-800' 
                            : position.liquidity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {position.liquidity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(position.riskWeight * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Category Breakdown */}
          <div>
            <h3 className="font-medium text-gray-900 flex items-center mb-3">
              <BarChart3 className="h-5 w-5 text-indigo-600 mr-1.5" />
              Category Breakdown & Stress Testing
            </h3>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="space-y-4">
                {Object.entries(totalByCategory).map(([category, total]) => (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          category === 'operational' ? 'bg-indigo-600' :
                          category === 'reserve' ? 'bg-blue-500' :
                          category === 'investment' ? 'bg-green-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${(total / treasuryPositions.reduce((sum, pos) => sum + pos.amount, 0)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stress Testing Scenarios */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800">Liquidity Stress Scenarios</h4>
                  <p className="text-sm text-amber-700 mt-0.5">
                    Simulated impacts on liquidity position under various market scenarios
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="bg-white p-3 rounded-lg border border-amber-100">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Severe Market Stress (1-in-10 Year Event)</h5>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Projected LCR Impact:</span>
                    <span className="text-red-600 font-medium">-28% (to {(calculateLCR() * 0.72).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Remaining Liquidity Buffer:</span>
                    <span className="text-green-600 font-medium">{formatCurrency(calculateHQLA() * 0.72)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Still above regulatory minimum requirements</p>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-amber-100">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Interest Rate Shock (+200bps)</h5>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Mark-to-Market Impact:</span>
                    <span className="text-red-600 font-medium">-{formatCurrency(treasuryPositions
                    .filter(p => p.type === 'investment')
                    .reduce((sum, pos) => sum + pos.amount * 0.06, 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Net Interest Income Impact:</span>
                    <span className="text-green-600 font-medium">+{formatCurrency(treasuryPositions
                    .filter(p => p.type === 'cash')
                    .reduce((sum, pos) => sum + pos.amount * 0.02, 0))}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Recovery period: approx. 14 months</p>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button className="px-3 py-1.5 text-xs bg-amber-100 border border-amber-200 rounded text-amber-800 font-medium hover:bg-amber-200 transition-colors flex items-center">
                    <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
                    Run Custom Scenario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityDashboard;