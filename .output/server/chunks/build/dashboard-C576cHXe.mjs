import { defineStore } from 'pinia';
import { m as useAuthStore, j as joinApi, A as ApiEndpoints } from './server.mjs';

const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    users: [],
    properties: [],
    services: [],
    payments: [],
    flatPayments: [],
    // Deduplicated flat payments for global use
    devises: [],
    lastFetch: null,
    isLoading: false
  }),
  actions: {
    async fetchStats(apiBase, force = false) {
      var _a;
      const auth = useAuthStore();
      if (!force && this.lastFetch && (/* @__PURE__ */ new Date()).getTime() - this.lastFetch.getTime() < 3e5) {
        return;
      }
      this.isLoading = true;
      try {
        const authHeaders = auth.token ? { Authorization: `Bearer ${auth.token}` } : void 0;
        const isAdmin = auth.isAdmin;
        const [usersRes, propRes, terrainRes, bureauRes, hotelRes, festiveRes, funeraireRes, servRes, payRes, devRes] = await Promise.all([
          auth.token ? $fetch(joinApi(apiBase, ApiEndpoints.allUsers), { headers: authHeaders }) : Promise.resolve({ data: [] }),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedProperties : ApiEndpoints.properties), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyTerrains : ApiEndpoints.propertyTerrains), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyBureaux : ApiEndpoints.propertyBureaux), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyHotels : ApiEndpoints.propertyHotelsPublic), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyFestives : ApiEndpoints.propertyFestives), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, isAdmin ? ApiEndpoints.protectedPropertyFuneraires : ApiEndpoints.propertyFuneraires), isAdmin ? { headers: authHeaders } : void 0),
          $fetch(joinApi(apiBase, ApiEndpoints.publicPrestations)),
          auth.isAdmin && auth.token ? $fetch(joinApi(apiBase, ApiEndpoints.paymentUsers), { headers: authHeaders }) : Promise.resolve({ payments: [] }),
          auth.token ? $fetch(joinApi(apiBase, ApiEndpoints.devises), { headers: authHeaders }) : Promise.resolve({ devises: [] })
        ]);
        this.users = usersRes.data || usersRes || [];
        this.properties = [
          ...propRes.properties || [],
          ...terrainRes.terrain || [],
          ...bureauRes.bureaux || [],
          ...hotelRes.data || [],
          ...festiveRes.festives || [],
          ...funeraireRes.funeraires || []
        ];
        this.services = servRes.prestations || servRes || [];
        if (payRes && payRes.payments) {
          const groups = Array.isArray(payRes == null ? void 0 : payRes.payments) ? payRes.payments : [];
          const tempAll = [];
          groups.forEach((g) => {
            const list = Array.isArray(g.payment) ? g.payment : [];
            list.forEach((p) => tempAll.push(p));
          });
          this.payments = tempAll;
          const seen = /* @__PURE__ */ new Set();
          const flatOut = [];
          for (const g of groups) {
            const u = g.user;
            const list = Array.isArray(g.payment) ? g.payment : [];
            for (const p of list) {
              const uid = (_a = p.userId) != null ? _a : u == null ? void 0 : u.userId;
              const key = `${uid}-${p.id}`;
              if (seen.has(key)) continue;
              seen.add(key);
              flatOut.push({ user: u, payment: { ...p, userId: uid } });
            }
          }
          flatOut.sort((a, b) => {
            var _a2, _b;
            const idA = (_a2 = a.payment.id) != null ? _a2 : 0;
            const idB = (_b = b.payment.id) != null ? _b : 0;
            return idB - idA;
          });
          this.flatPayments = flatOut;
        }
        if (devRes && devRes.devises) {
          this.devises = devRes.devises;
        }
        this.lastFetch = /* @__PURE__ */ new Date();
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});

export { useDashboardStore as u };
//# sourceMappingURL=dashboard-C576cHXe.mjs.map
