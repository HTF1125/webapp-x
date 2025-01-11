import { nextui } from "@nextui-org/react";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js configuration options
  // For example:
  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextui({
  ...nextConfig,
  // NextUI configuration
  nextui: {
    layout: {
      dividerWeight: "1px",
      disabledOpacity: 0.5,
      fontSize: {
        tiny: "0.75rem",
        small: "0.875rem",
        medium: "1rem",
        large: "1.125rem",
      },
      lineHeight: {
        tiny: "1rem",
        small: "1.25rem",
        medium: "1.5rem",
        large: "1.75rem",
      },
      radius: {
        small: "8px",
        medium: "12px",
        large: "14px",
      },
      borderWidth: {
        small: "1px",
        medium: "2px",
        large: "3px",
      },
    },
    themes: {
      light: {
        layout: {
          hoverOpacity: 0.8,
          boxShadow: {
            small:
              "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
            medium:
              "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
            large:
              "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12)",
          },
        },
      },
      dark: {
        layout: {
          hoverOpacity: 0.9,
          boxShadow: {
            small: "rgba(255,255,255, .15)",
            medium: "rgba(255,255,255, .15)",
            large: "rgba(255,255,255, .15)",
          },
        },
      },
    },
  },
});
