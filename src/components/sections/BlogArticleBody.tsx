'use client';

import {
  TocProvider,
  Heading2,
  Heading3,
  Heading,
} from '@/components/ui/composites/table-of-contents';
import { MarkdownBody } from '@/components/ui/composites/MarkdownBody';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import type { TocItem } from '@/lib/toc';

interface BlogArticleBodyProps {
  body: React.ComponentProps<typeof MarkdownBody>['content'];
  tinaFieldBody: string;
  toc: TocItem[];
  className?: string;
}

export function BlogArticleBody({ body, tinaFieldBody, toc, className }: BlogArticleBodyProps) {
  return (
    <FadeIn>
      <TocProvider toc={toc}>
        <MarkdownBody
          content={body}
          tinaField={tinaFieldBody}
          components={{
            h1: Heading2,
            h2: Heading2,
            h3: Heading3,
            heading: Heading,
          }}
          className={className}
        />
      </TocProvider>
    </FadeIn>
  );
}
