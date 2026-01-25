"use client";

import React from "react";

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => {
        const evt = new CustomEvent("open-cookie-settings");
        window.dispatchEvent(evt);
      }}
      className="text-gray-400 hover:text-white transition-colors underline decoration-dotted underline-offset-4"
      type="button"
    >
      {label}
    </button>
  );
}
