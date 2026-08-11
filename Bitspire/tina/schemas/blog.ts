import { Collection } from "tinacms";
import { gradientTemplate } from "../templates/text styles/gradient";

export const blogCollection: Collection = {
  name: "blog",
  label: "Blog",
  path: "content/blog",
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
        return `/admin/index.html#/~/admin/${locale}/blog/${slug}`;
      }
      return "/admin/index.html#/~/admin/pl/blog";
    },
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
      list: true,
    },
    { type: "image", name: "image", label: "Image" },
    { type: "string", name: "imageAlt", label: "Image Alt" },
    { type: "number", name: "readTime", label: "Read Time (min)" },
    {
      type: "rich-text",
      name: "body",
      label: "Body",
      isBody: true,
      templates: [gradientTemplate],
    },
  ],
};
