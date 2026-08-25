'use client';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Masz podobny projekt?',
    description: 'Napisz do nas — pomożemy zrealizować Twoją wizję.',
    button: 'Skontaktuj się',
  },
  en: {
    title: 'Have a similar project?',
    description: 'Get in touch — we will help bring your idea to life.',
    button: 'Contact us',
  },
};

interface ContactCtaProps {
  locale: string;
  className?: string;
}

export function ContactCta({ locale, className }: ContactCtaProps) {
  const ui = UI[locale] ?? UI.pl;

  return (
    <FadeIn>
      <Card className={cn('mt-12 w-full', className)}>
        <CardHeader>
          <CardTitle as="h2" className="font-heading text-xl md:text-2xl">
            {ui.title}
          </CardTitle>
          <CardDescription className="font-sans text-base text-muted-foreground">
            {ui.description}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/contact" locale={locale}>
              {ui.button}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  );
}
