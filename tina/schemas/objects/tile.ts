import { TinaField } from "tinacms";

export const tileFields: TinaField[] = [
  {
    type: "string",
    name: "variant",
    label: "Style Variant",
    options: [
      { label: "Solid Dark (Default)", value: "solid-dark" },
      { label: "Solid Light", value: "solid-light" },
      { label: "Glass (Gradient)", value: "glass" },
      { label: "Glass Light", value: "glass-light" },
      { label: "Outline", value: "outline" },
      { label: "Gradient Dark", value: "gradient-dark" },
    ],
    ui: {
        defaultValue: "solid-dark"
    }
  },
  {
    type: "boolean",
    name: "withNoise",
    label: "Add Noise Texture",
  },
  {
    type: "string",
    name: "number",
    label: "Number Overlay (e.g. 01)",
  },
  {
    type: "string",
    name: "title",
    label: "Title",
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    ui: {
      component: "textarea"
    }
  },
  {
      type: "string",
      name: "link",
      label: "Link URL",
  }
];

export const tileObject: TinaField = {
    type: "object",
    name: "tile",
    label: "Tile",
    fields: tileFields
};
