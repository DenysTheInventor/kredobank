

import React, { useState } from 'react';
// Fix: Added .tsx extension to the import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to the import path.
import Modal from './Modal.tsx';
// Fix: Added .tsx extension to the import path.
import { CheckCircle2, XCircle } from './icons.tsx';

interface TransferScreenProps {
  onClose: () => void;
}

const TransferScreen: React.FC<TransferScreenProps> = ({ onClose }) => {
  const { t, cards } = useAppContext();
  const [fromCardId, setFromCardId] = useState(cards.find(c => c.isPrimary)?.id || cards[0].id);
  const [toCard, setToCard] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'offline' | 'error' >('idle');
  const [error, setError] = useState('');

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numericAmount = parseFloat(amount);
    const sourceCard = cards.find(c => c.id === fromCardId);

    if (!sourceCard || !numericAmount || numericAmount <= 0) {
        setError("Invalid data"); // Should be translated in a real app
        setStatus('error');
        return;
    }

    if (sourceCard.balance < numericAmount) {
        setError(t('notEnoughFunds'));
        setStatus('error');
        return;
    }
    
    if (navigator.onLine) {
        setStatus('success');
    } else {
        setStatus('offline');
    }

    setTimeout(() => {
        onClose();
    }, 2500);
  };

  const renderStatus = () => {
    switch(status) {
        case 'success':
            return <div className="text-center p-8 flex flex-col items-center gap-4 text-green-500">
                <CheckCircle2 className="w-16 h-16"/>
                <p className="text-lg font-semibold">{t('transferSuccess')}</p>
            </div>
        case 'offline':
             return <div className="text-center p-8 flex flex-col items-center gap-4 text-amber-500">
                <CheckCircle2 className="w-16 h-16"/>
                <p className="text-lg font-semibold">{t('transferOffline')}</p>
            </div>
        case 'error':
             return <div className="text-center p-8 flex flex-col items-center gap-4 text-red-500">
                <XCircle className="w-16 h-16"/>
                <p className="text-lg font-semibold">{error}</p>
            </div>
        default:
            return (
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('fromCard')}</label>
                        <select value={fromCardId} onChange={e => setFromCardId(e.target.value)} className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
                            {cards.map(card => (
                                <option key={card.id} value={card.id}>
                                    {card.brand} •••• {card.last4} ({card.balance.toFixed(2)} {card.currency})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('recipientCardNumber')}</label>
                        <input type="text" value={toCard} onChange={e => setToCard(e.target.value)} placeholder="5168 7456 1234 5678" required className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('amount')}</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000.00" required min="1" step="0.01" className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"/>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30">
                        {t('send')}
                    </button>
                </form>
            )
    }
  }


  return (
    <Modal title={t('transferFunds')} onClose={onClose}>
        {renderStatus()}
    </Modal>
  );
};

export default TransferScreen;