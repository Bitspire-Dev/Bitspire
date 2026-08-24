export interface CompanySocial {
  platform: string;
  url: string;
}

export interface CompanyData {
  name: string;
  email: string;
  phone: string;
  phoneRaw: string;
  address: Record<'pl' | 'en', string>;
  hours: Record<'pl' | 'en', string>;
  taxId: string | null;
  krs: string | null;
  socials: CompanySocial[];
}

export const COMPANY: CompanyData = {
  name: 'Bitspire',
  email: 'kontakt@bitspire.pl',
  phone: '+48 780 926 993',
  phoneRaw: '+48780926993',
  address: {
    pl: 'Polska',
    en: 'Poland',
  },
  hours: {
    pl: 'pn–pt: 9:00–17:00',
    en: 'Mon–Fri: 9:00–17:00',
  },
  taxId: null,
  krs: null,
  socials: [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/bitspire-one' },
    { platform: 'GitHub', url: 'https://github.com/Bitspire-Dev' },
    { platform: 'Instagram', url: 'https://www.instagram.com/bitspire_/' },
    { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61578556904045' },
  ],
} as const;
