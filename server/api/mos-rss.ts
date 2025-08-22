import { defineEventHandler } from 'h3'
import { parseStringPromise } from 'xml2js'
import type { RssResult, RssApiResponse, RssItem } from '~/types/news'

export default defineEventHandler(async (event): Promise<RssApiResponse> => {
    const config = useRuntimeConfig()

    try {
        const xmlData = await $fetch<string>(config.public.rssFeeds.mos, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        })

        const result: RssResult = await parseStringPromise(xmlData, {
            explicitArray: false,
            trim: true
        })

        const channel = result.rss.channel

        const allItems: RssItem[] = Array.isArray(channel.item)
            ? channel.item
            : [channel.item]

        const validItems = allItems
            .filter(item => isValidRssItem(item))
            .map(item => ({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
                image: extractImageFromItem(item)
            }))
            .filter(item => item.image && item.image.trim() !== '') // Фильтруем items с изображениями

        return {
            success: true,
            data: {
                title: channel.title,
                description: channel.description,
                items: validItems,
                totalAvailable: allItems.length,
                totalWithImages: validItems.length,
                source: 'mos.ru'
            }
        }

    } catch (error: unknown) {
        console.error('Mos.ru RSS parsing error:', error)

        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error occurred'

        return {
            success: false,
            error: errorMessage,
            data: undefined
        }
    }
})

function extractImageFromItem(item: any): string {
    if (item.enclosure && Array.isArray(item.enclosure) && item.enclosure.length > 0 && item.enclosure[0].$) {
        return item.enclosure[0].$.url
    }

    const imageFromDescription = extractImageFromHtml(item.description)
    if (imageFromDescription) {
        return imageFromDescription
    }

    return ''
}

function extractImageFromHtml(html: string): string | undefined {
    if (!html) return undefined

    const imgRegex = /<img[^>]+src="([^">]+)"/i
    const match = html.match(imgRegex)
    return match ? match[1] : undefined
}

function isValidRssItem(item: any): item is RssItem {
    return (
        item &&
        typeof item.title === 'string' && item.title.trim() !== '' &&
        typeof item.link === 'string' && item.link.trim() !== '' &&
        typeof item.description === 'string' && item.description.trim() !== '' &&
        typeof item.pubDate === 'string' && item.pubDate.trim() !== ''
    )
}