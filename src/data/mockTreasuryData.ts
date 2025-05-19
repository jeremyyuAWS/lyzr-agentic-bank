import {
  TreasuryPosition,
  InterBankTransfer,
  BaselMetric,
  RegulatoryReport
} from '../types/banking';

// Generate random string of specified length
const generateRandomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a random date between start and end dates
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate mock treasury positions
export const generateTreasuryPositions = (count: number = 20): TreasuryPosition[] => {
  const assets = [
    'US Treasury Bills', 'Corporate Bonds', 'Commercial Paper', 'Federal Funds', 
    'Certificates of Deposit', 'Money Market Funds', 'Municipal Bonds', 
    'Agency Securities', 'Foreign Exchange Reserves', 'Cash Reserves'
  ];
  
  const locations = [
    'New York', 'London', 'Tokyo', 'Singapore', 'Frankfurt', 
    'Hong Kong', 'Sydney', 'Toronto', 'Zurich', 'Dubai'
  ];
  
  const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'SGD'];
  
  const positions: TreasuryPosition[] = [];
  
  for (let i = 0; i < count; i++) {
    const type: TreasuryPosition['type'] = ['cash', 'investment', 'collateral', 'reserve'][Math.floor(Math.random() * 4)] as TreasuryPosition['type'];
    const category: TreasuryPosition['category'] = ['operational', 'reserve', 'investment', 'regulatory'][Math.floor(Math.random() * 4)] as TreasuryPosition['category'];
    const liquidity: TreasuryPosition['liquidity'] = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as TreasuryPosition['liquidity'];
    
    // Larger amounts for operational and regulatory categories
    const baseAmount = category === 'operational' || category === 'regulatory' 
      ? Math.random() * 500000000 + 100000000  // $100M to $600M
      : Math.random() * 100000000 + 10000000;  // $10M to $110M
    
    // Date calculations
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    const twoYearsFromNow = new Date(now);
    twoYearsFromNow.setFullYear(now.getFullYear() + 2);
    
    const position: TreasuryPosition = {
      id: `pos-${generateRandomString(8)}`,
      asset: assets[Math.floor(Math.random() * assets.length)],
      type,
      amount: Math.round(baseAmount * 100) / 100,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      riskWeight: type === 'cash' ? 0 : 
                type === 'reserve' ? 0.2 : 
                type === 'investment' ? Math.random() * 0.5 + 0.2 : 
                Math.random() * 0.3 + 0.1,
      location: locations[Math.floor(Math.random() * locations.length)],
      category,
      liquidity,
      timestamp: randomDate(oneYearAgo, now)
    };
    
    // Add maturity date for investments and some collateral
    if (type === 'investment' || (type === 'collateral' && Math.random() > 0.5)) {
      position.maturity = randomDate(now, twoYearsFromNow);
    }
    
    // Add yield for investments
    if (type === 'investment' || type === 'cash') {
      position.yield = Math.round((Math.random() * 5 + 1) * 100) / 100;  // 1% to 6%
    }
    
    positions.push(position);
  }
  
  return positions;
};

// Generate mock inter-bank transfers
export const generateInterBankTransfers = (count: number = 15): InterBankTransfer[] => {
  const banks = [
    'JP Morgan Chase', 'Bank of America', 'Citibank', 'Wells Fargo', 
    'Goldman Sachs', 'Morgan Stanley', 'HSBC', 'Barclays', 
    'Deutsche Bank', 'Credit Suisse', 'UBS', 'BNP Paribas',
    'Mitsubishi UFJ', 'Industrial and Commercial Bank of China'
  ];
  
  const transferTypes: InterBankTransfer['type'][] = ['nostro', 'vostro', 'swift', 'fedwire', 'ach', 'chaps', 'sepa'];
  
  const statuses: InterBankTransfer['status'][] = ['pending', 'processing', 'completed', 'failed', 'returned'];
  
  const priorities: InterBankTransfer['priority'][] = ['normal', 'high', 'urgent'];
  
  const purposes = [
    'Interbank Loan', 'Foreign Exchange Settlement', 'Securities Settlement', 
    'Corporate Client Transfer', 'Liquidity Management', 'Trade Finance', 
    'Correspondent Banking', 'Regulatory Payment', 'Treasury Operations'
  ];
  
  const transfers: InterBankTransfer[] = [];
  
  // Date calculations
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  for (let i = 0; i < count; i++) {
    const fromBank = banks[Math.floor(Math.random() * banks.length)];
    let toBank = banks[Math.floor(Math.random() * banks.length)];
    // Ensure from and to banks are different
    while (toBank === fromBank) {
      toBank = banks[Math.floor(Math.random() * banks.length)];
    }
    
    const createdAt = randomDate(threeMonthsAgo, now);
    
    // Calculate settlement and value dates
    const settlementDate = addDays(createdAt, Math.floor(Math.random() * 3) + 1); // T+1 to T+3
    const valueDate = addDays(settlementDate, Math.floor(Math.random() * 2)); // Same as settlement or T+1
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const transfer: InterBankTransfer = {
      id: `trfr-${generateRandomString(8)}`,
      fromBank,
      toBank,
      amount: Math.round(Math.random() * 50000000 + 1000000), // $1M to $51M
      currency: ['USD', 'EUR', 'GBP', 'JPY'][Math.floor(Math.random() * 4)],
      type: transferTypes[Math.floor(Math.random() * transferTypes.length)],
      status,
      settlementDate,
      valueDate,
      reference: `REF${generateRandomString(10)}`,
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      createdAt
    };
    
    // Add completion date for completed transfers
    if (status === 'completed') {
      transfer.completedAt = addDays(createdAt, Math.floor(Math.random() * 2) + 1);
    }
    
    // Add exchange rate and fees for cross-currency transfers
    if (transfer.currency !== 'USD') {
      transfer.exchangeRate = Math.round((Math.random() * 0.2 + 0.9) * 10000) / 10000; // Rate between 0.9 and 1.1
      transfer.fees = Math.round(transfer.amount * (Math.random() * 0.002 + 0.001)); // Fees between 0.1% and 0.3%
    }
    
    transfers.push(transfer);
  }
  
  // Sort by creation date, newest first
  return transfers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Generate mock Basel metrics
export const generateBaselMetrics = (): BaselMetric[] => {
  const now = new Date();
  
  const capitalMetrics = [
    {
      id: 'metric-cap-1',
      category: 'capital' as const,
      name: 'Common Equity Tier 1 (CET1) Ratio',
      value: Math.round((Math.random() * 3 + 11) * 100) / 100, // 11% to 14%
      target: 12.5,
      minimum: 7.0,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-cap-2',
      category: 'capital' as const,
      name: 'Tier 1 Capital Ratio',
      value: Math.round((Math.random() * 3 + 13) * 100) / 100, // 13% to 16%
      target: 14.0,
      minimum: 8.5,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-cap-3',
      category: 'capital' as const,
      name: 'Total Capital Ratio',
      value: Math.round((Math.random() * 3 + 15) * 100) / 100, // 15% to 18%
      target: 16.0,
      minimum: 10.5,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-cap-4',
      category: 'capital' as const,
      name: 'Capital Conservation Buffer',
      value: Math.round((Math.random() * 1 + 2.5) * 100) / 100, // 2.5% to 3.5%
      target: 2.5,
      minimum: 2.5,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-cap-5',
      category: 'capital' as const,
      name: 'Countercyclical Capital Buffer',
      value: Math.round((Math.random() * 1) * 100) / 100, // 0% to 1%
      target: 0,
      minimum: 0,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    }
  ];
  
  const liquidityMetrics = [
    {
      id: 'metric-liq-1',
      category: 'liquidity' as const,
      name: 'Liquidity Coverage Ratio (LCR)',
      value: Math.round((Math.random() * 50 + 110) * 100) / 100, // 110% to 160%
      target: 120,
      minimum: 100,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-liq-2',
      category: 'liquidity' as const,
      name: 'Net Stable Funding Ratio (NSFR)',
      value: Math.round((Math.random() * 30 + 105) * 100) / 100, // 105% to 135%
      target: 110,
      minimum: 100,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-liq-3',
      category: 'liquidity' as const,
      name: 'High-Quality Liquid Assets (HQLA)',
      value: Math.round((Math.random() * 10000000000 + 30000000000)), // $30B to $40B
      target: 30000000000,
      minimum: 25000000000,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-liq-4',
      category: 'liquidity' as const,
      name: 'Liquidity Stress Test Results',
      value: Math.round((Math.random() * 20 + 130) * 100) / 100, // 130% to 150%
      target: 120,
      minimum: 100,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    }
  ];
  
  const leverageMetrics = [
    {
      id: 'metric-lev-1',
      category: 'leverage' as const,
      name: 'Leverage Ratio',
      value: Math.round((Math.random() * 2 + 5) * 100) / 100, // 5% to 7%
      target: 5.0,
      minimum: 3.0,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-lev-2',
      category: 'leverage' as const,
      name: 'Supplementary Leverage Ratio (SLR)',
      value: Math.round((Math.random() * 1.5 + 4.5) * 100) / 100, // 4.5% to 6%
      target: 5.0,
      minimum: 3.0,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    },
    {
      id: 'metric-lev-3',
      category: 'leverage' as const,
      name: 'Risk-Weighted Assets (RWA)',
      value: Math.round((Math.random() * 20000000000 + 180000000000)), // $180B to $200B
      target: 200000000000,
      minimum: 0,
      status: 'compliant' as const,
      trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as BaselMetric['trend'],
      date: now
    }
  ];
  
  // Concatenate all metrics and randomly set a few to warning or non-compliant status
  const allMetrics = [...capitalMetrics, ...liquidityMetrics, ...leverageMetrics];
  
  // Randomly select 2-3 metrics to show warning or non-compliant status
  const warningCount = Math.floor(Math.random() * 2) + 1; // 1-2 warnings
  const nonCompliantCount = Math.floor(Math.random() * 2); // 0-1 non-compliant
  
  const shuffledMetrics = [...allMetrics].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < warningCount && i < shuffledMetrics.length; i++) {
    shuffledMetrics[i].status = 'warning';
    shuffledMetrics[i].trend = 'declining';
    shuffledMetrics[i].value = shuffledMetrics[i].minimum + (shuffledMetrics[i].target - shuffledMetrics[i].minimum) * 0.3;
  }
  
  for (let i = warningCount; i < warningCount + nonCompliantCount && i < shuffledMetrics.length; i++) {
    shuffledMetrics[i].status = 'non-compliant';
    shuffledMetrics[i].trend = 'declining';
    shuffledMetrics[i].value = shuffledMetrics[i].minimum * 0.9; // 10% below minimum
  }
  
  return allMetrics;
};

// Generate mock regulatory reports
export const generateRegulatoryReports = (count: number = 10): RegulatoryReport[] => {
  const reportNames = [
    'FR Y-9C - Consolidated Financial Statements for Holding Companies',
    'Call Report (FFIEC 031/041/051)',
    'FR 2052a - Complex Institution Liquidity Monitoring Report',
    'CCAR - Comprehensive Capital Analysis and Review',
    'FR Y-14A/Q/M - Capital Assessments and Stress Testing',
    'DFAST - Dodd-Frank Act Stress Tests',
    'FR 2900 - Report of Transaction Accounts',
    'Currency Transaction Report (CTR)',
    'Suspicious Activity Report (SAR)',
    'BCBS 239 - Risk Data Aggregation and Reporting',
    'FR Y-15 - Banking Organization Systemic Risk Report',
    'FR 2420 - Selected Money Market Rates',
    'Annual Resolution Plan',
    'LCR Disclosure Report',
    'FR 2644 - Weekly Report of Selected Assets and Liabilities'
  ];
  
  const authorities = [
    'Federal Reserve', 'OCC', 'FDIC', 'SEC', 'FINRA', 'FinCEN',
    'CFTC', 'Basel Committee', 'ECB', 'Bank of England', 'FSB'
  ];
  
  const reports: RegulatoryReport[] = [];
  
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);
  
  // Generate unique reports
  const usedReports = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    // Find a report name that hasn't been used yet
    let reportName = reportNames[Math.floor(Math.random() * reportNames.length)];
    let attempts = 0;
    while (usedReports.has(reportName) && attempts < 30) {
      reportName = reportNames[Math.floor(Math.random() * reportNames.length)];
      attempts++;
    }
    
    if (attempts < 30) {
      usedReports.add(reportName);
    }
    
    const reportType = ['daily', 'weekly', 'monthly', 'quarterly', 'annual'][Math.floor(Math.random() * 5)] as RegulatoryReport['type'];
    const dueDate = randomDate(now, oneYearFromNow);
    const reportStatus = ['pending', 'in-progress', 'submitted', 'accepted', 'rejected'][Math.floor(Math.random() * 5)] as RegulatoryReport['status'];
    
    const report: RegulatoryReport = {
      id: `report-${generateRandomString(8)}`,
      name: reportName,
      type: reportType,
      status: reportStatus,
      dueDate,
      authority: authorities[Math.floor(Math.random() * authorities.length)],
      description: `Regulatory report for ${reportName} due on ${formatDate(dueDate)}`,
      metrics: ['capital', 'liquidity', 'leverage', 'asset quality', 'risk exposure'].slice(0, Math.floor(Math.random() * 5) + 1),
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as RegulatoryReport['priority']
    };
    
    // Add submission date for submitted or later status
    if (report.status === 'submitted' || report.status === 'accepted' || report.status === 'rejected') {
      report.submissionDate = new Date(dueDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // 0-7 days before due date
    }
    
    // Randomly assign to someone
    if (Math.random() > 0.3) {
      report.assignedTo = ['John Smith', 'Sara Johnson', 'Robert Lee', 'Emma Davis', 'Michael Chen'][Math.floor(Math.random() * 5)];
    }
    
    // Add notes for some reports
    if (Math.random() > 0.5) {
      report.notes = [
        'Requires additional data validation before submission',
        'Previous submission had calculation errors in Section 3',
        'Awaiting final sign-off from compliance officer',
        'New reporting format required this quarter',
        'Contains sensitive information requiring executive review'
      ][Math.floor(Math.random() * 5)];
    }
    
    reports.push(report);
  }
  
  // Sort by due date
  return reports.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

// Generate liquidity time series for charts
export const generateLiquidityTimeSeries = (days: number = 90): Array<{date: string, value: number, category: string}> => {
  const categories = ['Operational', 'Reserve', 'Investment', 'Regulatory'];
  const seriesData: Array<{date: string, value: number, category: string}> = [];
  
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days);
  
  // Generate base values for categories
  const baseValues = {
    'Operational': 10000000000, // $10B
    'Reserve': 5000000000, // $5B
    'Investment': 7000000000, // $7B
    'Regulatory': 8000000000 // $8B
  };
  
  // Generate trends
  const trends = {
    'Operational': 0.0002, // Slight growth
    'Reserve': 0.0001, // Very slight growth
    'Investment': 0.0005, // Moderate growth
    'Regulatory': 0.0003 // Mild growth
  };
  
  // Generate volatility
  const volatility = {
    'Operational': 0.01, // 1% daily volatility
    'Reserve': 0.005, // 0.5% daily volatility
    'Investment': 0.02, // 2% daily volatility
    'Regulatory': 0.008 // 0.8% daily volatility
  };
  
  // Generate series data
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateString = formatDate(date);
    
    // Add data points for each category
    for (const category of categories) {
      const trend = Math.pow(1 + trends[category as keyof typeof trends], i);
      const randomFactor = 1 + (Math.random() * 2 - 1) * volatility[category as keyof typeof volatility];
      const value = baseValues[category as keyof typeof baseValues] * trend * randomFactor;
      
      seriesData.push({
        date: dateString,
        value: Math.round(value),
        category
      });
    }
  }
  
  return seriesData;
};

// Generate interest rate scenarios for stress testing
export const generateInterestRateScenarios = (): Array<{
  scenario: string;
  description: string; 
  impact: number;
  probability: number;
  timeHorizon: string;
  affectedMetrics: string[];
  riskLevel: 'low' | 'medium' | 'high';
}> => {
  return [
    {
      scenario: 'Rapid Rate Increase',
      description: 'Federal Reserve raises rates by 100 basis points in a single meeting',
      impact: -1200000000, // $1.2B negative impact
      probability: 0.15,
      timeHorizon: '3 months',
      affectedMetrics: ['Net Interest Margin', 'Bond Portfolio Value', 'Deposit Stability'],
      riskLevel: 'high'
    },
    {
      scenario: 'Gradual Rate Increase',
      description: 'Federal Reserve raises rates by 25 basis points in four consecutive meetings',
      impact: -500000000, // $500M negative impact
      probability: 0.40,
      timeHorizon: '12 months',
      affectedMetrics: ['Net Interest Margin', 'Bond Portfolio Value', 'Loan Demand'],
      riskLevel: 'medium'
    },
    {
      scenario: 'Rate Stability',
      description: 'Interest rates remain within 25 basis points of current levels',
      impact: 50000000, // $50M positive impact
      probability: 0.30,
      timeHorizon: '6 months',
      affectedMetrics: ['Net Interest Margin', 'Deposit Growth'],
      riskLevel: 'low'
    },
    {
      scenario: 'Yield Curve Inversion',
      description: 'Short-term rates exceed long-term rates by 50+ basis points',
      impact: -800000000, // $800M negative impact
      probability: 0.25,
      timeHorizon: '6-12 months',
      affectedMetrics: ['Net Interest Margin', 'Economic Outlook', 'Credit Performance'],
      riskLevel: 'high'
    },
    {
      scenario: 'Rate Decrease',
      description: 'Federal Reserve cuts rates by 50 basis points in response to economic slowdown',
      impact: 300000000, // $300M positive impact (short term)
      probability: 0.20,
      timeHorizon: '9 months',
      affectedMetrics: ['Net Interest Margin', 'Loan Demand', 'Prepayment Speeds'],
      riskLevel: 'medium'
    }
  ];
};

// Generate capital allocation data
export const generateCapitalAllocation = (): Array<{
  businessUnit: string,
  allocatedCapital: number,
  riskWeightedAssets: number,
  returnOnAllocatedCapital: number,
  capitalEfficiency: number,
}> => {
  return [
    {
      businessUnit: 'Retail Banking',
      allocatedCapital: 5200000000, // $5.2B
      riskWeightedAssets: 28000000000, // $28B
      returnOnAllocatedCapital: 0.145, // 14.5%
      capitalEfficiency: 0.92, // 92%
    },
    {
      businessUnit: 'Corporate Banking',
      allocatedCapital: 6700000000, // $6.7B
      riskWeightedAssets: 48000000000, // $48B
      returnOnAllocatedCapital: 0.168, // 16.8%
      capitalEfficiency: 0.88, // 88%
    },
    {
      businessUnit: 'Investment Banking',
      allocatedCapital: 4500000000, // $4.5B
      riskWeightedAssets: 35000000000, // $35B
      returnOnAllocatedCapital: 0.195, // 19.5%
      capitalEfficiency: 0.85, // 85%
    },
    {
      businessUnit: 'Asset Management',
      allocatedCapital: 1800000000, // $1.8B
      riskWeightedAssets: 9000000000, // $9B
      returnOnAllocatedCapital: 0.22, // 22%
      capitalEfficiency: 0.95, // 95%
    },
    {
      businessUnit: 'Wealth Management',
      allocatedCapital: 1200000000, // $1.2B
      riskWeightedAssets: 6000000000, // $6B
      returnOnAllocatedCapital: 0.205, // 20.5%
      capitalEfficiency: 0.97, // 97%
    },
    {
      businessUnit: 'Treasury',
      allocatedCapital: 3500000000, // $3.5B
      riskWeightedAssets: 24000000000, // $24B
      returnOnAllocatedCapital: 0.132, // 13.2%
      capitalEfficiency: 0.91, // 91%
    }
  ];
};