import type { RichTextTemplate } from "@tinacms/schema-tools";
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
  ],
} as const satisfies RichTextTemplate<false>;
