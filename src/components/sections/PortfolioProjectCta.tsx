'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/primitives/card';

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

interface PortfolioProjectCtaProps {
  locale: string;
}

export function PortfolioProjectCta({ locale }: PortfolioProjectCtaProps) {
  const ui = UI[locale] ?? UI.pl;

  return (
    <Card className="mt-12 w-full">
      <CardHeader>
        <CardTitle className="font-heading text-xl md:text-2xl">
          {ui.title}
        </CardTitle>
        <CardDescription className="font-sans text-base text-muted-foreground">
          {ui.description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild>
          <Link href={"/contact" as any} locale={locale}>
            {ui.button}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
