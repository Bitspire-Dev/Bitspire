'use client';

import { useState } from 'react';
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

  if (!services?.items?.length) {
    return null;
  }

  const items = services.items.filter((item): item is NonNullable<typeof item> => !!item);

  return (
    <section className="relative w-full bg-background">
      <div className="container mx-auto flex max-w-360 flex-col px-6 py-24">
        <motion.h2
          data-tina-field={tinaField(services, 'title')}
          className="max-w-4xl font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {services.title ?? 'Services'}
        </motion.h2>

        <Accordion
          type="single"
          collapsible
          value={openValue}
          onValueChange={setOpenValue}
          className="mt-12 flex w-full flex-col overflow-hidden rounded-md border"
        >
          {items.map((item, index) => {
            const value = slugify(item.title);
            const isOpen = openValue === value;

            return (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AccordionItem value={value}>
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
                    <div data-tina-field={tinaField(item, 'description')}>{item.description}</div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
