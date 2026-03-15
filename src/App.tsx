import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  CreditCard, 
  Lightbulb, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  X,
  ChevronRight,
  Briefcase,
  HandCoins,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, InvestmentIdea, Loan, Debt, Currency, CURRENCY_SYMBOLS } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ideas, setIdeas] = useState<InvestmentIdea[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('it_expenses');
    const savedIdeas = localStorage.getItem('it_ideas');
    const savedLoans = localStorage.getItem('it_loans');
    const savedDebts = localStorage.getItem('it_debts');
    const savedCurrency = localStorage.getItem('it_currency') as Currency;
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
    if (savedLoans) setLoans(JSON.parse(savedLoans));
    if (savedDebts) setDebts(JSON.parse(savedDebts));
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('it_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('it_ideas', JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem('it_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('it_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('it_currency', currency);
  }, [currency]);

  const formatValue = (value: number) => {
    const symbol = CURRENCY_SYMBOLS[currency];
    return currency === 'USD' 
      ? `${symbol}${value.toLocaleString()}`
      : `${value.toLocaleString()} ${symbol}`;
  };

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPlanned = ideas.reduce((sum, i) => sum + i.estimatedCapital, 0);
    const totalLoans = loans.reduce((sum, l) => l.status === 'Pending' ? sum + l.amount : sum, 0);
    const totalDebts = debts.reduce((sum, d) => d.status === 'Pending' ? sum + d.amount : sum, 0);
    return {
      totalSpent,
      totalPlanned,
      totalLoans,
      totalDebts,
      expenseCount: expenses.length,
      ideaCount: ideas.length,
      loanCount: loans.length,
      debtCount: debts.length
    };
  }, [expenses, ideas, loans, debts]);

  const chartData = [
    { name: 'Total Spent', value: stats.totalSpent, color: '#f4f4f5' },
    { name: 'Planned Investment', value: stats.totalPlanned, color: '#10b981' },
    { name: 'Active Loans', value: stats.totalLoans, color: '#6366f1' },
    { name: 'Active Debts', value: stats.totalDebts, color: '#f43f5e' }
  ];

  const addExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      companyName: formData.get('companyName') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string || new Date().toISOString(),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
    };
    setExpenses([newExpense, ...expenses]);
    setIsExpenseModalOpen(false);
  };

  const addIdea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIdea: InvestmentIdea = {
      id: crypto.randomUUID(),
      title: formData.get('title') as string,
      estimatedCapital: Number(formData.get('amount')),
      description: formData.get('description') as string,
      priority: formData.get('priority') as any,
      status: 'Draft',
    };
    setIdeas([newIdea, ...ideas]);
    setIsIdeaModalOpen(false);
  };

  const addLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      borrowerName: formData.get('borrowerName') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string || new Date().toISOString(),
      status: 'Pending',
      notes: formData.get('notes') as string,
    };
    setLoans([newLoan, ...loans]);
    setIsLoanModalOpen(false);
  };

  const addDebt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDebt: Debt = {
      id: crypto.randomUUID(),
      lenderName: formData.get('lenderName') as string,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string || new Date().toISOString(),
      status: 'Pending',
      notes: formData.get('notes') as string,
    };
    setDebts([newDebt, ...debts]);
    setIsDebtModalOpen(false);
  };

  const toggleLoanStatus = (id: string) => {
    setLoans(loans.map(l => l.id === id ? { ...l, status: l.status === 'Pending' ? 'Repaid' : 'Pending' } : l));
  };

  const toggleDebtStatus = (id: string) => {
    setDebts(debts.map(d => d.id === id ? { ...d, status: d.status === 'Pending' ? 'Repaid' : 'Pending' } : d));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteIdea = (id: string) => {
    setIdeas(ideas.filter(i => i.id !== id));
  };

  const deleteLoan = (id: string) => {
    setLoans(loans.filter(l => l.id !== id));
  };

  const deleteDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const exportData = () => {
    const data = {
      expenses,
      ideas,
      loans,
      debts,
      currency,
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `self-invest-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.expenses) setExpenses(data.expenses);
        if (data.ideas) setIdeas(data.ideas);
        if (data.loans) setLoans(data.loans);
        if (data.debts) setDebts(data.debts);
        if (data.currency) setCurrency(data.currency);
        setIsBackupModalOpen(false);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-100 p-2 rounded-lg">
                <TrendingUp className="text-zinc-900 w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">self invest</h1>
            </div>
            
            {/* Currency Switcher */}
            <div className="hidden sm:flex bg-zinc-800 p-1 rounded-xl border border-zinc-700">
              <button 
                onClick={() => setCurrency('USD')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  currency === 'USD' ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                USD ($)
              </button>
              <button 
                onClick={() => setCurrency('ETB')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  currency === 'ETB' ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                )}
              >
                ETB (Br)
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white transition-colors cursor-pointer"
            >
              <Plus size={16} /> Expense
            </button>
            <button 
              onClick={() => setIsIdeaModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Idea
            </button>
            <button 
              onClick={() => setIsLoanModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Loan
            </button>
            <button 
              onClick={() => setIsDebtModalOpen(true)}
              className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <Plus size={16} /> Debt
            </button>
            <button 
              onClick={() => setIsBackupModalOpen(true)}
              className="flex items-center justify-center w-10 h-10 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 hover:text-white transition-all cursor-pointer border border-zinc-700"
              title="Backup & Restore"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Company Paid" 
            value={formatValue(stats.totalSpent)} 
            icon={<CreditCard className="text-zinc-400" size={20} />}
            subtitle={`${stats.expenseCount} transactions`}
          />
          <StatCard 
            title="Planned Investment" 
            value={formatValue(stats.totalPlanned)} 
            icon={<DollarSign className="text-emerald-400" size={20} />}
            subtitle={`${stats.ideaCount} business ideas`}
          />
          <StatCard 
            title="Active Loans Given" 
            value={formatValue(stats.totalLoans)} 
            icon={<HandCoins className="text-indigo-400" size={20} />}
            subtitle="Money owed to you"
          />
          <StatCard 
            title="Active Debts (On Me)" 
            value={formatValue(stats.totalDebts)} 
            icon={<CreditCard className="text-rose-400" size={20} />}
            subtitle="Money you owe"
          />
          <StatCard 
            title="Net Worth" 
            value={formatValue(stats.totalSpent + stats.totalPlanned + stats.totalLoans - stats.totalDebts)} 
            icon={<ArrowUpRight className="text-zinc-400" size={20} />}
            subtitle="Combined value"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Lists */}
          <div className="lg:col-span-2 space-y-8">
            {/* Loans Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <HandCoins size={20} className="text-indigo-500" />
                  Loans Given (Receivables)
                </h2>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/50">
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Borrower</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {loans.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                            No loans recorded yet.
                          </td>
                        </tr>
                      ) : (
                        loans.map((loan) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={loan.id} 
                            className="hover:bg-zinc-900/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-zinc-100">{loan.borrowerName}</div>
                              <div className="text-xs text-zinc-400 truncate max-w-[200px]">{loan.notes}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-400">
                              {format(new Date(loan.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => toggleLoanStatus(loan.id)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors",
                                  loan.status === 'Repaid' 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : "bg-amber-500/10 text-amber-400"
                                )}
                              >
                                {loan.status === 'Repaid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {loan.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-white text-right">
                              {formatValue(loan.amount)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteLoan(loan.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Debts Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard size={20} className="text-rose-500" />
                  Loans Taken (Debts)
                </h2>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/50">
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lender</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {debts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                            No debts recorded yet.
                          </td>
                        </tr>
                      ) : (
                        debts.map((debt) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={debt.id} 
                            className="hover:bg-zinc-900/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-zinc-100">{debt.lenderName}</div>
                              <div className="text-xs text-zinc-400 truncate max-w-[200px]">{debt.notes}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-400">
                              {format(new Date(debt.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => toggleDebtStatus(debt.id)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors",
                                  debt.status === 'Repaid' 
                                    ? "bg-emerald-500/10 text-emerald-400" 
                                    : "bg-amber-500/10 text-amber-400"
                                )}
                              >
                                {debt.status === 'Repaid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {debt.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-white text-right">
                              {formatValue(debt.amount)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteDebt(debt.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Expenses Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard size={20} className="text-zinc-500" />
                  Company Payments
                </h2>
              </div>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-zinc-900/50">
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                        <th className="px-6 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {expenses.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic">
                            No payments recorded yet.
                          </td>
                        </tr>
                      ) : (
                        expenses.map((expense) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={expense.id} 
                            className="hover:bg-zinc-900/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="font-medium text-zinc-100">{expense.companyName}</div>
                              <div className="text-xs text-zinc-400 truncate max-w-[200px]">{expense.description}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-400">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-white text-right">
                              {formatValue(expense.amount)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteExpense(expense.id)}
                                className="text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Investment Ideas Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb size={20} className="text-emerald-500" />
                  Business Investment Ideas
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.length === 0 ? (
                  <div className="col-span-full glass-card p-12 text-center text-zinc-500 italic">
                    No investment ideas yet. Start dreaming!
                  </div>
                ) : (
                  ideas.map((idea) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={idea.id} 
                      className="glass-card p-5 hover:border-emerald-500/30 transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                          <Briefcase className="text-emerald-400" size={18} />
                        </div>
                        <div className="flex gap-2">
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                            idea.priority === 'High' ? "bg-red-500/10 text-red-400" : 
                            idea.priority === 'Medium' ? "bg-amber-500/10 text-amber-400" : 
                            "bg-blue-500/10 text-blue-400"
                          )}>
                            {idea.priority}
                          </span>
                          <button 
                            onClick={() => deleteIdea(idea.id)}
                            className="text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-bold text-white mb-1">{idea.title}</h3>
                      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{idea.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                        <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wide">Required Capital</div>
                        <div className="font-bold text-emerald-400">{formatValue(idea.estimatedCapital)}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Visualization & Quick Actions */}
          <div className="space-y-8">
            <section className="glass-card p-6 space-y-6">
              <h3 className="font-semibold text-white">Financial Overview</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#71717a' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#71717a' }}
                      tickFormatter={(value) => {
                        const symbol = CURRENCY_SYMBOLS[currency];
                        const formatted = value >= 1000 ? (value / 1000) + 'k' : value;
                        return currency === 'USD' ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
                      }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#18181b' }}
                      contentStyle={{ 
                        backgroundColor: '#18181b',
                        borderRadius: '12px', 
                        border: '1px solid #27272a', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: number) => formatValue(value)}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Total Allocation</span>
                  <span className="font-bold text-white">{formatValue(stats.totalSpent + stats.totalPlanned + stats.totalLoans)}</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-zinc-100 h-full" 
                    style={{ width: `${(stats.totalSpent / (stats.totalSpent + stats.totalPlanned + stats.totalLoans + stats.totalDebts || 1)) * 100}%` }} 
                  />
                  <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${(stats.totalPlanned / (stats.totalSpent + stats.totalPlanned + stats.totalLoans + stats.totalDebts || 1)) * 100}%` }} 
                  />
                  <div 
                    className="bg-indigo-500 h-full" 
                    style={{ width: `${(stats.totalLoans / (stats.totalSpent + stats.totalPlanned + stats.totalLoans + stats.totalDebts || 1)) * 100}%` }} 
                  />
                  <div 
                    className="bg-rose-500 h-full" 
                    style={{ width: `${(stats.totalDebts / (stats.totalSpent + stats.totalPlanned + stats.totalLoans + stats.totalDebts || 1)) * 100}%` }} 
                  />
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-100" />
                    <span className="text-zinc-500">Spent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-zinc-500">Planned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-zinc-500">Loans</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-zinc-500">Debts</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Quick Insights</h3>
              <div className="space-y-4">
                <InsightItem 
                  label="Loan Recovery" 
                  value={`${loans.length > 0 ? ((loans.filter(l => l.status === 'Repaid').length / loans.length) * 100).toFixed(0) : 0}%`}
                  description="Percentage of loans repaid"
                />
                <InsightItem 
                  label="Avg. Loan Size" 
                  value={formatValue(stats.loanCount > 0 ? (loans.reduce((s, l) => s + l.amount, 0) / stats.loanCount) : 0)}
                  description="Average amount per person"
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isExpenseModalOpen && (
          <Modal title="Add Company Payment" onClose={() => setIsExpenseModalOpen(false)}>
            <form onSubmit={addExpense} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Company Name</label>
                <input required name="companyName" type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-white" placeholder="e.g. Acme Corp" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Amount ({CURRENCY_SYMBOLS[currency]})</label>
                  <input required name="amount" type="number" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-white" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                  <select name="category" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-white">
                    <option>Software</option>
                    <option>Hardware</option>
                    <option>Services</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                <input name="date" type="date" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all text-white" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Details</label>
                <textarea name="description" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all min-h-[100px] text-white" placeholder="What was this for?"></textarea>
              </div>
              <button type="submit" className="w-full bg-white text-zinc-900 font-bold py-3 rounded-xl hover:bg-zinc-100 transition-colors shadow-lg shadow-white/5 cursor-pointer">
                Save Payment
              </button>
            </form>
          </Modal>
        )}

        {isIdeaModalOpen && (
          <Modal title="New Business Idea" onClose={() => setIsIdeaModalOpen(false)}>
            <form onSubmit={addIdea} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Idea Title</label>
                <input required name="title" type="text" className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-white" placeholder="e.g. AI SaaS for Lawyers" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Est. Capital ({CURRENCY_SYMBOLS[currency]})</label>
                  <input required name="amount" type="number" className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-white" placeholder="5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Priority</label>
                  <select name="priority" className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all text-white">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Business Concept</label>
                <textarea name="description" className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all min-h-[120px] text-white" placeholder="Describe the business model, target market, and why it needs this investment..."></textarea>
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10 cursor-pointer">
                Create Idea
              </button>
            </form>
          </Modal>
        )}

        {isLoanModalOpen && (
          <Modal title="Record Loan Given" onClose={() => setIsLoanModalOpen(false)}>
            <form onSubmit={addLoan} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Person's Name</label>
                <input required name="borrowerName" type="text" className="w-full bg-indigo-950/30 border border-indigo-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white" placeholder="Who did you lend to?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Amount ({CURRENCY_SYMBOLS[currency]})</label>
                  <input required name="amount" type="number" className="w-full bg-indigo-950/30 border border-indigo-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                  <input name="date" type="date" className="w-full bg-indigo-950/30 border border-indigo-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-white" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Notes</label>
                <textarea name="notes" className="w-full bg-indigo-950/30 border border-indigo-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all min-h-[100px] text-white" placeholder="Repayment terms or reason..."></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer">
                Record Loan
              </button>
            </form>
          </Modal>
        )}

        {isDebtModalOpen && (
          <Modal title="Record Loan Taken (Debt)" onClose={() => setIsDebtModalOpen(false)}>
            <form onSubmit={addDebt} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Lender's Name</label>
                <input required name="lenderName" type="text" className="w-full bg-rose-950/30 border border-rose-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-white" placeholder="Who did you borrow from?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Amount ({CURRENCY_SYMBOLS[currency]})</label>
                  <input required name="amount" type="number" className="w-full bg-rose-950/30 border border-rose-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-white" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                  <input name="date" type="date" className="w-full bg-rose-950/30 border border-rose-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all text-white" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Notes</label>
                <textarea name="notes" className="w-full bg-rose-950/30 border border-rose-900/50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all min-h-[100px] text-white" placeholder="Repayment terms or reason..."></textarea>
              </div>
              <button type="submit" className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/10 cursor-pointer">
                Record Debt
              </button>
            </form>
          </Modal>
        )}

        {isBackupModalOpen && (
          <Modal title="Backup & Restore Data" onClose={() => setIsBackupModalOpen(false)}>
            <div className="space-y-6">
              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Download size={18} className="text-blue-400" />
                  Export Data
                </h4>
                <p className="text-sm text-zinc-400">Download all your dashboard data as a JSON file to save it or move it to another device.</p>
                <button 
                  onClick={exportData}
                  className="w-full mt-2 bg-zinc-100 text-zinc-900 font-bold py-2.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
                >
                  Download Backup
                </button>
              </div>

              <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Upload size={18} className="text-emerald-400" />
                  Import Data
                </h4>
                <p className="text-sm text-zinc-400">Upload a previously exported backup file to restore your data on this device.</p>
                <div className="relative mt-2">
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={importData}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full bg-zinc-800 text-zinc-200 font-bold py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors">
                    Choose File to Import
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 text-center italic">Warning: This will overwrite your current data on this device.</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, subtitle }: { title: string, value: string, icon: React.ReactNode, subtitle: string }) {
  return (
    <div className="glass-card p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{title}</div>
        <div className="bg-zinc-800 p-2 rounded-lg border border-zinc-700">{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-zinc-400">{subtitle}</div>
      </div>
    </div>
  );
}

function InsightItem({ label, value, description }: { label: string, value: string, description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-8 bg-zinc-800 rounded-full" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-500">{label}</span>
          <span className="text-sm font-bold text-white">{value}</span>
        </div>
        <div className="text-[10px] text-zinc-500">{description}</div>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <h3 className="font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
