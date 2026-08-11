// Cookie helpers using cookies-next
import { getCookie as getCNext, setCookie as setCNext, deleteCookie as delCNext } from "cookies-next";

export const COOKIE_CONSENT_NAME = "cookie_consent_v1";
export type CookieCategory = "necessary" | "analytics" | "personalization" | "marketing";

export interface ConsentState {
  necessary: boolean; // always true
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  timestamp?: string; // ISO date when stored
}

export const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

export function parseConsent(value: string | undefined | null): ConsentState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return { ...defaultConsent, ...parsed };
  } catch {
    return null;
  }
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

function isSecureContext(): boolean {
  if (typeof window !== "undefined") return window.location.protocol === "https:";
  // SSR fallback
  return process.env.NODE_ENV === "production";
}

export function setCookie(name: string, value: string, days = 365) {
  try {
    setCNext(name, value, {
      path: "/",
      maxAge: days * 24 * 60 * 60, // seconds
      sameSite: "lax",
      secure: isSecureContext(),
    });
  } catch {
    // noop
  }
}

export function getCookie(name: string): string | undefined {
  try {
    const v = getCNext(name);
    // cookies-next may return object or string depending on env; ensure string
    return typeof v === "string" ? v : (v as unknown as string | undefined);
  } catch {
    return undefined;
  }
}

export function removeCookie(name: string) {
  try {
    delCNext(name, { path: "/" });
  } catch {
    // noop
  }
}

export function loadConsent(): ConsentState | null {
  const raw = getCookie(COOKIE_CONSENT_NAME);
  const parsed = parseConsent(raw);
  if (parsed) return parsed;
  // optional fallback localStorage (helps when third-party blocks cookies locally)
  if (typeof window !== "undefined") {
    try {
      const ls = window.localStorage.getItem(COOKIE_CONSENT_NAME);
      if (ls) return parseConsent(ls);
    } catch {}
  }
  return null;
}

export function saveConsent(state: ConsentState) {
  const withTs = { ...state, timestamp: new Date().toISOString() };
  const serialized = serializeConsent(withTs);
  setCookie(COOKIE_CONSENT_NAME, serialized, 365);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_NAME, serialized);
    } catch {}
  }
  return withTs;
}

export function hasAnyConsent(): boolean {
  return !!loadConsent();
}

export function updateConsent(partial: Partial<ConsentState>) {
  const current = loadConsent() || defaultConsent;
  return saveConsent({ ...current, ...partial });
}
