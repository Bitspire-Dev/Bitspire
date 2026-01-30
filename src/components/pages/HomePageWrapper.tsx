import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { RichText } from "@tina/richTextPresets";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/home-page/Hero";
import About from "@/components/sections/home-page/About";
import { Contact } from "@/components/sections/home-page/Contact";

const SectionPlaceholder = ({ minHeight }: { minHeight: string }) => (
    <div className="w-full" style={{ minHeight }} aria-hidden="true" />
);

const Technology = dynamic(() => import("@/components/sections/home-page/Technology"), {
    ssr: false,
    loading: () => <SectionPlaceholder minHeight="240px" />
});

const Features = dynamic(() => import("@/components/sections/home-page/Features"), {
    ssr: false,
    loading: () => <SectionPlaceholder minHeight="520px" />
});

const PortfolioHighlights = dynamic(() => import("@/components/sections/home-page/PortfolioHighlights"), {
    ssr: false,
    loading: () => <SectionPlaceholder minHeight="520px" />
});

const Statistics = dynamic(() => import("@/components/sections/home-page/Statistics").then((mod) => mod.Statistics), {
    ssr: false,
    loading: () => <SectionPlaceholder minHeight="420px" />
});

interface HomePageData {
    locale?: string;
    body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    _body?: TinaMarkdownContent | TinaMarkdownContent[] | null;
    [key: string]: unknown;
}

interface HomePageWrapperProps {
    data?: HomePageData;
    portfolioHighlightsProjects?: Array<Record<string, unknown>>;
}

export default function HomePageWrapper({ data, portfolioHighlightsProjects }: HomePageWrapperProps) {
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
            FeaturesSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <Features data={props as Record<string, unknown>} />
                </div>
            ),
            PortfolioHighlightsSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                                        <PortfolioHighlights
                                            data={props as Record<string, unknown>}
                                            projectsIndex={portfolioHighlightsProjects}
                                        />
                </div>
            ),
            StatisticsSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <Statistics data={props as Record<string, unknown>} />
                </div>
            ),
            ContactSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                   <Contact data={props as Record<string, unknown>} />
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
