import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import TransactionList from '../components/TransactionList.tsx';
import { ArrowLeft } from '../components/icons.tsx';

interface AllTransactionsScreenProps {
  onClose: () => void;
}

const toYyyyMmDd = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const AllTransactionsScreen: React.FC<AllTransactionsScreenProps> = ({ onClose }) => {
    const { t, transactions } = useAppContext();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [startDate, setStartDate] = useState(toYyyyMmDd(thirtyDaysAgo));
    const [endDate, setEndDate] = useState(toYyyyMmDd(new Date()));

    const filteredTransactions = useMemo(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of the day

        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= start && txDate <= end;
        });
    }, [startDate, endDate, transactions]);
    
    return (
        <div className="pb-20 flex flex-col h-screen">
             <header className="flex items-center p-4 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 border-b dark:border-slate-800">
                 <button 
                    onClick={onClose} 
                    className="p-2 mr-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Back"
                 >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('allTransactions')}</h1>
            </header>

            <div className="p-4 space-y-4 bg-slate-100 dark:bg-slate-800/50">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start-date" className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('startDate')}</label>
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="end-date" className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('endDate')}</label>
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <main className="flex-grow overflow-y-auto p-4">
                <TransactionList transactions={filteredTransactions} groupByDate={true} />
            </main>
        </div>
    );
};

export default AllTransactionsScreen;