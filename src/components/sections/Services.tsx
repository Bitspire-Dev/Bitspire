'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDownIcon } from 'lucide-react';

import type { PagePartsFragment } from '@tina/__generated__/types';
import { cn } from '@/lib/utils';
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function Services({ page }: ServicesProps) {
  const services = page.services;
  const [openValue, setOpenValue] = useState<string>('');

  if (!services?.items?.length) {
    return null;
  }

  const items: Service[] = services.items.flatMap(item =>
    item ? [{ title: item.title, tagline: item.tagline, description: item.description }] : []
  );

  return (
    <section className="relative w-full bg-background">
      <div className="container mx-auto flex max-w-360 flex-col px-6 py-24">
        <motion.h2
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
                      <span className="font-heading text-lg font-medium text-foreground md:text-xl">
                        {item.title}
                      </span>
                      <span className="font-sans text-sm font-medium text-brand md:text-base">
                        {item.tagline}
                      </span>
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
                    {item.description}
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
