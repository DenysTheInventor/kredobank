import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import CardCarousel from '../components/CardCarousel.tsx';
import QuickActions from '../components/QuickActions.tsx';
import TransactionList from '../components/TransactionList.tsx';
import CardDetailsModal from '../components/CardDetailsModal.tsx';
import TransferScreen from '../components/TransferScreen.tsx';
import AllTransactionsScreen from './AllTransactionsScreen.tsx';
import { useAppContext } from '../context/AppContext.tsx';
import type { Card } from '../types.ts';
import ExchangeRatesPreview from '../components/ExchangeRatesPreview.tsx';
import ExchangeRatesModal from '../components/ExchangeRatesModal.tsx';

const HomeScreen: React.FC = () => {
    const { t, isTransferOpen, closeTransfer, transactions } = useAppContext();
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [isViewingAll, setIsViewingAll] = useState(false);
    const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

    if (isViewingAll) {
        return <AllTransactionsScreen onClose={() => setIsViewingAll(false)} />;
    }

    return (
        <div className="pb-20">
            <Header />
            <main className="p-4 space-y-8">
                <CardCarousel onCardSelect={setSelectedCard} />
                <QuickActions />
                <ExchangeRatesPreview onClick={() => setIsRatesModalOpen(true)} />
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t('recentTransactions')}</h2>
                        <button onClick={() => setIsViewingAll(true)} className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                            {t('viewAll')}
                        </button>
                    </div>
                    <TransactionList transactions={transactions.slice(0, 5)} />
                </div>
            </main>

            {selectedCard && (
                <CardDetailsModal 
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}

            {isTransferOpen && <TransferScreen onClose={closeTransfer} />}
            {isRatesModalOpen && <ExchangeRatesModal onClose={() => setIsRatesModalOpen(false)} />}
        </div>
    );
};

export default HomeScreen;