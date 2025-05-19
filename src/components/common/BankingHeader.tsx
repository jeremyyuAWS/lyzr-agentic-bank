import React, { useState, useRef, useEffect } from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { CircleUser, BellRing, Menu, X, Shield, HelpCircle, AlertTriangle, DollarSign, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';

const BankingHeader: React.FC = () => {
  const { mode, setMode, setActiveTab } = useBankingContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTabControls, setShowTabControls] = useState(false);
  
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Check if scrolling is needed
  useEffect(() => {
    const checkScrollWidth = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowTabControls(scrollWidth > clientWidth);
      }
    };
    
    // Check initially
    checkScrollWidth();
    
    // Add resize listener
    window.addEventListener('resize', checkScrollWidth);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScrollWidth);
    };
  }, []);
  
  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/images/lyzr-logo-cut.png" 
                alt="Lyzr Logo" 
                className="h-8 w-auto mr-2"
              />
              <div>
                <span className="text-xl font-bold text-gray-900">Agentic Bank</span>
                <p className="text-xs text-gray-500 -mt-1">Banking Reimagined by AI Agents</p>
              </div>
              <div className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5 rounded-md">
                DEMO
              </div>
            </div>
            
            {/* Desktop Navigation with Tab Slider */}
            <div className="hidden md:ml-6 md:flex md:items-center">
              {showTabControls && (
                <button 
                  onClick={scrollLeft}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              
              <nav 
                ref={tabsContainerRef}
                className="flex space-x-8 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: 'calc(100vw - 400px)' }}
              >
                <button 
                  onClick={() => setActiveTab('home')}
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('account-opening')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  Account Opening
                </button>
                <button 
                  onClick={() => setActiveTab('credit-card')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  Credit Cards
                </button>
                <button 
                  onClick={() => setActiveTab('loan')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  Loans
                </button>
                <button 
                  onClick={() => setActiveTab('fraud-detection')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Fraud Detection
                </button>
                <button 
                  onClick={() => setActiveTab('treasury-ops')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  <BarChart className="h-4 w-4 mr-1.5" />
                  Treasury Ops
                </button>
                <button 
                  onClick={() => setActiveTab('compliance')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium whitespace-nowrap"
                >
                  <Shield className="h-4 w-4 mr-1.5" />
                  Compliance
                </button>
              </nav>

              {showTabControls && (
                <button 
                  onClick={scrollRight}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                  aria-label="Scroll tabs right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Help button */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Bell icon */}
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <BellRing className="h-5 w-5" />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative flex items-center">
              <div className="ml-2 mr-3 text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">demo@agentic.bank</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <CircleUser className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-3">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab('home');
                setIsMobileMenuOpen(false);
              }}
              className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('account-opening');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Account Opening
            </button>
            <button
              onClick={() => {
                setActiveTab('credit-card');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Credit Cards
            </button>
            <button
              onClick={() => {
                setActiveTab('loan');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Loans
            </button>
            <button
              onClick={() => {
                setActiveTab('fraud-detection');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              <AlertTriangle className="inline h-4 w-4 mr-1.5" />
              Fraud Detection
            </button>
            <button
              onClick={() => {
                setActiveTab('treasury-ops');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              <BarChart className="inline h-4 w-4 mr-1.5" />
              Treasury Ops
            </button>
            <button
              onClick={() => {
                setActiveTab('compliance');
                setIsMobileMenuOpen(false);
              }}
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              <Shield className="inline h-4 w-4 mr-1.5" />
              Compliance
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default BankingHeader;