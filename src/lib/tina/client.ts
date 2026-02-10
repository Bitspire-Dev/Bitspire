import { createClient } from "tinacms/dist/client";
import { loadEnvConfig } from "@next/env";
import { queries } from "@tina/__generated__/types";
import type { client as GeneratedClient } from "@tina/__generated__/client";

if (typeof window === "undefined") {
  loadEnvConfig(process.cwd());
}

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ??
  process.env.TINA_BRANCH ??
  process.env.VERCEL_GIT_COMMIT_REF ??
  "redesign";

const clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? process.env.TINA_CLIENT_ID;
const token = process.env.TINA_TOKEN ?? process.env.NEXT_PUBLIC_TINA_TOKEN;

const contentApiUrl =
  process.env.NEXT_PUBLIC_TINA_CONTENT_API_URL ??
  process.env.TINA_CONTENT_API_URL ??
  (clientId ? `https://content.tinajs.io/content/${clientId}/github/${branch}` : undefined);

const localApiUrl = process.env.TINA_LOCAL_API_URL ?? "http://localhost:4001/graphql";

const isProduction = process.env.NODE_ENV === "production";
const allowPublicContentApi = process.env.TINA_ALLOW_PUBLIC_CONTENT_API === "true";

const resolveApiUrl = () => {
  if (isProduction) {
    if (!contentApiUrl) {
      throw new Error(
        "TinaCMS: Missing content API URL in production. Set NEXT_PUBLIC_TINA_CONTENT_API_URL or TINA_CONTENT_API_URL."
      );
    }

    if (!token && !allowPublicContentApi) {
      throw new Error(
        "TinaCMS: Missing token in production. Set TINA_TOKEN (or NEXT_PUBLIC_TINA_TOKEN) or explicitly allow public access via TINA_ALLOW_PUBLIC_CONTENT_API=true."
      );
    }

    return contentApiUrl;
  }

  return token && contentApiUrl ? contentApiUrl : localApiUrl;
};

const apiUrl = resolveApiUrl();

type TinaGeneratedClient = typeof GeneratedClient;

let cachedClient: TinaGeneratedClient | null = null;

export function getTinaClient() {
  if (!cachedClient) {
    cachedClient = createClient({
      url: apiUrl,
      token: token || undefined,
      queries,
    }) as TinaGeneratedClient;
  }

  return cachedClient;
}
