<template>
  <div class="container">
    <NewsHeader/>
    <NewsFilter/>
    <NewsFeed/>
  </div>
</template>

<script setup lang="ts">
const newsStore = useNewsStore()
const route = useRoute()

onMounted(() => {
  newsStore.loadSourcesFromQuery()

  if (newsStore.items.length === 0) {
    newsStore.fetchNews()
  }
})

watch(() => route.query, () => {
  newsStore.loadSourcesFromQuery()
})
</script>

<style scoped>

</style>
