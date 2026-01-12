// tina/config.ts
import { defineConfig } from "tinacms";

// tina/schemas/portfolio.ts
var portfolioCollection = {
  name: "portfolio",
  label: "Portfolio",
  path: "content/portfolio",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `admin/${locale}/portfolio/${slug}`;
      }
      return "admin/pl/portfolio";
    }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Project Title",
      required: true
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true
    },
    {
      type: "string",
      name: "description",
      label: "Project Description",
      required: true,
      ui: {
        component: "textarea"
      }
    },
    {
      type: "datetime",
      name: "date",
      label: "Publication Date"
    },
    {
      type: "string",
      name: "excerpt",
      label: "Short Excerpt",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "string",
      name: "category",
      label: "Category"
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true
    },
    {
      type: "string",
      name: "year",
      label: "Year"
    },
    {
      type: "string",
      name: "client",
      label: "Client Name"
    },
    {
      type: "image",
      name: "image",
      label: "Project Image"
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text"
    },
    {
      type: "string",
      name: "link",
      label: "Project URL"
    },
    {
      type: "boolean",
      name: "featured",
      label: "Featured Project",
      description: "Show this project on homepage"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Content",
      isBody: true
    }
  ]
};

// tina/schemas/blog.ts
var blogCollection = {
  name: "blog",
  label: "Blog",
  path: "content/blog",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `admin/${locale}/blog/${slug}`;
      }
      return "admin/pl/blog";
    }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Post Title",
      required: true
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true
    },
    {
      type: "string",
      name: "description",
      label: "Meta Description",
      required: true
    },
    {
      type: "string",
      name: "excerpt",
      label: "Short Excerpt",
      ui: {
        component: "textarea"
      }
    },
    {
      type: "datetime",
      name: "date",
      label: "Publication Date",
      required: true
    },
    {
      type: "string",
      name: "author",
      label: "Author Name",
      required: true
    },
    {
      type: "string",
      name: "category",
      label: "Category"
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true
    },
    {
      type: "image",
      name: "image",
      label: "Featured Image"
    },
    {
      type: "string",
      name: "imageAlt",
      label: "Image Alt Text"
    },
    {
      type: "number",
      name: "readTime",
      label: "Read Time (minutes)"
    },
    {
      type: "rich-text",
      name: "body",
      label: "Content",
      isBody: true
    }
  ]
};

// tina/templates/gradient.ts
var gradientTemplate = {
  name: "Gradient",
  label: "Gradient Text",
  fields: [
    {
      type: "string",
      name: "children",
      label: "Text"
    }
  ]
};

// tina/templates/richText.ts
var richTextField = (name, label, description) => ({
  type: "rich-text",
  name,
  label,
  description,
  templates: [gradientTemplate]
});
var simpleRichTextField = (name, label) => ({
  type: "rich-text",
  name,
  label
});

// tina/schemas/sections.ts
var heroSection = {
  type: "object",
  name: "hero",
  label: "Hero Section",
  fields: [
    richTextField("title", "Title", "U\u017Cyj 'Gradient' z menu aby doda\u0107 kolorowy tekst"),
    simpleRichTextField("subtitle", "Subtitle"),
    {
      type: "image",
      name: "image",
      label: "Hero Image"
    }
  ]
};
var technologySection = {
  type: "object",
  name: "technology",
  label: "Technology Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description")
  ]
};
var offerSection = {
  type: "object",
  name: "offer",
  label: "Offer Section",
  fields: [
    richTextField("title", "Section Title", "U\u017Cyj 'Gradient' dla akcentu"),
    simpleRichTextField("subtitle", "Section Subtitle"),
    {
      type: "string",
      name: "sectionLabel",
      label: "Section Label"
    },
    {
      type: "object",
      name: "services",
      label: "Services",
      list: true,
      fields: [
        richTextField("title", "Service Title"),
        richTextField("description", "Service Description"),
        {
          type: "string",
          name: "icon",
          label: "Icon (emoji)"
        },
        {
          type: "string",
          name: "features",
          label: "Features",
          list: true
        },
        {
          type: "string",
          name: "link",
          label: "Link URL"
        },
        {
          type: "string",
          name: "buttonText",
          label: "Button Text"
        }
      ]
    }
  ]
};
var portfolioHighlightsSection = {
  type: "object",
  name: "portfolioHighlights",
  label: "Portfolio Highlights Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description")
  ]
};
var howWeWorkSection = {
  type: "object",
  name: "howWeWork",
  label: "How We Work Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description"),
    {
      type: "object",
      name: "steps",
      label: "Process Steps",
      list: true,
      fields: [
        richTextField("title", "Step Title"),
        richTextField("description", "Step Description"),
        {
          type: "string",
          name: "icon",
          label: "Icon Name (clipboard, design, code, test, rocket, support)"
        },
        {
          type: "string",
          name: "duration",
          label: "Duration"
        }
      ]
    }
  ]
};
var faqSection = {
  type: "object",
  name: "faq",
  label: "FAQ Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description"),
    {
      type: "object",
      name: "items",
      label: "FAQ Items",
      list: true,
      fields: [
        richTextField("question", "Question"),
        richTextField("answer", "Answer")
      ]
    }
  ]
};
var contactSection = {
  type: "object",
  name: "contact",
  label: "Contact Section",
  fields: [
    richTextField("title", "Section Title"),
    simpleRichTextField("description", "Section Description"),
    {
      type: "string",
      name: "email",
      label: "Email"
    },
    {
      type: "string",
      name: "phone",
      label: "Phone"
    },
    {
      type: "string",
      name: "address",
      label: "Company Name"
    },
    {
      type: "string",
      name: "addressLine2",
      label: "Street Address"
    },
    {
      type: "string",
      name: "city",
      label: "City & Postal Code"
    },
    {
      type: "string",
      name: "successTitle",
      label: "Success Message Title"
    },
    {
      type: "string",
      name: "successMessage",
      label: "Success Message Text"
    },
    {
      type: "string",
      name: "nameLabel",
      label: "Name Field Label"
    },
    {
      type: "string",
      name: "emailLabel",
      label: "Email Field Label"
    },
    {
      type: "string",
      name: "messageLabel",
      label: "Message Field Label"
    },
    {
      type: "string",
      name: "buttonText",
      label: "Submit Button Text"
    },
    {
      type: "string",
      name: "contactDataTitle",
      label: "Contact Data Section Title"
    },
    {
      type: "string",
      name: "quickResponseLabel",
      label: "Quick Response Label"
    },
    {
      type: "string",
      name: "quickResponseText",
      label: "Quick Response Text"
    }
  ]
};

// tina/schemas/pages.ts
var pagesCollection = {
  name: "pages",
  label: "Pages",
  path: "content/pages",
  format: "mdx",
  match: {
    include: "**/*"
  },
  ui: {
    router: ({ document }) => {
      const pathParts = document._sys.relativePath.split("/");
      if (pathParts.length >= 2) {
        const locale = pathParts[0];
        const slug = pathParts[1].replace(".mdx", "");
        return `admin/${locale}/${slug}`;
      }
      return "admin/pl/home";
    }
  },
  fields: [
    {
      type: "string",
      name: "title",
      label: "Page Title",
      required: true
    },
    {
      type: "string",
      name: "description",
      label: "Meta Description"
    },
    {
      type: "string",
      name: "lastUpdate",
      label: "Last Update Date",
      description: "For legal pages (YYYY-MM-DD)"
    },
    {
      type: "string",
      name: "tocTitle",
      label: "Table of Contents Title",
      description: "For legal pages sidebar"
    },
    {
      type: "string",
      name: "selectedProjects",
      label: "Selected Portfolio Projects",
      description: "Choose which portfolio projects to display (max 3 for highlights)",
      list: true,
      ui: {
        component: "list"
      }
    },
    // Home page sections
    heroSection,
    technologySection,
    offerSection,
    portfolioHighlightsSection,
    howWeWorkSection,
    faqSection,
    contactSection,
    // Portfolio and Blog page fields
    {
      type: "object",
      name: "portfolio",
      label: "Portfolio Page Settings",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Portfolio Title"
        },
        {
          type: "string",
          name: "description",
          label: "Portfolio Description"
        },
        {
          type: "string",
          name: "sectionLabel",
          label: "Section Label"
        }
      ]
    },
    {
      type: "object",
      name: "blog",
      label: "Blog Page Settings",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Blog Title"
        },
        {
          type: "string",
          name: "description",
          label: "Blog Description"
        },
        {
          type: "string",
          name: "sectionLabel",
          label: "Section Label"
        },
        {
          type: "string",
          name: "shareTitle",
          label: "Share Title"
        },
        {
          type: "object",
          name: "shareButtons",
          label: "Share Button Labels",
          fields: [
            { type: "string", name: "twitter", label: "Twitter Label" },
            { type: "string", name: "linkedin", label: "LinkedIn Label" },
            { type: "string", name: "facebook", label: "Facebook Label" },
            { type: "string", name: "copyLink", label: "Copy Link Label" }
          ]
        },
        {
          type: "string",
          name: "tableOfContentsTitle",
          label: "Table of Contents Title"
        },
        {
          type: "object",
          name: "authorBox",
          label: "Author Box",
          fields: [
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "bio", label: "Bio", ui: { component: "textarea" } },
            { type: "string", name: "contact", label: "Contact Button" }
          ]
        },
        {
          type: "string",
          name: "relatedArticlesTitle",
          label: "Related Articles Title"
        },
        {
          type: "string",
          name: "otherProjectsTitle",
          label: "Other Projects Title"
        }
      ]
    },
    // Search bar labels
    {
      type: "object",
      name: "searchBar",
      label: "Search & Filter Labels",
      fields: [
        {
          type: "object",
          name: "blog",
          label: "Blog Search",
          fields: [
            { type: "string", name: "searchPlaceholder", label: "Search Placeholder" },
            { type: "string", name: "clearSearch", label: "Clear Search" },
            { type: "string", name: "filterByTech", label: "Filter By Tags" },
            { type: "string", name: "clearFilters", label: "Clear Filters" },
            { type: "string", name: "showLess", label: "Show Less" },
            { type: "string", name: "showMore", label: "Show More" },
            { type: "string", name: "activeFilters", label: "Active Filters" },
            { type: "string", name: "removeFilter", label: "Remove Filter" }
          ]
        },
        {
          type: "object",
          name: "portfolio",
          label: "Portfolio Search",
          fields: [
            { type: "string", name: "searchPlaceholder", label: "Search Placeholder" },
            { type: "string", name: "clearSearch", label: "Clear Search" },
            { type: "string", name: "filterByTech", label: "Filter By Technology" },
            { type: "string", name: "clearFilters", label: "Clear Filters" },
            { type: "string", name: "showLess", label: "Show Less" },
            { type: "string", name: "showMore", label: "Show More" },
            { type: "string", name: "activeFilters", label: "Active Filters" },
            { type: "string", name: "removeFilter", label: "Remove Filter" }
          ]
        }
      ]
    },
    {
      type: "rich-text",
      name: "body",
      label: "Page Content",
      description: "For legal pages and other text-heavy pages",
      isBody: true
    }
  ]
};

// tina/config.ts
var config_default = defineConfig({
  branch: "redesign",
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      portfolioCollection,
      blogCollection,
      pagesCollection
    ]
  }
});
export {
  config_default as default
};
