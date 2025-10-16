

import React, { useState, useEffect } from 'react';
// Fix: Added .ts extension to the import path.
import type { Card } from '../types.ts';
// Fix: Added .tsx extension to the import path.
import Modal from './Modal.tsx';
// Fix: Added .tsx extension to the import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to the import path.
import { Lock, ShieldCheck, Copy, CheckCircle2 } from './icons.tsx';

interface CardManagementScreenProps {
  card: Card;
  onClose: () => void;
}

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button onClick={() => onChange(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const CardManagementScreen: React.FC<CardManagementScreenProps> = ({ card, onClose }) => {
    const { t } = useAppContext();
    const [isBlocked, setIsBlocked] = useState(card.isBlocked);
    const [onlineLimit, setOnlineLimit] = useState(card.limits.online.toString());
    const [withdrawalLimit, setWithdrawalLimit] = useState(card.limits.withdrawal.toString());
    const [statusMessage, setStatusMessage] = useState('');
    const [copiedValue, setCopiedValue] = useState('');

    const showStatusMessage = (message: string) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(''), 2000);
    };

    const handleSaveChanges = () => {
        // In a real app, this would be an API call
        console.log("Saving changes:", { isBlocked, onlineLimit, withdrawalLimit });
        showStatusMessage(t('changesSaved'));
    };
    
    const handlePinChange = () => {
        // Simulate PIN change flow
        showStatusMessage(t('pinChangedSuccess'));
    };

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedValue(field);
        setTimeout(() => setCopiedValue(''), 2000);
    };
    
    const fullCardNumber = `${card.brand === 'Visa' ? '4141' : '5168'} 7451 8800 ${card.last4}`;

    return (
        <Modal title={t('manageCard')} onClose={onClose}>
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pb-8">
                {/* Block Card Section */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-slate-500 dark:text-slate-400"/>
                        <span className="font-semibold">{t('blockCard')}</span>
                    </div>
                    <Toggle enabled={isBlocked} onChange={setIsBlocked} />
                </div>
                
                {/* Limits Section */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg space-y-4">
                    <h3 className="font-bold text-lg">{t('spendingLimits')}</h3>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('onlineLimit')}</label>
                        <div className="relative mt-1">
                            <input type="number" value={onlineLimit} onChange={e => setOnlineLimit(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none pr-20"/>
                            <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-slate-400">{card.currency} {t('perMonth')}</span>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('withdrawalLimit')}</label>
                        <div className="relative mt-1">
                            <input type="number" value={withdrawalLimit} onChange={e => setWithdrawalLimit(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 outline-none pr-20"/>
                             <span className="absolute inset-y-0 right-4 flex items-center text-slate-500 dark:text-slate-400">{card.currency} {t('perMonth')}</span>
                        </div>
                    </div>
                </div>
                
                {/* Security Section */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-slate-500 dark:text-slate-400"/>
                        <span className="font-semibold">{t('security')}</span>
                    </div>
                    <button onClick={handlePinChange} className="text-sm font-semibold text-purple-600 dark:text-purple-400">{t('changePin')}</button>
                </div>
                
                {/* Card Details Section */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg space-y-2">
                     <h3 className="font-bold text-lg mb-2">{t('cardDetails')}</h3>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">{t('cardNumber')}</span>
                        <div className="flex items-center gap-2">
                             <span className="font-mono font-semibold">{fullCardNumber}</span>
                             <button onClick={() => handleCopy(fullCardNumber, 'number')} className="text-purple-500">
                                {copiedValue === 'number' ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                             </button>
                        </div>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">{t('expires')}</span>
                        <span className="font-mono font-semibold">{card.expirationDate}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">CVV</span>
                        <div className="flex items-center gap-2">
                             <span className="font-mono font-semibold">{card.cvv}</span>
                             <button onClick={() => handleCopy(card.cvv, 'cvv')} className="text-purple-500">
                                 {copiedValue === 'cvv' ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                             </button>
                        </div>
                     </div>
                </div>

                {/* Save Button & Status */}
                <div className="sticky bottom-0 bg-slate-100 dark:bg-slate-800 pt-4 -mb-8">
                    {statusMessage ? (
                         <div className="w-full text-center text-green-500 font-semibold mb-4">
                            {statusMessage}
                        </div>
                    ) : (
                        <button onClick={handleSaveChanges} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30">
                            {t('saveChanges')}
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CardManagementScreen;