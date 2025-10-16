
import React, { useState } from 'react';
// Fix: Added .tsx extension to import path.
import { AppContextProvider, useAppContext } from './context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import HomeScreen from './screens/HomeScreen.tsx';
import AnalyticsScreen from './screens/AnalyticsScreen.tsx';
import SupportScreen from './screens/SupportScreen.tsx';
import SettingsScreen from './screens/SettingsScreen.tsx';
import SavingsScreen from './screens/SavingsScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import LoginScreen from './components/LoginScreen.tsx';

const AppContent: React.FC = () => {
    const { activeScreen } = useAppContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };
    
    if (!isAuthenticated) {
        return <LoginScreen onLoginSuccess={handleLogin} />;
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen />;
            case 'analytics':
                return <AnalyticsScreen />;
            case 'savings':
                return <SavingsScreen />;
            case 'support':
                return <SupportScreen />;
            case 'settings':
                return <SettingsScreen onLogout={handleLogout} />;
            default:
                return <HomeScreen />;
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
            <div className="max-w-md mx-auto relative bg-slate-50 dark:bg-slate-900 shadow-2xl shadow-purple-500/10">
                <div className="min-h-screen">
                    {renderScreen()}
                </div>
                <BottomNav />
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppContextProvider>
            <AppContent />
        </AppContextProvider>
    );
};

export default App;