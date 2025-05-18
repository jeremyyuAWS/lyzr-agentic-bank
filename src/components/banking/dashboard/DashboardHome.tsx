import React, { useState, useEffect } from 'react';
import { useBankingContext } from '../../../context/BankingContext';
import { ArrowRight, Shield, CreditCard, Landmark, Bot, RefreshCw, Terminal, BotMessageSquare, FileText } from 'lucide-react';
import AgentVisualization from './AgentVisualization';
import EnhancedAgentVisualization from './EnhancedAgentVisualization';
import ActivityLog from './ActivityLog';
import AgentMetrics from './AgentMetrics';
import AgentCommunicationFlow from './AgentCommunicationFlow';
import DashboardStats from './DashboardStats';
import WorkflowSummary from './WorkflowSummary';
import SystemHealth from './SystemHealth';
import FinancialHealthMetrics from './FinancialHealthMetrics';
import CustomerJourneyMap from '../shared/CustomerJourneyMap';
import RegulatoryFrameworkVisualization from '../compliance/RegulatoryFrameworkVisualization';
import CrossProductRecommendationEngine from '../shared/CrossProductRecommendationEngine';

const DashboardHome: React.FC = () => {
  const { setMode, setActiveTab, resetAll, addAuditEvent, auditTrail } = useBankingContext();
  const [isResetting, setIsResetting] = useState(false);
  const [animationState, setAnimationState] = useState(false);
  
  useEffect(() => {
    // Start animations after component mount
    const timer = setTimeout(() => {
      setAnimationState(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleWorkflowSelection = (mode: 'account-opening' | 'credit-card' | 'loan') => {
    setMode(mode);
    setActiveTab(mode);
    addAuditEvent('Workflow Selected', `User started the ${mode} workflow`);
  };
  
  const handleReset = () => {
    setIsResetting(true);
    
    // Simulate a reset process
    setTimeout(() => {
      resetAll();
      setIsResetting(false);
      addAuditEvent('System Reset', 'User initiated a complete system reset');
    }, 1000);
  };
  
  const handleComplianceDashboard = () => {
    setActiveTab('compliance');
    addAuditEvent('Navigation', 'User accessed the Compliance Dashboard');
  };
  
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header and Stats Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-500"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to AgenticBank</h2>
              <p className="text-gray-600 mt-1">
                Experience the future of banking with our AI-powered digital bank
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm"
              disabled={isResetting}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isResetting ? 'animate-spin' : ''}`} />
              Reset Demo
            </button>
          </div>
          
          {/* Stats Cards */}
          <DashboardStats />
        </div>
        
        {/* Financial Health Metrics */}
        <div className="transition-all duration-700"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '100ms'
          }}
        >
          <FinancialHealthMetrics />
        </div>
        
        {/* Banking Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '200ms'
          }}
        >
          <div
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleWorkflowSelection('account-opening')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Account Opening</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Open a new bank account in minutes with our streamlined verification process.
            </p>
            <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          </div>
          
          <div
            className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleWorkflowSelection('credit-card')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Credit Card</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Apply for a credit card with instant approval and virtual card issuance.
            </p>
            <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          </div>
          
          <div
            className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl shadow-md p-6 cursor-pointer transition transform hover:-translate-y-1 hover:shadow-lg"
            onClick={() => handleWorkflowSelection('loan')}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Loan Origination</h3>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Apply for personal, home, or auto loans with our simplified application process.
            </p>
            <div className="flex items-center text-sm text-white/80 mt-auto pt-2 border-t border-white/20">
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </div>
          </div>
        </div>
        
        {/* Cross-Product Recommendations */}
        <div className="transition-all duration-700" 
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms'
          }}
        >
          <CrossProductRecommendationEngine maxRecommendations={3} showMatchScores={true} />
        </div>
        
        {/* Main Dashboard Content - Enhanced Agent Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* EnhancedAgentVisualization - Takes 2/3 of space on large screens */}
          <div className="lg:col-span-2 transition-all duration-900"
            style={{
              opacity: animationState ? 1 : 0,
              transform: animationState ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '400ms'
            }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <BotMessageSquare className="h-5 w-5 text-indigo-600 mr-2" />
                  Agent Network Visualization
                </h3>
                <div className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                  Live View
                </div>
              </div>
              <div className="h-[400px]">
                <EnhancedAgentVisualization />
              </div>
            </div>
          </div>
          
          {/* Activity log - Takes 1/3 of space on large screens */}
          <div className="transition-all duration-900"
            style={{
              opacity: animationState ? 1 : 0,
              transform: animationState ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '600ms'
            }}
          >
            <div className="h-[400px]">
              <ActivityLog maxHeight="400px" />
            </div>
          </div>
        </div>
        
        {/* Customer Journey Map */}
        <div className="transition-all duration-900"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '800ms'
          }}
        >
          <CustomerJourneyMap layout="horizontal" showFutureMilestones={true} />
        </div>
        
        {/* GRC & Regulatory Framework */}
        <div className="transition-all duration-900"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '900ms'
          }}
        >
          <RegulatoryFrameworkVisualization />
        </div>
        
        {/* Additional dashboard rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-900"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '1000ms'
          }}
        >
          {/* Agent Communication Flow */}
          <div className="lg:col-span-2 h-64">
            <AgentCommunicationFlow />
          </div>
          
          {/* Workflow Summary */}
          <div className="h-64">
            <WorkflowSummary />
          </div>
        </div>
        
        {/* Final dashboard row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-900"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '1100ms'
          }}
        >
          {/* System Health */}
          <div>
            <SystemHealth />
          </div>
          
          {/* Agent Metrics */}
          <div>
            <AgentMetrics />
          </div>
        </div>
        
        {/* Info section at the bottom */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center transition-all duration-900"
          style={{
            opacity: animationState ? 1 : 0,
            transform: animationState ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '1200ms'
          }}
        >
          <div className="flex items-center justify-center">
            <Terminal className="h-5 w-5 text-gray-500 mr-1.5" />
            <p className="text-sm text-gray-600">This is a demo application - no real banking operations are performed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;