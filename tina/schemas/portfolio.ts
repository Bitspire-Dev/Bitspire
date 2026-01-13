import { Collection } from "tinacms";

export const portfolioCollection: Collection = {
  name: "portfolio",
  label: "Portfolio",
  path: "content/portfolio",
  format: "mdx",
  match: {
    include: '**/*',
  },
  ui: {
    router: ({ document }) => {
      // Extract locale and slug from the path
      // document._sys.relativePath format: "pl/skladamy.mdx" or "en/eduvantage.mdx"
      const pathParts = document._sys.relativePath.split('/');
      if (pathParts.length >= 2) {
        const locale = pathParts[0]; // 'pl' or 'en'
        const slug = pathParts[1].replace('.mdx', '');

        // Route Tina preview through SPA hash
        return `/admin/index.html#/~/admin/${locale}/portfolio/${slug}`;
      }
      return '/admin/index.html#/~/admin/pl/portfolio';
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Project Title",
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true,
    },
    {
      type: "string",
      name: "description",
      label: "Project Description",
      required: true,
      ui: {
        component: "textarea",
      },
    },
    {
      type: "datetime",
      name: "date",
      label: "Publication Date",
    },
    {
      type: "string",
      name: "excerpt",
      label: "Short Excerpt",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "category",
      label: "Category",
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
    },
    {
      type: "string",
      name: "year",
      label: "Year",
    },
    {
      type: "string",
      name: "client",
      label: "Client Name",
    },
    {
      type: "image",
      name: "image",
      label: "Project Image",
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text",
    },
    {
      type: "string",
      name: "link",
      label: "Project URL",
    },
    {
      type: "boolean",
      name: "featured",
      label: "Featured Project",
      description: "Show this project on homepage",
    },
    {
      type: "rich-text",
      name: "body",
      label: "Content",
      isBody: true,
    },
  ],
};
