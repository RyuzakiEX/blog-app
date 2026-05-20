<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();
const slug = String(route.params.slug);

const { data: post, pending } = await useAsyncData(
  "post-" + slug + "-" + locale.value,
  async () => {
    const collection = ("blog_" + locale.value) as keyof Collections;
    const contentPath = locale.value === "de" ? `/de/${slug}` : `/${slug}`;

    let content = await queryCollection(collection).path(contentPath).first();

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

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { label: "Home", icon: "i-lucide-home", to: "/" },
  { label: post.value?.title || "Post", to: route.path },
]);

// SEO Meta
useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
});
</script>

<template>
  <UContainer class="py-8 lg:py-16">
    <!-- Loading Skeleton -->
    <div v-if="pending" class="max-w-4xl mx-auto space-y-5">
      <USkeleton class="h-5 w-48" />
      <USkeleton class="h-10 w-3/4" />
      <USkeleton class="h-5 w-1/2" />
      <div class="flex items-center gap-3">
        <USkeleton class="size-8 rounded-full" />
        <USkeleton class="h-4 w-32" />
      </div>
      <USkeleton class="h-64 w-full rounded-xl" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-5/6" />
      <USkeleton class="h-4 w-4/5" />
    </div>

    <!-- Blog Post Content -->
    <article v-else-if="post" class="max-w-4xl mx-auto">
      <!-- Breadcrumbs -->
      <UBreadcrumb :items="breadcrumbItems" class="mb-8" />

      <!-- Header -->
      <header class="mb-10">
        <!-- Tags -->
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mb-5">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            variant="soft"
            color="primary"
            size="sm"
          >
            {{ tag }}
          </UBadge>
        </div>

        <!-- Title -->
        <h1
          class="text-4xl lg:text-5xl font-bold mb-4 text-pretty leading-tight"
        >
          {{ post.title }}
        </h1>

        <!-- Description -->
        <p v-if="post.description" class="text-xl text-muted mb-6 leading-relaxed">
          {{ post.description }}
        </p>

        <!-- Meta Information -->
        <div
          class="flex items-center gap-3 py-4 border-y border-default text-sm text-muted"
        >
          <UAvatar v-if="post.author" :alt="post.author" size="sm" />
          <span v-if="post.author" class="font-medium text-default">
            {{ post.author }}
          </span>
          <span v-if="post.author && post.date">·</span>
          <time
            v-if="post.date"
            :datetime="post.date"
            class="flex items-center gap-1.5"
          >
            <UIcon name="i-lucide-calendar" class="size-3.5" />
            {{
              new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </time>
        </div>
      </header>

      <!-- Cover Image -->
      <NuxtImg
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full rounded-xl mb-10 object-cover shadow-lg aspect-video"
        loading="lazy"
        sizes="sm:640px md:768px lg:1024px"
      />

      <!-- Main Content -->
      <ContentRenderer
        :value="post"
        class="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
      />

      <!-- Footer -->
      <footer class="mt-14 pt-8 border-t border-default flex items-center justify-between gap-4 flex-wrap">
        <UButton
          icon="i-lucide-arrow-left"
          to="/"
          color="neutral"
          variant="ghost"
          label="All Posts"
        />
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            variant="subtle"
            color="primary"
            size="sm"
          >
            {{ tag }}
          </UBadge>
        </div>
      </footer>
    </article>

    <!-- Error State -->
    <UEmpty
      v-else
      title="Post not found"
      description="The blog post you're looking for doesn't exist."
      icon="i-lucide-file-question"
    >
      <UButton to="/" label="Back to Blog" color="primary" />
    </UEmpty>
  </UContainer>
</template>
