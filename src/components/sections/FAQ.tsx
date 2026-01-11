'use client';

import React, { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import { CursorLightCard } from '../features/Cursor-Light';
import { RichText } from '../ui/RichTextPresets';

interface FAQItem {
  question?: string | null;
  answer?: string | null;
  [key: string]: unknown;
}

interface FAQProps {
  data?: {
    title?: Record<string, unknown>;
    description?: Record<string, unknown>;
    items?: FAQItem[] | null;
  };
  locale?: string;
}

const FAQ: React.FC<FAQProps> = ({ data, locale = 'pl' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const buttonTexts = {
    pl: 'Skontaktuj się z nami',
    en: 'Contact us'
  };

  const ctaQuestionTexts = {
    pl: 'Nie znalazłeś odpowiedzi na swoje pytanie?',
    en: 'Didn\'t find the answer to your question?'
  };

  const defaultItems: FAQItem[] = [
    {
      question: 'Ile czasu zajmuje realizacja projektu?',
      answer: 'Czas realizacji zależy od skomplikowania projektu. Standardowa strona internetowa to 2-4 tygodnie, sklep internetowy 4-8 tygodni, a bardziej zaawansowane aplikacje mogą wymagać 2-3 miesięcy.'
    },
    {
      question: 'Czy zapewniacie wsparcie po zakończeniu projektu?',
      answer: 'Tak! Oferujemy pakiety wsparcia technicznego, które obejmują aktualizacje, naprawy błędów, optymalizację oraz pomoc w rozwoju strony. Możemy również przeszkolić Twój zespół w zakresie zarządzania treścią.'
    },
    {
      question: 'Jakie technologie wykorzystujecie?',
      answer: 'Pracujemy z najnowszymi technologiami: Next.js, React, TypeScript, Node.js, TailwindCSS. Dla e-commerce wykorzystujemy Shopify, WooCommerce lub rozwiązania custom. Dostosowujemy technologie do potrzeb projektu.'
    },
    {
      question: 'Czy mogę zobaczyć projekt w trakcie realizacji?',
      answer: 'Oczywiście! Podczas realizacji regularnie prezentujemy postępy prac. Otrzymasz dostęp do wersji testowej strony, gdzie będziesz mógł na bieżąco śledzić rozwój projektu i zgłaszać uwagi.'
    },
    {
      question: 'Jakie są koszty realizacji projektu?',
      answer: 'Koszt zależy od zakresu i złożoności projektu. Proste strony wizytówkowe zaczynają się od 3000 zł, sklepy internetowe od 8000 zł. Po wypełnieniu briefu przygotujemy szczegółową wycenę dostosowaną do Twoich potrzeb.'
    },
    {
      question: 'Czy strona będzie responsywna?',
      answer: 'Zdecydowanie tak! Wszystkie nasze projekty są w pełni responsywne i dostosowane do urządzeń mobilnych, tabletów i komputerów. Dbamy o optymalne doświadczenie użytkownika na każdym urządzeniu.'
    }
  ];

  const items = data?.items && data.items.length > 0 ? data.items : defaultItems;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-4 bg-slate-900/40 relative overflow-hidden" id="faq" data-tina-field={tinaField(data)}>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 mb-4 mx-auto"></div>
          <div data-tina-field={tinaField(data, 'title')}>
            <RichText content={data?.title} preset="section-title" />
          </div>
          <div data-tina-field={tinaField(data, 'description')}>
            <RichText content={data?.description} preset="subtitle" />
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <CursorLightCard
              key={index}
              className="relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden hover:border-blue-500/50 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                >
                  <div className="flex-1" data-tina-field={tinaField(item, 'question')}>
                    <RichText content={item?.question} preset="body" className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <div className={`shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-blue-500/20' : ''}`}>
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="w-full h-px bg-linear-to-r from-transparent via-slate-700 to-transparent mb-4" />
                    <div data-tina-field={tinaField(item, 'answer')}>
                      <RichText content={item?.answer} preset="description" className="text-slate-400 leading-relaxed" />
                    </div>
                  </div>
                </div>
              </div>
            </CursorLightCard>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            {ctaQuestionTexts[locale as 'pl' | 'en']}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 btn-tech-primary px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider"
          >
            {buttonTexts[locale as 'pl' | 'en']}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
