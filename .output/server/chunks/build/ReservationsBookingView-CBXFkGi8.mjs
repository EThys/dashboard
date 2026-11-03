import { _ as _sfc_main$2 } from './CasaListCardShimmer-D0zSGUKF.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, openBlock, createBlock, createTextVNode, createVNode, resolveDynamicComponent, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderTeleport } from 'vue/server-renderer';
import { Sparkles, Loader2, RefreshCw, Search, Calendar, Clock, User, ChevronLeft, ChevronRight, X, Download, Home, Hotel, Building2, PartyPopper, Briefcase, Mountain } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$3 } from './Badge-CZaU8sYj.mjs';
import { u as useReservationStore } from './reservations-BavzD6Zt.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { l as useAuthStore } from './server.mjs';

const itemsPerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReservationsBookingView",
  __ssrInlineRender: true,
  props: {
    embedded: { type: Boolean, default: false },
    initialPerspective: { default: "mine" },
    hostReservationScope: { default: "all" },
    searchable: { type: Boolean, default: false }
  },
  setup(__props) {
    var _a;
    const props = __props;
    const showBannerSubtitle = ref(true);
    const resStore = useReservationStore();
    const auth = useAuthStore();
    const activeTab = ref(0);
    const refreshing = ref(false);
    const searchQuery = ref("");
    const currentPage = ref(1);
    const perspective = ref(props.initialPerspective);
    function cachedReservations() {
      var _a2, _b;
      const uid = ((_a2 = auth.user) == null ? void 0 : _a2.userId) || ((_b = auth.user) == null ? void 0 : _b.id);
      if (perspective.value === "mine") {
        return resStore.userReservationsLoaded && resStore.userReservationsOwnerId === uid ? resStore.userReservations : null;
      }
      if (!(resStore.hostReservationsLoaded && resStore.hostReservationsOwnerId === uid)) return null;
      if (props.hostReservationScope === "chambre") {
        return resStore.hostReservations.filter((item) => item.sourceCategory === "chambre");
      }
      return resStore.hostReservations;
    }
    const list = ref((_a = cachedReservations()) != null ? _a : []);
    const loading = ref(cachedReservations() === null);
    const tabs = [
      { key: "PENDING", label: "En attente" },
      { key: "CONFIRMED", label: "Confirm\xE9es" },
      { key: "COMPLETED", label: "Termin\xE9es" },
      { key: "CANCELLED", label: "Annul\xE9es" }
    ];
    async function load(force = false) {
      const cached = cachedReservations();
      if (cached) {
        list.value = cached;
        loading.value = false;
        if (force) refreshing.value = true;
      } else {
        loading.value = true;
      }
      try {
        const data = perspective.value === "mine" ? await resStore.fetchUserReservations(force) : props.hostReservationScope === "chambre" ? await resStore.fetchHostChambreReservationsOnly(force) : await resStore.fetchHostReservations(force);
        list.value = data;
        if (!cached) currentPage.value = 1;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
        refreshing.value = false;
      }
    }
    const statsLoading = computed(() => loading.value && list.value.length === 0);
    watch(perspective, () => {
      activeTab.value = 0;
      currentPage.value = 1;
      closeDetail();
      load(false);
    });
    watch(activeTab, () => {
      currentPage.value = 1;
    });
    watch(searchQuery, () => {
      currentPage.value = 1;
    });
    const counts = computed(() => resStore.countByStatus(list.value));
    function filterByTab(items, tabKey) {
      return items.filter((r) => {
        const s = r.status.toUpperCase();
        if (tabKey === "CONFIRMED") return s === "CONFIRMED" || s === "ACCEPTED";
        if (tabKey === "COMPLETED") return s === "COMPLETED" || s === "FINISHED";
        if (tabKey === "CANCELLED") return s === "CANCELLED" || s === "REJECTED";
        return s === tabKey;
      }).sort((a, b) => {
        const da = new Date(a.createdAt || a.startDate || 0).getTime();
        const db = new Date(b.createdAt || b.startDate || 0).getTime();
        return db - da;
      });
    }
    function foldSearch(value) {
      return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }
    function personFields(item) {
      var _a2, _b;
      const rawUser = (_b = (_a2 = item.raw.user) != null ? _a2 : item.raw.client) != null ? _b : item.raw.member;
      if (!rawUser || typeof rawUser !== "object" || Array.isArray(rawUser)) return "";
      const user = rawUser;
      const profile = user.profile && typeof user.profile === "object" ? user.profile : {};
      return [user.username, user.fullName, user.firstName, user.lastName, user.prenom, user.nom, profile.fullName, profile.firstName, profile.lastName].filter((part) => typeof part === "string" && part.trim()).join(" ");
    }
    function matchesSearch(item, query) {
      const blob = foldSearch(
        [
          item.guestDisplayName,
          personFields(item),
          item.guestPhone,
          item.guestEmail,
          item.hostDisplayName,
          item.propertyTitle,
          item.propertyType,
          item.message,
          item.reservationId
        ].filter((part) => part != null && String(part).trim() && String(part).trim() !== "\u2014").join(" ")
      );
      return blob.includes(query);
    }
    const filteredList = computed(() => {
      var _a2;
      const query = foldSearch(searchQuery.value);
      if (query) {
        return [...list.value].filter((item) => matchesSearch(item, query)).sort((a, b) => {
          const da = new Date(a.createdAt || a.startDate || 0).getTime();
          const db = new Date(b.createdAt || b.startDate || 0).getTime();
          return db - da;
        });
      }
      const key = (_a2 = tabs[activeTab.value]) == null ? void 0 : _a2.key;
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
    function categoryIcon(cat) {
      switch (cat) {
        case "terrain":
          return Mountain;
        case "bureau":
          return Briefcase;
        case "festive":
          return PartyPopper;
        case "funeraire":
          return Building2;
        case "vacance":
        case "chambre":
          return Hotel;
        default:
          return Home;
      }
    }
    function statusBadgeClass(status) {
      const s = status.toUpperCase();
      switch (s) {
        case "PENDING":
          return "bg-amber-50 text-amber-800 border-amber-200";
        case "CONFIRMED":
        case "ACCEPTED":
          return "bg-blue-50 text-blue-800 border-blue-200";
        case "COMPLETED":
        case "FINISHED":
          return "bg-slate-100 text-slate-800 border-slate-200";
        case "CANCELLED":
        case "REJECTED":
          return "bg-red-50 text-red-800 border-red-200";
        default:
          return "bg-slate-50 text-slate-700 border-slate-200";
      }
    }
    const detailOpen = ref(false);
    const detailRes = ref(null);
    const validating = ref(false);
    const cancelling = ref(false);
    const downloadingPdf = ref(false);
    async function handleDownloadReservationPdf() {
      detailRes.value;
      return;
    }
    function closeDetail() {
      detailOpen.value = false;
      detailRes.value = null;
    }
    async function hostValidate(accept) {
      const r = detailRes.value;
      if (!r) return;
      validating.value = true;
      try {
        const out = await resStore.validateReservationNotification(r.reservationId, accept);
        if (out.success) {
          toast.success(accept ? "R\xE9servation accept\xE9e" : "Demande refus\xE9e", {
            description: "Confirmation envoy\xE9e imm\xE9diatement."
          });
          closeDetail();
          await load(true);
        } else {
          toast.error(out.message || "Action impossible");
        }
      } finally {
        validating.value = false;
      }
    }
    async function guestCancelReservation() {
      const r = detailRes.value;
      if (!r) return;
      return;
    }
    const shellClass = computed(
      () => props.embedded ? "space-y-8" : "min-h-screen bg-[#F5F6FA] pb-16 pt-6 sm:pt-10"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UiCasaListCardShimmer = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: unref(shellClass) }, _attrs))}><div class="${ssrRenderClass(__props.embedded ? "" : "mx-auto max-w-6xl px-4 sm:px-6")}"><div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-xl sm:p-8 mb-8"><div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-start gap-4"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "size-7 text-white" }, null, _parent));
      _push(`</div><div><h1 class="text-2xl font-bold tracking-tight sm:text-3xl">${ssrInterpolate(unref(perspective) === "mine" ? "Mes r\xE9servations" : "R\xE9servations re\xE7ues")}</h1>`);
      if (unref(showBannerSubtitle)) {
        _push(`<p class="mt-1 max-w-xl text-sm text-blue-100 italic opacity-90 transition-all duration-700">${ssrInterpolate(unref(perspective) === "mine" ? "Retrouvez l\u2019historique de vos demandes de r\xE9servation sur CasaNayo." : "G\xE9rez les demandes re\xE7ues sur vos publications.")}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        type: "button",
        variant: "secondary",
        class: "h-11 shrink-0 rounded-xl border-0 bg-white/15 font-bold text-white hover:bg-white/25",
        disabled: unref(refreshing),
        onClick: ($event) => load(true)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(refreshing)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(RefreshCw), { class: "mr-2 size-4" }, null, _parent2, _scopeId));
            }
            _push2(` Actualiser `);
          } else {
            return [
              unref(refreshing) ? (openBlock(), createBlock(unref(Loader2), {
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
        _push(`<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Total</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).all)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">En attente</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).pending)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Confirm\xE9es</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).confirmed)}</p></div><div class="rounded-2xl bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase tracking-wider text-blue-200">Annul\xE9es</p><p class="text-2xl font-black">${ssrInterpolate(unref(counts).cancelled)}</p></div></div>`);
      }
      _push(`</div><div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs font-bold uppercase tracking-wider text-slate-500"></p><div class="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm" role="tablist"><button type="button" role="tab" class="${ssrRenderClass([
        unref(perspective) === "mine" ? "bg-[#1976D2] text-white shadow-md" : "text-slate-600 hover:bg-slate-50",
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
      ])}"> Mes r\xE9servations </button><button type="button" role="tab" class="${ssrRenderClass([
        unref(perspective) === "host" ? "bg-[#1976D2] text-white shadow-md" : "text-slate-600 hover:bg-slate-50",
        "rounded-xl px-4 py-2.5 text-sm font-bold transition-colors"
      ])}"> Sur mes publications </button></div></div><div class="mb-6 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div class="flex min-w-max border-b border-slate-100"><!--[-->`);
      ssrRenderList(tabs, (tab, idx) => {
        _push(`<button type="button" class="${ssrRenderClass([
          unref(activeTab) === idx ? "text-[#1976D2]" : "text-slate-500 hover:text-slate-800",
          "relative px-5 py-3.5 text-sm font-semibold transition-colors"
        ])}">${ssrInterpolate(tab.label)} <span class="ml-1.5 text-xs font-bold opacity-70"> (${ssrInterpolate(unref(statsLoading) ? "\u2014" : tab.key === "PENDING" ? unref(counts).pending : tab.key === "CONFIRMED" ? unref(counts).confirmed : tab.key === "COMPLETED" ? unref(counts).completed : unref(counts).cancelled)}) </span>`);
        if (unref(activeTab) === idx) {
          _push(`<span class="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#1976D2]"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (__props.searchable) {
        _push(`<div class="relative mb-6">`);
        _push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" }, null, _parent));
        _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="search" placeholder="Rechercher par nom, t\xE9l\xE9phone, chambre ou r\xE9f\xE9rence\u2026" class="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-[#1976D2]"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading) && unref(list).length === 0) {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(ssrRenderComponent(_component_UiCasaListCardShimmer, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="relative">`);
        if (!unref(displayed).length) {
          _push(`<div class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">`);
          _push(ssrRenderComponent(unref(Calendar), { class: "mb-4 size-14 text-[#1976D2]/30" }, null, _parent));
          _push(`<p class="text-lg font-bold text-slate-800">${ssrInterpolate(unref(searchQuery).trim() ? "Aucun r\xE9sultat" : "Aucune r\xE9servation")}</p><p class="mt-2 max-w-sm text-sm text-slate-500">${ssrInterpolate(unref(searchQuery).trim() ? "Aucune personne ni r\xE9servation ne correspond \xE0 cette recherche." : "Aucune donn\xE9e \xE0 afficher pour ce statut.")}</p>`);
          if (!__props.embedded) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/properties",
              class: "mt-8 inline-flex h-12 items-center rounded-xl bg-[#1976D2] px-8 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-[#1565C0]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Explorer les biens `);
                } else {
                  return [
                    createTextVNode(" Explorer les biens ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(unref(displayed), (res) => {
            _push(`<article role="button" tabindex="0" class="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"><div class="relative aspect-[16/10] overflow-hidden bg-slate-100">`);
            if (res.propertyImage) {
              _push(`<img${ssrRenderAttr("src", res.propertyImage)}${ssrRenderAttr("alt", res.propertyTitle)} class="h-full w-full object-cover transition duration-500 group-hover:scale-105">`);
            } else {
              _push(`<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">`);
              ssrRenderVNode(_push, createVNode(resolveDynamicComponent(categoryIcon(res.sourceCategory)), { class: "size-12 text-slate-400" }, null), _parent);
              _push(`</div>`);
            }
            _push(`<div class="absolute right-3 top-3">`);
            _push(ssrRenderComponent(unref(_sfc_main$3), {
              class: ["rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide", statusBadgeClass(res.status)]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(res.displayStatus)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(res.displayStatus), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div><div class="flex flex-1 flex-col gap-3 p-5"><div class="flex items-start gap-4"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(categoryIcon(res.sourceCategory)), { class: "size-5" }, null), _parent);
            _push(`</div><div class="min-w-0 flex-1"><p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]"> REFR : #${ssrInterpolate(res.reservationId)}</p><h3 class="line-clamp-2 font-bold leading-snug text-slate-900">${ssrInterpolate(res.propertyType ? res.propertyType + " \u2014 " : "")}${ssrInterpolate(res.propertyTitle)}</h3></div></div><div class="space-y-2 text-sm text-slate-600"><div class="flex items-center gap-2">`);
            _push(ssrRenderComponent(unref(Calendar), { class: "size-4 shrink-0 text-slate-400" }, null, _parent));
            _push(`<span>${ssrInterpolate(formatDate(res.startDate))}</span>`);
            if (res.endDate && res.endDate !== res.startDate) {
              _push(`<span class="text-slate-400">\u2192 ${ssrInterpolate(formatDate(res.endDate))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (res.reservationHeure) {
              _push(`<div class="flex items-center gap-2">`);
              _push(ssrRenderComponent(unref(Clock), { class: "size-4 shrink-0 text-slate-400" }, null, _parent));
              _push(`<span>${ssrInterpolate(res.reservationHeure)}</span></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (unref(perspective) === "mine" && (res.hostDisplayName !== "\u2014" || res.hostProfileImage)) {
              _push(`<div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left">`);
              if (res.hostProfileImage) {
                _push(`<img${ssrRenderAttr("src", res.hostProfileImage)} alt="" class="size-9 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm">`);
              } else {
                _push(`<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">`);
                _push(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent));
                _push(`</div>`);
              }
              _push(`<div class="min-w-0"><p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">H\xF4te</p><p class="truncate text-xs font-bold text-slate-800">${ssrInterpolate(res.hostDisplayName)}</p></div></div>`);
            } else if (unref(perspective) === "host" && (res.guestDisplayName !== "\u2014" || res.guestProfileImage)) {
              _push(`<div class="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-left">`);
              if (res.guestProfileImage) {
                _push(`<img${ssrRenderAttr("src", res.guestProfileImage)} alt="" class="size-9 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm">`);
              } else {
                _push(`<div class="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">`);
                _push(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent));
                _push(`</div>`);
              }
              _push(`<div class="min-w-0"><p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Demandeur</p><p class="truncate text-xs font-bold text-slate-800">${ssrInterpolate(res.guestDisplayName)}</p></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></article>`);
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
        if (unref(detailOpen) && unref(detailRes)) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"><div class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"><div class="relative aspect-[16/10] bg-slate-100">`);
          if (unref(detailRes).propertyImage) {
            _push2(`<img${ssrRenderAttr("src", unref(detailRes).propertyImage)}${ssrRenderAttr("alt", unref(detailRes).propertyTitle)} class="h-full w-full object-cover">`);
          } else {
            _push2(`<div class="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(categoryIcon(unref(detailRes).sourceCategory)), { class: "size-16 text-slate-400" }, null), _parent);
            _push2(`</div>`);
          }
          _push2(`<button type="button" class="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm">`);
          _push2(ssrRenderComponent(unref(X), { class: "size-5" }, null, _parent));
          _push2(`</button>`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), {
            class: ["absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase", statusBadgeClass(unref(detailRes).status)]
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(unref(detailRes).displayStatus)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(detailRes).displayStatus), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div><div class="space-y-4 p-6"><div><p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]"> REFR : #${ssrInterpolate(unref(detailRes).reservationId)} \xB7 ${ssrInterpolate(unref(detailRes).propertyType || "Bien")}</p><h2 class="text-xl font-black text-slate-900 leading-tight">${ssrInterpolate(unref(detailRes).propertyTitle)}</h2></div>`);
          if (unref(perspective) === "mine" && (unref(detailRes).hostDisplayName !== "\u2014" || unref(detailRes).hostProfileImage)) {
            _push2(`<div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">`);
            if (unref(detailRes).hostProfileImage) {
              _push2(`<img${ssrRenderAttr("src", unref(detailRes).hostProfileImage)} alt="" class="size-14 shrink-0 rounded-full object-cover ring-4 ring-white shadow-sm">`);
            } else {
              _push2(`<div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400">`);
              _push2(ssrRenderComponent(unref(User), { class: "size-7" }, null, _parent));
              _push2(`</div>`);
            }
            _push2(`<div class="min-w-0"><p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">H\xF4te / publi\xE9 par</p><p class="text-lg font-black text-slate-900">${ssrInterpolate(unref(detailRes).hostDisplayName)}</p></div></div>`);
          } else if (unref(perspective) === "host" && (unref(detailRes).guestDisplayName !== "\u2014" || unref(detailRes).guestProfileImage)) {
            _push2(`<div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">`);
            if (unref(detailRes).guestProfileImage) {
              _push2(`<img${ssrRenderAttr("src", unref(detailRes).guestProfileImage)} alt="" class="size-14 shrink-0 rounded-full object-cover ring-4 ring-white shadow-sm">`);
            } else {
              _push2(`<div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400">`);
              _push2(ssrRenderComponent(unref(User), { class: "size-7" }, null, _parent));
              _push2(`</div>`);
            }
            _push2(`<div class="min-w-0"><p class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Demandeur</p><p class="text-lg font-black text-slate-900">${ssrInterpolate(unref(detailRes).guestDisplayName)}</p></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="grid grid-cols-2 gap-4"><div class="rounded-2xl bg-slate-50 p-3"><p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Date</p><div class="flex items-center gap-2 text-sm font-bold text-slate-700">`);
          _push2(ssrRenderComponent(unref(Calendar), { class: "size-4 text-[#1976D2]" }, null, _parent));
          _push2(`<span>${ssrInterpolate(formatDate(unref(detailRes).startDate))}</span></div></div>`);
          if (unref(detailRes).reservationHeure) {
            _push2(`<div class="rounded-2xl bg-slate-50 p-3"><p class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Heure</p><div class="flex items-center gap-2 text-sm font-bold text-slate-700">`);
            _push2(ssrRenderComponent(unref(Clock), { class: "size-4 text-[#1976D2]" }, null, _parent));
            _push2(`<span>${ssrInterpolate(unref(detailRes).reservationHeure)}</span></div></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(detailRes).message) {
            _push2(`<div class="rounded-2xl border border-slate-100 bg-slate-50/30 p-4 text-sm text-slate-700"><p class="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Message</p><p class="italic text-slate-600 leading-relaxed">\xAB ${ssrInterpolate(unref(detailRes).message)} \xBB</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(detailRes).cancellationReason) {
            _push2(`<div class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-900"><p class="text-[10px] font-bold uppercase mb-1">Motif d&#39;annulation</p><p class="font-medium">${ssrInterpolate(unref(detailRes).cancellationReason)}</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex flex-col gap-3 sm:flex-row pt-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
            type: "button",
            variant: "outline",
            class: "h-12 flex-1 rounded-xl border-[#1976D2]/20 bg-white font-bold text-[#1976D2] hover:bg-slate-50 shadow-sm",
            disabled: unref(downloadingPdf),
            onClick: handleDownloadReservationPdf
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                if (unref(downloadingPdf)) {
                  _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push3(ssrRenderComponent(unref(Download), { class: "mr-2 size-4" }, null, _parent2, _scopeId));
                }
                _push3(` Dossier PDF `);
              } else {
                return [
                  unref(downloadingPdf) ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 size-4 animate-spin"
                  })) : (openBlock(), createBlock(unref(Download), {
                    key: 1,
                    class: "mr-2 size-4"
                  })),
                  createTextVNode(" Dossier PDF ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(detailRes).propertyDetailId != null) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/properties/${unref(encodeId)(unref(detailRes).propertyDetailId)}`,
              class: "inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-[#1976D2] text-sm font-bold text-white shadow-lg hover:bg-[#1565C0] active:scale-95 transition-transform",
              onClick: closeDetail
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Consulter le bien `);
                } else {
                  return [
                    createTextVNode(" Consulter le bien ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (unref(perspective) === "host" && unref(detailRes).status === "PENDING") {
            _push2(`<div class="flex flex-col gap-3 border-t border-slate-100 pt-6"><div class="flex items-center gap-2 mb-2"><div class="size-2 rounded-full bg-amber-400 animate-pulse"></div><p class="text-xs font-black uppercase text-slate-500 tracking-wider">Action requise</p></div><div class="flex gap-3">`);
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              class: "h-14 flex-[2] rounded-2xl bg-emerald-600 font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5",
              disabled: unref(validating),
              onClick: ($event) => hostValidate(true)
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  if (unref(validating)) {
                    _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-5 animate-spin" }, null, _parent2, _scopeId));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(` Valider `);
                } else {
                  return [
                    unref(validating) ? (openBlock(), createBlock(unref(Loader2), {
                      key: 0,
                      class: "mr-2 size-5 animate-spin"
                    })) : createCommentVNode("", true),
                    createTextVNode(" Valider ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              variant: "outline",
              class: "h-14 flex-1 rounded-2xl border-red-200 font-bold text-red-700 hover:bg-red-50 transition-colors",
              disabled: unref(validating),
              onClick: ($event) => hostValidate(false)
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
            _push2(`</div></div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(perspective) === "mine" && (unref(detailRes).status === "PENDING" || unref(detailRes).status === "CONFIRMED")) {
            _push2(`<div class="border-t border-slate-100 pt-6">`);
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              type: "button",
              variant: "ghost",
              class: "h-12 w-full rounded-xl font-bold text-red-500 hover:text-red-700 hover:bg-red-50",
              disabled: unref(cancelling),
              onClick: guestCancelReservation
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  if (unref(cancelling)) {
                    _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(` Annuler ma r\xE9servation `);
                } else {
                  return [
                    unref(cancelling) ? (openBlock(), createBlock(unref(Loader2), {
                      key: 0,
                      class: "mr-2 size-4 animate-spin"
                    })) : createCommentVNode("", true),
                    createTextVNode(" Annuler ma r\xE9servation ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/reservations/ReservationsBookingView.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ReservationsBookingView-CBXFkGi8.mjs.map
