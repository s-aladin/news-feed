<template>
  <div class="filter">
    <div class="filter__buttons">
      <button
          class="filter_button"
          @click="setAllSourcesActive"
      >
        <span class="filter_button_text">Все</span>
      </button>
      <button
          @click="toggleSource('interfax.ru')"
          :class="['filter_button', { active: newsStore.activeSources.includes('interfax.ru') }]"
      >
        <span class="filter_button_text">Interfax.ru</span>
      </button>
      <button
          @click="toggleSource('mos.ru')"
          :class="['filter_button', { active: newsStore.activeSources.includes('mos.ru') }]"
      >
        <span class="filter_button_text">Mos.ru</span>
      </button>
    </div>
    <div class="layout__buttons">
      <button
          @click="setLayout('list')"
          :class="['layout_button', { active: currentLayout === 'list' }]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="18" height="8" fill="currentColor"/>
          <rect y="10" width="18" height="8" fill="currentColor"/>
        </svg>
      </button>
      <button
          @click="setLayout('grid')"
          :class="['layout_button', { active: currentLayout === 'grid' }]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="8" fill="currentColor"/>
          <rect y="10" width="8" height="8" fill="currentColor"/>
          <rect x="10" width="8" height="8" fill="currentColor"/>
          <rect x="10" y="10" width="8" height="8" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const newsStore = useNewsStore()
const layoutStore = useLayoutStore()

const currentLayout = computed(() => layoutStore.layout)
const toggleSource = (source: string) => {
  newsStore.toggleSource(source)
}

const setAllSourcesActive = () => {
  newsStore.activeSources = ['mos.ru', 'interfax.ru']
}

const setLayout = (layout: 'list' | 'grid') => {
  layoutStore.setLayout(layout)
}
</script>

<style scoped>
  .filter {
    display: flex;
    justify-content: space-between;
    padding: 26px 0 28px 0;
  }

  .filter__buttons {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .filter_button,
  .layout_button {
    background-color: inherit;
    padding: 0;
    border: none;
  }

  .layout_button {
    color: #C4C4C4;
  }

  .layout_button.active {
    color: #0029FF;
  }

  .filter_button_text {
    font-size: 14px;
    font-weight: 700;
    line-height: 100%;
    letter-spacing: 0;
  }

  .layout__buttons {
    display: flex;
    gap: 10px;
  }
</style>