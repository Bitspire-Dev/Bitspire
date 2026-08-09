'use client';

import { tinaField } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';

type Page = NonNullable<PageQuery['page']>;

interface ContactHeroProps {
  page: Page;
}

export function ContactHero({ page }: ContactHeroProps) {
  return (
    <div className="mb-12 max-w-2xl">
      <h1
        data-tina-field={tinaField(page, 'title')}
        className="font-heading text-3xl font-bold text-foreground md:text-5xl"
      >
        {page.title}
      </h1>
      {page.description ? (
        <p
          data-tina-field={tinaField(page, 'description')}
          className="mt-4 font-sans text-base text-muted-foreground"
        >
          {page.description}
        </p>
      ) : null}
    </div>
  );
}
