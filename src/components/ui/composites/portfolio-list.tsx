'use client';

import { PortfolioCard } from './portfolio-card';
import type { PortfolioProject } from './portfolio-card';

type Project = NonNullable<PortfolioProject>;

interface PortfolioListProps {
  projects: Project[];
  locale: string;
  emptyMessage: string;
  readMoreLabel: string;
  visitLabel: string;
}

export function PortfolioList({
  projects,
  locale,
  emptyMessage,
  readMoreLabel,
  visitLabel,
}: PortfolioListProps) {
  if (projects.length === 0) {
    return <p className="font-sans text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <PortfolioCard
          key={project.id}
          project={project}
          locale={locale}
          readMoreLabel={readMoreLabel}
          visitLabel={visitLabel}
        />
      ))}
    </div>
  );
}
