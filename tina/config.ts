import { defineConfig } from 'tinacms';
import { extractContentSlug } from '../src/lib/string';
import { getLocalizedPath, getPageHref } from '../src/lib/routes';
import { getCategoryUrlSlug } from '../src/lib/portfolio/categories';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.TINA_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

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
        name: 'page',
        label: 'Pages',
        path: 'content/pages',
        ui: {
          router: ({ document }) => {
            const [locale, filename] = document._sys.relativePath.split('/');
            const slug = extractContentSlug(filename ?? '');
            const internalPath = slug === 'home' ? '/' : `/${slug}`;
            return getLocalizedPath(locale, internalPath);
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
            type: 'string',
            name: 'lastUpdated',
            label: 'Last updated',
            description: 'Date displayed on legal pages, e.g. 24.08.2026.',
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
            name: 'whyBitspire',
            label: 'Why Bitspire',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Section Title',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Section Description',
              },
              {
                type: 'object',
                name: 'items',
                label: 'Cards',
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
                    name: 'subHeadline',
                    label: 'Sub-headline',
                  },
                  {
                    type: 'string',
                    name: 'body',
                    label: 'Body',
                    ui: {
                      component: 'textarea',
                    },
                    description: 'Short micro-copy displayed on the bento card',
                  },
                  {
                    type: 'string',
                    name: 'fullText',
                    label: 'Full Text',
                    ui: {
                      component: 'textarea',
                    },
                    description: 'Longer description stored in CMS, not rendered in v1',
                  },
                  {
                    type: 'image',
                    name: 'image',
                    label: 'Image',
                  },
                  {
                    type: 'string',
                    name: 'imageAlt',
                    label: 'Image Alt Text',
                  },
                  {
                    type: 'string',
                    name: 'size',
                    label: 'Card Size',
                    options: ['large', 'wide', 'tall', 'small', 'empty'],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'portfolioHighlights',
            label: 'Portfolio Highlights',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Section Title',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Section Description',
              },
              {
                type: 'object',
                name: 'items',
                label: 'Projects',
                list: true,
                ui: {
                  max: 3,
                },
                fields: [
                  {
                    type: 'reference',
                    name: 'project',
                    label: 'Project',
                    collections: ['project'],
                  },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'callToAction',
            label: 'Call to Action',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Title',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Description',
              },
              {
                type: 'string',
                name: 'primaryLabel',
                label: 'Primary Button Label',
              },
              {
                type: 'string',
                name: 'primaryHref',
                label: 'Primary Button Link',
              },
              {
                type: 'string',
                name: 'secondaryLabel',
                label: 'Secondary Button Label',
              },
              {
                type: 'string',
                name: 'secondaryHref',
                label: 'Secondary Button Link',
              },
              {
                type: 'boolean',
                name: 'showImage',
                label: 'Show image',
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
            const [locale, filename] = document._sys.relativePath.split('/');
            const slug = extractContentSlug(filename ?? '');
            return getLocalizedPath(locale, { pathname: '/blog/[slug]', params: { slug } });
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
            const slug = extractContentSlug(filename ?? '');
            const categorySlug = getCategoryUrlSlug(category as 'websites' | 'software', locale);
            return getLocalizedPath(locale, {
              pathname: '/portfolio/[category]/[slug]',
              params: { category: categorySlug, slug },
            });
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
