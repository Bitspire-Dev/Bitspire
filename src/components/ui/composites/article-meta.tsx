'use client';

import { Badge } from '@/components/ui/primitives/badge';
import { formatLongDate } from '@/lib/date';

interface ArticleMetaProps {
  date: string | null | undefined;
  tags: (string | null)[] | null | undefined;
  locale: string;
  tinaFieldDate?: string;
  tinaFieldTags?: string;
}

export function ArticleMeta({
  date,
  tags,
  locale,
  tinaFieldDate,
  tinaFieldTags,
}: ArticleMetaProps) {
  const formattedDate = formatLongDate(date ?? '', locale);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {formattedDate ? (
        <time
          data-tina-field={tinaFieldDate}
          className="font-sans text-sm text-muted-foreground"
          dateTime={date ?? undefined}
        >
          {formattedDate}
        </time>
      ) : null}
      {tags && tags.length > 0 ? (
        <div data-tina-field={tinaFieldTags} className="flex flex-wrap gap-2">
          {tags
            .filter((tag): tag is string => !!tag)
            .map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
        </div>
      ) : null}
    </div>
  );
}
