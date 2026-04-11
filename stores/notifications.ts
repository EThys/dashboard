import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { ApiEndpoints, joinApi } from '@/utils/apiEndpoints'

export interface AppNotification {
    id: number
    title: string
    description: string
    content: string
    type: string
    tag?: string
    read: boolean
    createdAt: string
    data?: any
}

interface NotificationState {
    notifications: AppNotification[]
    loading: boolean
    unreadCount: number
    page: number
    hasMore: boolean
}

export const useNotificationStore = defineStore('notifications', {
    state: (): NotificationState => ({
        notifications: [],
        loading: false,
        unreadCount: 0,
        page: 0,
        hasMore: true,
    }),

    actions: {
        async fetchNotifications(force = false) {
            if (!force && this.notifications.length > 0 && this.page > 0) return this.notifications

            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return []

            if (force) {
                this.page = 0
                this.hasMore = true
                this.notifications = []
            }

            if (!this.hasMore) return this.notifications

            this.loading = true
            const userId = auth.user?.userId || (auth.user as { id?: number })?.id
            
            // Try pagination with page and size
            const size = 15
            const url = joinApi(config.public.apiBase as string, `${ApiEndpoints.notificationsOwner}/${userId}?page=${this.page}&size=${size}`)
            
            try {
                const res = await $fetch<any>(url, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
                
                const raw = Array.isArray(res) ? res : (res?.data || res?.notifications || res?.content || [])
                const out = raw.map((n: any) => this.normalizeNotification(n))
                
                if (out.length < size) {
                    this.hasMore = false
                }

                if (this.page === 0) {
                    this.notifications = out
                } else {
                    // Avoid duplicates
                    const existingIds = new Set(this.notifications.map(n => n.id))
                    const filtered = out.filter((n: AppNotification) => !existingIds.has(n.id))
                    this.notifications = [...this.notifications, ...filtered]
                }
                
                this.notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                this.page++
                this.updateUnreadCount()
                return this.notifications
            } catch (e) {
                console.error('[notifications store]', e)
                return this.notifications
            } finally {
                this.loading = false
            }
        },

        async markAllRead() {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return

            // Optimistic UI update
            this.notifications.forEach(n => n.read = true)
            this.unreadCount = 0

            try {
                await $fetch(joinApi(config.public.apiBase as string, ApiEndpoints.markAllNotificationsRead), {
                    method: 'PUT', // or PATCH/POST depending on API
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (e) {
                console.error('[notification markAllRead]', e)
            }
        },

        normalizeNotification(n: any): AppNotification {
            return {
                id: n.id || n.notificationId,
                title: n.title || n.message || 'Notification',
                description: n.description || '',
                content: n.content || n.body || '',
                type: n.type || n.notificationType || 'INFO',
                tag: n.tag || '',
                read: n.read === true || n.isRead === true || n.status === 'READ',
                createdAt: n.createdAt || n.date || new Date().toISOString(),
                data: n.data || n.payload || null,
            }
        },

        updateUnreadCount() {
            this.unreadCount = this.notifications.filter(n => !n.read).length
        },

        addNotification(raw: any) {
            const n = this.normalizeNotification(raw)
            // Prevent duplicates
            if (this.notifications.some(x => x.id === n.id)) return
            
            this.notifications.unshift(n)
            this.updateUnreadCount()
        },

        async markAsRead(id: number) {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return

            const n = this.notifications.find(x => x.id === id)
            if (n) n.read = true
            this.updateUnreadCount()

            try {
                // matching line 282: notifications/
                await $fetch(joinApi(config.public.apiBase as string, `${ApiEndpoints.markNotificationRead}${id}`), {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (e) {
                console.error('[notification markRead]', e)
            }
        },

        async deleteNotification(id: number) {
            const auth = useAuthStore()
            const config = useRuntimeConfig()
            if (!auth.token) return

            this.notifications = this.notifications.filter(x => x.id !== id)
            this.updateUnreadCount()

            try {
                // matching line 284
                await $fetch(joinApi(config.public.apiBase as string, `${ApiEndpoints.deleteNotification}${id}`), {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${auth.token}` },
                })
            } catch (e) {
                console.error('[notification delete]', e)
            }
        }
    }
})
