'use client';

import { tinaField } from 'tinacms/dist/react';
import Image from 'next/image';
import type { ProjectQuery } from '@tina/__generated__/types';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Badge } from '@/components/ui/primitives/badge';
import { Button } from '@/components/ui/primitives/button';
import { Separator } from '@/components/ui/primitives/separator';
import { BackLink } from '@/components/ui/composites/back-link';
import { ExternalLinkIcon } from 'lucide-react';

interface PortfolioProjectHeaderProps {
  project: NonNullable<ProjectQuery['project']>;
  backLabel: string;
  backHref: string;
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
  const screenshot = project.screenshot ?? null;
  const technologies = (project.technologies ?? []).filter((tech): tech is string => !!tech);

  return (
    <div className="mt-4 w-full">
      {screenshot ? (
        <AspectRatio
          data-tina-field={tinaField(project, 'screenshot')}
          ratio={16 / 9}
          className="w-full bg-muted"
        >
          <Image
            src={screenshot}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </AspectRatio>
      ) : null}

      <div className="w-full pt-8 md:pt-12">
        <BackLink href={backHref as any} label={backLabel} locale={locale} className="mb-6" />

        <header>
          <h1
            data-tina-field={tinaField(project, 'title')}
            className="font-heading text-3xl font-bold text-foreground md:text-5xl"
          >
            {project.title}
          </h1>

          {project.tagline ? (
            <p
              data-tina-field={tinaField(project, 'tagline')}
              className="mt-4 max-w-2xl font-sans text-xl text-foreground"
            >
              {project.tagline}
            </p>
          ) : null}

          {project.description ? (
            <p
              data-tina-field={tinaField(project, 'description')}
              className="mt-4 max-w-2xl font-sans text-lg text-muted-foreground"
            >
              {project.description}
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
              <Button
                asChild
                variant="outline"
                data-tina-field={tinaField(project, 'websiteUrl')}
              >
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLinkIcon className="size-4" />
                  {visitLabel}
                </a>
              </Button>
            </div>
          ) : null}
        </header>

        <Separator className="my-12" />
      </div>
    </div>
  );
}
