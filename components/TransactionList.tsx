import React from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import type { Transaction } from '../types.ts';
import { PieChart, ShoppingBag, Utensils, Bus, HeartPulse, Film, FileText, Briefcase, Pizza, HandCoins, Building2 } from 'lucide-react';

const categoryIcons = {
    Groceries: <Utensils className="w-5 h-5" />,
    Transport: <Bus className="w-5 h-5" />,
    Entertainment: <Film className="w-5 h-5" />,
    Health: <HeartPulse className="w-5 h-5" />,
    Shopping: <ShoppingBag className="w-5 h-5" />,
    Utilities: <FileText className="w-5 h-5" />,
    Salary: <Briefcase className="w-5 h-5" />,
    Food: <Pizza className="w-5 h-5" />,
    Freelance: <HandCoins className="w-5 h-5" />,
    Rent: <Building2 className="w-5 h-5" />,
    Default: <PieChart className="w-5 h-5" />,
};

interface TransactionListProps {
  transactions: Transaction[];
  groupByDate?: boolean;
}

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => (
    <div className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-4 text-slate-500 dark:text-slate-400">
            {categoryIcons[tx.category] || categoryIcons.Default}
        </div>
        <div className="flex-grow">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{tx.description}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
        </div>
        <div className={`font-bold text-right ${tx.type === 'income' ? 'text-green-500' : 'text-slate-800 dark:text-slate-200'}`}>
            {tx.type === 'income' ? '+' : ''}{tx.amount.toFixed(2)}
            <span className="text-xs ml-1 text-slate-400">{tx.currency}</span>
        </div>
    </div>
);

const TransactionList: React.FC<TransactionListProps> = ({ transactions, groupByDate = false }) => {
    const { t } = useAppContext();

    if (!transactions.length) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-8">No transactions found for the selected period.</p>;
    }

    if (!groupByDate) {
        return (
            <div className="space-y-2">
                {transactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
            </div>
        );
    }
    
    const getFriendlyDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) return t('today');
        if (date.toDateString() === yesterday.toDateString()) return t('yesterday');
        
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const groupedTransactions = transactions.reduce((acc, tx) => {
        const dateKey = new Date(tx.date).toDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>);

    return (
        <div className="space-y-4">
            {Object.entries(groupedTransactions).map(([date, txs]) => (
                <div key={date}>
                    <h3 className="font-semibold text-slate-600 dark:text-slate-400 text-sm mb-2 px-2">{getFriendlyDate(date)}</h3>
                    <div className="space-y-2">
                         {/* Fix: Cast txs to Transaction[] as TypeScript may fail to infer it correctly from Object.entries */}
                         {(txs as Transaction[]).map(tx => <TransactionItem key={tx.id} tx={tx} />)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;