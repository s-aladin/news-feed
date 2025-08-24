import { defineEventHandler } from 'h3'
import { parseStringPromise } from 'xml2js'
import type { RssApiResponse, InterfaxRssItem, InterfaxRssResult } from '~/types/news'
import { extractImageFromItem, isValidRssItem} from "~/utils/rssUtils";

export default defineEventHandler(async (event): Promise<RssApiResponse> => {
    const config = useRuntimeConfig()

    try {
        const xmlData = await $fetch<string>(config.public.rssFeeds.interfax, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        })

        const cleanedXml = xmlData.trim().replace(/^\uFEFF/, '').replace(/[\x00-\x1F\x7F]/g, '')

        const result: InterfaxRssResult = await parseStringPromise(cleanedXml, {
            explicitArray: false,
            trim: true,
            ignoreAttrs: false,
            mergeAttrs: true
        })

        const channel = result.rss?.channel
        if (!channel) {
            throw new Error('Channel not found in RSS')
        }

        let items: InterfaxRssItem[] = []
        if (channel.item) {
            items = Array.isArray(channel.item) ? channel.item : [channel.item]
        }

        console.log(`Interfax: Found ${items.length} items`)

        const validItems = items
            .filter(item => isValidRssItem(item))
            .map(item => {
                const imageUrl = extractImageFromItem(item)
                console.log('Item:', item.title?.substring(0, 50), 'Image:', imageUrl || 'not found')
                return {
                    title: item.title || '',
                    link: item.link || '',
                    description: item.description || '',
                    pubDate: item.pubDate || new Date().toISOString(),
                    image: imageUrl
                }
            })
            .filter(item => item.image && item.image.trim() !== '')

        console.log(`Interfax: Valid items with images: ${validItems.length}`)

        return {
            success: true,
            data: {
                title: channel.title || 'Интерфакс',
                description: channel.description || '',
                items: validItems,
                totalAvailable: items.length,
                totalWithImages: validItems.length,
                source: 'interfax.ru'
            }
        }

    } catch (error: unknown) {
        console.error('Interfax RSS parsing error:', error)

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