<template>
    <header class="header">
      <div class="header__title_container">
        <h1 class="title header__title">Список новостей</h1>
        <button
            @click="refreshNewsAndResetFilters"
            class="header__button"
            :disabled="newsStore.loading"
        >
          <img src="~/assets/images/refresh.svg" alt="Обновить">
        </button>
      </div>
      <div class="search_container">
        <input
            type="text"
            class="search_input"
            v-model="searchQuery"
            @input="handleSearchInput"
        >
        <img src="~/assets/images/search.svg" alt="Поиск" class="search_icon">
      </div>
    </header>
</template>

<script setup lang="ts">
const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.search?.toString() || '')

let searchTimeout: NodeJS.Timeout
const handleSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(updateSearchQuery, 500)
}

const updateSearchQuery = () => {
  const query = { ...route.query }

  if (searchQuery.value.trim()) {
    query.search = searchQuery.value.trim()
  } else {
    delete query.search
  }

  delete query.page

  router.replace({ query })
}

const refreshNewsAndResetFilters = () => {
  newsStore.fetchNews()
  searchQuery.value = ''

  newsStore.activeSources = ['mos.ru', 'interfax.ru']

  router.replace({ query: {} })
}

watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch?.toString() || ''
})
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  padding: 36px 0;
  border-bottom: 1px solid #E5E5E5;
}

.header__button {
  width: 40px;
  height: 40px;
  margin-left: 30px;
  background-color: #FFFFFF;
  border: none;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.header__button:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header__title_container {
  display: flex;
}

.search_container {
  position: relative;
  width: 321px;
  height: 40px;
}

.search_input {
  width: 100%;
  height: 100%;
  padding: 0 40px 0 12px;
  border: 1px solid #fff;
  border-radius: 3px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.05);
  font-size: 14px;
  outline: none;
}

.search_input:focus {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.search_icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

@media (max-width: 770px) {
  .header {
    flex-wrap: wrap;
    gap: 23px;
  }

  .header__title_container {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .header__title {
    font-size: 24px;
  }

  .search_container {
    width: 100%;
  }
}
</style>