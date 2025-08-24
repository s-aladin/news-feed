import { defineEventHandler } from 'h3'
import type { NewsResponse, NewsItem, RssApiResponse } from '~/types/news'

export default defineEventHandler(async (event): Promise<NewsResponse> => {
    try {
        const [mosData, interfaxData] = await Promise.allSettled([
            $fetch<RssApiResponse>('/api/mos-rss'),
            $fetch<RssApiResponse>('/api/interfax-rss')
        ])

        const allItems: NewsItem[] = []

        if (mosData.status === 'fulfilled' && mosData.value.success && mosData.value.data) {
            const mosItems = mosData.value.data.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
                image: item.image,
                source: 'mos.ru'
            }))
            allItems.push(...mosItems)
        }

        if (interfaxData.status === 'fulfilled' && interfaxData.value.success && interfaxData.value.data) {
            const interfaxItems = interfaxData.value.data.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
                image: item.image,
                source: 'interfax.ru'
            }))
            allItems.push(...interfaxItems)
        }

        const sortedItems = allItems.sort((a, b) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        )

        const sourceCounts = {
            'mos.ru': allItems.filter(item => item.source === 'mos.ru').length,
            'interfax.ru': allItems.filter(item => item.source === 'interfax.ru').length
        }

        return {
            items: sortedItems,
            total: sortedItems.length,
            sources: sourceCounts
        }

    } catch (error: unknown) {
        console.error('News aggregation error:', error)
        throw createError({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        })
    }
})