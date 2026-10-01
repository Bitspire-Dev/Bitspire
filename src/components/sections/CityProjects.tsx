'use client';

import { tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import { CardGrid } from '@/components/ui/composites/card-grid';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { getCityUi } from '@/lib/config/ui';
import { getProjectHrefFromPath } from '@/lib/cms/portfolio';

type City = NonNullable<CityQuery['city']>;
type RelatedProject = NonNullable<NonNullable<City['relatedProjects']>[number]>['project'];

interface CityProjectsProps {
  city: City;
  locale: string;
}

export function CityProjects({ city, locale }: CityProjectsProps) {
  const ui = getCityUi(locale);

  const projects = (city.relatedProjects ?? [])
    .map(item => item?.project)
    .filter((p): p is NonNullable<RelatedProject> => Boolean(p));

  if (projects.length === 0) return null;

  const items: ContentCardItem[] = projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.tagline ?? project.description,
    image: project.screenshot,
    imageAlt: project.title,
    tags: project.technologies,
    meta: {
      primaryHref: getProjectHrefFromPath(locale, project._sys?.relativePath),
      websiteUrl: project.websiteUrl,
      ctaLabel: ui.readMore,
      tinaField_title: tinaField(project, 'title'),
      tinaField_description: tinaField(project, 'description'),
      tinaField_image: tinaField(project, 'screenshot'),
      tinaField_tags: tinaField(project, 'technologies'),
    },
  }));

  return (
    <section className="relative w-full">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <h2 className="max-w-4xl font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
            {ui.projectsTitle}
          </h2>
        </FadeIn>

        <div className="mt-10">
          <CardGrid items={items} emptyMessage={ui.projectsEmpty} imageRatio={16 / 9} />
        </div>
      </div>
    </section>
  );
}
