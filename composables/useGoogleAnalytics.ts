/** Google Analytics 4. Le script se charge pour chaque visiteur du site public. */

export const GA_CONSENT_KEY = 'casanayo_cookie_consent'
export const GA_CONSENT_EVENT = 'casanayo-consent'

type Gtag = (...args: unknown[]) => void

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: Gtag
    }
}

const SKIP_PREFIXES = ['/dashboard', '/compte', '/login', '/register']

let cachedMeasurementId = ''

export function gaMeasurementId(): string {
    if (cachedMeasurementId) return cachedMeasurementId
    const config = useRuntimeConfig()
    cachedMeasurementId = String(config.public.gaMeasurementId || '').trim()
    return cachedMeasurementId
}

export function analyticsConsentGranted(): boolean {
    if (!import.meta.client) return false
    return localStorage.getItem(GA_CONSENT_KEY) === 'all'
}

function gtagCall(): Gtag | null {
    if (!import.meta.client || typeof window.gtag !== 'function') return null
    return window.gtag
}

export function shouldTrackPath(path: string): boolean {
    return !SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`))
}

export function trackPageView(path: string) {
    const gtag = gtagCall()
    const id = gaMeasurementId()
    if (!gtag || !id || !shouldTrackPath(path)) return
    gtag('event', 'page_view', {
        send_to: id,
        page_path: path,
        page_location: `${window.location.origin}${path}`,
        page_title: document.title,
    })
}

/** Vue d'une annonce : devise, lieu et type (vente / location) partent dans GA4. */
export function trackListingView(input: {
    id: string | number
    title: string
    currency?: string
    location?: string
    category?: string
    transactionType?: string
}) {
    const gtag = gtagCall()
    const id = gaMeasurementId()
    if (!gtag || !id) return
    gtag('event', 'view_item', {
        send_to: id,
        currency: input.currency || 'USD',
        items: [{
            item_id: String(input.id),
            item_name: input.title,
            item_category: input.category || 'Annonce',
            item_variant: input.transactionType || '',
            location_id: input.location || '',
        }],
    })
}
