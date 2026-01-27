import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { RichText } from "@tina/richTextPresets";
import { Hero } from "@/components/sections/home-page/Hero";
import Technology from "@/components/sections/home-page/Technology";
import About from "@/components/sections/home-page/About";

interface HomePageData {
    locale?: string;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    [key: string]: unknown;
}

interface HomePageWrapperProps {
    data?: HomePageData;
}

export default function HomePageWrapper({ data }: HomePageWrapperProps) {
    const locale = data?.locale || 'pl';
    
    if (!data) {
        return null;
    }

    const bodyContent = data?._body ?? data?.body ?? null;

        const components = {
            HeroSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <Hero data={props as Record<string, unknown>} locale={locale} />
                </div>
            ),
            TechnologySection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <Technology data={props as Record<string, unknown>} />
                </div>
            ),
            AboutSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <About data={props as Record<string, unknown>} />
                </div>
            ),
        };

    return (
        <>
            <div data-tina-field={data ? tinaField(data, 'body') : undefined}>
                <RichText
                    content={bodyContent ?? []}
                    preset="body"
                    components={components}
                />
            </div>
        </>
    );
}
