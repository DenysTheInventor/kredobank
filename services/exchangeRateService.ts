export interface Rate {
    rate: number;
    name: string;
    flag: string;
    countryCode: string;
}

export interface ExchangeRates {
    [key: string]: Rate;
}

const MOCK_RATES: ExchangeRates = {
    'USD': { rate: 40.55, name: 'US Dollar', flag: '🇺🇸', countryCode: 'us' },
    'THB': { rate: 1.10, name: 'Thai Baht', flag: '🇹🇭', countryCode: 'th' },
    'EUR': { rate: 43.85, name: 'Euro', flag: '🇪🇺', countryCode: 'eu' },
    'GBP': { rate: 51.20, name: 'British Pound', flag: '🇬🇧', countryCode: 'gb' },
    'VND': { rate: 0.0016, name: 'Vietnamese Dong', flag: '🇻🇳', countryCode: 'vn' },
    'MYR': { rate: 8.65, name: 'Malaysian Ringgit', flag: '🇲🇾', countryCode: 'my' },
};

export const getExchangeRates = async (): Promise<ExchangeRates> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, you would fetch from an API
    // To simulate potential errors:
    // if (Math.random() > 0.9) {
    //     throw new Error("Failed to fetch exchange rates.");
    // }
    
    return MOCK_RATES;
};