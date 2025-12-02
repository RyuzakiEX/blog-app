export default defineAppConfig({
  ui: {
    colors: {
      primary: "cyan",
      gray: "cool",
    },
    container: {
      base: "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 !py-5",
    },
    blogPost: {
      slots: {
        root: "transition-all duration-300 hover:ring-2 hover:ring-primary hover:shadow-lg hover:scale-[1.02] hover:border-primary",
      },
    },
  },
});
