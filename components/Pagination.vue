<template>
  <div class="pagination">
    <button
        @click="goToPage(1)"
        :class="['pagination_button', 'pagination_number numbers', { active: currentPage === 1 }]"
    >
      1
    </button>

    <span v-if="showFirstEllipsis" class="pagination_ellipsis numbers">...</span>

    <button
        v-for="page in middlePages"
        :key="page"
        @click="goToPage(page)"
        :class="['pagination_button', 'pagination_number numbers', { active: page === currentPage }]"
    >
      {{ page }}
    </button>

    <span v-if="showLastEllipsis" class="pagination_ellipsis numbers">...</span>

    <button
        v-if="totalPages > 1"
        @click="goToPage(totalPages)"
        :class="['pagination_button', 'pagination_number numbers', { active: currentPage === totalPages }]"
    >
      {{ totalPages }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const middlePages = computed(() => {
  if (totalPages.value <= 2) return []

  let start = Math.max(2, props.currentPage - 1)
  let end = Math.min(totalPages.value - 1, props.currentPage + 1)

  if (props.currentPage <= 3) {
    start = 2
    end = Math.min(4, totalPages.value - 1)
  } else if (props.currentPage >= totalPages.value - 2) {
    start = Math.max(2, totalPages.value - 3)
    end = totalPages.value - 1
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showFirstEllipsis = computed(() => {
  return totalPages.value > 5 && props.currentPage > 3
})

const showLastEllipsis = computed(() => {
  return totalPages.value > 5 && props.currentPage < totalPages.value - 2
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 50px 0 120px 0;
}
</style>