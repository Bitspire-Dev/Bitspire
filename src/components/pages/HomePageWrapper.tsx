import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { Hero } from "@/components/sections/home-page/Hero";

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

    return (
        <>
            <Hero data={hero} locale={locale} />
        </>
    );
}
