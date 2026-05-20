<script setup lang="ts">
const { locale, setLocale } = useI18n();

const languages = computed(() => [
  [
    {
      label: "English",
      icon: "i-flag-us-1x1",
      onSelect: () => setLocale("en"),
    },
    {
      label: "Deutsch",
      icon: "i-flag-de-1x1",
      onSelect: () => setLocale("de"),
    },
  ],
]);

const currentLocale = computed(() => {
  if (locale.value === "de") {
    return { label: "Deutsch", icon: "i-flag-de-1x1" };
  }
  return { label: "English", icon: "i-flag-us-1x1" };
});

const homeLink = computed(() => {
  return locale.value === "en" ? "/" : `/${locale.value}`;
});
</script>

<template>
  <UHeader
    :toggle="false"
    :ui="{
      container: 'w-full! max-w-full! px-5! lg:px-10! mx-0!',
      right: 'mx-0! px-0!',
    }"
  >
    <template #left>
      <NuxtLink :to="homeLink" class="flex items-center gap-3 group">
        <NuxtImg
          src="/logo.png"
          alt="Logo"
          width="36"
          height="36"
          class="rounded-lg"
        />
        <div class="hidden sm:flex flex-col leading-tight">
          <span
            class="font-bold text-sm text-highlighted tracking-tight group-hover:text-primary transition-colors duration-200"
          >
            Jorge Adanza
          </span>
          <span class="text-xs text-muted">Tech Blog</span>
        </div>
      </NuxtLink>
    </template>

    <template #right>
      <UDropdownMenu :items="languages">
        <UButton
          :icon="currentLocale.icon"
          trailing-icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          :aria-label="`Select language - Current: ${currentLocale.label}`"
        />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
