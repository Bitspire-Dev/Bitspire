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
    ],
  },
});
