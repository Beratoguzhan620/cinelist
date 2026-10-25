import type { ConfigContext, ExpoConfig } from "expo/config";

// EXPO_BASE_URL serves the web build from a sub-path, e.g. /cinelist on GitHub Pages.
export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_BASE_URL;
  return {
    ...config,
    name: config.name ?? "CineList",
    slug: config.slug ?? "cinelist",
    ...(baseUrl ? { experiments: { ...config.experiments, baseUrl } } : {}),
  };
};
