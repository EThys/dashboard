import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as _sfc_main$a } from './PromoStrip-BN9cB65f.mjs';
import { defineComponent, computed, unref, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, watch, resolveDynamicComponent, withAsyncContext, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _imports_1, a as _imports_2$1 } from './playStore-CtjIKwbQ.mjs';
import { _ as _sfc_main$b } from './Button-B_RLy27J.mjs';
import { ChevronDown, Search, Smartphone, MapPin, BedDouble, Bath, Maximize, ChevronLeft, ChevronRight, ArrowRight, UserPlus, CalendarCheck, Home, Tent, Warehouse, Ghost, Palmtree, Hotel, Briefcase, Building2, ShieldCheck, Truck, Scissors, Paintbrush, Hammer, Zap, Wrench } from 'lucide-vue-next';
import { i as useSeoMeta, u as useHead, f as usePropertyStore, a as useRouter, g as useServiceStore, _ as _export_sfc, j as joinApi, A as ApiEndpoints, h as byNewest, p as propertyStamp, c as useRuntimeConfig, s as serviceStamp } from './server.mjs';
import { u as useAsyncData } from './asyncData-DaMIbxNX.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { g as getCurrencyLabel, f as formatCurrency } from './currency-BoakoUK-.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { useQuery } from '@tanstack/vue-query';
import { g as getPublicListingStatus, P as PropertyCardShimmer } from './listingAvailability-D5tiSI1y.mjs';
import { i as isLocationTransactionType, g as getPublicTransactionBadgeLabel } from './transactionDisplay-GAAD372w.mjs';
import { p as propertyPublicPath } from './propertyLink-DjylkIdD.mjs';
import { f as formatListingPlace } from './propertyNormalizer-DiijNhdR.mjs';
import { l as lowestHotelRoomOffer } from './hotelStartingPrice-TSwrGxRW.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import 'vue-router';

const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const router = useRouter();
    const propertyStore = usePropertyStore();
    const serviceStore = useServiceStore();
    const activeTab = ref("properties");
    const location = ref("");
    const propertyType = ref("");
    const budgetAmount = ref("");
    const budgetCurrency = ref("USD");
    const serviceCategory = ref("");
    const serviceSearch = ref("");
    function parseBudget(value) {
      if (value === null || value === void 0 || value === "") return null;
      const cleaned = String(value).replace(/\s/g, "").replace(",", ".");
      if (!cleaned) return null;
      const amount = Number(cleaned);
      return Number.isFinite(amount) && amount > 0 ? amount : null;
    }
    const { pending: isLoadingTypes } = useAsyncData("hero-types", () => propertyStore.fetchTypes(config.public.apiBase), {
      lazy: true,
      server: false
    });
    const { pending: isLoadingCats } = useAsyncData("hero-cats", () => serviceStore.fetchCategories(config.public.apiBase), {
      lazy: true,
      server: false
    });
    const propertyTypes = computed(() => propertyStore.getTypes);
    const serviceCategories = computed(() => serviceStore.getCategories);
    const handleSearch = () => {
      if (activeTab.value === "properties") {
        const query = {};
        if (location.value && location.value.trim()) query.q = location.value.trim();
        if (propertyType.value && propertyType.value !== "all") query.type = propertyType.value;
        const budget = parseBudget(budgetAmount.value);
        if (budget !== null) {
          query.maxPrice = budget;
          query.currency = budgetCurrency.value;
        }
        router.push({ path: "/properties", query });
      } else {
        const query = {};
        if (serviceCategory.value && serviceCategory.value !== "all") {
          query.categoryId = serviceCategory.value;
        }
        if (serviceSearch.value) query.q = serviceSearch.value;
        router.push({ path: "/services", query });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen flex flex-col pt-12 sm:pt-16 lg:pt-20 pb-12 overflow-hidden bg-slate-900" }, _attrs))}><div class="absolute inset-0 z-0 select-none"><div class="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/90 z-10"></div><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&amp;w=2675&amp;auto=format&amp;fit=crop" alt="Luxury Property" class="w-full h-full object-cover opacity-80 scale-105 animate-slow-zoom"></div><div class="absolute inset-0 z-0 overflow-hidden pointer-events-none"><div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob mix-blend-screen"></div><div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-screen"></div><div class="absolute -bottom-32 left-1/3 w-full h-64 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div><div class="absolute top-0 left-0 w-full h-full opacity-10"><div class="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div><div class="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-full"></div><div class="absolute bottom-40 left-20 w-48 h-48 border border-white/10 rounded-full"></div></div><div class="absolute top-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse"></div><div class="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div><div class="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-600"></div></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10 h-full flex flex-col justify-center pt-8 sm:pt-0"><div class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"><div class="lg:col-span-7 flex flex-col justify-center relative z-20"><div class="absolute -top-32 -left-20 opacity-0 animate-fade-in-down pointer-events-none"><h1 class="text-[8rem] sm:text-[10rem] lg:text-[14rem] font-black text-white/5 leading-none tracking-tighter select-none mix-blend-overlay"> CasaNayo </h1></div><div class="space-y-6 opacity-0 animate-fade-in-up animation-delay-300 relative"><h2 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl tracking-tight text-left"><span class="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-sky-200"> Louer, Acheter, </span><span class="block"> Vendre &amp; Services </span></h2><p class="text-white/90 text-lg sm:text-xl leading-relaxed font-medium drop-shadow-lg max-w-2xl text-left border-l-4 border-primary/50 pl-6"> CasaNayo centralise l\u2019ensemble du parcours immobilier : recherche de biens, vente, location et services \xE0 domicile (\xE9lectricien, plombier...). <span class="block mt-2 text-white/70 text-base">Elle simplifie votre vie en offrant tout au m\xEAme endroit.</span></p><div class="flex items-center gap-6 pt-4 text-white/60"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span class="text-sm font-medium tracking-wider uppercase">+500 Propri\xE9t\xE9s</span></div><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse animation-delay-300"></div><span class="text-sm font-medium tracking-wider uppercase">Services Pro</span></div></div></div></div><div class="lg:col-span-5 relative z-30 mt-8 lg:mt-0 opacity-0 animate-fade-in-up animation-delay-600"><div class="bg-white/5 lg:bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-primary/10"><div class="flex p-1 bg-black/20 rounded-2xl mb-6"><button class="${ssrRenderClass([activeTab.value === "properties" ? "bg-white text-slate-900 shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5", "relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"])}"> Propri\xE9t\xE9s </button><button class="${ssrRenderClass([activeTab.value === "services" ? "bg-white text-slate-900 shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5", "relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"])}"> Services </button></div>`);
      if (activeTab.value === "properties") {
        _push(`<div class="space-y-4"><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Localisation</label><input${ssrRenderAttr("value", location.value)} list="hero-places" type="text" placeholder="Ville, commune ou quartier" class="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-primary outline-none"><datalist id="hero-places"><!--[-->`);
        ssrRenderList(["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Kisangani", "Matadi", "Kananga", "Mbuji-Mayi", "Kolwezi", "Likasi", "Mbandaka", "Kindu", "Boma", "Gombe", "Kalamu", "Ngaliema", "Lemba", "Limete", "Bandalungwa"], (city) => {
          _push(`<option${ssrRenderAttr("value", city)}></option>`);
        });
        _push(`<!--]--></datalist></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Type</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900 font-bold"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, "") : ssrLooseEqual(propertyType.value, "")) ? " selected" : ""}>Tout type</option><!--[-->`);
        ssrRenderList(propertyTypes.value, (type) => {
          _push(`<option${ssrRenderAttr("value", type.name)} class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, type.name) : ssrLooseEqual(propertyType.value, type.name)) ? " selected" : ""}>${ssrInterpolate(type.name)}</option>`);
        });
        _push(`<!--]--></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Budget maximum</label><div class="flex gap-2"><input${ssrRenderAttr("value", budgetAmount.value)} type="number" min="0" step="any" inputmode="decimal" placeholder="Montant libre, ex. 250" class="min-w-0 flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-primary outline-none"><div class="flex h-12 shrink-0 rounded-xl border border-white/10 overflow-hidden"><button type="button" class="${ssrRenderClass([budgetCurrency.value === "USD" ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:text-white", "px-3 text-sm font-bold transition-colors"])}"> $ </button><button type="button" class="${ssrRenderClass([budgetCurrency.value === "CDF" ? "bg-white text-slate-900" : "bg-white/10 text-white/80 hover:text-white", "px-3 text-sm font-bold transition-colors"])}"> FC </button></div></div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$b), {
          class: "w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]",
          onClick: handleSearch
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Search), { class: "h-5 w-5 mr-2" }, null, _parent2, _scopeId));
              _push2(` Rechercher `);
            } else {
              return [
                createVNode(unref(Search), { class: "h-5 w-5 mr-2" }),
                createTextVNode(" Rechercher ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4"><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Cat\xE9gorie</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900 font-bold"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, "") : ssrLooseEqual(serviceCategory.value, "")) ? " selected" : ""}>Toutes cat\xE9gories</option><!--[-->`);
        ssrRenderList(serviceCategories.value, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.id)} class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, cat.id) : ssrLooseEqual(serviceCategory.value, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Recherche</label><div class="relative group"><input${ssrRenderAttr("value", serviceSearch.value)} type="text" placeholder="Ex: Plombier..." class="w-full h-12 pl-4 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all placeholder:text-white/30"></div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$b), {
          class: "w-full h-14 mt-2 font-bold text-base bg-white text-slate-900 hover:bg-sky-50 rounded-xl shadow-lg transition-all transform active:scale-[0.98]",
          onClick: handleSearch
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Search), { class: "h-5 w-5 mr-2" }, null, _parent2, _scopeId));
              _push2(` Trouver un pro `);
            } else {
              return [
                createVNode(unref(Search), { class: "h-5 w-5 mr-2" }),
                createTextVNode(" Trouver un pro ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div></div></div></div><div class="hidden lg:block absolute lg:bottom-10 left-0 w-full z-20 opacity-0 animate-fade-in-up animation-delay-1000 px-4 sm:px-6"><div class="container mx-auto"><div class="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-5 rounded-[2rem] bg-white/5 lg:bg-slate-900/40 backdrop-blur-2xl border border-white/10 max-w-7xl mx-auto transition-all duration-300 shadow-2xl"><div class="flex items-center gap-5 text-center sm:text-left"><div class="p-4 bg-primary/20 rounded-2xl shrink-0 flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Smartphone), { class: "w-6 h-6 text-primary" }, null, _parent));
      _push(`</div><div class="flex flex-col text-left"><p class="text-white font-black text-base sm:text-lg leading-none tracking-tight">Disponible sur mobile</p><p class="text-white/50 text-xs sm:text-sm mt-1.5 font-medium text-left">L&#39;exp\xE9rience CasaNayo partout avec vous</p></div></div><div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"><a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center px-6 py-3.5 bg-white text-slate-900 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl w-full sm:w-auto"><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-6 w-auto"><div class="w-px h-6 bg-slate-900/10 mx-4"></div><div class="text-left"><div class="text-[0.55rem] font-bold uppercase tracking-widest opacity-60 leading-none mb-0.5">App Store</div><div class="text-sm font-black leading-tight">T\xE9l\xE9charger</div></div></a><a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="flex items-center px-6 py-3.5 bg-white/5 border border-white/20 text-white rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 backdrop-blur-md shadow-xl w-full sm:w-auto"><img${ssrRenderAttr("src", _imports_2$1)} alt="Play Store" class="h-6 w-auto"><div class="w-px h-6 bg-white/20 mx-4"></div><div class="text-left"><div class="text-[0.55rem] font-bold uppercase tracking-widest opacity-60 leading-none mb-0.5">Google Play</div><div class="text-sm font-black leading-tight">Disponible</div></div></a></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Hero.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "HowItWorks",
  __ssrInlineRender: true,
  setup(__props) {
    const steps = [
      {
        icon: UserPlus,
        title: "Cr\xE9ez votre compte",
        description: "Inscrivez-vous en quelques secondes pour acc\xE9der \xE0 toutes les fonctionnalit\xE9s exclusives."
      },
      {
        icon: Search,
        title: "Recherchez",
        description: "Trouvez facilement le bien de vos r\xEAves ou le service dont vous avez besoin."
      },
      {
        icon: CalendarCheck,
        title: "R\xE9servez",
        description: "Planifiez une visite ou r\xE9servez une prestation. Acc\xE9dez \xE0 tout cela pour juste un petit 4$/an."
      },
      {
        icon: Home,
        title: "Profitez",
        description: "Installez-vous ou profitez du service accompli en toute s\xE9r\xE9nit\xE9."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" }, _attrs))} data-v-70f290aa><div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" data-v-70f290aa></div><div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" data-v-70f290aa></div><div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" data-v-70f290aa></div><div class="container mx-auto px-6 lg:px-12 relative z-10" data-v-70f290aa><div class="text-left max-w-2xl mb-16 reveal-left" data-v-70f290aa><h3 class="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight" data-v-70f290aa> Votre projet immobilier en <br data-v-70f290aa><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500" data-v-70f290aa>4 \xE9tapes simples</span></h3><p class="text-slate-600 text-base leading-relaxed" data-v-70f290aa> Que vous cherchiez un bien ou un service, tout se fait en un clin d&#39;\u0153il. </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative" data-v-70f290aa><div class="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-200 z-0" data-v-70f290aa></div><!--[-->`);
      ssrRenderList(steps, (step, index) => {
        _push(`<div class="${ssrRenderClass([`reveal-delay-${(index + 1) * 100}`, "relative z-10 group reveal"])}" data-v-70f290aa><div class="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20" data-v-70f290aa><div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500 shadow-sm relative" data-v-70f290aa><div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm border-4 border-white shadow-lg z-20" data-v-70f290aa>${ssrInterpolate(index + 1)}</div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(step.icon), { class: "w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-300" }, null), _parent);
        _push(`</div><h4 class="text-xl font-bold text-slate-900 mb-3" data-v-70f290aa>${ssrInterpolate(step.title)}</h4><p class="text-slate-500 leading-relaxed text-sm" data-v-70f290aa>${ssrInterpolate(step.description)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/HowItWorks.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const HowItWorks = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-70f290aa"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CombinedCategories",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const serviceStore = useServiceStore();
    const desktopScrollContainer = ref(null);
    const { pending: isLoadingProps } = useAsyncData("property-types", () => propertyStore.fetchTypes(config.public.apiBase), {
      lazy: true,
      server: false
    });
    const { pending: isLoadingServices } = useAsyncData("service-categories", () => serviceStore.fetchCategories(config.public.apiBase), {
      lazy: true,
      server: false
    });
    const isLoading = computed(() => isLoadingProps.value || isLoadingServices.value);
    const combinedItems = computed(() => {
      const props = (propertyStore.getTypes || []).map((p) => ({
        id: p.propertyTypeId,
        name: p.name === "Apparts" ? "appartement" : p.name,
        type: "property",
        link: `/properties?type=${p.name}`
      }));
      const serves = (serviceStore.getCategories || []).map((s) => ({
        id: s.id,
        name: s.name,
        type: "service",
        link: `/services?categoryId=${s.id}`
      }));
      return [...props, ...serves];
    });
    const getStyle = (name, type) => {
      const lowerName = name.toLowerCase();
      if (type === "property") {
        switch (lowerName) {
          case "studio":
            return { icon: Hotel };
          case "apparts":
          case "appartement":
            return { icon: Building2 };
          case "maisons":
            return { icon: Home };
          case "bureau":
            return { icon: Briefcase };
          case "hotels":
            return { icon: Hotel };
          case "vacances":
            return { icon: Palmtree };
          case "espace fun\xE9raire":
            return { icon: Ghost };
          case "salle de f\xEAte":
            return { icon: Warehouse };
          case "terrain":
            return { icon: Tent };
          default:
            return { icon: Home };
        }
      } else {
        switch (lowerName) {
          case "plombier":
            return { icon: Wrench };
          case "electricien":
            return { icon: Zap };
          case "menuisier":
            return { icon: Hammer };
          case "peintre":
            return { icon: Paintbrush };
          case "coiffeur":
            return { icon: Scissors };
          case "d\xE9m\xE9nageur":
            return { icon: Truck };
          case "s\xE9curit\xE9":
            return { icon: ShieldCheck };
          default:
            return { icon: Briefcase };
        }
      }
    };
    const showLeftBtn = ref(false);
    const showRightBtn = ref(true);
    const updateScrollButtonsStatus = () => {
      const container = desktopScrollContainer.value;
      if (!container) return;
      showLeftBtn.value = container.scrollLeft > 0;
      showRightBtn.value = container.scrollLeft < container.scrollWidth - container.clientWidth - 5;
    };
    watch(combinedItems, () => {
      setTimeout(updateScrollButtonsStatus, 100);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-6 md:py-8 bg-white border-b border-gray-100 relative" }, _attrs))} data-v-eaf356c8><div class="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative" data-v-eaf356c8><div class="relative mt-2" data-v-eaf356c8><button class="flex absolute -left-2 md:-left-4 top-[calc(50%-10px)] -translate-y-1/2 z-20 size-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-black hover:scale-105 hover:shadow-lg transition-all" style="${ssrRenderStyle(showLeftBtn.value ? null : { display: "none" })}" data-v-eaf356c8>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-4" }, null, _parent));
      _push(`</button><button class="flex absolute -right-2 md:-right-4 top-[calc(50%-10px)] -translate-y-1/2 z-20 size-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-black hover:scale-105 hover:shadow-lg transition-all" style="${ssrRenderStyle(showRightBtn.value ? null : { display: "none" })}" data-v-eaf356c8>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "size-4" }, null, _parent));
      _push(`</button>`);
      if (isLoading.value && combinedItems.value.length === 0) {
        _push(`<div class="flex gap-8 overflow-hidden min-h-[70px]" data-v-eaf356c8><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="flex flex-col items-center gap-2" data-v-eaf356c8><div class="size-8 rounded-full bg-gray-200 animate-pulse" data-v-eaf356c8></div><div class="w-16 h-2 bg-gray-200 rounded animate-pulse" data-v-eaf356c8></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div data-v-eaf356c8><div class="flex items-end justify-start gap-x-10 gap-y-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth relative z-10" data-v-eaf356c8><!--[-->`);
        ssrRenderList(combinedItems.value, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: `${item.type}-${item.id}`,
            to: item.link,
            class: "flex-none group flex flex-col items-center gap-2 relative px-4 py-3 -mx-4 min-w-[70px] cursor-pointer outline-none rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-110 hover:-translate-y-1 z-0 hover:z-10"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(getStyle(item.name, item.type).icon), { class: "size-[26px] text-gray-500 group-hover:text-black transition-colors duration-200 stroke-[1.5]" }, null), _parent2, _scopeId);
                _push2(`<span class="text-[13px] font-medium text-gray-500 group-hover:text-black transition-colors duration-200 whitespace-nowrap" data-v-eaf356c8${_scopeId}>${ssrInterpolate(item.name)}</span><div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 rounded-t-sm" data-v-eaf356c8${_scopeId}></div>`);
              } else {
                return [
                  (openBlock(), createBlock(resolveDynamicComponent(getStyle(item.name, item.type).icon), { class: "size-[26px] text-gray-500 group-hover:text-black transition-colors duration-200 stroke-[1.5]" })),
                  createVNode("span", { class: "text-[13px] font-medium text-gray-500 group-hover:text-black transition-colors duration-200 whitespace-nowrap" }, toDisplayString(item.name), 1),
                  createVNode("div", { class: "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-black opacity-0 group-hover:w-8 group-hover:opacity-100 transition-all duration-300 rounded-t-sm" })
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      }
      _push(`<div class="hidden md:block absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 -ml-2" style="${ssrRenderStyle(showLeftBtn.value ? null : { display: "none" })}" data-v-eaf356c8></div><div class="hidden md:block absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 -mr-2" style="${ssrRenderStyle(showRightBtn.value ? null : { display: "none" })}" data-v-eaf356c8></div></div></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/CombinedCategories.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const CombinedCategories = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-eaf356c8"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AllServices",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const serviceStore = useServiceStore();
    const config = useRuntimeConfig();
    const getCurrencyCode = (deviseId) => {
      return deviseId === 1 ? "CDF" : "USD";
    };
    const { data: fetchResult, pending: isLoading } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-services", async () => {
      try {
        const response = await $fetch(joinApi(config.public.apiBase, ApiEndpoints.publicPrestations));
        if (response && response.prestations) {
          serviceStore.setServices(response.prestations);
          return response.prestations;
        }
        return [];
      } catch (e) {
        console.error("Home Services Fetch Error", e);
        return [];
      }
    }, {
      lazy: true,
      server: false,
      default: () => serviceStore.services
    })), __temp = await __temp, __restore(), __temp);
    watch(fetchResult, (newData) => {
      if (newData && newData.length) {
        serviceStore.setServices(newData);
      }
    }, { immediate: true });
    const displayedServices = computed(() => {
      const source = serviceStore.services.length ? serviceStore.services : fetchResult.value || [];
      return byNewest(source, serviceStamp).slice(0, 8);
    });
    ref(null);
    ref(false);
    ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 overflow-hidden" }, _attrs))} data-v-53de1679><div class="container mx-auto px-4 sm:px-8 lg:px-12 xl:px-16" data-v-53de1679><div class="flex items-end justify-between mb-8 md:mb-12" data-v-53de1679><div class="max-w-3xl space-y-2 md:space-y-4 reveal-left" data-v-53de1679><span class="text-primary font-bold tracking-wider uppercase text-xs md:text-sm" data-v-53de1679>Tous nos services</span><h2 class="text-2xl lg:text-4xl font-black text-foreground" data-v-53de1679>Des professionnels \xE0 votre service</h2><p class="text-muted-foreground text-sm md:text-lg hidden md:block" data-v-53de1679> D\xE9couvrez notre gamme compl\xE8te de services \xE0 domicile. Des experts qualifi\xE9s pour tous vos besoins. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: "hidden md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "font-bold border-custom rounded-full px-6 hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout `);
                  _push3(ssrRenderComponent(unref(ArrowRight), { class: "ml-2 h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Voir tout "),
                    createVNode(unref(ArrowRight), { class: "ml-2 h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "font-bold border-custom rounded-full px-6 hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tout "),
                  createVNode(unref(ArrowRight), { class: "ml-2 h-4 w-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!unref(displayedServices).length) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10" data-v-53de1679><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="h-80 bg-muted animate-pulse rounded-3xl" data-v-53de1679></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10" data-v-53de1679><!--[-->`);
        ssrRenderList(unref(displayedServices), (item, index) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.prestation.id,
            to: `/services/${unref(encodeId)(item.prestation.id)}`,
            class: ["group bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full reveal", index % 3 === 0 ? "reveal-delay-100" : index % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<div class="relative h-48 md:h-56 overflow-hidden" data-v-53de1679${_scopeId}><img${ssrRenderAttr("src", ((_a = item.image[0]) == null ? void 0 : _a.path) || "/placeholder-service.jpg")}${ssrRenderAttr("alt", item.prestation.title)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-v-53de1679${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" data-v-53de1679${_scopeId}></div><div class="absolute top-4 left-4" data-v-53de1679${_scopeId}><div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full" data-v-53de1679${_scopeId}>${ssrInterpolate(item.prestation.cityValue)}</div></div><div class="absolute bottom-4 left-4 text-white" data-v-53de1679${_scopeId}><span class="text-xs opacity-90" data-v-53de1679${_scopeId}>\xC0 partir de</span><div class="text-xl font-black" data-v-53de1679${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)))}</div><div class="text-xs opacity-80" data-v-53de1679${_scopeId}>${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId)))}</div></div></div><div class="p-6 flex-1 flex flex-col" data-v-53de1679${_scopeId}><h3 class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1" data-v-53de1679${_scopeId}>${ssrInterpolate(item.prestation.title)}</h3><p class="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1" data-v-53de1679${_scopeId}>${ssrInterpolate(item.prestation.description)}</p><div class="flex items-center justify-between pt-4 border-t border-border mt-auto" data-v-53de1679${_scopeId}><div class="flex items-center gap-2" data-v-53de1679${_scopeId}><div class="w-8 h-8 rounded-full overflow-hidden border border-border" data-v-53de1679${_scopeId}><img${ssrRenderAttr("src", item.prestation.profile || "/avatar-placeholder.png")} class="w-full h-full object-cover" data-v-53de1679${_scopeId}></div><span class="text-xs font-medium text-muted-foreground line-clamp-1" data-v-53de1679${_scopeId}>${ssrInterpolate(item.postBy.replace("@@", "@"))}</span></div>`);
                _push2(ssrRenderComponent(unref(ArrowRight), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-48 md:h-56 overflow-hidden" }, [
                    createVNode("img", {
                      src: ((_b = item.image[0]) == null ? void 0 : _b.path) || "/placeholder-service.jpg",
                      alt: item.prestation.title,
                      class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                    createVNode("div", { class: "absolute top-4 left-4" }, [
                      createVNode("div", { class: "bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full" }, toDisplayString(item.prestation.cityValue), 1)
                    ]),
                    createVNode("div", { class: "absolute bottom-4 left-4 text-white" }, [
                      createVNode("span", { class: "text-xs opacity-90" }, "\xC0 partir de"),
                      createVNode("div", { class: "text-xl font-black" }, toDisplayString(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId))), 1),
                      createVNode("div", { class: "text-xs opacity-80" }, toDisplayString(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId))), 1)
                    ])
                  ]),
                  createVNode("div", { class: "p-6 flex-1 flex flex-col" }, [
                    createVNode("h3", { class: "text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1" }, toDisplayString(item.prestation.title), 1),
                    createVNode("p", { class: "text-sm text-muted-foreground mb-4 line-clamp-2 flex-1" }, toDisplayString(item.prestation.description), 1),
                    createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-border mt-auto" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "w-8 h-8 rounded-full overflow-hidden border border-border" }, [
                          createVNode("img", {
                            src: item.prestation.profile || "/avatar-placeholder.png",
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src"])
                        ]),
                        createVNode("span", { class: "text-xs font-medium text-muted-foreground line-clamp-1" }, toDisplayString(item.postBy.replace("@@", "@")), 1)
                      ]),
                      createVNode(unref(ArrowRight), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" })
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<div class="mt-10 md:hidden" data-v-53de1679>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/services" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "font-bold border-custom rounded-full px-8 w-full py-6 hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tous les services `);
                  _push3(ssrRenderComponent(unref(ArrowRight), { class: "ml-2 h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Voir tous les services "),
                    createVNode(unref(ArrowRight), { class: "ml-2 h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "font-bold border-custom rounded-full px-8 w-full py-6 hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tous les services "),
                  createVNode(unref(ArrowRight), { class: "ml-2 h-4 w-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/AllServices.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const AllServices = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-53de1679"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "FeaturedProperties",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { data: propertiesData, isLoading } = useQuery({
      queryKey: ["featured-properties"],
      queryFn: async () => {
        const res = await fetch(joinApi(config.public.apiBase, ApiEndpoints.properties), {
          signal: AbortSignal.timeout(15e3)
        });
        return res.json();
      }
    });
    const properties = computed(() => {
      var _a;
      if (!((_a = propertiesData.value) == null ? void 0 : _a.properties)) return [];
      return byNewest(propertiesData.value.properties, propertyStamp).slice(0, 8).map((item) => {
        var _a2, _b, _c, _d, _e;
        const p = item.property;
        const addr = item.address;
        const img = ((_c = (_b = (_a2 = item.images) == null ? void 0 : _a2.main) == null ? void 0 : _b[0]) == null ? void 0 : _c.publicPath) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        const currencyCode = ((_d = item.devise) == null ? void 0 : _d.code) || "USD";
        const displayArea = p.surface && p.surface > 0 ? `${p.surface}m\xB2` : p.livingRoom ? `${p.livingRoom} salon(s)` : "";
        let frequency = isLocationTransactionType(p.transactionType) ? "/mois" : "";
        let priceLabel = isLocationTransactionType(p.transactionType) ? "Loyer" : "Montant de la vente";
        const typeStr = (((_e = p.propertyType) == null ? void 0 : _e.name) || "").toLowerCase();
        const titleStr = (p.title || "").toLowerCase();
        const isSpecial = ["hotel", "h\xF4tels", "salle de f\xEAte", "salles de f\xEAte", "espace fun\xE9raire", "espaces fun\xE9raires", "h\xF4tel", "bureau", "terrain"].some((keyword) => typeStr.includes(keyword) || titleStr.includes(keyword)) || item.hotel || item.funeraire || item.festive || item.bureau || item.terrain;
        if (isSpecial) {
          if (isLocationTransactionType(p.transactionType)) {
            frequency = "";
            priceLabel = "Prix";
          } else {
            priceLabel = "Montant de la vente";
          }
        }
        return {
          id: p.propertyId,
          title: p.title || "Sans titre",
          location: `${(addr == null ? void 0 : addr.communeValue) || ""}, ${(addr == null ? void 0 : addr.cityValue) || "RDC"}`,
          price: formatCurrency(p.price, currencyCode),
          priceAmount: p.price,
          currency: getCurrencyLabel(currencyCode),
          currencyCode,
          frequency,
          priceLabel,
          beds: p.bedrooms || 0,
          baths: p.bathroom || 0,
          area: displayArea,
          image: img,
          publisherImage: item.image || "",
          tag: getPublicTransactionBadgeLabel(p.transactionType),
          listingStatus: getPublicListingStatus(p, p.transactionType)
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "properties",
        class: "py-24 bg-muted/30"
      }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16"><div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"><div class="space-y-4 max-w-2xl reveal-left"><span class="text-primary font-bold tracking-wider uppercase text-sm">Nos Propri\xE9t\xE9s</span><h2 class="text-3xl lg:text-4xl font-black text-foreground">D\xE9couvrez nos derni\xE8res p\xE9pites</h2><p class="text-muted-foreground text-lg"> Une s\xE9lection exclusive de biens immobiliers pour tous les budgets. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/properties" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "font-bold border-custom md:self-end rounded-full px-8 hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Voir tout`);
                } else {
                  return [
                    createTextVNode("Voir tout")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "font-bold border-custom md:self-end rounded-full px-8 hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode("Voir tout")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(isLoading)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(ssrRenderComponent(PropertyCardShimmer, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(unref(properties), (property, index) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: property.id,
            to: `/properties/${unref(encodeId)(property.id)}`,
            class: ["group bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full reveal", index % 3 === 0 ? "reveal-delay-100" : index % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-64 overflow-hidden"${_scopeId}><div class="absolute top-4 left-4 z-10 flex flex-col items-start gap-2"${_scopeId}><div class="${ssrRenderClass([property.tag === "Location" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white", "backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"])}"${_scopeId}>${ssrInterpolate(property.tag)}</div><div class="${ssrRenderClass([property.listingStatus.badgeClass, "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md"])}"${_scopeId}>${ssrInterpolate(property.listingStatus.label)}</div></div><img${ssrRenderAttr("src", property.image)}${ssrRenderAttr("alt", property.title)} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"${_scopeId}></div>`);
                if (property.publisherImage) {
                  _push2(`<div class="absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"${_scopeId}><img${ssrRenderAttr("src", property.publisherImage)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="absolute bottom-4 left-4 text-white z-10 flex flex-col"${_scopeId}><span class="text-xs font-medium opacity-90"${_scopeId}>${ssrInterpolate(property.priceLabel)}</span><div class="text-xl font-black"${_scopeId}>${ssrInterpolate(property.price)}</div>`);
                if (property.currency) {
                  _push2(`<div class="text-xs font-medium opacity-80"${_scopeId}>${ssrInterpolate(property.currency)} ${ssrInterpolate(property.frequency)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div><div class="p-6 flex-1 flex flex-col"${_scopeId}><div class="flex items-start justify-between mb-4"${_scopeId}><div class="w-full"${_scopeId}><h3 class="font-bold text-lg text-foreground line-clamp-1"${_scopeId}>${ssrInterpolate(property.title)}</h3><div class="flex items-center gap-2 text-muted-foreground text-sm mt-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 shrink-0" }, null, _parent2, _scopeId));
                _push2(`<span class="truncate"${_scopeId}>${ssrInterpolate(property.location)}</span></div></div></div><div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-border mb-6"${_scopeId}><div class="flex flex-col items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(BedDouble), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.beds)}</span></div><div class="flex flex-col items-center gap-1 border-l border-border"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Bath), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.baths)}</span></div><div class="flex flex-col items-center gap-1 border-l border-border"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.area)}</span></div></div>`);
                _push2(ssrRenderComponent(unref(_sfc_main$b), { class: "w-full mt-auto font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border-0" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Voir les d\xE9tails `);
                    } else {
                      return [
                        createTextVNode(" Voir les d\xE9tails ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-64 overflow-hidden" }, [
                    createVNode("div", { class: "absolute top-4 left-4 z-10 flex flex-col items-start gap-2" }, [
                      createVNode("div", {
                        class: ["backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide", property.tag === "Location" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"]
                      }, toDisplayString(property.tag), 3),
                      createVNode("div", {
                        class: ["text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md", property.listingStatus.badgeClass]
                      }, toDisplayString(property.listingStatus.label), 3)
                    ]),
                    createVNode("img", {
                      src: property.image,
                      alt: property.title,
                      class: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                    property.publisherImage ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    }, [
                      createVNode("img", {
                        src: property.publisherImage,
                        alt: property.title,
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src", "alt"])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "absolute bottom-4 left-4 text-white z-10 flex flex-col" }, [
                      createVNode("span", { class: "text-xs font-medium opacity-90" }, toDisplayString(property.priceLabel), 1),
                      createVNode("div", { class: "text-xl font-black" }, toDisplayString(property.price), 1),
                      property.currency ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-xs font-medium opacity-80"
                      }, toDisplayString(property.currency) + " " + toDisplayString(property.frequency), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "p-6 flex-1 flex flex-col" }, [
                    createVNode("div", { class: "flex items-start justify-between mb-4" }, [
                      createVNode("div", { class: "w-full" }, [
                        createVNode("h3", { class: "font-bold text-lg text-foreground line-clamp-1" }, toDisplayString(property.title), 1),
                        createVNode("div", { class: "flex items-center gap-2 text-muted-foreground text-sm mt-1" }, [
                          createVNode(unref(MapPin), { class: "h-4 w-4 shrink-0" }),
                          createVNode("span", { class: "truncate" }, toDisplayString(property.location), 1)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-3 gap-4 py-4 border-t border-b border-border mb-6" }, [
                      createVNode("div", { class: "flex flex-col items-center gap-1" }, [
                        createVNode(unref(BedDouble), { class: "h-5 w-5 text-muted-foreground" }),
                        createVNode("span", { class: "text-sm font-bold text-foreground" }, toDisplayString(property.beds), 1)
                      ]),
                      createVNode("div", { class: "flex flex-col items-center gap-1 border-l border-border" }, [
                        createVNode(unref(Bath), { class: "h-5 w-5 text-muted-foreground" }),
                        createVNode("span", { class: "text-sm font-bold text-foreground" }, toDisplayString(property.baths), 1)
                      ]),
                      createVNode("div", { class: "flex flex-col items-center gap-1 border-l border-border" }, [
                        createVNode(unref(Maximize), { class: "h-5 w-5 text-muted-foreground" }),
                        createVNode("span", { class: "text-sm font-bold text-foreground" }, toDisplayString(property.area), 1)
                      ])
                    ]),
                    createVNode(unref(_sfc_main$b), { class: "w-full mt-auto font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border-0" }, {
                      default: withCtx(() => [
                        createTextVNode(" Voir les d\xE9tails ")
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/FeaturedProperties.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _imports_2 = "" + buildAssetsURL("demo.BdbtZ4Zd.jpeg");
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AppDownload",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 relative overflow-hidden bg-primary text-white" }, _attrs))} data-v-c610881d><div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse" data-v-c610881d></div><div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl animate-pulse" style="${ssrRenderStyle({ "animation-delay": "1s" })}" data-v-c610881d></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10" data-v-c610881d><div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" data-v-c610881d><div class="space-y-8 text-center lg:text-left" data-v-c610881d><h2 class="text-3xl lg:text-5xl font-black tracking-tight reveal-left" data-v-c610881d> Emportez CasaNayo partout avec vous </h2><div class="space-y-5 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0" data-v-c610881d><p class="reveal-left reveal-delay-100" data-v-c610881d> Trouvez votre propri\xE9t\xE9 id\xE9ale, vendez ou louez votre bien, et acc\xE9dez \xE0 des services pros en un clic. </p><p class="reveal-left reveal-delay-200" data-v-c610881d> Avec <span class="font-black" data-v-c610881d>CasaNayo</span>, g\xE9rez tout votre immobilier depuis votre t\xE9l\xE9phone, partout et \xE0 tout moment. </p><p class="font-bold text-xl reveal-left reveal-delay-300" data-v-c610881d> T\xE9l\xE9chargez l&#39;app maintenant. </p></div><div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 reveal-left reveal-delay-400" data-v-c610881d>`);
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        size: "lg",
        class: "h-16 px-6 bg-black hover:bg-gray-900 text-white border-0 w-full sm:w-auto hover:scale-105 transition-all duration-300 rounded-2xl",
        asChild: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center" data-v-c610881d${_scopeId}><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-8 w-auto" data-v-c610881d${_scopeId}><div class="w-px h-8 bg-white/20 mx-4" data-v-c610881d${_scopeId}></div><div class="text-left" data-v-c610881d${_scopeId}><div class="text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none text-white mb-0.5" data-v-c610881d${_scopeId}>T\xE9l\xE9charger sur</div><div class="text-base font-black leading-tight text-white" data-v-c610881d${_scopeId}>App Store</div></div></a>`);
          } else {
            return [
              createVNode("a", {
                href: "https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB",
                target: "_blank",
                class: "flex items-center"
              }, [
                createVNode("img", {
                  src: _imports_1,
                  alt: "App Store",
                  class: "h-8 w-auto"
                }),
                createVNode("div", { class: "w-px h-8 bg-white/20 mx-4" }),
                createVNode("div", { class: "text-left" }, [
                  createVNode("div", { class: "text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none text-white mb-0.5" }, "T\xE9l\xE9charger sur"),
                  createVNode("div", { class: "text-base font-black leading-tight text-white" }, "App Store")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        size: "lg",
        class: "h-16 px-6 bg-white text-black hover:bg-gray-100 border-0 w-full sm:w-auto hover:scale-105 transition-all duration-300 rounded-2xl",
        asChild: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="flex items-center" data-v-c610881d${_scopeId}><img${ssrRenderAttr("src", _imports_2$1)} alt="Google Play" class="h-8 w-auto" data-v-c610881d${_scopeId}><div class="w-px h-8 bg-black/10 mx-4" data-v-c610881d${_scopeId}></div><div class="text-left" data-v-c610881d${_scopeId}><div class="text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none mb-0.5" data-v-c610881d${_scopeId}>Disponible sur</div><div class="text-base font-black leading-tight" data-v-c610881d${_scopeId}>Google Play</div></div></a>`);
          } else {
            return [
              createVNode("a", {
                href: "https://play.google.com/store/apps/details?id=com.casa.casa.casa&pcampaignid=web_share",
                target: "_blank",
                class: "flex items-center"
              }, [
                createVNode("img", {
                  src: _imports_2$1,
                  alt: "Google Play",
                  class: "h-8 w-auto"
                }),
                createVNode("div", { class: "w-px h-8 bg-black/10 mx-4" }),
                createVNode("div", { class: "text-left" }, [
                  createVNode("div", { class: "text-[0.55rem] font-bold uppercase tracking-[0.15em] opacity-70 leading-none mb-0.5" }, "Disponible sur"),
                  createVNode("div", { class: "text-base font-black leading-tight" }, "Google Play")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative lg:h-[500px] flex items-center justify-center reveal-right reveal-delay-300" data-v-c610881d><div class="relative w-[300px] h-[600px] bg-black rounded-[2.5rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500" data-v-c610881d><div class="absolute top-0 w-full h-8 bg-black z-10 rounded-b-xl" data-v-c610881d></div><img${ssrRenderAttr("src", _imports_2)} class="w-full h-full object-cover" alt="App Screen" data-v-c610881d></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/AppDownload.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AppDownload = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-c610881d"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "PropertySection",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    items: {},
    typeId: {}
  },
  setup(__props) {
    const propertyStore = usePropertyStore();
    const props = __props;
    const normalizeItem = (item) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      let p, addr, img, currencyCode;
      if (item.terrain) {
        p = item.terrain;
        addr = item.address;
        img = (_b = (_a = item.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.path;
      } else if (item.funeraire) {
        p = item.funeraire;
        addr = item.address;
        img = (_d = (_c = item.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.path;
      } else if (item.festive) {
        p = item.festive;
        addr = item.address;
        img = (_f = (_e = item.images) == null ? void 0 : _e[0]) == null ? void 0 : _f.path;
      } else if (item.bureau) {
        p = item.bureau;
        addr = item.address;
        img = (_h = (_g = item.images) == null ? void 0 : _g[0]) == null ? void 0 : _h.path;
      } else if (item.hotel) {
        p = item.hotel;
        addr = p.address;
        img = p.image;
        const loc = formatListingPlace(p) || "RDC";
        const embedded = Array.isArray(item.structure) ? item.structure.map((row) => row == null ? void 0 : row.chambre).filter(Boolean) : [];
        const listed = propertyStore.hotelRooms.filter((room) => Number(room.hotelId) === Number(p == null ? void 0 : p.id));
        const offer = lowestHotelRoomOffer(embedded.length ? embedded : listed);
        return {
          id: (p == null ? void 0 : p.id) || (p == null ? void 0 : p.propertyId) || 0,
          kind: "hotel",
          title: (p == null ? void 0 : p.title) || "Sans titre",
          location: loc,
          price: (offer == null ? void 0 : offer.formatted) || "\u2014",
          hidePrice: !offer,
          currencyCode: (offer == null ? void 0 : offer.currencyCode) || "USD",
          currencySymbol: (offer == null ? void 0 : offer.currencyCode) === "CDF" ? "FC" : "$",
          currencyLabel: offer ? "\xC0 partir de" : "USD",
          currency: offer ? "" : "USD",
          image: img || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
          publisherImage: item.image || "",
          postBy: item.postBy || "",
          tag: "H\xE9bergement",
          transactionType: "h\xE9bergement",
          frequency: "",
          priceLabel: offer ? "\xC0 partir de" : "Tarifs par chambre",
          listingStatus: getPublicListingStatus(p, void 0)
        };
      } else {
        p = item.property;
        addr = item.address;
        img = (_k = (_j = (_i = item.images) == null ? void 0 : _i.main) == null ? void 0 : _j[0]) == null ? void 0 : _k.publicPath;
      }
      if (!img) img = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
      let locationStr = "RDC";
      if (addr) {
        if (typeof addr === "string") {
          if (p.communeValue || p.cityValue) {
            locationStr = `${p.communeValue || ""}, ${p.cityValue || ""}`;
          } else {
            locationStr = addr;
          }
        } else {
          locationStr = `${addr.communeValue || ""}, ${addr.cityValue || ""}`;
        }
      } else if (p.communeValue || p.cityValue) {
        locationStr = `${p.communeValue || ""}, ${p.cityValue || ""}`;
      }
      const priceVal = (_l = p == null ? void 0 : p.price) != null ? _l : 0;
      currencyCode = ((_m = item.devise) == null ? void 0 : _m.code) || "USD";
      const symbol = currencyCode === "USD" ? "$" : "FC";
      const currencyLabel = getCurrencyLabel(currencyCode);
      const tType = (p == null ? void 0 : p.transactionType) || "vente";
      const dispTag = getPublicTransactionBadgeLabel(tType);
      let frequency = isLocationTransactionType(tType) ? "/mois" : "";
      let priceLabel = isLocationTransactionType(tType) ? "Loyer" : "Montant de la vente";
      const isSpecial = Boolean(item.hotel || item.funeraire || item.festive || item.bureau || item.terrain) || ["hotel", "h\xF4tels", "salle de f\xEAte", "salles de f\xEAte", "espace fun\xE9raire", "espaces fun\xE9raires"].includes(props.title.toLowerCase());
      if (isSpecial) {
        if (isLocationTransactionType(tType)) {
          frequency = "";
          priceLabel = "Prix";
        } else {
          priceLabel = "Montant de la vente";
        }
      }
      const kind = item.terrain ? "terrain" : item.funeraire ? "funeraire" : item.festive ? "festive" : item.bureau ? "bureau" : "property";
      return {
        id: (p == null ? void 0 : p.id) || (p == null ? void 0 : p.propertyId) || 0,
        kind,
        title: (p == null ? void 0 : p.title) || "Sans titre",
        location: locationStr,
        price: formatCurrency(priceVal, currencyCode),
        currencyCode,
        currencySymbol: symbol,
        currencyLabel,
        currency: currencyLabel,
        image: img,
        publisherImage: item.image || "",
        postBy: item.postBy || "",
        tag: dispTag,
        transactionType: tType,
        frequency,
        priceLabel,
        listingStatus: getPublicListingStatus(p, p == null ? void 0 : p.transactionType)
      };
    };
    const displayItems = computed(() => {
      return byNewest(props.items || [], propertyStamp).slice(0, 8).map(normalizeItem);
    });
    const viewAllTo = computed(() => {
      const t = String(props.title || "").toLowerCase();
      const isHotels = t.includes("hotel") || t.includes("h\xF4tel");
      if (isHotels) {
        return { path: "/properties", query: { type: "H\xF4tel" } };
      }
      return `/properties?type=${props.typeId}`;
    });
    ref(null);
    const showLeftBtn = ref(false);
    const showRightBtn = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 border-b border-border/40" }, _attrs))} data-v-30a2106e><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-30a2106e><div class="flex items-center justify-between mb-8" data-v-30a2106e><div class="reveal-left" data-v-30a2106e><span class="text-primary font-bold text-sm tracking-wider uppercase" data-v-30a2106e>${ssrInterpolate(__props.subtitle || "D\xE9couvrez")}</span><h2 class="text-3xl font-bold text-foreground mt-1" data-v-30a2106e>${ssrInterpolate(__props.title)}</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: viewAllTo.value,
        class: "hidden md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout `);
                  _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Voir tout "),
                    createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tout "),
                  createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative mt-2" data-v-30a2106e><button class="md:hidden flex absolute -left-2 top-[calc(50%-60px)] -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl text-black active:scale-95 transition-all" style="${ssrRenderStyle(showLeftBtn.value ? null : { display: "none" })}" data-v-30a2106e>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-5" }, null, _parent));
      _push(`</button><button class="md:hidden flex absolute -right-2 top-[calc(50%-60px)] -translate-y-1/2 z-20 size-10 items-center justify-center rounded-full bg-white border border-gray-200 shadow-xl text-black active:scale-95 transition-all" style="${ssrRenderStyle(showRightBtn.value ? null : { display: "none" })}" data-v-30a2106e>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "size-5" }, null, _parent));
      _push(`</button><div class="flex overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 snap-x snap-mandatory md:snap-none" data-v-30a2106e><!--[-->`);
      ssrRenderList(displayItems.value, (item, index) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.id,
          to: unref(propertyPublicPath)(item.id, item.kind),
          class: ["group flex-none snap-center w-[280px] md:w-auto bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 reveal flex flex-col h-full", index % 3 === 0 ? "reveal-delay-100" : index % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative h-44 md:h-64 overflow-hidden" data-v-30a2106e${_scopeId}><div class="absolute top-4 left-4 z-10 flex flex-col items-start gap-2" data-v-30a2106e${_scopeId}><div class="${ssrRenderClass([item.hidePrice ? "bg-slate-700/95 text-white" : item.tag === "Location" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white", "backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"])}" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.tag)}</div><div class="${ssrRenderClass([item.listingStatus.badgeClass, "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md"])}" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.listingStatus.label)}</div></div><img${ssrRenderAttr("src", item.image)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-v-30a2106e${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" data-v-30a2106e${_scopeId}></div>`);
              if (item.publisherImage) {
                _push2(`<div class="absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center" data-v-30a2106e${_scopeId}><img${ssrRenderAttr("src", item.publisherImage)}${ssrRenderAttr("alt", item.postBy)} class="w-full h-full object-cover" data-v-30a2106e${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="absolute bottom-4 left-4 text-white z-10 flex flex-col max-w-[85%]" data-v-30a2106e${_scopeId}>`);
              if (item.hidePrice) {
                _push2(`<span class="text-xs font-medium opacity-90" data-v-30a2106e${_scopeId}>Tarifs par chambre</span>`);
              } else {
                _push2(`<!--[--><span class="text-xs font-medium opacity-90" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.priceLabel)}</span><div class="text-xl font-black" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.price)}</div>`);
                if (item.currency) {
                  _push2(`<div class="text-xs font-medium opacity-80" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.currency)} ${ssrInterpolate(item.frequency)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              }
              _push2(`</div></div><div class="p-6 flex-1 flex flex-col" data-v-30a2106e${_scopeId}><div class="flex items-start justify-between mb-4" data-v-30a2106e${_scopeId}><div class="w-full" data-v-30a2106e${_scopeId}><h3 class="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.title)}</h3><div class="flex items-center gap-2 text-muted-foreground text-sm mt-1" data-v-30a2106e${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 shrink-0" }, null, _parent2, _scopeId));
              _push2(`<span class="line-clamp-2" data-v-30a2106e${_scopeId}>${ssrInterpolate(item.location)}</span></div></div></div>`);
              _push2(ssrRenderComponent(unref(_sfc_main$b), {
                variant: "ghost",
                class: "w-full mt-auto justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Voir d\xE9tails `);
                    _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createTextVNode(" Voir d\xE9tails "),
                      createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "relative h-44 md:h-64 overflow-hidden" }, [
                  createVNode("div", { class: "absolute top-4 left-4 z-10 flex flex-col items-start gap-2" }, [
                    createVNode("div", {
                      class: ["backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide", item.hidePrice ? "bg-slate-700/95 text-white" : item.tag === "Location" ? "bg-blue-600/90 text-white" : "bg-emerald-600/90 text-white"]
                    }, toDisplayString(item.tag), 3),
                    createVNode("div", {
                      class: ["text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-md", item.listingStatus.badgeClass]
                    }, toDisplayString(item.listingStatus.label), 3)
                  ]),
                  createVNode("img", {
                    src: item.image,
                    class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  }, null, 8, ["src"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                  item.publisherImage ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  }, [
                    createVNode("img", {
                      src: item.publisherImage,
                      alt: item.postBy,
                      class: "w-full h-full object-cover"
                    }, null, 8, ["src", "alt"])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "absolute bottom-4 left-4 text-white z-10 flex flex-col max-w-[85%]" }, [
                    item.hidePrice ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-xs font-medium opacity-90"
                    }, "Tarifs par chambre")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("span", { class: "text-xs font-medium opacity-90" }, toDisplayString(item.priceLabel), 1),
                      createVNode("div", { class: "text-xl font-black" }, toDisplayString(item.price), 1),
                      item.currency ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-xs font-medium opacity-80"
                      }, toDisplayString(item.currency) + " " + toDisplayString(item.frequency), 1)) : createCommentVNode("", true)
                    ], 64))
                  ])
                ]),
                createVNode("div", { class: "p-6 flex-1 flex flex-col" }, [
                  createVNode("div", { class: "flex items-start justify-between mb-4" }, [
                    createVNode("div", { class: "w-full" }, [
                      createVNode("h3", { class: "font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors" }, toDisplayString(item.title), 1),
                      createVNode("div", { class: "flex items-center gap-2 text-muted-foreground text-sm mt-1" }, [
                        createVNode(unref(MapPin), { class: "h-4 w-4 shrink-0" }),
                        createVNode("span", { class: "line-clamp-2" }, toDisplayString(item.location), 1)
                      ])
                    ])
                  ]),
                  createVNode(unref(_sfc_main$b), {
                    variant: "ghost",
                    class: "w-full mt-auto justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Voir d\xE9tails "),
                      createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                    ]),
                    _: 1
                  })
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><p class="md:hidden text-muted-foreground text-[10px] font-medium text-center mt-2 tracking-wide" data-v-30a2106e> \u2190 Glissez pour voir plus \u2192 </p></div><div class="mt-6 text-center md:hidden" data-v-30a2106e>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: viewAllTo.value }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout ${ssrInterpolate(__props.title)}`);
                } else {
                  return [
                    createTextVNode(" Voir tout " + toDisplayString(__props.title), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tout " + toDisplayString(__props.title), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/PropertySection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const PropertySection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-30a2106e"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AgenciesShowcase",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { data, pending } = useAsyncData(
      "home-agences-teaser",
      async () => {
        var _a;
        const res = await $fetch(
          joinApi(config.public.apiBase, ApiEndpoints.agences)
        );
        return (_a = res == null ? void 0 : res.data) != null ? _a : [];
      },
      { lazy: true, server: false }
    );
    const items = computed(() => (data.value || []).slice(0, 8));
    ref(null);
    const showLeftBtn = ref(false);
    const showRightBtn = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 border-b border-border/40" }, _attrs))} data-v-94ad9166><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16" data-v-94ad9166><div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" data-v-94ad9166><div class="reveal-left max-w-2xl" data-v-94ad9166><span class="text-primary font-bold text-sm tracking-wider uppercase" data-v-94ad9166>Tourisme</span><h2 class="mt-1 text-3xl font-bold text-foreground" data-v-94ad9166>Explorez les lieux id\xE9aux</h2><p class="mt-2 text-sm leading-relaxed text-muted-foreground" data-v-94ad9166> Voyez comme le Congo est vaste et magnifique : circuits, s\xE9jours et exp\xE9riences s\xE9lectionn\xE9s par des agences partenaires. Un m\xEAme \xE9cran pour r\xEAver votre prochaine escapade. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/agences",
        class: "hidden shrink-0 md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout `);
                  _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Voir tout "),
                    createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tout "),
                  createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative mt-2" data-v-94ad9166><button type="button" class="absolute -left-2 top-[calc(50%-60px)] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-xl transition-all active:scale-95 md:hidden" style="${ssrRenderStyle(showLeftBtn.value ? null : { display: "none" })}" data-v-94ad9166>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-5" }, null, _parent));
      _push(`</button><button type="button" class="absolute -right-2 top-[calc(50%-60px)] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-xl transition-all active:scale-95 md:hidden" style="${ssrRenderStyle(showRightBtn.value ? null : { display: "none" })}" data-v-94ad9166>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "size-5" }, null, _parent));
      _push(`</button>`);
      if (unref(pending)) {
        _push(`<div class="flex gap-6 overflow-hidden pb-6" data-v-94ad9166><!--[-->`);
        ssrRenderList(4, (n) => {
          _push(`<div class="h-[340px] w-[280px] shrink-0 animate-pulse rounded-3xl bg-muted" data-v-94ad9166></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (items.value.length === 0) {
        _push(`<div class="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground" data-v-94ad9166> Aucune agence pour le moment. </div>`);
      } else {
        _push(`<div class="no-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-6 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-2 md:px-0 md:pb-0 lg:grid-cols-4 md:gap-8 md:overflow-visible md:snap-none" data-v-94ad9166><!--[-->`);
        ssrRenderList(items.value, (row, index) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: row.agence.id,
            to: `/agences/${unref(encodeId)(row.agence.id)}`,
            class: [
              "group flex h-full w-[280px] flex-none snap-center flex-col overflow-hidden rounded-3xl border border-border bg-card reveal transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 md:w-auto",
              index % 3 === 0 ? "reveal-delay-100" : index % 3 === 1 ? "reveal-delay-200" : "reveal-delay-300"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-44 overflow-hidden md:h-64" data-v-94ad9166${_scopeId}><img${ssrRenderAttr("src", row.agence.logo)}${ssrRenderAttr("alt", row.agence.name)} class="h-full w-full object-cover transition duration-700 group-hover:scale-110" data-v-94ad9166${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" data-v-94ad9166${_scopeId}></div><div class="absolute bottom-4 left-4 z-10 text-white" data-v-94ad9166${_scopeId}><p class="line-clamp-2 text-lg font-black drop-shadow" data-v-94ad9166${_scopeId}>${ssrInterpolate(row.agence.name)}</p></div></div><div class="flex flex-1 flex-col p-6" data-v-94ad9166${_scopeId}><p class="line-clamp-2 text-sm text-muted-foreground" data-v-94ad9166${_scopeId}>${ssrInterpolate(row.agence.description)}</p><div class="mt-3 flex items-start gap-2 text-sm text-muted-foreground" data-v-94ad9166${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent2, _scopeId));
                _push2(`<span class="line-clamp-2" data-v-94ad9166${_scopeId}>${ssrInterpolate(row.agence.address)}</span></div>`);
                _push2(ssrRenderComponent(unref(_sfc_main$b), {
                  variant: "ghost",
                  class: "mt-4 h-auto w-full justify-between p-0 font-medium text-primary hover:bg-primary/5"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Voir l\u2019agence `);
                      _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createTextVNode(" Voir l\u2019agence "),
                        createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-44 overflow-hidden md:h-64" }, [
                    createVNode("img", {
                      src: row.agence.logo,
                      alt: row.agence.name,
                      class: "h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                    createVNode("div", { class: "absolute bottom-4 left-4 z-10 text-white" }, [
                      createVNode("p", { class: "line-clamp-2 text-lg font-black drop-shadow" }, toDisplayString(row.agence.name), 1)
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-1 flex-col p-6" }, [
                    createVNode("p", { class: "line-clamp-2 text-sm text-muted-foreground" }, toDisplayString(row.agence.description), 1),
                    createVNode("div", { class: "mt-3 flex items-start gap-2 text-sm text-muted-foreground" }, [
                      createVNode(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
                      createVNode("span", { class: "line-clamp-2" }, toDisplayString(row.agence.address), 1)
                    ]),
                    createVNode(unref(_sfc_main$b), {
                      variant: "ghost",
                      class: "mt-4 h-auto w-full justify-between p-0 font-medium text-primary hover:bg-primary/5"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Voir l\u2019agence "),
                        createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    })
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<p class="mt-2 text-center text-[10px] font-medium tracking-wide text-muted-foreground md:hidden" data-v-94ad9166> \u2190 Glissez pour voir plus \u2192 </p></div><div class="mt-6 text-center md:hidden" data-v-94ad9166>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/agences" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$b), {
              variant: "outline",
              class: "w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tout `);
                  _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createTextVNode(" Voir tout "),
                    createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$b), {
                variant: "outline",
                class: "w-full gap-2 rounded-full border-custom hover:bg-primary hover:text-white transition-colors duration-300"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tout "),
                  createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/AgenciesShowcase.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AgenciesShowcase = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-94ad9166"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SectionShimmer",
  __ssrInlineRender: true,
  props: {
    count: {
      type: Number,
      default: 4
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-16 animate-pulse" }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16"><div class="mb-12 space-y-4"><div class="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div><div class="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div><div class="h-4 w-96 bg-slate-100 dark:bg-slate-900 rounded"></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(__props.count, (i) => {
        _push(`<div class="space-y-4"><div class="aspect-video bg-slate-200 dark:bg-slate-800 rounded-3xl"></div><div class="h-6 w-full bg-slate-200 dark:bg-slate-800 rounded"></div><div class="h-4 w-2/3 bg-slate-100 dark:bg-slate-900 rounded"></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/SectionShimmer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Accueil",
      ogTitle: "CasaNayo \u2014 Immobilier & Services n\xB01 en RDC",
      description: "CasaNayo centralise l\u2019ensemble du parcours immobilier : recherche de biens, vente, location et services \xE0 domicile (\xE9lectricien, plombier...). Elle simplifie votre vie en offrant tout au m\xEAme endroit. G\xE9rez tout depuis votre t\xE9l\xE9phone, partout en RDC.",
      ogDescription: "CasaNayo red\xE9finit l\u2019exp\xE9rience immobili\xE8re en Afrique. Trouvez votre propri\xE9t\xE9 id\xE9ale, vendez ou louez votre bien, et acc\xE9dez \xE0 des services pros en un clic. Partout et \xE0 tout moment.",
      ogImage: "https://casanayo.com/logoCasa.png",
      ogUrl: "https://casanayo.com",
      ogType: "website",
      twitterCard: "summary",
      twitterTitle: "CasaNayo \u2014 Immobilier & Services n\xB01 en RDC",
      twitterDescription: "Louer, Acheter, Vendre & Services \u2014 CasaNayo simplifie votre vie. T\xE9l\xE9chargez l\u2019app maintenant.",
      twitterImage: "https://casanayo.com/logoCasa.png"
    });
    useHead({
      link: [{ rel: "canonical", href: "https://casanayo.com" }],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "CasaNayo",
            url: "https://casanayo.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://casanayo.com/properties?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }
      ]
    });
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const hasHomeListings = computed(
      () => propertyStore.getTerrains.length > 0 || propertyStore.getBureaux.length > 0 || propertyStore.getHotels.length > 0 || propertyStore.getFestives.length > 0 || propertyStore.getFuneraires.length > 0
    );
    const { pending: isLoadingProp } = useAsyncData(
      "home-properties",
      async () => {
        await Promise.all([
          propertyStore.fetchTerrains(config.public.apiBase),
          propertyStore.fetchFuneraires(config.public.apiBase),
          propertyStore.fetchFestives(config.public.apiBase),
          propertyStore.fetchBureaux(config.public.apiBase),
          propertyStore.fetchHotels(config.public.apiBase)
        ]);
        return { loaded: true };
      },
      { lazy: true, server: false }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PromoStrip = _sfc_main$a;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
      _push(`<div class="reveal">`);
      _push(ssrRenderComponent(CombinedCategories, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_PromoStrip, null, null, _parent));
      _push(`<div class="reveal">`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`</div><div class="reveal">`);
      _push(ssrRenderComponent(AllServices, null, null, _parent));
      _push(`</div>`);
      if (unref(isLoadingProp) && !unref(hasHomeListings)) {
        _push(`<div><!--[-->`);
        ssrRenderList(2, (i) => {
          _push(ssrRenderComponent(_sfc_main$1, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(propertyStore).getTerrains && unref(propertyStore).getTerrains.length) {
        _push(`<div class="reveal">`);
        _push(ssrRenderComponent(PropertySection, {
          title: "Terrains",
          subtitle: "Construisez votre r\xEAve",
          items: unref(propertyStore).getTerrains,
          typeId: "Terrain"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(propertyStore).getBureaux && unref(propertyStore).getBureaux.length) {
        _push(`<div class="reveal">`);
        _push(ssrRenderComponent(PropertySection, {
          title: "Bureaux",
          subtitle: "Espace de travail",
          items: unref(propertyStore).getBureaux,
          typeId: "Bureau"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(propertyStore).getHotels && unref(propertyStore).getHotels.length) {
        _push(`<div class="reveal">`);
        _push(ssrRenderComponent(PropertySection, {
          title: "H\xF4tels",
          subtitle: "S\xE9jour Inoubliable",
          items: unref(propertyStore).getHotels,
          typeId: "Hotel"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(propertyStore).getFestives && unref(propertyStore).getFestives.length) {
        _push(`<div class="reveal">`);
        _push(ssrRenderComponent(PropertySection, {
          title: "Salles de F\xEAte",
          subtitle: "C\xE9l\xE9brez en grand",
          items: unref(propertyStore).getFestives,
          typeId: "Salle de f\xEAte"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="reveal">`);
      _push(ssrRenderComponent(AgenciesShowcase, null, null, _parent));
      _push(`</div>`);
      if (unref(propertyStore).getFuneraires && unref(propertyStore).getFuneraires.length) {
        _push(`<div class="reveal">`);
        _push(ssrRenderComponent(PropertySection, {
          title: "Espaces Fun\xE9raires",
          subtitle: "Services",
          items: unref(propertyStore).getFuneraires,
          typeId: "Espace fun\xE9raire"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="reveal">`);
      _push(ssrRenderComponent(HowItWorks, null, null, _parent));
      _push(`</div><div class="reveal">`);
      _push(ssrRenderComponent(AppDownload, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BeeelZED.mjs.map
