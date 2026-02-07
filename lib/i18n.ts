// 13-Language Translation System
import { vi } from './translations/vi';
import { us } from './translations/us';
import { de } from './translations/de';
import { es } from './translations/es';
import { ar } from './translations/ar';
import { cn } from './translations/cn';
import { ru } from './translations/ru';
import { mn } from './translations/mn';
import { th } from './translations/th';
import { id } from './translations/id';
import { pl } from './translations/pl';
import { fr } from './translations/fr';
import { it } from './translations/it';

export const translations = { vi, us, de, es, ar, cn, ru, mn, th, id, pl, fr, it };

export function getTranslation(lang: string) {
    return (translations as any)[lang] || translations.us;
}

export function getUserLanguage(): string {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('userCountry') || 'us';
    }
    return 'us';
}

export function setUserLanguage(lang: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('userCountry', lang);
    }
}
