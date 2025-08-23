import { defineStore } from 'pinia'
import type { NewsItem, NewsState } from '~/types/news'

export const useNewsStore = defineStore('news', {
    state: (): NewsState => ({
        items: [],
        loading: false,
        error: null,
        activeSources: ['mos.ru', 'interfax.ru'],
    }),

    getters: {
        filteredItems: (state): NewsItem[] => {
            return state.items.filter(item =>
                state.activeSources.includes(item.source)
            )
        },
    },

    actions: {
        async fetchNews() {
            this.loading = true
            this.error = null

            try {
                const response = await $fetch<{ items: NewsItem[] }>('/api/news')
                this.items = response.items.sort((a, b) =>
                    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
                )
            } catch (err: any) {
                this.error = err.message || 'Ошибка загрузки новостей'
            } finally {
                this.loading = false
            }
        },
        toggleSource(source: string) {
            if (this.activeSources.includes(source)) {
                if (this.activeSources.length > 1) {
                    this.activeSources = this.activeSources.filter(s => s !== source)
                }
            } else {
                this.activeSources.push(source)
            }
        },
    }
})