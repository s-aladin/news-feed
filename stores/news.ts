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
            const route = useRoute()
            const searchQuery = (route.query.search as string)?.toLowerCase() || ''

            return state.items.filter(item => {
                const sourceMatch = state.activeSources.includes(item.source)

                let searchMatch = true
                if (searchQuery) {
                    searchMatch = item.title.toLowerCase().includes(searchQuery) ||
                        item.description.toLowerCase().includes(searchQuery)
                }

                return sourceMatch && searchMatch
            }).sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            )
        },
    },

    actions: {
        async fetchNews() {
            this.loading = true
            this.error = null

            try {
                const response = await $fetch<{ items: NewsItem[] }>('/api/news')
                this.items = response.items
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
            this.updateUrlWithFilters()
        },
        updateUrlWithFilters() {
            const route = useRoute()
            const router = useRouter()

            const query: any = { ...route.query }

            if (this.activeSources.length === 2) {
                delete query.sources
            } else {
                query.sources = this.activeSources.join(',')
            }

            delete query.page

            router.replace({ query })
        },
        loadSourcesFromQuery() {
            const route = useRoute()
            const sourcesParam = route.query.sources as string

            if (sourcesParam) {
                this.activeSources = sourcesParam.split(',')
            } else {
                this.activeSources = ['mos.ru', 'interfax.ru']
            }
        }
    }
})