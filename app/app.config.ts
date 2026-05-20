export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      gray: "zinc",
    },
    container: {
      base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 !py-5",
    },
    blogPost: {
      slots: {
        root: "transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-xl hover:scale-[1.02] hover:border-primary",
      },
    },
  },
});
