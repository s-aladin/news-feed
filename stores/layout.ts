import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
    state: () => ({
        layout: 'grid' as 'list' | 'grid'
    }),

    actions: {
        setLayout(layout: 'list' | 'grid') {
            this.layout = layout
            if (process.client) {
                localStorage.setItem('newsLayout', layout)
            }
        },
        loadLayoutFromStorage() {
            if (process.client) {
                const savedLayout = localStorage.getItem('newsLayout') as 'list' | 'grid' | null
                if (savedLayout) {
                    this.layout = savedLayout
                }
            }
        }
    }
})