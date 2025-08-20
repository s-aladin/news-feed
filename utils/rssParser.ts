import Parser from 'rss-parser'

const parser = new Parser()

export async function parseRSSFeed(url: string, source: string): Promise<any[]> {
    try {
        const feed = await parser.parseURL(url)
        return feed.items.map((item: any) => ({
            id: `${source}-${item.guid || item.link}`,
            title: item.title,
            content: item.content || item.description,
            description: item.description,
            link: item.link,
            pubDate: item.pubDate,
            source: source,
            image: item.enclosure?.url || item.image?.url
        }))
    } catch (error) {
        console.error(`Error parsing RSS feed ${url}:`, error)
        return []
    }
}