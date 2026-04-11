import { watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'
import { syncStompUserQueue, addStompNotificationHandler } from '~/utils/stompUserQueue'

/**
 * Même principe que NotificationController + StompService (Flutter) :
 * connexion automatique avec le JWT et réception sur `/user/queue/notifications`.
 */
export default defineNuxtPlugin(() => {
    const auth = useAuthStore()
    const notifStore = useNotificationStore()
    const config = useRuntimeConfig()

    // Enregistre les notifications arrivant en temps réel dans le store
    if (import.meta.client) {
        addStompNotificationHandler((data) => {
            notifStore.addNotification(data)
        })
    }

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
