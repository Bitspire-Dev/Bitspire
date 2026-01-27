import { defineConfig } from "tinacms";
import { portfolioCollection } from "./schemas/portfolio";
import { blogCollection } from "./schemas/blog";
import { pagesCollection } from "./schemas/pages";

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ??
  process.env.TINA_BRANCH ??
  process.env.VERCEL_GIT_COMMIT_REF ??
  "redesign";

export default defineConfig({
  branch,
  
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? "local",
  // Get this from tina.io
  token: process.env.TINA_TOKEN ?? "local",

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
