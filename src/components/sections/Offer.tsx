'use client';

import React from 'react';
import { CursorLightCard } from '../features/Cursor-Light';
import { tinaField } from 'tinacms/dist/react';
import { PreviewLink } from '../features/PreviewLink';
import { RichText } from '@/components/ui/RichTextPresets';

interface Service {
  title?: string | null;
  description?: string | null;
  icon?: string | null;
  features?: (string | null)[] | null;
  link?: string | null;
  buttonText?: string | null;
  [key: string]: unknown;
}

interface OfferData {
  title?: Record<string, unknown>;
  subtitle?: Record<string, unknown>;
  sectionLabel?: string | null;
  services?: (Service | null)[] | null;
  [key: string]: unknown;
}

export const Offer: React.FC<{ data?: OfferData }> = ({ data }) => {
  const services = data?.services?.filter((s): s is Service => s !== null) || [];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith('#')) {
      e.preventDefault();
      const targetId = link.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section className="py-12 px-4 relative" data-tina-field={tinaField(data)}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-3 rounded-full border border-blue-500/20 bg-blue-500/5">
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase" data-tina-field={tinaField(data, 'sectionLabel')}>
              {data?.sectionLabel}
            </span>
          </div>
          <div data-tina-field={tinaField(data, 'title')}>
            <RichText content={data?.title} preset="section-title" className="mb-4" />
          </div>
          <div data-tina-field={tinaField(data, 'subtitle')}>
            <RichText content={data?.subtitle} preset="description" className="max-w-3xl mx-auto" />
          </div>
        </div>

        {/* Grid - 4 karty w jednym rzędzie na desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <CursorLightCard 
              key={index} 
              className="rounded-2xl relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/40 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/20 group overflow-hidden"
            >
              <div 
                className="h-full flex flex-col p-6"
                data-tina-field={tinaField(service)}
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div className="mb-4 relative">
                    <div 
                      className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-3xl border border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                      data-tina-field={tinaField(service, 'icon')}
                    >
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div data-tina-field={tinaField(service, 'title')}>
                    <RichText content={service.title} preset="body" className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  {/* Description */}
                  <div data-tina-field={tinaField(service, 'description')}>
                    <RichText content={service.description} preset="description" className="text-slate-400 text-sm mb-4 grow leading-relaxed" />
                  </div>

                  {/* Features list */}
                  {service.features && service.features.length > 0 && (
                    <ul className="mb-4 space-y-2">
                      {service.features.map((feature, idx) => 
                        feature ? (
                          <li key={idx} className="flex items-start text-xs text-slate-300">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span data-tina-field={tinaField(service, `features.${idx}`)}>{feature}</span>
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                  
                  {/* CTA Button */}
                  <PreviewLink
                    href={service.link || '#contact'}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleClick(e, service.link || '#contact')}
                    className="mt-auto w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] text-sm font-medium"
                  >
                    <span data-tina-field={tinaField(service, 'buttonText')}>
                      {service.buttonText}
                    </span>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </PreviewLink>
                </div>
              </div>
            </CursorLightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
