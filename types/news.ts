export interface NewsItem {
    id: string
    title: string
    content: string
    description: string
    link: string
    pubDate: string
    source: string
    image?: string
}

export interface NewsState {
    items: NewsItem[]
    totalItems: number
}