import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { Hero } from "@/components/sections/home-page/Hero";
import Technology from "@/components/sections/home-page/Technology";

interface HomePageData {
    locale?: string;
    hero?: {
        title?: Record<string, unknown> | null;
        subtitle?: Record<string, unknown> | null;
        image?: string | null;
    } | null;
    technology?: {
        title?: Record<string, unknown> | null;
        description?: Record<string, unknown> | null;
    } | null;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
}

interface HomePageWrapperProps {
    data?: HomePageData;
}

export default function HomePageWrapper({ data }: HomePageWrapperProps) {
    const locale = data?.locale || 'pl';
    
    if (!data) {
        return null;
    }

    const hero = data.hero
        ? {
            ...data.hero,
            title: data.hero.title ?? undefined,
            subtitle: data.hero.subtitle ?? undefined,
            image: data.hero.image ?? undefined,
        }
        : undefined;

    const technology = data.technology
        ? {
            ...data.technology,
            title: data.technology.title ?? undefined,
            description: data.technology.description ?? undefined,
        }
        : undefined;

    return (
        <>
            <Hero data={hero} locale={locale} />
            {technology ? <Technology data={technology} /> : null}
        </>
    );
}
