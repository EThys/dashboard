import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as _imports_0 } from './congo-DR1txCxA.mjs';
import { Search, Home, ChevronDown, Calendar, SlidersHorizontal, MapPin, BedDouble, Bath, Maximize, ArrowRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { h as useSeoMeta, u as useHead, m as useRoute, f as usePropertyStore, c as useRuntimeConfig } from './server.mjs';
import { f as formatCurrency, g as getCurrencyLabel } from './currency-BoakoUK-.mjs';
import { g as getPublicListingStatus, P as PropertyCardShimmer } from './listingAvailability-Dih21AIj.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { i as isLocationTransactionType, g as getPublicTransactionBadgeLabel } from './transactionDisplay-By5m3AMp.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'perfect-debounce';

const itemsPerPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b, _c;
    useSeoMeta({
      title: "Propri\xE9t\xE9s \xE0 Acheter & Louer en RDC",
      ogTitle: "CasaNayo | Maisons, Appartements, Terrains en RDC",
      description: "Parcourez toutes les propri\xE9t\xE9s disponibles en RDC sur CasaNayo : maisons, appartements, terrains, bureaux, h\xF4tels, salles de f\xEAte. Filtrez par ville et budget. Contactez directement les propri\xE9taires.",
      ogDescription: "CasaNayo \u2014 votre destination immobili\xE8re en RDC. Trouvez, comparez et contactez les propri\xE9taires de maisons, terrains et bureaux \xE0 Kinshasa et partout au Congo.",
      ogImage: "https://casanayo.com/logoCasa.png",
      ogUrl: "https://casanayo.com/properties",
      twitterCard: "summary"
    });
    useHead({
      link: [{ rel: "canonical", href: "https://casanayo.com/properties" }],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Propri\xE9t\xE9s immobili\xE8res en RDC \u2014 CasaNayo",
            description: "Liste des biens immobiliers disponibles \xE0 la vente et \xE0 la location en R\xE9publique D\xE9mocratique du Congo.",
            url: "https://casanayo.com/properties"
          })
        }
      ]
    });
    const config = useRuntimeConfig();
    const route = useRoute();
    const propertyStore = usePropertyStore();
    const { pending: isLoading } = useAsyncData("all-properties", async () => {
      await Promise.all([
        propertyStore.fetchTypes(config.public.apiBase),
        propertyStore.fetchTerrains(config.public.apiBase),
        propertyStore.fetchFuneraires(config.public.apiBase),
        propertyStore.fetchFestives(config.public.apiBase),
        propertyStore.fetchBureaux(config.public.apiBase),
        propertyStore.fetchHotels(config.public.apiBase),
        propertyStore.fetchProperties(config.public.apiBase)
      ]);
    }, { lazy: true });
    const isStoreEmpty = computed(
      () => propertyStore.properties.length === 0 && propertyStore.terrains.length === 0 && propertyStore.bureaux.length === 0 && propertyStore.hotels.length === 0 && propertyStore.festives.length === 0 && propertyStore.funeraires.length === 0
    );
    const searchInputText = ref(((_a = route.query.city) == null ? void 0 : _a.toString()) || "");
    const searchQuery = ref(((_b = route.query.city) == null ? void 0 : _b.toString()) || "");
    const applySearch = () => {
      searchQuery.value = searchInputText.value;
    };
    const selectedType = ref(((_c = route.query.type) == null ? void 0 : _c.toString()) || "all");
    const selectedTransaction = ref("all");
    const sortOrder = ref("desc");
    watch(() => route.query.type, (newType) => {
      selectedType.value = (newType == null ? void 0 : newType.toString()) || "all";
    });
    watch(() => route.query.city, (newCity) => {
      searchQuery.value = (newCity == null ? void 0 : newCity.toString()) || "";
      searchInputText.value = (newCity == null ? void 0 : newCity.toString()) || "";
    });
    const showAdvancedFilters = ref(!!(route.query.minPrice || route.query.maxPrice));
    const minPrice = ref(route.query.minPrice ? Number(route.query.minPrice) : null);
    const maxPrice = ref(route.query.maxPrice ? Number(route.query.maxPrice) : null);
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
        var _a2, _b2, _c2, _d, _e, _f;
        const p = item.property || item.terrain || item.funeraire || item.festive || item.bureau || item.hotel || {};
        const id = p.id || p.propertyId;
        let addr = item.address;
        if (item.hotel && !addr) addr = item.hotel;
        const getVal = (obj, key) => (obj == null ? void 0 : obj[key]) || "";
        let locationStr = "RDC";
        const localAddr = item.localAddress || {};
        if (((_a2 = localAddr.commune) == null ? void 0 : _a2.name) && ((_b2 = localAddr.city) == null ? void 0 : _b2.name)) {
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
        let typeName = ((_c2 = item.typeProperty) == null ? void 0 : _c2.name) === "Apparts" ? "appartement" : (_d = item.typeProperty) == null ? void 0 : _d.name;
        if (!typeName) {
          if (item.terrain) typeName = "Terrain";
          else if (item.bureau) typeName = "Bureau";
          else if (item.hotel) typeName = "H\xF4tel";
          else if (item.festive) typeName = "Salle de f\xEAte";
          else if (item.funeraire) typeName = "Espace fun\xE9raire";
          else typeName = ((_e = item.typeProperty) == null ? void 0 : _e.name) || "Propri\xE9t\xE9";
        }
        const isHotel = item._category === "hotel";
        const currencyCode = ((_f = item.devise) == null ? void 0 : _f.code) || "USD";
        const priceVal = isHotel ? 0 : p.price || 0;
        const priceDisplay = isHotel ? "\u2014" : formatCurrency(priceVal, currencyCode);
        const displayArea = p.surface && p.surface > 0 ? `${p.surface}m\xB2` : p.livingRoom ? `${p.livingRoom} salon(s)` : "";
        return {
          id,
          title: p.title || typeName,
          location: locationStr,
          price: priceDisplay,
          priceValue: priceVal,
          hidePrice: isHotel,
          description: (p.description || "").trim(),
          currencyCode,
          currencyLabel: getCurrencyLabel(currencyCode),
          type: typeName,
          image: img,
          publisherImage: item.image || "",
          beds: p.bedrooms || 0,
          baths: p.bathroom || 0,
          area: displayArea,
          transaction: isHotel ? "h\xE9bergement" : p.transactionType || "vente",
          category: item._category,
          date: p.createdAt ? new Date(p.createdAt) : /* @__PURE__ */ new Date(),
          listingStatus: getPublicListingStatus(p, p.transactionType)
        };
      }).sort((a, b) => {
        if (a.category === "property" && b.category !== "property") return -1;
        if (a.category !== "property" && b.category === "property") return 1;
        if (sortOrder.value === "asc") {
          return a.date.getTime() - b.date.getTime();
        } else {
          return b.date.getTime() - a.date.getTime();
        }
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
            var _a2, _b2, _c2;
            return ((_a2 = p.title) == null ? void 0 : _a2.toLowerCase().includes(q)) || ((_b2 = p.location) == null ? void 0 : _b2.toLowerCase().includes(q)) || ((_c2 = p.type) == null ? void 0 : _c2.toLowerCase().includes(q));
          }
        );
      }
      if (selectedType.value !== "all") {
        res = res.filter((p) => p.type === selectedType.value);
      }
      if (selectedTransaction.value !== "all") {
        res = res.filter((p) => {
          if (selectedTransaction.value === "location") return isLocationTransactionType(p.transaction);
          return !isLocationTransactionType(p.transaction);
        });
      }
      if (minPrice.value !== null) {
        res = res.filter((p) => p.hidePrice || p.priceValue >= minPrice.value);
      }
      if (maxPrice.value !== null) {
        res = res.filter((p) => p.hidePrice || p.priceValue <= maxPrice.value);
      }
      if (showAdvancedFilters.value) {
        if (selectedCurrency.value !== "all") {
          res = res.filter((p) => p.hidePrice || p.currencyCode === selectedCurrency.value);
        }
        if (roomCount.value !== "all") {
          if (roomCount.value === "4+") {
            res = res.filter((p) => p.hidePrice || p.beds >= 4);
          } else {
            res = res.filter((p) => p.hidePrice || p.beds === Number(roomCount.value));
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
    watch([searchQuery, selectedType, selectedTransaction, minPrice, maxPrice, selectedCurrency, roomCount, sortOrder], () => {
      currentPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden bg-slate-800"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Properties" loading="eager" fetchpriority="high" decoding="async"><div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div></div><div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 md:py-14 text-center"><div class="max-w-2xl mx-auto mb-6"><h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"> D\xE9couvrez votre <span class="text-primary"> prochain chez-vous</span></h1><p class="mt-3 text-slate-300/80 text-sm md:text-base"> Maisons, appartements, terrains et h\xF4tels \u2014 tout le march\xE9 immobilier congolais. </p></div><div class="max-w-2xl mx-auto"><div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">`);
      _push(ssrRenderComponent(unref(Search), { class: "h-5 w-5 text-slate-400 ml-4 shrink-0" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchInputText))} type="text" placeholder="Gombe, Matadi, Kinshasa..." class="flex-1 h-12 bg-transparent border-none focus:ring-0 text-slate-800 px-3 text-sm font-medium placeholder:text-slate-400">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "h-10 rounded-xl m-1 px-5 font-bold text-sm shrink-0",
        onClick: applySearch
      }, {
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
      _push(`</div></div></div></section><div class="container mx-auto px-4 relative z-20 mt-8 mb-12"><div class="max-w-5xl mx-auto bg-card rounded-2xl shadow-xl border border-border p-6"><div class="grid grid-cols-1 md:grid-cols-12 gap-4"><div class="md:col-span-3 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Home), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), "all") : ssrLooseEqual(unref(selectedType), "all")) ? " selected" : ""}>Tous les types</option><!--[-->`);
      ssrRenderList(unref(propertyTypes), (t) => {
        _push(`<option${ssrRenderAttr("value", t)} style="${ssrRenderStyle(t !== "all" ? null : { display: "none" })}"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedType)) ? ssrLooseContain(unref(selectedType), t) : ssrLooseEqual(unref(selectedType), t)) ? " selected" : ""}>${ssrInterpolate(t)}</option>`);
      });
      _push(`<!--]--></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-3 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "all") : ssrLooseEqual(unref(selectedTransaction), "all")) ? " selected" : ""}>Vente &amp; Location</option><option value="vente"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "vente") : ssrLooseEqual(unref(selectedTransaction), "vente")) ? " selected" : ""}>Vente</option><option value="location"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedTransaction)) ? ssrLooseContain(unref(selectedTransaction), "location") : ssrLooseEqual(unref(selectedTransaction), "location")) ? " selected" : ""}>Location</option></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-3 relative group"><div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(SlidersHorizontal), { class: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }, null, _parent));
      _push(`</div><select class="w-full h-12 pl-12 pr-8 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer appearance-none"><option value="desc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortOrder)) ? ssrLooseContain(unref(sortOrder), "desc") : ssrLooseEqual(unref(sortOrder), "desc")) ? " selected" : ""}>Plus r\xE9cents</option><option value="asc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortOrder)) ? ssrLooseContain(unref(sortOrder), "asc") : ssrLooseEqual(unref(sortOrder), "asc")) ? " selected" : ""}>Plus anciens</option></select><div class="absolute inset-y-0 right-4 flex items-center pointer-events-none">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 text-muted-foreground opacity-50" }, null, _parent));
      _push(`</div></div><div class="md:col-span-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: toggleAdvanced,
        variant: unref(showAdvancedFilters) ? "default" : "outline",
        class: "w-full h-12 rounded-xl flex items-center justify-between"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="flex items-center gap-2"${_scopeId}> Filtres Avanc\xE9s </span>`);
            _push2(ssrRenderComponent(unref(ChevronDown), {
              class: ["h-4 w-4 transition-transform", { "rotate-180": unref(showAdvancedFilters) }]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "flex items-center gap-2" }, " Filtres Avanc\xE9s "),
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
      _push(`</div></div><section id="properties-grid" class="pb-20 bg-muted/30 pt-4"><div class="container mx-auto px-4">`);
      if (unref(isLoading) && unref(isStoreEmpty)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10"><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(ssrRenderComponent(PropertyCardShimmer, { key: i }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(filteredProperties).length === 0) {
        _push(`<div class="text-center py-20"><div class="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">`);
        _push(ssrRenderComponent(unref(Search), { class: "h-10 w-10 text-muted-foreground" }, null, _parent));
        _push(`</div><h3 class="text-2xl font-bold mb-2">Aucune propri\xE9t\xE9 trouv\xE9e</h3><p class="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(unref(paginatedProperties), (property) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: property.id,
            to: `/properties/${unref(encodeId)(property.id)}`,
            class: "group bg-card rounded-3xl overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-56 overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", property.image)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"${_scopeId}><div class="absolute top-3 left-3"${_scopeId}><span class="px-2.5 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider"${_scopeId}>${ssrInterpolate(property.type)}</span></div><div class="absolute top-3 right-3 flex flex-col items-end gap-1.5"${_scopeId}>`);
                if (property.category === "hotel") {
                  _push2(`<span class="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider bg-slate-700"${_scopeId}> H\xE9bergement </span>`);
                } else {
                  _push2(`<span class="${ssrRenderClass([
                    "px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider",
                    unref(isLocationTransactionType)(property.transaction) ? "bg-blue-600" : "bg-emerald-600"
                  ])}"${_scopeId}>${ssrInterpolate(unref(getPublicTransactionBadgeLabel)(property.transaction))}</span>`);
                }
                _push2(`<span class="${ssrRenderClass([property.listingStatus.badgeClass, "px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-wide"])}"${_scopeId}>${ssrInterpolate(property.listingStatus.label)}</span></div>`);
                if (property.publisherImage) {
                  _push2(`<div class="absolute bottom-3 right-3 rounded-full border-2 border-white overflow-hidden h-10 w-10 bg-white/10 backdrop-blur-sm flex items-center justify-center"${_scopeId}><img${ssrRenderAttr("src", property.publisherImage)}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="p-5 flex-1 flex flex-col"${_scopeId}><div class="mb-2"${_scopeId}><div class="flex items-center text-muted-foreground text-xs mb-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3 mr-1 text-primary" }, null, _parent2, _scopeId));
                _push2(`<span class="line-clamp-1"${_scopeId}>${ssrInterpolate(property.location)}</span></div><h3 class="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors"${_scopeId}>${ssrInterpolate(property.title)}</h3>`);
                if (property.hidePrice && property.description) {
                  _push2(`<p class="text-xs text-muted-foreground line-clamp-2 mt-1"${_scopeId}>${ssrInterpolate(property.description)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="grid grid-cols-3 gap-2 mb-4 pt-3 border-t border-border/50"${_scopeId}>`);
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
                _push2(`</div><div class="mt-auto flex items-center justify-between"${_scopeId}><div class="text-xl font-black text-primary"${_scopeId}>`);
                if (property.hidePrice) {
                  _push2(`<span class="text-sm font-semibold text-muted-foreground"${_scopeId}>Tarifs par chambre</span>`);
                } else {
                  _push2(`<!--[-->${ssrInterpolate(property.price)} <div class="text-xs text-muted-foreground font-normal"${_scopeId}>${ssrInterpolate(property.currencyLabel)}</div><!--]-->`);
                }
                _push2(`</div><div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"${_scopeId}>`);
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
                    createVNode("div", { class: "absolute top-3 right-3 flex flex-col items-end gap-1.5" }, [
                      property.category === "hotel" ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider bg-slate-700"
                      }, " H\xE9bergement ")) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: [
                          "px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider",
                          unref(isLocationTransactionType)(property.transaction) ? "bg-blue-600" : "bg-emerald-600"
                        ]
                      }, toDisplayString(unref(getPublicTransactionBadgeLabel)(property.transaction)), 3)),
                      createVNode("span", {
                        class: ["px-2.5 py-1 rounded-full text-[10px] font-black shadow-lg uppercase tracking-wide", property.listingStatus.badgeClass]
                      }, toDisplayString(property.listingStatus.label), 3)
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
                      createVNode("h3", { class: "text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors" }, toDisplayString(property.title), 1),
                      property.hidePrice && property.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-xs text-muted-foreground line-clamp-2 mt-1"
                      }, toDisplayString(property.description), 1)) : createCommentVNode("", true)
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
                        property.hidePrice ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-sm font-semibold text-muted-foreground"
                        }, "Tarifs par chambre")) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createTextVNode(toDisplayString(property.price) + " ", 1),
                          createVNode("div", { class: "text-xs text-muted-foreground font-normal" }, toDisplayString(property.currencyLabel), 1)
                        ], 64))
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
//# sourceMappingURL=index-CSvVPi5p.mjs.map
