import { Collection } from "tinacms";
import { gradientTemplate } from "../templates/gradient";

export const blogCollection: Collection = {
  name: "blog",
  label: "Blog",
  path: "content/blog",
  format: "mdx",
  match: {
    include: '**/*',
  },
  ui: {
    router: ({ document }) => {
      // Extract locale and slug from the path
      // document._sys.relativePath format: "pl/post-slug.mdx" or "en/post-slug.mdx"
      const pathParts = document._sys.relativePath.split('/');
      if (pathParts.length >= 2) {
        const locale = pathParts[0]; // 'pl' or 'en'
        const slug = pathParts[1].replace('.mdx', '');

        // Route Tina preview through SPA hash
        return `/admin/index.html#/~/admin/${locale}/blog/${slug}`;
      }
      return '/admin/index.html#/~/admin/pl/blog';
    },
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Post Title",
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
      label: "Meta Description",
      required: true,
    },
    {
      type: "string",
      name: "excerpt",
      label: "Short Excerpt",
      ui: {
        component: "textarea",
      },
      required: true,
    },
    {
      type: "datetime",
      name: "date",
      label: "Publication Date",
      required: true,
    },
    {
      type: "string",
      name: "author",
      label: "Author Name",
      required: true,
    },
    {
      type: "string",
      name: "category",
      label: "Category",
      required: true,
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Featured Image",
      required: true,
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text",
      required: true,
    },
    {
      type: "number",
      name: "readTime",
      label: "Read Time (minutes)",
      required: true,
    },
    {
      type: "rich-text",
      name: "body",
      label: "Content",
      isBody: true,
      templates: [gradientTemplate],
    },
  ],
};
