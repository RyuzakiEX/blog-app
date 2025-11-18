export default defineAppConfig({
  ui: {
    colors: {
      primary: "cyan", // Or any Tailwind color like 'blue', 'indigo', etc.
      gray: "cool", // Or any Tailwind gray variant like 'slate', 'neutral', etc.
    },
    container: {
      base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 !py-5",
    },
  },
});
