import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getTranslation } from '../services/i18n.ts';
import type { User, Card, Transaction, SavingsPot, PotTransaction } from '../types.ts';
import { MOCK_USER, MOCK_SAVINGS_POTS, MOCK_POT_TRANSACTIONS, INITIAL_MOCK_CARDS, INITIAL_MOCK_TRANSACTIONS } from '../constants.ts';

export type Screen = 'home' | 'analytics' | 'savings' | 'support' | 'settings';
export type Theme = 'light' | 'dark';
export type Language = 'ua' | 'en';

interface AppContextType {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
    t: (key: string) => string;
    lang: Language;
    setLang: (lang: Language) => void;
    theme: Theme;
    toggleTheme: () => void;
    user: User;
    updateUser: (user: Partial<User>) => void;
    isTransferOpen: boolean;
    openTransfer: () => void;
    closeTransfer: () => void;
    savingsPots: SavingsPot[];
    createSavingsPot: (pot: Omit<SavingsPot, 'id' | 'ownerUserId' | 'currentAmount' | 'status' | 'createdAt'>) => void;
    updatePotBalance: (potId: string, amount: number, type: 'top_up' | 'withdraw') => 'success' | 'error';
    potTransactions: PotTransaction[];
    cards: Card[];
    transactions: Transaction[];
    updateCardBalance: (cardId: string, newBalance: number) => void;
    addTransaction: (newTxData: Omit<Transaction, 'id' | 'currency'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [lang, setLang] = useState<Language>('en');
    const [theme, setTheme] = useState<Theme>('light');
    const [user, setUser] = useState<User>(MOCK_USER);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [savingsPots, setSavingsPots] = useState<SavingsPot[]>(MOCK_SAVINGS_POTS);
    const [potTransactions, setPotTransactions] = useState<PotTransaction[]>(MOCK_POT_TRANSACTIONS);
    const [cards, setCards] = useState<Card[]>(INITIAL_MOCK_CARDS);
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_MOCK_TRANSACTIONS);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme) {
            setTheme(storedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    const t = (key: string) => getTranslation(lang, key as any);
    const updateUser = (updatedUser: Partial<User>) => setUser(prev => ({ ...prev, ...updatedUser }));
    const openTransfer = () => setIsTransferOpen(true);
    const closeTransfer = () => setIsTransferOpen(false);
    
    const createSavingsPot = (potData: Omit<SavingsPot, 'id' | 'ownerUserId' | 'currentAmount' | 'status' | 'createdAt'>) => {
        const newPot: SavingsPot = {
            ...potData,
            id: `pot-${Date.now()}`,
            ownerUserId: 'user-1',
            currentAmount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
        };
        setSavingsPots(prev => [newPot, ...prev]);
    };

    const updatePotBalance = (potId: string, amount: number, type: 'top_up' | 'withdraw'): 'success' | 'error' => {
        const potIndex = savingsPots.findIndex(p => p.id === potId);
        if (potIndex === -1) return 'error';

        const pot = savingsPots[potIndex];
        let newAmount = pot.currentAmount;

        if (type === 'top_up') {
            newAmount += amount;
        } else {
            if (pot.currentAmount < amount) return 'error';
            newAmount -= amount;
        }
        
        const updatedPot = { ...pot, currentAmount: newAmount };
        const updatedPots = [...savingsPots];
        updatedPots[potIndex] = updatedPot;
        setSavingsPots(updatedPots);

        const newTransaction: PotTransaction = {
            id: `ptx-${Date.now()}`,
            potId,
            type,
            amount,
            date: new Date().toISOString()
        };
        setPotTransactions(prev => [newTransaction, ...prev]);

        return 'success';
    };
    
    const updateCardBalance = (cardId: string, newBalance: number) => {
        setCards(prevCards => prevCards.map(card => 
            card.id === cardId ? { ...card, balance: newBalance } : card
        ));
    };

    const addTransaction = (newTxData: Omit<Transaction, 'id' | 'currency'>) => {
        const card = cards.find(c => c.id === newTxData.cardId);
        if (!card) return;

        const newTx: Transaction = {
            ...newTxData,
            id: `tx-manual-${Date.now()}`,
            currency: card.currency,
        };
        
        setTransactions(prevTxs => 
            [newTx, ...prevTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
    };

    const value = {
        activeScreen, setActiveScreen,
        t, lang, setLang,
        theme, toggleTheme,
        user, updateUser,
        isTransferOpen, openTransfer, closeTransfer,
        savingsPots, createSavingsPot, updatePotBalance,
        potTransactions,
        cards, transactions, updateCardBalance, addTransaction,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};