

import React from 'react';
// Fix: Added .ts extension to the import path.
import { QUICK_ACTIONS } from '../constants.ts';
// Fix: Added .tsx extension to the import path.
import { useAppContext } from '../context/AppContext.tsx';

const QuickActions: React.FC = () => {
    const { t, openTransfer } = useAppContext();

    const handleAction = (action: 'transfer' | 'pay' | 'topup' | 'cards') => {
        if (action === 'transfer') {
            openTransfer();
        } else {
            // Placeholder for other actions
            alert(`Action: ${action}`);
        }
    };

    return (
        <section>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">{t('quickActions')}</h2>
            <div className="grid grid-cols-4 gap-4 text-center">
                {QUICK_ACTIONS.map(({ labelKey, icon: Icon, action }) => (
                    <div key={labelKey}>
                        <button 
                            onClick={() => handleAction(action)}
                            className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 transition-transform active:scale-95">
                            <Icon className="w-7 h-7" />
                        </button>
                        <p className="text-xs mt-2 text-slate-600 dark:text-slate-300">{t(labelKey)}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default QuickActions;