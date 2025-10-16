

// Fix: Added .ts extension to the import path.
import { texts } from '../constants.ts';

export const getTranslation = (lang: 'ua' | 'en', key: keyof typeof texts.ua): string => {
    return texts[lang][key] || texts['ua'][key];
};