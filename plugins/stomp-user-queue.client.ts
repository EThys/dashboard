import { watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { syncStompUserQueue } from '~/utils/stompUserQueue'

/**
 * Même principe que NotificationController + StompService (Flutter) :
 * connexion automatique avec le JWT et réception sur `/user/queue/notifications`.
 */
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    const config = useRuntimeConfig()

    watch(
        () => auth.token,
        (token) => {
            syncStompUserQueue(token ?? null, {
                apiBase: config.public.apiBase as string,
                stompBrokerUrl: config.public.stompBrokerUrl as string | undefined,
            })
        },
        { immediate: true }
    )
})
