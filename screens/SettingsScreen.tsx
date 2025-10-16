import React, { useState, useEffect } from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import PwaFeatures from '../components/PwaFeatures.tsx';
// Fix: Added .ts extension to import path.
import { createCredential } from '../services/webAuthnUtils.ts';
// Fix: Added .tsx extension to import path.
import { ArrowLeft } from '../components/icons.tsx';
import DebugPanel from '../components/DebugPanel.tsx';

interface SettingsScreenProps {
    onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
    const { t, theme, toggleTheme, lang, setLang, setActiveScreen } = useAppContext();
    const [passkeyStatus, setPasskeyStatus] = useState('');
    const [isAuthenticatorAvailable, setIsAuthenticatorAvailable] = useState<boolean | null>(null);
    const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
    
    useEffect(() => {
        const checkSupport = async () => {
            if (window.PublicKeyCredential && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
                try {
                    const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                    setIsAuthenticatorAvailable(isAvailable);
                } catch (e) {
                    console.error("Error checking authenticator availability:", e);
                    setIsAuthenticatorAvailable(false);
                }
            } else {
                setIsAuthenticatorAvailable(false);
            }
        };
        checkSupport();
    }, []);

    const handleRegisterPasskey = async () => {
        const cred = await createCredential();
        if (cred) {
            setPasskeyStatus(t('passkeyRegistered'));
        } else {
            setPasskeyStatus(t('passkeyError'));
        }
        setTimeout(() => setPasskeyStatus(''), 3000);
    };

    return (
        <>
            <div className="p-4 pb-20 space-y-8">
                 <div className="flex items-center relative justify-center mb-4">
                     <button 
                        onClick={() => setActiveScreen('home')} 
                        className="absolute left-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Back to home"
                     >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('settings')}</h1>
                </div>

                {/* Theme Settings */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('theme')}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={theme === 'dark' ? toggleTheme : undefined}
                            className={`w-full p-2 rounded-md font-semibold ${theme === 'light' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            {t('light')}
                        </button>
                        <button
                            onClick={theme === 'light' ? toggleTheme : undefined}
                            className={`w-full p-2 rounded-md font-semibold ${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            {t('dark')}
                        </button>
                    </div>
                </div>

                {/* Language Settings */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('language')}</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLang('ua')}
                            className={`w-full p-2 rounded-md font-semibold ${lang === 'ua' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            Українська
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`w-full p-2 rounded-md font-semibold ${lang === 'en' ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            English
                        </button>
                    </div>
                </div>
                
                {/* PWA Features */}
                <PwaFeatures />

                {/* Passkey Management */}
                {isAuthenticatorAvailable && (
                     <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">{t('passkey')}</h3>
                         <button
                            onClick={handleRegisterPasskey}
                            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            {t('registerPasskey')}
                        </button>
                        {passkeyStatus && <p className="text-sm mt-2 text-center">{passkeyStatus}</p>}
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={() => setIsDebugPanelOpen(true)}
                    className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    {t('logout')}
                </button>
            </div>
            {isDebugPanelOpen && <DebugPanel onLogout={onLogout} onClose={() => setIsDebugPanelOpen(false)} />}
        </>
    );
};

export default SettingsScreen;