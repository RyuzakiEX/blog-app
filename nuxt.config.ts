// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxthub/core",
    "nuxt-studio",
  ],
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "de",
        name: "Deutsch",
        file: "de.json",
      },
    ],
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
  },
  studio: {
    route: "/admin",
    repository: {
      provider: "github",
      owner: "RyuzakiEX",
      repo: "blog-app",
      branch: "main",
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
  },
});
