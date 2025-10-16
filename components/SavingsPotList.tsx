

import React from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .ts extension to import path.
import type { SavingsPot } from '../types.ts';
// Fix: Added .tsx extension to import path.
import { Target, PlusCircle } from './icons.tsx';

interface SavingsPotCardProps {
    pot: SavingsPot;
    onSelect: () => void;
}

const SavingsPotCard: React.FC<SavingsPotCardProps> = ({ pot, onSelect }) => {
    const { t } = useAppContext();
    const progress = Math.min((pot.currentAmount / pot.targetAmount) * 100, 100);

    return (
        <button onClick={onSelect} className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden transition-transform active:scale-95">
            <img src={pot.imageUrl} alt={pot.title} className="w-full h-32 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{pot.title}</h3>
                <div className="mt-2">
                    <span className="block text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {t('collected')}
                    </span>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {pot.currentAmount.toLocaleString('en-US', { style: 'currency', currency: pot.currency, minimumFractionDigits: 0 })}
                    </span>
                </div>
                 <div className="relative pt-1 mt-2">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200 dark:bg-purple-900">
                        <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{progress.toFixed(0)}%</span>
                    <div className="flex items-center gap-1">
                        <Target className="w-3 h-3"/>
                        <span>
                            {pot.targetAmount.toLocaleString('en-US', { style: 'currency', currency: pot.currency, minimumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
};


interface SavingsPotListProps {
    pots: SavingsPot[];
    onSelectPot: (pot: SavingsPot) => void;
    onCreateNew: () => void;
}

const SavingsPotList: React.FC<SavingsPotListProps> = ({ pots, onSelectPot, onCreateNew }) => {
    const { t } = useAppContext();

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('mySavingsPots')}</h1>
            </div>

            <div className="flex flex-col gap-4">
                 <button onClick={onCreateNew} className="w-full text-left bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors h-32">
                    <PlusCircle className="w-10 h-10 mb-2"/>
                    <span className="font-semibold">{t('createNewPot')}</span>
                </button>

                {pots.map(pot => (
                    <SavingsPotCard key={pot.id} pot={pot} onSelect={() => onSelectPot(pot)} />
                ))}
            </div>
        </div>
    );
};

export default SavingsPotList;