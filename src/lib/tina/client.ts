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

const apiUrl = token && contentApiUrl ? contentApiUrl : localApiUrl;

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
