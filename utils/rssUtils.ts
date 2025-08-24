export function extractImageFromItem(item: any): string {
    try {
        if (item.description) {
            const imageFromDescription = extractImageFromHtmlForMos(item.description) || extractImageFromHtmlForInterfax(item.description)
            if (imageFromDescription) {
                return imageFromDescription
            }
        }

        if (item.enclosure && Array.isArray(item.enclosure) && item.enclosure.length > 0 && item.enclosure[0].$) {
            return item.enclosure[0].$.url
        }

        if (item.enclosure?.url && item.enclosure.type?.includes('image')) {
            return item.enclosure.url
        }

        const imageFromDescription = extractImageFromHtmlForMos(item.description) || extractImageFromHtmlForInterfax(item.description)
        if (imageFromDescription) {
            return imageFromDescription
        }

        return ''
    } catch (error) {
        console.error('Error extracting image from item:', error)
        return ''
    }
}

export function extractImageFromHtmlForInterfax(html: string): string {
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

export function extractImageFromHtmlForMos(html: string): string | undefined {
    if (!html) return undefined

    const imgRegex = /<img[^>]+src="([^">]+)"/i
    const match = html.match(imgRegex)
    return match ? match[1] : undefined
}

export function isValidRssItem(item: any): boolean {
    return (
        item &&
        typeof item.title === 'string' && item.title.trim() !== '' &&
        typeof item.link === 'string' && item.link.trim() !== '' &&
        typeof item.description === 'string' && item.description.trim() !== '' &&
        typeof item.pubDate === 'string' && item.pubDate.trim() !== ''
    )
}