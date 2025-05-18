import React from 'react';
import { useBankingContext } from '../../context/BankingContext';
import { CircleUser, BellRing, Menu, X, Shield, HelpCircle } from 'lucide-react';

const BankingHeader: React.FC = () => {
  const { mode, isDemoMode, setIsDemoMode, setActiveTab } = useBankingContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
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
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <button 
                onClick={() => setActiveTab('home')}
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('account-opening')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Account Opening
              </button>
              <button 
                onClick={() => setActiveTab('credit-card')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Credit Cards
              </button>
              <button 
                onClick={() => setActiveTab('loan')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Loans
              </button>
              <button 
                onClick={() => setActiveTab('compliance')}
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <Shield className="h-4 w-4 mr-1.5" />
                Compliance
              </button>
            </nav>
          </div>
          
          <div className="flex items-center">
            {/* Demo Mode Toggle */}
            <button
              className={`mr-4 px-3 py-1 rounded-full text-xs font-medium ${
                isDemoMode
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}
              onClick={() => setIsDemoMode(!isDemoMode)}
            >
              {isDemoMode ? 'Demo Mode: On' : 'Demo Mode: Off'}
            </button>
            
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