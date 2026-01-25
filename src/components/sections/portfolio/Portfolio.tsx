'use client';

import React from 'react';
import Image from 'next/image';
import { tinaField } from 'tinacms/dist/react';
import { safeImageSrc } from '@/lib/ui/helpers';

interface Project {
  __typename?: string;
  title?: string | null;
  description?: string | null;
  tags?: (string | null)[] | null;
  year?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  link?: string | null;
}

interface PortfolioData {
  __typename?: string;
  title?: string | null;
  description?: string | null;
  sectionLabel?: string | null;
  projects?: (Project | null)[] | null;
  [key: string]: unknown;
}

export default function Portfolio({ data }: { data?: PortfolioData }) {
  // Filter out null values from projects array
  const projects = (data?.projects || []).filter((p): p is Project => p !== null);

  return (
    <div className="min-h-screen bg-grid-pattern pt-24 pb-32 relative overflow-hidden" data-tina-field={tinaField(data)}>
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500"></div>
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase" data-tina-field={tinaField(data, 'sectionLabel')}>
              {(data && 'sectionLabel' in data ? (data as Record<string, unknown>).sectionLabel : 'Selected Works') as string}
            </span>
          </div>
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            data-tina-field={tinaField(data, 'title')}
          >
            {data?.title}
          </h1>
          <p 
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
            data-tina-field={tinaField(data, 'description')}
          >
            {data?.description}
          </p>
        </header>

        <section aria-label="Wybrane projekty" className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-auto">
          {projects.length > 0 ? (
            projects.map((project, idx) => {
              // Asymmetric grid pattern: first full, then alternating 7-5, 5-7
              const getColumnSpan = (index: number) => {
                if (index === 0) return "lg:col-span-12";
                const pattern = (index - 1) % 2;
                return pattern === 0 ? "lg:col-span-7" : "lg:col-span-5";
              };

              return project?.title ? (
                <article
                  key={project.title}
                  className={`group relative overflow-hidden rounded-2xl glass-panel transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:border-blue-500/40 hover:-translate-y-1 ${getColumnSpan(idx)}`}
                >
                  {/* Image */}
                  {safeImageSrc(project.image) && (
                    <div 
                      className="relative w-full aspect-video overflow-hidden rounded-t-2xl"
                      data-tina-field={tinaField(data, `projects.${idx}.image`)}
                    >
                      <Image
                        src={safeImageSrc(project.image) as string}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    <header className="mb-6">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h2 
                          className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300"
                          data-tina-field={tinaField(data, `projects.${idx}.title`)}
                        >
                          {project.title}
                        </h2>
                        {project.year && (
                          <span 
                            className="inline-flex items-center text-xs tracking-wider uppercase font-bold text-slate-500 border border-slate-700 px-3 py-1.5 rounded-md group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all"
                            data-tina-field={tinaField(data, `projects.${idx}.year`)}
                          >
                            {project.year}
                          </span>
                        )}
                      </div>
                      <p 
                        className="text-slate-400 leading-relaxed"
                        data-tina-field={tinaField(data, `projects.${idx}.description`)}
                      >
                        {project.description}
                      </p>
                    </header>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <ul className="mb-6 flex flex-wrap gap-2" aria-label="Technologie">
                        {project.tags
                          .filter((tag): tag is string => !!tag)
                          .map((tag) => (
                            <li key={tag} className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-default">
                              {tag}
                            </li>
                          ))}
                      </ul>
                    )}

                    {/* Link */}
                    {project.link && (
                      <a
                        href={project.link}
                        target={project.link.startsWith("http") ? "_blank" : undefined}
                        rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-cyan-400 transition-colors group/link"
                      >
                        <span>Zobacz projekt</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transition-transform group-hover/link:translate-x-1">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </article>
              ) : null;
            })
          ) : (
            <p className="text-slate-400 col-span-full text-center py-20">Brak projektów do wyświetlenia.</p>
          )}
        </section>

        {projects.length > 0 && (
          <div className="mt-24 text-center">
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl glass-panel">
              <p className="text-slate-300 text-lg font-medium">
                Chcesz zobaczyć coś konkretnego?
              </p>
              <a 
                href="#contact" 
                className="text-blue-400 font-bold hover:text-cyan-400 transition-colors underline decoration-blue-500/30 hover:decoration-cyan-400 underline-offset-4"
              >
                Napisz do nas
              </a>
              <p className="text-slate-500 text-sm">
                Przygotujemy spersonalizowane case study
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
