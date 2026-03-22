import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#5B4FCF",
          secondary: "#0F6E56",
          foreground: "#FFFFFF"
        },
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
        ring: "hsl(240 5.9% 10%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
        primary: {
          DEFAULT: "#5B4FCF",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#0F6E56",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 3.8% 46.1%)"
        },
        accent: {
          DEFAULT: "hsl(240 4.8% 95.9%)",
          foreground: "hsl(240 5.9% 10%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(240 10% 3.9%)"
        }
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem"
      }
    }
  },
  plugins: []
};

export default config;
