<template>
  <div>
    <div v-if="newsStore.loading" class="loading">
      Загрузка новостей...
    </div>

    <div v-if="newsStore.error" class="error">
      Ошибка загрузки: {{ newsStore.error }}
    </div>

    <div v-if="newsStore.filteredItems.length > 0" class="news__list">
      <div v-for="item in newsStore.filteredItems" :key="item.link + item.source" class="news__item">
        <div class="item__content">
          <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="item_image"
              loading="lazy"
          />
          <div class="item__description">
            <h3 class="item_title subtitle">
              <a :href="item.link" target="_blank" rel="noopener noreferrer">
                {{ item.title }}
              </a>
            </h3>
            <div class="text_wrapper">
              <p
                  class="item_text text"
                  v-html="formatText(item.description)"

              ></p>
            </div>
          </div>
        </div>
        <div class="item__footer">
          <div class="item_source link link-gray">{{ item.source }}</div>
          <p class="item_date date">{{ formatDate(item.pubDate) }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="!newsStore.loading && !newsStore.error" class="no-news">
      Нет новостей для отображения
    </div>
  </div>
</template>

<script setup lang="ts">
const newsStore = useNewsStore()

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
}

const formatText = (text: string) => {
  const sliced = text.slice(0, 120);

  return sliced.slice(0, sliced.lastIndexOf('.') + 1) || sliced.slice(0, sliced.lastIndexOf(' ')) + '...'
}

onMounted(() => {
  if (newsStore.items.length === 0) {
    newsStore.fetchNews()
  }
})
</script>

<style scoped>
.news__item {
  max-width: 1060px;
  max-height: 189px;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  background-color: #FFFFFF;
  box-shadow: 0 2px 10px 0 #0000000D;
}

.item__content {
  max-height: 100%;
  display: flex;
  gap: 30px;
  padding: 30px;
}

.item__description {
  max-width: 772px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-overflow: ellipsis;
}

.item_image {
  max-width: 200px;
  max-height: 100px;
  width: 100%;
}

.text_wrapper {
  max-width: 772px;
  max-height: 40px;
  text-overflow: ellipsis;
}

.item_text {
  display: inline-block;
  max-width: 772px;
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item__footer {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  background-color: #FCFCFC;
}
</style>