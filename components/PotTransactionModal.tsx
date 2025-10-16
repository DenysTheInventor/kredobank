

import React, { useState } from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .ts extension to import path.
import type { SavingsPot } from '../types.ts';
// Fix: Added .tsx extension to import path.
import Modal from './Modal.tsx';
// Fix: Added .tsx extension to import path.
import { CheckCircle2, XCircle } from './icons.tsx';

interface PotTransactionModalProps {
  pot: SavingsPot;
  transactionType: 'top_up' | 'withdraw';
  onClose: () => void;
}

const PotTransactionModal: React.FC<PotTransactionModalProps> = ({ pot, transactionType, onClose }) => {
  const { t, updatePotBalance } = useAppContext();
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const isTopUp = transactionType === 'top_up';
  const title = isTopUp ? t('topUpPot') : t('withdrawFromPot');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const numericAmount = parseFloat(amount);

    if (!numericAmount || numericAmount <= 0) {
        setError('Invalid amount');
        setStatus('error');
        return;
    }

    const result = updatePotBalance(pot.id, numericAmount, transactionType);

    if (result === 'success') {
        setStatus('success');
    } else {
        setError(t('insufficientFundsInPot'));
        setStatus('error');
    }
    
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center p-8 flex flex-col items-center gap-4 text-green-500">
            <CheckCircle2 className="w-16 h-16" />
            <p className="text-lg font-semibold">{t('operationSuccessful')}</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center p-8 flex flex-col items-center gap-4 text-red-500">
            <XCircle className="w-16 h-16" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('amount')}</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="100.00"
                required
                min="0.01"
                step="0.01"
                className="w-full mt-1 p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-500/30"
            >
              {isTopUp ? t('topup') : t('withdraw')}
            </button>
          </form>
        );
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
};

export default PotTransactionModal;