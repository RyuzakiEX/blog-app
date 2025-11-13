// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxthub/core",
    "nuxt-studio",
  ],
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
