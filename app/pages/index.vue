<script setup lang="ts">
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryCollection("blog").order("date", "DESC").all()
);
</script>

<template>
  <UContainer>
    <div class="py-12">
      <!-- Header Section -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4">Blog</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Explore our latest articles and insights
        </p>
      </div>

      <!-- Blog Posts Grid -->
      <UPageGrid>
        <UBlogPost
          v-for="post in posts"
          :key="post._id"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :image="post.image"
          :to="post.path"
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
