import {
    addStompNotificationHandler,
    isReservationLikeNotification,
    isSolicitationLikeNotification,
} from '~/utils/stompUserQueue'

/**
 * Rafraîchissement différé après push STOMP (évite rafales).
 */
export function useDebouncedStompRefresh(
    filter: (data: Record<string, unknown>) => boolean,
    refresh: () => void,
    delayMs = 450
) {
    let timer: ReturnType<typeof setTimeout> | null = null

    function schedule() {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            refresh()
        }, delayMs)
    }

    onMounted(() => {
        const remove = addStompNotificationHandler((data) => {
            if (filter(data)) schedule()
        })
        onUnmounted(() => {
            remove()
            if (timer) clearTimeout(timer)
        })
    })
}

export function useReservationStompRefresh(refresh: () => void) {
    useDebouncedStompRefresh(isReservationLikeNotification, refresh)
}

export function useSolicitationStompRefresh(refresh: () => void) {
    useDebouncedStompRefresh(isSolicitationLikeNotification, refresh)
}
