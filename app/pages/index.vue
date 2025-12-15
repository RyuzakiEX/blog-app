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

const { data: posts } = await useAsyncData(
  `blog-posts-${locale.value}`,
  async () => {
    try {
      return await queryCollection(collectionName.value as any)
        .order("date", "DESC")
        .all();
    } catch (e) {
      console.error("Failed to fetch posts:", e);
      return [];
    }
  },
  {
    watch: [locale],
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

// Calculate paginated posts (without search filter for main grid)
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

  // English = default → no prefix
  if (locale.value === "en") {
    return cleanPath;
  }

  // Other languages → prefix only once
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
  <UContainer>
    <UPageHero
      :title="t('home.title')"
      :description="t('home.subtitle')"
      :headline="t('home.latestPosts')"
      class="relative"
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

    <USeparator />

    <div class="relative py-8">
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
      />
    </div>

    <UPageGrid v-if="paginatedPosts.length > 0">
      <UBlogPost
        v-for="post in paginatedPosts"
        :key="post._id"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :image="post.image"
        :to="localizedPath(post)"
        :authors="[
          {
            name: post.author,
          },
        ]"
        variant="subtle"
        class="hover:shadow-lg transition-shadow duration-300"
      />
    </UPageGrid>

    <!-- Enhanced No posts message -->
    <div v-else class="text-center py-20">
      <div
        class="inline-flex items-center justify-center size-20 rounded-full bg-elevated/50 ring ring-default mb-6"
      >
        <UIcon name="i-lucide-file-x" class="size-10 text-muted" />
      </div>
      <p class="text-xl font-semibold text-highlighted mb-2">
        No posts available
      </p>
      <p class="text-muted">Check back soon for new content</p>
    </div>

    <!-- Pagination -->
    <div
      v-if="posts && posts.length > pageSize"
      class="flex justify-center my-12"
    >
      <UPagination
        v-model:page="page"
        :items-per-page="pageSize"
        :total="posts?.length || 0"
      />
    </div>

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
  </UContainer>
</template>
