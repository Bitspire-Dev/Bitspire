'use client';

import React from 'react';
import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import { CursorLightCard } from '../features/Cursor-Light';
import { useAdminLink } from '@/hooks/useAdminLink';
import { RichText } from '../ui/RichTextPresets';

interface ProcessStep {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  duration?: string | null;
  [key: string]: unknown;
}

interface HowWeWorkProps {
  data?: {
    title?: Record<string, unknown>;
    description?: Record<string, unknown>;
    steps?: ProcessStep[] | null;
  };
  locale?: string;
}

const HowWeWork: React.FC<HowWeWorkProps> = ({ data, locale = 'pl' }) => {
  const { getLink } = useAdminLink();
  const steps = data?.steps || [];

  const buttonTexts = {
    pl: 'Rozpocznij Projekt',
    en: 'Start Project'
  };

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'clipboard':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        );
      case 'design':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        );
      case 'code':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        );
      case 'test':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        );
      case 'rocket':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        );
      case 'support':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        );
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        );
    }
  };

  return (
    <section className="py-12 px-4 bg-slate-900/20 relative overflow-hidden" id="how-we-work" data-tina-field={tinaField(data)}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 mb-4 mx-auto"></div>
          <div data-tina-field={tinaField(data, 'title')}>
            <RichText content={data?.title} preset="section-title" />
          </div>
          <div data-tina-field={tinaField(data, 'description')}>
            <RichText content={data?.description} preset="subtitle" />
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 via-cyan-500 to-blue-500 -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content card */}
                <div className="flex-1 w-full">
                  <CursorLightCard className="relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/40 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/20 group overflow-hidden">
                    <div className="p-8">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Icon */}
                          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {getIcon(step?.icon)}
                            </svg>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div data-tina-field={tinaField(step, 'title')}>
                                <RichText content={step?.title} preset="body" className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors" />
                              </div>
                              {step?.duration && (
                                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium" data-tina-field={tinaField(step, 'duration')}>
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            <div data-tina-field={tinaField(step, 'description')}>
                              <RichText content={step?.description} preset="description" className="text-slate-400 leading-relaxed" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CursorLightCard>
                </div>

                {/* Step number */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/50 relative z-10">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 animate-pulse-slow opacity-50 blur-md" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <CursorLightCard className="relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/40 rounded-2xl max-w-2xl mx-auto hover:border-blue-500/50 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {locale === 'pl' ? 'Gotowy na rozmowę?' : 'Ready to talk?'}
                </h3>
                <p className="text-slate-400 mb-6">
                  {locale === 'pl' ? 'Wypełnij brief i omówmy Twój projekt szczegółowo.' : 'Fill out the brief and let\'s discuss your project in detail.'}
                </p>
                <Link
                  href={getLink("/brief")}
                  className="inline-flex items-center gap-2 btn-tech-primary px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider"
                >
                  {buttonTexts[locale as 'pl' | 'en']}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </CursorLightCard>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
