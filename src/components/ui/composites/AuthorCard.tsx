'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/primitives/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives/avatar';
import { Button } from '@/components/ui/primitives/button';
import { ArrowRight } from 'lucide-react';

export interface Author {
  name: string;
  role?: string | null;
  avatar?: string | null;
  bio?: string | null;
  link?: string | null;
}

interface AuthorCardProps {
  author?: Author | null;
  tinaField?: string;
  className?: string;
}

export function AuthorCard({ author, tinaField, className }: AuthorCardProps) {
  if (!author?.name) {
    return null;
  }

  const initials = author.name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card data-tina-field={tinaField} className={cn('gap-3', className)}>
      <CardContent className="flex items-start gap-3 pt-4">
        <Avatar size="lg" className="rounded-md">
          {author.avatar ? <AvatarImage src={author.avatar} alt={author.name} /> : null}
          <AvatarFallback className="rounded-md bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">{author.name}</CardTitle>
          {author.role ? (
            <CardDescription className="text-xs">{author.role}</CardDescription>
          ) : null}
        </div>
      </CardContent>
      {author.bio ? (
        <CardContent className="pt-0 text-sm text-muted-foreground">{author.bio}</CardContent>
      ) : null}
      {author.link ? (
        <CardContent className="pt-0">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto p-0 font-sans text-sm text-foreground hover:text-primary"
          >
            <a
              href={author.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              Poznaj ofertę
              <ArrowRight className="size-3" />
            </a>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
}
