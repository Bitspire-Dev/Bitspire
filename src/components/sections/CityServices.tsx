'use client';

import { tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';
import { getCityUi } from '@/lib/ui';

type City = NonNullable<CityQuery['city']>;

interface CityServicesProps {
  city: City;
  locale: string;
}

export function CityServices({ city, locale }: CityServicesProps) {
  const ui = getCityUi(locale);
  const services = (city.services ?? []).filter((s): s is NonNullable<typeof s> => Boolean(s));

  if (services.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <h2 className="max-w-4xl font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
            {ui.servicesTitle} {city.cityLocative ?? city.cityName}
          </h2>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <StaggerItem key={service.title}>
              <Card variant="glass" className="h-full">
                <CardHeader>
                  <CardTitle
                    as="h3"
                    data-tina-field={tinaField(service, 'title')}
                    className="font-heading text-lg"
                  >
                    {service.title}
                  </CardTitle>
                </CardHeader>
                {service.description ? (
                  <CardContent>
                    <p
                      data-tina-field={tinaField(service, 'description')}
                      className="font-sans text-sm leading-relaxed text-muted-foreground"
                    >
                      {service.description}
                    </p>
                  </CardContent>
                ) : null}
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
