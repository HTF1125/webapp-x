import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}", // Include NextUI theme files
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Chart colors
        chartPositive: "rgba(0, 204, 102, 0.8)",
        chartNegative: "rgba(204, 0, 0, 0.8)",
        chartPositiveGradientStart: "rgba(0, 204, 102, 0.8)",
        chartPositiveGradientEnd: "rgba(0, 102, 204, 0.8)",
        chartNegativeGradientStart: "rgba(204, 0, 0, 0.8)",
        chartNegativeGradientEnd: "rgba(255, 51, 51, 0.8)",
        chartXAxisTick: "#bbb",
        chartYAxisTick: "#fff",
        chartGrid: "#444",
        chartTooltipBackground: "rgba(0, 0, 0, 0.8)",
        chartTooltipTitle: "#fff",
        chartTooltipBody: "#fff",
        chartTooltipBorder: "#666",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF", // Light theme background color
            foreground: "#000000", // Light theme foreground color
            primary: {
              DEFAULT: "#006FEE", // Primary color for light theme
              foreground: "#FFFFFF", // Foreground color for primary in light theme
            },
            secondary: {
              DEFAULT: "#338ef7", // Secondary color for light theme
              foreground: "#FFFFFF", // Foreground color for secondary in light theme
            },
            default: {
              DEFAULT: "#CCCCCC", // Default color for light theme
              foreground: "#000000", // Foreground color for default in light theme
            },
          },
        },
        dark: {
          colors: {
            background: "#001731", // Dark theme background color
            foreground: "#FFFFFF", // Dark theme foreground color
            primary: {
              DEFAULT: "#005bc4", // Primary color for dark theme
              foreground: "#FFFFFF", // Foreground color for primary in dark theme
            },
            secondary: {
              DEFAULT: "#004493", // Secondary color for dark theme
              foreground: "#FFFFFF", // Foreground color for secondary in dark theme
            },
            default: {
              DEFAULT: "#CCCCCC", // Default color for dark theme
              foreground: "#000000", // Foreground color for default in dark theme
            },
          },
        },
      },
    }),
  ],
};

export default config;
