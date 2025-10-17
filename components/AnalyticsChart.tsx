import React from 'react';
import type { Transaction } from '../types';
import { useAppContext } from '../context/AppContext';

const AnalyticsChart: React.FC = () => {
    const { t, transactions } = useAppContext();
    const expenses = transactions.filter(tx => tx.type === 'expense');

    // Fix: Explicitly type the initial value for the reduce accumulator as Record<string, number>.
    // This allows TypeScript to correctly infer the types of `spendingByCategory`, `totalSpending`, and `categories`, resolving all related type errors.
    const spendingByCategory = expenses.reduce((acc, tx) => {
        // Simple conversion for demo
        let amountInUAH = tx.amount;
        if (tx.currency === 'USD') amountInUAH = tx.amount * 39;
        else if (tx.currency === 'EUR') amountInUAH = tx.amount * 42;
        else if (tx.currency === 'THB') amountInUAH = tx.amount * 1.1;
        
        acc[tx.category] = (acc[tx.category] || 0) + Math.abs(amountInUAH);
        return acc;
    }, {} as Record<string, number>);

    const totalSpending = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);

    const categories = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1]);
    
    const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500'];

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('spendingByCategory')}</h2>
            <div className="space-y-4">
                {categories.map(([category, amount], index) => {
                    const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
                    return (
                        <div key={category}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{category}</span>
                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {amount.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', minimumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div
                                    className={`${colors[index % colors.length]} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalyticsChart;
