import React from 'react';
import { useBankingContext } from '../context/BankingContext';
import BankingHeader from '../components/common/BankingHeader';
import BankingWelcomeModal from '../components/common/BankingWelcomeModal';
import DashboardHome from '../components/banking/DashboardHome';
import AccountOpeningWorkflow from '../components/banking/account-opening/AccountOpeningWorkflow';
import CreditCardWorkflow from '../components/banking/credit-card/CreditCardWorkflow';
import LoanWorkflow from '../components/banking/loan/LoanWorkflow';
import ComplianceDashboard from '../components/banking/compliance/ComplianceDashboard';
import FraudDetectionWorkflow from '../components/banking/fraud-detection/FraudDetectionWorkflow';
import TreasuryOpsWorkflow from '../components/banking/treasury-ops/TreasuryOpsWorkflow';

const BankingLayout: React.FC = () => {
  const { activeTab } = useBankingContext();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <BankingHeader />
      <BankingWelcomeModal />
      
      <main className="flex-1 container mx-auto pt-20 px-4 pb-4 overflow-hidden">
        <div className="bg-white rounded-lg shadow h-full overflow-hidden">
          {activeTab === 'home' && <DashboardHome />}
          {activeTab === 'account-opening' && <AccountOpeningWorkflow />}
          {activeTab === 'credit-card' && <CreditCardWorkflow />}
          {activeTab === 'loan' && <LoanWorkflow />}
          {activeTab === 'compliance' && <ComplianceDashboard />}
          {activeTab === 'fraud-detection' && <FraudDetectionWorkflow />}
          {activeTab === 'treasury-ops' && <TreasuryOpsWorkflow />}
        </div>
      </main>
    </div>
  );
};

export default BankingLayout;