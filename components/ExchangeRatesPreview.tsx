import React, { useState, useEffect } from 'react';
import { getExchangeRates, type ExchangeRates } from '../services/exchangeRateService.ts';
import { useAppContext } from '../context/AppContext.tsx';
import { Scale, Loader2 } from './icons.tsx';

interface ExchangeRatesPreviewProps {
    onClick: () => void;
}

const ExchangeRatesPreview: React.FC<ExchangeRatesPreviewProps> = ({ onClick }) => {
    const { t } = useAppContext();
    const [rates, setRates] = useState<ExchangeRates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const fetchedRates = await getExchangeRates();
                setRates(fetchedRates);
            } catch (err) {
                setError("Could not load rates.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRates();
    }, []);

    const renderRateLine = (code: 'USD' | 'THB', isLast: boolean) => {
        if (!rates) return null;
        const rate = rates[code];
        const flagUrl = `https://flagcdn.com/w40/${rate.countryCode}.png`;

        return (
             <div className={`flex justify-between items-center py-3 ${!isLast ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                <div className="flex items-center gap-3">
                    <img src={flagUrl} alt={`${rate.name} flag`} className="w-8 h-auto rounded-md object-contain" />
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{rate.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-right">{rate.rate.toFixed(2)} UAH</p>
                </div>
            </div>
        );
    };

    return (
        <section>
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Scale className="w-5 h-5" /> {t('exchangeRates')}
                </h2>
                 <button onClick={onClick} className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
                    {t('viewAll')}
                </button>
            </div>
            <div 
                className="w-full bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm"
            >
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                    </div>
                ) : error ? (
                     <p className="text-center text-red-500 h-24 flex items-center justify-center">{error}</p>
                ) : (
                    <div onClick={onClick} className="cursor-pointer">
                        {renderRateLine('USD', false)}
                        {renderRateLine('THB', true)}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExchangeRatesPreview;