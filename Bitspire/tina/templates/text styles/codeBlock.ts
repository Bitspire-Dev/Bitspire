/**
 * Reusable CodeBlock template for rich-text fields
 * Allows selecting language and editing code in TinaCMS
 */
export const codeBlockTemplate = {
  name: "CodeBlock",
  label: "Code Block",
  fields: [
    {
      type: "string" as const,
      name: "language",
      label: "Language",
      ui: {
        component: "select",
      },
      options: [
        { label: "Text", value: "text" },
        { label: "JavaScript", value: "javascript" },
        { label: "TypeScript", value: "typescript" },
        { label: "TSX", value: "tsx" },
        { label: "JSX", value: "jsx" },
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "JSON", value: "json" },
        { label: "Markdown", value: "markdown" },
        { label: "Bash", value: "bash" },
        { label: "YAML", value: "yaml" },
        { label: "SQL", value: "sql" },
        { label: "Mermaid", value: "mermaid" },
      ],
    },
    {
      type: "string" as const,
      name: "code",
      label: "Code",
      ui: {
        component: "textarea",
      },
    },
  ],
};
