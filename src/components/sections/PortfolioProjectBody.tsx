'use client';

import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';
import { FadeIn } from '@/components/animations/primitives/fade-in';

interface PortfolioProjectBodyProps {
  body: React.ComponentProps<typeof MarkdownBody>['content'];
  tinaFieldBody: string;
  className?: string;
}

export function PortfolioProjectBody({
  body,
  tinaFieldBody,
  className,
}: PortfolioProjectBodyProps) {
  return (
    <FadeIn>
      <MarkdownBody content={body} tinaField={tinaFieldBody} className={className} />
    </FadeIn>
  );
}
