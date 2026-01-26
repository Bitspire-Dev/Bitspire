/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
      },
    },
    extend: {
      colors: {
        "brand-bg": "#020617",
        "brand-fg": "#f8fafc",
        "brand-accent": "#ec4899",
        "brand-accent-2": "#9333ea",
        "brand-surface": "#0f172a",
        "brand-surface-2": "#1e293b",
        "brand-border": "#334155",
        "brand-text-soft": "#e2e8f0",
        "brand-text-muted": "#cbd5e1",
        "brand-text-muted-2": "#94a3b8",
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
    },
  },
};
