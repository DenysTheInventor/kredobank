import React from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import { Settings } from './icons.tsx';

const Header: React.FC = () => {
    const { t, setActiveScreen, user } = useAppContext();
    return (
        <header
            className="flex items-center justify-between px-4 pb-4 bg-white/5 dark:bg-black/10 backdrop-blur-sm sticky top-0 z-10"
            style={{ paddingTop: `calc(1rem + env(safe-area-inset-top))` }}
        >
            <div className="flex items-center gap-3">
                <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover" />
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('hello')},</p>
                    <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{`${user.firstName} ${user.lastName}`}</p>
                </div>
            </div>
            <button
                onClick={() => setActiveScreen('settings')}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label={t('settings')}
            >
                <Settings className="w-6 h-6" />
            </button>
        </header>
    );
};

export default Header;