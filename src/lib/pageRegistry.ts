import HomePageWrapper from "@/components/pages/HomePageWrapper";
import BlogPageWrapper from "@/components/pages/BlogPageWrapper";
import PortfolioPageWrapper from "@/components/pages/PortfolioPageWrapper";
import ContactPageWrapper from "@/components/pages/ContactPageWrapper";
import LegalPageWrapper from "@/components/pages/LegalPageWrapper";
import type React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pageRegistry: Record<string, React.ComponentType<any>> = {
    // Main pages
    "home": HomePageWrapper,
    "blog": BlogPageWrapper,
    "portfolio": PortfolioPageWrapper,
    "brief": ContactPageWrapper,
    
    // Legal pages - Polish
    "polityka-prywatnosci": LegalPageWrapper,
    "polityka-cookies": LegalPageWrapper,
    "regulamin": LegalPageWrapper,
    
    // Legal pages - English
    "privacy-policy": LegalPageWrapper,
    "cookies-policy": LegalPageWrapper,
    "terms": LegalPageWrapper,
};

export const slugs = Object.keys(pageRegistry);

// Helper to get component for a slug
export function getPageComponent(slug: string): React.ComponentType<Record<string, unknown>> | undefined {
    return pageRegistry[slug];
}

// Helper to check if a slug exists
export function isValidSlug(slug: string): boolean {
    return slug in pageRegistry;
}
