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
            const [locale, filename] = document._sys.relativePath.split('/');
            const slug = filename?.replace(/\.md$/, '') ?? '';
            return slug === 'home' ? `/${locale}` : `/${locale}/${slug}`;
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
          {
            type: 'object',
            name: 'contact',
            label: 'Contact',
            fields: [
              {
                type: 'string',
                name: 'email',
                label: 'Email',
              },
              {
                type: 'string',
                name: 'phone',
                label: 'Phone',
              },
              {
                type: 'string',
                name: 'address',
                label: 'Address',
              },
              {
                type: 'string',
                name: 'hours',
                label: 'Working hours',
              },
              {
                type: 'object',
                name: 'socials',
                label: 'Social links',
                list: true,
                fields: [
                  {
                    type: 'string',
                    name: 'platform',
                    label: 'Platform',
                    required: true,
                  },
                  {
                    type: 'string',
                    name: 'url',
                    label: 'URL',
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'blog',
        label: 'Blog',
        path: 'content/blog',
        format: 'md',
        ui: {
          router: ({ document }) => {
            const [locale, slug] = document._sys.relativePath.split('/');
            return `/${locale}/blog/${slug}`;
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
            name: 'canonical',
            label: 'Canonical',
            description: 'Unique identifier shared across all language versions of this article.',
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
          },
          {
            type: 'image',
            name: 'cover',
            label: 'Cover',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'string',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'object',
            name: 'author',
            label: 'Author',
            fields: [
              {
                type: 'string',
                name: 'name',
                label: 'Name',
                required: true,
              },
              {
                type: 'string',
                name: 'role',
                label: 'Role',
              },
              {
                type: 'image',
                name: 'avatar',
                label: 'Avatar',
              },
              {
                type: 'string',
                name: 'bio',
                label: 'Bio',
              },
              {
                type: 'string',
                name: 'link',
                label: 'Link',
              },
            ],
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
            const [locale, category, filename] = document._sys.relativePath.split('/');
            const slug = filename?.replace(/\.md$/, '');
            return `/${locale}/portfolio/${category}/${slug}`;
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
