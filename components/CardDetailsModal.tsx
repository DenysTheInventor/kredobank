import React, { useState } from 'react';
import type { Card, Transaction } from '../types.ts';
import Modal from './Modal.tsx';
import TransactionList from './TransactionList.tsx';
import CardManagementScreen from './CardManagementScreen.tsx';
import { Settings } from './icons.tsx';
import { useAppContext } from '../context/AppContext.tsx';

interface CardDetailsModalProps {
  card: Card;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, onClose }) => {
    const { t, transactions } = useAppContext();
    const [showManagement, setShowManagement] = useState(false);
    const cardTransactions = transactions.filter(tx => tx.cardId === card.id);

    if (showManagement) {
        return <CardManagementScreen card={card} onClose={onClose} />;
    }

    return (
        <Modal title={`${card.brand} •••• ${card.last4}`} onClose={onClose}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pb-8">
                <div className={`relative w-full h-48 rounded-2xl shadow-lg p-6 flex flex-col justify-between text-white bg-gradient-to-br ${card.colorGradient}`}>
                     <div>
                        <p className="font-semibold text-lg">{card.brand}</p>
                        <p className="text-sm opacity-80">{card.isPrimary ? 'Primary' : 'Savings'}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-semibold tracking-wider mb-1">•••• {card.last4}</p>
                        <p className="text-xl font-bold">
                            {card.balance.toLocaleString('en-US', { style: 'currency', currency: card.currency })}
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowManagement(true)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all active:scale-95">
                    <Settings className="w-5 h-5"/>
                    <span>{t('manageCard')}</span>
                </button>
                
                <TransactionList transactions={cardTransactions} />
            </div>
        </Modal>
    );
};

export default CardDetailsModal;