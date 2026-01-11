import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import Technology from "@/components/sections/Technology";
import HowWeWork from "@/components/sections/HowWeWork";
import Brief from "@/components/sections/Brief";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import PortfolioHighlights from "@/components/sections/portfolio/PortfolioHighlights";

interface HomePageData {
    [key: string]: unknown;
    locale?: string;
    hero?: {
        title?: Record<string, unknown>;
        subtitle?: Record<string, unknown>;
        image?: string;
    };
    offer?: {
        title?: string;
        titleAccent?: string;
        subtitle?: string;
        sectionLabel?: string;
        services?: Array<{
            title?: string;
            description?: string;
            icon?: string;
            features?: string[];
            link?: string;
            buttonText?: string;
        }>;
    };
    technology?: {
        title?: string;
        description?: string;
    };
    howWeWork?: {
        title?: string;
        description?: string;
        steps?: Array<{
            number?: string;
            title?: string;
            description?: string;
            icon?: string;
        }>;
    };
    portfolioHighlights?: {
        title?: string;
        description?: string;
        projects?: Array<{
            title?: string;
            description?: string;
            image?: string;
            tags?: string[];
            featured?: boolean;
            slug?: string;
        }>;
    };
    brief?: {
        title?: string;
        description?: string;
        buttonText?: string;
        contact?: {
            email?: string;
            phone?: string;
            address?: string;
            addressLine2?: string;
            city?: string;
        };
    };
    faq?: {
        title?: string;
        description?: string;
        items?: Array<{
            question?: string;
            answer?: string;
        }>;
    };
    contact?: {
        title?: string;
        description?: string;
        email?: string;
        phone?: string;
        address?: string;
    };
}

interface HomePageWrapperProps {
    data?: HomePageData;
}

export default function HomePageWrapper({ data }: HomePageWrapperProps) {
    const locale = data?.locale || 'pl';
    
    // Fallback jeśli data jest undefined
    if (!data) {
        return null;
    }

    return (
        <>
            <Hero data={data?.hero} locale={locale} />
            <Offer data={data?.offer} />
            <Technology data={data?.technology} />
            <HowWeWork data={data?.howWeWork} locale={locale} />
            <PortfolioHighlights data={data?.portfolioHighlights} />
            <Brief data={data?.brief} />
            <FAQ data={data?.faq} locale={locale} />
            <Contact data={data?.contact} />
        </>
    );
}
