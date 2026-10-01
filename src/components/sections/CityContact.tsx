'use client';

import type { CityQuery } from '@tina/__generated__/types';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactDetails } from '@/components/sections/ContactDetails';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { getCityUi } from '@/lib/config/ui';

type City = NonNullable<CityQuery['city']>;

interface CityContactProps {
  city: City;
  locale: string;
}

export function CityContact({ city, locale }: CityContactProps) {
  const ui = getCityUi(locale);

  return (
    <section id="kontakt" className="relative w-full scroll-mt-20">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <div className="mb-10 max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
              {ui.contactTitle}
            </h2>
            <p className="mt-4 font-sans text-base text-muted-foreground">
              {ui.contactDescription}
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm locale={locale} defaultSubject={`${ui.subjectPrefix} — ${city.cityName}`} />
          <ContactDetails contact={null} locale={locale} />
        </div>
      </div>
    </section>
  );
}
