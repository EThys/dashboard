import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, createTextVNode, createCommentVNode, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { ArrowLeft, Maximize, MapPin, Home, Heart, Share2, BedDouble, Bath, ChefHat, ShieldCheck, Briefcase, Users, CheckCircle2, XCircle, Hotel, FileText, Zap, Droplets, Calendar, X, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _export_sfc, o as useRoute, a as useRouter, f as usePropertyStore, m as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import VueEasyLightbox from 'vue-easy-lightbox';
import { n as normalizeBureau, a as normalizeFestive, b as normalizeFuneraire, c as normalizeTerrain, d as normalizeHotel, e as normalizeStandardProperty } from './propertyNormalizer-DiijNhdR.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { _ as _sfc_main$4 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$3 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$5 } from './ClockTimePicker-ClWVtEHn.mjs';
import { u as useReservationStore } from './reservations-DMpUain_.mjs';
import { D as DetailShimmer } from './DetailShimmer-CZGzkLXC.mjs';
import { d as decodeId, e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { n as normalizeListingKind } from './propertyLink-DjylkIdD.mjs';
import { l as lowestHotelRoomOffer } from './hotelStartingPrice-TSwrGxRW.mjs';
import { f as formatCurrency } from './currency-BoakoUK-.mjs';
import { t as trackListingView } from './useGoogleAnalytics-DUKqbrzA.mjs';
import { a as openPropertyUrl, s as shareMessage } from './openListingLink-UP60yfaJ.mjs';
import { u as useAsyncData } from './asyncData-DaMIbxNX.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import './transactionDisplay-GAAD372w.mjs';
import './partyExtract-C97-iyVh.mjs';
import './apiListResponse-BRFNgDZl.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PropertyVisitModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    propertyId: {},
    propertyTitle: {},
    propertyType: {},
    chambreId: {}
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useReservationStore();
    useAuthStore();
    const isLoading = ref(false);
    const isHotelRoom = computed(() => props.chambreId != null);
    const availableHours = Array.from({ length: 12 }, (_, i) => `${(7 + i).toString().padStart(2, "0")}:00:00`);
    const form = reactive({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      time: "10:00:00",
      message: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in transition-opacity"></div><div class="${ssrRenderClass([unref(isHotelRoom) ? "max-w-lg max-h-[92vh] overflow-y-auto" : "max-w-md", "relative bg-white dark:bg-slate-950 w-full rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200"])}"><button class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">`);
        _push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
        _push(`</button><h2 class="text-xl font-bold mb-1">${ssrInterpolate(__props.chambreId != null ? "R\xE9server cette chambre" : "Programmer une visite")}</h2><p class="text-sm text-muted-foreground mb-6">Pour : ${ssrInterpolate(__props.propertyTitle)}</p><form class="space-y-4"><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Date souhait\xE9e`);
            } else {
              return [
                createTextVNode("Date souhait\xE9e")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          type: "date",
          modelValue: unref(form).date,
          "onUpdate:modelValue": ($event) => unref(form).date = $event,
          required: ""
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(isHotelRoom) ? "Heure d\u2019arriv\xE9e" : "Heure (07h - 18h)")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(isHotelRoom) ? "Heure d\u2019arriv\xE9e" : "Heure (07h - 18h)"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(isHotelRoom)) {
          _push(ssrRenderComponent(_sfc_main$5, {
            modelValue: unref(form).time,
            "onUpdate:modelValue": ($event) => unref(form).time = $event
          }, null, _parent));
        } else {
          _push(`<select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><!--[-->`);
          ssrRenderList(unref(availableHours), (h2) => {
            _push(`<option${ssrRenderAttr("value", h2)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).time) ? ssrLooseContain(unref(form).time, h2) : ssrLooseEqual(unref(form).time, h2)) ? " selected" : ""}>${ssrInterpolate(h2.slice(0, 5))}</option>`);
          });
          _push(`<!--]--></select>`);
        }
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Message (Optionnel)`);
            } else {
              return [
                createTextVNode("Message (Optionnel)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Je souhaite visiter ce bien...">${ssrInterpolate(unref(form).message)}</textarea></div><div class="flex justify-end gap-3 pt-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "button",
          variant: "ghost",
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Annuler`);
            } else {
              return [
                createTextVNode("Annuler")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "submit",
          disabled: unref(isLoading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isLoading)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(__props.chambreId != null ? "Envoyer la demande" : "Valider la visite")}`);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-4 w-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(__props.chambreId != null ? "Envoyer la demande" : "Valider la visite"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/PropertyVisitModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const authStore = useAuthStore();
    const propertyId = computed(() => decodeId(route.params.id));
    const listingKind = computed(() => normalizeListingKind(route.query.kind));
    const fetchedProperty = ref(null);
    const rawProperty = computed(
      () => fetchedProperty.value || propertyStore.getPropertyById(propertyId.value, listingKind.value)
    );
    const { pending: isLoading } = useAsyncData(
      "property-detail",
      async () => {
        var _a;
        const apiBase = config.public.apiBase;
        const id = propertyId.value;
        const kind = listingKind.value;
        fetchedProperty.value = null;
        if (kind && kind !== "property") {
          const cached = propertyStore.getPropertyById(id, kind);
          if (cached) {
            fetchedProperty.value = cached;
            return true;
          }
          if (kind === "hotel") await propertyStore.fetchHotels(apiBase);
          if (kind === "festive") await propertyStore.fetchFestives(apiBase);
          if (kind === "funeraire") await propertyStore.fetchFuneraires(apiBase);
          if (kind === "bureau") await propertyStore.fetchBureaux(apiBase);
          if (kind === "terrain") await propertyStore.fetchTerrains(apiBase);
          fetchedProperty.value = (_a = propertyStore.getPropertyById(id, kind)) != null ? _a : null;
          return true;
        }
        try {
          const data = await $fetch(joinApi(apiBase, `${ApiEndpoints.properties}/${id}`));
          if (data && data.properties) {
            fetchedProperty.value = data.properties;
            return true;
          }
        } catch (e) {
          console.error("Failed to fetch property details:", e);
        }
        if (!fetchedProperty.value) {
          await Promise.all([
            propertyStore.bureaux.length === 0 ? propertyStore.fetchBureaux(apiBase) : Promise.resolve(),
            propertyStore.festives.length === 0 ? propertyStore.fetchFestives(apiBase) : Promise.resolve(),
            propertyStore.funeraires.length === 0 ? propertyStore.fetchFuneraires(apiBase) : Promise.resolve(),
            propertyStore.terrains.length === 0 ? propertyStore.fetchTerrains(apiBase) : Promise.resolve(),
            propertyStore.hotels.length === 0 ? propertyStore.fetchHotels(apiBase) : Promise.resolve(),
            propertyStore.properties.length === 0 ? propertyStore.fetchProperties(apiBase) : Promise.resolve()
          ]);
          const fromStore = propertyStore.getPropertyById(id);
          if (fromStore) fetchedProperty.value = fromStore;
        }
        return true;
      },
      {
        lazy: true,
        server: false,
        watch: [() => route.fullPath]
      }
    );
    const hotelStarting = computed(() => {
      const current = property.value;
      if (!(current == null ? void 0 : current.isHotel)) return null;
      const embedded = current.hotelChambres || [];
      const listed = propertyStore.hotelRooms.filter((room) => Number(room.hotelId) === Number(current.id));
      return lowestHotelRoomOffer(embedded.length ? embedded : listed);
    });
    const property = computed(() => {
      const raw = rawProperty.value;
      if (!raw) return null;
      try {
        if ("bureau" in raw) return normalizeBureau(raw);
        if ("festive" in raw) return normalizeFestive(raw);
        if ("funeraire" in raw) return normalizeFuneraire(raw);
        if ("terrain" in raw) return normalizeTerrain(raw);
        if ("hotel" in raw) return normalizeHotel(raw);
        if ("property" in raw) return normalizeStandardProperty(raw);
        return null;
      } catch (error) {
        console.error("Failed to normalize property:", error);
        return null;
      }
    });
    const listingViewSent = ref(false);
    watch(property, (item) => {
      if (!item || listingViewSent.value) return;
      listingViewSent.value = true;
      trackListingView({
        id: item.id,
        title: item.title,
        currency: item.currencyCode,
        location: item.city || item.location,
        category: item.type,
        transactionType: item.transactionType
      });
    });
    const currentImageIndex = ref(0);
    const lightboxVisible = ref(false);
    const lightboxIndex = ref(0);
    const lightboxImgs = ref([]);
    const isFavorite = ref(false);
    const toggleFavorite = () => isFavorite.value = !isFavorite.value;
    const shareProperty = async () => {
      var _a, _b, _c, _d, _e;
      const title = ((_a = property.value) == null ? void 0 : _a.title) || "";
      const address = ((_b = property.value) == null ? void 0 : _b.fullAddress) || ((_c = property.value) == null ? void 0 : _c.location) || "";
      const price = ((_d = property.value) == null ? void 0 : _d.hideListingPrice) ? "" : ((_e = property.value) == null ? void 0 : _e.price) || "";
      const url = openPropertyUrl(propertyId.value, listingKind.value || "property");
      const shareText = shareMessage([title, address, price], url);
      if ((void 0).share) {
        try {
          await (void 0).share({
            title,
            text: shareText
          });
        } catch (err) {
          console.log("Share canceled");
        }
      } else {
        (void 0).clipboard.writeText(shareText);
        alert("Lien et pr\xE9sentation copi\xE9s !");
      }
    };
    const isPropertyTaken = computed(() => {
      var _a;
      return ((_a = property.value) == null ? void 0 : _a.sold) === true;
    });
    const contactAgent = () => {
      var _a, _b;
      if (isPropertyTaken.value) {
        return;
      }
      if ((_a = property.value) == null ? void 0 : _a.isHotel) {
        return;
      }
      if (!authStore.isAuthenticated) {
        return navigateTo(`/login?reason=reservation&redirect=${route.fullPath}`);
      }
      if (!((_b = authStore.user) == null ? void 0 : _b.premium)) {
        toast.info("Abonnement requis", {
          description: "Un abonnement Premium est n\xE9cessaire pour effectuer une r\xE9servation."
        });
        return navigateTo("/compte/abonnement");
      }
      visitChambreId.value = null;
      visitChambreTitleStr.value = "";
      isVisitModalOpen.value = true;
    };
    const isVisitModalOpen = ref(false);
    const visitChambreId = ref(null);
    const visitChambreTitleStr = ref("");
    function onVisitModalClose() {
      isVisitModalOpen.value = false;
      visitChambreId.value = null;
      visitChambreTitleStr.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-c5a30de1>`);
      if (!unref(property) && unref(isLoading)) {
        _push(`<div data-v-c5a30de1>`);
        _push(ssrRenderComponent(DetailShimmer, { type: "property" }, null, _parent));
        _push(`</div>`);
      } else if (unref(property)) {
        _push(`<div class="min-h-screen" data-v-c5a30de1><div class="relative h-[46vh] min-h-[300px] max-h-[540px] md:h-[52vh] group bg-slate-900 border-b border-white/10 overflow-hidden" data-v-c5a30de1><button class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 group-hover/back:-translate-x-1 transition-transform" }, null, _parent));
        _push(`</button><button class="absolute top-4 md:top-8 right-4 md:right-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/zoom" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 group-hover/zoom:scale-110 transition-transform" }, null, _parent));
        _push(`</button><div class="${ssrRenderClass([((_a = unref(property).images) == null ? void 0 : _a.length) ? "cursor-zoom-in" : "", "absolute inset-0 z-0"])}" data-v-c5a30de1>`);
        if ((_b = unref(property).images) == null ? void 0 : _b[unref(currentImageIndex)]) {
          _push(`<img${ssrRenderAttr("src", unref(property).images[unref(currentImageIndex)])} class="h-full w-full object-cover object-center" alt="" decoding="async" data-v-c5a30de1>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20" data-v-c5a30de1></div></div>`);
        if (unref(property).images.length > 1) {
          _push(`<div class="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-5" data-v-c5a30de1><button type="button" aria-label="Photo pr\xE9c\xE9dente" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
          _push(`</button><button type="button" aria-label="Photo suivante" class="pointer-events-auto rounded-full border border-white/30 bg-black/45 p-3 text-white backdrop-blur-md transition hover:bg-black/70" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 rotate-180" }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pointer-events-none absolute bottom-0 left-0 right-0 z-20 pb-12 pt-24" data-v-c5a30de1><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-c5a30de1><div class="flex flex-col md:flex-row items-end justify-between gap-6" data-v-c5a30de1><div class="space-y-4 max-w-3xl" data-v-c5a30de1><div class="flex flex-wrap items-center gap-3" data-v-c5a30de1>`);
        if (unref(isPropertyTaken) && !unref(property).isHotel) {
          _push(`<span class="px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-red-900/30 border border-red-500/80" data-v-c5a30de1>${ssrInterpolate(unref(property).transactionType === "location" || unref(property).transactionType === "louer" ? "D\xE9j\xE0 pris" : "Vendu")}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25" data-v-c5a30de1>${ssrInterpolate(unref(property).isHotel ? "H\xE9bergement" : unref(property).status)}</span><span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).fullAddress || unref(property).location)}</span><span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(Home), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).type)}</span></div><h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg" data-v-c5a30de1>${ssrInterpolate(unref(property).title)}</h1><p class="text-white/80 max-w-xl line-clamp-3 text-lg" data-v-c5a30de1>${ssrInterpolate(unref(property).isHotel ? unref(property).description || "H\xE9bergement \u2014 tarifs indiqu\xE9s par chambre." : "Une opportunit\xE9 unique \xE0 ne pas manquer.")}</p></div><div class="flex flex-col gap-3 min-w-[200px]" data-v-c5a30de1>`);
        if (!unref(property).hideListingPrice) {
          _push(`<div class="text-right text-white mb-2" data-v-c5a30de1><div class="text-sm opacity-80 mb-1" data-v-c5a30de1>Prix</div><div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110" data-v-c5a30de1>${ssrInterpolate(unref(property).price)} <span class="text-lg text-white/80 font-normal" data-v-c5a30de1>${ssrInterpolate(unref(property).frequency)}</span></div><div class="text-xs opacity-70 mt-1" data-v-c5a30de1>${ssrInterpolate(unref(property).currencyLabel)}</div></div>`);
        } else if (unref(hotelStarting)) {
          _push(`<div class="text-right text-white mb-2" data-v-c5a30de1><div class="text-sm opacity-80 mb-1" data-v-c5a30de1>\xC0 partir de</div><div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110" data-v-c5a30de1>${ssrInterpolate(unref(hotelStarting).formatted)}</div></div>`);
        } else {
          _push(`<div class="text-right text-white mb-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md" data-v-c5a30de1><div class="text-xs font-bold uppercase tracking-wider opacity-90" data-v-c5a30de1>H\xF4tel</div><p class="text-sm font-medium leading-snug mt-1" data-v-c5a30de1>Les tarifs sont affich\xE9s par chambre ci-dessous.</p></div>`);
        }
        _push(`<div class="pointer-events-auto flex gap-3 justify-end" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: toggleFavorite,
          size: "icon",
          variant: "secondary",
          class: "rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Heart), {
                class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Heart), {
                  class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
                }, null, 8, ["class"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: shareProperty,
          size: "icon",
          variant: "secondary",
          class: "rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Share2), { class: "h-5 w-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Share2), { class: "h-5 w-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div></div><section class="py-16 -mt-8 relative z-30" data-v-c5a30de1><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-c5a30de1><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-c5a30de1><div class="lg:col-span-2 space-y-12" data-v-c5a30de1><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-c5a30de1>`);
        if (unref(property).isResidential) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(BedDouble), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).beds)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Chambres</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Bath), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).baths)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Salles de bain</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(ChefHat), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).kitchen)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Cuisines</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).area)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Surface</span></div>`);
          if (unref(property).guarantee) {
            _push(`<div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
            _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
            _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).guarantee)} mois</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Garantie</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (unref(property).isBureau) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Briefcase), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).numberPiece)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Pi\xE8ces</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Users), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).roomMeet)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>R\xE9unions</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(property).isEquipped ? unref(CheckCircle2) : unref(XCircle)), {
            class: ["h-6 w-6 group-hover:scale-110 transition-transform", unref(property).isEquipped ? "text-green-500" : "text-muted-foreground"]
          }, null), _parent);
          _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).isEquipped ? "Oui" : "Non")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Meubl\xE9</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-lg font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).area || "-")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Surface</span></div><!--]-->`);
        } else if (unref(property).isHotel) {
          _push(`<div class="col-span-4 flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted/20 p-6 text-center sm:flex-row sm:text-left" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Hotel), { class: "h-8 w-8 shrink-0 text-primary" }, null, _parent));
          _push(`<div data-v-c5a30de1><p class="font-semibold text-foreground" data-v-c5a30de1>Tarifs par chambre</p><p class="text-sm text-muted-foreground" data-v-c5a30de1>${ssrInterpolate(((_c = unref(property).hotelChambres) == null ? void 0 : _c.length) ? `${unref(property).hotelChambres.length} offre(s) ci-dessous.` : "Les chambres disponibles apparaissent sous la description.")}</p></div>`);
          if ((_d = unref(property).hotelChambres) == null ? void 0 : _d.length) {
            _push(`<a href="#chambres-hotel" class="ml-auto shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90" data-v-c5a30de1> Voir les chambres </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (unref(property).isEvent || unref(property).isFuneraire || unref(property).isFestive) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Users), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).capacity)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Capacit\xE9</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).area || "-")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Surface</span></div><!--]-->`);
        } else if (unref(property).isTerrain) {
          _push(`<div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-c5a30de1>${ssrInterpolate(unref(property).area)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-c5a30de1>Surface Totale</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(property).streetAddress || unref(property).quartier || unref(property).commune || unref(property).city || unref(property).country) {
          _push(`<div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm" data-v-c5a30de1><h2 class="text-2xl font-bold mb-6 flex items-center gap-2" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(MapPin), { class: "h-6 w-6 text-primary" }, null, _parent));
          _push(` Adresse </h2><dl class="grid gap-4 sm:grid-cols-2" data-v-c5a30de1>`);
          if (unref(property).streetAddress) {
            _push(`<div data-v-c5a30de1><dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-v-c5a30de1>Adresse</dt><dd class="mt-1 text-base font-semibold text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).streetAddress)}</dd></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(property).quartier) {
            _push(`<div data-v-c5a30de1><dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-v-c5a30de1>Quartier</dt><dd class="mt-1 text-base font-semibold text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).quartier)}</dd></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(property).commune) {
            _push(`<div data-v-c5a30de1><dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-v-c5a30de1>Commune</dt><dd class="mt-1 text-base font-semibold text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).commune)}</dd></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(property).city) {
            _push(`<div data-v-c5a30de1><dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-v-c5a30de1>Ville</dt><dd class="mt-1 text-base font-semibold text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).city)}</dd></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(property).country) {
            _push(`<div data-v-c5a30de1><dt class="text-xs font-semibold uppercase tracking-wide text-muted-foreground" data-v-c5a30de1>Pays</dt><dd class="mt-1 text-base font-semibold text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).country)}</dd></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</dl></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm" data-v-c5a30de1><h2 class="text-2xl font-bold mb-6 flex items-center gap-2" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(FileText), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(` Description </h2><div class="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line" data-v-c5a30de1>${ssrInterpolate(unref(property).description)}</div></div>`);
        if (unref(property).isHotel && ((_e = unref(property).hotelChambres) == null ? void 0 : _e.length)) {
          _push(`<div id="chambres-hotel" class="scroll-mt-24 space-y-6" data-v-c5a30de1><h2 class="flex items-center gap-2 text-2xl font-bold" data-v-c5a30de1>`);
          _push(ssrRenderComponent(unref(Hotel), { class: "h-7 w-7 text-primary" }, null, _parent));
          _push(` Chambres &amp; tarifs </h2><div class="grid items-stretch gap-6 sm:grid-cols-2" data-v-c5a30de1><!--[-->`);
          ssrRenderList(unref(property).hotelChambres, (ch) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: ch.id,
              to: `/properties/${unref(route).params.id}/chambres/${unref(encodeId)(ch.id)}`,
              class: "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card text-left shadow-sm transition hover:ring-2 hover:ring-primary/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="h-52 w-full shrink-0 overflow-hidden bg-muted" data-v-c5a30de1${_scopeId}>`);
                  if (ch.image) {
                    _push2(`<img${ssrRenderAttr("src", ch.image)} alt="" class="h-full w-full object-cover" data-v-c5a30de1${_scopeId}>`);
                  } else {
                    _push2(`<div class="flex h-full w-full items-center justify-center text-muted-foreground/40" data-v-c5a30de1${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(BedDouble), { class: "h-12 w-12" }, null, _parent2, _scopeId));
                    _push2(`</div>`);
                  }
                  _push2(`</div><div class="flex min-h-[11.5rem] flex-1 flex-col gap-2 p-5" data-v-c5a30de1${_scopeId}><h3 class="line-clamp-1 text-lg font-bold group-hover:text-primary" data-v-c5a30de1${_scopeId}>${ssrInterpolate(ch.title)}</h3><p class="line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground" data-v-c5a30de1${_scopeId}>${ssrInterpolate(ch.description)}</p><p class="text-xs font-medium text-primary" data-v-c5a30de1${_scopeId}>Voir le d\xE9tail \u2192</p><div class="mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-border/50 pt-4" data-v-c5a30de1${_scopeId}><div data-v-c5a30de1${_scopeId}><span class="text-xs text-muted-foreground" data-v-c5a30de1${_scopeId}>\xC0 partir de</span><p class="text-2xl font-black text-primary" data-v-c5a30de1${_scopeId}>${ssrInterpolate(unref(formatCurrency)(ch.price, ch.currencyLabel))} <span class="text-sm font-semibold text-muted-foreground" data-v-c5a30de1${_scopeId}> / nuit</span></p></div>`);
                  if (ch.priceHeure) {
                    _push2(`<span class="max-w-[50%] text-right text-xs text-muted-foreground" data-v-c5a30de1${_scopeId}>${ssrInterpolate(ch.priceHeure)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "h-52 w-full shrink-0 overflow-hidden bg-muted" }, [
                      ch.image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: ch.image,
                        alt: "",
                        class: "h-full w-full object-cover"
                      }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "flex h-full w-full items-center justify-center text-muted-foreground/40"
                      }, [
                        createVNode(unref(BedDouble), { class: "h-12 w-12" })
                      ]))
                    ]),
                    createVNode("div", { class: "flex min-h-[11.5rem] flex-1 flex-col gap-2 p-5" }, [
                      createVNode("h3", { class: "line-clamp-1 text-lg font-bold group-hover:text-primary" }, toDisplayString(ch.title), 1),
                      createVNode("p", { class: "line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground" }, toDisplayString(ch.description), 1),
                      createVNode("p", { class: "text-xs font-medium text-primary" }, "Voir le d\xE9tail \u2192"),
                      createVNode("div", { class: "mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-border/50 pt-4" }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "text-xs text-muted-foreground" }, "\xC0 partir de"),
                          createVNode("p", { class: "text-2xl font-black text-primary" }, [
                            createTextVNode(toDisplayString(unref(formatCurrency)(ch.price, ch.currencyLabel)) + " ", 1),
                            createVNode("span", { class: "text-sm font-semibold text-muted-foreground" }, " / nuit")
                          ])
                        ]),
                        ch.priceHeure ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "max-w-[50%] text-right text-xs text-muted-foreground"
                        }, toDisplayString(ch.priceHeure), 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else if (unref(property).isHotel) {
          _push(`<div class="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground" data-v-c5a30de1> Aucune chambre publi\xE9e pour cet \xE9tablissement pour le moment. </div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(property).features && unref(property).features.length > 0) {
          _push(`<div data-v-c5a30de1><h2 class="text-2xl font-bold mb-6" data-v-c5a30de1>Caract\xE9ristiques</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-4" data-v-c5a30de1><!--[-->`);
          ssrRenderList(unref(property).features, (feature) => {
            _push(`<div class="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50" data-v-c5a30de1>`);
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-5 w-5 text-primary flex-shrink-0" }, null, _parent));
            _push(`<span class="font-medium" data-v-c5a30de1>${ssrInterpolate(feature)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(property).isHotel && (unref(property).electricity > 0 || unref(property).water > 0)) {
          _push(`<div class="grid grid-cols-1 gap-6 md:grid-cols-2" data-v-c5a30de1>`);
          if (unref(property).electricity > 0) {
            _push(`<div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4" data-v-c5a30de1><div class="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center" data-v-c5a30de1>`);
            _push(ssrRenderComponent(unref(Zap), { class: "h-7 w-7 text-yellow-600" }, null, _parent));
            _push(`</div><div data-v-c5a30de1><p class="text-sm text-muted-foreground font-medium uppercase tracking-wide" data-v-c5a30de1>\xC9LECTRICIT\xC9 (${ssrInterpolate(unref(property).electricity)}%)</p><p class="${ssrRenderClass([unref(property).electricityColor, "text-lg font-bold"])}" data-v-c5a30de1>${ssrInterpolate(unref(property).electricityInfo)}</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(property).water > 0) {
            _push(`<div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4" data-v-c5a30de1><div class="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center" data-v-c5a30de1>`);
            _push(ssrRenderComponent(unref(Droplets), { class: "h-7 w-7 text-blue-600" }, null, _parent));
            _push(`</div><div data-v-c5a30de1><p class="text-sm text-muted-foreground font-medium uppercase tracking-wide" data-v-c5a30de1>EAU (${ssrInterpolate(unref(property).water)}%)</p><p class="${ssrRenderClass([unref(property).waterColor, "text-lg font-bold"])}" data-v-c5a30de1>${ssrInterpolate(unref(property).waterInfo)}</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(property).images.length > 0) {
          _push(`<div data-v-c5a30de1><h2 class="text-2xl font-bold mb-6" data-v-c5a30de1>Galerie Photos</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-c5a30de1><!--[-->`);
          ssrRenderList(unref(property).images, (img, idx) => {
            _push(`<div class="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group" data-v-c5a30de1><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-c5a30de1><div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" data-v-c5a30de1></div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-v-c5a30de1>`);
            _push(ssrRenderComponent(unref(Maximize), { class: "h-8 w-8 text-white drop-shadow-lg" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-c5a30de1><div class="sticky top-32 space-y-6" data-v-c5a30de1><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg" data-v-c5a30de1><div class="text-center mb-6" data-v-c5a30de1><div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary mb-3 relative cursor-pointer hover:scale-105 transition-transform group/profile" data-v-c5a30de1><img${ssrRenderAttr("src", unref(property).agent.profileImage || unref(property).agent.avatar)} class="w-full h-full rounded-full object-cover" data-v-c5a30de1><div class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-white drop-shadow-md" }, null, _parent));
        _push(`</div><div class="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 border-2 border-card text-white" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3 w-3" }, null, _parent));
        _push(`</div></div><h3 class="text-xl font-bold mb-1" data-v-c5a30de1>${ssrInterpolate(unref(property).agent.name)}</h3></div><div class="space-y-4" data-v-c5a30de1>`);
        if (unref(property).isHotel) {
          _push(`<p class="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground" data-v-c5a30de1> Les r\xE9servations se font <span class="font-semibold text-foreground" data-v-c5a30de1>par chambre</span> \u2014 ouvrez une chambre ci-dessous puis r\xE9servez. </p>`);
        } else {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            disabled: unref(isPropertyTaken),
            title: unref(isPropertyTaken) ? "Ce bien n\u2019est plus disponible" : void 0,
            onClick: contactAgent,
            class: "w-full rounded-xl h-14 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Calendar), { class: "mr-2 h-5 w-5" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(unref(isPropertyTaken) ? "Indisponible" : "Programmer une visite")}`);
              } else {
                return [
                  createVNode(unref(Calendar), { class: "mr-2 h-5 w-5" }),
                  createTextVNode(" " + toDisplayString(unref(isPropertyTaken) ? "Indisponible" : "Programmer une visite"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div><div class="mt-8 pt-6 border-t border-border/50" data-v-c5a30de1><div class="flex items-center justify-between text-sm text-muted-foreground" data-v-c5a30de1><div class="flex items-center gap-2" data-v-c5a30de1>`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
        _push(`<span data-v-c5a30de1>Publi\xE9 le</span></div><span class="font-medium text-foreground" data-v-c5a30de1>${ssrInterpolate(unref(property).createdAt)}</span></div></div></div></div></div></div></div></section></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(property)) {
        _push(ssrRenderComponent(unref(VueEasyLightbox), {
          visible: unref(lightboxVisible),
          imgs: unref(lightboxImgs),
          index: unref(lightboxIndex),
          onHide: ($event) => lightboxVisible.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$1, {
        isOpen: unref(isVisitModalOpen),
        propertyId: unref(propertyId),
        "chambre-id": unref(visitChambreId),
        "property-title": unref(visitChambreId) != null ? unref(visitChambreTitleStr) : ((_f = unref(property)) == null ? void 0 : _f.title) || "",
        "property-type": ((_g = unref(property)) == null ? void 0 : _g.type) || "",
        onClose: onVisitModalClose
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/properties/[id]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c5a30de1"]]);

export { index as default };
//# sourceMappingURL=index-CpBx7d37.mjs.map
