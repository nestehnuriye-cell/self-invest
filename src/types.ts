export type Currency = 'USD' | 'ETB';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  ETB: 'Br'
};

export interface Expense {
  id: string;
  companyName: string;
  amount: number;
  date: string;
  category: string;
  description: string;
}

export interface InvestmentIdea {
  id: string;
  title: string;
  estimatedCapital: number;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Draft' | 'Researching' | 'Ready';
}

export interface DashboardStats {
  totalSpent: number;
  totalPlannedInvestment: number;
  totalLoans: number;
  totalDebts: number;
  expenseCount: number;
  ideaCount: number;
  loanCount: number;
  debtCount: number;
}

export interface Loan {
  id: string;
  borrowerName: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Repaid';
  notes: string;
}

export interface Debt {
  id: string;
  lenderName: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Repaid';
  notes: string;
}
