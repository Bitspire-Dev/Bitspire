'use client';

import { tinaField } from 'tinacms/dist/react';
import type { CityQuery } from '@tina/__generated__/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/primitives/accordion';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { getCityUi } from '@/lib/ui';

type City = NonNullable<CityQuery['city']>;

interface CityFaqProps {
  city: City;
  locale: string;
}

export function CityFaq({ city, locale }: CityFaqProps) {
  const ui = getCityUi(locale);
  const items = (city.faq ?? []).filter((i): i is NonNullable<typeof i> => Boolean(i));

  if (items.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="container mx-auto max-w-360 px-4 py-12 md:px-6 md:py-16">
        <FadeIn>
          <h2 className="max-w-4xl font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
            {ui.faqTitle}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Accordion
            type="single"
            collapsible
            className="glass-card mt-10 w-full overflow-hidden rounded-2xl border-none"
          >
            {items.map((item, index) => (
              <AccordionItem
                key={item.question ?? index}
                value={`faq-${index}`}
                className="border-b border-border/60 last:border-b-0"
              >
                <AccordionTrigger className="py-4 text-left sm:py-5">
                  <span
                    data-tina-field={tinaField(item, 'question')}
                    className="font-heading text-base font-medium text-foreground sm:text-lg"
                  >
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-7 md:text-base md:leading-7">
                  <div
                    data-tina-field={tinaField(item, 'answer')}
                    className="text-pretty text-muted-foreground"
                    lang={locale}
                  >
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
