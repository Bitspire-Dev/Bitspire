'use client';

import type { ComponentProps } from 'react';
import { tinaField } from 'tinacms/dist/react';
import type { ProjectQuery } from '@tina/__generated__/types';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { ArticleHeader } from '@/components/ui/composites/ArticleHeader';
import { ExternalLink } from 'lucide-react';

type Href = ComponentProps<typeof Link>['href'];

interface PortfolioProjectHeaderProps {
  project: NonNullable<ProjectQuery['project']>;
  backLabel: string;
  backHref: Href;
  visitLabel: string;
  locale: string;
}

export function PortfolioProjectHeader({
  project,
  backLabel,
  backHref,
  visitLabel,
  locale,
}: PortfolioProjectHeaderProps) {
  const technologies = (project.technologies ?? []).filter((tech): tech is string => !!tech);

  return (
    <ArticleHeader
      cover={project.screenshot}
      coverAlt={project.title}
      tinaFieldCover={tinaField(project, 'screenshot')}
      backHref={backHref}
      backLabel={backLabel}
      locale={locale}
      title={project.title}
      tinaFieldTitle={tinaField(project, 'title')}
      description={project.description}
      tinaFieldDescription={tinaField(project, 'description')}
    >
      {project.tagline ? (
        <p
          data-tina-field={tinaField(project, 'tagline')}
          className="mt-4 max-w-2xl font-sans text-xl text-foreground"
        >
          {project.tagline}
        </p>
      ) : null}

      {technologies.length > 0 ? (
        <div
          data-tina-field={tinaField(project, 'technologies')}
          className="mt-6 flex flex-wrap gap-2"
        >
          {technologies.map(tech => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      ) : null}

      {project.websiteUrl ? (
        <div className="mt-6">
          <Button asChild variant="outline" data-tina-field={tinaField(project, 'websiteUrl')}>
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="size-4" />
              {visitLabel}
            </a>
          </Button>
        </div>
      ) : null}
    </ArticleHeader>
  );
}
