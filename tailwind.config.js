// import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Link custom property to Tailwind color utility
        foreground: "var(--foreground)", // Link custom property to Tailwind color utility
      },
      backgroundColor: {
        background: "var(--background)", // Ensure bg-background works
      },
      textColor: {
        foreground: "var(--foreground)", // Ensure text-foreground works
      },
    },
  },
  plugins: [],
};
