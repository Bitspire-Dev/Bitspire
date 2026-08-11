"use client";
import React from "react";
import { useCookieConsent } from "@/hooks/useCookies";
import { useModal } from "@/hooks/useModal";
import type { CookieCategory } from "@/lib/cookies";
import { Button } from "@/components/ui/primitives/Button";
import { Card, CardContent } from "@/components/ui/primitives/Card";
import { useLocale } from "next-intl";
import { getTranslations } from "@/i18n/translations";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_KEYS = ["necessary", "analytics", "personalization", "marketing"] as const;

export const CookieSettingsModal: React.FC<Props> = ({ open, onClose }) => {
  const { consent, setCategories, rejectAll, grantAll } = useCookieConsent();
  const locale = useLocale();
  const t = getTranslations(locale).cookieSettings;

  const CATEGORY_LABELS: Record<string, string> = {
    necessary: t.necessary,
    analytics: t.analytics,
    personalization: t.personalization,
    marketing: t.marketing,
  };

  const CATEGORY_DESCS: Record<string, string> = {
    necessary: t.necessaryDesc,
    analytics: t.analyticsDesc,
    personalization: t.personalizationDesc,
    marketing: t.marketingDesc,
  };

  const {
    visible,
    dialogRef,
    overlayClass,
    contentClass,
  } = useModal(open, { onClose, trapFocus: true });

  if (!visible) return null;

  const toggle = (key: Exclude<CookieCategory, "necessary"> | "necessary") => {
    if (!consent) return;
    if (key === "necessary") return; // cannot toggle
    const value = !consent[key as keyof typeof consent];
    setCategories([key as CookieCategory], value);
  };

  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${overlayClass}`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="cookie-settings-title"
      ref={dialogRef}
    >
      <Card
        interactive={false}
        className={`w-full max-w-2xl bg-slate-900 border-slate-700 shadow-2xl backdrop-blur-md ${contentClass}`}
      >
        <CardContent padding="md" className="p-6 md:p-8">
        <h2 id="cookie-settings-title" className="text-2xl font-bold text-white mb-2">
          {t.heading}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          {t.description}
        </p>
        <ul className="space-y-4">
          {CATEGORY_KEYS.map((key) => (
            <li key={key} className="flex items-start justify-between gap-4 border border-slate-700 rounded-lg p-4 bg-slate-800/40">
              <div>
                <p className="font-medium text-white">{CATEGORY_LABELS[key]}</p>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  {CATEGORY_DESCS[key]}
                </p>
              </div>
              <button
                onClick={() => toggle(key as CookieCategory)}
                disabled={key === "necessary"}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  ${consent?.[key as keyof typeof consent] ? 'bg-blue-600 border-blue-600' : 'bg-slate-600 border-slate-500'}
                  ${key === 'necessary' ? 'opacity-60 cursor-not-allowed' : ''}`}
                aria-pressed={!!consent?.[key as keyof typeof consent]}
                aria-label={`${t.toggleCategory} ${CATEGORY_LABELS[key]}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200
                    ${consent?.[key as keyof typeof consent] ? 'translate-x-7' : 'translate-x-0'}`}
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-4 justify-end mt-8">
          <Button
            onClick={() => { rejectAll(); onClose(); }}
            variant="secondary"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm font-medium text-slate-200 border border-slate-600"
          >
            {t.rejectAll}
          </Button>
          <Button
            onClick={() => { grantAll(); onClose(); }}
            variant="primary"
            className="px-4 py-2 text-sm font-semibold shadow"
          >
            {t.acceptAll}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 border border-slate-600"
          >
            {t.close}
          </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
};
