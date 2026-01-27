/**
 * Reusable Gradient template for rich-text fields
 * Used to add gradient-colored text in Tina CMS
 */
export const gradientTemplate = {
  name: "Gradient",
  label: "Gradient Text",
  inline: true,
  ui: {
    defaultItem: {
      text: "",
    },
  },
  fields: [
    {
      type: "string" as const,
      name: "text",
      label: "Text",
    },
  ],
};
