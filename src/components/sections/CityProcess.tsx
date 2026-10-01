'use client';

import { tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';
import { getCityUi } from '@/lib/ui';

type City = NonNullable<CityQuery['city']>;

interface CityProcessProps {
  city: City;
  locale: string;
}

export function CityProcess({ city, locale }: CityProcessProps) {
  const ui = getCityUi(locale);
  const steps = (city.process ?? []).filter((s): s is NonNullable<typeof s> => Boolean(s));

  if (steps.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <h2 className="max-w-4xl font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
            {ui.processTitle}
          </h2>
        </FadeIn>

        <StaggerContainer className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StaggerItem key={step.title ?? index}>
              <div className="flex flex-col gap-3">
                <span
                  aria-hidden
                  className="font-heading text-4xl font-bold text-primary/40 tabular-nums"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3
                  data-tina-field={tinaField(step, 'title')}
                  className="font-heading text-lg font-semibold text-foreground"
                >
                  {step.title}
                </h3>
                {step.description ? (
                  <p
                    data-tina-field={tinaField(step, 'description')}
                    className="font-sans text-sm leading-relaxed text-muted-foreground"
                  >
                    {step.description}
                  </p>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
