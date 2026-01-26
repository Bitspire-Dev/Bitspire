import { Collection } from "tinacms";
import { gradientTemplate } from "../templates/gradient";

export const portfolioCollection: Collection = {
  name: "portfolio",
  label: "Portfolio",
  path: "content/portfolio",
  format: "mdx",
  match: {
    include: "**/*",
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
    },
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
      list: true,
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
      templates: [gradientTemplate],
    },
  ],
};
