import { TinaField } from "tinacms";
import { richTextField, simpleRichTextField } from "../templates/text styles/richText";

/**
 * Hero section fields for home page
 */
export const heroSection: TinaField = {
  type: "object",
  name: "hero",
  label: "Hero Section",
  fields: [
    richTextField("title", "Title", "Użyj 'Gradient' z menu aby dodać kolorowy tekst"),
    simpleRichTextField("subtitle", "Subtitle"),
    {
      type: "image",
      name: "image",
      label: "Hero Image",
    },
  ],
};

/**
 * Technology section fields
 */
export const technologySection: TinaField = {
  type: "object",
  name: "technology",
  label: "Technology Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description"),
    {
      type: "object",
      name: "items",
      label: "Technologies",
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name };
        },
      },
      fields: [
        {
          type: "string",
          name: "name",
          label: "Name",
        },
        {
          type: "image",
          name: "icon",
          label: "Icon",
        },
      ],
    },
  ],
};
