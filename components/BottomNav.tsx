

import React from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext, type Screen } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import { Home, BarChart2, MessageSquare, Settings, PiggyBank } from './icons.tsx';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
    label: string;
    icon: LucideIcon;
    screen: Screen;
}

const BottomNav: React.FC = () => {
    const { activeScreen, setActiveScreen, t } = useAppContext();

    const navItems: NavItemProps[] = [
        { label: t('home'), icon: Home, screen: 'home' },
        { label: t('analytics'), icon: BarChart2, screen: 'analytics' },
        { label: t('savings'), icon: PiggyBank, screen: 'savings' },
        { label: t('support'), icon: MessageSquare, screen: 'support' },
        { label: t('settings'), icon: Settings, screen: 'settings' },
    ];

    const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, screen }) => {
        const isActive = activeScreen === screen;
        return (
            <button
                onClick={() => setActiveScreen(screen)}
                className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-all duration-200 ${
                    isActive ? 'text-purple-500' : 'text-slate-500 dark:text-slate-400'
                }`}
            >
                <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs font-semibold ${isActive ? 'text-purple-500' : 'text-slate-500 dark:text-slate-400'}`}>{label}</span>
                 <div className={`h-1 w-8 rounded-full mt-1 ${isActive ? 'bg-purple-500' : 'bg-transparent'}`}></div>
            </button>
        );
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800">
            <nav className="flex items-center justify-around h-full">
                {navItems.map(item => (
                    <NavItem key={item.screen} {...item} />
                ))}
            </nav>
        </footer>
    );
};

export default BottomNav;