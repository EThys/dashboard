import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { Search, Filter, MapPin, Check, X, Wrench, ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useQuery } from '@tanstack/vue-query';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$5 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$3 } from './Badge-DOGV3Qys.mjs';
import { _ as _sfc_main$4 } from './Skeleton-BgOY-K4r.mjs';
import { c as useRuntimeConfig, b as usePropertyStore, d as useServiceStore } from './server.mjs';
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
import 'vue-sonner';

const itemsPerPage = 8;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const activeTab = ref("properties");
    watch(() => route.query.tab, (tab) => {
      if (tab === "services" || tab === "properties") {
        activeTab.value = tab;
      }
    });
    const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
      queryKey: ["prestations"],
      queryFn: async () => {
        const res = await fetch(`${config.public.apiBase}/prestations`);
        return res.json();
      }
    });
    const propertyStore = usePropertyStore();
    const serviceStore = useServiceStore();
    const config = useRuntimeConfig();
    serviceStore.fetchCategories(config.public.apiBase);
    const currentFilter = ref("all");
    const searchQuery = ref("");
    const currentPage = ref(1);
    const showFilters = ref(false);
    const dateStart = ref("");
    const dateEnd = ref("");
    const publisherFilter = ref("");
    const transactionTypeFilter = ref("");
    const addressFilter = ref("");
    const currencyFilter = ref("");
    const propertyTypeFilter = ref("");
    const sortOrder = ref("newest");
    const showServiceFilters = ref(false);
    const serviceSearchQuery = ref("");
    const selectedServiceCategory = ref(null);
    const selectedServiceDay = ref("all");
    const minServicePrice = ref(null);
    const maxServicePrice = ref(null);
    const startServiceDate = ref("");
    const endServiceDate = ref("");
    const selectedServiceExperience = ref("all");
    const selectedServiceStatus = ref("all");
    const { data: propertiesData, isLoading, isError } = useQuery({
      queryKey: ["properties"],
      queryFn: async () => {
        const res = await fetch(`${config.public.apiBase}/property`);
        return res.json();
      }
    });
    watch(propertiesData, (newData) => {
      if (newData == null ? void 0 : newData.properties) {
        propertyStore.setProperties(newData.properties);
      }
    }, { immediate: true });
    const allPublications = computed(() => {
      var _a;
      if (!((_a = propertiesData.value) == null ? void 0 : _a.properties)) return [];
      return propertiesData.value.properties.map((item) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h;
        const p = item.property;
        const addr = item.address;
        const img = ((_c = (_b = (_a2 = item.images) == null ? void 0 : _a2.main) == null ? void 0 : _b[0]) == null ? void 0 : _c.publicPath) || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        const status = p.available ? "Active" : "Pending";
        const price = typeof p.price === "number" ? p.price.toLocaleString() : p.price;
        return {
          id: p.propertyId,
          title: p.title || "Sans titre",
          type: ((_d = item.typeProperty) == null ? void 0 : _d.name) || "Inconnu",
          location: `${(addr == null ? void 0 : addr.communeValue) || ""}, ${(addr == null ? void 0 : addr.cityValue) || "RDC"}`,
          price: `${price} ${((_e = item.devise) == null ? void 0 : _e.code) || "USD"}`,
          image: img,
          status,
          author: ((_f = item.postBy) == null ? void 0 : _f.replace("@@", "")) || "Inconnu",
          description: p.description || "Aucune description fournie.",
          date: new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          rawDate: new Date(p.createdAt),
          transactionType: p.transactionType,
          deviseCode: (_g = item.devise) == null ? void 0 : _g.code,
          rawType: (_h = item.typeProperty) == null ? void 0 : _h.name,
          rawAddress: `${(addr == null ? void 0 : addr.address) || ""} ${(addr == null ? void 0 : addr.communeValue) || ""} ${(addr == null ? void 0 : addr.quartierValue) || ""} ${(addr == null ? void 0 : addr.cityValue) || ""}`,
          raw: item
        };
      });
    });
    const getCurrencyCode = (deviseId) => deviseId === 1 ? "CDF" : "USD";
    const allServices = computed(() => {
      var _a;
      if (!((_a = servicesData.value) == null ? void 0 : _a.prestations)) return [];
      return servicesData.value.prestations.map((item) => {
        var _a2;
        const p = item.prestation;
        const img = p.profile || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        const price = typeof p.minPrice === "number" ? p.minPrice.toLocaleString() : p.minPrice;
        const currency = getCurrencyCode(p.deviseId);
        return {
          id: p.id,
          title: p.title || "Sans titre",
          location: `${p.communeValue || ""}, ${p.cityValue || ""}`,
          minPriceFormatted: `${price} ${currency}`,
          // Updated display format
          image: img,
          status: p.active ? "Active" : "Inactive",
          author: ((_a2 = item.postBy) == null ? void 0 : _a2.replace("@@", "")) || "Inconnu",
          description: p.description || "Aucune description fournie.",
          date: new Date(p.dateCreated).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          rawDate: new Date(p.dateCreated),
          raw: item
        };
      });
    });
    const filteredServices = computed(() => {
      let list = allServices.value;
      if (serviceSearchQuery.value) {
        const q = serviceSearchQuery.value.toLowerCase();
        list = list.filter(
          (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
        );
      }
      if (selectedServiceCategory.value) {
        const cat = selectedServiceCategory.value;
        list = list.filter((s) => s.raw.prestation.serviceId === cat);
      }
      if (selectedServiceDay.value !== "all") {
        const day = selectedServiceDay.value;
        list = list.filter((s) => s.raw.prestation.plageJourPrestation.includes(day));
      }
      if (minServicePrice.value !== null) {
        const min = minServicePrice.value;
        list = list.filter((s) => s.raw.prestation.minPrice >= min);
      }
      if (maxServicePrice.value !== null) {
        const max = maxServicePrice.value;
        list = list.filter((s) => s.raw.prestation.minPrice <= max);
      }
      if (startServiceDate.value) {
        const startPath = new Date(startServiceDate.value);
        list = list.filter((s) => s.rawDate >= startPath);
      }
      if (endServiceDate.value) {
        const end = new Date(endServiceDate.value);
        end.setHours(23, 59, 59);
        list = list.filter((s) => s.rawDate <= end);
      }
      if (selectedServiceExperience.value !== "all") {
        const target = parseInt(selectedServiceExperience.value);
        list = list.filter((s) => parseInt(s.raw.prestation.experience || "0") >= target);
      }
      if (selectedServiceStatus.value !== "all") {
        const status = selectedServiceStatus.value;
        if (status === "active") list = list.filter((s) => s.raw.prestation.active);
        else if (status === "inactive") list = list.filter((s) => !s.raw.prestation.active);
        else if (status === "certified") list = list.filter((s) => s.raw.prestation.certified);
      }
      return list;
    });
    const serviceCurrentPage = ref(1);
    const serviceTotalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage));
    const paginatedServices = computed(() => {
      const start = (serviceCurrentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredServices.value.slice(start, end);
    });
    watch([serviceSearchQuery, selectedServiceCategory, selectedServiceDay, minServicePrice, maxServicePrice, startServiceDate, endServiceDate, selectedServiceExperience, selectedServiceStatus], () => {
      serviceCurrentPage.value = 1;
    });
    const resetServiceFilters = () => {
      serviceSearchQuery.value = "";
      selectedServiceCategory.value = null;
      selectedServiceDay.value = "all";
      minServicePrice.value = null;
      maxServicePrice.value = null;
      startServiceDate.value = "";
      endServiceDate.value = "";
      selectedServiceExperience.value = "all";
      selectedServiceStatus.value = "all";
    };
    const filteredPublications = computed(() => {
      let pubs = allPublications.value;
      if (currentFilter.value !== "all") {
        const statusMap = {
          pending: "Pending",
          active: "Active",
          rejected: "Rejected"
        };
        pubs = pubs.filter((p) => p.status === statusMap[currentFilter.value]);
      }
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        pubs = pubs.filter(
          (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
        );
      }
      if (dateStart.value) {
        const start = new Date(dateStart.value);
        pubs = pubs.filter((p) => p.rawDate >= start);
      }
      if (dateEnd.value) {
        const end = new Date(dateEnd.value);
        end.setHours(23, 59, 59, 999);
        pubs = pubs.filter((p) => p.rawDate <= end);
      }
      if (publisherFilter.value) {
        const q = publisherFilter.value.toLowerCase();
        pubs = pubs.filter((p) => p.author.toLowerCase().includes(q));
      }
      if (transactionTypeFilter.value && transactionTypeFilter.value !== "all") {
        pubs = pubs.filter((p) => p.transactionType === transactionTypeFilter.value);
      }
      if (addressFilter.value) {
        const q = addressFilter.value.toLowerCase();
        pubs = pubs.filter((p) => p.rawAddress.toLowerCase().includes(q));
      }
      if (currencyFilter.value && currencyFilter.value !== "all") {
        pubs = pubs.filter((p) => p.deviseCode === currencyFilter.value);
      }
      if (propertyTypeFilter.value && propertyTypeFilter.value !== "all") {
        pubs = pubs.filter((p) => p.rawType === propertyTypeFilter.value);
      }
      pubs.sort((a, b) => {
        if (sortOrder.value === "newest") {
          return b.rawDate.getTime() - a.rawDate.getTime();
        } else {
          return a.rawDate.getTime() - b.rawDate.getTime();
        }
      });
      return pubs;
    });
    const totalPages = computed(() => Math.ceil(filteredPublications.value.length / itemsPerPage));
    const paginatedPublications = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPublications.value.slice(start, end);
    });
    const appovePub = (id) => alert(`Bien ${id} valid\xE9 !`);
    const rejectPub = (id) => alert(`Bien ${id} rejet\xE9 !`);
    const resetFilters = () => {
      searchQuery.value = "";
      dateStart.value = "";
      dateEnd.value = "";
      publisherFilter.value = "";
      transactionTypeFilter.value = "";
      addressFilter.value = "";
      currencyFilter.value = "";
      propertyTypeFilter.value = "";
      currentFilter.value = "all";
      sortOrder.value = "newest";
    };
    const goToDetail = (id) => {
      router.push(`/dashboard/publications/properties/${id}`);
    };
    const goToServiceDetail = (id) => {
      router.push(`/dashboard/publications/services/${id}`);
    };
    const filterOptions = [
      { label: "Toutes", value: "all" },
      { label: "En attente", value: "pending" },
      { label: "Valid\xE9es", value: "active" },
      { label: "Rejet\xE9es", value: "rejected" }
    ];
    const activeFilterCount = computed(() => {
      let count = 0;
      if (dateStart.value || dateEnd.value) {
        count++;
      }
      if (transactionTypeFilter.value && transactionTypeFilter.value !== "") {
        count++;
      }
      if (currencyFilter.value && currencyFilter.value !== "") {
        count++;
      }
      if (propertyTypeFilter.value && propertyTypeFilter.value !== "") {
        count++;
      }
      return count;
    });
    watch([currentFilter, searchQuery], () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 p-8 max-w-7xl mx-auto" }, _attrs))}><div class="flex gap-2 mb-6">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: activeTab.value === "properties" ? "default" : "outline",
        onClick: ($event) => unref(router).push({ path: "/dashboard/publications", query: { tab: "properties" } })
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Propri\xE9t\xE9s`);
          } else {
            return [
              createTextVNode("Propri\xE9t\xE9s")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: activeTab.value === "services" ? "default" : "outline",
        onClick: ($event) => unref(router).push({ path: "/dashboard/publications", query: { tab: "services" } })
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Services`);
          } else {
            return [
              createTextVNode("Services")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (activeTab.value === "properties") {
        _push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8"><div><h2 class="text-4xl font-black tracking-tight text-foreground">Mes Propri\xE9t\xE9s</h2><p class="text-lg text-muted-foreground mt-2">G\xE9rez vos annonces, suivez leur performance et mod\xE9rez le contenu.</p></div><div class="flex items-center gap-3"><div class="bg-card border rounded-lg p-1 flex items-center"><!--[-->`);
        ssrRenderList(filterOptions, (opt) => {
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            key: opt.value,
            variant: currentFilter.value === opt.value ? "secondary" : "ghost",
            size: "sm",
            class: "font-medium",
            onClick: ($event) => currentFilter.value = opt.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(opt.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(opt.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8"><div><h2 class="text-4xl font-black tracking-tight text-foreground">Mes Services</h2><p class="text-lg text-muted-foreground mt-2">G\xE9rez vos prestations et suivez leur performance.</p></div></div>`);
      }
      if (activeTab.value === "properties") {
        _push(`<div class="bg-card border rounded-2xl p-4 shadow-sm space-y-4"><div class="flex flex-col lg:flex-row gap-4 justify-between items-center"><div class="relative w-full lg:max-w-md">`);
        _push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "search",
          placeholder: "Rechercher par titre, localisation, auteur...",
          class: "pl-10 h-11 bg-muted/30 border-muted focus:bg-background transition-colors",
          modelValue: searchQuery.value,
          "onUpdate:modelValue": ($event) => searchQuery.value = $event
        }, null, _parent));
        _push(`</div><div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          class: ["h-11 border-dashed", showFilters.value ? "bg-primary/5 border-primary text-primary" : ""],
          onClick: ($event) => showFilters.value = !showFilters.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Filter), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
              _push2(` Filtres `);
              if (activeFilterCount.value > 0) {
                _push2(ssrRenderComponent(unref(_sfc_main$3), {
                  variant: "secondary",
                  class: "ml-2 h-5 px-1"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(activeFilterCount.value)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(activeFilterCount.value), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(Filter), { class: "h-4 w-4 mr-2" }),
                createTextVNode(" Filtres "),
                activeFilterCount.value > 0 ? (openBlock(), createBlock(unref(_sfc_main$3), {
                  key: 0,
                  variant: "secondary",
                  class: "ml-2 h-5 px-1"
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(activeFilterCount.value), 1)
                  ]),
                  _: 1
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="h-8 w-px bg-border hidden lg:block"></div><select class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "newest") : ssrLooseEqual(sortOrder.value, "newest")) ? " selected" : ""}>Plus r\xE9cent</option><option value="oldest"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "oldest") : ssrLooseEqual(sortOrder.value, "oldest")) ? " selected" : ""}>Plus ancien</option></select></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-1" style="${ssrRenderStyle(showFilters.value ? null : { display: "none" })}"><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">P\xE9riode</label><div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "date",
          modelValue: dateStart.value,
          "onUpdate:modelValue": ($event) => dateStart.value = $event,
          class: "h-9 text-sm"
        }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "date",
          modelValue: dateEnd.value,
          "onUpdate:modelValue": ($event) => dateEnd.value = $event,
          class: "h-9 text-sm"
        }, null, _parent));
        _push(`</div></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Transaction</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "") : ssrLooseEqual(transactionTypeFilter.value, "")) ? " selected" : ""}>Tout type</option><option value="location"${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "location") : ssrLooseEqual(transactionTypeFilter.value, "location")) ? " selected" : ""}>Location</option><option value="vente"${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "vente") : ssrLooseEqual(transactionTypeFilter.value, "vente")) ? " selected" : ""}>Vente</option></select></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Bien</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "") : ssrLooseEqual(propertyTypeFilter.value, "")) ? " selected" : ""}>Tous les biens</option><option value="Maisons"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Maisons") : ssrLooseEqual(propertyTypeFilter.value, "Maisons")) ? " selected" : ""}>Maisons</option><option value="Apparts"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Apparts") : ssrLooseEqual(propertyTypeFilter.value, "Apparts")) ? " selected" : ""}>Appartements</option><option value="Studio"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Studio") : ssrLooseEqual(propertyTypeFilter.value, "Studio")) ? " selected" : ""}>Studio</option><option value="Villas"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Villas") : ssrLooseEqual(propertyTypeFilter.value, "Villas")) ? " selected" : ""}>Villas</option><option value="Parcelles"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Parcelles") : ssrLooseEqual(propertyTypeFilter.value, "Parcelles")) ? " selected" : ""}>Parcelles</option></select></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Devise</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "") : ssrLooseEqual(currencyFilter.value, "")) ? " selected" : ""}>Toute devise</option><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "USD") : ssrLooseEqual(currencyFilter.value, "USD")) ? " selected" : ""}>USD</option><option value="CDF"${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "CDF") : ssrLooseEqual(currencyFilter.value, "CDF")) ? " selected" : ""}>CDF</option></select></div><div class="md:col-span-2 lg:col-span-4 flex justify-end">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "ghost",
          size: "sm",
          class: "text-muted-foreground hover:text-foreground",
          onClick: resetFilters
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` R\xE9initialiser tous les filtres `);
            } else {
              return [
                createTextVNode(" R\xE9initialiser tous les filtres ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "properties") {
        _push(`<div>`);
        if (unref(isLoading)) {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(8, (i) => {
            _push(`<div class="flex flex-col space-y-3">`);
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-[200px] w-full rounded-xl" }, null, _parent));
            _push(`<div class="space-y-2">`);
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-[250px]" }, null, _parent));
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-[200px]" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (filteredPublications.value.length === 0) {
          _push(`<div class="py-20 text-center border rounded-lg bg-card text-card-foreground"><p class="text-muted-foreground">Aucune publication trouv\xE9e.</p>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "link",
            onClick: resetFilters
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Tout afficher`);
              } else {
                return [
                  createTextVNode("Tout afficher")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(paginatedPublications.value, (pub) => {
            _push(ssrRenderComponent(unref(_sfc_main$1$1), {
              key: pub.id,
              onClick: ($event) => goToDetail(pub.id),
              class: "overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="relative aspect-video overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", pub.image)}${ssrRenderAttr("alt", pub.title)} class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"${_scopeId}><div class="absolute top-2 left-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$3), {
                    variant: "secondary",
                    class: "bg-white/90 hover:bg-white/90 text-black shadow-sm"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(pub.type)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(pub.type), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="absolute top-2 right-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$3), {
                    variant: pub.status === "Active" ? "default" : "secondary",
                    class: pub.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600 text-white"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(pub.status === "Active" ? "Valid\xE9" : "En attente")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(pub.status === "Active" ? "Valid\xE9" : "En attente"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></div>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div${_scopeId2}><h3 class="font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors"${_scopeId2}>${ssrInterpolate(pub.title)}</h3><div class="flex items-center text-xs text-muted-foreground gap-1"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                        _push3(`<span class="line-clamp-1"${_scopeId2}>${ssrInterpolate(pub.location)}</span></div></div><div class="font-bold text-primary text-xl"${_scopeId2}>${ssrInterpolate(pub.price)}</div><div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}><span${_scopeId2}>Par <span class="font-medium text-foreground"${_scopeId2}>${ssrInterpolate(pub.author)}</span></span><span${_scopeId2}>${ssrInterpolate(pub.date)}</span></div>`);
                        if (pub.status === "Pending") {
                          _push3(`<div class="grid grid-cols-2 gap-2 mt-2"${_scopeId2}>`);
                          _push3(ssrRenderComponent(unref(_sfc_main$1), {
                            size: "icon",
                            variant: "default",
                            class: "h-8 w-full bg-green-600 hover:bg-green-700 z-10",
                            onClick: ($event) => appovePub(pub.id)
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                              } else {
                                return [
                                  createVNode(unref(Check), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                          _push3(ssrRenderComponent(unref(_sfc_main$1), {
                            size: "icon",
                            variant: "destructive",
                            class: "h-8 w-full z-10",
                            onClick: ($event) => rejectPub(pub.id)
                          }, {
                            default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                              if (_push4) {
                                _push4(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                              } else {
                                return [
                                  createVNode(unref(X), { class: "h-4 w-4" })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent3, _scopeId2));
                          _push3(`</div>`);
                        } else {
                          _push3(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(pub.title), 1),
                            createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                              createVNode(unref(MapPin), { class: "h-3 w-3" }),
                              createVNode("span", { class: "line-clamp-1" }, toDisplayString(pub.location), 1)
                            ])
                          ]),
                          createVNode("div", { class: "font-bold text-primary text-xl" }, toDisplayString(pub.price), 1),
                          createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                            createVNode("span", null, [
                              createTextVNode("Par "),
                              createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(pub.author), 1)
                            ]),
                            createVNode("span", null, toDisplayString(pub.date), 1)
                          ]),
                          pub.status === "Pending" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "grid grid-cols-2 gap-2 mt-2"
                          }, [
                            createVNode(unref(_sfc_main$1), {
                              size: "icon",
                              variant: "default",
                              class: "h-8 w-full bg-green-600 hover:bg-green-700 z-10",
                              onClick: withModifiers(($event) => appovePub(pub.id), ["stop", "prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Check), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$1), {
                              size: "icon",
                              variant: "destructive",
                              class: "h-8 w-full z-10",
                              onClick: withModifiers(($event) => rejectPub(pub.id), ["stop", "prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(X), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "relative aspect-video overflow-hidden" }, [
                      createVNode("img", {
                        src: pub.image,
                        alt: pub.title,
                        class: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      }, null, 8, ["src", "alt"]),
                      createVNode("div", { class: "absolute top-2 left-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          variant: "secondary",
                          class: "bg-white/90 hover:bg-white/90 text-black shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(pub.type), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      createVNode("div", { class: "absolute top-2 right-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          variant: pub.status === "Active" ? "default" : "secondary",
                          class: pub.status === "Active" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600 text-white"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(pub.status === "Active" ? "Valid\xE9" : "En attente"), 1)
                          ]),
                          _: 2
                        }, 1032, ["variant", "class"])
                      ])
                    ]),
                    createVNode(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(pub.title), 1),
                          createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                            createVNode(unref(MapPin), { class: "h-3 w-3" }),
                            createVNode("span", { class: "line-clamp-1" }, toDisplayString(pub.location), 1)
                          ])
                        ]),
                        createVNode("div", { class: "font-bold text-primary text-xl" }, toDisplayString(pub.price), 1),
                        createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                          createVNode("span", null, [
                            createTextVNode("Par "),
                            createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(pub.author), 1)
                          ]),
                          createVNode("span", null, toDisplayString(pub.date), 1)
                        ]),
                        pub.status === "Pending" ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid grid-cols-2 gap-2 mt-2"
                        }, [
                          createVNode(unref(_sfc_main$1), {
                            size: "icon",
                            variant: "default",
                            class: "h-8 w-full bg-green-600 hover:bg-green-700 z-10",
                            onClick: withModifiers(($event) => appovePub(pub.id), ["stop", "prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Check), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$1), {
                            size: "icon",
                            variant: "destructive",
                            class: "h-8 w-full z-10",
                            onClick: withModifiers(($event) => rejectPub(pub.id), ["stop", "prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(X), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "services") {
        _push(`<div class="bg-card border rounded-2xl p-4 shadow-sm space-y-4"><div class="grid grid-cols-1 md:grid-cols-12 gap-4"><div class="md:col-span-4 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
        _push(ssrRenderComponent(unref(Wrench), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
        _push(`</div><select class="w-full h-11 pl-12 pr-8 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none text-sm"><option${ssrRenderAttr("value", null)}${ssrIncludeBooleanAttr(Array.isArray(selectedServiceCategory.value) ? ssrLooseContain(selectedServiceCategory.value, null) : ssrLooseEqual(selectedServiceCategory.value, null)) ? " selected" : ""}>Tous les services</option><!--[-->`);
        ssrRenderList(unref(serviceStore).categories, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedServiceCategory.value) ? ssrLooseContain(selectedServiceCategory.value, cat.id) : ssrLooseEqual(selectedServiceCategory.value, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
        _push(`</div></div><div class="md:col-span-4 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
        _push(`</div><select class="w-full h-11 pl-12 pr-8 bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none text-sm"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "all") : ssrLooseEqual(selectedServiceDay.value, "all")) ? " selected" : ""}>Tous les jours</option><option value="Lundi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Lundi") : ssrLooseEqual(selectedServiceDay.value, "Lundi")) ? " selected" : ""}>Lundi</option><option value="Mardi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Mardi") : ssrLooseEqual(selectedServiceDay.value, "Mardi")) ? " selected" : ""}>Mardi</option><option value="Mercredi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Mercredi") : ssrLooseEqual(selectedServiceDay.value, "Mercredi")) ? " selected" : ""}>Mercredi</option><option value="Jeudi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Jeudi") : ssrLooseEqual(selectedServiceDay.value, "Jeudi")) ? " selected" : ""}>Jeudi</option><option value="Vendredi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Vendredi") : ssrLooseEqual(selectedServiceDay.value, "Vendredi")) ? " selected" : ""}>Vendredi</option><option value="Samedi"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Samedi") : ssrLooseEqual(selectedServiceDay.value, "Samedi")) ? " selected" : ""}>Samedi</option><option value="Dimanche"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceDay.value) ? ssrLooseContain(selectedServiceDay.value, "Dimanche") : ssrLooseEqual(selectedServiceDay.value, "Dimanche")) ? " selected" : ""}>Dimanche</option></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
        _push(`</div></div><div class="md:col-span-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: ($event) => showServiceFilters.value = !showServiceFilters.value,
          variant: showServiceFilters.value ? "default" : "outline",
          class: "w-full h-11 rounded-xl flex items-center justify-between"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Filtres Avanc\xE9s </span>`);
              _push2(ssrRenderComponent(unref(ChevronDown), {
                class: ["h-4 w-4 transition-transform", { "rotate-180": showServiceFilters.value }]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode("span", { class: "flex items-center gap-2" }, [
                  createVNode(unref(Filter), { class: "h-4 w-4" }),
                  createTextVNode(" Filtres Avanc\xE9s ")
                ]),
                createVNode(unref(ChevronDown), {
                  class: ["h-4 w-4 transition-transform", { "rotate-180": showServiceFilters.value }]
                }, null, 8, ["class"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
        if (showServiceFilters.value) {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-1"><div class="space-y-2 md:col-span-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recherche</label>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            modelValue: serviceSearchQuery.value,
            "onUpdate:modelValue": ($event) => serviceSearchQuery.value = $event,
            placeholder: "Rechercher par titre, description...",
            class: "h-9"
          }, null, _parent));
          _push(`</div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix Min</label>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            "model-value": (_a = minServicePrice.value) != null ? _a : void 0,
            "onUpdate:modelValue": ($event) => minServicePrice.value = $event ? Number($event) : null,
            type: "number",
            placeholder: "0",
            class: "h-9"
          }, null, _parent));
          _push(`</div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix Max</label>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            "model-value": (_b = maxServicePrice.value) != null ? _b : void 0,
            "onUpdate:modelValue": ($event) => maxServicePrice.value = $event ? Number($event) : null,
            type: "number",
            placeholder: "Max",
            class: "h-9"
          }, null, _parent));
          _push(`</div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date D\xE9but</label>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            modelValue: startServiceDate.value,
            "onUpdate:modelValue": ($event) => startServiceDate.value = $event,
            type: "date",
            class: "h-9"
          }, null, _parent));
          _push(`</div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Fin</label>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            modelValue: endServiceDate.value,
            "onUpdate:modelValue": ($event) => endServiceDate.value = $event,
            type: "date",
            class: "h-9"
          }, null, _parent));
          _push(`</div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exp\xE9rience</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceExperience.value) ? ssrLooseContain(selectedServiceExperience.value, "all") : ssrLooseEqual(selectedServiceExperience.value, "all")) ? " selected" : ""}>Peu importe</option><option value="1"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceExperience.value) ? ssrLooseContain(selectedServiceExperience.value, "1") : ssrLooseEqual(selectedServiceExperience.value, "1")) ? " selected" : ""}>1+ an</option><option value="3"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceExperience.value) ? ssrLooseContain(selectedServiceExperience.value, "3") : ssrLooseEqual(selectedServiceExperience.value, "3")) ? " selected" : ""}>3+ ans</option><option value="5"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceExperience.value) ? ssrLooseContain(selectedServiceExperience.value, "5") : ssrLooseEqual(selectedServiceExperience.value, "5")) ? " selected" : ""}>5+ ans</option><option value="10"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceExperience.value) ? ssrLooseContain(selectedServiceExperience.value, "10") : ssrLooseEqual(selectedServiceExperience.value, "10")) ? " selected" : ""}>10+ ans</option></select></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statut</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceStatus.value) ? ssrLooseContain(selectedServiceStatus.value, "all") : ssrLooseEqual(selectedServiceStatus.value, "all")) ? " selected" : ""}>Tous</option><option value="certified"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceStatus.value) ? ssrLooseContain(selectedServiceStatus.value, "certified") : ssrLooseEqual(selectedServiceStatus.value, "certified")) ? " selected" : ""}>Certifi\xE9</option><option value="active"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceStatus.value) ? ssrLooseContain(selectedServiceStatus.value, "active") : ssrLooseEqual(selectedServiceStatus.value, "active")) ? " selected" : ""}>Actif</option><option value="inactive"${ssrIncludeBooleanAttr(Array.isArray(selectedServiceStatus.value) ? ssrLooseContain(selectedServiceStatus.value, "inactive") : ssrLooseEqual(selectedServiceStatus.value, "inactive")) ? " selected" : ""}>Inactif</option></select></div><div class="md:col-span-2 lg:col-span-4 flex justify-end">`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "ghost",
            size: "sm",
            class: "text-muted-foreground hover:text-foreground",
            onClick: resetServiceFilters
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` R\xE9initialiser les filtres `);
              } else {
                return [
                  createTextVNode(" R\xE9initialiser les filtres ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "services") {
        _push(`<div>`);
        if (unref(isLoadingServices)) {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(8, (i) => {
            _push(`<div class="flex flex-col space-y-3">`);
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-[200px] w-full rounded-xl" }, null, _parent));
            _push(`<div class="space-y-2">`);
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-[250px]" }, null, _parent));
            _push(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-[200px]" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (filteredServices.value.length === 0) {
          _push(`<div class="py-20 text-center border rounded-lg bg-card text-card-foreground"><p class="text-muted-foreground">Aucun service trouv\xE9.</p>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "link",
            onClick: resetServiceFilters
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Tout afficher`);
              } else {
                return [
                  createTextVNode("Tout afficher")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(paginatedServices.value, (srv) => {
            _push(ssrRenderComponent(unref(_sfc_main$1$1), {
              key: srv.id,
              onClick: ($event) => goToServiceDetail(srv.id),
              class: "overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="absolute top-2 right-2 z-20 flex flex-col gap-1"${_scopeId}>`);
                  if (srv.raw.prestation.certified) {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "default",
                      class: "bg-blue-600 hover:bg-blue-600 shadow-sm text-[10px]"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Certifi\xE9 `);
                        } else {
                          return [
                            createTextVNode(" Certifi\xE9 ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (!srv.raw.prestation.active) {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "destructive",
                      class: "shadow-sm text-[10px]"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(` Inactif `);
                        } else {
                          return [
                            createTextVNode(" Inactif ")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="relative aspect-video overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", srv.image)}${ssrRenderAttr("alt", srv.title)} class="${ssrRenderClass([{ "grayscale": !srv.raw.prestation.active }, "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"])}"${_scopeId}></div>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div${_scopeId2}><h3 class="font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors"${_scopeId2}>${ssrInterpolate(srv.title)}</h3><div class="flex items-center text-xs text-muted-foreground gap-1"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                        _push3(`<span class="line-clamp-1"${_scopeId2}>${ssrInterpolate(srv.location)}</span></div></div><div class="font-bold text-primary max-sm:text-sm"${_scopeId2}><span class="text-muted-foreground text-xs font-normal block"${_scopeId2}>\xC0 partir de</span> ${ssrInterpolate(srv.minPriceFormatted)}</div><div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}><span${_scopeId2}>Par <span class="font-medium text-foreground"${_scopeId2}>${ssrInterpolate(srv.author)}</span></span><span${_scopeId2}>${ssrInterpolate(srv.date)}</span></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(srv.title), 1),
                            createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                              createVNode(unref(MapPin), { class: "h-3 w-3" }),
                              createVNode("span", { class: "line-clamp-1" }, toDisplayString(srv.location), 1)
                            ])
                          ]),
                          createVNode("div", { class: "font-bold text-primary max-sm:text-sm" }, [
                            createVNode("span", { class: "text-muted-foreground text-xs font-normal block" }, "\xC0 partir de"),
                            createTextVNode(" " + toDisplayString(srv.minPriceFormatted), 1)
                          ]),
                          createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                            createVNode("span", null, [
                              createTextVNode("Par "),
                              createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(srv.author), 1)
                            ]),
                            createVNode("span", null, toDisplayString(srv.date), 1)
                          ])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode("div", { class: "absolute top-2 right-2 z-20 flex flex-col gap-1" }, [
                      srv.raw.prestation.certified ? (openBlock(), createBlock(unref(_sfc_main$3), {
                        key: 0,
                        variant: "default",
                        class: "bg-blue-600 hover:bg-blue-600 shadow-sm text-[10px]"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Certifi\xE9 ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      !srv.raw.prestation.active ? (openBlock(), createBlock(unref(_sfc_main$3), {
                        key: 1,
                        variant: "destructive",
                        class: "shadow-sm text-[10px]"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Inactif ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "relative aspect-video overflow-hidden" }, [
                      createVNode("img", {
                        src: srv.image,
                        alt: srv.title,
                        class: ["h-full w-full object-cover transition-transform duration-300 group-hover:scale-105", { "grayscale": !srv.raw.prestation.active }]
                      }, null, 10, ["src", "alt"])
                    ]),
                    createVNode(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(srv.title), 1),
                          createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                            createVNode(unref(MapPin), { class: "h-3 w-3" }),
                            createVNode("span", { class: "line-clamp-1" }, toDisplayString(srv.location), 1)
                          ])
                        ]),
                        createVNode("div", { class: "font-bold text-primary max-sm:text-sm" }, [
                          createVNode("span", { class: "text-muted-foreground text-xs font-normal block" }, "\xC0 partir de"),
                          createTextVNode(" " + toDisplayString(srv.minPriceFormatted), 1)
                        ]),
                        createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                          createVNode("span", null, [
                            createTextVNode("Par "),
                            createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(srv.author), 1)
                          ]),
                          createVNode("span", null, toDisplayString(srv.date), 1)
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "properties" && totalPages.value > 1 || activeTab.value === "services" && serviceTotalPages.value > 1) {
        _push(`<div class="flex items-center justify-center space-x-2 py-8">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          onClick: ($event) => activeTab.value === "properties" ? currentPage.value-- : serviceCurrentPage.value--,
          disabled: activeTab.value === "properties" ? currentPage.value === 1 : serviceCurrentPage.value === 1
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
              _push2(` Pr\xE9c\xE9dent `);
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4 mr-2" }),
                createTextVNode(" Pr\xE9c\xE9dent ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="flex items-center text-sm font-medium mx-2"> Page ${ssrInterpolate(activeTab.value === "properties" ? currentPage.value : serviceCurrentPage.value)} sur ${ssrInterpolate(activeTab.value === "properties" ? totalPages.value : serviceTotalPages.value)}</span>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          onClick: ($event) => activeTab.value === "properties" ? currentPage.value++ : serviceCurrentPage.value++,
          disabled: activeTab.value === "properties" ? currentPage.value === totalPages.value : serviceCurrentPage.value === serviceTotalPages.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4 ml-2" }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Suivant "),
                createVNode(unref(ChevronRight), { class: "h-4 w-4 ml-2" })
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/publications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-mL2HAxVb.mjs.map
