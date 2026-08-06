'use client';

import { useMemo, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import type { ProjectConnectionQuery } from '@tina/__generated__/types';
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
import { Input } from '@/components/ui/primitives/input';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Separator } from '@/components/ui/primitives/separator';
import { Skeleton } from '@/components/ui/primitives/skeleton';

type ProjectNode = NonNullable<
  NonNullable<ProjectConnectionQuery['projectConnection']['edges']>[number]
>['node'];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  'strony-internetowe': { pl: 'Strony internetowe', en: 'Websites' },
  oprogramowanie: { pl: 'Oprogramowanie', en: 'Software' },
  websites: { pl: 'Strony internetowe', en: 'Websites' },
  software: { pl: 'Oprogramowanie', en: 'Software' },
};

const CATEGORY_TO_CANONICAL: Record<string, string> = {
  'strony-internetowe': 'websites',
  oprogramowanie: 'software',
  websites: 'websites',
  software: 'software',
};

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Zobacz nasze realizacje',
    description: 'Przeglądaj nasze realizacje i znajdź coś dla siebie.',
    searchPlaceholder: 'Szukaj po tytule, opisie lub technologii...',
    empty: 'Brak realizacji.',
    readMore: 'Czytaj więcej',
    visit: 'Odwiedź',
  },
  en: {
    title: 'See our work',
    description: 'Browse our work and find something for you.',
    searchPlaceholder: 'Search by title, description or technology...',
    empty: 'No projects found.',
    readMore: 'Read more',
    visit: 'Visit',
  },
};

interface PortfolioCategoryPageProps {
  query: string;
  variables: Record<string, unknown>;
  data: ProjectConnectionQuery;
  category: string;
  locale: string;
}

export function PortfolioCategoryPage({
  query,
  variables,
  data,
  category,
  locale,
}: PortfolioCategoryPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const [search, setSearch] = useState('');
  const canonicalCategory = CATEGORY_TO_CANONICAL[category] ?? category;
  const ui = UI[locale] ?? UI.pl;

  const projects = useMemo(() => {
    const edges = tinaData?.projectConnection?.edges ?? [];
    return edges
      .filter((edge): edge is NonNullable<typeof edge> => !!edge && !!edge.node)
      .filter(edge => edge.node?._sys?.relativePath?.startsWith(`${locale}/${canonicalCategory}/`))
      .filter(edge => {
        const project = edge.node!;
        const term = search.toLowerCase();
        const title = (project.title ?? '').toLowerCase();
        const description = (project.description ?? '').toLowerCase();
        const technologies = (project.technologies ?? []).join(' ').toLowerCase();
        return (
          !term || title.includes(term) || description.includes(term) || technologies.includes(term)
        );
      })
      .map(edge => edge.node!)
      .filter(p => !!p);
  }, [tinaData, locale, canonicalCategory, search]);

  return (
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">
        {CATEGORY_LABELS[category]?.[locale] ?? category}
      </h1>
      <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">{ui.description}</p>

      <div className="mt-8 max-w-md">
        <Input
          type="search"
          placeholder={ui.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Separator className="my-12" />

      {projects.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">{ui.empty}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project, locale }: { project: NonNullable<ProjectNode>; locale: string }) {
  const ui = UI[locale] ?? UI.pl;
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
            {ui.readMore}
          </Link>
        </Button>
        {project.websiteUrl ? (
          <Button asChild variant="outline">
            <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="mr-1 size-3" />
              {ui.visit}
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
