import { defineStore } from 'pinia';
import { l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { f as firstUrlFromImageLike, a as firstUrlFromImageArray, p as pickMemberRecord, e as extractProfilePhoto, m as memberDisplayName } from './partyExtract-C97-iyVh.mjs';

function getStatusLabel(status) {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING") return "En attente";
  if (s === "ACCEPTED" || s === "CONFIRMED") return "Accept\xE9e";
  if (s === "REJECTED" || s === "CANCELLED") return "Refus\xE9e";
  return s || "Inconnu";
}
function extractSollicitationArray(payload) {
  if (!payload || typeof payload !== "object") return [];
  const o = payload;
  if (Array.isArray(payload)) return payload;
  const fromData = o.data;
  if (Array.isArray(fromData)) return fromData;
  const fromSol = o.sollicitation;
  if (Array.isArray(fromSol)) return fromSol;
  const fromRes = o.reservation;
  if (Array.isArray(fromRes)) return fromRes;
  return [];
}
function normalizeSolicitation(raw) {
  var _a, _b, _c, _d, _e, _f;
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  const inner = r.sollicitation && typeof r.sollicitation === "object" ? r.sollicitation : r;
  const idRaw = (_a = inner.id) != null ? _a : r.id;
  const numId = typeof idRaw === "number" ? idRaw : parseInt(String(idRaw), 10);
  if (!Number.isFinite(numId)) return null;
  const prest = (_b = inner.prestation) != null ? _b : r.prestation;
  const prestInner = (prest == null ? void 0 : prest.prestation) && typeof prest.prestation === "object" ? prest.prestation : prest;
  let prestationTitle;
  if (prestInner == null ? void 0 : prestInner.title) prestationTitle = String(prestInner.title);
  else if (prest == null ? void 0 : prest.title) prestationTitle = String(prest.title);
  let prestationImage = firstUrlFromImageLike((_c = prestInner == null ? void 0 : prestInner.image) != null ? _c : prest == null ? void 0 : prest.image) || firstUrlFromImageArray(prestInner == null ? void 0 : prestInner.images) || firstUrlFromImageArray(prest == null ? void 0 : prest.images);
  const u = (_d = inner.user) != null ? _d : r.user;
  const uInner = (u == null ? void 0 : u.user) && typeof u.user === "object" ? u.user : u;
  const requesterRec = pickMemberRecord(
    uInner,
    u,
    inner.member,
    inner.client,
    inner.demandeur,
    inner.requestedBy,
    r.member
  );
  const requesterUidRaw = typeof inner.userId === "number" ? inner.userId : parseInt(String((_e = inner.userId) != null ? _e : ""), 10);
  const requesterUid = Number.isFinite(requesterUidRaw) ? requesterUidRaw : void 0;
  const requesterUsername = (requesterRec == null ? void 0 : requesterRec.username) || (uInner == null ? void 0 : uInner.username) || (u == null ? void 0 : u.username) || void 0;
  const providerUser = pickMemberRecord(
    prestInner == null ? void 0 : prestInner.user,
    prest == null ? void 0 : prest.user,
    inner.prestataire,
    prest == null ? void 0 : prest.prestataire,
    prest == null ? void 0 : prest.account,
    inner.host
  ) || ((prestInner == null ? void 0 : prestInner.user) && typeof prestInner.user === "object" ? prestInner.user : void 0) || ((prest == null ? void 0 : prest.user) && typeof prest.user === "object" ? prest.user : void 0);
  const providerProfileImage = (typeof (prestInner == null ? void 0 : prestInner.profile) === "string" && prestInner.profile.trim() ? prestInner.profile.trim() : void 0) || (typeof (prest == null ? void 0 : prest.profile) === "string" && prest.profile.trim() ? prest.profile.trim() : void 0) || extractProfilePhoto(providerUser);
  const requesterProfileImage = extractProfilePhoto(requesterRec) || extractProfilePhoto(uInner) || extractProfilePhoto(u);
  const providerUsername = (providerUser == null ? void 0 : providerUser.username) || (prestInner == null ? void 0 : prestInner.username) || (prestInner == null ? void 0 : prestInner.postBy) || (prest == null ? void 0 : prest.username) || void 0;
  const requesterDisplayName = memberDisplayName(requesterRec, requesterUid);
  const providerDisplayName = memberDisplayName(providerUser, void 0);
  const status = String((_f = inner.status) != null ? _f : "PENDING").toUpperCase();
  return {
    id: numId,
    userId: typeof inner.userId === "number" ? inner.userId : parseInt(String(inner.userId), 10) || void 0,
    prestationId: typeof inner.prestationId === "number" ? inner.prestationId : parseInt(String(inner.prestationId), 10) || void 0,
    deviseId: typeof inner.deviseId === "number" ? inner.deviseId : parseInt(String(inner.deviseId), 10) || void 0,
    budget: typeof inner.budget === "number" ? inner.budget : parseFloat(String(inner.budget || 0)) || void 0,
    description: inner.description,
    status,
    displayStatus: getStatusLabel(status),
    startDate: inner.startDate,
    endDate: inner.endDate,
    createdAt: inner.createdAt,
    prestationTitle,
    prestationImage,
    providerProfileImage,
    requesterProfileImage,
    requesterUsername,
    providerUsername,
    requesterDisplayName,
    providerDisplayName,
    raw: r
  };
}
const useSolicitationStore = defineStore("solicitations", {
  state: () => ({
    isUpdating: false,
    userSolicitations: [],
    hostSolicitations: [],
    userSolicitationsOwnerId: null,
    hostSolicitationsOwnerId: null,
    userSolicitationsLoaded: false,
    hostSolicitationsLoaded: false
  }),
  actions: {
    async fetchUserSolicitations(force = false) {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) auth.checkSession();
      if (!auth.isAuthenticated || !auth.token) return [];
      const userId = auth.user.userId || auth.user.id;
      if (userId == null) return [];
      if (!force && this.userSolicitationsLoaded && this.userSolicitationsOwnerId === userId) {
        return this.userSolicitations;
      }
      const apiBase = config.public.apiBase;
      const url = joinApi(apiBase, `${ApiEndpoints.sollicitationsByUser}${userId}`);
      try {
        const res = await $fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const list = extractSollicitationArray(res);
        const out = [];
        for (const item of list) {
          const n = normalizeSolicitation(item);
          if (n) out.push(n);
        }
        out.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        this.userSolicitations = out;
        this.userSolicitationsOwnerId = userId;
        this.userSolicitationsLoaded = true;
        return out;
      } catch (e) {
        console.warn("[solicitations user]", e);
        return [];
      }
    },
    async fetchHostSolicitations(force = false) {
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) auth.checkSession();
      if (!auth.isAuthenticated || !auth.token) return [];
      const userId = auth.user.userId || auth.user.id;
      if (userId == null) return [];
      if (!force && this.hostSolicitationsLoaded && this.hostSolicitationsOwnerId === userId) {
        return this.hostSolicitations;
      }
      const apiBase = config.public.apiBase;
      const url = joinApi(apiBase, `${ApiEndpoints.sollicitationsByHost}${userId}`);
      try {
        const res = await $fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const list = extractSollicitationArray(res);
        const out = [];
        for (const item of list) {
          const n = normalizeSolicitation(item);
          if (n) out.push(n);
        }
        out.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        this.hostSolicitations = out;
        this.hostSolicitationsOwnerId = userId;
        this.hostSolicitationsLoaded = true;
        return out;
      } catch (e) {
        console.warn("[solicitations host]", e);
        return [];
      }
    },
    async updateStatus(sollicitationId, status) {
      var _a;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.token) return { success: false, message: "Non authentifi\xE9" };
      this.isUpdating = true;
      try {
        await $fetch(joinApi(config.public.apiBase, `${ApiEndpoints.updateSollicitation}${sollicitationId}`), {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json"
          },
          body: { status }
        });
        return { success: true };
      } catch (e) {
        const msg = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message) || "Mise \xE0 jour impossible";
        return { success: false, message: String(msg) };
      } finally {
        this.isUpdating = false;
      }
    },
    countByStatus(list) {
      const norm = (s) => s.toUpperCase();
      return {
        all: list.length,
        pending: list.filter((x) => norm(x.status) === "PENDING").length,
        accepted: list.filter((x) => norm(x.status) === "ACCEPTED" || norm(x.status) === "CONFIRMED").length,
        rejected: list.filter((x) => norm(x.status) === "REJECTED" || norm(x.status) === "CANCELLED").length
      };
    }
  }
});

export { useSolicitationStore as u };
//# sourceMappingURL=solicitations-DzML77og.mjs.map
