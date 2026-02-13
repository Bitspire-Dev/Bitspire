import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { tinaField } from 'tinacms/dist/react';
import { buildAdminLink, type AdminLinkMode } from '@/lib/routing/adminLink';
import { RichText } from '@tina/richTextPresets';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { Badge } from '@/components/ui/primitives/Badge';
import { Button } from '@/components/ui/primitives/Button';
import { Card, CardContent, CardMedia } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { getTranslations } from '@/i18n/translations';
import { DEFAULT_LOCALE } from '@/i18n/locales';

interface PortfolioProject {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  tags?: Array<string | null> | null;
  featured?: boolean | null;
  slug?: string | null;
  [key: string]: unknown;
}

interface PortfolioHighlightsProps {
  data?: {
    projects?: PortfolioProject[] | null;
    title?: Record<string, unknown> | null;
    description?: Record<string, unknown> | null;
  };
  locale?: string;
  linkMode?: AdminLinkMode;
}

const FeaturedProjectsGrid: React.FC<PortfolioHighlightsProps> = ({ data, locale = DEFAULT_LOCALE, linkMode = 'production' }) => {
  const t = getTranslations(locale).portfolio;
  // Filter featured projects
  const featuredProjects = data?.projects?.filter(project => project?.featured) || [];

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-4 bg-slate-900/20 relative overflow-hidden" id="portfolio-highlights" data-tina-field={tinaField(data)}>
      {/* Background decoration */}
  <div className="absolute inset-0 bg-linear-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="w-16 h-0.5 bg-linear-to-r from-blue-600 to-cyan-500 mb-6 mx-auto"></div>
          <div data-tina-field={tinaField(data, 'title')}>
            <RichText content={data?.title as TinaMarkdownContent | TinaMarkdownContent[]} preset="section-title" />
          </div>
          <div data-tina-field={tinaField(data, 'description')}>
            <RichText content={data?.description as TinaMarkdownContent | TinaMarkdownContent[]} preset="subtitle" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => {
            // Convert title/description to string if they're rich-text objects
            const projectTitle = typeof project?.title === 'string'
              ? project.title
              : (project?.title as unknown as { children?: Array<{ text?: string }> })?.children?.[0]?.text || 'Project';
            const projectDescription = typeof project?.description === 'string'
              ? project.description
              : (project?.description as unknown as { children?: Array<{ text?: string }> })?.children?.[0]?.text || '';
            
            const projectHref = project?.slug
              ? buildAdminLink(`/portfolio/${project.slug}`, { locale, mode: linkMode })
              : '#';

            return (
            <Link
              key={index}
              href={projectHref}
              className="block"
              prefetch
            >
              <Card as="article" variant="blue" className="bg-slate-800/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
              {/* Project Image */}
              <CardMedia className="bg-slate-900">
                {project?.image ? (
                  <Image
                    src={project.image}
                    alt={projectTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Featured badge */}
                <Badge
                  variant="neutral"
                  shape="pill"
                  size="md"
                  className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white border-transparent text-xs font-bold px-3 py-1.5 gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {t.featured}
                </Badge>
              </CardMedia>

              {/* Project Content */}
              <CardContent>
                <Heading as="h3" size="md" className="text-xl mb-2 group-hover:text-blue-400 transition-colors">
                  {projectTitle}
                </Heading>
                
                <Text variant="muted" size="sm" className="mb-4 line-clamp-2">
                  {projectDescription}
                </Text>

                {/* Tags */}
                {project?.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      tag ? (
                        <Badge
                          key={tagIndex}
                          variant="blue"
                          shape="pill"
                          size="sm"
                          className="px-3 text-blue-400"
                        >
                          {tag}
                        </Badge>
                      ) : null
                    ))}
                  </div>
                )}

                {/* View project arrow */}
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                  {t.viewProject}
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>

        {/* View all projects button */}
        <div className="text-center mt-12">
          <Button asChild variant="primary" size="lg" className="btn-tech-primary px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider">
            <Link href={buildAdminLink("/portfolio", { locale, mode: linkMode })} prefetch>
              {t.viewAllProjects}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjectsGrid;
