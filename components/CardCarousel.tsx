
import React from 'react';
// Fix: Added .tsx extension to import path.
import { useAppContext } from '../context/AppContext.tsx';
// Fix: Added .tsx extension to import path.
import { MoreVertical, Lock } from './icons.tsx';
// Fix: Added .ts extension to import path.
import type { Card } from '../types.ts';

interface CardCarouselProps {
    onCardSelect: (card: Card) => void;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ onCardSelect }) => {
    const { t, cards } = useAppContext();
    const totalBalance = cards.reduce((sum, card) => {
        // A simple conversion for demo purposes
        if (card.currency === 'USD') return sum + card.balance * 39;
        if (card.currency === 'EUR') return sum + card.balance * 42;
        if (card.currency === 'THB') return sum + card.balance * 1.1;
        return sum + card.balance;
    }, 0);

    return (
        <section>
            <div className="mb-4">
                 <h2 className="text-sm text-slate-500 dark:text-slate-400">{t('mainBalance')}</h2>
                 <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                     {totalBalance.toLocaleString('uk-UA', { style: 'currency', currency: 'UAH', currencyDisplay: 'code', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </p>
            </div>
            <div className="flex overflow-x-auto space-x-4 px-16 pb-8 -mx-4 snap-x snap-mandatory [perspective:2000px]">
                {cards.map((card) => (
                    <button 
                        key={card.id} 
                        onClick={() => onCardSelect(card)}
                        className={`relative snap-center shrink-0 w-80 h-48 rounded-3xl shadow-2xl p-6 flex flex-col justify-between text-white text-left bg-gradient-to-br ${card.colorGradient} transform transition-transform duration-500 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-purple-400 [transform:perspective(1000px)_rotateX(15deg)] hover:[transform:perspective(1000px)_rotateX(0deg)] active:scale-95 border border-white/20`}
                        aria-label={`View details for card ending in ${card.last4}`}
                    >
                        {card.isBlocked && (
                            <div className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center text-white z-10">
                                <Lock className="w-10 h-10 mb-2" />
                                <span className="font-bold text-lg">{t('cardBlocked')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">{card.brand}</p>
                                <p className="text-sm opacity-80">{card.isPrimary ? 'Primary' : 'Savings'}</p>
                            </div>
                            <MoreVertical className="opacity-70"/>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-wider mb-1">•••• {card.last4}</p>
                            <p className="text-xl font-bold">
                                {card.balance.toLocaleString('en-US', { style: 'currency', currency: card.currency })}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CardCarousel;