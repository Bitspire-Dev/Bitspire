'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'motion/react';
import { ChevronDownIcon } from 'lucide-react';

import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/string';
import { Badge } from '@/components/ui/primitives/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/primitives/accordion';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/ui/composites/stagger';

interface ServicesProps {
  page: PagePartsFragment;
}

export interface Service {
  title: string;
  tagline: string;
  description: string;
}

export function Services({ page }: ServicesProps) {
  const services = page.services;
  const [openValue, setOpenValue] = useState<string>('');
  const locale = useLocale();

  if (!services?.items?.length) {
    return null;
  }

  const items = services.items.filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <section className="relative w-full bg-background">
      <div className="container mx-auto max-w-360 px-6 py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <FadeIn
            className="relative h-80 min-h-0 w-full lg:col-start-1 lg:row-start-2 lg:h-full"
            delay={0.2}
          >
            <Image
              src="/layout/gryf.png"
              alt={locale === 'pl' ? 'Gryf' : 'Griffin'}
              fill
              className="object-contain p-2"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </FadeIn>

          <motion.h2
            data-tina-field={tinaField(services, 'title')}
            className="max-w-4xl font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:col-span-2 lg:col-start-1 lg:row-start-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {services.title ?? 'Services'}
          </motion.h2>

          <Accordion
            type="single"
            collapsible
            value={openValue}
            onValueChange={setOpenValue}
            className="w-full overflow-hidden rounded-md border lg:col-start-2 lg:row-start-2"
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
                    className={cn(
                      'w-full border-b border-border',
                      index === items.length - 1 && 'border-b-0'
                    )}
                  >
                    <AccordionItem value={value} className="data-open:bg-muted/50">
                      <AccordionTrigger
                        className={cn(
                          "**:data-[slot='accordion-trigger-icon']:hidden",
                          'py-4 text-left md:py-6'
                        )}
                      >
                        <span className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-4">
                          <span
                            data-tina-field={tinaField(item, 'title')}
                            className="font-heading text-lg font-medium text-foreground md:text-xl"
                          >
                            {item.title}
                          </span>
                          <Badge
                            data-tina-field={tinaField(item, 'tagline')}
                            variant="outline"
                            className="border-brand/30 text-brand md:text-base"
                          >
                            {item.tagline}
                          </Badge>
                        </span>

                        <motion.span
                          className="ml-auto shrink-0 text-muted-foreground"
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <ChevronDownIcon className="size-4" />
                        </motion.span>
                      </AccordionTrigger>

                      <AccordionContent className="pb-6 text-sm leading-relaxed md:text-base">
                        <div data-tina-field={tinaField(item, 'description')}>
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
