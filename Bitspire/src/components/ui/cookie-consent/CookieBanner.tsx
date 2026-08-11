"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCookieConsent } from "@/hooks/useCookies";
import { useAdminLink } from "@/hooks/useAdminLink";
import { CookieSettingsModal } from "./CookieSettingsModal";
import { Button } from "@/components/ui/primitives/Button";
import { useLocale } from "next-intl";
import { getTranslations } from "@/i18n/translations";

export const CookieBanner: React.FC = () => {
  const { consent, ready, grantAll, rejectAll } = useCookieConsent();
  const { getLink } = useAdminLink();
  const [openSettings, setOpenSettings] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const locale = useLocale();
  const t = getTranslations(locale).cookieBanner;

  useEffect(() => {
    if (ready && !consent) {
      setVisible(true);
      setClosing(false);
    }
  }, [ready, consent]);

  // Listen for global event from footer "Ustawienia cookies" button
  useEffect(() => {
    function onOpenSettings() {
      setOpenSettings(true);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("open-cookie-settings", onOpenSettings as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-cookie-settings", onOpenSettings as EventListener);
      }
    };
  }, []);

  if (!visible) return <CookieSettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />;

  const handleAction = (action: () => void) => {
    setClosing(true);
    setTimeout(() => {
      action();
      setVisible(false);
      setClosing(false);
    }, 250);
  };

  return (
    <>
      <div
        className={
          `fixed bottom-4 left-1/2 -translate-x-1/2 z-150 w-[min(100%-1rem,760px)]` +
          ` bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-7` +
          ` transition-all duration-300 ease-out transform` +
          ` ${closing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`
        }
        role="dialog"
        aria-label={t.ariaLabel}
      >
        <h2 className="text-lg font-semibold text-white mb-2">{t.heading}</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {t.description} <Link href={getLink("/polityka-prywatnosci/")} className="text-blue-400 underline">{t.privacyPolicy}</Link> i <Link href={getLink("/polityka-cookies/")} className="text-blue-400 underline">{t.cookiePolicy}</Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
          <Button
            onClick={() => handleAction(rejectAll)}
            variant="secondary"
            className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-sm font-medium text-slate-200 border border-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t.reject}
          </Button>
          <Button
            onClick={() => setOpenSettings(true)}
            variant="secondary"
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 border border-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t.settings}
          </Button>
          <Button
            onClick={() => handleAction(grantAll)}
            variant="primary"
            className="px-5 py-2 text-sm font-semibold shadow focus:ring-offset-2 focus:ring-offset-slate-900"
            autoFocus
          >
            {t.acceptAll}
          </Button>
        </div>
      </div>
      <CookieSettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
};
