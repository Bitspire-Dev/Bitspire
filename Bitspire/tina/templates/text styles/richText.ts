import { gradientTemplate } from "./gradient";

/**
 * Helper function to create rich-text field with Gradient template
 */
export const richTextField = (name: string, label: string, description?: string) => ({
  type: "rich-text" as const,
  name,
  label,
  description,
  templates: [gradientTemplate],
});

/**
 * Helper function to create simple rich-text field without templates
 */
export const simpleRichTextField = (name: string, label: string) => ({
  type: "rich-text" as const,
  name,
  label,
});
