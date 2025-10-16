

import React, { useState } from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .ts extension to import path.
import type { SavingsPot } from '../types.ts';
// Fix: Added .tsx extension to import path.
import { ArrowLeft, Target, Banknote, ArrowUp, ArrowDown } from '../components/icons.tsx';
// Fix: Added .tsx extension to import path.
import PotTransactionModal from '../components/PotTransactionModal.tsx';

interface SavingsPotDetailScreenProps {
    pot: SavingsPot;
    onBack: () => void;
}

const SavingsPotDetailScreen: React.FC<SavingsPotDetailScreenProps> = ({ pot, onBack }) => {
    const { t, potTransactions } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'top_up' | 'withdraw'>('top_up');

    const progress = Math.min((pot.currentAmount / pot.targetAmount) * 100, 100);
    const transactionsForPot = potTransactions.filter(tx => tx.potId === pot.id);

    const handleOpenModal = (type: 'top_up' | 'withdraw') => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in">
            {isModalOpen && <PotTransactionModal pot={pot} transactionType={modalType} onClose={() => setIsModalOpen(false)} />}
            
            <div className="relative h-48">
                <img src={pot.imageUrl} alt={pot.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-4">
                     <button 
                        onClick={onBack} 
                        className="absolute top-4 left-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                        aria-label="Back"
                     >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{pot.title}</h1>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {/* Progress Section */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('collected')}</p>
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                                {pot.currentAmount.toLocaleString('en-US', { style: 'currency', currency: pot.currency, minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1"><Target className="w-3 h-3"/> {t('of')}</p>
                           <p className="font-semibold">
                                {pot.targetAmount.toLocaleString('en-US', { style: 'currency', currency: pot.currency, minimumFractionDigits: 2 })}
                           </p>
                        </div>
                    </div>
                     <div className="relative pt-1 mt-3">
                        <div className="text-center font-bold text-purple-600 dark:text-purple-300 text-sm mb-1">{progress.toFixed(1)}%</div>
                        <div className="overflow-hidden h-3 text-xs flex rounded-full bg-purple-200 dark:bg-purple-900">
                            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleOpenModal('top_up')} className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30">
                        <Banknote className="w-5 h-5"/>
                        <span>{t('topup')}</span>
                    </button>
                    <button onClick={() => handleOpenModal('withdraw')} className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-95">
                        <span>{t('withdraw')}</span>
                    </button>
                </div>
                
                {/* History Section */}
                <div>
                     <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{t('potHistory')}</h2>
                     <div className="space-y-2">
                        {transactionsForPot.map(tx => {
                            const isTopUp = tx.type === 'top_up';
                            return (
                                <div key={tx.id} className="flex items-center bg-white dark:bg-slate-800 p-3 rounded-lg">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isTopUp ? 'bg-green-100 dark:bg-green-900/50 text-green-500' : 'bg-red-100 dark:bg-red-900/50 text-red-500'}`}>
                                        {isTopUp ? <ArrowUp className="w-5 h-5"/> : <ArrowDown className="w-5 h-5"/>}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{isTopUp ? t('topup') : t('withdraw')}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`font-bold ${isTopUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {isTopUp ? '+' : '-'} {tx.amount.toLocaleString('en-US', { style: 'currency', currency: pot.currency })}
                                    </div>
                                </div>
                            )
                        })}
                     </div>
                </div>
            </div>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    )
};

export default SavingsPotDetailScreen;