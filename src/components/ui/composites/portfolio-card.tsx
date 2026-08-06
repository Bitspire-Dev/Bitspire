'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ExternalLinkIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { Button } from '@/components/ui/primitives/button';
import { Badge } from '@/components/ui/primitives/badge';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Skeleton } from '@/components/ui/primitives/skeleton';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';

export type PortfolioProject = NonNullable<
  NonNullable<ProjectConnectionQuery['projectConnection']['edges']>[number]
>['node'];

interface PortfolioCardProps {
  project: NonNullable<PortfolioProject>;
  locale: string;
  readMoreLabel: string;
  visitLabel: string;
}

export function PortfolioCard({ project, locale, readMoreLabel, visitLabel }: PortfolioCardProps) {
  const segments = project._sys?.relativePath?.split('/');
  const canonicalCategory = segments?.[1];
  const slug = project._sys?.basename?.replace(/\.md$/, '');
  const articleHref = canonicalCategory && slug ? `/portfolio/${canonicalCategory}/${slug}` : '#';

  return (
    <Card className="flex flex-col overflow-hidden">
      <AspectRatio ratio={4 / 3} className="bg-muted">
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={project.title ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={project.screenshot.endsWith('.svg')}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Skeleton className="size-16 rounded-full" />
          </div>
        )}
      </AspectRatio>
      <CardHeader className="items-start gap-2">
        <CardTitle className="font-heading text-lg">{project.title}</CardTitle>
        <CardDescription className="font-sans text-sm text-muted-foreground">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {project.technologies && project.technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.technologies
              ?.filter((tech): tech is string => tech !== null)
              .map(tech => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default">
          <Link href={articleHref as '/portfolio/websites' | '/portfolio/software'} locale={locale}>
            {readMoreLabel}
          </Link>
        </Button>
        {project.websiteUrl ? (
          <Button asChild variant="outline">
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="mr-1 size-3" />
              {visitLabel}
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
