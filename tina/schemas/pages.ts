import { Collection } from "tinacms";
import { heroSection, technologySection, offerSection, portfolioHighlightsSection, howWeWorkSection, faqSection, contactSection } from "./sections";

export const pagesCollection: Collection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  format: "mdx",
  match: {
    include: '**/*',
  },
  ui: {
    router: ({ document }) => {
      // Extract locale and slug from the path
      // document._sys.relativePath format: "pl/home.mdx" or "en/portfolio.mdx"
      const pathParts = document._sys.relativePath.split('/');
      if (pathParts.length >= 2) {
        const locale = pathParts[0]; // 'pl' or 'en'
        const slug = pathParts[1].replace('.mdx', '');
        
        // Always include slug in URL for consistency
        return `admin/${locale}/${slug}`;
      }
      return 'admin/pl/home';
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page Title",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Meta Description",
    },
    {
      type: "string",
      name: "lastUpdate",
      label: "Last Update Date",
      description: "For legal pages (YYYY-MM-DD)",
    },
    {
      type: "string",
      name: "tocTitle",
      label: "Table of Contents Title",
      description: "For legal pages sidebar",
    },
    {
      type: "string",
      name: "selectedProjects",
      label: "Selected Portfolio Projects",
      description: "Choose which portfolio projects to display (max 3 for highlights)",
      list: true,
      ui: {
        component: "list",
      },
    },
    // Home page sections
    heroSection,
    technologySection,
    offerSection,
    portfolioHighlightsSection,
    howWeWorkSection,
    faqSection,
    contactSection,
    // Portfolio and Blog page fields
    {
      type: "object",
      name: "portfolio",
      label: "Portfolio Page Settings",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Portfolio Title",
        },
        {
          type: "string",
          name: "description",
          label: "Portfolio Description",
        },
        {
          type: "string",
          name: "sectionLabel",
          label: "Section Label",
        },
      ],
    },
    {
      type: "object",
      name: "blog",
      label: "Blog Page Settings",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Blog Title",
        },
        {
          type: "string",
          name: "description",
          label: "Blog Description",
        },
        {
          type: "string",
          name: "sectionLabel",
          label: "Section Label",
        },
        {
          type: "string",
          name: "shareTitle",
          label: "Share Title",
        },
        {
          type: "object",
          name: "shareButtons",
          label: "Share Button Labels",
          fields: [
            { type: "string", name: "twitter", label: "Twitter Label" },
            { type: "string", name: "linkedin", label: "LinkedIn Label" },
            { type: "string", name: "facebook", label: "Facebook Label" },
            { type: "string", name: "copyLink", label: "Copy Link Label" },
          ],
        },
        {
          type: "string",
          name: "tableOfContentsTitle",
          label: "Table of Contents Title",
        },
        {
          type: "object",
          name: "authorBox",
          label: "Author Box",
          fields: [
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
            { type: "string", name: "contact", label: "Contact Button" },
          ],
        },
        {
          type: "string",
          name: "relatedArticlesTitle",
          label: "Related Articles Title",
        },
        {
          type: "string",
          name: "otherProjectsTitle",
          label: "Other Projects Title",
        },
      ],
    },
    // Search bar labels
    {
      type: "object",
      name: "searchBar",
      label: "Search & Filter Labels",
      fields: [
        {
          type: "object",
          name: "blog",
          label: "Blog Search",
          fields: [
            { type: "string", name: "searchPlaceholder", label: "Search Placeholder" },
            { type: "string", name: "clearSearch", label: "Clear Search" },
            { type: "string", name: "filterByTech", label: "Filter By Tags" },
            { type: "string", name: "clearFilters", label: "Clear Filters" },
            { type: "string", name: "showLess", label: "Show Less" },
            { type: "string", name: "showMore", label: "Show More" },
            { type: "string", name: "activeFilters", label: "Active Filters" },
            { type: "string", name: "removeFilter", label: "Remove Filter" },
          ],
        },
        {
          type: "object",
          name: "portfolio",
          label: "Portfolio Search",
          fields: [
            { type: "string", name: "searchPlaceholder", label: "Search Placeholder" },
            { type: "string", name: "clearSearch", label: "Clear Search" },
            { type: "string", name: "filterByTech", label: "Filter By Technology" },
            { type: "string", name: "clearFilters", label: "Clear Filters" },
            { type: "string", name: "showLess", label: "Show Less" },
            { type: "string", name: "showMore", label: "Show More" },
            { type: "string", name: "activeFilters", label: "Active Filters" },
            { type: "string", name: "removeFilter", label: "Remove Filter" },
          ],
        },
      ],
    },
    {
      type: "rich-text",
      name: "body",
      label: "Page Content",
      description: "For legal pages and other text-heavy pages",
      isBody: true,
    },
  ],
};
