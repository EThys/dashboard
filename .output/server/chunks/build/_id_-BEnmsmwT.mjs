import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, reactive, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { ShieldCheck, ArrowLeft, MapPin, Star, Heart, Share2, Maximize, CheckCircle2, Calendar, Clock, X, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import VueEasyLightbox from 'vue-easy-lightbox';
import { g as getCurrencyLabel, f as formatCurrency } from './currency-BoakoUK-.mjs';
import { d as decodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { _ as _export_sfc, m as useRoute, a as useRouter, g as useServiceStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, l as useAuthStore } from './server.mjs';
import { D as DetailShimmer } from './DetailShimmer-CZGzkLXC.mjs';
import { _ as _sfc_main$4 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$3 } from './Label-DssVEliA.mjs';
import { u as useAsyncData } from './asyncData-BvsKIpkL.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ServiceSolicitationModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    serviceId: {},
    serviceTitle: {},
    minPrice: {},
    currencyCode: {},
    deviseId: {}
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useAuthStore();
    const isLoading = ref(false);
    const form = reactive({
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: "",
      description: "",
      budget: props.minPrice || 0
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in transition-opacity"></div><div class="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200"><button class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">`);
        _push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
        _push(`</button><h2 class="text-xl font-bold mb-1">Demander une intervention</h2><p class="text-sm text-muted-foreground mb-6">Pour : ${ssrInterpolate(__props.serviceTitle)}</p><form class="space-y-4"><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Date de d\xE9but *`);
            } else {
              return [
                createTextVNode("Date de d\xE9but *")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          type: "date",
          modelValue: unref(form).startDate,
          "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
          required: ""
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Date de fin (Optionnel)`);
            } else {
              return [
                createTextVNode("Date de fin (Optionnel)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          type: "date",
          modelValue: unref(form).endDate,
          "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
          min: unref(form).startDate
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Votre budget estim\xE9 (${ssrInterpolate(__props.currencyCode || "$")})`);
            } else {
              return [
                createTextVNode("Votre budget estim\xE9 (" + toDisplayString(__props.currencyCode || "$") + ")", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          type: "number",
          step: "0.01",
          modelValue: unref(form).budget,
          "onUpdate:modelValue": ($event) => unref(form).budget = $event,
          required: ""
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Description (Optionnel)`);
            } else {
              return [
                createTextVNode("Description (Optionnel)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="D\xE9tails sur votre besoin...">${ssrInterpolate(unref(form).description)}</textarea></div><div class="flex justify-end gap-3 pt-4">`);
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
              _push2(` Envoyer la demande `);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-4 w-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" Envoyer la demande ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/ServiceSolicitationModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const serviceId = computed(() => decodeId(route.params.id));
    const serviceStore = useServiceStore();
    const fetchedService = ref(null);
    const storeService = computed(() => fetchedService.value || serviceStore.getServiceById(serviceId.value));
    const getCurrencyCode = (deviseId) => {
      return deviseId === 1 ? "CDF" : "USD";
    };
    const { pending: isLoading } = useAsyncData(
      `service-${serviceId.value}`,
      async () => {
        try {
          const data = await $fetch(
            joinApi(config.public.apiBase, `${ApiEndpoints.publicPrestations}/${serviceId.value}`)
          );
          if (data && data.prestations) {
            fetchedService.value = data;
            return true;
          }
        } catch (e) {
          console.warn("Direct service fetch failed, falling back to collection");
        }
        if (serviceStore.services.length === 0) {
          await serviceStore.fetchServices(config.public.apiBase);
        }
        return true;
      },
      {
        lazy: true,
        server: false
      }
    );
    const service = computed(() => {
      const raw = storeService.value;
      if (!raw) return null;
      const p = raw.prestation;
      const images = raw.image || [];
      const currencyCode = getCurrencyCode(p.deviseId);
      return {
        id: p.id,
        title: p.title,
        description: p.description,
        location: `${p.communeValue}, ${p.cityValue}`,
        fullAddress: `${p.address}, ${p.communeValue}, ${p.cityValue}`,
        price: formatCurrency(p.minPrice, currencyCode),
        minPrice: p.minPrice,
        maxPrice: p.maxPrice,
        currencyCode,
        currencyLabel: getCurrencyLabel(currencyCode),
        deviseId: p.deviseId,
        experience: p.experience,
        availabilityDays: p.plageJourPrestation,
        availabilityHours: p.plageHeurePrestation,
        provider: {
          name: raw.postBy.replace("@@", "@"),
          image: p.profile || "/avatar-placeholder.png",
          isVerified: true
        },
        images: images.map((img) => img.path),
        rating: 4.9,
        reviews: 12
      };
    });
    const visibleRef = ref(false);
    const indexRef = ref(0);
    const lightboxImgs = ref([]);
    const onHide = () => visibleRef.value = false;
    const goBack = () => router.back();
    const currentImageIndex = ref(0);
    const isFavorite = ref(false);
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
    };
    const shareService = async () => {
      var _a, _b, _c;
      const title = ((_a = service.value) == null ? void 0 : _a.title) || "";
      const location = ((_b = service.value) == null ? void 0 : _b.location) || "";
      const price = ((_c = service.value) == null ? void 0 : _c.price) || "";
      const url = (void 0).location.href;
      const shareText = `D\xE9couvrez ce service : ${title} \xE0 ${location} \xE0 partir de ${price} ${url}`;
      if ((void 0).share) {
        try {
          await (void 0).share({
            title,
            text: shareText,
            url
          });
        } catch (err) {
          console.log("Share canceled");
        }
      } else {
        (void 0).clipboard.writeText(shareText);
        alert("Lien et pr\xE9sentation copi\xE9s !");
      }
    };
    const isModalOpen = ref(false);
    const contactProvider = () => {
      isModalOpen.value = true;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))} data-v-2c04eb4e>`);
      if (unref(isLoading) || !unref(service)) {
        _push(`<div data-v-2c04eb4e>`);
        _push(ssrRenderComponent(DetailShimmer, { type: "service" }, null, _parent));
        _push(`</div>`);
      } else if (!unref(service)) {
        _push(`<div class="min-h-screen flex flex-col items-center justify-center space-y-4" data-v-2c04eb4e><div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-8 w-8 text-muted-foreground" }, null, _parent));
        _push(`</div><h2 class="text-2xl font-bold" data-v-2c04eb4e>Service non trouv\xE9</h2>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), { onClick: goBack }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour aux services`);
            } else {
              return [
                createTextVNode("Retour aux services")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="min-h-screen" data-v-2c04eb4e><div class="relative h-[60vh] md:h-[70vh] group bg-slate-900 border-b border-white/10 overflow-hidden" data-v-2c04eb4e><button class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 group-hover/back:-translate-x-1 transition-transform" }, null, _parent));
        _push(`</button><div class="absolute inset-0 z-0" data-v-2c04eb4e><!--[-->`);
        ssrRenderList(unref(service).images, (img, idx) => {
          _push(`<div class="${ssrRenderClass([idx === unref(currentImageIndex) ? "opacity-100" : "opacity-0", "absolute inset-0 transition-opacity duration-700 ease-in-out"])}" data-v-2c04eb4e><div class="absolute inset-0 scale-110 blur-xl brightness-50" data-v-2c04eb4e><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover opacity-80" data-v-2c04eb4e></div><div class="absolute inset-0 flex items-center justify-center" data-v-2c04eb4e><img${ssrRenderAttr("src", img)} class="w-full h-full object-contain shadow-2xl" data-v-2c04eb4e></div><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" data-v-2c04eb4e></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(service).images.length > 1) {
          _push(`<div class="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" data-v-2c04eb4e><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-2c04eb4e>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
          _push(`</button><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-2c04eb4e>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 rotate-180" }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32" data-v-2c04eb4e><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-2c04eb4e><div class="flex flex-col md:flex-row items-end justify-between gap-6" data-v-2c04eb4e><div class="space-y-4 max-w-3xl" data-v-2c04eb4e><div class="flex flex-wrap items-center gap-3" data-v-2c04eb4e><span class="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25" data-v-2c04eb4e> Service </span><span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(service).location)}</span></div><h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg" data-v-2c04eb4e>${ssrInterpolate(unref(service).title)}</h1><div class="flex items-center gap-4 text-white/90" data-v-2c04eb4e><div class="flex items-center gap-1.5" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(Star), { class: "h-5 w-5 text-yellow-500 fill-yellow-500" }, null, _parent));
        _push(`<span class="font-bold text-lg" data-v-2c04eb4e>${ssrInterpolate(unref(service).rating)}</span><span class="text-sm opacity-80" data-v-2c04eb4e>(${ssrInterpolate(unref(service).reviews)} avis)</span></div></div></div><div class="flex flex-col gap-3 min-w-[200px]" data-v-2c04eb4e><div class="text-right text-white mb-2" data-v-2c04eb4e><div class="text-sm opacity-80 mb-1" data-v-2c04eb4e>\xC0 partir de</div><div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110" data-v-2c04eb4e>${ssrInterpolate(unref(service).price)}</div><div class="text-xs text-white/70 mt-1" data-v-2c04eb4e>${ssrInterpolate(unref(service).currencyLabel)}</div></div><div class="flex gap-3 justify-end" data-v-2c04eb4e>`);
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
          onClick: shareService,
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
        _push(`</div></div></div></div></div></div><section class="py-16 relative z-40 bg-background" data-v-2c04eb4e><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-2c04eb4e><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-2c04eb4e><div class="lg:col-span-2 space-y-12" data-v-2c04eb4e><div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm" data-v-2c04eb4e><h2 class="text-2xl font-bold mb-6 flex items-center gap-2" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(` \xC0 propos du service </h2><div class="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line" data-v-2c04eb4e>${ssrInterpolate(unref(service).description)}</div></div>`);
        if (unref(service).images.length > 0) {
          _push(`<div data-v-2c04eb4e><h2 class="text-2xl font-bold mb-6" data-v-2c04eb4e>R\xE9alisations pr\xE9c\xE9dentes</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-2c04eb4e><!--[-->`);
          ssrRenderList(unref(service).images, (img, idx) => {
            _push(`<div class="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group" data-v-2c04eb4e><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-2c04eb4e><div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" data-v-2c04eb4e></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-2c04eb4e><div class="sticky top-32 space-y-6" data-v-2c04eb4e><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg" data-v-2c04eb4e><div class="text-center mb-6" data-v-2c04eb4e><div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary mb-3 relative cursor-pointer hover:scale-105 transition-transform group/profile" data-v-2c04eb4e><img${ssrRenderAttr("src", unref(service).provider.image)} class="w-full h-full rounded-full object-cover" data-v-2c04eb4e><div class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-white drop-shadow-md" }, null, _parent));
        _push(`</div><div class="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 border-2 border-card text-white" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3 w-3" }, null, _parent));
        _push(`</div></div><h3 class="text-xl font-bold mb-1" data-v-2c04eb4e>${ssrInterpolate(unref(service).provider.name)}</h3><p class="text-sm text-muted-foreground" data-v-2c04eb4e>${ssrInterpolate(unref(service).experience ? unref(service).experience + " ans d'exp\xE9rience" : "Nouveau prestataire")}</p></div><div class="space-y-4" data-v-2c04eb4e><div class="flex items-center gap-3 p-3 bg-muted/40 rounded-xl" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 text-primary flex-shrink-0" }, null, _parent));
        _push(`<div class="flex-1" data-v-2c04eb4e><p class="text-xs font-medium text-muted-foreground" data-v-2c04eb4e>Disponible</p><p class="text-sm font-semibold break-words whitespace-normal" data-v-2c04eb4e>${ssrInterpolate(unref(service).availabilityDays)}</p></div></div><div class="flex items-center gap-3 p-3 bg-muted/40 rounded-xl" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(Clock), { class: "h-5 w-5 text-primary" }, null, _parent));
        _push(`<div data-v-2c04eb4e><p class="text-xs font-medium text-muted-foreground" data-v-2c04eb4e>Heures</p><p class="text-sm font-semibold" data-v-2c04eb4e>${ssrInterpolate(unref(service).availabilityHours)}</p></div></div></div><div class="mt-8" data-v-2c04eb4e>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: contactProvider,
          class: "w-full rounded-xl h-14 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Demander une intervention `);
            } else {
              return [
                createTextVNode(" Demander une intervention ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-center text-xs text-muted-foreground mt-3" data-v-2c04eb4e> R\xE9ponse rapide garantie </p></div></div></div></div></div></div></section>`);
        _push(ssrRenderComponent(unref(VueEasyLightbox), {
          visible: unref(visibleRef),
          imgs: unref(lightboxImgs),
          index: unref(indexRef),
          onHide
        }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$1, {
          isOpen: unref(isModalOpen),
          serviceId: unref(serviceId),
          serviceTitle: ((_a = unref(service)) == null ? void 0 : _a.title) || "",
          minPrice: (_b = unref(service)) == null ? void 0 : _b.minPrice,
          currencyCode: (_c = unref(service)) == null ? void 0 : _c.currencyCode,
          deviseId: (_d = unref(service)) == null ? void 0 : _d.deviseId,
          onClose: ($event) => isModalOpen.value = false
        }, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2c04eb4e"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BEnmsmwT.mjs.map
