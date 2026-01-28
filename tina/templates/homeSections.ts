import type { RichTextTemplate } from "@tinacms/schema-tools";
import { tileFields } from "../schemas/objects/tile";
import { gradientTemplate } from "./text styles/gradient";

export const heroSectionTemplate = {
  name: "HeroSection",
  label: "Hero Section",
  fields: [
    {
      type: "rich-text" as const,
      name: "title",
      label: "Title",
      templates: [gradientTemplate],
    },
    {
      type: "rich-text" as const,
      name: "subtitle",
      label: "Subtitle",
    },
    {
      type: "image" as const,
      name: "image",
      label: "Hero Image",
    },
    {
      type: "object" as const,
      list: true as const,
      name: "actions",
      label: "Actions",
      ui: {
        itemProps: (item: { label?: string } | undefined) => {
          return { label: item?.label };
        },
      },
      fields: [
        {
          type: "string" as const,
          name: "label",
          label: "Label",
        },
        {
          type: "string" as const,
          name: "url",
          label: "URL",
        },
        {
          type: "string" as const,
          name: "type",
          label: "Type",
          options: ["primary", "secondary", "outline"] as const,
        },
      ],
    },
  ],
} as const satisfies RichTextTemplate<false>;

export const aboutSectionTemplate = {
  name: "AboutSection",
  label: "About Section",
  fields: [
    {
      type: "string" as const,
      name: "label",
      label: "Label",
      description: "Small text above title (e.g. About the project)",
    },
    {
      type: "rich-text" as const,
      name: "title",
      label: "Title",
      templates: [gradientTemplate],
    },
    {
      type: "rich-text" as const,
      name: "description",
      label: "Description",
    },
    {
      type: "image" as const,
      name: "image",
      label: "Image",
    },
    {
      type: "string" as const,
      name: "imageAlt",
      label: "Image Alt Text",
    },
  ],
} as const satisfies RichTextTemplate<false>;

export const technologySectionTemplate = {
  name: "TechnologySection",
  label: "Technology Section",
  fields: [
    {
      type: "rich-text" as const,
      name: "title",
      label: "Section Title",
      templates: [gradientTemplate],
    },
    {
      type: "rich-text" as const,
      name: "description",
      label: "Section Description",
    },
    {
      type: "object" as const,
      name: "items",
      label: "Technologies",
      list: true as const,
      ui: {
        itemProps: (item: { name?: string } | undefined) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          type: "string" as const,
          name: "name",
          label: "Name",
        },
        {
          type: "image" as const,
          name: "icon",
          label: "Icon",
        },
      ],
    },
  ],
} as const satisfies RichTextTemplate<false>;

export const portfolioHighlightsSectionTemplate = {
  name: "PortfolioHighlightsSection",
  label: "Portfolio Highlights",
  fields: [
    {
      type: "rich-text" as const,
      name: "title",
      label: "Title",
      templates: [gradientTemplate],
    },
    {
      type: "rich-text" as const,
      name: "subtitle",
      label: "Subtitle",
    },
    {
      type: "object" as const,
      name: "projects",
      label: "Selected Projects",
      list: true as const,
      ui: {
        itemProps: (item: { project?: string } | undefined) => {
          return { label: item?.project };
        },
      },
      fields: [
        {
          type: "reference" as const,
          name: "project",
          label: "Project",
          collections: ["portfolio"],
        },
      ],
    },
  ],
} as const satisfies RichTextTemplate<false>;

export const featuresSectionTemplate = {
  name: "FeaturesSection",
  label: "Features Section",
  fields: [
    {
      type: "string" as const,
      name: "label",
      label: "Label",
    },
    {
      type: "rich-text" as const,
      name: "title",
      label: "Title",
      templates: [gradientTemplate],
    },
    {
      type: "rich-text" as const,
      name: "subtitle",
      label: "Subtitle",
    },
    {
      type: "object" as const,
      name: "features",
      label: "Features List",
      list: true as const,
      ui: {
        itemProps: (item: { title?: string } | undefined) => {
          return { label: item?.title };
        },
      },
      fields: [
        {
          type: "image" as const,
          name: "icon",
          label: "Icon",
        },
        {
          type: "string" as const,
          name: "title",
          label: "Title",
        },
        {
          type: "string" as const,
          name: "description",
          label: "Description",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
  ],
} as const satisfies RichTextTemplate<false>;

export const statisticsSectionTemplate = {
  name: "StatisticsSection",
  label: "Statistics Section",
  fields: [
    {
       type: "rich-text" as const,
       name: "title",
       label: "Title",
       templates: [gradientTemplate],
    },
    {
       type: "rich-text" as const,
       name: "description",
       label: "Description",
    },
    {
       type: "object" as const,
       name: "tiles",
       label: "Tiles",
       list: true as const,
       ui: {
        itemProps: (item: { title?: string } | undefined) => {
           return { label: item?.title };
        },
       },
       fields: tileFields
    }
  ],
} as const satisfies RichTextTemplate<false>;
