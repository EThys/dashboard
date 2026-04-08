import { Client, type IMessage } from '@stomp/stompjs'

/** Aligné sur StompService.dart : file privée `/user/queue/notifications`. */
export const STOMP_USER_NOTIFICATIONS_DESTINATION = '/user/queue/notifications'

type StompHandler = (data: Record<string, unknown>) => void

const handlers = new Set<StompHandler>()

let client: Client | null = null
let activeToken: string | null = null

export function resolveStompBrokerUrl(publicCfg: {
    apiBase: string
    stompBrokerUrl?: string
}): string | null {
    const override = publicCfg.stompBrokerUrl?.trim()
    if (override) return override

    const api = publicCfg.apiBase.replace(/\/$/, '')

    if (api.startsWith('http://')) {
        return `ws://${api.slice(7).replace(/\/api\/?$/i, '')}/websocket`
    }
    if (api.startsWith('https://')) {
        return `wss://${api.slice(8).replace(/\/api\/?$/i, '')}/websocket`
    }

    if (import.meta.client) {
        const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
        return `${proto}://${window.location.host}/websocket`
    }
    return null
}

function notificationBlobs(root: Record<string, unknown>): Record<string, unknown>[] {
    const out: Record<string, unknown>[] = [root]
    const p = root.payload
    if (p && typeof p === 'object' && !Array.isArray(p)) out.push(p as Record<string, unknown>)
    const d = root.data
    if (d && typeof d === 'object' && !Array.isArray(d)) out.push(d as Record<string, unknown>)
    const n = root.notification
    if (n && typeof n === 'object' && !Array.isArray(n)) out.push(n as Record<string, unknown>)
    const b = root.body
    if (typeof b === 'string' && b.trim().startsWith('{')) {
        try {
            out.push(JSON.parse(b) as Record<string, unknown>)
        } catch {
            /* ignore */
        }
    }
    return out
}

function blobText(d: Record<string, unknown>): string {
    return `${d.message ?? ''} ${d.body ?? ''} ${d.title ?? ''} ${d.description ?? ''} ${d.content ?? ''}`.toLowerCase()
}

export function isReservationLikeNotification(data: Record<string, unknown>): boolean {
    for (const d of notificationBlobs(data)) {
        const type = String(d.type ?? d.notificationType ?? '').toLowerCase()
        if (type.includes('appointment') || type.includes('reservation')) return true
        if (String(d.category ?? '') === 'Demandes') return true
        if (blobText(d).includes('réservation') || blobText(d).includes('reservation')) return true
        if (d.reservationId != null) return true
        if (String(d.action ?? '').toLowerCase().includes('reservation')) return true
        if (d.DealConcludeHost === true || d.dealConcludeHost === true) return true
    }
    return false
}

export function isSolicitationLikeNotification(data: Record<string, unknown>): boolean {
    for (const d of notificationBlobs(data)) {
        const t = blobText(d)
        if (t.includes('sollicitation') || t.includes('prestation')) return true
        if (d.prestationId != null || d.sollicitationId != null || d.sollicitation != null) return true
        if (String(d.type ?? '').toLowerCase().includes('sollicit')) return true
    }
    return false
}

export function addStompNotificationHandler(handler: StompHandler): () => void {
    handlers.add(handler)
    return () => handlers.delete(handler)
}

function dispatchToHandlers(raw: Record<string, unknown>) {
    handlers.forEach((h) => {
        try {
            h(raw)
        } catch {
            /* ignore */
        }
    })
}

/**
 * Connexion STOMP (comme le mobile : Authorization Bearer, destination utilisateur).
 */
export function syncStompUserQueue(
    token: string | null,
    publicCfg: { apiBase: string; stompBrokerUrl?: string }
): void {
    if (!import.meta.client) return

    if (!token) {
        try {
            client?.deactivate()
        } catch {
            /* */
        }
        client = null
        activeToken = null
        return
    }

    if (client?.connected && activeToken === token) {
        return
    }

    try {
        client?.deactivate()
    } catch {
        /* */
    }
    client = null

    const brokerURL = resolveStompBrokerUrl(publicCfg)
    if (!brokerURL) return

    activeToken = token

    const c = new Client({
        brokerURL,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 30000,
        heartbeatOutgoing: 30000,
        debug: () => {
            /* désactivé en prod */
        },
        onConnect: () => {
            c.subscribe(STOMP_USER_NOTIFICATIONS_DESTINATION, (message: IMessage) => {
                if (!message.body) return
                try {
                    const data = JSON.parse(message.body) as Record<string, unknown>
                    dispatchToHandlers(data)
                } catch {
                    dispatchToHandlers({
                        body: message.body,
                        message: message.body,
                        rawText: message.body,
                    } as Record<string, unknown>)
                }
            })
        },
        onStompError: () => {
            /* log silencieux — STOMP renverra via reconnectDelay */
        },
        onWebSocketError: () => {
            /* idem */
        },
    })

    client = c
    c.activate()
}
