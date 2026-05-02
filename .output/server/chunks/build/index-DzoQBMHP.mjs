import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Search, Wrench, ChevronDown, Calendar, SlidersHorizontal, BadgeCheck, Ban, Power } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { f as formatCurrency, g as getCurrencyLabel } from './currency-BoakoUK-.mjs';
import { h as useSeoMeta, u as useHead, m as useRoute, g as useServiceStore, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, _ as _export_sfc } from './server.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { u as useFetch } from './fetch-DhOZ-2Hb.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
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
import '@tanstack/vue-query';
import '@vue/shared';
import './asyncData-cMiNwecB.mjs';
import 'perfect-debounce';

const _imports_0 = "" + buildAssetsURL("people.BNXsKrqk.jpg");
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-card rounded-3xl overflow-hidden border border-border/50 flex flex-col h-full animate-pulse shadow-sm" }, _attrs))} data-v-9174feeb><div class="relative h-56 bg-slate-200 dark:bg-slate-800 overflow-hidden" data-v-9174feeb><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" data-v-9174feeb></div><div class="absolute top-4 left-4 w-16 h-6 bg-white/40 dark:bg-slate-700/40 rounded-full" data-v-9174feeb></div><div class="absolute bottom-4 left-4 space-y-1" data-v-9174feeb><div class="w-16 h-3 bg-white/30 rounded" data-v-9174feeb></div><div class="w-24 h-6 bg-white/50 rounded-lg" data-v-9174feeb></div></div></div><div class="p-6 flex-1 flex flex-col space-y-4" data-v-9174feeb><div class="w-full h-5 bg-slate-200 dark:bg-slate-800 rounded" data-v-9174feeb></div><div class="w-2/3 h-5 bg-slate-200 dark:bg-slate-800 rounded" data-v-9174feeb></div><div class="flex gap-2" data-v-9174feeb><div class="w-20 h-5 bg-slate-100 dark:bg-slate-900 rounded" data-v-9174feeb></div><div class="w-20 h-5 bg-slate-100 dark:bg-slate-900 rounded" data-v-9174feeb></div></div><div class="space-y-2" data-v-9174feeb><div class="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded" data-v-9174feeb></div><div class="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded" data-v-9174feeb></div></div><div class="pt-4 border-t border-border flex items-center gap-3" data-v-9174feeb><div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" data-v-9174feeb></div><div class="w-24 h-3 bg-slate-100 dark:bg-slate-900 rounded" data-v-9174feeb></div></div></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/ServiceCardShimmer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ServiceCardShimmer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9174feeb"]]);
const itemsPerPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    useSeoMeta({
      title: "Services \xE0 Domicile en RDC \u2014 \xC9lectricien, Plombier & Plus",
      ogTitle: "CasaNayo Services | Professionnels \xE0 Domicile en RDC",
      description: "CasaNayo connecte les professionnels de services \xE0 domicile (plombier, \xE9lectricien, menuisier...) avec les particuliers en RDC. Des experts qualifi\xE9s et certifi\xE9s \xE0 Kinshasa et partout au Congo.",
      ogDescription: "Acc\xE9dez \xE0 des centaines de prestataires certifi\xE9s sur CasaNayo. Plomberie, \xE9lectricit\xE9, menuiserie, peinture... Trouvez votre expert, comparez les prix et r\xE9servez en ligne.",
      ogImage: "https://casanayo.com/logoCasa.png",
      ogUrl: "https://casanayo.com/services",
      twitterCard: "summary"
    });
    useHead({
      link: [{ rel: "canonical", href: "https://casanayo.com/services" }],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Services \xE0 domicile \u2014 CasaNayo",
            description: "Annuaire de prestataires de services professionnels \xE0 domicile en R\xE9publique D\xE9mocratique du Congo : plomberie, \xE9lectricit\xE9, menuiserie, peinture et plus.",
            provider: {
              "@type": "Organization",
              name: "CasaNayo",
              url: "https://casanayo.com"
            },
            areaServed: {
              "@type": "Country",
              name: "R\xE9publique D\xE9mocratique du Congo"
            },
            url: "https://casanayo.com/services"
          })
        }
      ]
    });
    const config = useRuntimeConfig();
    const route = useRoute();
    const searchQuery = ref(((_a = route.query.q) == null ? void 0 : _a.toString()) || "");
    const selectedDay = ref("all");
    const serviceStore = useServiceStore();
    const authStore = useAuthStore();
    const isAdmin = computed(() => authStore.isAdmin);
    const showAdvancedFilters = ref(false);
    const minPrice = ref(null);
    const maxPrice = ref(null);
    const selectedCurrency = ref("all");
    const startDate = ref("");
    const endDate = ref("");
    const selectedExperience = ref("all");
    const selectedStatus = ref("all");
    const toggleAdvanced = () => showAdvancedFilters.value = !showAdvancedFilters.value;
    const getCurrencyCode = (deviseId) => {
      return deviseId === 1 ? "CDF" : "USD";
    };
    const selectedCategory = ref(route.query.categoryId ? Number(route.query.categoryId) : null);
    [__temp, __restore] = withAsyncContext(() => serviceStore.fetchCategories(config.public.apiBase)), await __temp, __restore();
    const { data: servicesData, pending: isLoading, error } = useFetch(
      joinApi(config.public.apiBase, ApiEndpoints.publicPrestations),
      {
        key: "services-list",
        lazy: true
      },
      "$tkyIxiWMTd"
      /* nuxt-injected */
    );
    const isStoreEmpty = computed(() => serviceStore.services.length === 0);
    watch(servicesData, (newData) => {
      if (newData == null ? void 0 : newData.prestations) {
        serviceStore.appendServices(newData.prestations);
      }
    }, { immediate: true });
    const services = computed(() => {
      if (selectedCategory.value) {
        return serviceStore.getServicesByCategoryId(selectedCategory.value);
      }
      return serviceStore.services;
    });
    watch(() => route.query.categoryId, async (newId) => {
      if (newId) {
        selectedCategory.value = Number(newId);
        await serviceStore.fetchServicesByCategory(Number(newId), config.public.apiBase);
      } else {
        selectedCategory.value = null;
      }
    }, { immediate: true });
    const filteredServices = computed(() => {
      let list = services.value;
      return list.filter((item) => {
        const s = item.prestation;
        const matchesSearch = s.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.value.toLowerCase()) || s.communeValue && s.communeValue.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = !selectedCategory.value || s.serviceId === selectedCategory.value;
        const matchesDay = selectedDay.value === "all" || s.plageJourPrestation.includes(selectedDay.value);
        let matchesFilters = true;
        if (showAdvancedFilters.value) {
          if (minPrice.value !== null) matchesFilters = matchesFilters && s.minPrice >= minPrice.value;
          if (maxPrice.value !== null) matchesFilters = matchesFilters && s.minPrice <= maxPrice.value;
          if (selectedCurrency.value !== "all") {
            const currencyCode = getCurrencyCode(s.deviseId);
            matchesFilters = matchesFilters && currencyCode === selectedCurrency.value;
          }
          if (startDate.value) {
            matchesFilters = matchesFilters && new Date(s.dateCreated) >= new Date(startDate.value);
          }
          if (endDate.value) {
            const end = new Date(endDate.value);
            end.setHours(23, 59, 59);
            matchesFilters = matchesFilters && new Date(s.dateCreated) <= end;
          }
          if (selectedExperience.value !== "all") {
            const exp = parseInt(s.experience || "0");
            const target = parseInt(selectedExperience.value);
            matchesFilters = matchesFilters && exp >= target;
          }
          if (selectedStatus.value !== "all") {
            if (selectedStatus.value === "active") matchesFilters = matchesFilters && s.active;
            if (selectedStatus.value === "inactive") matchesFilters = matchesFilters && !s.active;
            if (selectedStatus.value === "certified") matchesFilters = matchesFilters && s.certified;
          }
        }
        return matchesSearch && matchesDay && matchesCategory && matchesFilters;
      });
    });
    const currentPage = ref(1);
    computed(() => Math.ceil(filteredServices.value.length / itemsPerPage));
    const paginatedServices = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredServices.value.slice(start, end);
    });
    const scrollToTop = () => {
    };
    watch(currentPage, () => scrollToTop());
    watch([searchQuery, selectedDay, selectedCategory, minPrice, maxPrice, selectedCurrency, startDate, endDate, selectedExperience, selectedStatus], () => {
      currentPage.value = 1;
    });
    const toggleStatus = async (service) => {
      const newStatus = !service.active;
      await serviceStore.updateService(service.id, { active: newStatus }, config.public.apiBase);
    };
    const toggleCertification = async (service) => {
      const newStatus = !service.certified;
      await serviceStore.updateService(service.id, { certified: newStatus }, config.public.apiBase);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden bg-slate-800"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Services" loading="eager" fetchpriority="high" decoding="async"><div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div></div><div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 md:py-14 text-center"><div class="max-w-2xl mx-auto mb-6"><h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"> Des professionnels <span class="text-primary"> \xE0 votre service</span></h1><p class="mt-3 text-slate-300/80 text-sm md:text-base"> \xC9lectriciens, plombiers, architectes, d\xE9m\xE9nageurs \u2014 trouvez l&#39;expert qu&#39;il vous faut. </p></div><div class="max-w-2xl mx-auto"><div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-5 w-5 text-slate-400 ml-4 shrink-0" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Plombier, Goma, \xC9lectricien..." class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-slate-800 px-3 text-sm font-medium placeholder:text-slate-400">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), { class: "h-10 rounded-xl m-1 px-5 font-bold text-sm shrink-0" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Rechercher`);
          } else {
            return [
              createTextVNode("Rechercher")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section><div class="container mx-auto px-4 relative z-20 mt-8 mb-12"><div class="max-w-5xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-6"><div class="grid grid-cols-1 md:grid-cols-12 gap-4"><div class="md:col-span-4 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Wrench), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), null) : ssrLooseEqual(unref(selectedCategory), null)) ? " selected" : ""}>Tous les services</option><!--[-->`);
      ssrRenderList(unref(serviceStore).categories, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCategory)) ? ssrLooseContain(unref(selectedCategory), cat.id) : ssrLooseEqual(unref(selectedCategory), cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-4 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "all") : ssrLooseEqual(unref(selectedDay), "all")) ? " selected" : ""}>Tous les jours</option><option value="Lundi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Lundi") : ssrLooseEqual(unref(selectedDay), "Lundi")) ? " selected" : ""}>Lundi</option><option value="Mardi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Mardi") : ssrLooseEqual(unref(selectedDay), "Mardi")) ? " selected" : ""}>Mardi</option><option value="Mercredi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Mercredi") : ssrLooseEqual(unref(selectedDay), "Mercredi")) ? " selected" : ""}>Mercredi</option><option value="Jeudi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Jeudi") : ssrLooseEqual(unref(selectedDay), "Jeudi")) ? " selected" : ""}>Jeudi</option><option value="Vendredi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Vendredi") : ssrLooseEqual(unref(selectedDay), "Vendredi")) ? " selected" : ""}>Vendredi</option><option value="Samedi"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Samedi") : ssrLooseEqual(unref(selectedDay), "Samedi")) ? " selected" : ""}>Samedi</option><option value="Dimanche"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedDay)) ? ssrLooseContain(unref(selectedDay), "Dimanche") : ssrLooseEqual(unref(selectedDay), "Dimanche")) ? " selected" : ""}>Dimanche</option></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        onClick: toggleAdvanced,
        variant: unref(showAdvancedFilters) ? "default" : "outline",
        class: "w-full h-12 rounded-xl flex items-center justify-between"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SlidersHorizontal), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Filtres Avanc\xE9s </span>`);
            _push2(ssrRenderComponent(unref(ChevronDown), {
              class: ["h-4 w-4 transition-transform", { "rotate-180": unref(showAdvancedFilters) }]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "flex items-center gap-2" }, [
                createVNode(unref(SlidersHorizontal), { class: "h-4 w-4" }),
                createTextVNode(" Filtres Avanc\xE9s ")
              ]),
              createVNode(unref(ChevronDown), {
                class: ["h-4 w-4 transition-transform", { "rotate-180": unref(showAdvancedFilters) }]
              }, null, 8, ["class"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(showAdvancedFilters)) {
        _push(`<div class="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2"><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Prix Min</label><input${ssrRenderAttr("value", unref(minPrice))} type="number" placeholder="0" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Prix Max</label><input${ssrRenderAttr("value", unref(maxPrice))} type="number" placeholder="Max" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Date D\xE9but</label><div class="relative"><input${ssrRenderAttr("value", unref(startDate))} type="date" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Date Fin</label><div class="relative"><input${ssrRenderAttr("value", unref(endDate))} type="date" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Exp\xE9rience</label><select class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedExperience)) ? ssrLooseContain(unref(selectedExperience), "all") : ssrLooseEqual(unref(selectedExperience), "all")) ? " selected" : ""}>Peu importe</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedExperience)) ? ssrLooseContain(unref(selectedExperience), "1") : ssrLooseEqual(unref(selectedExperience), "1")) ? " selected" : ""}>1+ an</option><option value="3"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedExperience)) ? ssrLooseContain(unref(selectedExperience), "3") : ssrLooseEqual(unref(selectedExperience), "3")) ? " selected" : ""}>3+ ans</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedExperience)) ? ssrLooseContain(unref(selectedExperience), "5") : ssrLooseEqual(unref(selectedExperience), "5")) ? " selected" : ""}>5+ ans</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedExperience)) ? ssrLooseContain(unref(selectedExperience), "10") : ssrLooseEqual(unref(selectedExperience), "10")) ? " selected" : ""}>10+ ans</option></select></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Statut</label><select class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "all") : ssrLooseEqual(unref(selectedStatus), "all")) ? " selected" : ""}>Tous</option><option value="certified"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "certified") : ssrLooseEqual(unref(selectedStatus), "certified")) ? " selected" : ""}>Certifi\xE9</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "active") : ssrLooseEqual(unref(selectedStatus), "active")) ? " selected" : ""}>Actif</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedStatus)) ? ssrLooseContain(unref(selectedStatus), "inactive") : ssrLooseEqual(unref(selectedStatus), "inactive")) ? " selected" : ""}>Inactif</option></select></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Devise</label><select class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "all") : ssrLooseEqual(unref(selectedCurrency), "all")) ? " selected" : ""}>Toutes</option><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "USD") : ssrLooseEqual(unref(selectedCurrency), "USD")) ? " selected" : ""}>USD ($)</option><option value="CDF"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "CDF") : ssrLooseEqual(unref(selectedCurrency), "CDF")) ? " selected" : ""}>CDF (FC)</option></select></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><section class="py-16 bg-muted/30"><div class="container mx-auto px-4">`);
      if (unref(isLoading) && unref(isStoreEmpty)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(ssrRenderComponent(ServiceCardShimmer, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(filteredServices).length === 0) {
        _push(`<div class="text-center py-20"><div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">`);
        _push(ssrRenderComponent(unref(Search), { class: "h-8 w-8 text-muted-foreground" }, null, _parent));
        _push(`</div><h3 class="text-xl font-bold mb-2">Aucun service trouv\xE9</h3><p class="text-muted-foreground">Essayez d&#39;autres termes de recherche.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(paginatedServices), (item) => {
          _push(`<div class="group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full relative"><div class="absolute top-4 right-4 z-20 flex flex-col gap-2">`);
          if (item.prestation.certified) {
            _push(`<div class="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">`);
            _push(ssrRenderComponent(unref(BadgeCheck), { class: "h-3 w-3" }, null, _parent));
            _push(` Certifi\xE9 </div>`);
          } else {
            _push(`<!---->`);
          }
          if (!item.prestation.active) {
            _push(`<div class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">`);
            _push(ssrRenderComponent(unref(Ban), { class: "h-3 w-3" }, null, _parent));
            _push(` Inactif </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/services/${unref(encodeId)(item.prestation.id)}`,
            class: "block h-full flex flex-col"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b;
              if (_push2) {
                _push2(`<div class="relative h-56 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", ((_a2 = item.image[0]) == null ? void 0 : _a2.path) || "/placeholder-service.jpg")}${ssrRenderAttr("alt", item.prestation.title)} class="${ssrRenderClass([{ "grayscale": !item.prestation.active }, "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"])}"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"${_scopeId}></div><div class="absolute top-4 left-4"${_scopeId}><div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full"${_scopeId}>${ssrInterpolate(item.prestation.cityValue)}</div></div><div class="absolute bottom-4 left-4"${_scopeId}><div class="text-white"${_scopeId}><span class="text-xs opacity-90"${_scopeId}>\xC0 partir de</span><div class="text-xl font-black"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)))}</div><div class="text-xs text-white/70 mt-1"${_scopeId}>${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId)))}</div></div></div></div><div class="p-6 flex-1 flex flex-col space-y-4"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><h3 class="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2"${_scopeId}>${ssrInterpolate(item.prestation.title)}</h3></div><div class="flex items-center gap-2 text-xs text-muted-foreground"${_scopeId}>`);
                if (item.prestation.experience) {
                  _push2(`<span class="bg-muted px-2 py-1 rounded-md"${_scopeId}>${ssrInterpolate(item.prestation.experience)} ans d&#39;exp. </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span class="bg-muted px-2 py-1 rounded-md"${_scopeId}>${ssrInterpolate(new Date(item.prestation.dateCreated).toLocaleDateString())}</span></div><p class="text-muted-foreground text-sm line-clamp-2 flex-1"${_scopeId}>${ssrInterpolate(item.prestation.description)}</p><div class="pt-4 border-t border-border flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="w-8 h-8 rounded-full overflow-hidden border border-border"${_scopeId}><img${ssrRenderAttr("src", item.prestation.profile || "/avatar-placeholder.png")} class="w-full h-full object-cover"${_scopeId}></div><span class="text-xs font-medium text-muted-foreground line-clamp-1"${_scopeId}>${ssrInterpolate(item.postBy.replace("@@", "@"))}</span></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-56 overflow-hidden" }, [
                    createVNode("img", {
                      src: ((_b = item.image[0]) == null ? void 0 : _b.path) || "/placeholder-service.jpg",
                      alt: item.prestation.title,
                      class: ["w-full h-full object-cover transition-transform duration-500 group-hover:scale-110", { "grayscale": !item.prestation.active }]
                    }, null, 10, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                    createVNode("div", { class: "absolute top-4 left-4" }, [
                      createVNode("div", { class: "bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full" }, toDisplayString(item.prestation.cityValue), 1)
                    ]),
                    createVNode("div", { class: "absolute bottom-4 left-4" }, [
                      createVNode("div", { class: "text-white" }, [
                        createVNode("span", { class: "text-xs opacity-90" }, "\xC0 partir de"),
                        createVNode("div", { class: "text-xl font-black" }, toDisplayString(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId))), 1),
                        createVNode("div", { class: "text-xs text-white/70 mt-1" }, toDisplayString(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId))), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "p-6 flex-1 flex flex-col space-y-4" }, [
                    createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                      createVNode("h3", { class: "font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2" }, toDisplayString(item.prestation.title), 1)
                    ]),
                    createVNode("div", { class: "flex items-center gap-2 text-xs text-muted-foreground" }, [
                      item.prestation.experience ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "bg-muted px-2 py-1 rounded-md"
                      }, toDisplayString(item.prestation.experience) + " ans d'exp. ", 1)) : createCommentVNode("", true),
                      createVNode("span", { class: "bg-muted px-2 py-1 rounded-md" }, toDisplayString(new Date(item.prestation.dateCreated).toLocaleDateString()), 1)
                    ]),
                    createVNode("p", { class: "text-muted-foreground text-sm line-clamp-2 flex-1" }, toDisplayString(item.prestation.description), 1),
                    createVNode("div", { class: "pt-4 border-t border-border flex items-center justify-between" }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "w-8 h-8 rounded-full overflow-hidden border border-border" }, [
                          createVNode("img", {
                            src: item.prestation.profile || "/avatar-placeholder.png",
                            class: "w-full h-full object-cover"
                          }, null, 8, ["src"])
                        ]),
                        createVNode("span", { class: "text-xs font-medium text-muted-foreground line-clamp-1" }, toDisplayString(item.postBy.replace("@@", "@")), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          if (unref(isAdmin)) {
            _push(`<div class="p-4 bg-muted/50 border-t border-border flex items-center justify-between gap-2">`);
            _push(ssrRenderComponent(unref(_sfc_main$2), {
              size: "sm",
              variant: "outline",
              class: ["flex-1 h-8 text-xs gap-1", item.prestation.certified ? "text-blue-600 border-blue-200 bg-blue-50" : ""],
              onClick: ($event) => toggleCertification(item.prestation)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(BadgeCheck), { class: "h-3 w-3" }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(item.prestation.certified ? "D\xE9certifier" : "Certifier")}`);
                } else {
                  return [
                    createVNode(unref(BadgeCheck), { class: "h-3 w-3" }),
                    createTextVNode(" " + toDisplayString(item.prestation.certified ? "D\xE9certifier" : "Certifier"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(ssrRenderComponent(unref(_sfc_main$2), {
              size: "sm",
              variant: "outline",
              class: ["flex-1 h-8 text-xs gap-1", !item.prestation.active ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"],
              onClick: ($event) => toggleStatus(item.prestation)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Power), { class: "h-3 w-3" }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(item.prestation.active ? "D\xE9sactiver" : "Activer")}`);
                } else {
                  return [
                    createVNode(unref(Power), { class: "h-3 w-3" }),
                    createTextVNode(" " + toDisplayString(item.prestation.active ? "D\xE9sactiver" : "Activer"), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DzoQBMHP.mjs.map
