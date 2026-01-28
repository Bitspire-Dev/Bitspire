import { Collection } from "tinacms";
import { gradientTemplate } from "../templates/text styles/gradient";
import { heroSectionTemplate, technologySectionTemplate, aboutSectionTemplate, featuresSectionTemplate, statisticsSectionTemplate, portfolioHighlightsSectionTemplate } from "@tina/templates/homeSections";

export const pagesCollection: Collection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  format: "mdx",
  match: {
    include: "**/*",
  },
  ui: {
    router: ({ document }) => {
      // Extract locale and slug from the path
      // document._sys.relativePath format: "pl/home.mdx" or "en/portfolio.mdx"
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0]; // 'pl' or 'en'
        const slug = pathParts[1].replace(".mdx", "");

        // Point Tina preview to the SPA entry with hash routing
        return `/admin/index.html#/~/admin/${locale}/${slug}`;
      }
      return "/admin/index.html#/~/admin/pl";
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
      type: "rich-text",
      name: "body",
      label: "Page Content",
      description: "For legal pages and other text-heavy pages",
      isBody: true,
      templates: [gradientTemplate, heroSectionTemplate, technologySectionTemplate, aboutSectionTemplate, featuresSectionTemplate, statisticsSectionTemplate, portfolioHighlightsSectionTemplate],
    },
  ],
};
