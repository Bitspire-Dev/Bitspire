'use client';

import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/primitives/button';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { getCityUi } from '@/lib/config/ui';
import { getCityHref, getCityName } from '@/lib/cms/cities';

type Href = ComponentProps<typeof Link>['href'];

interface CityNearbyProps {
  nearbyCities: (string | null)[] | null | undefined;
  locale: string;
}

export function CityNearby({ nearbyCities, locale }: CityNearbyProps) {
  const ui = getCityUi(locale);
  const slugs = (nearbyCities ?? []).filter((s): s is string => Boolean(s));

  if (slugs.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {ui.nearbyTitle}
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {slugs.map(slug => (
              <li key={slug}>
                <Button asChild variant="outline" size="sm">
                  <Link href={getCityHref(slug) as Href}>{getCityName(slug)}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
