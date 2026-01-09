/**
 * Currency formatting utilities
 */

export interface CurrencyInfo {
    symbol: string
    label: string
    position: 'before' | 'after'
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(code: string): string {
    const symbols: Record<string, string> = {
        'USD': '$',
        'FC': 'FC',
        'CDF': 'FC', // Franc Congolais alternative code
    }
    return symbols[code] || code
}

/**
 * Get full currency label
 */
export function getCurrencyLabel(code: string): string {
    const labels: Record<string, string> = {
        'USD': 'Dollars américains',
        'FC': 'Franc congolais',
        'CDF': 'Franc congolais',
    }
    return labels[code] || code
}

/**
 * Get complete currency information
 */
export function getCurrencyInfo(code: string): CurrencyInfo {
    const info: Record<string, CurrencyInfo> = {
        'USD': {
            symbol: '$',
            label: 'Dollars américains',
            position: 'before'
        },
        'FC': {
            symbol: 'FC',
            label: 'Franc congolais',
            position: 'after'
        },
        'CDF': {
            symbol: 'FC',
            label: 'Franc congolais',
            position: 'after'
        }
    }
    return info[code] || {
        symbol: code,
        label: code,
        position: 'after'
    }
}

/**
 * Format currency with proper symbol and positioning
 */
export function formatCurrency(amount: number | string | null | undefined, currencyCode: string): string {
    // Handle null/undefined
    if (amount === null || amount === undefined || amount === '') {
        const info = getCurrencyInfo(currencyCode)
        return info.position === 'before' ? `${info.symbol}0` : `0 ${info.symbol}`
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

    // Handle NaN
    if (isNaN(numAmount)) {
        const info = getCurrencyInfo(currencyCode)
        return info.position === 'before' ? `${info.symbol}0` : `0 ${info.symbol}`
    }

    const formattedAmount = numAmount.toLocaleString('fr-FR')
    const info = getCurrencyInfo(currencyCode)

    if (info.position === 'before') {
        return `${info.symbol}${formattedAmount}`
    } else {
        return `${formattedAmount} ${info.symbol}`
    }
}

/**
 * Format currency for display with symbol and label
 */
export function formatCurrencyDisplay(amount: number | string, currencyCode: string): {
    formatted: string
    symbol: string
    label: string
} {
    const info = getCurrencyInfo(currencyCode)
    const formatted = formatCurrency(amount, currencyCode)

    return {
        formatted,
        symbol: info.symbol,
        label: info.label
    }
}
