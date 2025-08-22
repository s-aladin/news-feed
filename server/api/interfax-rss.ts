import { defineEventHandler } from 'h3'
import { parseStringPromise } from 'xml2js'
import type { RssApiResponse } from '~/types/news'

interface RssEnclosure {
    url: string
    type: string
    length?: string
}

interface RssItem {
    title: string
    link: string
    description: string
    pubDate: string
    enclosure?: RssEnclosure
    category?: string | string[]
}

interface RssChannel {
    title: string
    description: string
    item?: RssItem | RssItem[]
}

interface RssResult {
    rss: {
        channel: RssChannel
    }
}

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

        const result: RssResult = await parseStringPromise(cleanedXml, {
            explicitArray: false,
            trim: true,
            ignoreAttrs: false,
            mergeAttrs: true
        })

        const channel = result.rss?.channel
        if (!channel) {
            throw new Error('Channel not found in RSS')
        }

        let items: RssItem[] = []
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

function extractImageFromItem(item: RssItem): string {
    try {
        if (item.description) {
            const imageFromDescription = extractImageFromHtml(item.description)
            if (imageFromDescription) {
                return imageFromDescription
            }
        }

        if (item.enclosure?.url && item.enclosure.type?.includes('image')) {
            return item.enclosure.url
        }

        return ''
    } catch (error) {
        console.error('Error extracting image from Interfax item:', error)
        return ''
    }
}

function extractImageFromHtml(html: string): string {
    if (!html) return ''

    try {
        const imgRegex = /<img[^>]+src="([^">]+)"/gi
        const matches = []
        let match

        while ((match = imgRegex.exec(html)) !== null) {
            matches.push(match[1])
        }

        return matches.length > 0 ? matches[0] : ''
    } catch {
        return ''
    }
}

function isValidRssItem(item: RssItem): boolean {
    return (
        item &&
        typeof item.title === 'string' && item.title.trim() !== '' &&
        typeof item.link === 'string' && item.link.trim() !== '' &&
        typeof item.description === 'string' && item.description.trim() !== '' &&
        (typeof item.pubDate === 'string' || typeof item.pubDate === 'string')
    )
}