import React from 'react';
import { tinaField } from 'tinacms/dist/react';
import type { TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { RichText } from '@tina/richTextPresets';
import { Card, CardContent } from '@/components/ui/primitives/Card';
import { toSlug } from '@/lib/ui/helpers';

interface Section {
  __typename?: string;
  id?: string | null;
  title?: string | null;
  content?: string | null;
}

interface LegalPageData {
  __typename?: string;
  title?: string | null;
  titleAccent?: string | null;
  lastUpdate?: string | null;
  sections?: (Section | null)[] | null;
  tocTitle?: string | null;
  body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
  [key: string]: unknown;
}

// --- Helpers ---------------------------------------------------------------

const slugify = (text: string) => toSlug(text) || 'section';

const extractTextFromNode = (node: unknown): string => {
  if (!node) return '';
  const typed = node as { text?: string; children?: unknown[] };
  if (typeof typed.text === 'string') return typed.text;
  if (Array.isArray(typed.children)) return typed.children.map(extractTextFromNode).join('');
  if (typeof node === 'string') return node;
  return '';
};

const collectHeadings = (nodes: unknown[] | undefined, acc: Array<{ id: string; text: string }>) => {
  if (!nodes) return;
  nodes.forEach((node) => {
    const typed = node as { type?: string; children?: unknown[] };
    if (typed?.type && /^h[1-6]$/.test(typed.type)) {
      const text = extractTextFromNode(typed);
      acc.push({ id: slugify(text), text });
    }
    if (typed?.children) collectHeadings(typed.children, acc);
  });
};

const extractHeadings = (body?: TinaMarkdownContent | TinaMarkdownContent[] | null) => {
  const acc: Array<{ id: string; text: string }> = [];
  if (Array.isArray(body)) collectHeadings(body as unknown[], acc);
  else if (body && typeof body === 'object') collectHeadings([body as unknown], acc);
  return acc;
};

const textFromChildren = (children: React.ReactNode): string => {
  const walk = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(walk).join('');
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      return walk(element.props.children);
    }
    return '';
  };
  return walk(children);
};

export default function LegalPage({ data, hideToc = false }: { data?: LegalPageData; hideToc?: boolean }) {
  const bodyContent = (data as { _body?: TinaMarkdownContent | TinaMarkdownContent[] | null | undefined })?._body
    ?? (data?.body as TinaMarkdownContent | TinaMarkdownContent[] | null | undefined)
    ?? null;
  const sections = (data?.sections || []).filter((s): s is Section => s !== null);
  const hasBody = Boolean(bodyContent);

  // Headings for TOC: prefer body, fallback to legacy sections
  const headings = (() => {
    if (hasBody) return extractHeadings(bodyContent);
    return sections
      .filter((s) => s?.id && s?.title)
      .map((s) => ({ id: s.id as string, text: s.title as string }));
  })();
  const hasHeadings = headings.length > 0;

  type RichTextProps = { children?: React.ReactNode } & Record<string, unknown>;

  const mdxComponents = {
    h2: ({ children }: RichTextProps) => {
      const id = slugify(textFromChildren(children));
      return (
        <h2 id={id} className="group text-xl md:text-2xl font-semibold mt-2 mb-4 text-white flex items-center gap-2">
          <span>{children}</span>
          <a
            href={`#${id}`}
            aria-label={`Bezpośredni link: ${textFromChildren(children)}`}
            className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition text-sm"
          >
            #
          </a>
        </h2>
      );
    },
    h3: ({ children }: RichTextProps) => {
      const id = slugify(textFromChildren(children));
      return <h3 id={id} className="text-lg md:text-xl font-semibold mt-4 mb-3 text-white">{children}</h3>;
    },
    p: ({ children }: RichTextProps) => (
      <p className="mb-4 text-slate-300 text-sm md:text-base leading-relaxed">{children}</p>
    ),
    ul: ({ children }: RichTextProps) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-slate-300 text-sm md:text-base">{children}</ul>
    ),
    ol: ({ children }: RichTextProps) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-300 text-sm md:text-base">{children}</ol>
    ),
    li: ({ children }: RichTextProps) => (
      <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }: RichTextProps) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    a: ({ children, href }: RichTextProps) => (
      <a
        href={typeof href === "string" ? href : undefined}
        className="text-blue-400 hover:text-blue-300 underline"
      >
        {children}
      </a>
    ),
  } as Record<string, (props: object) => React.ReactElement>;

  const shellClass = hideToc
    ? "max-w-5xl mx-auto"
    : "max-w-7xl mx-auto grid gap-10 md:grid-cols-[260px_minmax(0,1fr)]";

  return (
    <main className="relative px-4 pt-28 pb-24 min-h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-200">
      <div className={shellClass} suppressHydrationWarning>
        {/* Sidebar - Spis treści */}
        {!hideToc && (
          <aside className="md:sticky md:top-28 h-max hidden md:block">
            <nav
              suppressHydrationWarning
              aria-label={data?.tocTitle || ""}
              className="space-y-4 bg-slate-800/40 border border-slate-700 rounded-xl p-5 backdrop-blur-sm"
            >
              <h2 
                className="text-sm font-semibold tracking-wider uppercase text-slate-400"
                data-tina-field={tinaField(data, 'tocTitle')}
              >
                {data?.tocTitle}
              </h2>
              <ol className="space-y-2 text-sm">
                {hasHeadings ? (
                  headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="block text-slate-300 hover:text-white transition-colors leading-snug"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">—</li>
                )}
              </ol>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <div className="space-y-10">
          {/* Header */}
          <Card
            as="header"
            interactive={false}
            className="bg-slate-800/60 border-slate-700 shadow-lg backdrop-blur-md"
            data-tina-field={tinaField(data, 'title')}
          >
            <CardContent padding="lg">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              <span>{data?.title || 'Document'}</span>
              {data?.titleAccent && (
                <>
                  {' '}
                  <span 
                    className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                    data-tina-field={tinaField(data, 'titleAccent')}
                  >
                    {data.titleAccent}
                  </span>
                </>
              )}
            </h1>
            {data?.lastUpdate && (
              <p 
                className="mt-3 text-sm text-slate-400"
                data-tina-field={tinaField(data, 'lastUpdate')}
              >
                Data ostatniej aktualizacji: {data.lastUpdate}
              </p>
            )}
            </CardContent>
          </Card>

          {/* Content */}
          <Card
            as="article"
            interactive={false}
            className="bg-slate-800/40 border-slate-700 shadow-xl backdrop-blur-md leading-relaxed"
            data-tina-field={tinaField(data, 'body')}
          >
            <CardContent padding="lg">
            {hasBody ? (
              <RichText
                content={bodyContent as TinaMarkdownContent}
                preset="body"
                components={mdxComponents}
              />
            ) : sections.length > 0 ? (
              sections.map((section, idx) => (
                section?.id && section?.title && section?.content && (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 
                      className="group text-xl md:text-2xl font-semibold mt-2 mb-4 text-white flex items-center gap-2"
                      data-tina-field={tinaField(data, `sections.${idx}.title`)}
                    >
                      <span>{section.title}</span>
                      <a
                        href={`#${section.id}`}
                        aria-label={`Bezpośredni link: ${section.title}`}
                        className="opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition text-sm"
                      >
                        #
                      </a>
                    </h2>
                    <div 
                      className="text-slate-300 text-sm md:text-base space-y-4"
                      data-tina-field={tinaField(data, `sections.${idx}.content`)}
                    >
                      {/* Legacy plain-text rendering */}
                      {section.content}
                    </div>
                    <hr className="my-8 border-slate-700/60 last:hidden" />
                  </section>
                )
              ))
            ) : (
              <p className="text-slate-400">Brak sekcji do wyświetlenia.</p>
            )}
            <p className="mt-4 text-xs text-slate-500">
              Dokument informacyjny – nie stanowi porady prawnej.
            </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
