<script setup lang="ts">
const { locale, t } = useI18n();

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

// FIX: dynamic localized path
const localizedPath = (post: any) => {
  let cleanPath = post.path;

  // Remove ANY existing locale prefix (/en, /de, /fr...)
  cleanPath = cleanPath.replace(/^\/(en|de|fr)(\/|$)/, "/");

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
    <div id="posts">
      <UPageGrid>
        <UBlogPost
          v-for="post in posts"
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
    </div>
  </UContainer>
</template>
