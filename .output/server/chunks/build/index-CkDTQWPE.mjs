import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { Search, Filter, MapPin, Check, X, Loader2, Power, Tag, Wrench, ChevronDown, Calendar } from 'lucide-vue-next';
import { _ as _sfc_main$6 } from './ListPagination-BYvyA4ig.mjs';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$5 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$3 } from './Badge-CZaU8sYj.mjs';
import { _ as _sfc_main$4 } from './Skeleton-BgOY-K4r.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { f as usePropertyStore, g as useServiceStore, l as useAuthStore, j as joinApi, A as ApiEndpoints, v as useCookie, c as useRuntimeConfig } from './server.mjs';
import { u as unwrapArrayPayload, r as reloadNuxtApp } from './apiListResponse-obG_RNq0.mjs';
import { f as formatListingPlace } from './propertyNormalizer-DGbw4ATn.mjs';
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
import './transactionDisplay-GAAD372w.mjs';

const itemsPerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const activeTab = ref("properties");
    watch(() => route.query.tab, (tab) => {
      if (tab === "services" || tab === "properties" || tab === "hotels") {
        activeTab.value = tab;
      }
    });
    const propertyStore = usePropertyStore();
    const serviceStore = useServiceStore();
    const authStore = useAuthStore();
    const queryClient = useQueryClient();
    const publicationActionKey = ref(null);
    const config = useRuntimeConfig();
    const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices } = useQuery({
      queryKey: ["prestations"],
      queryFn: async () => {
        const res = await fetch(joinApi(config.public.apiBase, ApiEndpoints.publicPrestations));
        return res.json();
      }
    });
    serviceStore.fetchCategories(config.public.apiBase);
    const currentFilter = ref("all");
    const searchQuery = ref("");
    const currentPage = ref(1);
    function moneyLabel(amount, code) {
      const raw = String(code != null ? code : "").toUpperCase();
      const symbol = code === 1 || raw === "1" || raw === "CDF" || raw === "FC" ? "FC" : "$";
      const text = typeof amount === "number" ? amount.toLocaleString("fr-FR") : String(amount);
      return `${text} ${symbol}`;
    }
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
    const serviceSortOrder = ref("newest");
    function personName(value) {
      if (!value || typeof value !== "object") return "";
      const o = value;
      const full = typeof o.fullName === "string" ? o.fullName.trim() : "";
      if (full) return full;
      const parts = [o.firstName, o.lastName].filter((part) => typeof part === "string" && part.trim().length > 0);
      if (parts.length) return parts.map((part) => part.trim()).join(" ");
      return typeof o.username === "string" ? o.username.replace(/@@/g, "").trim() : "";
    }
    function publicationAuthor(item, owners) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      const posted = typeof (item == null ? void 0 : item.postBy) === "string" ? item.postBy.replace(/@@/g, "").trim() : "";
      if (posted) return posted;
      const named = personName(item == null ? void 0 : item.proprietaire) || personName(item == null ? void 0 : item.member) || personName(item == null ? void 0 : item.user) || personName((_a = item == null ? void 0 : item.hotel) == null ? void 0 : _a.user);
      if (named) return named;
      const userId = (_m = (_l = (_j = (_h = (_f = (_d = (_b = item == null ? void 0 : item.hotel) == null ? void 0 : _b.userId) != null ? _d : (_c = item == null ? void 0 : item.property) == null ? void 0 : _c.userId) != null ? _f : (_e = item == null ? void 0 : item.terrain) == null ? void 0 : _e.userId) != null ? _h : (_g = item == null ? void 0 : item.bureau) == null ? void 0 : _g.userId) != null ? _j : (_i = item == null ? void 0 : item.festive) == null ? void 0 : _i.userId) != null ? _l : (_k = item == null ? void 0 : item.funeraire) == null ? void 0 : _k.userId) != null ? _m : item == null ? void 0 : item.userId;
      const fromAccount = userId != null ? owners == null ? void 0 : owners[String(userId)] : "";
      if (fromAccount) return fromAccount;
      const selfId = (_n = authStore.user) == null ? void 0 : _n.userId;
      if (userId != null && selfId != null && String(userId) === String(selfId)) {
        return ((_p = (_o = authStore.profile) == null ? void 0 : _o.fullName) == null ? void 0 : _p.trim()) || ((_r = (_q = authStore.user) == null ? void 0 : _q.username) == null ? void 0 : _r.replace(/@@/g, "").trim()) || "Inconnu";
      }
      return "Inconnu";
    }
    const { data: allPropertiesData, isLoading, isError } = useQuery({
      queryKey: ["all-dashboard-properties"],
      queryFn: async () => {
        var _a;
        const apiBase = config.public.apiBase;
        const token = useCookie("auth_token").value;
        const h = {};
        if (token) h.Authorization = `Bearer ${token}`;
        const isAdmin = authStore.isAdmin;
        const isGerant = authStore.isGerant;
        const ownerUserId = (_a = authStore.user) == null ? void 0 : _a.userId;
        const propsUrl = joinApi(apiBase, isAdmin ? ApiEndpoints.protectedProperties : ApiEndpoints.properties);
        const terrainsUrl = joinApi(
          apiBase,
          isAdmin ? ApiEndpoints.protectedPropertyTerrains : ApiEndpoints.propertyTerrains
        );
        const bureauxUrl = joinApi(
          apiBase,
          isAdmin ? ApiEndpoints.protectedPropertyBureaux : ApiEndpoints.propertyBureaux
        );
        const festivesUrl = joinApi(
          apiBase,
          isAdmin ? ApiEndpoints.protectedPropertyFestives : ApiEndpoints.propertyFestives
        );
        const funerairesUrl = joinApi(
          apiBase,
          isAdmin ? ApiEndpoints.protectedPropertyFuneraires : ApiEndpoints.propertyFuneraires
        );
        const hotelsUrl = joinApi(
          apiBase,
          isAdmin ? ApiEndpoints.protectedPropertyHotels : isGerant && ownerUserId != null ? `${ApiEndpoints.propertyHotelsByOwner}${ownerUserId}` : ApiEndpoints.propertyHotels
        );
        async function readJson(url, headers) {
          try {
            const res = await fetch(url, headers ? { headers } : void 0);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        }
        const [props, terrains, bureaux, hotels, festives, funeraires] = await Promise.all([
          readJson(propsUrl, isAdmin ? h : void 0),
          readJson(terrainsUrl, isAdmin ? h : void 0),
          readJson(bureauxUrl, isAdmin ? h : void 0),
          readJson(hotelsUrl, h),
          readJson(festivesUrl, isAdmin ? h : void 0),
          readJson(funerairesUrl, isAdmin ? h : void 0)
        ]);
        let hotelRows = hotels == null ? null : unwrapArrayPayload(hotels);
        if (hotelRows == null) {
          const publicHotels = await readJson(joinApi(apiBase, ApiEndpoints.propertyHotelsPublic));
          hotelRows = unwrapArrayPayload(publicHotels);
        }
        const owners = {};
        if (token && isAdmin) {
          const [usersRaw, membersRaw] = await Promise.all([
            readJson(joinApi(apiBase, ApiEndpoints.allUsers), h),
            readJson(joinApi(apiBase, ApiEndpoints.protectedMembers), h)
          ]);
          for (const user of unwrapArrayPayload(usersRaw)) {
            const id = user == null ? void 0 : user.userId;
            const name = typeof (user == null ? void 0 : user.username) === "string" ? user.username.replace(/@@/g, "").trim() : "";
            if (id != null && name) owners[String(id)] = name;
          }
          for (const member of unwrapArrayPayload(membersRaw)) {
            const id = member == null ? void 0 : member.userId;
            const name = personName(member);
            if (id != null && name) owners[String(id)] = name;
          }
        }
        return {
          properties: (props == null ? void 0 : props.properties) || [],
          terrains: (terrains == null ? void 0 : terrains.terrain) || [],
          bureaux: unwrapArrayPayload(bureaux),
          hotels: hotelRows,
          festives: (festives == null ? void 0 : festives.festives) || [],
          funeraires: (funeraires == null ? void 0 : funeraires.funeraires) || [],
          owners
        };
      }
    });
    watch(allPropertiesData, (newData) => {
      if (newData) {
        propertyStore.properties = newData.properties;
        propertyStore.terrains = newData.terrains;
        propertyStore.bureaux = newData.bureaux;
        propertyStore.hotels = newData.hotels;
        propertyStore.festives = newData.festives;
        propertyStore.funeraires = newData.funeraires;
      }
    }, { immediate: true });
    const allPublications = computed(() => {
      if (!allPropertiesData.value) return [];
      const allRaw = [
        ...allPropertiesData.value.properties.map((i) => ({ ...i, _category: "property" })),
        ...allPropertiesData.value.terrains.map((i) => ({ ...i, _category: "terrain", typeProperty: { name: "Terrain" } })),
        ...allPropertiesData.value.bureaux.map((i) => ({ ...i, _category: "bureau", typeProperty: { name: "Bureau" } })),
        ...allPropertiesData.value.hotels.map((i) => ({ ...i, _category: "hotel", typeProperty: { name: "H\xF4tel" } })),
        ...allPropertiesData.value.festives.map((i) => ({ ...i, _category: "festive", typeProperty: { name: "Salle de f\xEAte" } })),
        ...allPropertiesData.value.funeraires.map((i) => ({ ...i, _category: "funeraire", typeProperty: { name: "Espace fun\xE9raire" } }))
      ];
      return allRaw.map((item) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const p = item.property || item.terrain || item.funeraire || item.festive || item.bureau || item.hotel || {};
        const addr = item.address || {};
        let img = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        if ((_c = (_b = (_a = item.images) == null ? void 0 : _a.main) == null ? void 0 : _b[0]) == null ? void 0 : _c.publicPath) {
          img = item.images.main[0].publicPath;
        } else if ((_d = item.hotel) == null ? void 0 : _d.image) {
          img = item.hotel.image;
        } else if (item.images && Array.isArray(item.images) && ((_e = item.images[0]) == null ? void 0 : _e.path)) {
          img = item.images[0].path;
        }
        const isHotel = item._category === "hotel" || !!item.hotel;
        const rooms = hotelRooms(item);
        const roomOffer = cheapestRoomOffer(rooms);
        const sold = !isHotel && !!p.sold;
        const explicitlyDisabled = isHotel ? p.available === false : p.available === false || p.active === false;
        const status = sold ? "Sold" : explicitlyDisabled ? "Inactive" : "Active";
        const priceVal = (_f = p.price) != null ? _f : p.minPrice;
        const hasOwnPrice = !isHotel && priceVal != null && priceVal !== "";
        const priceDisplay = typeof priceVal === "number" ? priceVal.toLocaleString("fr-FR") : priceVal;
        let locationStr = "RDC";
        if (item._category === "hotel" || item.hotel) {
          locationStr = formatListingPlace(p) || formatListingPlace(addr) || "RDC";
        } else if (addr.communeValue && addr.cityValue) {
          locationStr = `${addr.communeValue}, ${addr.cityValue}`;
        } else if (p.communeValue && p.cityValue) {
          locationStr = `${p.communeValue}, ${p.cityValue}`;
        }
        const baseType = ((_g = item.typeProperty) == null ? void 0 : _g.name) || (item._category === "terrain" ? "Terrain" : item._category === "hotel" ? "H\xF4tel" : "Propri\xE9t\xE9");
        const typeName = baseType === "Apparts" ? "appartement" : baseType;
        return {
          id: p.propertyId || p.id,
          title: p.title || typeName,
          type: typeName,
          location: locationStr,
          price: isHotel ? (roomOffer == null ? void 0 : roomOffer.label) || "Tarif par chambre" : hasOwnPrice ? moneyLabel(priceDisplay, ((_h = item.devise) == null ? void 0 : _h.code) || "USD") : "Prix sur demande",
          hidePrice: isHotel && !roomOffer,
          rooms: rooms.length,
          image: img,
          status,
          author: publicationAuthor(item, (_i = allPropertiesData.value) == null ? void 0 : _i.owners),
          description: p.description || "Aucune description fournie.",
          date: new Date(p.createdAt || p.dateCreated).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
          rawDate: new Date(p.createdAt || p.dateCreated),
          transactionType: p.transactionType || "vente",
          deviseCode: (_j = item.devise) == null ? void 0 : _j.code,
          rawType: typeName,
          rawAddress: `${addr.address || ""} ${addr.communeValue || ""} ${addr.cityValue || ""}`,
          category: item._category,
          sold,
          raw: item
        };
      });
    });
    function hotelRooms(item) {
      const structure = Array.isArray(item.structure) ? item.structure : [];
      return structure.map((entry) => {
        if (!entry || typeof entry !== "object") return null;
        const row = entry;
        return row.chambre && typeof row.chambre === "object" ? row.chambre : entry;
      }).filter((room) => !!room && (room.id != null || room.price != null || room.title != null));
    }
    function cheapestRoomOffer(rooms) {
      const priced = rooms.map((room) => ({
        price: Number(room.price),
        deviseId: Number(room.deviseId)
      })).filter((room) => Number.isFinite(room.price) && room.price > 0);
      if (!priced.length) return null;
      const min = priced.reduce((best, room) => room.price < best.price ? room : best);
      return { label: `\xC0 partir de ${moneyLabel(min.price, min.deviseId)}` };
    }
    function getPubEntity(raw) {
      return raw.property || raw.terrain || raw.bureau || raw.festive || raw.funeraire || raw.hotel || {};
    }
    function isPubAvailable(pub) {
      const p = getPubEntity(pub.raw);
      if (typeof p.status === "boolean") return p.status === false;
      if (p.available === false) return false;
      if (p.active === false) return false;
      return true;
    }
    function isPubSold(pub) {
      if (pub.sold != null) return pub.sold;
      return !!getPubEntity(pub.raw).sold;
    }
    async function togglePublicationEnable(pub) {
      const key = `${pub.category}-${pub.id}-en`;
      publicationActionKey.value = key;
      const hidden = isPubAvailable(pub);
      const res = await propertyStore.putPublicationEnable(
        config.public.apiBase,
        authStore.token,
        pub.category,
        pub.id,
        hidden
      );
      publicationActionKey.value = null;
      if (res.success) {
        toast.success(hidden ? "Annonce retir\xE9e du site" : "Annonce visible sur le site");
        await queryClient.invalidateQueries({ queryKey: ["all-dashboard-properties"] });
        await reloadNuxtApp({});
      } else {
        toast.error(res.message || "Mise \xE0 jour impossible");
      }
    }
    function isHotelListed(pub) {
      const hotel = getPubEntity(pub.raw);
      if (hotel.available === false || hotel.sold === true) return false;
      return true;
    }
    async function togglePublicationSold(pub) {
      const isHotel = pub.category === "hotel";
      const currentlySold = isHotel ? !isHotelListed(pub) : isPubSold(pub);
      if (isHotel) {
        const ok = confirm(currentlySold ? "Remettre cet h\xF4tel en ligne ?" : "Rendre cet h\xF4tel indisponible sur le site ?");
        if (!ok) return;
      } else if (!currentlySold) {
        const ok = confirm("Marquer ce bien comme vendu ? Il sera trait\xE9 comme indisponible.");
        if (!ok) return;
      } else {
        const ok = confirm("Retirer le statut \xAB vendu \xBB et rendre le bien \xE0 nouveau disponible ?");
        if (!ok) return;
      }
      const key = `${pub.category}-${pub.id}-sold`;
      publicationActionKey.value = key;
      const nextSold = !currentlySold;
      const res = await propertyStore.putPublicationSold(
        config.public.apiBase,
        authStore.token,
        pub.category,
        pub.id,
        nextSold
      );
      publicationActionKey.value = null;
      if (res.success) {
        toast.success(
          isHotel ? nextSold ? "H\xF4tel retir\xE9 du site" : "H\xF4tel remis en ligne" : nextSold ? "Bien marqu\xE9 comme vendu" : "Statut vendu retir\xE9"
        );
        await queryClient.invalidateQueries({ queryKey: ["all-dashboard-properties"] });
        await reloadNuxtApp({});
      } else {
        toast.error(res.message || "Mise \xE0 jour impossible");
      }
    }
    function isPublicationActionLoading(pub, suffix) {
      return publicationActionKey.value === `${pub.category}-${pub.id}-${suffix}`;
    }
    const allServices = computed(() => {
      var _a;
      if (!((_a = servicesData.value) == null ? void 0 : _a.prestations)) return [];
      return servicesData.value.prestations.map((item) => {
        var _a2;
        const p = item.prestation;
        const img = p.profile || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";
        const hasPrice = p.minPrice != null && p.minPrice !== "";
        const price = typeof p.minPrice === "number" ? p.minPrice.toLocaleString("fr-FR") : p.minPrice;
        return {
          id: p.id,
          title: p.title || "Sans titre",
          location: formatListingPlace(p) || "RDC",
          minPriceFormatted: hasPrice ? moneyLabel(price, p.deviseId) : "Tarif sur demande",
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
      list = [...list].sort((a, b) => {
        if (serviceSortOrder.value === "newest") {
          return b.rawDate.getTime() - a.rawDate.getTime();
        } else {
          return a.rawDate.getTime() - b.rawDate.getTime();
        }
      });
      return list;
    });
    const serviceCurrentPage = ref(1);
    computed(() => Math.ceil(filteredServices.value.length / itemsPerPage));
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
        if (currentFilter.value === "active") {
          pubs = pubs.filter((p) => p.status === "Active" || p.status === "Inactive");
        } else {
          const statusMap = {
            pending: "Pending",
            rejected: "Rejected",
            sold: "Sold",
            inactive: "Inactive"
          };
          const mapped = statusMap[currentFilter.value];
          if (mapped) pubs = pubs.filter((p) => p.status === mapped);
        }
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
    const filteredPropertyPublications = computed(
      () => filteredPublications.value.filter((p) => p.category !== "hotel")
    );
    computed(() => Math.ceil(filteredPropertyPublications.value.length / itemsPerPage));
    const paginatedPublications = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredPropertyPublications.value.slice(start, end);
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
      { label: "D\xE9sactiv\xE9es", value: "inactive" },
      { label: "Vendus", value: "sold" },
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
    const filteredHotelPublications = computed(() => {
      let pubs = allPublications.value.filter((p) => p.category === "hotel");
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        pubs = pubs.filter(
          (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
        );
      }
      return pubs;
    });
    computed(() => Math.ceil(filteredHotelPublications.value.length / itemsPerPage));
    const hotelCurrentPage = ref(1);
    const paginatedHotels = computed(() => {
      const start = (hotelCurrentPage.value - 1) * itemsPerPage;
      return filteredHotelPublications.value.slice(start, start + itemsPerPage);
    });
    watch([activeTab, filteredHotelPublications], () => {
      hotelCurrentPage.value = 1;
    });
    const goToHotelDetail = (id) => {
      router.push(`/dashboard/publications/hotels/${id}`);
    };
    function switchPublicationTab(tab) {
      activeTab.value = tab;
      router.push({ path: "/dashboard/publications", query: { tab } });
    }
    const serviceActionId = ref(null);
    async function toggleServiceActive(srv) {
      const next = !srv.raw.prestation.active;
      serviceActionId.value = srv.id;
      try {
        const token = authStore.token || useCookie("auth_token").value;
        await $fetch(joinApi(config.public.apiBase, `${ApiEndpoints.updatePrestation}${srv.id}`), {
          method: "PATCH",
          body: { active: next },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        toast.success(next ? "Service activ\xE9" : "Service d\xE9sactiv\xE9");
        await queryClient.invalidateQueries({ queryKey: ["prestations"] });
      } catch {
        toast.error("Mise \xE0 jour du service impossible");
      } finally {
        serviceActionId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 p-8 max-w-7xl mx-auto" }, _attrs))}><div class="flex flex-wrap gap-2 mb-6">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: activeTab.value === "properties" ? "default" : "outline",
        onClick: ($event) => switchPublicationTab("properties")
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
        onClick: ($event) => switchPublicationTab("services")
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
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: activeTab.value === "hotels" ? "default" : "outline",
        onClick: ($event) => switchPublicationTab("hotels")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`H\xF4tels`);
          } else {
            return [
              createTextVNode("H\xF4tels")
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
      } else if (activeTab.value === "services") {
        _push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8"><div><h2 class="text-4xl font-black tracking-tight text-foreground">Mes Services</h2><p class="text-lg text-muted-foreground mt-2">G\xE9rez vos prestations et suivez leur performance.</p></div></div>`);
      } else {
        _push(`<!---->`);
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
        _push(`</div></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Transaction</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "") : ssrLooseEqual(transactionTypeFilter.value, "")) ? " selected" : ""}>Tout type</option><option value="location"${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "location") : ssrLooseEqual(transactionTypeFilter.value, "location")) ? " selected" : ""}>Location</option><option value="vente"${ssrIncludeBooleanAttr(Array.isArray(transactionTypeFilter.value) ? ssrLooseContain(transactionTypeFilter.value, "vente") : ssrLooseEqual(transactionTypeFilter.value, "vente")) ? " selected" : ""}>Vente</option></select></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type de Bien</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "") : ssrLooseEqual(propertyTypeFilter.value, "")) ? " selected" : ""}>Tous les biens</option><option value="Maisons"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Maisons") : ssrLooseEqual(propertyTypeFilter.value, "Maisons")) ? " selected" : ""}>Maisons</option><option value="Apparts"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Apparts") : ssrLooseEqual(propertyTypeFilter.value, "Apparts")) ? " selected" : ""}>appartement</option><option value="Studio"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Studio") : ssrLooseEqual(propertyTypeFilter.value, "Studio")) ? " selected" : ""}>Studio</option><option value="Terrain"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Terrain") : ssrLooseEqual(propertyTypeFilter.value, "Terrain")) ? " selected" : ""}>Terrains</option><option value="Bureau"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Bureau") : ssrLooseEqual(propertyTypeFilter.value, "Bureau")) ? " selected" : ""}>Bureaux</option><option value="H\xF4tel"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "H\xF4tel") : ssrLooseEqual(propertyTypeFilter.value, "H\xF4tel")) ? " selected" : ""}>H\xF4tels</option><option value="Salle de f\xEAte"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Salle de f\xEAte") : ssrLooseEqual(propertyTypeFilter.value, "Salle de f\xEAte")) ? " selected" : ""}>Salles de f\xEAte</option><option value="Espace fun\xE9raire"${ssrIncludeBooleanAttr(Array.isArray(propertyTypeFilter.value) ? ssrLooseContain(propertyTypeFilter.value, "Espace fun\xE9raire") : ssrLooseEqual(propertyTypeFilter.value, "Espace fun\xE9raire")) ? " selected" : ""}>Espaces fun\xE9raires</option></select></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Devise</label><select class="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "") : ssrLooseEqual(currencyFilter.value, "")) ? " selected" : ""}>Toute devise</option><option value="USD"${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "USD") : ssrLooseEqual(currencyFilter.value, "USD")) ? " selected" : ""}>$</option><option value="CDF"${ssrIncludeBooleanAttr(Array.isArray(currencyFilter.value) ? ssrLooseContain(currencyFilter.value, "CDF") : ssrLooseEqual(currencyFilter.value, "CDF")) ? " selected" : ""}>FC</option></select></div><div class="md:col-span-2 lg:col-span-4 flex justify-end">`);
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
        } else if (filteredPropertyPublications.value.length === 0) {
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
                  _push2(`</div><div class="absolute top-2 right-2 flex flex-col gap-1 items-end"${_scopeId}>`);
                  if (pub.status === "Sold") {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "secondary",
                      class: "bg-[#1565C0] text-white hover:bg-[#1565C0] border-0 shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`${ssrInterpolate(pub.transactionType === "location" || pub.transactionType === "louer" ? "D\xE9j\xE0 pris" : "Vendu")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(pub.transactionType === "location" || pub.transactionType === "louer" ? "D\xE9j\xE0 pris" : "Vendu"), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else if (pub.status === "Inactive") {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "outline",
                      class: "border-[#1976D2] bg-white/95 text-[#1565C0] font-semibold shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`D\xE9sactiv\xE9e`);
                        } else {
                          return [
                            createTextVNode("D\xE9sactiv\xE9e")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else if (pub.status === "Active") {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "secondary",
                      class: "bg-[#1976D2] text-white hover:bg-[#1976D2] border-0 shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`En ligne`);
                        } else {
                          return [
                            createTextVNode("En ligne")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "outline",
                      class: "border-[#1976D2]/50 bg-white/95 text-[#1976D2] font-medium shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`En attente`);
                        } else {
                          return [
                            createTextVNode("En attente")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  }
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
                            class: "h-8 w-full bg-[#1976D2] hover:bg-[#1565C0] text-white z-10",
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
                            variant: "outline",
                            class: "h-8 w-full border-[#1976D2] text-[#1565C0] z-10",
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
                        _push3(`<div class="mt-3 pt-3 border-t border-border/60 space-y-2"${_scopeId2}><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"${_scopeId2}>Admin API</p><div class="flex flex-wrap gap-2"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$1), {
                          size: "sm",
                          variant: "outline",
                          class: "h-8 text-xs font-semibold",
                          disabled: pub.category === "hotel",
                          onClick: ($event) => togglePublicationEnable(pub)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (isPublicationActionLoading(pub, "en")) {
                                _push4(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0" }, null, _parent4, _scopeId3));
                              } else {
                                _push4(ssrRenderComponent(unref(Power), { class: "h-3.5 w-3.5 mr-1 shrink-0" }, null, _parent4, _scopeId3));
                              }
                              _push4(` ${ssrInterpolate(isPubAvailable(pub) ? "D\xE9sactiver" : "Activer")}`);
                            } else {
                              return [
                                isPublicationActionLoading(pub, "en") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isPubAvailable(pub) ? "D\xE9sactiver" : "Activer"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(unref(_sfc_main$1), {
                          size: "sm",
                          variant: isPubSold(pub) ? "secondary" : "default",
                          class: "h-8 text-xs font-semibold",
                          disabled: pub.category === "hotel",
                          onClick: ($event) => togglePublicationSold(pub)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (isPublicationActionLoading(pub, "sold")) {
                                _push4(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0" }, null, _parent4, _scopeId3));
                              } else {
                                _push4(ssrRenderComponent(unref(Tag), { class: "h-3.5 w-3.5 mr-1 shrink-0" }, null, _parent4, _scopeId3));
                              }
                              _push4(` ${ssrInterpolate(isPubSold(pub) ? "Non vendu" : "Vendu")}`);
                            } else {
                              return [
                                isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Tag), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isPubSold(pub) ? "Non vendu" : "Vendu"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                        if (pub.category === "hotel") {
                          _push3(`<p class="text-[10px] text-muted-foreground"${_scopeId2}> Pas d\u2019endpoint enable/sold \xAB h\xF4tel \xBB sur cette API. </p>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</div>`);
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
                              class: "h-8 w-full bg-[#1976D2] hover:bg-[#1565C0] text-white z-10",
                              onClick: withModifiers(($event) => appovePub(pub.id), ["stop", "prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Check), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(unref(_sfc_main$1), {
                              size: "icon",
                              variant: "outline",
                              class: "h-8 w-full border-[#1976D2] text-[#1565C0] z-10",
                              onClick: withModifiers(($event) => rejectPub(pub.id), ["stop", "prevent"])
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(X), { class: "h-4 w-4" })
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])) : createCommentVNode("", true),
                          createVNode("div", {
                            class: "mt-3 pt-3 border-t border-border/60 space-y-2",
                            onClick: withModifiers(() => {
                            }, ["stop", "prevent"])
                          }, [
                            createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground" }, "Admin API"),
                            createVNode("div", { class: "flex flex-wrap gap-2" }, [
                              createVNode(unref(_sfc_main$1), {
                                size: "sm",
                                variant: "outline",
                                class: "h-8 text-xs font-semibold",
                                disabled: pub.category === "hotel",
                                onClick: ($event) => togglePublicationEnable(pub)
                              }, {
                                default: withCtx(() => [
                                  isPublicationActionLoading(pub, "en") ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                  })) : (openBlock(), createBlock(unref(Power), {
                                    key: 1,
                                    class: "h-3.5 w-3.5 mr-1 shrink-0"
                                  })),
                                  createTextVNode(" " + toDisplayString(isPubAvailable(pub) ? "D\xE9sactiver" : "Activer"), 1)
                                ]),
                                _: 2
                              }, 1032, ["disabled", "onClick"]),
                              createVNode(unref(_sfc_main$1), {
                                size: "sm",
                                variant: isPubSold(pub) ? "secondary" : "default",
                                class: "h-8 text-xs font-semibold",
                                disabled: pub.category === "hotel",
                                onClick: ($event) => togglePublicationSold(pub)
                              }, {
                                default: withCtx(() => [
                                  isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                    key: 0,
                                    class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                  })) : (openBlock(), createBlock(unref(Tag), {
                                    key: 1,
                                    class: "h-3.5 w-3.5 mr-1 shrink-0"
                                  })),
                                  createTextVNode(" " + toDisplayString(isPubSold(pub) ? "Non vendu" : "Vendu"), 1)
                                ]),
                                _: 2
                              }, 1032, ["variant", "disabled", "onClick"])
                            ]),
                            pub.category === "hotel" ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-[10px] text-muted-foreground"
                            }, " Pas d\u2019endpoint enable/sold \xAB h\xF4tel \xBB sur cette API. ")) : createCommentVNode("", true)
                          ], 8, ["onClick"])
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
                      createVNode("div", { class: "absolute top-2 right-2 flex flex-col gap-1 items-end" }, [
                        pub.status === "Sold" ? (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 0,
                          variant: "secondary",
                          class: "bg-[#1565C0] text-white hover:bg-[#1565C0] border-0 shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(pub.transactionType === "location" || pub.transactionType === "louer" ? "D\xE9j\xE0 pris" : "Vendu"), 1)
                          ]),
                          _: 2
                        }, 1024)) : pub.status === "Inactive" ? (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 1,
                          variant: "outline",
                          class: "border-[#1976D2] bg-white/95 text-[#1565C0] font-semibold shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("D\xE9sactiv\xE9e")
                          ]),
                          _: 1
                        })) : pub.status === "Active" ? (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 2,
                          variant: "secondary",
                          class: "bg-[#1976D2] text-white hover:bg-[#1976D2] border-0 shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("En ligne")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 3,
                          variant: "outline",
                          class: "border-[#1976D2]/50 bg-white/95 text-[#1976D2] font-medium shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("En attente")
                          ]),
                          _: 1
                        }))
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
                            class: "h-8 w-full bg-[#1976D2] hover:bg-[#1565C0] text-white z-10",
                            onClick: withModifiers(($event) => appovePub(pub.id), ["stop", "prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Check), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$1), {
                            size: "icon",
                            variant: "outline",
                            class: "h-8 w-full border-[#1976D2] text-[#1565C0] z-10",
                            onClick: withModifiers(($event) => rejectPub(pub.id), ["stop", "prevent"])
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(X), { class: "h-4 w-4" })
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : createCommentVNode("", true),
                        createVNode("div", {
                          class: "mt-3 pt-3 border-t border-border/60 space-y-2",
                          onClick: withModifiers(() => {
                          }, ["stop", "prevent"])
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground" }, "Admin API"),
                          createVNode("div", { class: "flex flex-wrap gap-2" }, [
                            createVNode(unref(_sfc_main$1), {
                              size: "sm",
                              variant: "outline",
                              class: "h-8 text-xs font-semibold",
                              disabled: pub.category === "hotel",
                              onClick: ($event) => togglePublicationEnable(pub)
                            }, {
                              default: withCtx(() => [
                                isPublicationActionLoading(pub, "en") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isPubAvailable(pub) ? "D\xE9sactiver" : "Activer"), 1)
                              ]),
                              _: 2
                            }, 1032, ["disabled", "onClick"]),
                            createVNode(unref(_sfc_main$1), {
                              size: "sm",
                              variant: isPubSold(pub) ? "secondary" : "default",
                              class: "h-8 text-xs font-semibold",
                              disabled: pub.category === "hotel",
                              onClick: ($event) => togglePublicationSold(pub)
                            }, {
                              default: withCtx(() => [
                                isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Tag), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isPubSold(pub) ? "Non vendu" : "Vendu"), 1)
                              ]),
                              _: 2
                            }, 1032, ["variant", "disabled", "onClick"])
                          ]),
                          pub.category === "hotel" ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-[10px] text-muted-foreground"
                          }, " Pas d\u2019endpoint enable/sold \xAB h\xF4tel \xBB sur cette API. ")) : createCommentVNode("", true)
                        ], 8, ["onClick"])
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
      if (activeTab.value === "hotels") {
        _push(`<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8"><div><h2 class="text-4xl font-black tracking-tight text-foreground">H\xF4tels</h2><p class="text-lg text-muted-foreground mt-2"> Toutes les annonces h\xF4teli\xE8res (liste admin / prot\xE9g\xE9e selon votre r\xF4le). </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "hotels") {
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
        } else if (filteredHotelPublications.value.length === 0) {
          _push(`<div class="py-20 text-center border rounded-lg bg-card text-card-foreground"><p class="text-muted-foreground">Aucun h\xF4tel dans les publications.</p></div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(paginatedHotels.value, (pub) => {
            _push(ssrRenderComponent(unref(_sfc_main$1$1), {
              key: "hotel-" + pub.id,
              class: "overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:border-primary/50 relative",
              onClick: ($event) => goToHotelDetail(pub.id)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="relative aspect-video overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", pub.image)}${ssrRenderAttr("alt", pub.title)} class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"${_scopeId}><div class="absolute top-2 left-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$3), {
                    variant: "secondary",
                    class: "bg-white/90 text-black shadow-sm"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`H\xF4tel`);
                      } else {
                        return [
                          createTextVNode("H\xF4tel")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div><div class="absolute top-2 right-2"${_scopeId}>`);
                  if (isHotelListed(pub)) {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "secondary",
                      class: "bg-[#1976D2] text-white hover:bg-[#1976D2] border-0 shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`En ligne`);
                        } else {
                          return [
                            createTextVNode("En ligne")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  } else {
                    _push2(ssrRenderComponent(unref(_sfc_main$3), {
                      variant: "outline",
                      class: "border-[#1976D2] bg-white/95 text-[#1565C0] font-semibold shadow-sm"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`Indisponible`);
                        } else {
                          return [
                            createTextVNode("Indisponible")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  }
                  _push2(`</div></div>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`<div${_scopeId2}><h3 class="font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors"${_scopeId2}>${ssrInterpolate(pub.title)}</h3><div class="flex items-center text-xs text-muted-foreground gap-1"${_scopeId2}>`);
                        _push3(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent3, _scopeId2));
                        _push3(`<span class="line-clamp-2"${_scopeId2}>${ssrInterpolate(pub.location)}</span></div></div><div${_scopeId2}><div class="font-bold text-primary text-lg leading-tight"${_scopeId2}>${ssrInterpolate(pub.price)}</div><p class="text-xs text-muted-foreground mt-1"${_scopeId2}>${ssrInterpolate(pub.rooms > 0 ? `${pub.rooms} chambre${pub.rooms > 1 ? "s" : ""}` : "Aucune chambre publi\xE9e")}</p></div><div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}><span${_scopeId2}>Par <span class="font-medium text-foreground"${_scopeId2}>${ssrInterpolate(pub.author)}</span></span><span${_scopeId2}>${ssrInterpolate(pub.date)}</span></div><div class="pt-3 border-t border-border/60"${_scopeId2}><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2"${_scopeId2}>Admin</p>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$1), {
                          size: "sm",
                          variant: "outline",
                          class: "h-8 text-xs font-semibold",
                          onClick: ($event) => togglePublicationSold(pub)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (isPublicationActionLoading(pub, "sold")) {
                                _push4(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0" }, null, _parent4, _scopeId3));
                              } else {
                                _push4(ssrRenderComponent(unref(Power), { class: "h-3.5 w-3.5 mr-1 shrink-0" }, null, _parent4, _scopeId3));
                              }
                              _push4(` ${ssrInterpolate(isHotelListed(pub) ? "Rendre indisponible" : "Remettre en ligne")}`);
                            } else {
                              return [
                                isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isHotelListed(pub) ? "Rendre indisponible" : "Remettre en ligne"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(pub.title), 1),
                            createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                              createVNode(unref(MapPin), { class: "h-3 w-3" }),
                              createVNode("span", { class: "line-clamp-2" }, toDisplayString(pub.location), 1)
                            ])
                          ]),
                          createVNode("div", null, [
                            createVNode("div", { class: "font-bold text-primary text-lg leading-tight" }, toDisplayString(pub.price), 1),
                            createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(pub.rooms > 0 ? `${pub.rooms} chambre${pub.rooms > 1 ? "s" : ""}` : "Aucune chambre publi\xE9e"), 1)
                          ]),
                          createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                            createVNode("span", null, [
                              createTextVNode("Par "),
                              createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(pub.author), 1)
                            ]),
                            createVNode("span", null, toDisplayString(pub.date), 1)
                          ]),
                          createVNode("div", {
                            class: "pt-3 border-t border-border/60",
                            onClick: withModifiers(() => {
                            }, ["stop", "prevent"])
                          }, [
                            createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2" }, "Admin"),
                            createVNode(unref(_sfc_main$1), {
                              size: "sm",
                              variant: "outline",
                              class: "h-8 text-xs font-semibold",
                              onClick: ($event) => togglePublicationSold(pub)
                            }, {
                              default: withCtx(() => [
                                isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(isHotelListed(pub) ? "Rendre indisponible" : "Remettre en ligne"), 1)
                              ]),
                              _: 2
                            }, 1032, ["onClick"])
                          ], 8, ["onClick"])
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
                          class: "bg-white/90 text-black shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("H\xF4tel")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "absolute top-2 right-2" }, [
                        isHotelListed(pub) ? (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 0,
                          variant: "secondary",
                          class: "bg-[#1976D2] text-white hover:bg-[#1976D2] border-0 shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("En ligne")
                          ]),
                          _: 1
                        })) : (openBlock(), createBlock(unref(_sfc_main$3), {
                          key: 1,
                          variant: "outline",
                          class: "border-[#1976D2] bg-white/95 text-[#1565C0] font-semibold shadow-sm"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Indisponible")
                          ]),
                          _: 1
                        }))
                      ])
                    ]),
                    createVNode(unref(_sfc_main$5), { class: "flex-1 p-4 flex flex-col gap-3" }, {
                      default: withCtx(() => [
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-semibold text-lg line-clamp-1 leading-tight mb-1 group-hover:text-primary transition-colors" }, toDisplayString(pub.title), 1),
                          createVNode("div", { class: "flex items-center text-xs text-muted-foreground gap-1" }, [
                            createVNode(unref(MapPin), { class: "h-3 w-3" }),
                            createVNode("span", { class: "line-clamp-2" }, toDisplayString(pub.location), 1)
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("div", { class: "font-bold text-primary text-lg leading-tight" }, toDisplayString(pub.price), 1),
                          createVNode("p", { class: "text-xs text-muted-foreground mt-1" }, toDisplayString(pub.rooms > 0 ? `${pub.rooms} chambre${pub.rooms > 1 ? "s" : ""}` : "Aucune chambre publi\xE9e"), 1)
                        ]),
                        createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                          createVNode("span", null, [
                            createTextVNode("Par "),
                            createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(pub.author), 1)
                          ]),
                          createVNode("span", null, toDisplayString(pub.date), 1)
                        ]),
                        createVNode("div", {
                          class: "pt-3 border-t border-border/60",
                          onClick: withModifiers(() => {
                          }, ["stop", "prevent"])
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2" }, "Admin"),
                          createVNode(unref(_sfc_main$1), {
                            size: "sm",
                            variant: "outline",
                            class: "h-8 text-xs font-semibold",
                            onClick: ($event) => togglePublicationSold(pub)
                          }, {
                            default: withCtx(() => [
                              isPublicationActionLoading(pub, "sold") ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                              })) : (openBlock(), createBlock(unref(Power), {
                                key: 1,
                                class: "h-3.5 w-3.5 mr-1 shrink-0"
                              })),
                              createTextVNode(" " + toDisplayString(isHotelListed(pub) ? "Rendre indisponible" : "Remettre en ligne"), 1)
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ], 8, ["onClick"])
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
        _push(`</div></div><div class="md:col-span-4 flex items-center gap-3"><div class="relative flex-1">`);
        _push(ssrRenderComponent(unref(Search), { class: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          modelValue: serviceSearchQuery.value,
          "onUpdate:modelValue": ($event) => serviceSearchQuery.value = $event,
          placeholder: "Rechercher...",
          class: "pl-10 h-11"
        }, null, _parent));
        _push(`</div><select class="h-11 px-4 rounded-md border border-input bg-background text-sm font-medium hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(serviceSortOrder.value) ? ssrLooseContain(serviceSortOrder.value, "newest") : ssrLooseEqual(serviceSortOrder.value, "newest")) ? " selected" : ""}>Plus r\xE9cent</option><option value="oldest"${ssrIncludeBooleanAttr(Array.isArray(serviceSortOrder.value) ? ssrLooseContain(serviceSortOrder.value, "oldest") : ssrLooseEqual(serviceSortOrder.value, "oldest")) ? " selected" : ""}>Plus ancien</option></select>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: ($event) => showServiceFilters.value = !showServiceFilters.value,
          variant: showServiceFilters.value ? "default" : "outline",
          class: "h-11 rounded-xl flex items-center justify-between gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Filter), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(ChevronDown), {
                class: ["h-4 w-4 transition-transform", { "rotate-180": showServiceFilters.value }]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Filter), { class: "h-4 w-4" }),
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
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t animate-in fade-in slide-in-from-top-1"><div class="md:col-span-2 hidden"></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prix Min</label>`);
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
                        _push3(`<span class="line-clamp-1"${_scopeId2}>${ssrInterpolate(srv.location)}</span></div></div><div class="font-bold text-primary max-sm:text-sm"${_scopeId2}>`);
                        if (srv.minPriceFormatted !== "Tarif sur demande") {
                          _push3(`<span class="text-muted-foreground text-xs font-normal block"${_scopeId2}>\xC0 partir de</span>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(` ${ssrInterpolate(srv.minPriceFormatted)}</div><div class="mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground"${_scopeId2}><span${_scopeId2}>Par <span class="font-medium text-foreground"${_scopeId2}>${ssrInterpolate(srv.author)}</span></span><span${_scopeId2}>${ssrInterpolate(srv.date)}</span></div><div class="pt-3 border-t border-border/60"${_scopeId2}><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2"${_scopeId2}>Admin</p>`);
                        _push3(ssrRenderComponent(unref(_sfc_main$1), {
                          size: "sm",
                          variant: "outline",
                          class: "h-8 text-xs font-semibold",
                          disabled: serviceActionId.value === srv.id,
                          onClick: ($event) => toggleServiceActive(srv)
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              if (serviceActionId.value === srv.id) {
                                _push4(ssrRenderComponent(unref(Loader2), { class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0" }, null, _parent4, _scopeId3));
                              } else {
                                _push4(ssrRenderComponent(unref(Power), { class: "h-3.5 w-3.5 mr-1 shrink-0" }, null, _parent4, _scopeId3));
                              }
                              _push4(` ${ssrInterpolate(srv.raw.prestation.active ? "D\xE9sactiver" : "Activer")}`);
                            } else {
                              return [
                                serviceActionId.value === srv.id ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(srv.raw.prestation.active ? "D\xE9sactiver" : "Activer"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(`</div>`);
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
                            srv.minPriceFormatted !== "Tarif sur demande" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-muted-foreground text-xs font-normal block"
                            }, "\xC0 partir de")) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(srv.minPriceFormatted), 1)
                          ]),
                          createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                            createVNode("span", null, [
                              createTextVNode("Par "),
                              createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(srv.author), 1)
                            ]),
                            createVNode("span", null, toDisplayString(srv.date), 1)
                          ]),
                          createVNode("div", {
                            class: "pt-3 border-t border-border/60",
                            onClick: withModifiers(() => {
                            }, ["stop", "prevent"])
                          }, [
                            createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2" }, "Admin"),
                            createVNode(unref(_sfc_main$1), {
                              size: "sm",
                              variant: "outline",
                              class: "h-8 text-xs font-semibold",
                              disabled: serviceActionId.value === srv.id,
                              onClick: ($event) => toggleServiceActive(srv)
                            }, {
                              default: withCtx(() => [
                                serviceActionId.value === srv.id ? (openBlock(), createBlock(unref(Loader2), {
                                  key: 0,
                                  class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                                })) : (openBlock(), createBlock(unref(Power), {
                                  key: 1,
                                  class: "h-3.5 w-3.5 mr-1 shrink-0"
                                })),
                                createTextVNode(" " + toDisplayString(srv.raw.prestation.active ? "D\xE9sactiver" : "Activer"), 1)
                              ]),
                              _: 2
                            }, 1032, ["disabled", "onClick"])
                          ], 8, ["onClick"])
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
                          srv.minPriceFormatted !== "Tarif sur demande" ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-muted-foreground text-xs font-normal block"
                          }, "\xC0 partir de")) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(srv.minPriceFormatted), 1)
                        ]),
                        createVNode("div", { class: "mt-auto pt-3 border-t flex items-center justify-between text-xs text-muted-foreground" }, [
                          createVNode("span", null, [
                            createTextVNode("Par "),
                            createVNode("span", { class: "font-medium text-foreground" }, toDisplayString(srv.author), 1)
                          ]),
                          createVNode("span", null, toDisplayString(srv.date), 1)
                        ]),
                        createVNode("div", {
                          class: "pt-3 border-t border-border/60",
                          onClick: withModifiers(() => {
                          }, ["stop", "prevent"])
                        }, [
                          createVNode("p", { class: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2" }, "Admin"),
                          createVNode(unref(_sfc_main$1), {
                            size: "sm",
                            variant: "outline",
                            class: "h-8 text-xs font-semibold",
                            disabled: serviceActionId.value === srv.id,
                            onClick: ($event) => toggleServiceActive(srv)
                          }, {
                            default: withCtx(() => [
                              serviceActionId.value === srv.id ? (openBlock(), createBlock(unref(Loader2), {
                                key: 0,
                                class: "h-3.5 w-3.5 mr-1 animate-spin shrink-0"
                              })) : (openBlock(), createBlock(unref(Power), {
                                key: 1,
                                class: "h-3.5 w-3.5 mr-1 shrink-0"
                              })),
                              createTextVNode(" " + toDisplayString(srv.raw.prestation.active ? "D\xE9sactiver" : "Activer"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])
                        ], 8, ["onClick"])
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
      if (activeTab.value === "properties") {
        _push(ssrRenderComponent(_sfc_main$6, {
          page: currentPage.value,
          total: filteredPropertyPublications.value.length,
          "page-size": itemsPerPage,
          "onUpdate:page": ($event) => currentPage.value = $event
        }, null, _parent));
      } else if (activeTab.value === "hotels") {
        _push(ssrRenderComponent(_sfc_main$6, {
          page: hotelCurrentPage.value,
          total: filteredHotelPublications.value.length,
          "page-size": itemsPerPage,
          "onUpdate:page": ($event) => hotelCurrentPage.value = $event
        }, null, _parent));
      } else if (activeTab.value === "services") {
        _push(ssrRenderComponent(_sfc_main$6, {
          page: serviceCurrentPage.value,
          total: filteredServices.value.length,
          "page-size": itemsPerPage,
          "onUpdate:page": ($event) => serviceCurrentPage.value = $event
        }, null, _parent));
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
//# sourceMappingURL=index-CkDTQWPE.mjs.map
