import React, { useState, useEffect } from 'react';
// Fix: Added .ts extension to import path.
import { getCredential } from '../services/webAuthnUtils.ts';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
import { Loader2, Delete, Fingerprint } from 'lucide-react';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

const TEST_PIN = '2206';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const { t } = useAppContext();
    const [pin, setPin] = useState('');
    const [isError, setIsError] = useState(false);
    const [isAuthenticatorAvailable, setIsAuthenticatorAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPinLoggingIn, setIsPinLoggingIn] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkSupport = async () => {
            if (window.PublicKeyCredential && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
                try {
                    const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                    setIsAuthenticatorAvailable(isAvailable);
                } catch (e) {
                    setIsAuthenticatorAvailable(false);
                }
            } else {
                setIsAuthenticatorAvailable(false);
            }
        };
        checkSupport();
    }, []);

    useEffect(() => {
        if (pin.length === 4) {
            if (pin === TEST_PIN) {
                setIsPinLoggingIn(true);
                setTimeout(() => {
                    onLoginSuccess();
                }, 1500);
            } else {
                setIsError(true);
                setTimeout(() => {
                    setPin('');
                    setIsError(false);
                }, 800);
            }
        }
    }, [pin, onLoginSuccess]);

    const handlePinClick = (digit: string) => {
        if (isError || pin.length >= 4) return;
        setPin(prevPin => prevPin + digit);
    };

    const handleDelete = () => {
        if (isError) return;
        setPin(prevPin => prevPin.slice(0, -1));
    };

    const handlePasskeyLogin = async () => {
        setIsLoading(true);
        setMessage('');
        const cred = await getCredential();
        if (cred) {
            setMessage(t('passkeyLoginSuccess'));
            setTimeout(() => {
                onLoginSuccess();
            }, 1500);
        } else {
            setMessage(t('passkeyError'));
        }
        setIsLoading(false);
    };

    const pinPadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    const KredoBankLogo = () => (
         <div className="flex items-center justify-center gap-3">
            <svg width="24" height="44" viewBox="0 0 24 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L22 22L2 42" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400">{t('loginTitle')}</h1>
        </div>
    );

    if (isPinLoggingIn) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <KredoBankLogo />
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400 mt-8" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
             <style>{`
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .animate-shake {
                    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
            <div className="w-full max-w-sm text-center mt-16">
                 <KredoBankLogo />
                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('loginSubtitle')}</p>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
                 <p className="font-semibold text-lg">{t('enterPin')}</p>
                 <div className={`flex space-x-4 ${isError ? 'animate-shake' : ''}`}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-colors ${
                                pin.length > i ? (isError ? 'bg-red-500' : 'bg-blue-500') : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                        />
                    ))}
                </div>
                {isError && <p className="text-red-500 text-sm h-5">{t('incorrectPin')}</p>}
                {!isError && <p className="h-5"></p>}
            </div>

            <div className="w-full max-w-xs">
                <div className="grid grid-cols-3 gap-4">
                    {pinPadButtons.map(digit => (
                        <button
                            key={digit}
                            onClick={() => handlePinClick(digit)}
                            className="text-3xl font-light p-4 rounded-full h-20 w-20 mx-auto bg-slate-200/50 dark:bg-slate-800/50 transition-colors active:bg-blue-200 dark:active:bg-blue-900"
                        >
                            {digit}
                        </button>
                    ))}
                    {isAuthenticatorAvailable ? (
                        <button onClick={handlePasskeyLogin} disabled={isLoading} className="text-blue-500 p-4 rounded-full h-20 w-20 mx-auto flex items-center justify-center transition-colors active:bg-blue-200 dark:active:bg-blue-900">
                             {isLoading ? <Loader2 className="w-8 h-8 animate-spin"/> : <Fingerprint className="w-8 h-8" />}
                        </button>
                    ) : (
                         <div className="h-20 w-20"></div> // Placeholder
                    )}
                     <button
                        onClick={() => handlePinClick('0')}
                        className="text-3xl font-light p-4 rounded-full h-20 w-20 mx-auto bg-slate-200/50 dark:bg-slate-800/50 transition-colors active:bg-blue-200 dark:active:bg-blue-900"
                    >
                        0
                    </button>
                    <button onClick={handleDelete} className="p-4 rounded-full h-20 w-20 mx-auto flex items-center justify-center transition-colors active:bg-blue-200 dark:active:bg-blue-900">
                        <Delete className="w-8 h-8" />
                    </button>
                </div>
                 {message && <p className="mt-4 text-sm font-semibold text-center">{message}</p>}
            </div>
        </div>
    );
};

export default LoginScreen;