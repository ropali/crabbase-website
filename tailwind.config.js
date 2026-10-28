/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./docs.html", "./docs-*.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        outline: "#8e706b",
        "tertiary-container": "#717377",
        secondary: "#b4281c",
        "primary-fixed-dim": "#ffb4a6",
        tertiary: "#595a5f",
        "secondary-fixed": "#ffdad5",
        "surface-container": "#ffe9e5",
        "primary-container": "#ce412b",
        "on-surface-variant": "#5a413c",
        "on-tertiary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        background: "#fff8f6",
        "on-secondary": "#ffffff",
        primary: "#ab2815",
        "surface-container-highest": "#f7ddd8",
        "on-primary-fixed-variant": "#8f1202",
        "tertiary-fixed-dim": "#c6c6cb",
        "on-primary-fixed": "#3f0300",
        "on-error": "#ffffff",
        "surface-container-low": "#fff0ee",
        "primary-fixed": "#ffdad4",
        "on-surface": "#261816",
        "error-container": "#ffdad6",
        "on-primary-container": "#fff8f7",
        "secondary-fixed-dim": "#ffb4a8",
        "on-primary": "#ffffff",
        error: "#ba1a1a",
        "on-tertiary-fixed": "#1a1c1f",
        "on-secondary-container": "#610001",
        "on-error-container": "#93000a",
        "outline-variant": "#e2bfb8",
        "secondary-container": "#fe5d4a",
        "on-background": "#261816",
        "surface-bright": "#fff8f6",
        "inverse-on-surface": "#ffede9",
        surface: "#fff8f6",
        "inverse-primary": "#ffb4a6",
        "surface-container-high": "#fde2dd",
        "on-tertiary-fixed-variant": "#45474b",
        "on-secondary-fixed-variant": "#910906",
        "tertiary-fixed": "#e2e2e7",
        "on-secondary-fixed": "#410000",
        "surface-tint": "#b12c19",
        "on-tertiary-container": "#faf9ff",
        "surface-variant": "#f7ddd8",
        "inverse-surface": "#3c2d2a",
        "surface-dim": "#eed4d0"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "9999px"
      },
      spacing: {
        drawer_width: "480px",
        cell_padding_v: "10px",
        margin_page: "1.5rem",
        gutter: "1rem",
        cell_padding_h: "12px",
        sidebar_width: "240px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "code-md": ["JetBrains Mono", "monospace"],
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "label-xs": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "code-md": ["13px", { lineHeight: "18px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "label-xs": ["11px", { lineHeight: "16px", fontWeight: "600" }],
        "body-sm": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "headline-lg": ["28px", { lineHeight: "36px", fontWeight: "700" }]
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
      }
    }
  },
  plugins: []
};
