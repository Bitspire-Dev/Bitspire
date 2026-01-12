import { defineConfig } from "tinacms";
import { portfolioCollection } from "./schemas/portfolio";
import { blogCollection } from "./schemas/blog";
import { pagesCollection } from "./schemas/pages";

export default defineConfig({
  branch: "redesign",
  
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      portfolioCollection,
      blogCollection,
      pagesCollection,
    ],
  },
});
