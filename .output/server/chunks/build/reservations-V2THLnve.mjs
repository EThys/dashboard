import { defineStore } from 'pinia';
import { e as useAuthStore, c as useRuntimeConfig } from './server.mjs';

const useReservationStore = defineStore("reservations", {
  state: () => ({
    isSubmitting: false,
    lastError: null
  }),
  actions: {
    async createReservation(propertyType, id, details) {
      var _a;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) {
        auth.checkSession();
      }
      if (!auth.isAuthenticated) {
        console.warn("Reservation failed: No active session found.");
        return { success: false, message: "Session expir\xE9e ou non trouv\xE9e. Veuillez vous reconnecter." };
      }
      if (!auth.user) {
        console.warn("Reservation failed: Authenticated but user data is missing.", auth.token);
        return { success: false, message: "Donn\xE9es utilisateur introuvables. Veuillez vous reconnecter." };
      }
      this.isSubmitting = true;
      this.lastError = null;
      let endpoint = "/reservations";
      const userId = auth.user.userId || auth.user.id || auth.user.userId;
      const body = {
        userId,
        startDate: details.startDate,
        endDate: details.endDate,
        message: details.message || "Demande de r\xE9servation via Dashboard",
        type: details.type || "VIP",
        reservationHeure: details.reservationHeure || (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour12: false })
      };
      const type = propertyType.toLowerCase();
      if (type.includes("terrain")) {
        endpoint = "/reservations/terrain";
        body.terrainId = id;
      } else if (type.includes("bureau")) {
        endpoint = "/reservations/bureau";
        body.bureauId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      } else if (type.includes("festive") || type.includes("f\xEAte")) {
        endpoint = "/reservations/festive";
        body.festiveId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      } else if (type.includes("funeraire")) {
        endpoint = "/reservations/funeraire";
        body.funeraireId = id;
      } else if (type.includes("hotel") || type.includes("vacance")) {
        endpoint = "/reservations/vacance";
        body.vacanceId = id;
      } else {
        endpoint = "/reservations";
        body.propertyId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      }
      try {
        console.log("Attempting reservation with token:", auth.token ? `${auth.token.substring(0, 10)}...` : "NULL");
        const response = await $fetch(`${config.public.apiBase}${endpoint}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${auth.token}`
          },
          body
        });
        this.isSubmitting = false;
        return { success: true, data: response };
      } catch (error) {
        this.isSubmitting = false;
        console.error("Reservation API Error:", error.status, error.data);
        if (error.status === 401 || error.status === 403) {
          return { success: false, message: "Session invalide ou expir\xE9e (Erreur Serveur). Veuillez vous reconnecter." };
        }
        this.lastError = ((_a = error.data) == null ? void 0 : _a.message) || "Erreur lors de la r\xE9servation";
        return { success: false, message: this.lastError };
      }
    },
    async fetchUserReservations() {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) {
        auth.checkSession();
      }
      if (!auth.isAuthenticated) return [];
      const user = auth.user;
      if (!user) return [];
      const userId = user.userId || user.id || user.userId;
      try {
        const response = await $fetch(`${config.public.apiBase}/reservations/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${auth.token}`
          }
        });
        return (response == null ? void 0 : response.reservations) || response || [];
      } catch (error) {
        console.error("Failed to fetch user reservations:", error);
        return [];
      }
    }
  }
});

export { useReservationStore as u };
//# sourceMappingURL=reservations-V2THLnve.mjs.map
