import React, { useState, useEffect } from 'react';
import { getExchangeRates, type ExchangeRates } from '../services/exchangeRateService.ts';
import { useAppContext } from '../context/AppContext.tsx';
import Modal from './Modal.tsx';
import { Loader2 } from './icons.tsx';

interface ExchangeRatesModalProps {
    onClose: () => void;
}

const ExchangeRatesModal: React.FC<ExchangeRatesModalProps> = ({ onClose }) => {
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
    
    const currencyOrder = ['USD', 'EUR', 'GBP', 'THB', 'VND', 'MYR'];

    return (
        <Modal title={t('exchangeRates')} onClose={onClose}>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 py-16">{error}</p>
                ) : (
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-2 space-y-1">
                        {currencyOrder.map((code, index) => {
                            if (!rates || !rates[code]) return null;
                            const rateInfo = rates[code];
                            const flagUrl = `https://flagcdn.com/w40/${rateInfo.countryCode}.png`;
                            const isSmallCurrency = code === 'VND';
                            const multiplier = isSmallCurrency ? 10000 : 1;
                            
                            return (
                                <React.Fragment key={code}>
                                    <div className="flex justify-between items-center p-2">
                                        <div className="flex items-center gap-4">
                                            <img src={flagUrl} alt={`${rateInfo.name} flag`} className="w-10 h-auto rounded-md object-contain" />
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-100">{rateInfo.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{(rateInfo.rate * multiplier).toFixed(2)} UAH</p>
                                            {multiplier > 1 && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">for {multiplier.toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                    {index < currencyOrder.length - 1 && <div className="h-[1px] bg-slate-200 dark:bg-slate-700 ml-16"></div>}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
                 <p className="text-xs text-center text-slate-400 dark:text-slate-500 pt-4">Rates are for informational purposes only.</p>
            </div>
        </Modal>
    );
};

export default ExchangeRatesModal;