import { TinaField } from "tinacms";

export const tileFields: TinaField[] = [
  {
    type: "string",
    name: "variant",
    label: "Style Variant",
    options: [
      { label: "Transparent", value: "transparent" },
      { label: "Solid White", value: "solid-white" },
      { label: "Solid Black", value: "solid-black" },
      { label: "Texture", value: "texture" },
    ],
    ui: {
        defaultValue: "transparent"
    }
  },
  {
      type: "string",
      name: "size",
      label: "Grid Spacing",
      description: "How many grid cells this tile should occupy.",
      options: [
          { label: "2x2", value: "2x2" },
          { label: "4x2", value: "4x2" }
      ],
      ui: {
          defaultValue: "2x2"
      }
  },
  {
    type: "number",
    name: "colStart",
    label: "Grid Column Start",
    description: "Column index to place this tile (1-based).",
  },
  {
    type: "number",
    name: "rowStart",
    label: "Grid Row Start",
    description: "Row index to place this tile (1-based).",
  },
  {
    type: "number",
    name: "mobileColStart",
    label: "Mobile Grid Column Start",
    description: "Mobile column index to place this tile (1-based).",
  },
  {
    type: "number",
    name: "mobileRowStart",
    label: "Mobile Grid Row Start",
    description: "Mobile row index to place this tile (1-based).",
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
