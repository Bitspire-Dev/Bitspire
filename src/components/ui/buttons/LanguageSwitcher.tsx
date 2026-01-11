'use client';

import Image from 'next/image';
import { usePathname as useNextPathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const flagMap = {
  pl: '/flags/pl.svg',
  en: '/flags/gb.svg',
};

interface LanguageSwitcherProps {
  labels?: {
    switchToPolish?: string;
    switchToEnglish?: string;
  };
}

export function LanguageSwitcher({ labels }: LanguageSwitcherProps = {}) {
  const locale = useLocale();
  const pathname = useNextPathname();

  const otherLocale = locale === 'pl' ? 'en' : 'pl';

  const handleSwitch = () => {
    // Debug: check what locale is detected
    console.log('Language Switcher Debug:', {
      detectedLocale: locale,
      currentURL: window.location.href,
      otherLocale: otherLocale
    });
    
    // Simply replace the current locale with the other one in the URL
    const currentUrl = window.location.href;
    const newUrl = currentUrl.replace(`/${locale}/`, `/${otherLocale}/`);
    
    console.log('Switching to:', newUrl);
    window.location.href = newUrl;
  };

  const ariaLabel = otherLocale === 'pl' 
    ? (labels?.switchToPolish || 'Switch to Polski')
    : (labels?.switchToEnglish || 'Switch to English');

  return (
    <button
      onClick={handleSwitch}
      className="group relative w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-600/40 hover:border-blue-400/60 bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110"
      aria-label={ariaLabel}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Image
        src={flagMap[otherLocale as keyof typeof flagMap]}
        alt={otherLocale === 'pl' ? 'Polski' : 'English'}
        width={24}
        height={24}
        className="w-6 h-6 object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"
      />
    </button>
  );
}
