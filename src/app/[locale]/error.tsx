'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { getErrorUi } from '@/lib/ui';
import { Button } from '@/components/ui/primitives/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const locale = useLocale();
  const ui = getErrorUi(locale);

  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-1 flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-semibold text-foreground">{ui.title}</h2>
        <p className="max-w-md font-sans text-sm text-muted-foreground">{ui.description}</p>
      </div>
      <Button onClick={() => reset()} type="button">
        {ui.cta}
      </Button>
    </div>
  );
}
