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
    <div v-if="pending" class="max-w-4xl mx-auto space-y-4">
      <USkeleton class="h-8 w-3/4" />
      <USkeleton class="h-4 w-1/2" />
      <USkeleton class="h-64 w-full" />
      <USkeleton class="h-32 w-full" />
    </div>

    <!-- Blog Post Content -->
    <article v-else-if="post" class="max-w-4xl mx-auto">
      <!-- Breadcrumbs -->
      <UBreadcrumb :items="breadcrumbItems" class="mb-6" />

      <!-- Header -->
      <header class="mb-8">
        <!-- Title -->
        <h1 class="text-4xl lg:text-5xl font-bold mb-4 text-pretty">
          {{ post.title }}
        </h1>

        <!-- Description -->
        <p v-if="post.description" class="text-lg text-muted mb-6">
          {{ post.description }}
        </p>

        <!-- Meta Information -->
        <div class="flex items-center gap-4">
          <!-- Author with Avatar -->
          <UAvatar v-if="post.author" :alt="post.author" size="sm" />
          <div class="flex items-center gap-3 text-sm text-muted">
            <span v-if="post.author" class="font-medium text-default">
              {{ post.author }}
            </span>
            <span v-if="post.author && post.date">•</span>
            <time v-if="post.date" :datetime="post.date">
              {{
                new Date(post.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            </time>
          </div>
        </div>
      </header>

      <!-- Cover Image -->
      <NuxtImg
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full rounded-lg mb-8 object-cover shadow-lg"
        loading="lazy"
        sizes="sm:640px md:768px lg:1024px"
      />

      <!-- Main Content -->
      <ContentRenderer
        :value="post"
        class="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
      />

      <!-- Tags Section -->
      <footer
        v-if="post.tags?.length"
        class="mt-12 pt-8 border-t border-default"
      >
        <h3 class="text-sm font-semibold text-muted mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            variant="subtle"
            color="primary"
            size="md"
            :to="`/blog/tags/${tag}`"
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
      <UButton to="/blog" label="Back to Blog" color="primary" />
    </UEmpty>
  </UContainer>
</template>
