'use client';

import React from 'react';
import Image from 'next/image';
import { Background } from '@/components/layout/Background';
import { Hero } from '@/components/sections/home-page/Hero';
import LegalPage from '@/components/sections/LegalPage';
import { CursorLightProvider } from '@/components/features/Cursor-Light';
import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface PreviewClientProps {
  data: unknown;
  query: string;
  variables: Record<string, unknown>;
  blogPosts?: unknown[];
}

export default function PreviewClient({ 
  data, 
  query, 
  variables, 
  blogPosts = []
}: PreviewClientProps): React.JSX.Element {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Use TinaCMS real-time editing
  const { data: liveData } = useTina({
    query,
    variables,
    data: data as object,
  });

  if (!liveData || typeof liveData !== 'object') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading preview...</div>
      </div>
    );
  }

  const content = liveData as Record<string, any>;

  // Check if it's a portfolio post
  if ('portfolio' in content && content.portfolio) {
    const post = content.portfolio;
    
    // Format date
    const formattedDate = post.date 
      ? new Date(post.date).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    return (
      <CursorLightProvider>
        <div className="min-h-screen bg-slate-900 pt-24 relative overflow-hidden">
          <Background />
          
          {/* Preview Banner */}
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-slate-900 text-center py-2 font-bold z-50 text-sm">
            LIVE PREVIEW MODE - TinaCMS Visual Editor - Changes are saved in real-time
          </div>
          
          <article className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
            {/* Portfolio Post Content (existing code continues...) */}
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <span className="text-xs uppercase tracking-wider font-semibold bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                    {post.category}
                  </span>
                )}
                {post.year && (
                  <span className="text-xs uppercase tracking-wider font-semibold bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                    {post.year}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="text-gradient">{post.title}</span>
              </h1>

              {post.excerpt && (
                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                {formattedDate && (
                  <time dateTime={post.date || undefined}>
                    {formattedDate}
                  </time>
                )}
                {post.client && (
                  <>
                    <span>•</span>
                    <span>Klient: {post.client}</span>
                  </>
                )}
              </div>
            </header>

            {/* Featured image */}
            {post.image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-slate-700/50">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title || 'Project image'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.map((tag: string | null) => tag && (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-wide bg-slate-800/70 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-linear-to-r prose-h2:from-blue-400 prose-h2:to-emerald-300 prose-h2:bg-clip-text prose-h2:text-transparent
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-200
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
              prose-strong:text-slate-200 prose-strong:font-semibold
              prose-ul:text-slate-300
              prose-li:text-slate-300 prose-li:marker:text-blue-400
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-800/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-code:text-blue-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            ">
              {post.body && (
                <TinaMarkdown content={post.body} />
              )}
            </div>

            {/* Project link */}
            {post.link && (
              <div className="mt-12 pt-8 border-t border-slate-700/50">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-8 py-4 shadow-lg shadow-blue-600/30 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 focus-visible:ring-offset-slate-900"
                >
                  Zobacz projekt
                  <span aria-hidden>→</span>
                </a>
              </div>
            )}
          </article>
        </div>
      </CursorLightProvider>
    );
  }

  // Check if it's a blog post
  if ('blog' in content && content.blog) {
    const post = content.blog;
    
    // Format date
    const formattedDate = post.date 
      ? new Date(post.date).toLocaleDateString('pl-PL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    return (
      <CursorLightProvider>
        <div className="min-h-screen bg-slate-900 pt-24 relative overflow-hidden">
          <Background />
          
          {/* Preview Banner */}
          <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-slate-900 text-center py-2 font-bold z-50 text-sm">
            LIVE PREVIEW MODE - TinaCMS Visual Editor - Changes are saved in real-time
          </div>
          
          <article className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
            {/* Header */}
            <header className="mb-12">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <span className="text-xs uppercase tracking-wider font-semibold bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                    {post.category}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                <span className="text-gradient">{post.title}</span>
              </h1>

              {post.excerpt && (
                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                {formattedDate && (
                  <time dateTime={post.date || undefined}>
                    {formattedDate}
                  </time>
                )}
                {post.readTime && (
                  <>
                    <span>•</span>
                    <span>{post.readTime} min czytania</span>
                  </>
                )}
              </div>
            </header>

            {/* Featured image */}
            {post.image && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 border border-slate-700/50">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title || 'Blog post image'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {post.tags.map((tag: string | null) => tag && (
                  <span
                    key={tag}
                    className="text-xs uppercase tracking-wide bg-slate-800/70 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:bg-linear-to-r prose-h2:from-blue-400 prose-h2:to-emerald-300 prose-h2:bg-clip-text prose-h2:text-transparent
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-200
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline
              prose-strong:text-slate-200 prose-strong:font-semibold
              prose-ul:text-slate-300
              prose-li:text-slate-300 prose-li:marker:text-blue-400
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-800/30 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-code:text-blue-300 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
            ">
              {post.body && (
                <TinaMarkdown content={post.body} />
              )}
            </div>
          </article>
        </div>
      </CursorLightProvider>
    );
  }

  // Check if it's a pages collection item
  if (!('pages' in content) || !content.pages) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-white">Loading preview...</div>
      </div>
    );
  }

  const page = content.pages;

  // Extract filename to determine page type
  const filename = (variables as { relativePath?: string }).relativePath?.split('/').pop()?.replace('.mdx', '') || '';
  
  // Determine page type
  const isLegalPage = page.sections && Array.isArray(page.sections);
  const isHomePage = !!page.hero;
  const isPortfolioPage = page.projects && Array.isArray(page.projects);
  const isBriefPage = filename === 'brief';
  const isBlogPage = filename === 'blog';
  const isSimplePage = !isLegalPage && !isHomePage && !isPortfolioPage && !isBriefPage && !isBlogPage;

  return (
    <CursorLightProvider>
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        <Background />
        
        {/* Preview Banner */}
  <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-slate-900 text-center py-2 font-bold z-60 text-sm">
          LIVE PREVIEW MODE - TinaCMS Visual Editor - Changes are saved in real-time
        </div>
        
        <main className="relative z-10 pt-24">
          {/* Brief page */}
          {isBriefPage && page.brief && (
            <section
              id="brief-section"
              className="max-w-4xl mx-auto px-6 pb-16 space-y-4"
              data-tina-field={tinaField(page, 'brief')}
            >
              {page.brief.title && (
                <h1
                  className="text-4xl md:text-5xl font-extrabold tracking-tight"
                  data-tina-field={tinaField(page.brief, 'title')}
                >
                  {page.brief.title}
                </h1>
              )}

              {page.brief.description && (
                <p
                  className="text-lg text-slate-300 leading-relaxed"
                  data-tina-field={tinaField(page.brief, 'description')}
                >
                  {page.brief.description}
                </p>
              )}
            </section>
          )}
          
          {/* Blog listing page */}
          {isBlogPage && (
            <div className="max-w-7xl mx-auto px-6 pb-24">
              <header className="mb-14 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="text-gradient">{page.title}</span>
                </h1>
                {page.description && (
                  <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    {page.description}
                  </p>
                )}
              </header>
              
              {/* Blog posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts && blogPosts.length > 0 ? (
                  blogPosts.map((post: any, index: number) => (
                    <article 
                      key={index}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
                    >
                      {post.image && (
                        <div className="relative w-full aspect-video overflow-hidden bg-slate-900">
                          <Image
                            src={post.image}
                            alt={post.imageAlt || post.title || 'Blog post'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            data-tina-field={tinaField(post, 'image')}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {post.category && (
                          <span 
                            className="text-xs text-blue-400 font-semibold uppercase tracking-wider"
                            data-tina-field={tinaField(post, 'category')}
                          >
                            {post.category}
                          </span>
                        )}
                        {post.title && (
                          <h2 
                            className="text-xl font-bold text-white mt-2 mb-3"
                            data-tina-field={tinaField(post, 'title')}
                          >
                            {post.title}
                          </h2>
                        )}
                        {post.excerpt && (
                          <p 
                            className="text-slate-300 text-sm leading-relaxed mb-4"
                            data-tina-field={tinaField(post, 'excerpt')}
                          >
                            {post.excerpt}
                          </p>
                        )}
                        {post.date && (
                          <time 
                            className="text-xs text-slate-400"
                            data-tina-field={tinaField(post, 'date')}
                          >
                            {new Date(post.date).toLocaleDateString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-full text-center text-slate-400">
                    {page.description || 'Brak artykułów do wyświetlenia'}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Simple page */}
          {isSimplePage && (
            <div className="max-w-4xl mx-auto px-6 py-16">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                <span className="text-gradient">{page.title}</span>
              </h1>
              {page.description && (
                <p className="text-xl text-slate-300 leading-relaxed mb-8">
                  {page.description}
                </p>
              )}
              {page.body && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <TinaMarkdown content={page.body} />
                </div>
              )}
            </div>
          )}
          
          {/* Portfolio listing page */}
          {isPortfolioPage && (
            <div className="max-w-7xl mx-auto px-6 py-16">
              <header className="mb-14 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="text-gradient">{page.title}</span>
                </h1>
                {page.description && (
                  <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    {page.description}
                  </p>
                )}
              </header>
              
              {/* Portfolio Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {((page as Record<string, unknown>).projects as Array<{
                  title?: string;
                  description?: string;
                  image?: string;
                  imageAlt?: string;
                  tags?: string[];
                  year?: string;
                  link?: string;
                }>)?.map((project, index) => (
                  <article 
                    key={index}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
                    data-tina-field={tinaField(page, `projects.${index}`)}
                  >
                    {project.image && (
                      <div className="relative w-full aspect-video overflow-hidden bg-slate-900">
                        <Image
                          src={project.image}
                          alt={project.imageAlt || project.title || 'Project'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          data-tina-field={tinaField(page, `projects.${index}.image`)}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {project.year && (
                        <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider" data-tina-field={tinaField(page, `projects.${index}.year`)}>
                          {project.year}
                        </span>
                      )}
                      {project.title && (
                        <h2 className="text-xl font-bold text-white mt-2 mb-3" data-tina-field={tinaField(page, `projects.${index}.title`)}>
                          {project.title}
                        </h2>
                      )}
                      {project.description && (
                        <p className="text-slate-300 text-sm leading-relaxed mb-4" data-tina-field={tinaField(page, `projects.${index}.description`)}>
                          {project.description}
                        </p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          data-tina-field={tinaField(page, `projects.${index}.link`)}
                        >
                          Zobacz projekt →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
          
          {/* Legal page */}
          {isLegalPage && <LegalPage data={page} />}
          
          {/* Home page */}
          {isHomePage && (
            <div className="bg-grid-pattern">
              {page.hero && <Hero data={page.hero} />}
            </div>
          )}
        </main>
      </div>
    </CursorLightProvider>
  );
}
