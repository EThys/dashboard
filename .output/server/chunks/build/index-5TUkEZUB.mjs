import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, withAsyncContext, ref, computed, watch, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { Search, ChevronDown, Calendar, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize, ArrowRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { b as usePropertyStore, c as useRuntimeConfig } from './server.mjs';
import { f as formatCurrency, g as getCurrencyLabel } from './currency-BoakoUK-.mjs';
import { _ as _sfc_main$2 } from './CasaLoader-BMTTq4Tc.mjs';
import { u as useAsyncData } from './asyncData-B0whOYVl.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'vue-sonner';
import 'perfect-debounce';

const _imports_0 = "" + buildAssetsURL("congo.BVglewmh.jpg");
const itemsPerPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const { pending: isLoading } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("all-properties", async () => {
      await Promise.all([
        propertyStore.fetchTypes(config.public.apiBase),
        propertyStore.fetchTerrains(config.public.apiBase),
        propertyStore.fetchFuneraires(config.public.apiBase),
        propertyStore.fetchFestives(config.public.apiBase),
        propertyStore.fetchBureaux(config.public.apiBase),
        propertyStore.fetchHotels(config.public.apiBase),
        propertyStore.fetchProperties(config.public.apiBase)
      ]);
    }, { lazy: true })), __temp = await __temp, __restore(), __temp);
    const searchQuery = ref("");
    const selectedType = ref("all");
    const selectedTransaction = ref("all");
    const showAdvancedFilters = ref(false);
    const minPrice = ref(null);
    const maxPrice = ref(null);
    const selectedCurrency = ref("all");
    const roomCount = ref("all");
    const toggleAdvanced = () => showAdvancedFilters.value = !showAdvancedFilters.value;
    const properties = computed(() => {
      const allRaw = [
        ...propertyStore.properties.map((i) => ({ ...i, _category: "property" })),
        ...propertyStore.terrains.map((i) => ({ ...i, _category: "terrain", typeProperty: { name: "Terrain" } })),
        ...propertyStore.bureaux.map((i) => ({ ...i, _category: "bureau", typeProperty: { name: "Bureau" } })),
        ...propertyStore.hotels.map((i) => ({ ...i, _category: "hotel", typeProperty: { name: "H\xF4tel" } })),
        ...propertyStore.festives.map((i) => ({ ...i, _category: "festive", typeProperty: { name: "Salle de f\xEAte" } })),
        ...propertyStore.funeraires.map((i) => ({ ...i, _category: "funeraire", typeProperty: { name: "Espace fun\xE9raire" } }))
      ];
      return allRaw.map((item) => {
        var _a, _b, _c, _d;
        const p = item.property || item.terrain || item.funeraire || item.festive || item.bureau || item.hotel || {};
        const id = p.id || p.propertyId;
        let addr = item.address;
        if (item.hotel && !addr) addr = item.hotel;
        const getVal = (obj, key) => (obj == null ? void 0 : obj[key]) || "";
        let locationStr = "RDC";
        const localAddr = item.localAddress || {};
        if (((_a = localAddr.commune) == null ? void 0 : _a.name) && ((_b = localAddr.city) == null ? void 0 : _b.name)) {
          locationStr = `${localAddr.commune.name}, ${localAddr.city.name}`;
        } else if (getVal(addr, "communeValue") && getVal(addr, "cityValue")) {
          locationStr = `${getVal(addr, "communeValue")}, ${getVal(addr, "cityValue")}`;
        } else if (getVal(p, "communeValue") && getVal(p, "cityValue")) {
          locationStr = `${getVal(p, "communeValue")}, ${getVal(p, "cityValue")}`;
        } else if (getVal(addr, "cityValue")) {
          locationStr = `${getVal(addr, "cityValue")}, RDC`;
        }
        const extractImages = (it) => {
          const imgs = [];
          if (it.images && Array.isArray(it.images)) {
            it.images.forEach((img2) => {
              if (img2.publicPath) imgs.push(img2.publicPath);
              else if (img2.path) imgs.push(img2.path);
            });
          } else if (it.images && typeof it.images === "object") {
            if (it.images.main) it.images.main.forEach((i) => i.publicPath && imgs.push(i.publicPath));
          }
          if (it.hotel && it.hotel.image) imgs.push(it.hotel.image);
          return imgs;
        };
        const images = extractImages(item);
        let img = images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";
        let typeName = (_c = item.typeProperty) == null ? void 0 : _c.name;
        if (!typeName) {
          if (item.terrain) typeName = "Terrain";
          else if (item.bureau) typeName = "Bureau";
          else if (item.hotel) typeName = "H\xF4tel";
          else if (item.festive) typeName = "Salle de f\xEAte";
          else if (item.funeraire) typeName = "Espace fun\xE9raire";
          else typeName = "Propri\xE9t\xE9";
        }
        const currencyCode = ((_d = item.devise) == null ? void 0 : _d.code) || "USD";
        const priceVal = p.price || 0;
        const priceDisplay = formatCurrency(priceVal, currencyCode);
        const displayArea = p.surface && p.surface > 0 ? `${p.surface}m\xB2` : p.livingRoom ? `${p.livingRoom} salon(s)` : "";
        return {
          id,
          title: p.title || typeName,
          location: locationStr,
          price: priceDisplay,
          priceValue: priceVal,
          currencyCode,
          currencyLabel: getCurrencyLabel(currencyCode),
          type: typeName,
          image: img,
          publisherImage: item.image || "",
          beds: p.bedrooms || 0,
          baths: p.bathroom || 0,
          area: displayArea,
          transaction: p.transactionType || "vente",
          category: item._category,
          date: p.createdAt ? new Date(p.createdAt) : /* @__PURE__ */ new Date()
        };
      }).sort((a, b) => {
        if (a.category === "property" && b.category !== "property") return -1;
        if (a.category !== "property" && b.category === "property") return 1;
        return b.date.getTime() - a.date.getTime();
      });
    });
    const propertyTypes = computed(() => {
      const allItems = properties.value;
      const types = new Set(allItems.map((p) => p.type).filter(Boolean));
      return ["all", ...Array.from(types)];
    });
    const filteredProperties = computed(() => {
      let res = properties.value;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        res = res.filter(
          (p) => {
            var _a, _b, _c;
            return ((_a = p.title) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = p.location) == null ? void 0 : _b.toLowerCase().includes(q)) || ((_c = p.type) == null ? void 0 : _c.toLowerCase().includes(q));
          }
        );
      }
      if (selectedType.value !== "all") {
        res = res.filter((p) => p.type === selectedType.value);
      }
      if (selectedTransaction.value !== "all") {
        res = res.filter((p) => p.transaction === selectedTransaction.value);
      }
      if (showAdvancedFilters.value) {
        if (minPrice.value !== null) {
          res = res.filter((p) => p.priceValue >= minPrice.value);
        }
        if (maxPrice.value !== null) {
          res = res.filter((p) => p.priceValue <= maxPrice.value);
        }
        if (selectedCurrency.value !== "all") {
          res = res.filter((p) => p.currencyCode === selectedCurrency.value);
        }
        if (roomCount.value !== "all") {
          if (roomCount.value === "4+") {
            res = res.filter((p) => p.beds >= 4);
          } else {
            res = res.filter((p) => p.beds === Number(roomCount.value));
          }
        }
      }
      return res;
    });
    const currentPage = ref(1);
    const totalPages = computed(() => Math.ceil(filteredProperties.value.length / itemsPerPage));
    const paginatedProperties = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredProperties.value.slice(start, end);
    });
    watch([searchQuery, selectedType, selectedTransaction, showAdvancedFilters, minPrice, maxPrice, selectedCurrency, roomCount], () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HomeIcon = resolveComponent("HomeIcon");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative py-24 bg-slate-900 overflow-hidden"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Properties background"><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div></div><div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 z-0"></div><div class="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 z-0"></div><div class="container mx-auto px-4 relative z-10 text-center"><h1 class="text-4xl md:text-5xl font-black text-white mb-6"> D\xE9couvrez Votre Prochain <span class="text-primary block mt-2">Chez-Vous</span></h1><p class="text-lg text-white/80 max-w-2xl mx-auto mb-10"> Parcourez notre s\xE9lection exclusive de propri\xE9t\xE9s \xE0 Kinshasa. </p><div class="max-w-2xl mx-auto relative group"><div class="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-200"></div><div class="relative flex items-center bg-white dark:bg-slate-800 rounded-xl p-2 shadow-2xl">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-5 w-5 text-muted-foreground ml-3" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Que recherchez-vous ? (ex: Gombe, 3 chambres...)" class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-foreground px-4 font-outfit">`);
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
      _push(ssrRenderComponent(_component_HomeIcon, { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "all") : ssrLooseEqual(unref(selectedType), "all")) ? " selected" : ""}>Tous les types</option><!--[-->`);
      ssrRenderList(unref(propertyTypes), (t) => {
        _push(`<option${ssrRenderAttr("value", t)} style="${ssrRenderStyle(t !== "all" ? null : { display: "none" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), t) : ssrLooseEqual(unref(selectedType), t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
      });
      _push(`<!--]--></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-4 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "all") : ssrLooseEqual(unref(selectedTransaction), "all")) ? " selected" : ""}>Vente &amp; Location</option><option value="vente"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "vente") : ssrLooseEqual(unref(selectedTransaction), "vente")) ? " selected" : ""}>\xC0 Vendre</option><option value="location"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "location") : ssrLooseEqual(unref(selectedTransaction), "location")) ? " selected" : ""}>\xC0 Louer</option></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
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
        _push(`<div class="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2"><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Prix Minimum</label><input${ssrRenderAttr("value", unref(minPrice))} type="number" placeholder="0" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Prix Maximum</label><input${ssrRenderAttr("value", unref(maxPrice))} type="number" placeholder="Illimit\xE9" class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Devise</label><select class="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "all") : ssrLooseEqual(unref(selectedCurrency), "all")) ? " selected" : ""}>Toutes</option><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "USD") : ssrLooseEqual(unref(selectedCurrency), "USD")) ? " selected" : ""}>USD ($)</option><option value="CDF"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCurrency)) ? ssrLooseContain(unref(selectedCurrency), "CDF") : ssrLooseEqual(unref(selectedCurrency), "CDF")) ? " selected" : ""}>CDF (FC)</option></select></div><div class="space-y-2"><label class="text-sm font-medium text-muted-foreground">Chambres</label><div class="flex items-center gap-2"><!--[-->`);
        ssrRenderList(["all", "1", "2", "3", "4+"], (r) => {
          _push(`<button class="${ssrRenderClass([
            "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
            unref(roomCount) === r ? "bg-primary text-white border-primary" : "bg-background border-input hover:bg-muted"
          ])}">${ssrInterpolate(r)}</button>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><section class="pb-20 bg-muted/30"><div class="container mx-auto px-4">`);
      if (unref(isLoading)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 min-h-[400px]">`);
        _push(ssrRenderComponent(_sfc_main$2, { size: "lg" }, null, _parent));
        _push(`</div>`);
      } else if (unref(filteredProperties).length === 0) {
        _push(`<div class="text-center py-20"><div class="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">`);
        _push(ssrRenderComponent(unref(Search), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
        _push(`</div><h3 class="text-2xl font-bold mb-2">Aucune propri\xE9t\xE9 trouv\xE9e</h3><p class="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(paginatedProperties), (property) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: property.id,
            to: `/properties/${property.id}`,
            class: "group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-56 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", property.image)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"${_scopeId}><div class="absolute top-3 left-3"${_scopeId}><span class="px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider"${_scopeId}>${ssrInterpolate(property.type)}</span></div><div class="absolute top-3 right-3"${_scopeId}><span class="${ssrRenderClass([
                  "px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider",
                  property.transaction === "location" ? "bg-blue-600" : "bg-primary"
                ])}"${_scopeId}>${ssrInterpolate(property.transaction === "location" ? "\xC0 Louer" : "\xC0 Vendre")}</span></div>`);
                if (property.publisherImage) {
                  _push2(`<div class="absolute bottom-3 right-3 rounded-full border-2 border-white overflow-hidden h-10 w-10 bg-white/10 backdrop-blur-sm flex items-center justify-center"${_scopeId}><img${ssrRenderAttr("src", property.publisherImage)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="p-5 flex-1 flex flex-col"${_scopeId}><div class="mb-2"${_scopeId}><div class="flex items-center text-muted-foreground text-xs mb-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3 mr-1 text-primary" }, null, _parent2, _scopeId));
                _push2(`<span class="line-clamp-1"${_scopeId}>${ssrInterpolate(property.location)}</span></div><h3 class="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(property.title)}</h3></div><div class="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-border/50"${_scopeId}>`);
                if (property.category === "property") {
                  _push2(`<!--[--><div class="flex items-center gap-1.5 justify-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(BedDouble), { class: "h-3.5 w-3.5 text-muted-foreground" }, null, _parent2, _scopeId));
                  _push2(`<span class="text-xs font-bold"${_scopeId}>${ssrInterpolate(property.beds)}</span></div><div class="flex items-center gap-1.5 justify-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Bath), { class: "h-3.5 w-3.5 text-muted-foreground" }, null, _parent2, _scopeId));
                  _push2(`<span class="text-xs font-bold"${_scopeId}>${ssrInterpolate(property.baths)}</span></div><div class="flex items-center gap-1.5 justify-center"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Maximize), { class: "h-3.5 w-3.5 text-muted-foreground" }, null, _parent2, _scopeId));
                  _push2(`<span class="text-xs font-bold"${_scopeId}>${ssrInterpolate(property.area)}</span></div><!--]-->`);
                } else if (property.category === "terrain" || property.category === "festive" || property.category === "bureau") {
                  _push2(`<div class="col-span-3 flex items-center justify-center gap-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Maximize), { class: "h-3.5 w-3.5 text-muted-foreground" }, null, _parent2, _scopeId));
                  _push2(`<span class="text-xs font-bold"${_scopeId}>${ssrInterpolate(property.area)}</span></div>`);
                } else {
                  _push2(`<div class="col-span-3 text-center"${_scopeId}><span class="text-xs text-muted-foreground font-medium"${_scopeId}>Voir d\xE9tails</span></div>`);
                }
                _push2(`</div><div class="mt-auto flex items-center justify-between"${_scopeId}><div class="text-xl font-black text-primary"${_scopeId}>${ssrInterpolate(property.price)} <div class="text-xs text-muted-foreground font-normal"${_scopeId}>${ssrInterpolate(property.currencyLabel)}</div></div><div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-56 overflow-hidden" }, [
                    createVNode("img", {
                      src: property.image,
                      alt: property.title,
                      class: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute top-3 left-3" }, [
                      createVNode("span", { class: "px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider" }, toDisplayString(property.type), 1)
                    ]),
                    createVNode("div", { class: "absolute top-3 right-3" }, [
                      createVNode("span", {
                        class: [
                          "px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider",
                          property.transaction === "location" ? "bg-blue-600" : "bg-primary"
                        ]
                      }, toDisplayString(property.transaction === "location" ? "\xC0 Louer" : "\xC0 Vendre"), 3)
                    ]),
                    property.publisherImage ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute bottom-3 right-3 rounded-full border-2 border-white overflow-hidden h-10 w-10 bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    }, [
                      createVNode("img", {
                        src: property.publisherImage,
                        alt: property.title,
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src", "alt"])
                    ])) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "p-5 flex-1 flex flex-col" }, [
                    createVNode("div", { class: "mb-2" }, [
                      createVNode("div", { class: "flex items-center text-muted-foreground text-xs mb-1" }, [
                        createVNode(unref(MapPin), { class: "h-3 w-3 mr-1 text-primary" }),
                        createVNode("span", { class: "line-clamp-1" }, toDisplayString(property.location), 1)
                      ]),
                      createVNode("h3", { class: "text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors" }, toDisplayString(property.title), 1)
                    ]),
                    createVNode("div", { class: "grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-border/50" }, [
                      property.category === "property" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createVNode("div", { class: "flex items-center gap-1.5 justify-center" }, [
                          createVNode(unref(BedDouble), { class: "h-3.5 w-3.5 text-muted-foreground" }),
                          createVNode("span", { class: "text-xs font-bold" }, toDisplayString(property.beds), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 justify-center" }, [
                          createVNode(unref(Bath), { class: "h-3.5 w-3.5 text-muted-foreground" }),
                          createVNode("span", { class: "text-xs font-bold" }, toDisplayString(property.baths), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 justify-center" }, [
                          createVNode(unref(Maximize), { class: "h-3.5 w-3.5 text-muted-foreground" }),
                          createVNode("span", { class: "text-xs font-bold" }, toDisplayString(property.area), 1)
                        ])
                      ], 64)) : property.category === "terrain" || property.category === "festive" || property.category === "bureau" ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "col-span-3 flex items-center justify-center gap-2"
                      }, [
                        createVNode(unref(Maximize), { class: "h-3.5 w-3.5 text-muted-foreground" }),
                        createVNode("span", { class: "text-xs font-bold" }, toDisplayString(property.area), 1)
                      ])) : (openBlock(), createBlock("div", {
                        key: 2,
                        class: "col-span-3 text-center"
                      }, [
                        createVNode("span", { class: "text-xs text-muted-foreground font-medium" }, "Voir d\xE9tails")
                      ]))
                    ]),
                    createVNode("div", { class: "mt-auto flex items-center justify-between" }, [
                      createVNode("div", { class: "text-xl font-black text-primary" }, [
                        createTextVNode(toDisplayString(property.price) + " ", 1),
                        createVNode("div", { class: "text-xs text-muted-foreground font-normal" }, toDisplayString(property.currencyLabel), 1)
                      ]),
                      createVNode("div", { class: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" }, [
                        createVNode(unref(ArrowRight), { class: "h-4 w-4" })
                      ])
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
      if (unref(totalPages) > 1) {
        _push(`<div class="flex justify-center mt-12 gap-2"><!--[-->`);
        ssrRenderList(unref(totalPages), (p) => {
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            key: p,
            variant: unref(currentPage) === p ? "default" : "outline",
            class: "w-10 h-10 p-0 rounded-full font-bold",
            onClick: ($event) => {
              currentPage.value = p;
            }
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/properties/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-5TUkEZUB.mjs.map
