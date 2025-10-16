import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import Modal from './Modal.tsx';
import type { Transaction } from '../types.ts';

interface DebugPanelProps {
  onClose: () => void;
  onLogout: () => void;
}

const toYyyyMmDd = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const transactionCategories: Transaction['category'][] = ['Groceries', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Salary', 'Freelance', 'Rent', 'Food'];

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose, onLogout }) => {
    const { t, cards, updateCardBalance, addTransaction, user, updateUser } = useAppContext();
    
    // State for card balances
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [balanceStatus, setBalanceStatus] = useState('');

    // State for new transaction form
    const [txDescription, setTxDescription] = useState('');
    const [txAmount, setTxAmount] = useState('');
    const [txType, setTxType] = useState<'income' | 'expense'>('expense');
    const [txDate, setTxDate] = useState(toYyyyMmDd(new Date()));
    const [txCardId, setTxCardId] = useState(cards.length > 0 ? cards[0].id : '');
    const [txCategory, setTxCategory] = useState<Transaction['category']>('Shopping');
    const [txStatus, setTxStatus] = useState('');

    // Profile state
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [avatar, setAvatar] = useState(user.avatarUrl);
    const [profileStatus, setProfileStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fix: Explicitly type the accumulator 'acc' to ensure 'initialBalances' has the correct type.
        const initialBalances = cards.reduce((acc: Record<string, string>, card) => {
            acc[card.id] = card.balance.toString();
            return acc;
        }, {});
        setBalances(initialBalances);
    }, [cards]);

    const handleBalanceChange = (cardId: string, value: string) => {
        setBalances(prev => ({ ...prev, [cardId]: value }));
    };

    const handleUpdateBalances = () => {
        Object.entries(balances).forEach(([cardId, balanceStr]) => {
            const newBalance = parseFloat(balanceStr);
            if (!isNaN(newBalance)) {
                updateCardBalance(cardId, newBalance);
            }
        });
        setBalanceStatus(t('balancesUpdated'));
        setTimeout(() => setBalanceStatus(''), 2000);
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(txAmount) * (txType === 'expense' ? -1 : 1);
        if (isNaN(amount) || !txDescription || !txCardId) return;

        addTransaction({
            cardId: txCardId,
            description: txDescription,
            amount: amount,
            date: new Date(txDate).toISOString(),
            type: txType,
            category: txCategory,
        });

        setTxStatus(t('transactionAdded'));
        // Reset form
        setTxDescription('');
        setTxAmount('');
        setTimeout(() => setTxStatus(''), 2000);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                // Fix: Add a type guard to ensure reader.result is a string before calling setAvatar.
                if (typeof reader.result === 'string') {
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleProfileSave = () => {
        updateUser({ firstName, lastName, avatarUrl: avatar });
        setProfileStatus(t('profileSaved'));
        setTimeout(() => setProfileStatus(''), 2000);
    };

    return (
        <Modal title={t('debugPanel')} onClose={onClose}>
            <div className="space-y-6 max-h-[75vh] overflow-y-auto pb-8">
                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">{t('profile')}</h3>
                     <div className="flex items-center gap-4 mb-4">
                        <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-purple-600 dark:text-purple-400">{t('changePhoto')}</button>
                            <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG up to 10MB</p>
                        </div>
                    </div>
                     <div className="space-y-2">
                         <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('firstName')}</label>
                            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-1 focus:ring-purple-500 outline-none"/>
                        </div>
                         <div>
                            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('lastName')}</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-1 focus:ring-purple-500 outline-none"/>
                        </div>
                    </div>
                    <button onClick={handleProfileSave} className="w-full mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                        {t('saveProfile')}
                    </button>
                    {profileStatus && <p className="text-sm mt-2 text-center text-green-500">{profileStatus}</p>}
                </div>

                {/* Balance Management */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">{t('updateBalances')}</h3>
                    <div className="space-y-2">
                        {cards.map(card => (
                            <div key={card.id} className="flex items-center gap-2">
                                <label className="flex-1 text-sm">•••• {card.last4} ({card.currency})</label>
                                <input
                                    type="number"
                                    value={balances[card.id] || ''}
                                    onChange={(e) => handleBalanceChange(card.id, e.target.value)}
                                    className="w-32 p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600"
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={handleUpdateBalances} className="w-full mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                        {t('saveChanges')}
                    </button>
                    {balanceStatus && <p className="text-center text-sm mt-2 text-green-500">{balanceStatus}</p>}
                </div>

                {/* Transaction Management */}
                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-3">{t('addNewTransaction')}</h3>
                    <form onSubmit={handleAddTransaction} className="space-y-3">
                        <input type="text" placeholder={t('description')} value={txDescription} onChange={e => setTxDescription(e.target.value)} required className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                        <div className="grid grid-cols-2 gap-2">
                             <input type="number" placeholder={t('amount')} value={txAmount} onChange={e => setTxAmount(e.target.value)} required step="0.01" className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                             <select value={txType} onChange={e => setTxType(e.target.value as 'income' | 'expense')} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600">
                                <option value="expense">{t('expense')}</option>
                                <option value="income">{t('income')}</option>
                             </select>
                        </div>
                         <select value={txCategory} onChange={e => setTxCategory(e.target.value as Transaction['category'])} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600">
                           {transactionCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select value={txCardId} onChange={e => setTxCardId(e.target.value)} className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600">
                           <option value="">{t('selectCard')}</option>
                           {cards.map(card => <option key={card.id} value={card.id}>•••• {card.last4} ({card.currency})</option>)}
                        </select>
                        <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} required className="w-full p-2 bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600" />
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                           {t('addNewTransaction')}
                        </button>
                        {txStatus && <p className="text-center text-sm mt-2 text-green-500">{txStatus}</p>}
                    </form>
                </div>

                 {/* Real Logout Button */}
                <button
                    onClick={onLogout}
                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                    {t('confirmLogout')}
                </button>
            </div>
        </Modal>
    );
};

export default DebugPanel;
