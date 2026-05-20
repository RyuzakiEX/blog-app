<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <div class="flex flex-col min-h-screen relative">
    <!-- Fixed ambient background — stays in place while content scrolls -->
    <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="page-grid absolute inset-0" />
      <!-- Top-center glow (main light source) -->
      <div class="absolute -top-52 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      <!-- Right-side accent -->
      <div class="absolute top-1/3 -right-24 w-96 h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <!-- Bottom-left ambient -->
      <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
    </div>
    <RHeader />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-default mt-auto">
      <UContainer class="py-5">
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted"
        >
          <p>© {{ year }} Jorge Adanza. All rights reserved.</p>
          <div class="flex items-center gap-1">
            <UIcon name="i-lucide-heart" class="size-3.5 text-primary" />
            <span>Built with Nuxt</span>
          </div>
        </div>
      </UContainer>
    </footer>
  </div>
</template>
