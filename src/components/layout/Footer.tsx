import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { buildLocalePath } from '@/lib/seo/metadata';
import { CookieSettingsButton } from '@/components/ui/cookie-consent/CookieSettingsButton';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const COMPANY = {
  name: 'Bitspire',
  logo: '/logo/bitspire-logo-main.svg'
};

const DESCRIPTION = {
  pl: 'Tworzymy nowoczesne strony internetowe, sklepy online i aplikacje. Pomagamy firmom rozwijać się w świecie cyfrowym.',
  en: 'We create modern websites, online stores and applications. We help businesses grow in the digital world.'
};

const CONTACT = {
  email: 'kontakt@bitspire.pl',
  phone: '+48 123 456 789',
  location: 'Polska'
};

const SOCIAL_MEDIA = [
  { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61578556904045', icon: 'facebook' },
  { platform: 'Instagram', url: 'https://instagram.com/bitspire_', icon: 'instagram' },
  { platform: 'LinkedIn', url: 'https://linkedin.com/company/bitspire', icon: 'linkedin' },
  { platform: 'GitHub', url: 'https://github.com/bitspire1', icon: 'github' }
];

const LEGAL_LINKS = {
  pl: [
    { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
    { label: 'Polityka cookies', href: '/polityka-cookies' },
    { label: 'Regulamin', href: '/regulamin' }
  ],
  en: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookies Policy', href: '/cookies-policy' },
    { label: 'Terms', href: '/terms' }
  ]
};

const COOKIE_SETTINGS_TEXT = {
  pl: 'Ustawienia cookies',
  en: 'Cookie Settings'
};

export const Footer: React.FC<{ locale: 'pl' | 'en' }> = ({ locale }) => {
  const description = DESCRIPTION[locale];
  const legalLinks = LEGAL_LINKS[locale];
  const cookieSettingsText = COOKIE_SETTINGS_TEXT[locale];
  const getLink = (href: string) => buildLocalePath(locale, href);

  const getSocialIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'facebook': return <FaFacebookF className="w-5 h-5" />;
      case 'instagram': return <FaInstagram className="w-5 h-5" />;
      case 'linkedin': return <FaLinkedinIn className="w-5 h-5" />;
      case 'github': return <FaGithub className="w-5 h-5" />;
      default: return <FaEnvelope className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Logo i opis */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image
                src={COMPANY.logo}
                alt={COMPANY.name}
                className="h-10 w-auto"
                width={120}
                height={40}
              />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {description}
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {SOCIAL_MEDIA.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-slate-800"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              {locale === 'en' ? 'Contact' : 'Kontakt'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaEnvelope className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
                <a 
                  href={`mailto:${CONTACT.email}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
                <a 
                  href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-4 h-4 text-blue-400 mr-3 shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>{CONTACT.location}</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              {locale === 'en' ? 'Legal' : 'Dokumenty'}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={getLink(link.href)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {COMPANY.name}. {locale === 'en' ? 'All rights reserved.' : 'Wszystkie prawa zastrzeżone.'}
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm justify-center md:justify-end">
            <CookieSettingsButton label={cookieSettingsText} />
          </div>
        </div>
      </div>
    </footer>
  );
};
