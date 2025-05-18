import React from 'react';
import { BankingProvider } from './context/BankingContext';
import BankingLayout from './layouts/BankingLayout';

function App() {
  return (
    <BankingProvider>
      <BankingLayout />
    </BankingProvider>
  );
}

export default App;