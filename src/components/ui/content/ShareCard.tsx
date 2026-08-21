'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardTitle } from '@/components/ui/primitives/card';
import { FadeIn } from '@/components/animations/fade-in';
import { Button } from '@/components/ui/primitives/button';
import { ExternalLink, Link2, Check } from 'lucide-react';

interface ShareCardProps {
  title: string;
  locale: string;
  className?: string;
}

const UI: Record<string, { share: string; copy: string; copied: string }> = {
  pl: { share: 'Udostępnij', copy: 'Kopiuj link', copied: 'Skopiowano!' },
  en: { share: 'Share', copy: 'Copy link', copied: 'Copied!' },
};

export function ShareCard({ title, locale, className }: ShareCardProps) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const ui = UI[locale] ?? UI.en;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareUrl = url || '#';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'X (Twitter)',
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: ExternalLink,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: ExternalLink,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: ExternalLink,
    },
  ];

  return (
    <FadeIn>
      <Card className={cn('gap-3', className)}>
        <CardContent className="flex flex-col gap-3 pt-4">
          <CardTitle className="text-sm">{ui.share}</CardTitle>
          <div className="flex flex-col gap-2">
            {links.map(link => (
              <Button
                key={link.label}
                asChild
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="size-4" />
                  <span className="font-sans text-sm">{link.label}</span>
                </a>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
              <span className="font-sans text-sm">{copied ? ui.copied : ui.copy}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
