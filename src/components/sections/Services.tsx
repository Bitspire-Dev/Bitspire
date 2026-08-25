'use client';

import { memo, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { m } from 'motion/react';
import { ChevronDownIcon } from 'lucide-react';

import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/string';
import { getServicesUi } from '@/lib/ui';
import { useThemeImage } from '@/hooks/use-theme-image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/primitives/accordion';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';

interface ServicesProps {
  page: PagePartsFragment;
}

function ServicesContent({ page }: ServicesProps) {
  const services = page.services;
  const [openValue, setOpenValue] = useState<string>('');
  const locale = useLocale();
  const ui = getServicesUi(locale);
  const gryfSrc = useThemeImage(
    '/layout/light-mode/gryf-oferta.png',
    '/layout/light-mode/gryf-oferta.png'
  );

  if (!services?.items?.length) {
    return null;
  }

  const items = services.items.filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <section className="relative w-full scroll-mt-20 bg-background">
      <div className="container mx-auto max-w-360 px-6 py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <FadeIn
            className="relative h-80 min-h-0 w-full lg:col-start-1 lg:row-start-2 lg:h-full"
            delay={0.2}
          >
            <Image
              src={gryfSrc}
              alt={locale === 'pl' ? 'Gryf' : 'Griffin'}
              fill
              className="object-contain p-2"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </FadeIn>

          <m.h2
            data-tina-field={tinaField(services, 'title')}
            className="max-w-4xl font-heading text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl lg:col-span-2 lg:col-start-1 lg:row-start-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {services.title ?? ui.titleFallback}
          </m.h2>

          <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="glass-card w-full overflow-hidden rounded-2xl border-none lg:col-start-2 lg:row-start-2"
          >
            {items.map((item, index) => {
              const value = slugify(item.title);
              const isOpen = openValue === value;

              return (
                <StaggerContainer key={value} stagger={0} delay={0} className="w-full">
                  <StaggerItem
                    x="100%"
                    y={0}
                    duration={0.5}
                    className="w-full"
                    style={
                      index !== items.length - 1
                        ? {
                            borderBottom: '1px solid transparent',
                            borderImage:
                              'linear-gradient(to right, transparent, var(--color-border), transparent) 1',
                          }
                        : undefined
                    }
                  >
                    <AccordionItem
                      value={value}
                      className="group/item border-none transition-all duration-300 data-open:bg-white/5 dark:data-open:bg-white/5"
                    >
                      <AccordionTrigger
                        className={cn(
                          "**:data-[slot='accordion-trigger-icon']:hidden",
                          'py-4 text-left md:py-6'
                        )}
                      >
                        <span className="flex flex-row items-center gap-4">
                          <span
                            className="font-heading text-sm font-medium text-muted-foreground tabular-nums md:text-base"
                            aria-hidden
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            data-tina-field={tinaField(item, 'title')}
                            className="font-heading text-lg font-medium text-foreground transition-transform duration-300 group-hover/item:translate-x-1 md:text-xl"
                          >
                            {item.title}
                          </span>
                        </span>

                        <m.span
                          className="ml-auto shrink-0 text-muted-foreground transition-colors duration-300 group-hover/item:text-brand"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDownIcon className="size-4" />
                        </m.span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-6 text-sm leading-7 md:text-base md:leading-7">
                        <div
                          data-tina-field={tinaField(item, 'description')}
                          className="text-pretty"
                          lang={locale}
                        >
                          {item.description}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </StaggerItem>
                </StaggerContainer>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export const Services = memo(ServicesContent);
