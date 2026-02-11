import { defineStore } from 'pinia'

export interface Currency {
    id: number
    name: string
    code: 'USD' | 'CDF'
    tauxLocal: number
}

export const useCurrencyStore = defineStore('currency', {
    state: () => ({
        currencies: [] as Currency[],
        lastFetch: null as Date | null
    }),

    getters: {
        getCurrencies: (state) => state.currencies,
        
        getCurrencyByCode: (state) => (code: string) => {
            return state.currencies.find(c => c.code === code)
        },

        getSymbol: () => (code: string) => {
            const symbols: Record<string, string> = {
                'USD': '$',
                'CDF': 'FC',
            }
            return symbols[code] || code
        },

        getLabel: () => (code: string) => {
            const labels: Record<string, string> = {
                'USD': 'Dollars américains',
                'CDF': 'Franc congolais',
            }
            return labels[code] || code
        },

        getExchangeRate: (state) => (code: string) => {
            const currency = state.currencies.find(c => c.code === code)
            return currency?.tauxLocal || 1
        }
    },

    actions: {
        async fetchCurrencies(apiBase: string) {
            try {
                const response = await $fetch(`${apiBase}/devise`)
                if (response && Array.isArray(response)) {
                    this.currencies = response
                    this.lastFetch = new Date()
                }
            } catch (error) {
                console.error('Failed to fetch currencies:', error)
            }
        },

        setCurrencies(data: Currency[]) {
            this.currencies = data
            this.lastFetch = new Date()
        },
        reset() {
            this.currencies = []
            this.lastFetch = null
        }
    }
})
