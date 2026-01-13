import type { ReactNode } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { Hero } from "@/components/sections/home-page/Hero";
import { extractBody, hasBodyContent } from "@/lib/tina/body";

interface HomePageData {
    locale?: string;
    hero?: {
        title?: Record<string, unknown> | null;
        subtitle?: Record<string, unknown> | null;
        image?: string | null;
    } | null;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
}

interface HomePageWrapperProps {
    data?: HomePageData;
}

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";

const textFromChildren = (children: ReactNode): string => {
    if (typeof children === "string" || typeof children === "number") return String(children);
    if (Array.isArray(children)) return children.map(textFromChildren).join("");
    if (children && typeof children === "object" && "props" in children) {
        return textFromChildren((children as { props?: { children?: ReactNode } }).props?.children ?? null);
    }
    return "";
};

const mdxComponents = {
    h2: ({ children }: { children: ReactNode }) => {
        const id = slugify(textFromChildren(children));
        return (
            <h2 id={id} className="group text-2xl md:text-3xl font-semibold mt-6 mb-4 text-white flex items-center gap-2">
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
    h3: ({ children }: { children: ReactNode }) => {
        const id = slugify(textFromChildren(children));
        return <h3 id={id} className="text-xl md:text-2xl font-semibold mt-5 mb-3 text-white">{children}</h3>;
    },
    p: ({ children }: { children: ReactNode }) => (
        <p className="mb-4 text-slate-300 text-base md:text-lg leading-relaxed">{children}</p>
    ),
    ul: ({ children }: { children: ReactNode }) => (
        <ul className="list-disc list-inside space-y-2 mb-4 text-slate-300 text-base md:text-lg">{children}</ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
        <ol className="list-decimal list-inside space-y-2 mb-4 text-slate-300 text-base md:text-lg">{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
    ),
    strong: ({ children }: { children: ReactNode }) => (
        <strong className="font-semibold text-white">{children}</strong>
    ),
    a: ({ children, href }: { children: ReactNode; href?: string }) => (
        <a href={href} className="text-blue-400 hover:text-blue-300 underline">
            {children}
        </a>
    ),
};

export default function HomePageWrapper({ data }: HomePageWrapperProps) {
    const locale = data?.locale || 'pl';
    
    if (!data) {
        return null;
    }

    const hero = data.hero || undefined;

    const body = extractBody(data);
    const hasBody = hasBodyContent(body);

    return (
        <>
            <Hero data={hero} locale={locale} />

            {hasBody && (
                <section className="px-6 pb-16">
                    <div className="max-w-5xl mx-auto">
                        <article
                            className="bg-slate-800/40 border border-slate-700 rounded-2xl p-8 shadow-xl backdrop-blur-md leading-relaxed text-slate-200"
                            data-tina-field={tinaField(data, 'body')}
                        >
                            <TinaMarkdown content={body as TinaMarkdownContent} components={mdxComponents} />
                        </article>
                    </div>
                </section>
            )}
        </>
    );
}
