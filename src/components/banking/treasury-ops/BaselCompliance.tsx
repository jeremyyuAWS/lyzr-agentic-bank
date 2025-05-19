import React, { useState, useRef } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  BarChart, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
  Calendar
} from 'lucide-react';
import * as d3 from 'd3';

// D3 component for radial gauge chart
const RadialGauge: React.FC<{
  value: number;
  min: number;
  max: number;
  threshold: number; 
  label: string;
  width: number; 
  height: number;
  colorScheme: string[];
}> = ({ value, min, max, threshold, label, width, height, colorScheme }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  React.useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear SVG
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current);
    
    // Add viewBox for better responsiveness
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
      
    // Calculate gauge parameters
    const margin = { top: 40, right: 30, bottom: 40, left: 30 };
    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Angle ranges in radians
    const startAngle = -Math.PI / 1.2; // -150 degrees
    const endAngle = Math.PI / 1.2;    // 150 degrees
    
    // Create color scale
    const colorScale = d3.scaleThreshold<number, string>()
      .domain([min + (max - min) * 0.33, threshold, min + (max - min) * 0.8])
      .range(colorScheme);
      
    // Create arc generator
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(endAngle);
    
    // Draw the inner circle (to create the donut hole)
    svg.append('path')
      .attr('d', arc())
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', '#E5E7EB'); // gray-200
      
    // Create scale for value to angle mapping
    const valueToAngle = (val: number) => {
      const normalized = (val - min) / (max - min); // 0 to 1
      return startAngle + normalized * (endAngle - startAngle);
    };
    
    // Create value arc
    const valueArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .startAngle(startAngle)
      .endAngle(valueToAngle(Math.min(Math.max(value, min), max))); // Clamp value
      
    // Add value arc
    svg.append('path')
      .attr('d', valueArc())
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', colorScale(value));
    
    // Add threshold marker
    const thresholdAngle = valueToAngle(threshold);
    
    svg.append('line')
      .attr('x1', centerX + (radius * 0.65) * Math.cos(thresholdAngle))
      .attr('y1', centerY + (radius * 0.65) * Math.sin(thresholdAngle))
      .attr('x2', centerX + (radius * 1.05) * Math.cos(thresholdAngle))
      .attr('y2', centerY + (radius * 1.05) * Math.sin(thresholdAngle))
      .attr('stroke', '#9CA3AF') // gray-400
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,2');
      
    // Add threshold label
    svg.append('text')
      .attr('x', centerX + (radius * 1.15) * Math.cos(thresholdAngle))
      .attr('y', centerY + (radius * 1.15) * Math.sin(thresholdAngle))
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#6B7280') // gray-500
      .text(`Min ${threshold}${label === 'Ratio' ? '%' : ''}`);
    
    // Add value label in the center
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1F2937') // gray-800
      .text(`${value.toFixed(1)}${label === 'Ratio' ? '%' : ''}`);
      
    // Add title
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#4B5563') // gray-600
      .text(label);
      
  }, [value, min, max, threshold, label, width, height, colorScheme]);
  
  return <svg ref={svgRef} width={width} height={height} />;
};

const BaselCompliance: React.FC = () => {
  const { baselMetrics, updateTreasuryData } = useBankingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter metrics by category
  const filteredMetrics = selectedCategory 
    ? baselMetrics.filter(metric => metric.category === selectedCategory)
    : baselMetrics;
    
  // Get capital metrics
  const capitalMetrics = baselMetrics.filter(metric => metric.category === 'capital');
  
  // Get liquidity metrics
  const liquidityMetrics = baselMetrics.filter(metric => metric.category === 'liquidity');
  
  // Get leverage metrics
  const leverageMetrics = baselMetrics.filter(metric => metric.category === 'leverage');
  
  // Format large number values
  const formatValue = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else {
      return value.toLocaleString();
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'non-compliant':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-400" style={{ transform: 'rotate(90deg)' }} />;
    }
  };
  
  // Handle refresh
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
            <ShieldCheck className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-medium text-indigo-900">Basel III Compliance Dashboard</h2>
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
              <ShieldCheck className="h-5 w-5 text-green-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Capital Adequacy Status</h3>
            </div>
            <div className="flex justify-between items-center">
              <span 
                className={`text-lg font-bold ${
                  capitalMetrics.every(m => m.status === 'compliant')
                    ? 'text-green-600'
                    : capitalMetrics.some(m => m.status === 'non-compliant')
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {capitalMetrics.every(m => m.status === 'compliant')
                  ? 'Compliant'
                  : capitalMetrics.some(m => m.status === 'non-compliant')
                  ? 'Non-Compliant'
                  : 'Warning'}
              </span>
              <div className="flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Last assessment: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {capitalMetrics.filter(m => m.status !== 'compliant').length} issue(s) requiring attention
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <BarChart className="h-5 w-5 text-blue-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Liquidity Requirements</h3>
            </div>
            <div className="flex justify-between items-center">
              <span 
                className={`text-lg font-bold ${
                  liquidityMetrics.every(m => m.status === 'compliant')
                    ? 'text-green-600'
                    : liquidityMetrics.some(m => m.status === 'non-compliant')
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {liquidityMetrics.every(m => m.status === 'compliant')
                  ? 'Compliant'
                  : liquidityMetrics.some(m => m.status === 'non-compliant')
                  ? 'Non-Compliant'
                  : 'Warning'}
              </span>
              <span className={`flex items-center text-sm ${
                liquidityMetrics.some(m => m.status !== 'compliant') ? 'text-red-500' : 'text-green-600'
              }`}>
                {liquidityMetrics.some(m => m.status !== 'compliant') ? (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Action Required
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Compliant
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {liquidityMetrics.filter(m => m.status !== 'compliant').length} issue(s) requiring attention
            </p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-1">
              <Clock className="h-5 w-5 text-indigo-600 mr-1.5" />
              <h3 className="font-medium text-gray-900">Next Regulatory Reporting</h3>
            </div>
            <div className="text-lg font-bold text-indigo-600">May 15, 2025</div>
            <p className="text-xs text-gray-500 mt-1">
              FR 2052a - Complex Institution Liquidity Monitoring Report
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <h3 className="font-medium text-gray-900 flex-1">Key Regulatory Metrics</h3>
            
            <div className="flex space-x-1">
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Metrics
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedCategory === 'capital' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory('capital')}
              >
                Capital
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedCategory === 'liquidity' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory('liquidity')}
              >
                Liquidity
              </button>
              <button
                className={`px-2 py-1 text-xs rounded ${
                  selectedCategory === 'leverage' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory('leverage')}
              >
                Leverage
              </button>
            </div>
          </div>
          
          {/* Gauge charts for key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* CET1 Ratio Gauge */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 text-center mb-0">Common Equity Tier 1 (CET1) Ratio</h3>
              <div className="h-[220px] flex justify-center">
                {capitalMetrics.length > 0 && capitalMetrics[0] && (
                  <RadialGauge 
                    value={capitalMetrics[0].value}
                    min={0}
                    max={20}
                    threshold={capitalMetrics[0].minimum}
                    label="Ratio"
                    width={240}
                    height={220}
                    colorScheme={['#EF4444', '#F59E0B', '#10B981']}
                  />
                )}
              </div>
              <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                  <span>Minimum: 7.0%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-300 mr-1"></div>
                  <span>Target: 12.5%</span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">
                  Trend: {capitalMetrics.length > 0 && capitalMetrics[0] ? capitalMetrics[0].trend : 'stable'}
                </span>
                <span className="text-xs text-gray-600">
                  Buffer: {capitalMetrics.length > 0 && capitalMetrics[0] ? `+${(capitalMetrics[0].value - capitalMetrics[0].minimum).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
            
            {/* LCR Gauge */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 text-center mb-0">Liquidity Coverage Ratio (LCR)</h3>
              <div className="h-[220px] flex justify-center">
                {liquidityMetrics.length > 0 && liquidityMetrics[0] && (
                  <RadialGauge 
                    value={liquidityMetrics[0].value}
                    min={0}
                    max={200}
                    threshold={liquidityMetrics[0].minimum}
                    label="Ratio"
                    width={240}
                    height={220}
                    colorScheme={['#EF4444', '#F59E0B', '#10B981']}
                  />
                )}
              </div>
              <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                  <span>Minimum: 100%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-300 mr-1"></div>
                  <span>Target: 120%</span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">
                  Trend: {liquidityMetrics.length > 0 && liquidityMetrics[0] ? liquidityMetrics[0].trend : 'stable'}
                </span>
                <span className="text-xs text-gray-600">
                  Buffer: {liquidityMetrics.length > 0 && liquidityMetrics[0] ? `+${(liquidityMetrics[0].value - liquidityMetrics[0].minimum).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
            
            {/* Leverage Ratio Gauge */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 text-center mb-0">Leverage Ratio</h3>
              <div className="h-[220px] flex justify-center">
                {leverageMetrics.length > 0 && leverageMetrics[0] && (
                  <RadialGauge 
                    value={leverageMetrics[0].value}
                    min={0}
                    max={10}
                    threshold={leverageMetrics[0].minimum}
                    label="Ratio"
                    width={240}
                    height={220}
                    colorScheme={['#EF4444', '#F59E0B', '#10B981']}
                  />
                )}
              </div>
              <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                  <span>Minimum: 3.0%</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-300 mr-1"></div>
                  <span>Target: 5.0%</span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-600">
                  Trend: {leverageMetrics.length > 0 && leverageMetrics[0] ? leverageMetrics[0].trend : 'stable'}
                </span>
                <span className="text-xs text-gray-600">
                  Buffer: {leverageMetrics.length > 0 && leverageMetrics[0] ? `+${(leverageMetrics[0].value - leverageMetrics[0].minimum).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {/* All Basel Metrics Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Basel III Regulatory Metrics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMetrics.map((metric) => (
                    <tr key={metric.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{metric.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{metric.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.name.includes('Ratio') 
                          ? `${metric.value.toFixed(2)}%` 
                          : formatValue(metric.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.name.includes('Ratio') 
                          ? `${metric.minimum.toFixed(2)}%` 
                          : formatValue(metric.minimum)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {metric.name.includes('Ratio') 
                          ? `${metric.target.toFixed(2)}%` 
                          : formatValue(metric.target)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          metric.status === 'compliant' 
                            ? 'bg-green-100 text-green-800' 
                            : metric.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {metric.status === 'compliant' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {metric.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {metric.status === 'non-compliant' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTrendIcon(metric.trend)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Guidance Note */}
      <div className="bg-blue-50 p-4 border-t border-blue-100 flex items-start">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-800 text-sm">Basel III Compliance Reminder</h4>
          <p className="text-xs text-blue-700 mt-1">
            Regulatory updates may change capital and liquidity requirements. Stay updated with the latest Basel Committee guidance.
            <a href="#" className="ml-1 text-blue-600 hover:underline flex items-center inline-block">
              See regulatory calendar <ArrowRight className="h-3 w-3 ml-1" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BaselCompliance;