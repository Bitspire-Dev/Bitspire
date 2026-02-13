import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { RichText } from "@tina/richTextPresets";
import { Hero } from "@/components/sections/home-page/Hero";
import About from "@/components/sections/home-page/About";
import { Contact } from "@/components/sections/home-page/Contact";
import {
    TechnologySectionClient,
    FeaturesSectionClient,
    PortfolioHighlightsSectionClient,
    StatisticsSectionClient
} from "@/components/pages/HomePageSections.client";
import { DEFAULT_LOCALE } from "@/i18n/locales";

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
    const locale = data?.locale || DEFAULT_LOCALE;
    
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
                <TechnologySectionClient data={props as Record<string, unknown>} />
            ),
            AboutSection: (props: object) => (
                <div data-tina-field={tinaField(props as Record<string, unknown>)}>
                    <About data={props as Record<string, unknown>} />
                </div>
            ),
            FeaturesSection: (props: object) => (
                <FeaturesSectionClient data={props as Record<string, unknown>} />
            ),
            PortfolioHighlightsSection: (props: object) => (
                <PortfolioHighlightsSectionClient
                    data={props as Record<string, unknown>}
                    projectsIndex={portfolioHighlightsProjects}
                />
            ),
            StatisticsSection: (props: object) => (
                <StatisticsSectionClient data={props as Record<string, unknown>} />
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
