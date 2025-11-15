<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();
const slug = String(route.params.slug);

const { data: post } = await useAsyncData(
  "post-" + slug,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;

    // Construct the correct path based on locale
    const contentPath = locale.value === "de" ? `/de/${slug}` : `/${slug}`;

    let content = await queryCollection(collection).path(contentPath).first();

    // Fallback to English (default) if content is missing in German
    if (!content && locale.value === "de") {
      content = await queryCollection("blog_en" as keyof Collections)
        .path(`/${slug}`)
        .first();
    }

    return content;
  },
  {
    watch: [locale],
  }
);

useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <UContainer v-if="post" class="py-8 lg:py-16">
    <article class="max-w-4xl mx-auto">
      <!-- Title - Middle aligned -->
      <header class="text-center mb-8">
        <h1 class="text-4xl lg:text-5xl font-bold mb-4">
          {{ post.title }}
        </h1>

        <!-- Author and Date -->
        <div class="flex items-center justify-center gap-4 text-muted">
          <span class="font-medium">{{ post.author }}</span>
          <span>•</span>
          <time :datetime="post.date">
            {{
              new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </time>
        </div>
      </header>

      <!-- Cover Image using NuxtImg -->
      <NuxtImg
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full rounded-lg mb-8 aspect-video object-cover"
        width="1200"
        height="675"
        loading="lazy"
      />

      <!-- Content -->
      <ContentRenderer
        :value="post"
        class="prose prose-lg dark:prose-invert max-w-none"
      />

      <!-- Tags -->
      <footer
        v-if="post.tags?.length"
        class="mt-12 pt-8 border-t border-default"
      >
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            variant="subtle"
            color="neutral"
          >
            {{ tag }}
          </UBadge>
        </div>
      </footer>
    </article>
  </UContainer>
</template>
