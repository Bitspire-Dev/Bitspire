import React from 'react';
import type { ReactElement } from 'react';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';

// Lightweight rich text renderer for client components (no Prism/code blocks)

type RichTextProps = { children?: React.ReactNode } & Record<string, unknown>;

const Gradient = ({ children }: { children: React.ReactNode }) => (
  <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#60a5fa,#22d3ee,#60a5fa)] bg-size-[200%] animate-[gradient-x_3s_ease_infinite]">
    {children}
  </span>
);

const simpleComponents = {
  Gradient,
  h1: ({ children }: RichTextProps) => (
    <h1 className="text-3xl md:text-5xl font-bold text-white mt-8 mb-6 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: RichTextProps) => (
    <h2 className="text-2xl md:text-4xl font-bold text-white mt-8 mb-5">
      {children}
    </h2>
  ),
  h3: ({ children }: RichTextProps) => (
    <h3 className="text-xl md:text-2xl font-semibold text-brand-fg mt-6 mb-4">
      {children}
    </h3>
  ),
  p: ({ children }: RichTextProps) => (
    <p className="text-base md:text-lg leading-relaxed text-brand-text-muted mb-5">
      {children}
    </p>
  ),
  a: ({ children, href }: RichTextProps) => {
    const link = typeof href === 'string' ? href : undefined;
    const isExternal = link?.startsWith('http');
    return (
      <a
        href={link}
        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }: RichTextProps) => (
    <ul className="list-disc list-outside pl-6 my-5 space-y-2 text-brand-text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }: RichTextProps) => (
    <ol className="list-decimal list-outside pl-6 my-5 space-y-2 text-brand-text-muted">
      {children}
    </ol>
  ),
  li: ({ children }: RichTextProps) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: RichTextProps) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }: RichTextProps) => (
    <em className="text-brand-text-soft italic">{children}</em>
  ),
};

interface RichTextLiteProps {
  content: TinaMarkdownContent | TinaMarkdownContent[];
  preset?: 'hero-title' | 'section-title' | 'subtitle' | 'description' | 'body';
  className?: string;
  components?: Partial<typeof simpleComponents>;
}

const presetStyles = {
  'hero-title': 'text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-lg',
  'section-title': 'text-3xl md:text-5xl font-bold text-white mb-4 text-center leading-tight',
  'subtitle': 'text-lg lg:text-xl text-brand-text-muted-2 leading-relaxed',
  'description': 'text-lg text-brand-text-muted text-center leading-relaxed',
  'body': 'text-white',
};

export const RichTextLite: React.FC<RichTextLiteProps> = ({
  content,
  preset = 'body',
  className = '',
  components,
}) => {
  if (!content) return null;

  const combinedClassName = ['richtext-body', presetStyles[preset], className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName}>
      <TinaMarkdown
        content={content}
        components={{
          ...simpleComponents,
          ...(components || {}),
        } as Record<string, (props: object) => ReactElement>}
      />
    </div>
  );
};
