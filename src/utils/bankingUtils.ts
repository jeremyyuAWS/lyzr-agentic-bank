// Function to generate a random account number
export const generateAccountNumber = (): string => {
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

// Function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Function to calculate monthly payment
export const calculateMonthlyPayment = (principal: number, annualRate: number, termMonths: number): number => {
  const monthlyRate = annualRate / 100 / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
};

// Function to calculate total interest
export const calculateTotalInterest = (monthlyPayment: number, termMonths: number, principal: number): number => {
  return (monthlyPayment * termMonths) - principal;
};

// Function to mask sensitive information (e.g., SSN, Card numbers)
export const maskSensitiveData = (data: string, visibleChars: number = 4, mask: string = 'X'): string => {
  if (!data) return '';
  
  const length = data.length;
  
  if (length <= visibleChars) {
    return data;
  }
  
  const visiblePart = data.substring(length - visibleChars);
  const maskedPart = mask.repeat(length - visibleChars);
  
  return `${maskedPart}${visiblePart}`;
};

// Function to calculate debt-to-income ratio
export const calculateDTI = (monthlyDebt: number, monthlyIncome: number): number => {
  return (monthlyDebt / monthlyIncome) * 100;
};

// Function to generate amortization schedule
export const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termMonths: number
): Array<{
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termMonths);
  
  const schedule = [];
  let balance = principal;
  
  for (let i = 1; i <= termMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    balance -= principalPayment;
    
    schedule.push({
      paymentNumber: i,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interest,
      balance: Math.max(0, balance) // Ensure balance doesn't go below 0 due to rounding
    });
  }
  
  return schedule;
};

// Function to format date as MM/DD/YYYY
export const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
};

// Function to add months to a date
export const addMonthsToDate = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Function to check if ID has expired
export const isIdExpired = (expiryDate: string): boolean => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return today > expiry;
};