import { gaMeasurementId, shouldTrackPath, trackPageView } from '@/composables/useGoogleAnalytics'

export default defineNuxtPlugin(() => {
    const id = gaMeasurementId()
    if (!id) return

    const router = useRouter()

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', id, { send_page_view: false })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(script)

    trackPageView(router.currentRoute.value.fullPath)
    router.afterEach((to) => {
        if (shouldTrackPath(to.fullPath)) trackPageView(to.fullPath)
    })
})
