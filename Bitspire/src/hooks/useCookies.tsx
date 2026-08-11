"use client";
import { useCallback, useEffect, useState } from "react";
import {
  CookieCategory,
  ConsentState,
  defaultConsent,
  loadConsent,
  saveConsent,
  updateConsent,
  COOKIE_CONSENT_NAME,
} from "@/lib/cookies";

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const c = loadConsent();
    if (c) setConsent(c);
    setReady(true);
  }, []);

  const grantAll = useCallback(() => {
    const updated = saveConsent({ ...defaultConsent, analytics: true, personalization: true, marketing: true });
    setConsent(updated);
  }, []);

  const rejectAll = useCallback(() => {
    const updated = saveConsent({ ...defaultConsent });
    setConsent(updated);
  }, []);

  const setCategories = useCallback((categories: CookieCategory[], value: boolean) => {
    const partial = categories.reduce<Partial<ConsentState>>((acc, cat) => {
      if (cat !== "necessary") acc[cat] = value; // necessary always true
      return acc;
    }, {});
    const updated = updateConsent(partial);
    setConsent(updated);
  }, []);

  const hasConsent = useCallback((category: CookieCategory) => {
    if (category === "necessary") return true;
    return Boolean(consent?.[category]);
  }, [consent]);

  return {
    consent,
    ready,
    hasConsent,
    grantAll,
    rejectAll,
    setCategories,
    COOKIE_CONSENT_NAME,
  };
}
