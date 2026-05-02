import { defineStore } from 'pinia';
import { l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';

const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
    loading: false,
    unreadCount: 0,
    page: 0,
    hasMore: true
  }),
  actions: {
    async fetchNotifications(force = false) {
      var _a, _b;
      if (!force && this.notifications.length > 0 && this.page > 0) return this.notifications;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return [];
      if (force) {
        this.page = 0;
        this.hasMore = true;
        this.notifications = [];
      }
      if (!this.hasMore) return this.notifications;
      this.loading = true;
      const userId = ((_a = auth.user) == null ? void 0 : _a.userId) || ((_b = auth.user) == null ? void 0 : _b.id);
      const size = 15;
      const url = joinApi(config.public.apiBase, `${ApiEndpoints.notificationsOwner}/${userId}?page=${this.page}&size=${size}`);
      try {
        const res = await $fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const raw = Array.isArray(res) ? res : (res == null ? void 0 : res.data) || (res == null ? void 0 : res.notifications) || (res == null ? void 0 : res.content) || [];
        const out = raw.map((n) => this.normalizeNotification(n));
        if (out.length < size) {
          this.hasMore = false;
        }
        if (this.page === 0) {
          this.notifications = out;
        } else {
          const existingIds = new Set(this.notifications.map((n) => n.id));
          const filtered = out.filter((n) => !existingIds.has(n.id));
          this.notifications = [...this.notifications, ...filtered];
        }
        this.notifications.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        this.page++;
        this.updateUnreadCount();
        return this.notifications;
      } catch (e) {
        console.error("[notifications store]", e);
        return this.notifications;
      } finally {
        this.loading = false;
      }
    },
    async markAllRead() {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return;
      this.notifications.forEach((n) => n.read = true);
      this.unreadCount = 0;
      try {
        await $fetch(joinApi(config.public.apiBase, ApiEndpoints.markAllNotificationsRead), {
          method: "PUT",
          // or PATCH/POST depending on API
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      } catch (e) {
        console.error("[notification markAllRead]", e);
      }
    },
    normalizeNotification(n) {
      let title = n.title || n.message || "Notification";
      let content = n.content || n.body || "";
      const type = n.type || n.notificationType || "INFO";
      if (type === "SUBSCRIPTION_CANCEL") {
        title = "CasaNayo Abonnement";
      } else if (type === "DEMANDES") {
        title = "Demande d'intervention re\xE7ue";
      }
      return {
        id: n.id || n.notificationId,
        title,
        description: n.description || "",
        content,
        type,
        tag: n.tag || "",
        read: n.read === true || n.isRead === true || n.status === "READ",
        createdAt: n.createdAt || n.date || (/* @__PURE__ */ new Date()).toISOString(),
        data: n.data || n.payload || null
      };
    },
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter((n) => !n.read).length;
    },
    addNotification(raw) {
      const n = this.normalizeNotification(raw);
      if (this.notifications.some((x) => x.id === n.id)) return;
      this.notifications.unshift(n);
      this.updateUnreadCount();
    },
    async markAsRead(id) {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return;
      const n = this.notifications.find((x) => x.id === id);
      if (n) n.read = true;
      this.updateUnreadCount();
      try {
        await $fetch(joinApi(config.public.apiBase, `${ApiEndpoints.markNotificationRead}${id}`), {
          method: "PATCH",
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      } catch (e) {
        console.error("[notification markRead]", e);
      }
    },
    async deleteNotification(id) {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return;
      this.notifications = this.notifications.filter((x) => x.id !== id);
      this.updateUnreadCount();
      try {
        await $fetch(joinApi(config.public.apiBase, `${ApiEndpoints.deleteNotification}${id}`), {
          method: "DELETE",
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      } catch (e) {
        console.error("[notification delete]", e);
      }
    }
  }
});

export { useNotificationStore as u };
//# sourceMappingURL=notifications-CjQTCppy.mjs.map
