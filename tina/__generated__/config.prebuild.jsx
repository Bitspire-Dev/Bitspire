// tina/config.ts
import { defineConfig } from "tinacms";

// tina/templates/text styles/gradient.ts
var gradientTemplate = {
  name: "Gradient",
  label: "Gradient Text",
  inline: true,
  ui: {
    defaultItem: {
      text: ""
    }
  },
  fields: [
    {
      type: "string",
      name: "text",
      label: "Text"
    }
  ]
};

// tina/schemas/portfolio.ts
var portfolioCollection = {
  name: "portfolio",
  label: "Portfolio",
  path: "content/portfolio",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `/admin/index.html#/~/admin/${locale}/portfolio/${slug}`;
      }
      return "/admin/index.html#/~/admin/pl/portfolio";
    }
  },
  fields: [
    { type: "string", name: "title", label: "Title", required: true },
    { type: "string", name: "slug", label: "Slug" },
    { type: "string", name: "description", label: "Description" },
    { type: "string", name: "excerpt", label: "Excerpt" },
    { type: "string", name: "date", label: "Date" },
    { type: "string", name: "category", label: "Category" },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true
    },
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt" },
    { type: "string", name: "link", label: "Project Link" },
    { type: "string", name: "client", label: "Client" },
    { type: "string", name: "year", label: "Year" },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [gradientTemplate]
    }
  ]
};

// tina/schemas/blog.ts
var blogCollection = {
  name: "blog",
  label: "Blog",
  path: "content/blog",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `/admin/index.html#/~/admin/${locale}/blog/${slug}`;
      }
      return "/admin/index.html#/~/admin/pl/blog";
    }
  },
  fields: [
    { type: "string", name: "title", label: "Title", required: true },
    { type: "string", name: "slug", label: "Slug" },
    { type: "string", name: "description", label: "Description" },
    { type: "string", name: "excerpt", label: "Excerpt" },
    { type: "datetime", name: "date", label: "Date" },
    { type: "string", name: "author", label: "Author" },
    { type: "string", name: "category", label: "Category" },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true
    },
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt" },
    { type: "number", name: "readTime", label: "Read Time (min)" },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [gradientTemplate]
    }
  ]
};

// tina/templates/homeSections.ts
var heroSectionTemplate = {
  name: "HeroSection",
  label: "Hero Section",
  fields: [
    {
      type: "rich-text",
      name: "title",
      label: "Title",
      templates: [gradientTemplate]
    },
    {
      type: "rich-text",
      name: "subtitle",
      label: "Subtitle"
    },
    {
      type: "image",
      name: "image",
      label: "Hero Image"
    },
    {
      type: "object",
      list: true,
      name: "actions",
      label: "Actions",
      ui: {
        itemProps: (item) => {
          return { label: item?.label };
        }
      },
      fields: [
        {
          type: "string",
          name: "label",
          label: "Label"
        },
        {
          type: "string",
          name: "url",
          label: "URL"
        },
        {
          type: "string",
          name: "type",
          label: "Type",
          options: ["primary", "secondary", "outline"]
        }
      ]
    }
  ]
};
var aboutSectionTemplate = {
  name: "AboutSection",
  label: "About Section",
  fields: [
    {
      type: "string",
      name: "label",
      label: "Label",
      description: "Small text above title (e.g. About the project)"
    },
    {
      type: "rich-text",
      name: "title",
      label: "Title",
      templates: [gradientTemplate]
    },
    {
      type: "rich-text",
      name: "description",
      label: "Description"
    },
    {
      type: "image",
      name: "image",
      label: "Image"
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text"
    }
  ]
};
var technologySectionTemplate = {
  name: "TechnologySection",
  label: "Technology Section",
  fields: [
    {
      type: "rich-text",
      name: "title",
      label: "Section Title",
      templates: [gradientTemplate]
    },
    {
      type: "rich-text",
      name: "description",
      label: "Section Description"
    }
  ]
};

// tina/schemas/pages.ts
var pagesCollection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `/admin/index.html#/~/admin/${locale}/${slug}`;
      }
      return "/admin/index.html#/~/admin/pl";
    }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page Title",
      required: true
    },
    {
      type: "string",
      name: "description",
      label: "Meta Description"
    },
    {
      type: "string",
      name: "lastUpdate",
      label: "Last Update Date",
      description: "For legal pages (YYYY-MM-DD)"
    },
    {
      type: "string",
      name: "tocTitle",
      label: "Table of Contents Title",
      description: "For legal pages sidebar"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Page Content",
      description: "For legal pages and other text-heavy pages",
      isBody: true,
      templates: [gradientTemplate, heroSectionTemplate, technologySectionTemplate, aboutSectionTemplate]
    }
  ]
};

// tina/config.ts
var branch = process.env.NEXT_PUBLIC_TINA_BRANCH ?? process.env.TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? "redesign";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? "local",
  // Get this from tina.io
  token: process.env.TINA_TOKEN ?? "local",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      portfolioCollection,
      blogCollection,
      pagesCollection
    ]
  }
});
export {
  config_default as default
};
