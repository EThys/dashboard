import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { ArrowLeft, MapPin, Heart, Share2, Calendar, Clock, Users, CheckCircle2, Info, Maximize } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { defineStore } from 'pinia';
import { _ as _export_sfc, m as useRoute, a as useRouter, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useReservationStore } from './reservations-DAod7jv9.mjs';
import { d as decodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import VueEasyLightbox from 'vue-easy-lightbox';
import { D as DetailShimmer } from './DetailShimmer-rdBM6wYW.mjs';
import { _ as _sfc_main$2 } from './ListingReservationModal-THezhj5t.mjs';
import { u as useAsyncData } from './asyncData-cMiNwecB.mjs';
import '../nitro/nitro.mjs';
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
import 'vue-router';
import '@tanstack/vue-query';
import './partyExtract-LSdOdPXy.mjs';
import './Input-CIBjNfXj.mjs';
import './Label-DssVEliA.mjs';
import 'perfect-debounce';

const useVacanceStore = defineStore("vacances", {
  state: () => ({
    vacances: [],
    loading: false,
    error: null
  }),
  getters: {
    getVacanceById: (state) => (id) => {
      return state.vacances.find((v) => v.vacance.id === id);
    }
  },
  actions: {
    async fetchVacanceById(id, apiBase) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch(
          joinApi(apiBase, `${ApiEndpoints.propertyVacances}/${id}`)
        );
        if (response && response.data && response.data.length > 0) {
          const detail = response.data[0];
          const existingIdx = this.vacances.findIndex((v) => v.vacance.id === detail.vacance.id);
          if (existingIdx !== -1) {
            this.vacances[existingIdx] = detail;
          } else {
            this.vacances.push(detail);
          }
          return detail;
        }
        return null;
      } catch (e) {
        console.error("Failed to fetch vacance detail", e);
        this.error = e.message || "Erreur lors du chargement du site";
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const vacanceStore = useVacanceStore();
    const authStore = useAuthStore();
    useReservationStore();
    const vacanceId = computed(() => decodeId(route.params.id));
    const detail = ref(null);
    const { pending: isLoading } = useAsyncData(
      `vacance-${vacanceId.value}`,
      () => vacanceStore.fetchVacanceById(vacanceId.value, config.public.apiBase),
      {
        lazy: true,
        server: false,
        transform: (data) => {
          detail.value = data;
          return data;
        }
      }
    );
    const vacance = computed(() => {
      var _a;
      return (_a = detail.value) == null ? void 0 : _a.vacance;
    });
    const images = computed(() => {
      var _a;
      const imgs = ((_a = detail.value) == null ? void 0 : _a.image) || [];
      return imgs.length > 0 ? imgs.map((i) => i.path) : [];
    });
    const currentImageIndex = ref(0);
    const lightboxVisible = ref(false);
    const lightboxIndex = ref(0);
    const goBack = () => router.back();
    const isFavorite = ref(false);
    const toggleFavorite = () => isFavorite.value = !isFavorite.value;
    const shareVacance = async () => {
      var _a;
      const title = ((_a = vacance.value) == null ? void 0 : _a.title) || "";
      const url = (void 0).location.href;
      const shareText = `D\xE9couvrez ce s\xE9jour : ${title}. ${url}`;
      if ((void 0).share) {
        try {
          await (void 0).share({ title, text: shareText, url });
        } catch {
        }
      } else {
        (void 0).clipboard.writeText(shareText);
        toast.success("Lien copi\xE9 !");
      }
    };
    const isModalOpen = ref(false);
    const reserveVacance = () => {
      if (!authStore.isAuthenticated) {
        return navigateTo(`/login?reason=reservation&redirect=${route.fullPath}`);
      }
      isModalOpen.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-752ae5f3>`);
      if (unref(isLoading) && !unref(vacance)) {
        _push(`<div data-v-752ae5f3>`);
        _push(ssrRenderComponent(DetailShimmer, { type: "property" }, null, _parent));
        _push(`</div>`);
      } else if (unref(vacance)) {
        _push(`<div class="min-h-screen" data-v-752ae5f3><div class="relative h-[60vh] md:h-[70vh] group bg-slate-900 border-b border-white/10 overflow-hidden" data-v-752ae5f3><button class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
        _push(`</button><div class="absolute inset-0 z-0 bg-slate-800" data-v-752ae5f3>`);
        if (unref(images).length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(unref(images), (img, idx) => {
            _push(`<div class="${ssrRenderClass([idx === unref(currentImageIndex) ? "opacity-100" : "opacity-0", "absolute inset-0 transition-opacity duration-700 ease-in-out"])}" data-v-752ae5f3><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover opacity-60" data-v-752ae5f3></div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<div class="absolute inset-0 flex items-center justify-center text-white/20" data-v-752ae5f3><div class="text-center" data-v-752ae5f3>`);
          _push(ssrRenderComponent(unref(MapPin), { class: "h-20 w-20 mx-auto mb-4 opacity-10" }, null, _parent));
          _push(`<p class="font-bold opacity-30" data-v-752ae5f3>Pas de photos disponibles</p></div></div>`);
        }
        _push(`<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" data-v-752ae5f3></div></div>`);
        if (unref(images).length > 1) {
          _push(`<div class="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" data-v-752ae5f3><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-752ae5f3>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
          _push(`</button><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-752ae5f3>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 rotate-180" }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute bottom-0 left-0 right-0 z-20 pb-12" data-v-752ae5f3><div class="container mx-auto px-4 md:px-8" data-v-752ae5f3><div class="flex flex-col md:flex-row items-end justify-between gap-6 uppercase" data-v-752ae5f3><div class="space-y-4 max-w-3xl" data-v-752ae5f3><div class="flex flex-wrap items-center gap-3" data-v-752ae5f3><span class="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-black tracking-widest leading-none" data-v-752ae5f3> VACANCES &amp; TOURISME </span><span class="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-widest leading-none flex items-center gap-2" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent));
        _push(` ${ssrInterpolate(unref(vacance).cityValue)}, ${ssrInterpolate(unref(vacance).countryValue)}</span></div><h1 class="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-none drop-shadow-2xl" data-v-752ae5f3>${ssrInterpolate(unref(vacance).title)}</h1></div><div class="flex flex-col gap-3 min-w-[220px] text-right" data-v-752ae5f3><div class="text-white" data-v-752ae5f3><div class="text-xs font-black opacity-60 mb-1 tracking-widest" data-v-752ae5f3>PRIX DU S\xC9JOUR</div><div class="text-5xl font-black text-primary drop-shadow-lg" data-v-752ae5f3>${ssrInterpolate(unref(vacance).price)}<span class="text-2xl font-black ml-1" data-v-752ae5f3>$</span></div><div class="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider" data-v-752ae5f3>${ssrInterpolate(unref(vacance).priceCombo)}</div></div><div class="flex gap-2 justify-end" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: toggleFavorite,
          size: "icon",
          variant: "secondary",
          class: "rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl"
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
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: shareVacance,
          size: "icon",
          variant: "secondary",
          class: "rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl"
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
        _push(`</div></div></div></div></div></div><section class="py-20 -mt-10 relative z-30" data-v-752ae5f3><div class="container mx-auto px-4 md:px-8" data-v-752ae5f3><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-752ae5f3><div class="lg:col-span-2 space-y-12" data-v-752ae5f3><div class="grid grid-cols-2 lg:grid-cols-4 gap-4" data-v-752ae5f3><div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all" data-v-752ae5f3><div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(`</div><span class="text-lg font-black leading-none" data-v-752ae5f3>${ssrInterpolate(unref(vacance).dateVacance)}</span><span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]" data-v-752ae5f3>Date D\xE9part</span></div><div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all" data-v-752ae5f3><div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Clock), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(`</div><span class="text-lg font-black leading-none" data-v-752ae5f3>${ssrInterpolate(unref(vacance).heureVacance)}</span><span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]" data-v-752ae5f3>Heure</span></div><div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all" data-v-752ae5f3><div class="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Users), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(`</div><span class="text-lg font-black leading-none" data-v-752ae5f3>${ssrInterpolate(unref(vacance).capacity)}</span><span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]" data-v-752ae5f3>Places Max</span></div><div class="bg-card p-6 rounded-[2rem] border border-border/40 shadow-sm flex flex-col items-center gap-2 text-center group hover:border-primary/30 transition-all" data-v-752ae5f3><div class="size-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-6 w-6 text-emerald-500" }, null, _parent));
        _push(`</div><span class="text-lg font-black leading-none" data-v-752ae5f3>${ssrInterpolate(unref(vacance).available ? "OUVERT" : "COMPLET")}</span><span class="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]" data-v-752ae5f3>Disponibilit\xE9</span></div></div><div class="bg-card rounded-[2.5rem] p-10 border border-border/40 shadow-sm relative overflow-hidden" data-v-752ae5f3><div class="absolute top-0 left-0 w-2 h-full bg-primary/20" data-v-752ae5f3></div><h2 class="text-3xl font-black mb-8 flex items-center gap-4" data-v-752ae5f3><div class="size-10 rounded-xl bg-primary flex items-center justify-center" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Info), { class: "h-6 w-6 text-white" }, null, _parent));
        _push(`</div> \xC0 propos du s\xE9jour </h2><p class="text-muted-foreground leading-relaxed whitespace-pre-line text-xl font-medium" data-v-752ae5f3>${ssrInterpolate(unref(vacance).description)}</p>`);
        if (unref(vacance).note) {
          _push(`<div class="mt-10 p-6 bg-muted/30 rounded-3xl border border-dashed border-border/60 text-base italic text-muted-foreground flex gap-4 items-start" data-v-752ae5f3><span class="font-black text-primary text-xl leading-none" data-v-752ae5f3>\u201C</span><span data-v-752ae5f3>Note de l&#39;agence : ${ssrInterpolate(unref(vacance).note)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(images).length > 0) {
          _push(`<div class="space-y-8" data-v-752ae5f3><h2 class="text-3xl font-black px-2 flex items-center gap-4" data-v-752ae5f3> Galerie Photos <span class="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full" data-v-752ae5f3>${ssrInterpolate(unref(images).length)} photos</span></h2><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-v-752ae5f3><!--[-->`);
          ssrRenderList(unref(images), (img, idx) => {
            _push(`<div class="aspect-[4/3] rounded-[2rem] overflow-hidden cursor-pointer hover:scale-[1.03] transition-all relative group shadow-lg" data-v-752ae5f3><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-752ae5f3><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-752ae5f3>`);
            _push(ssrRenderComponent(unref(Maximize), { class: "h-8 w-8 text-white scale-75 group-hover:scale-100 transition-transform" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-752ae5f3><div class="sticky top-32 bg-white rounded-2xl p-8 border border-slate-100 shadow-xl text-slate-800" data-v-752ae5f3><div class="mb-8" data-v-752ae5f3><h3 class="text-2xl font-black mb-3" data-v-752ae5f3>R\xE9server votre place</h3><p class="text-slate-500 text-sm leading-relaxed" data-v-752ae5f3>Places limit\xE9es. Une confirmation instantan\xE9e vous sera envoy\xE9e apr\xE8s v\xE9rification par nos \xE9quipes.</p></div><div class="space-y-6 mb-8" data-v-752ae5f3><div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-6 w-6 text-primary shrink-0" }, null, _parent));
        _push(`<div data-v-752ae5f3><p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5" data-v-752ae5f3>Point de d\xE9part</p><p class="font-bold text-sm" data-v-752ae5f3>${ssrInterpolate(unref(vacance).address)}</p></div></div><div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-6 w-6 text-primary shrink-0" }, null, _parent));
        _push(`<div data-v-752ae5f3><p class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5" data-v-752ae5f3>Date limite</p><p class="font-bold text-sm" data-v-752ae5f3>${ssrInterpolate(unref(vacance).dateVacance)}</p></div></div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: reserveVacance,
          class: "w-full h-16 rounded-xl font-black text-xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` R\xE9server Maintenant `);
            } else {
              return [
                createTextVNode(" R\xE9server Maintenant ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6" data-v-752ae5f3> PAIEMENT S\xC9CURIS\xC9 PAR CASANAYO </p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/agences",
          class: "flex items-center justify-center gap-2 text-sm font-black text-muted-foreground hover:text-primary transition-colors group py-4"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 group-hover:-translate-x-1 transition-transform" }, null, _parent2, _scopeId));
              _push2(` VOIR TOUTES LES AGENCES `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "h-4 w-4 group-hover:-translate-x-1 transition-transform" }),
                createTextVNode(" VOIR TOUTES LES AGENCES ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></section></div>`);
      } else {
        _push(`<div class="min-h-screen flex items-center justify-center bg-muted/10" data-v-752ae5f3><div class="max-w-md w-full p-12 bg-card rounded-[3rem] border border-border shadow-2xl text-center" data-v-752ae5f3><div class="size-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6" data-v-752ae5f3>`);
        _push(ssrRenderComponent(unref(Info), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
        _push(`</div><h2 class="text-3xl font-black mb-3" data-v-752ae5f3>S\xE9jour introuvable</h2><p class="text-muted-foreground mb-8 text-lg font-medium" data-v-752ae5f3>L&#39;offre que vous recherchez semble avoir expir\xE9 ou a \xE9t\xE9 retir\xE9e par l&#39;agence.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: goBack,
          class: "w-full h-14 rounded-2xl font-black text-lg"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retourner \xE0 l&#39;accueil`);
            } else {
              return [
                createTextVNode("Retourner \xE0 l'accueil")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(ssrRenderComponent(unref(VueEasyLightbox), {
        visible: unref(lightboxVisible),
        imgs: unref(images),
        index: unref(lightboxIndex),
        onHide: ($event) => lightboxVisible.value = false
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        isOpen: unref(isModalOpen),
        listingId: unref(vacanceId),
        listingTitle: ((_a = unref(vacance)) == null ? void 0 : _a.title) || "",
        type: "vacance",
        onClose: ($event) => isModalOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/vacances/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-752ae5f3"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-zJOXFQpG.mjs.map
