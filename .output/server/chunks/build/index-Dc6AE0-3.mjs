import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, toValue, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Search, Wrench, ChevronDown, Calendar, SlidersHorizontal, BadgeCheck, Ban, Power } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { f as formatCurrency, g as getCurrencyLabel } from './currency-BoakoUK-.mjs';
import { f as useRoute, d as useServiceStore, e as useAuthStore, c as useRuntimeConfig, g as fetchDefaults, h as useRequestFetch } from './server.mjs';
import { B as hash } from '../nitro/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import { u as useAsyncData } from './asyncData-B0whOYVl.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'vue-sonner';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'perfect-debounce';

function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  if (!immediate) {
    let setImmediate = function() {
      _asyncDataOptions.immediate = true;
    };
    watch(key, setImmediate, { flush: "sync", once: true });
    watch([...watchSources || [], _fetchOptions], setImmediate, { flush: "sync", once: true });
  }
  const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  var _a;
  const segments = [
    ((_a = toValue(opts.method)) == null ? void 0 : _a.toUpperCase()) || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const _imports_0 = "" + buildAssetsURL("people.BNXsKrqk.jpg");
const itemsPerPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const route = useRoute();
    const searchQuery = ref("");
    const selectedDay = ref("all");
    const serviceStore = useServiceStore();
    const authStore = useAuthStore();
    const isAdmin = computed(() => {
      var _a;
      return authStore.isAuthenticated && ((_a = authStore.user) == null ? void 0 : _a.role) === "admin";
    });
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
    const { data: servicesData, pending: isLoading, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(`${config.public.apiBase}/prestations`, {
      key: "services-list",
      lazy: true
    }, "$t1YRR85oRY")), __temp = await __temp, __restore(), __temp);
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
    watch(currentPage, () => (void 0).scrollTo({ top: 0, behavior: "smooth" }));
    watch([searchQuery, selectedDay, selectedCategory, minPrice, maxPrice, selectedCurrency, startDate, endDate, selectedExperience, selectedStatus], () => currentPage.value = 1);
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative py-20 bg-slate-900 overflow-hidden"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Services background"><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div></div><div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 z-0"></div><div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 z-0"></div><div class="container mx-auto px-4 relative z-10 text-center"><h1 class="text-4xl md:text-5xl font-black text-white mb-6"> TOUS NOS SERVICES <span class="text-primary block mt-2">Des professionnels \xE0 votre service</span></h1><p class="text-lg text-white/80 max-w-2xl mx-auto mb-10"> D\xE9couvrez notre gamme compl\xE8te de services \xE0 domicile. Des experts qualifi\xE9s pour tous vos besoins. </p><div class="max-w-2xl mx-auto relative group"><div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-200"></div><div class="relative flex items-center bg-white dark:bg-slate-800 rounded-xl p-2 shadow-2xl">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-5 w-5 text-muted-foreground ml-3" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Que recherchez-vous ? (ex: Plombier, Goma...)" class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-foreground px-4 font-outfit">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        size: "lg",
        class: "hidden sm:flex rounded-lg px-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Rechercher `);
          } else {
            return [
              createTextVNode(" Rechercher ")
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
      _push(ssrRenderComponent(unref(_sfc_main$1), {
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
      if (unref(isLoading)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="bg-card rounded-3xl p-4 space-y-4 border h-96 animate-pulse"><div class="h-48 bg-muted rounded-2xl w-full"></div><div class="h-6 bg-muted rounded w-3/4"></div><div class="h-4 bg-muted rounded w-1/2"></div></div>`);
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
            to: `/services/${item.prestation.id}`,
            class: "block h-full flex flex-col"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<div class="relative h-56 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", ((_a = item.image[0]) == null ? void 0 : _a.path) || "/placeholder-service.jpg")}${ssrRenderAttr("alt", item.prestation.title)} class="${ssrRenderClass([{ "grayscale": !item.prestation.active }, "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"])}"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"${_scopeId}></div><div class="absolute top-4 left-4"${_scopeId}><div class="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full"${_scopeId}>${ssrInterpolate(item.prestation.cityValue)}</div></div><div class="absolute bottom-4 left-4"${_scopeId}><div class="text-white"${_scopeId}><span class="text-xs opacity-90"${_scopeId}>\xC0 partir de</span><div class="text-xl font-black"${_scopeId}>${ssrInterpolate(unref(formatCurrency)(item.prestation.minPrice, getCurrencyCode(item.prestation.deviseId)))}</div><div class="text-xs text-white/70 mt-1"${_scopeId}>${ssrInterpolate(unref(getCurrencyLabel)(getCurrencyCode(item.prestation.deviseId)))}</div></div></div></div><div class="p-6 flex-1 flex flex-col space-y-4"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><h3 class="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2"${_scopeId}>${ssrInterpolate(item.prestation.title)}</h3></div><div class="flex items-center gap-2 text-xs text-muted-foreground"${_scopeId}>`);
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
            _push(ssrRenderComponent(unref(_sfc_main$1), {
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
            _push(ssrRenderComponent(unref(_sfc_main$1), {
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
//# sourceMappingURL=index-Dc6AE0-3.mjs.map
