'use client';

import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';

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
  return <MarkdownBody content={body} tinaField={tinaFieldBody} className={className} />;
}
