// tina/config.ts
import { defineConfig } from "tinacms";

// tina/templates/gradient.ts
var gradientTemplate = {
  name: "Gradient",
  label: "Gradient Text",
  fields: [
    {
      type: "string",
      name: "children",
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

// tina/templates/richText.ts
var richTextField = (name, label, description) => ({
  type: "rich-text",
  name,
  label,
  description,
  templates: [gradientTemplate]
});
var simpleRichTextField = (name, label) => ({
  type: "rich-text",
  name,
  label
});

// tina/schemas/sections.ts
var heroSection = {
  type: "object",
  name: "hero",
  label: "Hero Section",
  fields: [
    richTextField("title", "Title", "U\u017Cyj 'Gradient' z menu aby doda\u0107 kolorowy tekst"),
    simpleRichTextField("subtitle", "Subtitle"),
    {
      type: "image",
      name: "image",
      label: "Hero Image"
    }
  ]
};
var technologySection = {
  type: "object",
  name: "technology",
  label: "Technology Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description")
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
    // Home page sections
    heroSection,
    technologySection,
    {
      type: "rich-text",
      name: "body",
      label: "Page Content",
      description: "For legal pages and other text-heavy pages",
      isBody: true,
      templates: [gradientTemplate]
    }
  ]
};

// tina/config.ts
var branch = process.env.NEXT_PUBLIC_TINA_BRANCH ?? process.env.TINA_BRANCH ?? process.env.VERCEL_GIT_COMMIT_REF ?? "redesign";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
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
