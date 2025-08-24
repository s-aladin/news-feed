<template>
  <div>
    <div v-if="newsStore.loading" class="loading">
      Загрузка новостей...
    </div>

    <div v-if="newsStore.error" class="error">
      Ошибка загрузки: {{ newsStore.error }}
    </div>

    <div
        v-if="newsStore.filteredItems.length > 0"
        :class="['news__list', layoutStore.layout]"
    >
      <div
          v-for="item in paginatedItems"
          :key="item.link + item.source"
          :class="['news__item', layoutStore.layout]"
      >
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
              <p
                  class="item_text text"
                  v-html="formatText(item.description)"
              ></p>
          </div>
          <a
              class="link link-blue"
              :href="item.link"
              target="_blank"
              rel="noopener noreferrer"
          >
            Подробнее</a>
        </div>
        <div class="item__footer">
          <a
              :href="goToSourceHomePage(item.source)"
              class="item_source link link-gray"
              target="_blank"
          >{{ item.source }}</a>
          <p class="item_date date">{{ formatDate(item.pubDate) }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="!newsStore.loading && !newsStore.error" class="no-news">
      Нет новостей для отображения
    </div>
    <Pagination
        v-if="newsStore.filteredItems.length > 0"
        :current-page="currentPage"
        :total-items="newsStore.filteredItems.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
const newsStore = useNewsStore()
const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()

const itemsPerPage = 4
const currentPage = computed(() => {
  const page = parseInt(route.query.page as string) || 1
  return Math.max(1, page)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return newsStore.filteredItems.slice(start, end)
})

const handlePageChange = (page: number) => {
  const query = { ...route.query, page }
  router.replace({ query })
}

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

const goToSourceHomePage = (source: string) => {
  return source === 'mos.ru' ? 'https://mos.ru' : 'https://interfax.ru'
}

onMounted(() => {
  layoutStore.loadLayoutFromStorage()
  if (newsStore.items.length === 0) {
    newsStore.fetchNews()
  }
})
</script>

<style scoped>
.news__list.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news__list.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.news__item {
  width: 100%;
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 3px;
  box-shadow: 0 1px 10px 0 #0000000D;
}

.news__item:hover {
  box-shadow: 0 2px 10px 0 #0000000D;
}

.news__item.list {
  max-width: 1060px;
  max-height: 189px;
}

.news__item.grid {
  max-width: 520px;
  max-height: 256px;
}

.item__content {
  max-height: 100%;
  display: flex;
}

.news__item.list .item__content {
  gap: 30px;
  padding: 30px;
}

.news__item.grid .item__content {
  padding: 30px 30px 0 30px;
  flex-direction: column;
  gap: 20px;
}

.item__description {
  display: flex;
  flex-direction: column;
}

.news__item.list .item__description {
  max-width: 772px;
  gap: 20px;
}

.news__item.grid .item__description {
  max-width: 520px;
  height: 120px;
  justify-content: space-between;
}

.news__item.list .item_image {
  max-width: 200px;
  max-height: 100px;
  width: 100%;
}

.news__item.grid .item_image {
  display: none;
}

.news__item.list .link-blue {
  display: none;
}

.item__footer {
  display: flex;
  justify-content: space-between;
}

.news__item.list .item__footer {
  padding: 0 30px;
  background-color: #FCFCFC;
}

.news__item.grid .item__footer {
  padding: 16px 30px;
}

@media (max-width: 770px) {
  .news__item.list {
    max-height: 500px;
  }

  .news__item.grid {
    max-height: 300px;
  }

  .news__item.grid .item__description {
    max-width: 520px;
    height: max-content;
    max-height: 200px;
    justify-content: space-between;
    gap: 20px;
  }
}

@media (max-width: 550px) {
  .news__item.list .item__content {
    max-height: 480px;
    flex-direction: column;
    gap: 20px;
    padding: 20px 22px;
  }

  .news__item.grid .item__content {
    padding: 30px 20px 15px 20px;
  }

  .news__item.list .item_image {
    max-width: 400px;
    max-height: 200px;
  }

  .news__item.list .link-blue {
    display: block;
  }

  .news__item.list .item__footer {
    padding: 5px 20px;
  }

  .news__item.grid .item__footer {
    padding: 5px 20px;
    background-color: #FCFCFC;
  }
}

@media (max-width: 425px) {
  .news__item.list .item_image {
    max-width: 338px;
    max-height: 166px;
  }

}
</style>