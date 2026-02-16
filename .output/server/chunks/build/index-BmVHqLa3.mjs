import { defineComponent, withAsyncContext, unref, ref, mergeProps, withCtx, createVNode, createTextVNode, computed, createBlock, createCommentVNode, toDisplayString, openBlock, watch, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _sfc_main$a } from './Button-B_RLy27J.mjs';
import { ChevronDown, Search, Smartphone, Apple, Play, MapPin, BedDouble, Bath, Maximize, ArrowRight, UserPlus, CalendarCheck, Home, ChevronLeft, ChevronRight, User, Tent, Warehouse, Ghost, Palmtree, Hotel, Briefcase, Building2 } from 'lucide-vue-next';
import { b as usePropertyStore, c as useRuntimeConfig, a as useRouter, d as useServiceStore } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { _ as _sfc_main$9 } from './CasaLoader-BMTTq4Tc.mjs';
import { u as useAsyncData } from './asyncData-B0whOYVl.mjs';
import { g as getCurrencyLabel, f as formatCurrency } from './currency-BoakoUK-.mjs';
import { useQuery } from '@tanstack/vue-query';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../nitro/nitro.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import 'vue-sonner';
import 'perfect-debounce';

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Hero",
  __ssrInlineRender: true,
  setup(__props) {
    const activeTab = ref("properties");
    const location = ref("");
    const propertyType = ref("");
    const priceRange = ref("");
    const serviceCategory = ref("");
    const serviceSearch = ref("");
    const router = useRouter();
    const handleSearch = () => {
      if (activeTab.value === "properties") {
        const query = {};
        if (location.value) query.city = location.value;
        if (propertyType.value) query.type = propertyType.value;
        if (priceRange.value) query.price = priceRange.value;
        router.push({ path: "/properties", query });
      } else {
        const query = {};
        if (serviceCategory.value) query.category = serviceCategory.value;
        if (serviceSearch.value) query.q = serviceSearch.value;
        router.push({ path: "/services", query });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen flex flex-col pt-12 sm:pt-16 lg:pt-20 pb-12 overflow-hidden bg-slate-900" }, _attrs))}><div class="absolute inset-0 z-0 select-none"><div class="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/90 z-10"></div><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&amp;w=2675&amp;auto=format&amp;fit=crop" alt="Luxury Property" class="w-full h-full object-cover opacity-80 scale-105 animate-slow-zoom"></div><div class="absolute inset-0 z-0 overflow-hidden pointer-events-none"><div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob mix-blend-screen"></div><div class="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000 mix-blend-screen"></div><div class="absolute -bottom-32 left-1/3 w-full h-64 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div><div class="absolute top-0 left-0 w-full h-full opacity-10"><div class="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div><div class="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-full"></div><div class="absolute bottom-40 left-20 w-48 h-48 border border-white/10 rounded-full"></div></div><div class="absolute top-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse"></div><div class="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-300"></div><div class="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-pulse animation-delay-600"></div></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10 h-full flex flex-col justify-center pt-8 sm:pt-0"><div class="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center"><div class="lg:col-span-7 flex flex-col justify-center relative z-20"><div class="absolute -top-32 -left-20 opacity-0 animate-fade-in-down pointer-events-none"><h1 class="text-[8rem] sm:text-[10rem] lg:text-[14rem] font-black text-white/5 leading-none tracking-tighter select-none mix-blend-overlay"> CasaNayo </h1></div><div class="space-y-6 opacity-0 animate-fade-in-up animation-delay-300 relative"><h2 class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl tracking-tight text-left"><span class="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-sky-200"> Louer, Acheter, </span><span class="block"> Vendre &amp; Services </span></h2><p class="text-white/90 text-lg sm:text-xl leading-relaxed font-medium drop-shadow-lg max-w-2xl text-left border-l-4 border-primary/50 pl-6"> CasaNayo centralise l\u2019ensemble du parcours immobilier : recherche de biens, vente, location et services \xE0 domicile (\xE9lectricien, plombier...). <span class="block mt-2 text-white/70 text-base">Elle simplifie votre vie en offrant tout au m\xEAme endroit.</span></p><div class="flex items-center gap-6 pt-4 text-white/60"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div><span class="text-sm font-medium tracking-wider uppercase">+500 Propri\xE9t\xE9s</span></div><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse animation-delay-300"></div><span class="text-sm font-medium tracking-wider uppercase">Services Pro</span></div></div></div></div><div class="lg:col-span-5 relative z-30 mt-8 lg:mt-0 opacity-0 animate-fade-in-up animation-delay-600"><div class="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transform transition-all hover:scale-[1.01] hover:shadow-primary/10"><div class="flex p-1 bg-black/20 rounded-2xl mb-6"><button class="${ssrRenderClass([activeTab.value === "properties" ? "bg-white text-slate-900 shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5", "relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"])}"> Propri\xE9t\xE9s </button><button class="${ssrRenderClass([activeTab.value === "services" ? "bg-white text-slate-900 shadow-lg" : "text-white/70 hover:text-white hover:bg-white/5", "relative flex-1 py-3 text-sm sm:text-base font-bold transition-all duration-300 rounded-xl"])}"> Services </button></div>`);
      if (activeTab.value === "properties") {
        _push(`<div class="space-y-4"><div class="grid grid-cols-2 gap-4"><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Ville</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(location.value) ? ssrLooseContain(location.value, "") : ssrLooseEqual(location.value, "")) ? " selected" : ""}>Toutes villes</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(location.value) ? ssrLooseContain(location.value, null) : ssrLooseEqual(location.value, null)) ? " selected" : ""}>Kinshasa</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(location.value) ? ssrLooseContain(location.value, null) : ssrLooseEqual(location.value, null)) ? " selected" : ""}>Lubumbashi</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(location.value) ? ssrLooseContain(location.value, null) : ssrLooseEqual(location.value, null)) ? " selected" : ""}>Goma</option></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Type</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, "") : ssrLooseEqual(propertyType.value, "")) ? " selected" : ""}>Tout type</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, null) : ssrLooseEqual(propertyType.value, null)) ? " selected" : ""}>Maison</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, null) : ssrLooseEqual(propertyType.value, null)) ? " selected" : ""}>Appartement</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(propertyType.value) ? ssrLooseContain(propertyType.value, null) : ssrLooseEqual(propertyType.value, null)) ? " selected" : ""}>Villa</option></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Budget</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(priceRange.value) ? ssrLooseContain(priceRange.value, "") : ssrLooseEqual(priceRange.value, "")) ? " selected" : ""}>Tout budget</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(priceRange.value) ? ssrLooseContain(priceRange.value, null) : ssrLooseEqual(priceRange.value, null)) ? " selected" : ""}>$500 - $1,000</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(priceRange.value) ? ssrLooseContain(priceRange.value, null) : ssrLooseEqual(priceRange.value, null)) ? " selected" : ""}>$1,000 - $5,000</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(priceRange.value) ? ssrLooseContain(priceRange.value, null) : ssrLooseEqual(priceRange.value, null)) ? " selected" : ""}>$5,000+</option></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$a), {
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
        _push(`<div class="space-y-4"><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Cat\xE9gorie</label><div class="relative group"><select class="w-full h-12 pl-4 pr-10 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"><option value="" class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, "") : ssrLooseEqual(serviceCategory.value, "")) ? " selected" : ""}>Toutes cat\xE9gories</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, null) : ssrLooseEqual(serviceCategory.value, null)) ? " selected" : ""}>Plomberie</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, null) : ssrLooseEqual(serviceCategory.value, null)) ? " selected" : ""}>\xC9lectricit\xE9</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, null) : ssrLooseEqual(serviceCategory.value, null)) ? " selected" : ""}>M\xE9nage</option><option class="text-slate-900"${ssrIncludeBooleanAttr(Array.isArray(serviceCategory.value) ? ssrLooseContain(serviceCategory.value, null) : ssrLooseEqual(serviceCategory.value, null)) ? " selected" : ""}>Autre</option></select>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "absolute right-3 top-4 h-4 w-4 text-white/50 pointer-events-none" }, null, _parent));
        _push(`</div></div><div class="space-y-1.5"><label class="text-xs font-bold text-white/80 ml-1">Recherche</label><div class="relative group"><input${ssrRenderAttr("value", serviceSearch.value)} type="text" placeholder="Ex: Plombier..." class="w-full h-12 pl-4 rounded-xl bg-white/10 border border-white/10 text-white focus:bg-white/20 focus:border-primary outline-none transition-all placeholder:text-white/30"></div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$a), {
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
      _push(`</div></div></div></div><div class="relative lg:absolute lg:bottom-8 left-0 w-full z-20 opacity-0 animate-fade-in-up animation-delay-1000 px-4 sm:px-6 mt-12 lg:mt-0"><div class="container mx-auto"><div class="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 max-w-7xl mx-auto hover:bg-slate-900/60 transition-all duration-300 shadow-2xl"><div class="flex items-center gap-4 text-center sm:text-left"><div class="p-3 bg-primary/20 rounded-2xl shrink-0 hidden sm:flex">`);
      _push(ssrRenderComponent(unref(Smartphone), { class: "w-6 h-6 text-white" }, null, _parent));
      _push(`</div><div class="flex flex-col"><p class="text-white font-black text-sm sm:text-lg leading-tight uppercase tracking-widest sm:normal-case sm:tracking-normal">Disponible sur mobile</p><p class="text-white/60 text-[10px] sm:text-sm mt-1 hidden xs:block">T\xE9l\xE9chargez l&#39;application CasaNayo pour une exp\xE9rience sans limite</p></div></div><div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center"><button class="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white text-slate-900 rounded-2xl hover:bg-sky-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl group border-none outline-none">`);
      _push(ssrRenderComponent(unref(Apple), { class: "w-5 h-5 sm:w-6 sm:h-6 fill-current" }, null, _parent));
      _push(`<div class="text-left"><div class="text-[0.5rem] sm:text-[0.6rem] uppercase font-black tracking-widest opacity-40 leading-none">App Store</div><div class="text-[10px] sm:text-sm font-black leading-tight">iOS</div></div></button><button class="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all transform hover:scale-105 active:scale-95 backdrop-blur-md shadow-xl group outline-none">`);
      _push(ssrRenderComponent(unref(Play), { class: "w-5 h-5 sm:w-6 sm:h-6 fill-current text-primary" }, null, _parent));
      _push(`<div class="text-left"><div class="text-[0.5rem] sm:text-[0.6rem] uppercase font-black tracking-widest opacity-40 leading-none">Play Store</div><div class="text-[10px] sm:text-sm font-black leading-tight">Android</div></div></button></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Hero.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden" }, _attrs))} data-v-5441085f><div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" data-v-5441085f></div><div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" data-v-5441085f></div><div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" data-v-5441085f></div><div class="container mx-auto px-6 lg:px-12 relative z-10" data-v-5441085f><div class="text-left max-w-3xl mb-20 animate-fade-in-up" data-v-5441085f><span class="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider mb-6 inline-block" data-v-5441085f> Simple &amp; Efficace </span><h3 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight" data-v-5441085f> Votre projet immobilier,<br data-v-5441085f><span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500" data-v-5441085f>en toute simplicit\xE9</span></h3><p class="text-slate-600 text-lg leading-relaxed" data-v-5441085f> Que vous cherchiez \xE0 acheter, louer ou obtenir un service, CasaNayo vous accompagne \xE0 chaque \xE9tape avec fluidit\xE9. </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative" data-v-5441085f><div class="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-200 z-0" data-v-5441085f></div><!--[-->`);
      ssrRenderList(steps, (step, index2) => {
        _push(`<div class="relative z-10 group" data-v-5441085f><div class="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20" data-v-5441085f><div class="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:rotate-6 transition-all duration-500 shadow-sm relative" data-v-5441085f><div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm border-4 border-white shadow-lg z-20" data-v-5441085f>${ssrInterpolate(index2 + 1)}</div>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(step.icon), { class: "w-8 h-8 text-slate-700 group-hover:text-white transition-colors duration-300" }, null), _parent);
        _push(`</div><h4 class="text-xl font-bold text-slate-900 mb-3" data-v-5441085f>${ssrInterpolate(step.title)}</h4><p class="text-slate-500 leading-relaxed text-sm" data-v-5441085f>${ssrInterpolate(step.description)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/HowItWorks.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const HowItWorks = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-5441085f"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "PropertyCategories",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    ref(null);
    const { pending: isLoading } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("property-types", () => propertyStore.fetchTypes(config.public.apiBase), { lazy: true })), __temp = await __temp, __restore(), __temp);
    const getIcon = (name) => {
      switch (name.toLowerCase()) {
        case "studio":
          return Hotel;
        case "apparts":
          return Building2;
        case "maisons":
          return Home;
        case "bureau":
          return Briefcase;
        case "hotels":
          return Hotel;
        case "vacances":
          return Palmtree;
        case "espace fun\xE9raire":
          return Ghost;
        case "salle de f\xEAte":
          return Warehouse;
        case "terrain":
          return Tent;
        default:
          return Home;
      }
    };
    const categories = computed(() => propertyStore.getTypes);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-12 border-b border-border/40" }, _attrs))} data-v-553cb67b><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative group" data-v-553cb67b><div class="relative min-h-[60px]" data-v-553cb67b>`);
      if (unref(isLoading) && unref(categories).length === 0) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-20 bg-white/50 backdrop-blur-sm" data-v-553cb67b>`);
        _push(ssrRenderComponent(_sfc_main$9, { size: "sm" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0" data-v-553cb67b>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5" }, null, _parent));
      _push(`</button><div class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar mask-fade scroll-smooth" data-v-553cb67b><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: cat.propertyTypeId,
          to: `/properties?type=${cat.name}`,
          class: "flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card whitespace-nowrap hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(getIcon(cat.name)), { class: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" }, null), _parent2, _scopeId);
              _push2(`<span class="font-medium text-sm" data-v-553cb67b${_scopeId}>${ssrInterpolate(cat.name)}</span>`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(getIcon(cat.name)), { class: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" })),
                createVNode("span", { class: "font-medium text-sm" }, toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0" data-v-553cb67b>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></div></div></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/PropertyCategories.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const PropertyCategories = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-553cb67b"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ServiceCategories",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const serviceStore = useServiceStore();
    ref(null);
    const { pending: isLoading } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("service-categories", () => serviceStore.fetchCategories(config.public.apiBase), { lazy: true })), __temp = await __temp, __restore(), __temp);
    const categories = computed(() => serviceStore.getCategories);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-12 bg-slate-50 border-y border-border/40" }, _attrs))} data-v-325784a0><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative group" data-v-325784a0><div class="mb-6 flex items-center justify-between" data-v-325784a0><h3 class="text-lg font-bold text-foreground" data-v-325784a0>Cat\xE9gories de Services</h3></div><div class="relative min-h-[100px]" data-v-325784a0>`);
      if (unref(isLoading) && unref(categories).length === 0) {
        _push(`<div class="absolute inset-0 flex items-center justify-center z-20 bg-slate-50/50 backdrop-blur-sm" data-v-325784a0>`);
        _push(ssrRenderComponent(_sfc_main$9, { size: "sm" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0" data-v-325784a0>`);
      _push(ssrRenderComponent(unref(ChevronLeft), { class: "h-5 w-5" }, null, _parent));
      _push(`</button><div class="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar scroll-smooth" data-v-325784a0><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/services?categoryId=" + cat.id,
          key: cat.id,
          class: "flex flex-col items-center justify-center min-w-[100px] h-[100px] p-4 rounded-2xl bg-white border border-border shadow-sm hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors" data-v-325784a0${_scopeId}>`);
              _push2(ssrRenderComponent(unref(User), { class: "h-5 w-5 text-slate-500 group-hover:text-primary" }, null, _parent2, _scopeId));
              _push2(`</div><span class="font-medium text-xs text-center line-clamp-1" data-v-325784a0${_scopeId}>${ssrInterpolate(cat.name)}</span>`);
            } else {
              return [
                createVNode("div", { class: "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors" }, [
                  createVNode(unref(User), { class: "h-5 w-5 text-slate-500 group-hover:text-primary" })
                ]),
                createVNode("span", { class: "font-medium text-xs text-center line-clamp-1" }, toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><button class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-white rounded-full shadow-lg border border-border text-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0" data-v-325784a0>`);
      _push(ssrRenderComponent(unref(ChevronRight), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/ServiceCategories.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ServiceCategories = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-325784a0"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
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
        const response = await $fetch(`${config.public.apiBase}/prestations`);
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
      if (serviceStore.services.length) return serviceStore.services.slice(0, 6);
      if (fetchResult.value && fetchResult.value.length) return fetchResult.value.slice(0, 6);
      return [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 bg-gradient-to-br from-primary/5 via-background to-blue-50/30" }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16"><div class="flex items-end justify-between mb-12"><div class="max-w-3xl space-y-4"><span class="text-primary font-bold tracking-wider uppercase text-sm">Tous nos services</span><h2 class="text-3xl lg:text-4xl font-black text-foreground">Des professionnels \xE0 votre service</h2><p class="text-muted-foreground text-lg"> D\xE9couvrez notre gamme compl\xE8te de services \xE0 domicile. Des experts qualifi\xE9s pour tous vos besoins. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: "hidden md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), {
              variant: "outline",
              class: "font-bold border-2 rounded-full px-6"
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
              createVNode(unref(_sfc_main$a), {
                variant: "outline",
                class: "font-bold border-2 rounded-full px-6"
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
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="h-80 bg-muted animate-pulse rounded-3xl"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"><!--[-->`);
        ssrRenderList(unref(displayedServices), (item, index2) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.prestation.id,
            to: `/services/${item.prestation.id}`,
            class: "group bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<div class="relative h-48 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", ((_a = item.image[0]) == null ? void 0 : _a.path) || "/placeholder-service.jpg")}${ssrRenderAttr("alt", item.prestation.title)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"${_scopeId}></div><div class="absolute top-4 left-4"${_scopeId}><div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full"${_scopeId}>${ssrInterpolate(item.prestation.cityValue)}</div></div><div class="absolute bottom-4 left-4 text-white"${_scopeId}><span class="text-xs opacity-90"${_scopeId}>\xC0 partir de</span><div class="text-xl font-black"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)))}</div><div class="text-xs opacity-80"${_scopeId}>${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId)))}</div></div></div><div class="p-6 flex-1 flex flex-col"${_scopeId}><h3 class="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1"${_scopeId}>${ssrInterpolate(item.prestation.title)}</h3><p class="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1"${_scopeId}>${ssrInterpolate(item.prestation.description)}</p><div class="flex items-center justify-between pt-4 border-t border-border mt-auto"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-8 h-8 rounded-full overflow-hidden border border-border"${_scopeId}><img${ssrRenderAttr("src", item.prestation.profile || "/avatar-placeholder.png")} class="w-full h-full object-cover"${_scopeId}></div><span class="text-xs font-medium text-muted-foreground line-clamp-1"${_scopeId}>${ssrInterpolate(item.postBy.replace("@@", "@"))}</span></div>`);
                _push2(ssrRenderComponent(unref(ArrowRight), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-48 overflow-hidden" }, [
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
      _push(`<div class="mt-8 text-center md:hidden">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/services" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), {
              variant: "outline",
              class: "font-bold border-2 rounded-full px-8 w-full"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Voir tous les services `);
                } else {
                  return [
                    createTextVNode(" Voir tous les services ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$a), {
                variant: "outline",
                class: "font-bold border-2 rounded-full px-8 w-full"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Voir tous les services ")
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/AllServices.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FeaturedProperties",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const { data: propertiesData, isLoading } = useQuery({
      queryKey: ["featured-properties"],
      queryFn: async () => {
        const res = await fetch(`${config.public.apiBase}/property`);
        return res.json();
      }
    });
    const properties = computed(() => {
      var _a;
      if (!((_a = propertiesData.value) == null ? void 0 : _a.properties)) return [];
      return propertiesData.value.properties.slice(0, 6).map((item) => {
        var _a2, _b, _c, _d;
        const p = item.property;
        const addr = item.address;
        const img = ((_c = (_b = (_a2 = item.images) == null ? void 0 : _a2.main) == null ? void 0 : _b[0]) == null ? void 0 : _c.publicPath) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        const currencyCode = ((_d = item.devise) == null ? void 0 : _d.code) || "USD";
        const displayArea = p.surface && p.surface > 0 ? `${p.surface}m\xB2` : p.livingRoom ? `${p.livingRoom} salon(s)` : "";
        return {
          id: p.propertyId,
          title: p.title || "Sans titre",
          location: `${(addr == null ? void 0 : addr.communeValue) || ""}, ${(addr == null ? void 0 : addr.cityValue) || "RDC"}`,
          price: formatCurrency(p.price, currencyCode),
          priceAmount: p.price,
          currency: getCurrencyLabel(currencyCode),
          currencyCode,
          frequency: p.transactionType === "location" ? "/mois" : "",
          beds: p.bedrooms || 0,
          baths: p.bathroom || 0,
          area: displayArea,
          image: img,
          publisherImage: item.image || "",
          tag: p.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre"
        };
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "properties",
        class: "py-24 bg-muted/30"
      }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16"><div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"><div class="space-y-4 max-w-2xl"><span class="text-primary font-bold tracking-wider uppercase text-sm">Nos Propri\xE9t\xE9s</span><h2 class="text-3xl lg:text-4xl font-black text-foreground">D\xE9couvrez nos derni\xE8res p\xE9pites</h2><p class="text-muted-foreground text-lg"> Une s\xE9lection exclusive de biens immobiliers pour tous les budgets. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/properties" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), {
              variant: "outline",
              class: "font-bold border-custom md:self-end rounded-full px-8 hover:bg-white hover:text-slate-900 transition-colors"
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
              createVNode(unref(_sfc_main$a), {
                variant: "outline",
                class: "font-bold border-custom md:self-end rounded-full px-8 hover:bg-white hover:text-slate-900 transition-colors"
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
        _push(`<div class="flex items-center justify-center min-h-[400px]">`);
        _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(unref(properties), (property) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: property.id,
            to: `/properties/${property.id}`,
            class: "group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-64 overflow-hidden"${_scopeId}><div class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"${_scopeId}>${ssrInterpolate(property.tag)}</div><img${ssrRenderAttr("src", property.image)}${ssrRenderAttr("alt", property.title)} class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"${_scopeId}><div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"${_scopeId}></div>`);
                if (property.publisherImage) {
                  _push2(`<div class="absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"${_scopeId}><img${ssrRenderAttr("src", property.publisherImage)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="p-6 flex-1 flex flex-col"${_scopeId}><div class="flex items-start justify-between mb-4"${_scopeId}><div${_scopeId}><h3 class="font-bold text-lg text-foreground line-clamp-1"${_scopeId}>${ssrInterpolate(property.title)}</h3><div class="flex items-center gap-2 text-muted-foreground text-sm mt-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(property.location)}</span></div></div><div class="text-right"${_scopeId}><div class="text-primary font-black text-lg"${_scopeId}>${ssrInterpolate(property.price)}</div>`);
                if (property.currency) {
                  _push2(`<div class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(property.currency)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (property.frequency) {
                  _push2(`<div class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(property.frequency)}</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div><div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-border mb-6"${_scopeId}><div class="flex flex-col items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(BedDouble), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.beds)}</span></div><div class="flex flex-col items-center gap-1 border-l border-border"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Bath), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.baths)}</span></div><div class="flex flex-col items-center gap-1 border-l border-border"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-muted-foreground" }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-bold text-foreground"${_scopeId}>${ssrInterpolate(property.area)}</span></div></div>`);
                _push2(ssrRenderComponent(unref(_sfc_main$a), { class: "w-full mt-auto font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border-0" }, {
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
                    createVNode("div", { class: "absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide" }, toDisplayString(property.tag), 1),
                    createVNode("img", {
                      src: property.image,
                      alt: property.title,
                      class: "h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" }),
                    property.publisherImage ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute top-4 right-4 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    }, [
                      createVNode("img", {
                        src: property.publisherImage,
                        alt: property.title,
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src", "alt"])
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "p-6 flex-1 flex flex-col" }, [
                    createVNode("div", { class: "flex items-start justify-between mb-4" }, [
                      createVNode("div", null, [
                        createVNode("h3", { class: "font-bold text-lg text-foreground line-clamp-1" }, toDisplayString(property.title), 1),
                        createVNode("div", { class: "flex items-center gap-2 text-muted-foreground text-sm mt-1" }, [
                          createVNode(unref(MapPin), { class: "h-4 w-4" }),
                          createVNode("span", null, toDisplayString(property.location), 1)
                        ])
                      ]),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("div", { class: "text-primary font-black text-lg" }, toDisplayString(property.price), 1),
                        property.currency ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-xs text-muted-foreground"
                        }, toDisplayString(property.currency), 1)) : createCommentVNode("", true),
                        property.frequency ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-xs text-muted-foreground"
                        }, toDisplayString(property.frequency), 1)) : createCommentVNode("", true)
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
                    createVNode(unref(_sfc_main$a), { class: "w-full mt-auto font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border-0" }, {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/FeaturedProperties.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppDownload",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-24 relative overflow-hidden bg-primary text-white" }, _attrs))}><div class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div><div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-900/20 blur-3xl"></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div class="space-y-8 text-center lg:text-left"><h2 class="text-3xl lg:text-5xl font-black tracking-tight"> Emportez CasaNayo partout avec vous </h2><p class="text-lg text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0"> T\xE9l\xE9chargez notre application mobile pour g\xE9rer vos biens, trouver des services et payer vos factures, o\xF9 que vous soyez. Disponible sur iOS et Android. </p><div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$a), {
        size: "lg",
        class: "h-16 px-8 bg-black hover:bg-gray-900 text-white border-0 w-full sm:w-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Apple), { class: "mr-3 h-6 w-6" }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col items-start leading-none"${_scopeId}><span class="text-xs opacity-80 font-normal"${_scopeId}>T\xE9l\xE9charger sur</span><span class="text-lg font-bold"${_scopeId}>App Store</span></div>`);
          } else {
            return [
              createVNode(unref(Apple), { class: "mr-3 h-6 w-6" }),
              createVNode("div", { class: "flex flex-col items-start leading-none" }, [
                createVNode("span", { class: "text-xs opacity-80 font-normal" }, "T\xE9l\xE9charger sur"),
                createVNode("span", { class: "text-lg font-bold" }, "App Store")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$a), {
        size: "lg",
        class: "h-16 px-8 bg-white text-black hover:bg-gray-100 border-0 w-full sm:w-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Smartphone), { class: "mr-3 h-6 w-6" }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col items-start leading-none"${_scopeId}><span class="text-xs opacity-80 font-normal"${_scopeId}>Disponible sur</span><span class="text-lg font-bold"${_scopeId}>Google Play</span></div>`);
          } else {
            return [
              createVNode(unref(Smartphone), { class: "mr-3 h-6 w-6" }),
              createVNode("div", { class: "flex flex-col items-start leading-none" }, [
                createVNode("span", { class: "text-xs opacity-80 font-normal" }, "Disponible sur"),
                createVNode("span", { class: "text-lg font-bold" }, "Google Play")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative lg:h-[500px] flex items-center justify-center"><div class="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-500"><div class="absolute top-0 w-full h-8 bg-black z-10 rounded-b-xl"></div><img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&amp;w=2670&amp;auto=format&amp;fit=crop" class="w-full h-full object-cover opacity-80" alt="App Screen"><div class="absolute inset-0 flex items-center justify-center"><div class="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-lg"><span class="text-primary font-black text-4xl">C</span></div></div></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/AppDownload.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PropertySection",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    items: {},
    typeId: {}
  },
  setup(__props) {
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
      return {
        id: (p == null ? void 0 : p.id) || (p == null ? void 0 : p.propertyId) || 0,
        title: (p == null ? void 0 : p.title) || "Sans titre",
        location: locationStr,
        price: formatCurrency(priceVal, currencyCode),
        currencyCode,
        currencySymbol: symbol,
        currencyLabel,
        image: img,
        publisherImage: item.image || "",
        postBy: item.postBy || "",
        tag: props.title
      };
    };
    const displayItems = computed(() => {
      return props.items.slice(0, 3).map(normalizeItem);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-16 border-b border-border/40" }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16"><div class="flex items-center justify-between mb-8"><div><span class="text-primary font-bold text-sm tracking-wider uppercase">${ssrInterpolate(__props.subtitle || "D\xE9couvrez")}</span><h2 class="text-3xl font-bold text-foreground mt-1">${ssrInterpolate(__props.title)}</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/properties?type=${__props.typeId}`,
        class: "hidden md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), {
              variant: "outline",
              class: "gap-2 rounded-full"
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
              createVNode(unref(_sfc_main$a), {
                variant: "outline",
                class: "gap-2 rounded-full"
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
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(unref(displayItems), (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.id,
          to: `/properties/${item.id}`,
          class: "group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="relative h-56 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", item.image)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"${_scopeId}></div><div class="absolute bottom-4 left-4 text-white"${_scopeId}><div class="font-bold text-lg"${_scopeId}>${ssrInterpolate(item.price)}</div><div class="text-xs opacity-80"${_scopeId}>${ssrInterpolate(item.currencyLabel)}</div><div class="flex items-center gap-1 text-sm opacity-90 mt-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(item.location)}</div></div>`);
              if (item.publisherImage) {
                _push2(`<div class="absolute top-3 right-3 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"${_scopeId}><img${ssrRenderAttr("src", item.publisherImage)}${ssrRenderAttr("alt", item.postBy)} class="w-full h-full object-cover"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="p-5"${_scopeId}><h3 class="font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(item.title)}</h3>`);
              _push2(ssrRenderComponent(unref(_sfc_main$a), {
                variant: "ghost",
                class: "w-full justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium"
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
                createVNode("div", { class: "relative h-56 overflow-hidden" }, [
                  createVNode("img", {
                    src: item.image,
                    class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  }, null, 8, ["src"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                  createVNode("div", { class: "absolute bottom-4 left-4 text-white" }, [
                    createVNode("div", { class: "font-bold text-lg" }, toDisplayString(item.price), 1),
                    createVNode("div", { class: "text-xs opacity-80" }, toDisplayString(item.currencyLabel), 1),
                    createVNode("div", { class: "flex items-center gap-1 text-sm opacity-90 mt-1" }, [
                      createVNode(unref(MapPin), { class: "h-3 w-3" }),
                      createTextVNode(" " + toDisplayString(item.location), 1)
                    ])
                  ]),
                  item.publisherImage ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute top-3 right-3 rounded-full border-2 border-white overflow-hidden h-12 w-12 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  }, [
                    createVNode("img", {
                      src: item.publisherImage,
                      alt: item.postBy,
                      class: "w-full h-full object-cover"
                    }, null, 8, ["src", "alt"])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "p-5" }, [
                  createVNode("h3", { class: "font-bold text-lg line-clamp-1 mb-2 group-hover:text-primary transition-colors" }, toDisplayString(item.title), 1),
                  createVNode(unref(_sfc_main$a), {
                    variant: "ghost",
                    class: "w-full justify-between hover:bg-primary/5 text-primary p-0 h-auto font-medium"
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
      _push(`<!--]--></div><div class="mt-8 text-center md:hidden">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/properties?type=${__props.typeId}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), {
              variant: "outline",
              class: "w-full gap-2 rounded-full"
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
              createVNode(unref(_sfc_main$a), {
                variant: "outline",
                class: "w-full gap-2 rounded-full"
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/PropertySection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const { pending: isLoadingProp } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-properties", async () => {
      await Promise.all([
        propertyStore.fetchTerrains(config.public.apiBase),
        propertyStore.fetchFuneraires(config.public.apiBase),
        propertyStore.fetchFestives(config.public.apiBase),
        propertyStore.fetchBureaux(config.public.apiBase),
        propertyStore.fetchHotels(config.public.apiBase)
      ]);
    }, { lazy: true })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-80bed83f>`);
      _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
      _push(ssrRenderComponent(HowItWorks, null, null, _parent));
      _push(ssrRenderComponent(PropertyCategories, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(ssrRenderComponent(ServiceCategories, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      if (unref(isLoadingProp)) {
        _push(`<div class="py-24 flex items-center justify-center" data-v-80bed83f>`);
        _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div data-v-80bed83f>`);
        if (unref(propertyStore).getTerrains && unref(propertyStore).getTerrains.length) {
          _push(ssrRenderComponent(_sfc_main$1, {
            title: "Terrains",
            subtitle: "Construisez votre r\xEAve",
            items: unref(propertyStore).getTerrains,
            typeId: "Terrain"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(propertyStore).getBureaux && unref(propertyStore).getBureaux.length) {
          _push(ssrRenderComponent(_sfc_main$1, {
            title: "Bureaux",
            subtitle: "Espace de travail",
            items: unref(propertyStore).getBureaux,
            typeId: "Bureau"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(propertyStore).getHotels && unref(propertyStore).getHotels.length) {
          _push(ssrRenderComponent(_sfc_main$1, {
            title: "H\xF4tels",
            subtitle: "S\xE9jour Inoubliable",
            items: unref(propertyStore).getHotels,
            typeId: "Hotel"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(propertyStore).getFestives && unref(propertyStore).getFestives.length) {
          _push(ssrRenderComponent(_sfc_main$1, {
            title: "Salles de F\xEAte",
            subtitle: "C\xE9l\xE9brez en grand",
            items: unref(propertyStore).getFestives,
            typeId: "Salle de f\xEAte"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(propertyStore).getFuneraires && unref(propertyStore).getFuneraires.length) {
          _push(ssrRenderComponent(_sfc_main$1, {
            title: "Espaces Fun\xE9raires",
            subtitle: "Services",
            items: unref(propertyStore).getFuneraires,
            typeId: "Espace fun\xE9raire"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-80bed83f"]]);

export { index as default };
//# sourceMappingURL=index-BmVHqLa3.mjs.map
