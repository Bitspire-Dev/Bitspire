import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main';

export default defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'header',
        label: 'Header',
        path: 'content/layout/header',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'ctaLabel',
            label: 'CTA Label',
            required: true,
          },
          {
            type: 'object',
            name: 'navLinks',
            label: 'Navigation Links',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
              },
              {
                type: 'string',
                name: 'href',
                label: 'Href',
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: 'footer',
        label: 'Footer',
        path: 'content/layout/footer',
        format: 'md',
        fields: [
          {
            type: 'string',
            name: 'copyright',
            label: 'Copyright',
            required: true,
          },
          {
            type: 'object',
            name: 'navLinks',
            label: 'Navigation Links',
            list: true,
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
              },
              {
                type: 'string',
                name: 'href',
                label: 'Href',
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        ui: {
          router: ({ document }) => {
            const [locale] = document._sys.relativePath.split('/');
            return `/_preview/${locale}`;
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
          {
            type: 'object',
            name: 'services',
            label: 'Services',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Section Title',
              },
              {
                type: 'object',
                name: 'items',
                label: 'Service Items',
                list: true,
                fields: [
                  {
                    type: 'string',
                    name: 'title',
                    label: 'Title',
                    required: true,
                  },
                  {
                    type: 'string',
                    name: 'tagline',
                    label: 'Tagline',
                    required: true,
                  },
                  {
                    type: 'string',
                    name: 'description',
                    label: 'Description',
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'post',
        label: 'Posts',
        path: 'content/posts',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
      {
        name: 'project',
        label: 'Projects',
        path: 'content/portfolio',
        format: 'md',
        ui: {
          router: ({ document }) => {
            const [category] = document._sys.relativePath.split('/');
            const locale = ['strony-internetowe', 'oprogramowanie'].includes(category)
              ? 'pl'
              : 'en';
            return `/_preview/${locale}/portfolio/${category}`;
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'tagline',
            label: 'Tagline',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'string',
            name: 'technologies',
            label: 'Technologies',
            list: true,
          },
          {
            type: 'string',
            name: 'websiteUrl',
            label: 'Website URL',
          },
          {
            type: 'image',
            name: 'screenshot',
            label: 'Screenshot',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
