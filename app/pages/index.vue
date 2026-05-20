<script setup lang="ts">
import type { CommandPaletteItem } from "@nuxt/ui";

const { locale, t } = useI18n();
const page = ref(1);
const pageSize = 6;
const searchModalOpen = ref(false);
const searchTerm = ref("");
const collectionName = computed(() =>
  locale.value === "de" ? "blog_de" : "blog_en"
);

const { data: posts, pending } = await useAsyncData(
  `blog-posts-${locale.value}`,
  () =>
    queryCollection(collectionName.value as any)
      .order("date", "DESC")
      .all(),
  {
    server: false,
  }
);

// Transform posts into CommandPalette items
const searchGroups = computed(() => {
  if (!posts.value?.length) return [];

  return [
    {
      id: "posts",
      label: t("home.searchResults") || "Blog Posts",
      items: posts.value.map(
        (post): CommandPaletteItem => ({
          id: post._id,
          label: post.title,
          suffix: post.description,
          icon: "i-lucide-file-text",
          to: localizedPath(post),
          onClick: () => {
            searchModalOpen.value = false;
            searchTerm.value = "";
          },
        })
      ),
    },
  ];
});

// Calculate paginated posts
const paginatedPosts = computed(() => {
  const start = (page.value - 1) * pageSize;
  const end = start + pageSize;
  return posts.value?.slice(start, end) || [];
});

// Dynamic localized path
const localizedPath = (post: any) => {
  let cleanPath = post.path;

  // Remove ANY existing locale prefix from the path
  cleanPath = cleanPath.replace(/^\/(en|de)(\/|$)/, "/");

  if (locale.value === "en") {
    return cleanPath;
  }

  return `/${locale.value}${cleanPath}`;
};

// Keyboard shortcut to open search
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      searchModalOpen.value = true;
    },
  },
});
</script>

<template>
  <!-- Full-width hero section with background decoration -->
  <div class="relative overflow-hidden">
    <div class="hero-grid absolute inset-0 pointer-events-none" />
    <div
      class="absolute -top-24 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
    />
    <div
      class="absolute -bottom-24 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
    />

    <UContainer>
      <UPageHero
        :title="t('home.title')"
        :description="t('home.subtitle')"
        :headline="t('home.latestPosts')"
      >
        <template #links>
          <UButton
            icon="i-lucide-search"
            :label="t('home.searchButton') || 'Search posts...'"
            color="primary"
            variant="solid"
            size="xl"
            @click="searchModalOpen = true"
          >
            <template #trailing>
              <div class="hidden lg:flex items-center gap-0.5">
                <UKbd value="meta" />
                <UKbd value="K" />
              </div>
            </template>
          </UButton>
        </template>

        <template #headline>
          <UBadge
            color="primary"
            variant="soft"
            size="lg"
            icon="i-lucide-sparkles"
          >
            {{ t("home.latestPosts") }}
          </UBadge>
        </template>
      </UPageHero>
    </UContainer>
  </div>

  <UContainer>
    <USeparator />

    <div class="py-10">
      <!-- Loading skeleton grid -->
      <UPageGrid v-if="pending">
        <div
          v-for="i in 6"
          :key="i"
          class="flex flex-col gap-3 rounded-xl border border-default p-4 bg-elevated/30"
        >
          <USkeleton class="h-44 w-full rounded-lg" />
          <USkeleton class="h-4 w-2/3" />
          <USkeleton class="h-3 w-full" />
          <USkeleton class="h-3 w-4/5" />
          <div class="flex items-center gap-2 mt-1">
            <USkeleton class="size-6 rounded-full" />
            <USkeleton class="h-3 w-24" />
          </div>
        </div>
      </UPageGrid>

      <!-- Blog post grid -->
      <UPageGrid v-else-if="paginatedPosts.length > 0">
        <UBlogPost
          v-for="post in paginatedPosts"
          :key="post._id"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :image="post.image"
          :to="localizedPath(post)"
          :authors="[{ name: post.author }]"
          variant="subtle"
          class="hover:shadow-lg transition-shadow duration-300"
        />
      </UPageGrid>

      <!-- Empty state -->
      <div v-else class="flex flex-col items-center py-24 gap-4 text-center">
        <div
          class="inline-flex items-center justify-center size-20 rounded-full bg-elevated/50 ring ring-default"
        >
          <UIcon name="i-lucide-file-x" class="size-10 text-muted" />
        </div>
        <p class="text-xl font-semibold text-highlighted">No posts available</p>
        <p class="text-muted">Check back soon for new content</p>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="posts && posts.length > pageSize"
      class="flex justify-center mb-12"
    >
      <UPagination
        v-model:page="page"
        :items-per-page="pageSize"
        :total="posts?.length || 0"
      />
    </div>
  </UContainer>

  <!-- Search Modal -->
  <UModal v-model:open="searchModalOpen">
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :groups="searchGroups"
        :placeholder="t('home.searchPlaceholder') || 'Search blog posts...'"
        :fuse="{
          fuseOptions: {
            keys: ['label', 'suffix'],
            threshold: 0.3,
          },
          resultLimit: 20,
        }"
        close
        class="h-96"
        @update:open="searchModalOpen = $event"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12">
            <div
              class="inline-flex items-center justify-center size-16 rounded-full bg-elevated/50 ring ring-default mb-4"
            >
              <UIcon name="i-lucide-search-x" class="size-8 text-muted" />
            </div>
            <p class="text-base font-semibold text-highlighted mb-1">
              No posts found
            </p>
            <p class="text-sm text-muted">Try a different search term</p>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>
