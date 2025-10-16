

import React from 'react';
// Fix: Added .ts extension to import path.
import { usePwaInstall } from '../hooks/usePwaInstall.ts';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import { Download, CheckCircle2 } from './icons.tsx';

const PwaFeatures: React.FC = () => {
    const { canInstall, triggerInstall, isInstalled } = usePwaInstall();
    const { t } = useAppContext();
    
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">PWA Controls</h3>
            {isInstalled ? (
                 <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-5 h-5"/>
                    <span>{t('appInstalled')}</span>
                </div>
            ) : canInstall ? (
                <button 
                    onClick={triggerInstall}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Download className="w-5 h-5"/>
                    <span>{t('installApp')}</span>
                </button>
            ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Installation not available on this browser.</p>
            )}
        </div>
    );
};

export default PwaFeatures;