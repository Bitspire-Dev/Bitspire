import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import React from 'react';
import Image from 'next/image';
import { safeImageSrc } from '../src/lib/ui/helpers';
import type { ReactElement } from 'react';
import { Highlight, themes, type RenderProps } from 'prism-react-renderer';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';

void Prism;

// Gradient component for rich-text
export const Gradient = (props: { children?: React.ReactNode; text?: unknown; data?: { text?: unknown } }) => {
  const directText = typeof props.text === 'string' ? props.text : undefined;
  const nestedText = typeof props.data?.text === 'string' ? props.data?.text : undefined;
  const content = (directText ?? nestedText) || props.children;

  return (
    <span
      className="animate-gradient-x"
      style={{
        backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #3b82f6 100%)',
        backgroundSize: '200% 200%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {content}
    </span>
  );
};

// Common rich-text components
type RichTextProps = { children?: React.ReactNode } & Record<string, unknown>;

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

const normalizeLanguage = (raw?: string) => {
  if (!raw) return 'text';
  return raw.replace(/^language-/, '').toLowerCase();
};

const extractText = (value: React.ReactNode): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(extractText).join('');
  if (React.isValidElement(value)) {
    const props = value.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return '';
};

const renderCodeBlock = (code: string, language?: string) => {
  const lang = normalizeLanguage(language);

  if (lang === 'mermaid') {
    return (
      <div className="my-8 rounded-2xl border border-slate-600/70 bg-slate-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/60 bg-slate-900/80">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs uppercase tracking-wider text-slate-300">mermaid</span>
        </div>
        <div className="p-4">
          <code className="mermaid block text-slate-200 text-sm leading-relaxed">{code}</code>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-slate-600/70 bg-slate-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-700/60 bg-slate-900/80">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs uppercase tracking-wider text-slate-300">{lang}</span>
      </div>
      <Highlight code={code} language={lang} theme={themes.vsDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }: RenderProps) => (
          <pre className={`${className} px-4 py-4 text-sm overflow-x-auto font-mono`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export const richTextComponents = {
  Gradient,
  h1: ({ children }: RichTextProps) => (
    <h1 className="text-3xl md:text-5xl font-bold text-white mt-10 mb-6 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: RichTextProps) => (
    <h2 className="text-2xl md:text-4xl font-bold text-white mt-10 md:mt-14 mb-5 md:mb-7 pb-3 border-b border-slate-700/40">
      {children}
    </h2>
  ),
  h3: ({ children }: RichTextProps) => (
    <h3 className="text-xl md:text-2xl font-semibold text-slate-100 mt-8 md:mt-10 mb-4">
      {children}
    </h3>
  ),
  h4: ({ children }: RichTextProps) => (
    <h4 className="text-lg md:text-xl font-semibold text-slate-200 mt-6 md:mt-8 mb-3">
      {children}
    </h4>
  ),
  h5: ({ children }: RichTextProps) => (
    <h5 className="text-base md:text-lg font-semibold text-slate-200 mt-5 mb-3">
      {children}
    </h5>
  ),
  h6: ({ children }: RichTextProps) => (
    <h6 className="text-sm md:text-base font-semibold uppercase tracking-wide text-slate-300 mt-4 mb-2">
      {children}
    </h6>
  ),
  p: ({ children }: RichTextProps) => (
    <p className="text-base md:text-lg leading-relaxed text-slate-300 mb-5">
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
    <ul className="list-disc list-outside pl-6 my-5 space-y-2 text-slate-300">
      {children}
    </ul>
  ),
  ol: ({ children }: RichTextProps) => (
    <ol className="list-decimal list-outside pl-6 my-5 space-y-2 text-slate-300">
      {children}
    </ol>
  ),
  li: ({ children }: RichTextProps) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  blockquote: ({ children }: RichTextProps) => (
    <blockquote className="border-l-4 border-blue-500 bg-slate-800/50 rounded-r-xl px-6 py-4 my-6 text-slate-300">
      {children}
    </blockquote>
  ),
  code: ({ children, className }: RichTextProps) => {
    const classValue = typeof className === 'string' ? className : '';
    const content = extractText(children);
    const isBlock = classValue.includes('language-') || classValue.includes('mermaid') || content.includes('\n');

    if (isBlock) {
      return renderCodeBlock(content, classValue);
    }

    return (
      <code className="text-blue-300 bg-slate-800/70 px-2 py-1 rounded-md text-[0.85em]">
        {children}
      </code>
    );
  },
  pre: ({ children }: RichTextProps) => {
    if (React.isValidElement(children)) {
      const childProps = children.props as { className?: string; children?: React.ReactNode };
      const classValue = typeof childProps.className === 'string' ? childProps.className : '';
      const content = extractText(childProps.children);
      return renderCodeBlock(content, classValue);
    }

    const fallback = extractText(children);
    return renderCodeBlock(fallback, 'text');
  },
  code_block: ({ children, value, language, lang }: RichTextProps) => {
    const blockLanguage =
      (typeof language === 'string' && language) ||
      (typeof lang === 'string' && lang) ||
      undefined;
    const content = typeof value === 'string' ? value : extractText(children);
    return renderCodeBlock(content, blockLanguage);
  },
  img: ({ src, alt }: RichTextProps) => {
    const resolvedSrc = typeof src === 'string' ? safeImageSrc(src) : undefined;
    if (!resolvedSrc) return null;

    const isLocalAvif = resolvedSrc.startsWith('/') && resolvedSrc.toLowerCase().endsWith('.avif');

    return (
      <span className="block my-8">
        <Image
          src={resolvedSrc}
          alt={typeof alt === 'string' ? alt : ''}
          width={1200}
          height={800}
          sizes="100vw"
          className="rounded-2xl shadow-2xl w-full h-auto"
          unoptimized={isLocalAvif}
        />
      </span>
    );
  },
  hr: () => <hr className="my-10 border-slate-700/40" />,
  table: ({ children }: RichTextProps) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: RichTextProps) => (
    <thead className="bg-slate-800/70">
      {children}
    </thead>
  ),
  tbody: ({ children }: RichTextProps) => (
    <tbody>{children}</tbody>
  ),
  tr: ({ children }: RichTextProps) => (
    <tr className="border-b border-slate-700/40">
      {children}
    </tr>
  ),
  th: ({ children }: RichTextProps) => (
    <th className="bg-slate-800/70 text-slate-100 font-semibold border border-slate-700/50 px-4 py-3">
      {children}
    </th>
  ),
  td: ({ children }: RichTextProps) => (
    <td className="border border-slate-700/30 px-4 py-3 text-slate-300">
      {children}
    </td>
  ),
  CodeBlock: ({ language, code }: RichTextProps) => {
    const lang = typeof language === 'string' ? language : 'text';
    const content = typeof code === 'string' ? code : '';
    return renderCodeBlock(content, lang);
  },
  figure: ({ children }: RichTextProps) => (
    <figure className="my-8">
      {children}
    </figure>
  ),
  figcaption: ({ children }: RichTextProps) => (
    <figcaption className="mt-3 text-sm text-slate-400 text-center">
      {children}
    </figcaption>
  ),
  strong: ({ children }: RichTextProps) => (
    <strong className="font-semibold text-white">
      {children}
    </strong>
  ),
  em: ({ children }: RichTextProps) => (
    <em className="text-slate-200 italic">
      {children}
    </em>
  ),
  mark: ({ children }: RichTextProps) => (
    <mark className="bg-blue-500/20 text-slate-100 px-1.5 py-0.5 rounded">
      {children}
    </mark>
  ),
  abbr: ({ children, title }: RichTextProps) => (
    <abbr title={typeof title === 'string' ? title : undefined} className="underline decoration-dotted text-slate-200">
      {children}
    </abbr>
  ),
  ins: ({ children }: RichTextProps) => (
    <ins className="text-emerald-300 no-underline border-b border-emerald-400/60">
      {children}
    </ins>
  ),
  del: ({ children }: RichTextProps) => (
    <del className="text-rose-300">
      {children}
    </del>
  ),
  sup: ({ children }: RichTextProps) => (
    <sup className="text-xs align-super text-slate-300">
      {children}
    </sup>
  ),
  sub: ({ children }: RichTextProps) => (
    <sub className="text-xs align-sub text-slate-300">
      {children}
    </sub>
  ),
  kbd: ({ children }: RichTextProps) => (
    <kbd className="px-2 py-1 rounded-md bg-slate-800/70 border border-slate-700/50 text-xs text-slate-200">
      {children}
    </kbd>
  ),
  details: ({ children }: RichTextProps) => (
    <details className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 my-6">
      {children}
    </details>
  ),
  summary: ({ children }: RichTextProps) => (
    <summary className="cursor-pointer text-slate-200 font-semibold">
      {children}
    </summary>
  ),
  iframe: ({ src, title }: RichTextProps) => (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-2xl border border-slate-700/50">
      <iframe
        src={typeof src === 'string' ? src : undefined}
        title={typeof title === 'string' ? title : undefined}
        className="h-full w-full"
        loading="lazy"
        allowFullScreen
      />
    </div>
  ),
  video: ({ children, src }: RichTextProps) => (
    <video
      src={typeof src === 'string' ? src : undefined}
      controls
      className="my-8 w-full rounded-2xl border border-slate-700/50 shadow-2xl"
    >
      {children}
    </video>
  ),
  audio: ({ children, src }: RichTextProps) => (
    <audio
      src={typeof src === 'string' ? src : undefined}
      controls
      className="my-6 w-full"
    >
      {children}
    </audio>
  ),
};

// Style presets for different content types
interface RichTextPresetProps {
  content: TinaMarkdownContent | TinaMarkdownContent[];
  preset?: 'hero-title' | 'section-title' | 'subtitle' | 'description' | 'body';
  className?: string;
  components?: Record<string, (props: object) => ReactElement>;
}

const richTextWrapperClass = 'richtext-body';

const litePresetStyles = {
  'hero-title': 'text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-lg',
  'section-title': 'text-3xl md:text-5xl font-bold text-white mb-4 text-center leading-tight',
  'subtitle': 'text-lg lg:text-xl text-brand-text-muted-2 leading-relaxed',
  'description': 'text-lg text-brand-text-muted text-center leading-relaxed',
  'body': 'text-white',
};

const presetStyles = {
  'hero-title': 'text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-lg',
  'section-title': 'text-3xl md:text-5xl font-bold text-white mb-4 text-center leading-tight',
  'subtitle': 'text-lg lg:text-xl text-slate-400 leading-relaxed',
  'description': 'text-lg text-slate-300 text-center leading-relaxed',
  'body': 'text-white',
};

interface RichTextLiteProps {
  content: TinaMarkdownContent | TinaMarkdownContent[];
  preset?: 'hero-title' | 'section-title' | 'subtitle' | 'description' | 'body';
  className?: string;
  components?: Partial<typeof simpleComponents>;
}

export const RichTextLite: React.FC<RichTextLiteProps> = ({
  content,
  preset = 'body',
  className = '',
  components,
}) => {
  if (!content) return null;

  const combinedClassName = [richTextWrapperClass, litePresetStyles[preset], className]
    .filter(Boolean)
    .join(' ');

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

export const RichText: React.FC<RichTextPresetProps> = ({ 
  content, 
  preset = 'body',
  className = '',
  components,
}) => {
  const baseClassName = presetStyles[preset];
  const combinedClassName = [richTextWrapperClass, baseClassName, className].filter(Boolean).join(' ');

  // Handle undefined or null content
  if (!content) {
    return null;
  }

  return (
    <div className={combinedClassName}>
      <TinaMarkdown
        content={content}
        components={{
          ...richTextComponents,
          ...(components || {}),
        } as Record<string, (props: object) => ReactElement>}
      />
    </div>
  );
};
