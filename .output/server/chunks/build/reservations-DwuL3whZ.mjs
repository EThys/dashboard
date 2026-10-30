import { defineStore } from 'pinia';
import { l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { g as getReservationListingEntity, e as extractListingPhotoFromEntity, r as resolveReservationPropertyDetailId, p as pickMemberRecord, a as pickOwnerHostFromListing, m as memberAvatar, b as memberDisplayName } from './partyExtract-LSdOdPXy.mjs';

function getUserCertified(user) {
  var _a;
  if (!user) return false;
  const v = (_a = user.certified) != null ? _a : user.isCertified;
  return v === true || v === "true" || v === 1;
}
function getUserPremium(user) {
  var _a;
  if (!user) return false;
  const v = (_a = user.premium) != null ? _a : user.isPremium;
  return v === true || v === "true" || v === 1;
}
function evaluateReservationEligibility(user) {
  const certified = getUserCertified(user);
  const premium = getUserPremium(user);
  if (certified && premium) {
    return { ok: true, certified, premium };
  }
  if (!certified) {
    return {
      ok: false,
      certified,
      premium,
      code: "NOT_CERTIFIED",
      message: "Votre profil doit \xEAtre certifi\xE9 (pi\xE8ce d\u2019identit\xE9 valid\xE9e) avant de pouvoir r\xE9server un bien."
    };
  }
  return {
    ok: false,
    certified,
    premium,
    code: "NOT_PREMIUM",
    message: "Un abonnement CasaNayo Premium (5 $ US / an) est requis pour effectuer une r\xE9servation. Souscrivez depuis votre espace."
  };
}
function getStatusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return "En attente";
  if (s === "CONFIRMED" || s === "ACCEPTED") return "Confirm\xE9";
  if (s === "COMPLETED" || s === "FINISHED") return "Termin\xE9";
  if (s === "CANCELLED" || s === "REJECTED") return "Annul\xE9";
  return s || "Inconnu";
}
function extractReservationArray(payload) {
  var _a, _b;
  if (!payload || typeof payload !== "object") return [];
  const o = payload;
  const arr = (_b = (_a = o.reservation) != null ? _a : o.reservations) != null ? _b : o.data;
  return Array.isArray(arr) ? arr : [];
}
function normalizeReservation(raw, sourceCategory) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  const innerRes = r.reservation && typeof r.reservation === "object" ? r.reservation : null;
  const merged = innerRes ? { ...r, ...innerRes } : r;
  const rid = (_a = merged.reservationId) != null ? _a : merged.id;
  const numId = typeof rid === "number" ? rid : parseInt(String(rid), 10);
  if (!Number.isFinite(numId)) return null;
  const prop = (_b = merged.property) != null ? _b : r.property;
  const listingEnt = (_c = getReservationListingEntity(merged)) != null ? _c : prop;
  let propertyTitle = prop == null ? void 0 : prop.title;
  if (!propertyTitle && listingEnt) {
    propertyTitle = listingEnt.title || listingEnt.name || listingEnt.label || void 0;
  }
  if (!propertyTitle) {
    const labels = {
      vacance: "S\xE9jour / location",
      terrain: "Terrain",
      bureau: "Bureau",
      festive: "Salle festive",
      funeraire: "Espace fun\xE9raire",
      chambre: "Chambre / h\xF4tel",
      standard: "Propri\xE9t\xE9"
    };
    propertyTitle = labels[sourceCategory] || "R\xE9servation";
  }
  let propertyImage = extractListingPhotoFromEntity(listingEnt);
  if (!propertyImage && prop) {
    propertyImage = extractListingPhotoFromEntity(prop);
  }
  const propertyDetailId = resolveReservationPropertyDetailId(merged);
  let propertyType = (listingEnt == null ? void 0 : listingEnt.type) || (merged == null ? void 0 : merged.typeProperty) || (prop == null ? void 0 : prop.type);
  if (!propertyType && (listingEnt == null ? void 0 : listingEnt.category)) {
    propertyType = listingEnt.category;
  }
  if (propertyType && String(propertyType).toUpperCase() === "STANDARD") {
    propertyType = "Propri\xE9t\xE9";
  }
  const guestUserRec = pickMemberRecord(
    merged.user,
    merged.member,
    merged.client,
    merged.guest,
    merged.requestedBy,
    r.user,
    innerRes == null ? void 0 : innerRes.user,
    innerRes == null ? void 0 : innerRes.member
  );
  const guestUserIdRaw = (_e = (_d = merged.userId) != null ? _d : innerRes == null ? void 0 : innerRes.userId) != null ? _e : guestUserRec == null ? void 0 : guestUserRec.userId;
  const guestUserId = (() => {
    if (typeof guestUserIdRaw === "number" && Number.isFinite(guestUserIdRaw)) return guestUserIdRaw;
    const p = parseInt(String(guestUserIdRaw != null ? guestUserIdRaw : ""), 10);
    return Number.isFinite(p) ? p : void 0;
  })();
  const hostUserRec = pickOwnerHostFromListing(listingEnt) || pickOwnerHostFromListing(prop) || pickMemberRecord(merged.host, merged.owner, merged.propertyOwner, merged.publisher, r.host);
  const hostUserIdRaw = (_g = (_f = hostUserRec == null ? void 0 : hostUserRec.userId) != null ? _f : listingEnt == null ? void 0 : listingEnt.userId) != null ? _g : prop == null ? void 0 : prop.userId;
  const hostUserId = (() => {
    if (typeof hostUserIdRaw === "number" && Number.isFinite(hostUserIdRaw)) return hostUserIdRaw;
    const p = parseInt(String(hostUserIdRaw != null ? hostUserIdRaw : ""), 10);
    return Number.isFinite(p) ? p : void 0;
  })();
  const userImage = r.userImage || merged.userImage || (guestUserRec == null ? void 0 : guestUserRec.userImage);
  return {
    reservationId: numId,
    status: String((_h = merged.status) != null ? _h : "UNKNOWN").toUpperCase(),
    displayStatus: getStatusLabel(String((_i = merged.status) != null ? _i : "UNKNOWN")),
    type: merged.type,
    propertyType,
    message: merged.message,
    startDate: merged.startDate,
    endDate: merged.endDate,
    reservationHeure: merged.reservationHeure,
    createdAt: merged.createdAt,
    cancellationReason: merged.cancellationReason,
    propertyTitle,
    propertyImage,
    propertyDetailId,
    guestDisplayName: memberDisplayName(guestUserRec, guestUserId),
    guestProfileImage: userImage || memberAvatar(guestUserRec),
    guestUserId,
    hostDisplayName: memberDisplayName(hostUserRec, hostUserId),
    hostProfileImage: memberAvatar(hostUserRec),
    hostUserId,
    sourceCategory,
    userImage,
    raw: r
  };
}
const useReservationStore = defineStore("reservations", {
  state: () => ({
    isSubmitting: false,
    lastError: null,
    userReservations: [],
    hostReservations: [],
    platformReservations: []
  }),
  actions: {
    async createReservation(propertyType, id, details) {
      var _a, _b;
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
      const elig = evaluateReservationEligibility(auth.user);
      if (!elig.ok) {
        return {
          success: false,
          message: (_a = elig.message) != null ? _a : "R\xE9servation non autoris\xE9e.",
          code: elig.code
        };
      }
      this.isSubmitting = true;
      this.lastError = null;
      let path = ApiEndpoints.createReservation;
      const userId = auth.user.userId || auth.user.id || auth.user.userId;
      const body = {
        userId,
        startDate: details.startDate,
        endDate: details.endDate,
        message: details.message || "Demande de r\xE9servation via Dashboard",
        type: details.type || "STANDARD",
        reservationHeure: details.reservationHeure || (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour12: false })
      };
      const type = propertyType.toLowerCase();
      if (type.includes("terrain")) {
        path = ApiEndpoints.addReservationTerrain;
        body.terrainId = id;
      } else if (type.includes("bureau")) {
        path = ApiEndpoints.addReservationBureau;
        body.bureauId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      } else if (type.includes("festive") || type.includes("f\xEAte")) {
        path = ApiEndpoints.addReservationFestive;
        body.festiveId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      } else if (type.includes("funeraire")) {
        path = ApiEndpoints.addReservationFuneraire;
        body.funeraireId = id;
      } else if (type === "chambre" || type.includes("chambre") && !type.includes("vacance")) {
        path = ApiEndpoints.addReservationRoom;
        body.chambreId = id;
      } else if (type.includes("vacance")) {
        path = ApiEndpoints.addReservationVacance;
        body.vacanceId = id;
      } else {
        path = ApiEndpoints.createReservation;
        body.propertyId = id;
        body.createdAt = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        body.status = "PENDING";
      }
      try {
        console.log("Attempting reservation with token:", auth.token ? `${auth.token.substring(0, 10)}...` : "NULL");
        const response = await $fetch(joinApi(config.public.apiBase, path), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${auth.token}`
          },
          body
        });
        this.isSubmitting = false;
        this.fetchUserReservations(true);
        return { success: true, data: response };
      } catch (error) {
        this.isSubmitting = false;
        console.error("Reservation API Error:", error.status, error.data);
        if (error.status === 401 || error.status === 403) {
          return { success: false, message: "Session invalide ou expir\xE9e (Erreur Serveur). Veuillez vous reconnecter." };
        }
        this.lastError = ((_b = error.data) == null ? void 0 : _b.message) || "Erreur lors de la r\xE9servation";
        return { success: false, message: this.lastError };
      }
    },
    /**
     * Toutes les réservations du membre (standard + spécialisées), comme ReservationController.getMyReservations().
     */
    async fetchUserReservations(force = false) {
      if (!force && this.userReservations.length > 0) return this.userReservations;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) {
        auth.checkSession();
      }
      if (!auth.isAuthenticated || !auth.token) return [];
      const user = auth.user;
      if (!user) return [];
      const userId = user.userId || user.id;
      if (userId == null) return [];
      const apiBase = config.public.apiBase;
      const headers = { Authorization: `Bearer ${auth.token}` };
      const endpoints = [
        {
          cat: "standard",
          path: joinApi(
            apiBase,
            `${ApiEndpoints.reservationsProtected}/${ApiEndpoints.reservationsByUser}/${userId}`
          )
        },
        { cat: "vacance", path: joinApi(apiBase, `${ApiEndpoints.reservationsVacanceByUser}${userId}`) },
        { cat: "terrain", path: joinApi(apiBase, `${ApiEndpoints.reservationsTerrainByUser}${userId}`) },
        { cat: "funeraire", path: joinApi(apiBase, `${ApiEndpoints.reservationsFuneraireByUser}${userId}`) },
        { cat: "festive", path: joinApi(apiBase, `${ApiEndpoints.reservationsFestiveByUser}${userId}`) },
        { cat: "bureau", path: joinApi(apiBase, `${ApiEndpoints.reservationsBureauByUser}${userId}`) },
        { cat: "chambre", path: joinApi(apiBase, `${ApiEndpoints.reservationsChambreByUser}${userId}`) }
      ];
      const collected = [];
      await Promise.all(
        endpoints.map(async ({ cat, path }) => {
          try {
            const data = await $fetch(path, { headers });
            for (const item of extractReservationArray(data)) {
              const n = normalizeReservation(item, cat);
              if (n) collected.push(n);
            }
          } catch (e) {
            console.warn(`[reservations] ${path}`, e);
          }
        })
      );
      const seen = /* @__PURE__ */ new Set();
      const deduped = collected.filter((r) => {
        if (seen.has(r.reservationId)) return false;
        seen.add(r.reservationId);
        return true;
      });
      deduped.sort((a, b) => {
        const da = a.createdAt || a.startDate || "";
        const db = b.createdAt || b.startDate || "";
        return db.localeCompare(da);
      });
      this.userReservations = deduped;
      return deduped;
    },
    /**
     * Toutes les réservations / visites de la plateforme (admin).
     * Si la liste globale est indisponible, retombe sur les demandes reçues par le compte connecté.
     */
    async fetchPlatformReservations(force = false) {
      if (!force && this.platformReservations.length > 0) return this.platformReservations;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.token) {
        auth.checkSession();
      }
      if (!auth.token) return [];
      const headers = { Authorization: `Bearer ${auth.token}` };
      const path = joinApi(config.public.apiBase, ApiEndpoints.allReservations);
      try {
        const data = await $fetch(path, { headers });
        const list = Array.isArray(data) ? data : extractReservationArray(data);
        const collected = [];
        for (const item of list) {
          const n = normalizeReservation(item, "standard");
          if (n) collected.push(n);
        }
        collected.sort((a, b) => {
          const da = a.createdAt || a.startDate || "";
          const db = b.createdAt || b.startDate || "";
          return db.localeCompare(da);
        });
        if (collected.length > 0) {
          this.platformReservations = collected;
          return collected;
        }
      } catch (e) {
        console.warn(`[reservations platform] ${path}`, e);
      }
      const host = await this.fetchHostReservations(force);
      this.platformReservations = host;
      return host;
    },
    /**
     * Réservations reçues en tant qu’hôte (sur vos annonces) — aligné sur
     * ReservationController.getHostReservations() (endpoints `.../user/host/{id}`).
     */
    async fetchHostReservations(force = false) {
      if (!force && this.hostReservations.length > 0) return this.hostReservations;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) {
        auth.checkSession();
      }
      if (!auth.isAuthenticated || !auth.token) return [];
      const user = auth.user;
      if (!user) return [];
      const userId = user.userId || user.id;
      if (userId == null) return [];
      const apiBase = config.public.apiBase;
      const headers = { Authorization: `Bearer ${auth.token}` };
      const endpoints = [
        { cat: "standard", path: joinApi(apiBase, `${ApiEndpoints.reservationsHost}${userId}`) },
        { cat: "vacance", path: joinApi(apiBase, `${ApiEndpoints.reservationsVacanceByHost}${userId}`) },
        { cat: "terrain", path: joinApi(apiBase, `${ApiEndpoints.reservationsTerrainByHost}${userId}`) },
        { cat: "funeraire", path: joinApi(apiBase, `${ApiEndpoints.reservationsFuneraireByHost}${userId}`) },
        { cat: "festive", path: joinApi(apiBase, `${ApiEndpoints.reservationsFestiveByHost}${userId}`) },
        { cat: "bureau", path: joinApi(apiBase, `${ApiEndpoints.reservationsBureauByHost}${userId}`) },
        { cat: "chambre", path: joinApi(apiBase, `${ApiEndpoints.reservationsChambreByHost}${userId}`) }
      ];
      const collected = [];
      await Promise.all(
        endpoints.map(async ({ cat, path }) => {
          try {
            const data = await $fetch(path, { headers });
            for (const item of extractReservationArray(data)) {
              const n = normalizeReservation(item, cat);
              if (n) collected.push(n);
            }
          } catch (e) {
            console.warn(`[reservations host] ${path}`, e);
          }
        })
      );
      const seen = /* @__PURE__ */ new Set();
      const deduped = collected.filter((r) => {
        if (seen.has(r.reservationId)) return false;
        seen.add(r.reservationId);
        return true;
      });
      deduped.sort((a, b) => {
        const da = a.createdAt || a.startDate || "";
        const db = b.createdAt || b.startDate || "";
        return db.localeCompare(da);
      });
      this.hostReservations = deduped;
      return deduped;
    },
    /**
     * Réservations chambre / hôtel reçues en tant qu’hôte uniquement
     * (`GET .../protected/reservations/chambre/user/host/{userId}`).
     */
    async fetchHostChambreReservationsOnly(force = false) {
      var _a, _b;
      const auth = useAuthStore();
      const userId = ((_a = auth.user) == null ? void 0 : _a.userId) || ((_b = auth.user) == null ? void 0 : _b.id);
      if (!force && this.hostReservations.length > 0) {
        const cached = this.hostReservations.filter((r) => r.sourceCategory === "chambre");
        if (cached.length > 0) return cached;
      }
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) {
        auth.checkSession();
      }
      if (!auth.isAuthenticated || !auth.token) return [];
      const user = auth.user;
      if (!user) return [];
      if (userId == null) return [];
      const apiBase = config.public.apiBase;
      const headers = { Authorization: `Bearer ${auth.token}` };
      const path = joinApi(apiBase, `${ApiEndpoints.reservationsChambreByHost}${userId}`);
      try {
        const data = await $fetch(path, { headers });
        const collected = [];
        for (const item of extractReservationArray(data)) {
          const n = normalizeReservation(item, "chambre");
          if (n) collected.push(n);
        }
        collected.sort((a, b) => {
          const da = a.createdAt || a.startDate || "";
          const db = b.createdAt || b.startDate || "";
          return db.localeCompare(da);
        });
        return collected;
      } catch (e) {
        console.warn(`[reservations host chambre] ${path}`, e);
        return [];
      }
    },
    /** Compteurs par statut (depuis la liste déjà chargée ou refetch léger). */
    countByStatus(list) {
      const norm = (s) => s.toUpperCase();
      return {
        all: list.length,
        pending: list.filter((r) => norm(r.status) === "PENDING").length,
        confirmed: list.filter((r) => norm(r.status) === "CONFIRMED" || norm(r.status) === "ACCEPTED").length,
        completed: list.filter((r) => norm(r.status) === "COMPLETED" || norm(r.status) === "FINISHED").length,
        cancelled: list.filter((r) => norm(r.status) === "CANCELLED" || norm(r.status) === "REJECTED").length
      };
    },
    async validateReservationNotification(reservationId, accept) {
      var _a;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return { success: false, message: "Non authentifi\xE9" };
      try {
        await $fetch(
          joinApi(
            config.public.apiBase,
            `${ApiEndpoints.validateReservationNotification}${reservationId}/${accept}`
          ),
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${auth.token}` },
            body: {}
          }
        );
        return { success: true };
      } catch (e) {
        const msg = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message) || "Action impossible";
        return { success: false, message: String(msg) };
      }
    },
    /** Annulation côté client — aligné ReservationController.cancelReservation (DELETE + motif). */
    async cancelReservation(reservationId, cancellationReason) {
      var _a;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return { success: false, message: "Non authentifi\xE9" };
      try {
        await $fetch(
          joinApi(
            config.public.apiBase,
            `${ApiEndpoints.reservations}/delete/${reservationId}`
          ),
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json"
            },
            body: {
              cancellationReason: (cancellationReason == null ? void 0 : cancellationReason.trim()) || "Annul\xE9e par l\u2019utilisateur"
            }
          }
        );
        return { success: true };
      } catch (e) {
        const msg = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message) || "Annulation impossible";
        return { success: false, message: String(msg) };
      }
    }
  }
});

export { useReservationStore as u };
//# sourceMappingURL=reservations-DwuL3whZ.mjs.map
