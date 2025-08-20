import { defineStore } from 'pinia'
import type { NewsItem, NewsState } from '~/types/news'
import { parseRSSFeed } from '~/utils/rssParser'

export const useNewsStore = defineStore('news', {
    state: (): NewsState => ({
        items: [],
        totalItems: 0,
    }),

    actions: {
        async fetchNews() {
            const config = useRuntimeConfig()
            const feeds = [
                { source: 'mos', url: config.public.rssFeeds.mos },
                { source: 'lenta', url: config.public.rssFeeds.lenta }
            ]

            const allNews: NewsItem[] = []

            for (const feed of feeds) {
                const items = await parseRSSFeed(feed.url, feed.source)
                allNews.push(...items)
            }

            this.items = allNews.sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            )
            this.totalItems = this.items.length
        }
    },
    getters: {

    }
})