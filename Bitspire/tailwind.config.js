/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{mdx}",
    "./tina/**/*.{js,ts,jsx,tsx}",
  ],
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
      borderRadius: {
        'sm': '0.125rem',  // 2px
        'md': '0.25rem',   // 4px
        'lg': '0.375rem',  // 6px
        'xl': '0.5rem',    // 8px
        '2xl': '0.75rem',  // 12px
        '3xl': '1rem',     // 16px
        '4xl': '1.5rem',   // 24px
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
      animation: {
        "gradient-x": "gradient-x 3s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
    },
  },
};
