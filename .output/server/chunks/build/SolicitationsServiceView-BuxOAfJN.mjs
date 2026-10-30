import { _ as _sfc_main$2 } from './CasaListCardShimmer-D0zSGUKF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, openBlock, createBlock, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { Wrench, Loader2, RefreshCw, User, Sparkles, Calendar, Banknote, ChevronLeft, ChevronRight, Download } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$3 } from './Badge-CZaU8sYj.mjs';
import { defineStore } from 'pinia';
import { l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { f as firstUrlFromImageLike, c as firstUrlFromImageArray, p as pickMemberRecord, d as extractProfilePhoto, b as memberDisplayName } from './partyExtract-LSdOdPXy.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { f as formatCurrency, g as getCurrencyLabel } from './currency-BoakoUK-.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';

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
    hostSolicitations: []
  }),
  actions: {
    async fetchUserSolicitations(force = false) {
      if (!force && this.userSolicitations.length > 0) return this.userSolicitations;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) auth.checkSession();
      if (!auth.isAuthenticated || !auth.token) return [];
      const userId = auth.user.userId || auth.user.id;
      if (userId == null) return [];
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
        return out;
      } catch (e) {
        console.warn("[solicitations user]", e);
        return [];
      }
    },
    async fetchHostSolicitations(force = false) {
      if (!force && this.hostSolicitations.length > 0) return this.hostSolicitations;
      const auth = useAuthStore();
      const config = useRuntimeConfig();
      if (!auth.isAuthenticated || !auth.user) auth.checkSession();
      if (!auth.isAuthenticated || !auth.token) return [];
      const userId = auth.user.userId || auth.user.id;
      if (userId == null) return [];
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
const itemsPerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SolicitationsServiceView",
  __ssrInlineRender: true,
  props: {
    embedded: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const solStore = useSolicitationStore();
    useAuthStore();
    const list = ref([]);
    const loading = ref(true);
    const showBannerSubtitle = ref(true);
    const activeTab = ref(0);
    const perspective = ref("mine");
    const tabs = [
      { key: "ALL", label: "Toutes" },
      { key: "PENDING", label: "En attente" },
      { key: "ACCEPTED", label: "Accept\xE9es" },
      { key: "REJECTED", label: "Refus\xE9es" }
    ];
    function getCurrencyCode(deviseId) {
      return deviseId === 1 ? "CDF" : "USD";
    }
    const currentPage = ref(1);
    async function load(force = false) {
      const hasData = perspective.value === "mine" ? solStore.userSolicitations.length > 0 : solStore.hostSolicitations.length > 0;
      if (!hasData || force) {
        loading.value = true;
      }
      try {
        const data = perspective.value === "mine" ? await solStore.fetchUserSolicitations(force) : await solStore.fetchHostSolicitations(force);
        list.value = data;
        currentPage.value = 1;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    }
    watch(perspective, () => {
      activeTab.value = 0;
      currentPage.value = 1;
      closeDetail();
      load(false);
    });
    watch(activeTab, () => {
      currentPage.value = 1;
    });
    const statsLoading = computed(() => loading.value && list.value.length === 0);
    const counts = computed(() => solStore.countByStatus(list.value));
    function filterByTab(items, tabKey) {
      const sorted = [...items].sort((a, b) => {
        const da = new Date(a.createdAt || a.startDate || 0).getTime();
        const db = new Date(b.createdAt || b.startDate || 0).getTime();
        return db - da;
      });
      if (tabKey === "ALL") return sorted;
      return sorted.filter((s) => s.status === tabKey);
    }
    const filteredList = computed(() => {
      var _a;
      const key = (_a = tabs[activeTab.value]) == null ? void 0 : _a.key;
      if (!key) return [];
      return filterByTab(list.value, key);
    });
    const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage));
    const displayed = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredList.value.slice(start, start + itemsPerPage);
    });
    function formatDate(dateStr) {
      if (!dateStr) return "\u2014";
      try {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        });
      } catch {
        return dateStr;
      }
    }
    function statusBadgeClass(status) {
      const s = String(status || "").toUpperCase();
      switch (s) {
        case "PENDING":
          return "bg-amber-50 text-amber-800 border-amber-200";
        case "ACCEPTED":
        case "CONFIRMED":
          return "bg-emerald-50 text-emerald-800 border-emerald-200";
        case "REJECTED":
        case "CANCELLED":
          return "bg-red-50 text-red-800 border-red-200";
        default:
          return "bg-slate-50 text-slate-700 border-slate-200";
      }
    }
    const shellClass = computed(
      () => props.embedded ? "space-y-8" : "min-h-screen bg-[#F5F6FA] pb-16 pt-6 sm:pt-10"
    );
    async function setStatus(item, status) {
      const r = await solStore.updateStatus(item.id, status);
      if (r.success) {
        toast.success(status === "ACCEPTED" ? "Sollicitation accept\xE9e" : "Sollicitation refus\xE9e", {
          description: "Confirmation envoy\xE9e \xE0 l\u2019autre partie."
        });
        closeDetail();
        await load(true);
      } else {
        toast.error(r.message || "Action impossible");
      }
    }
    const detailOpen = ref(false);
    const detailItem = ref(null);
    function closeDetail() {
      detailOpen.value = false;
      detailItem.value = null;
    }
    function counterpartyAvatar(item) {
      return perspective.value === "mine" ? item.providerProfileImage : item.requesterProfileImage;
    }
    function counterpartyLabel(item) {
      if (perspective.value === "mine") {
        const d2 = item.providerDisplayName;
        if (d2 && d2 !== "\u2014") return d2;
        return item.providerUsername || "Prestataire";
      }
      const d = item.requesterDisplayName;
      if (d && d !== "\u2014") return d;
      return item.requesterUsername || "Demandeur";
    }
    function counterpartySubline(item) {
      if (perspective.value === "mine") {
        if (item.providerUsername && item.providerDisplayName && item.providerDisplayName !== item.providerUsername)
          return `@${item.providerUsername}`;
        return null;
      }
      if (item.requesterUsername && item.requesterDisplayName && item.requesterDisplayName !== item.requesterUsername)
        return `@${item.requesterUsername}`;
      return null;
    }
    const downloadingPdf = ref(false);
    async function handleDownloadSolicitationPdf() {
      detailItem.value;
      return;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiCasaListCardShimmer = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(shellClass) }, _attrs))}><div class="${ssrRenderClass(__props.embedded ? "" : "mx-auto max-w-6xl px-4 sm:px-6")}"><div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-xl sm:p-8 mb-8"><div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-start gap-4"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">`);
      _push(ssrRenderComponent(unref(Wrench), { class: "size-7 text-white" }, null, _parent));
      _push(`</div><div><h1 class="text-2xl font-bold tracking-tight sm:text-3xl">${ssrInterpolate(unref(perspective) === "mine" ? "Mes sollicitations (services)" : "Sollicitations sur mes prestations")}</h1>`);
      if (unref(showBannerSubtitle)) {
        _push(`<p class="mt-1 max-w-xl text-sm text-blue-100 italic opacity-90 transition-all duration-700">${ssrInterpolate(unref(perspective) === "mine" ? "Vos demandes aupr\xE8s des prestataires (endpoint utilisateur)." : "Demandes re\xE7ues sur vos annonces de services (endpoint h\xF4te /user/host/).")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        type: "button",
        variant: "secondary",
        class: "h-11 shrink-0 rounded-xl border-0 bg-white/15 font-bold text-white hover:bg-white/25",
        disabled: unref(loading),
        onClick: ($event) => load(true)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(loading)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(RefreshCw), { class: "mr-2 size-4" }, null, _parent2, _scopeId));
            }
            _push2(` Actualiser `);
          } else {
            return [
              unref(loading) ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 size-4 animate-spin"
              })) : (openBlock(), createBlock(unref(RefreshCw), {
                key: 1,
                class: "mr-2 size-4"
              })),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(statsLoading)) {
        _push(`<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="rounded-2xl px-4 py-3 casa-shimmer-blue min-h-[4.5rem]"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Total</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).all)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">En attente</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).pending)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Accept\xE9es</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).accepted)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Refus\xE9es</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).rejected)}</p></div></div>`);
      }
      _push(`</div><div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs font-bold uppercase tracking-wider text-slate-500"></p><div class="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist"><button type="button" class="${ssrRenderClass([
        unref(perspective) === "mine" ? "bg-[#1976D2] text-white shadow-md" : "text-slate-600 hover:bg-slate-50",
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
      ])}"> Mes sollicitations </button><button type="button" class="${ssrRenderClass([
        unref(perspective) === "host" ? "bg-[#1976D2] text-white shadow-md" : "text-slate-600 hover:bg-slate-50",
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
      ])}"> Sur mes prestations </button></div></div><div class="mb-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div class="flex min-w-max border-b border-slate-100"><!--[-->`);
      ssrRenderList(tabs, (tab, idx) => {
        _push(`<button type="button" class="${ssrRenderClass([unref(activeTab) === idx ? "text-[#1976D2]" : "text-slate-500 hover:text-slate-800", "relative px-5 py-3.5 text-sm font-semibold transition-colors"])}">${ssrInterpolate(tab.label)} <span class="ml-1.5 text-xs font-bold opacity-70"> (${ssrInterpolate(tab.key === "ALL" ? unref(counts).all : tab.key === "PENDING" ? unref(counts).pending : tab.key === "ACCEPTED" ? unref(counts).accepted : unref(counts).rejected)}) </span>`);
        if (unref(activeTab) === idx) {
          _push(`<span class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1976D2]"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading) && unref(list).length === 0) {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(ssrRenderComponent(_component_UiCasaListCardShimmer, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="relative">`);
        if (unref(loading) && unref(list).length > 0) {
          _push(`<div class="pointer-events-auto absolute inset-0 z-20 flex items-start justify-center rounded-3xl bg-white/80 pt-24 backdrop-blur-sm">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "size-10 animate-spin text-[#1976D2]" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(displayed).length) {
          _push(`<div class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">`);
          if (unref(loading)) {
            _push(ssrRenderComponent(unref(Loader2), { class: "mb-4 size-12 animate-spin text-[#1976D2]" }, null, _parent));
          } else {
            _push(`<!--[-->`);
            _push(ssrRenderComponent(unref(Wrench), { class: "mb-4 size-14 text-[#1976D2]/30" }, null, _parent));
            _push(`<p class="text-lg font-bold text-slate-800">Aucune sollicitation ici</p><p class="mt-2 max-w-sm text-sm text-slate-500"> Changez d\u2019onglet ou de liste (mes demandes / h\xF4te). </p>`);
            if (!__props.embedded && unref(perspective) === "mine") {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: "/services",
                class: "mt-8 inline-flex h-12 items-center rounded-xl bg-[#1976D2] px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1565C0]"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Voir les services `);
                  } else {
                    return [
                      createTextVNode(" Voir les services ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(displayed), (item) => {
            _push(`<article role="button" tabindex="0" class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"><div class="relative aspect-[16/10] overflow-hidden bg-slate-100">`);
            if (item.prestationImage) {
              _push(`<img${ssrRenderAttr("src", item.prestationImage)}${ssrRenderAttr("alt", item.prestationTitle || "Service")} class="h-full w-full object-cover transition duration-500 group-hover:scale-105">`);
            } else {
              _push(`<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">`);
              _push(ssrRenderComponent(unref(Wrench), { class: "size-12 text-slate-400" }, null, _parent));
              _push(`</div>`);
            }
            _push(`<div class="absolute right-3 top-3">`);
            _push(ssrRenderComponent(unref(_sfc_main$3), {
              class: ["rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide", statusBadgeClass(item.status)]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(item.displayStatus)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(item.displayStatus), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
            if (counterpartyAvatar(item)) {
              _push(`<div class="absolute bottom-3 left-3 flex items-end gap-3"><div class="size-14 shrink-0 overflow-hidden rounded-full border-[3px] border-white bg-slate-200 shadow-lg ring-2 ring-black/5"><img${ssrRenderAttr("src", counterpartyAvatar(item))}${ssrRenderAttr("alt", counterpartyLabel(item))} class="h-full w-full object-cover"></div><div class="mb-1 max-w-[10rem] rounded-xl bg-black/45 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm"><span class="line-clamp-2">${ssrInterpolate(counterpartyLabel(item))}</span></div></div>`);
            } else {
              _push(`<div class="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-black/45 px-3 py-2 text-[11px] font-bold text-white backdrop-blur-sm">`);
              _push(ssrRenderComponent(unref(User), { class: "size-4 shrink-0 opacity-80" }, null, _parent));
              _push(`<span class="line-clamp-1">${ssrInterpolate(counterpartyLabel(item))}</span></div>`);
            }
            _push(`</div><div class="flex flex-1 flex-col gap-3 p-5"><div class="flex items-start gap-3"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">`);
            _push(ssrRenderComponent(unref(Sparkles), { class: "size-5" }, null, _parent));
            _push(`</div><div class="min-w-0 flex-1"><p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]"> REFR : #${ssrInterpolate(item.id)}</p><h3 class="line-clamp-2 font-bold leading-snug text-slate-900">${ssrInterpolate(item.prestationTitle || "Service")}</h3></div></div><div class="space-y-2 text-sm text-slate-600"><div class="flex items-center gap-2">`);
            _push(ssrRenderComponent(unref(Calendar), { class: "size-4 shrink-0 text-slate-400" }, null, _parent));
            _push(`<span>${ssrInterpolate(formatDate(item.startDate))}</span>`);
            if (item.endDate && item.endDate !== item.startDate) {
              _push(`<span class="text-slate-400">\u2192 ${ssrInterpolate(formatDate(item.endDate))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (item.budget != null) {
              _push(`<div class="flex items-center gap-2">`);
              _push(ssrRenderComponent(unref(Banknote), { class: "size-4 shrink-0 text-slate-400" }, null, _parent));
              _push(`<span class="font-semibold">${ssrInterpolate(unref(formatCurrency)(item.budget, getCurrencyCode(item.deviseId)))}</span><span class="text-xs text-slate-500">${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(item.deviseId)))}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (item.description) {
              _push(`<div class="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 line-clamp-4">${ssrInterpolate(item.description)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="mt-auto flex flex-wrap gap-2 pt-2">`);
            if (item.prestationId) {
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/services/${unref(encodeId)(item.prestationId)}`,
                class: "inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#1976D2] transition hover:bg-slate-50"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Voir le service `);
                  } else {
                    return [
                      createTextVNode(" Voir le service ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
            } else {
              _push(`<!---->`);
            }
            if (unref(perspective) === "host" && item.status === "PENDING") {
              _push(`<!--[-->`);
              _push(ssrRenderComponent(unref(_sfc_main$1), {
                type: "button",
                class: "h-10 flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700",
                disabled: unref(solStore).isUpdating,
                onClick: ($event) => setStatus(item, "ACCEPTED")
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Accepter `);
                  } else {
                    return [
                      createTextVNode(" Accepter ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(ssrRenderComponent(unref(_sfc_main$1), {
                type: "button",
                variant: "outline",
                class: "h-10 flex-1 rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50",
                disabled: unref(solStore).isUpdating,
                onClick: ($event) => setStatus(item, "REJECTED")
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(` Refuser `);
                  } else {
                    return [
                      createTextVNode(" Refuser ")
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><p class="text-center text-xs font-bold text-[#1976D2]">Toucher pour plus de d\xE9tails</p></div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        if (unref(totalPages) > 1) {
          _push(`<div class="mt-10 flex items-center justify-center gap-2">`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            class: "h-10 w-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-30",
            disabled: unref(currentPage) === 1,
            onClick: ($event) => currentPage.value--
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ChevronLeft), { class: "size-4" }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(ChevronLeft), { class: "size-4" })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex items-center gap-1.5"><!--[-->`);
          ssrRenderList(unref(totalPages), (p) => {
            _push(ssrRenderComponent(unref(_sfc_main$1), {
              key: p,
              variant: "outline",
              size: "sm",
              class: [
                "h-10 w-10 rounded-xl font-bold transition-all",
                unref(currentPage) === p ? "border-[#1976D2] bg-[#1976D2] text-white shadow-md" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              ],
              onClick: ($event) => currentPage.value = p
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(p)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(p), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            class: "h-10 w-10 rounded-xl border-slate-200 bg-white p-0 text-slate-600 hover:bg-slate-50 disabled:opacity-30",
            disabled: unref(currentPage) === unref(totalPages),
            onClick: ($event) => currentPage.value++
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(ChevronRight), { class: "size-4" })
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(detailOpen) && unref(detailItem)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"><div class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl"><div class="relative aspect-[16/10] bg-slate-100">`);
          if (unref(detailItem).prestationImage) {
            _push2(`<img${ssrRenderAttr("src", unref(detailItem).prestationImage)}${ssrRenderAttr("alt", unref(detailItem).prestationTitle || "Service")} class="h-full w-full object-cover">`);
          } else {
            _push2(`<div class="flex h-full items-center justify-center">`);
            _push2(ssrRenderComponent(unref(Wrench), { class: "size-16 text-slate-300" }, null, _parent));
            _push2(`</div>`);
          }
          _push2(`<button type="button" class="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"> Fermer </button>`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), {
            class: ["absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase", statusBadgeClass(unref(detailItem).status)]
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(unref(detailItem).displayStatus)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(detailItem).displayStatus), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          if (counterpartyAvatar(unref(detailItem))) {
            _push2(`<div class="absolute bottom-3 left-3 size-20 overflow-hidden rounded-full border-4 border-white shadow-xl"><img${ssrRenderAttr("src", counterpartyAvatar(unref(detailItem)))}${ssrRenderAttr("alt", counterpartyLabel(unref(detailItem)))} class="h-full w-full object-cover"></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="space-y-4 p-6"><div><p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">REFR : #${ssrInterpolate(unref(detailItem).id)}</p><h2 class="text-xl font-black text-slate-900">${ssrInterpolate(unref(detailItem).prestationTitle || "Service")}</h2><p class="mt-1 text-sm font-semibold text-slate-800">${ssrInterpolate(counterpartyLabel(unref(detailItem)))}</p>`);
          if (counterpartySubline(unref(detailItem))) {
            _push2(`<p class="mt-0.5 text-xs text-slate-500">${ssrInterpolate(counterpartySubline(unref(detailItem)))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="space-y-2 text-sm text-slate-600"><div class="flex items-center gap-2">`);
          _push2(ssrRenderComponent(unref(Calendar), { class: "size-4 text-slate-400" }, null, _parent));
          _push2(`<span>${ssrInterpolate(formatDate(unref(detailItem).startDate))}</span>`);
          if (unref(detailItem).endDate && unref(detailItem).endDate !== unref(detailItem).startDate) {
            _push2(`<span class="text-slate-400">\u2192 ${ssrInterpolate(formatDate(unref(detailItem).endDate))}</span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(detailItem).budget != null) {
            _push2(`<div class="flex items-center gap-2">`);
            _push2(ssrRenderComponent(unref(Banknote), { class: "size-4 text-slate-400" }, null, _parent));
            _push2(`<span class="font-semibold">${ssrInterpolate(unref(formatCurrency)(unref(detailItem).budget, getCurrencyCode(unref(detailItem).deviseId)))}</span><span class="text-xs text-slate-500">${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(unref(detailItem).deviseId)))}</span></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(detailItem).description) {
            _push2(`<div class="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700"><p class="text-[10px] font-bold uppercase text-slate-400">Description</p><p class="mt-1 whitespace-pre-wrap">${ssrInterpolate(unref(detailItem).description)}</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">`);
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
            type: "button",
            variant: "outline",
            class: "h-12 flex-1 min-w-[140px] rounded-xl border-[#1976D2]/40 bg-[#E3F2FD] font-bold text-[#1565C0] hover:bg-[#BBDEFB]",
            disabled: unref(downloadingPdf),
            onClick: handleDownloadSolicitationPdf
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                if (unref(downloadingPdf)) {
                  _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push3(ssrRenderComponent(unref(Download), { class: "mr-2 size-4" }, null, _parent2, _scopeId));
                }
                _push3(` T\xE9l\xE9charger PDF `);
              } else {
                return [
                  unref(downloadingPdf) ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 size-4 animate-spin"
                  })) : (openBlock(), createBlock(unref(Download), {
                    key: 1,
                    class: "mr-2 size-4"
                  })),
                  createTextVNode(" T\xE9l\xE9charger PDF ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(detailItem).prestationId) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/services/${unref(encodeId)(unref(detailItem).prestationId)}`,
              class: "inline-flex h-12 flex-1 min-w-[140px] items-center justify-center rounded-xl bg-[#1976D2] text-sm font-bold text-white shadow-lg hover:bg-[#1565C0]",
              onClick: closeDetail
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Page du service `);
                } else {
                  return [
                    createTextVNode(" Page du service ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(perspective) === "host" && unref(detailItem).status === "PENDING") {
            _push2(`<div class="flex gap-2 pt-4 border-t border-slate-100">`);
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              class: "h-12 flex-1 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700",
              disabled: unref(solStore).isUpdating,
              onClick: ($event) => setStatus(unref(detailItem), "ACCEPTED")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Accepter `);
                } else {
                  return [
                    createTextVNode(" Accepter ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              variant: "outline",
              class: "h-12 flex-1 rounded-xl border-red-200 font-bold text-red-700 hover:bg-red-50",
              disabled: unref(solStore).isUpdating,
              onClick: ($event) => setStatus(unref(detailItem), "REJECTED")
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Refuser `);
                } else {
                  return [
                    createTextVNode(" Refuser ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/solicitations/SolicitationsServiceView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SolicitationsServiceView-BuxOAfJN.mjs.map
