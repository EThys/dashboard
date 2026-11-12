import { defineStore } from 'pinia';
import { m as useAuthStore, j as joinApi, A as ApiEndpoints } from './server.mjs';

function convertAmount(devises, amount, fromCode, toCode) {
  var _a, _b, _c, _d;
  if (fromCode === toCode) return amount;
  const fallback = (code) => {
    if (code === "USD") return { code: "USD", tauxLocal: 1 };
    if (code === "CDF") return { code: "CDF", tauxLocal: 2200 };
    return { code, tauxLocal: 1 };
  };
  const from = (_a = devises.find((d) => d.code === fromCode)) != null ? _a : fallback(fromCode);
  const to = (_b = devises.find((d) => d.code === toCode)) != null ? _b : fallback(toCode);
  const fromT = (_c = from.tauxLocal) != null ? _c : 1;
  const toT = (_d = to.tauxLocal) != null ? _d : 1;
  return amount / fromT * toT;
}
const usePaymentStore = defineStore("payment", {
  state: () => ({
    isLoadingSubscribe: false,
    isLoadingHistory: false,
    isLoadingDevises: false,
    devises: [],
    history: [],
    historyUserId: null,
    historyReady: false,
    lastHistoryPremium: null
  }),
  actions: {
    convert(amount, fromCode, toCode) {
      return convertAmount(this.devises, amount, fromCode, toCode);
    },
    async fetchDevises(apiBase) {
      const auth = useAuthStore();
      this.isLoadingDevises = true;
      try {
        const headers = {};
        if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
        const url = joinApi(apiBase, ApiEndpoints.devises);
        const res = await $fetch(url, { headers });
        if ((res == null ? void 0 : res.devises) && Array.isArray(res.devises)) {
          this.devises = res.devises;
          return;
        }
        if (Array.isArray(res)) {
          this.devises = res;
          return;
        }
        if ((res == null ? void 0 : res.data) && Array.isArray(res.data)) {
          this.devises = res.data;
        }
      } catch (e) {
        console.error("fetchDevises:", e);
        if (this.devises.length === 0) {
          this.devises = [
            { id: 1, name: "Franc Congolais", code: "CDF", tauxLocal: 2200 },
            { id: 2, name: "Dollar am\xE9ricain", code: "USD", tauxLocal: 1 }
          ];
        }
      } finally {
        this.isLoadingDevises = false;
      }
    },
    resolveDeviseId(code) {
      const row = this.devises.find((d) => d.code === code);
      if ((row == null ? void 0 : row.id) != null) return row.id;
      if (code === "USD") return 2;
      return 1;
    },
    async subscribe(apiBase, phone, deviseId) {
      var _a, _b, _c;
      const auth = useAuthStore();
      if (!auth.token) {
        return { success: false, message: "Session expir\xE9e. Reconnectez-vous." };
      }
      this.isLoadingSubscribe = true;
      try {
        const data = await $fetch(joinApi(apiBase, ApiEndpoints.paymentSubscription), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          },
          body: { phone, deviseId }
        });
        if (data && typeof data === "object" && "code" in data) {
          const code = data.code;
          if (code !== 200 && code !== 201 && code !== "200" && code !== "201" && code !== 0 && code !== "0") {
            return {
              success: false,
              message: String((_a = data.message) != null ? _a : "Erreur lors du paiement")
            };
          }
        }
        return { success: true, data };
      } catch (error) {
        const msg = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.error) || (error == null ? void 0 : error.message) || "Impossible de contacter le serveur de paiement.";
        return { success: false, message: String(msg) };
      } finally {
        this.isLoadingSubscribe = false;
      }
    },
    async payWithCard(apiBase, deviseId) {
      var _a, _b, _c;
      const auth = useAuthStore();
      if (!auth.token) {
        return { success: false, message: "Session expir\xE9e. Reconnectez-vous." };
      }
      this.isLoadingSubscribe = true;
      try {
        const data = await $fetch(joinApi(apiBase, ApiEndpoints.paymentCard), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          },
          body: { deviseId }
        });
        if (data && typeof data === "object" && "code" in data) {
          const code = data.code;
          if (code !== 200 && code !== 201 && code !== "200" && code !== "201" && code !== 0 && code !== "0") {
            return {
              success: false,
              message: String((_a = data.message) != null ? _a : "Erreur lors du paiement par carte")
            };
          }
        }
        return { success: true, data };
      } catch (error) {
        const msg = ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || ((_c = error == null ? void 0 : error.data) == null ? void 0 : _c.error) || (error == null ? void 0 : error.message) || "Impossible de contacter le serveur de paiement par carte.";
        return { success: false, message: String(msg) };
      } finally {
        this.isLoadingSubscribe = false;
      }
    },
    async fetchPaymentHistory(apiBase, userId, force = false) {
      var _a;
      const auth = useAuthStore();
      if (!auth.token) return { payments: [], isPremium: null };
      if (!force && this.historyReady && this.historyUserId === userId) {
        return { payments: this.history, isPremium: this.lastHistoryPremium };
      }
      this.isLoadingHistory = true;
      try {
        const res = await $fetch(joinApi(apiBase, `${ApiEndpoints.paymentHistory}${userId}`), {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const log = res == null ? void 0 : res.log;
        const payments = ((_a = log == null ? void 0 : log.payment) != null ? _a : []).slice().sort((a, b) => {
          const dA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
          const dB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
          return dB - dA;
        });
        const u = log == null ? void 0 : log.user;
        const isPremium = (u == null ? void 0 : u.premium) === true || (u == null ? void 0 : u.isPremium) === true ? true : (u == null ? void 0 : u.premium) === false ? false : null;
        this.history = payments;
        this.historyUserId = userId;
        this.historyReady = true;
        this.lastHistoryPremium = isPremium;
        return { payments, isPremium };
      } catch (e) {
        console.error("fetchPaymentHistory:", e);
        if (this.historyUserId !== userId) {
          this.history = [];
          this.historyUserId = userId;
        }
        this.historyReady = true;
        return { payments: this.history, isPremium: this.lastHistoryPremium };
      } finally {
        this.isLoadingHistory = false;
      }
    }
  }
});

export { usePaymentStore as u };
//# sourceMappingURL=payment-AcOCiBy0.mjs.map
