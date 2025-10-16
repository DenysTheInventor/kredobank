

import React, { useState } from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import { ArrowLeft } from '../components/icons.tsx';
// Fix: Added .ts extension to import path.
import type { SavingsPot } from '../types.ts';

interface CreateSavingsPotScreenProps {
    onBack: () => void;
}

const CreateSavingsPotScreen: React.FC<CreateSavingsPotScreenProps> = ({ onBack }) => {
    const { t, createSavingsPot } = useAppContext();
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currency, setCurrency] = useState<'UAH' | 'USD' | 'EUR'>('UAH');
    const [imageUrl, setImageUrl] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPot: Omit<SavingsPot, 'id' | 'ownerUserId' | 'currentAmount' | 'status' | 'createdAt'> = {
            title,
            targetAmount: parseFloat(targetAmount),
            currency,
            imageUrl: imageUrl || `https://source.unsplash.com/800x600/?${title}`,
        };
        createSavingsPot(newPot);
        onBack();
    };

    return (
        <div className="p-4 animate-fade-in">
            <div className="flex items-center relative justify-center mb-6">
                 <button 
                    onClick={onBack} 
                    className="absolute left-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Back"
                 >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('createNewPot')}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('potTitle')}</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        placeholder={t('potTitlePlaceholder')}
                        required 
                        className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>

                 <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('targetAmount')}</label>
                    <input 
                        type="number" 
                        value={targetAmount}
                        onChange={e => setTargetAmount(e.target.value)}
                        placeholder="50000"
                        required 
                        min="1"
                        className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>

                 <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('currency')}</label>
                    <select 
                        value={currency} 
                        onChange={e => setCurrency(e.target.value as 'UAH' | 'USD' | 'EUR')} 
                        className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    >
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('imageUrl')}</label>
                    <input 
                        type="text" 
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder={t('imageUrlPlaceholder')}
                        className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                </div>

                 <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30 mt-6">
                    {t('create')}
                </button>
            </form>
             <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </div>
    );
};

export default CreateSavingsPotScreen;