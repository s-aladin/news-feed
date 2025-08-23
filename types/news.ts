export interface EnclosureAttribute {
    $: {
        url: string
        type: string
        length?: string
    }
}

export interface RssEnclosure {
    url: string
    type: string
    length?: string
}

export interface MediaContent {
    $: {
        url: string
        type: string
        medium?: string
        [key: string]: string | undefined
    }
}

export interface RssItem {
    title: string
    link: string
    description: string
    pubDate: string
    enclosure?: EnclosureAttribute | EnclosureAttribute[]
    'media:content'?: MediaContent | MediaContent[]
}

export interface ValidRssItem {
    title: string
    link: string
    description: string
    pubDate: string
    image: string
}

export interface RssChannel {
    title: string
    description: string
    item: RssItem | RssItem[]
}

export interface Rss {
    channel: RssChannel
}

export interface RssResult {
    rss: Rss
}

export interface RssApiResponse {
    success: boolean
    data?: {
        title: string
        description: string
        items: ValidRssItem[]
        totalAvailable: number
        totalWithImages: number
        source: string
    }
    error?: string
}

export interface NewsItem {
    title: string
    link: string
    description: string
    pubDate: string
    image: string
    source: string
}

export interface NewsResponse {
    items: NewsItem[]
    total: number
    sources: {
        'mos.ru': number
        'interfax.ru': number
    }
}

export interface NewsState {
    items: NewsItem[]
    loading: boolean
    error: string | null
    activeSources: string[]
}