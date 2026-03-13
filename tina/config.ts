import { defineConfig } from "tinacms";
import { portfolioCollection } from "./schemas/portfolio";
import { blogCollection } from "./schemas/blog";
import { pagesCollection } from "./schemas/pages";

const getEnvValue = (...values: Array<string | undefined>) => {
  for (const value of values) {
    const trimmedValue = value?.trim();
    if (trimmedValue) {
      return trimmedValue;
    }
  }

  return undefined;
};

const branch = getEnvValue(
  process.env.NEXT_PUBLIC_TINA_BRANCH,
  process.env.TINA_BRANCH,
  process.env.VERCEL_GIT_COMMIT_REF,
) ?? "redesign";

export default defineConfig({
  branch,
  
  // Get this from tina.io
  clientId: getEnvValue(process.env.NEXT_PUBLIC_TINA_CLIENT_ID, process.env.TINA_CLIENT_ID) ?? "local",
  // Get this from tina.io
  token: getEnvValue(process.env.TINA_TOKEN) ?? "local",

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
