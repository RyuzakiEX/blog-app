<script setup lang="ts">
const { locale, t } = useI18n();
const page = ref(1);
const pageSize = 6;

const collectionName = computed(() =>
  locale.value === "de" ? "blog_de" : "blog_en"
);

const { data: posts } = await useAsyncData(
  () => `blog-posts-${locale.value}`,
  async () => {
    return await queryCollection(collectionName.value as any)
      .order("date", "DESC")
      .all();
  },
  {
    watch: [locale],
  }
);

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

  // English = default → no prefix
  if (locale.value === "en") {
    return cleanPath;
  }

  // Other languages → prefix only once
  return `/${locale.value}${cleanPath}`;
};
</script>

<template>
  <UContainer>
    <!-- Hero Section -->
    <UPageHero
      :title="t('home.title')"
      :description="t('home.subtitle')"
      :links="[
        {
          label: t('home.heroButton'),
          color: 'primary',
          size: 'xl',
          to: '#posts',
        },
      ]"
    />
    <USeparator class="pb-10" />

    <!-- Blog Posts Grid -->
    <UPageGrid>
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
        variant="outline"
      />
    </UPageGrid>

    <!-- Pagination Controls -->
    <div class="flex justify-center my-8">
      <UPagination
        v-model:page="page"
        :items-per-page="pageSize"
        :total="posts?.length || 0"
      />
    </div>
  </UContainer>
</template>
