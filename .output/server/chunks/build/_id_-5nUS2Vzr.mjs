import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, Fragment, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { useQueryClient, useQuery } from '@tanstack/vue-query';
import VueEasyLightbox from 'vue-easy-lightbox';
import { Home, ArrowLeft, MapPin, Maximize, Users, BedDouble, Bath, Zap, Droplets, CheckCircle, Loader2, ShieldCheck, Building2, Eye, EyeOff, Ban, ShieldAlert, Tag, Trash2, Calendar, MessageSquare, Info } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$6 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$5 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$3 } from './Badge-CZaU8sYj.mjs';
import { _ as _sfc_main$1 } from './Skeleton-BgOY-K4r.mjs';
import { _ as _sfc_main$4 } from './Sheet-C_ZQdICj.mjs';
import { m as useAuthStore, f as usePropertyStore, z as useCookie, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { g as normalizeProperty } from './propertyNormalizer-DiijNhdR.mjs';
import { u as useReservationStore } from './reservations-DMpUain_.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { r as reloadNuxtApp } from './chunk-BTlXFfiI.mjs';
import { u as unwrapArrayPayload } from './apiListResponse-BRFNgDZl.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
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
import './partyExtract-C97-iyVh.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const resStore = useReservationStore();
    const propertyStore = usePropertyStore();
    const queryClient = useQueryClient();
    const propertyId = String(route.params.id);
    const isUpdating = ref(false);
    const { data: adminProtectedProperty, isPending: adminPropertyPending } = useQuery({
      queryKey: ["admin-protected-property", propertyId],
      queryFn: async () => {
        const apiBase = config.public.apiBase;
        const token = useCookie("auth_token").value;
        if (!token) throw new Error("Non authentifi\xE9");
        const headers = { Authorization: `Bearer ${token}` };
        try {
          const url = joinApi(apiBase, `${ApiEndpoints.protectedProperties}/${propertyId}`);
          return await $fetch(url, { headers });
        } catch (e) {
          const url = joinApi(
            apiBase,
            `${ApiEndpoints.protectedPropertyBureauDetailPrefix}/${propertyId}`
          );
          return await $fetch(url, { headers });
        }
      },
      enabled: computed(() => authStore.isAdmin)
    });
    const { data: propertiesData, isLoading, isError, isFetching } = useQuery({
      queryKey: ["all-dashboard-properties"],
      queryFn: async () => {
        const apiBase = config.public.apiBase;
        const token = useCookie("auth_token").value;
        const h = {};
        if (token) h.Authorization = `Bearer ${token}`;
        const isAdmin = authStore.isAdmin;
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
          isAdmin ? ApiEndpoints.protectedPropertyHotels : ApiEndpoints.propertyHotels
        );
        const [props, terrains, bureaux, hotels, festives, funeraires] = await Promise.all([
          fetch(propsUrl, isAdmin ? { headers: h } : void 0).then((res) => res.json()),
          fetch(terrainsUrl, isAdmin ? { headers: h } : void 0).then((res) => res.json()),
          fetch(bureauxUrl, isAdmin ? { headers: h } : void 0).then((res) => res.json()),
          fetch(hotelsUrl, { headers: h }).then((res) => res.json()),
          fetch(festivesUrl, isAdmin ? { headers: h } : void 0).then((res) => res.json()),
          fetch(funerairesUrl, isAdmin ? { headers: h } : void 0).then((res) => res.json())
        ]);
        return {
          properties: (props == null ? void 0 : props.properties) || [],
          terrains: (terrains == null ? void 0 : terrains.terrain) || [],
          bureaux: unwrapArrayPayload(bureaux),
          hotels: unwrapArrayPayload(hotels),
          festives: (festives == null ? void 0 : festives.festives) || [],
          funeraires: (funeraires == null ? void 0 : funeraires.funeraires) || []
        };
      }
    });
    watch(
      propertiesData,
      (newData) => {
        if (!newData) return;
        propertyStore.setProperties(newData.properties || []);
        propertyStore.terrains = newData.terrains || [];
        propertyStore.bureaux = newData.bureaux || [];
        propertyStore.hotels = newData.hotels || [];
        propertyStore.festives = newData.festives || [];
        propertyStore.funeraires = newData.funeraires || [];
      },
      { immediate: true }
    );
    const foundListing = computed(() => {
      var _a, _b, _c;
      if (authStore.isAdmin && adminProtectedProperty.value) {
        const res = adminProtectedProperty.value;
        const prop = (_a = res.property) != null ? _a : res;
        const pid = (_b = prop == null ? void 0 : prop.propertyId) != null ? _b : prop == null ? void 0 : prop.id;
        if (prop && pid != null && String(pid) === propertyId) {
          const raw = res.property != null && typeof res.property === "object" ? res : { ...res, property: prop };
          return {
            category: "property",
            raw,
            entityId: Number(pid)
          };
        }
      }
      const d = propertiesData.value;
      if (!d) return null;
      const idStr = propertyId;
      const buckets = [
        { cat: "property", list: d.properties || [], key: "property" },
        { cat: "terrain", list: d.terrains || [], key: "terrain" },
        { cat: "bureau", list: d.bureaux || [], key: "bureau" },
        { cat: "festive", list: d.festives || [], key: "festive" },
        { cat: "funeraire", list: d.funeraires || [], key: "funeraire" },
        { cat: "hotel", list: d.hotels || [], key: "hotel" }
      ];
      for (const { cat, list, key } of buckets) {
        const found = list.find((item) => {
          var _a2;
          if (!item || typeof item !== "object") return false;
          const rec = item;
          const ent = rec[key];
          if (!ent) return false;
          const eid = (_a2 = ent.propertyId) != null ? _a2 : ent.id;
          return String(eid) === idStr;
        });
        if (found) {
          const ent = found[key];
          const entityId = Number((_c = ent.propertyId) != null ? _c : ent.id);
          return { category: cat, raw: found, entityId };
        }
      }
      return null;
    });
    const listingEntity = computed(() => {
      const fl = foundListing.value;
      if (!fl) return null;
      const key = fl.category === "property" ? "property" : fl.category === "terrain" ? "terrain" : fl.category === "bureau" ? "bureau" : fl.category === "festive" ? "festive" : fl.category === "funeraire" ? "funeraire" : "hotel";
      return fl.raw[key];
    });
    const listingAvailable = computed(() => {
      const p = listingEntity.value;
      if (!p) return true;
      if (typeof p.status === "boolean") return p.status === false;
      if (p.available === false) return false;
      if (p.active === false) return false;
      return true;
    });
    const isSoldListing = computed(() => {
      const p = listingEntity.value;
      return !!(p == null ? void 0 : p.sold);
    });
    const rawTransactionType = computed(() => {
      var _a, _b;
      const e = listingEntity.value;
      if (!e) return "";
      return String((_b = (_a = e.transactionType) != null ? _a : e.Transaction) != null ? _b : "").trim();
    });
    const transactionKind = computed(() => {
      const t = rawTransactionType.value.toLowerCase();
      if (!t) return "unknown";
      if (t.includes("cours") || t === "en cours" || t.replace(/\s/g, "") === "encours") return "en_cours";
      if (t.includes("location") || t.includes("louer")) return "location";
      if (t.includes("vente") || t.includes("vendre")) return "vente";
      return "unknown";
    });
    const transactionTypeLabel = computed(() => {
      switch (transactionKind.value) {
        case "location":
          return "Location";
        case "vente":
          return "Vente";
        case "en_cours":
          return "En cours";
        default:
          return rawTransactionType.value || "\u2014";
      }
    });
    const isLocationTransaction = computed(() => transactionKind.value === "location");
    const isHotelListing = computed(() => {
      var _a;
      return ((_a = foundListing.value) == null ? void 0 : _a.category) === "hotel";
    });
    const categoryLabel = computed(() => {
      var _a;
      const c = (_a = foundListing.value) == null ? void 0 : _a.category;
      const map = {
        property: "R\xE9sidentiel",
        terrain: "Terrain",
        bureau: "Bureau",
        festive: "Salle / espace festif",
        funeraire: "Espace fun\xE9raire",
        hotel: "H\xF4tel"
      };
      return c ? map[c] : "\u2014";
    });
    const lifecycleState = computed(() => {
      if (isHotelListing.value) return "hotel";
      if (isSoldListing.value) return "sold";
      if (!listingAvailable.value) return "hidden";
      return "live";
    });
    const lifecyclePresentation = computed(() => {
      switch (lifecycleState.value) {
        case "live":
          return {
            headline: "Publi\xE9e et visible",
            sub: "Les visiteurs voient cette annonce sur le site public.",
            dotClass: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]",
            cardTint: "border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
          };
        case "hidden":
          return {
            headline: "Masqu\xE9e (non publi\xE9e)",
            sub: "Le public ne la voit pas. Vous pouvez la r\xE9activer sans changer le statut transaction.",
            dotClass: "bg-amber-500",
            cardTint: "border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/15"
          };
        case "sold":
          return {
            headline: isLocationTransaction.value ? "Plus disponible \xE0 la location" : "Vendu \u2014 transaction cl\xF4tur\xE9e",
            sub: isLocationTransaction.value ? "Marqu\xE9 comme d\xE9j\xE0 pris / lou\xE9. Retirez ce statut pour modifier la visibilit\xE9 sur le site." : "Marqu\xE9 comme vendu. Retirez ce statut pour modifier la visibilit\xE9 sur le site.",
            dotClass: "bg-slate-500",
            cardTint: "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/40"
          };
        default:
          return {
            headline: "H\xF4tel",
            sub: "La visibilit\xE9 et le statut vendu ne sont pas g\xE9r\xE9s par les m\xEAmes endpoints que les autres biens.",
            dotClass: "bg-[#1976D2]",
            cardTint: "border-[#1976D2]/30 bg-[#1976D2]/5"
          };
      }
    });
    const publicationBadge = computed(() => {
      if (isSoldListing.value)
        return {
          label: isLocationTransaction.value ? "D\xE9j\xE0 pris" : "Vendu",
          class: "bg-slate-800 text-white border-slate-800 font-semibold"
        };
      if (!listingAvailable.value)
        return {
          label: "Non publi\xE9e",
          class: "border-amber-400/80 bg-amber-100/90 text-amber-950 font-semibold"
        };
      return { label: "En ligne", class: "bg-[#1976D2] text-white border-[#1976D2] font-semibold" };
    });
    const canToggleVisibility = computed(
      () => !isHotelListing.value && !isSoldListing.value && !isUpdating.value
    );
    const canToggleSold = computed(() => !isHotelListing.value && !isUpdating.value);
    const toggleAvailability = async () => {
      const fl = foundListing.value;
      if (!property.value || !fl) return;
      if (isHotelListing.value) {
        toast.info("Les h\xF4tels ne sont pas g\xE9r\xE9s par ces endpoints sur cette API.");
        return;
      }
      if (isSoldListing.value) {
        toast.error("Retirez d\u2019abord le statut \xAB vendu \xBB pour r\xE9activer la visibilit\xE9.");
        return;
      }
      isUpdating.value = true;
      const hidden = listingAvailable.value;
      const result = await propertyStore.putPublicationEnable(
        config.public.apiBase,
        authStore.token,
        fl.category,
        fl.entityId,
        hidden
      );
      if (result.success) {
        toast.success(
          hidden ? "Annonce retir\xE9e du site" : "Annonce visible sur le site"
        );
        await queryClient.invalidateQueries({ queryKey: ["all-dashboard-properties"] });
        await reloadNuxtApp({});
      } else {
        toast.error(result.message || "Erreur lors de la mise \xE0 jour");
      }
      isUpdating.value = false;
    };
    const markAsSold = async () => {
      const fl = foundListing.value;
      if (!property.value || !fl) return;
      if (isHotelListing.value) {
        toast.info("Les h\xF4tels ne sont pas g\xE9r\xE9s par ces endpoints sur cette API.");
        return;
      }
      const ent = listingEntity.value;
      const currentlySold = !!(ent == null ? void 0 : ent.sold);
      if (!currentlySold) {
        const msg = isLocationTransaction.value ? "Marquer ce bien comme d\xE9j\xE0 pris / lou\xE9 ? Il ne sera plus disponible \xE0 la location." : "Marquer ce bien comme vendu ? Il ne sera plus disponible \xE0 la vente.";
        const confirmSold = confirm(msg);
        if (!confirmSold) return;
      } else {
        const confirmUnsold = confirm(
          isLocationTransaction.value ? "Rouvrir la transaction (bien \xE0 nouveau disponible) ?" : "Retirer le statut \xAB vendu \xBB ?"
        );
        if (!confirmUnsold) return;
      }
      isUpdating.value = true;
      const result = await propertyStore.putPublicationSold(
        config.public.apiBase,
        authStore.token,
        fl.category,
        fl.entityId,
        !currentlySold
      );
      if (result.success) {
        toast.success(
          currentlySold ? isLocationTransaction.value ? "Bien \xE0 nouveau disponible" : "Statut vendu retir\xE9" : isLocationTransaction.value ? "Marqu\xE9 comme non disponible (d\xE9j\xE0 pris / lou\xE9)" : "Bien marqu\xE9 comme vendu"
        );
        await queryClient.invalidateQueries({ queryKey: ["all-dashboard-properties"] });
        await reloadNuxtApp({});
      } else {
        toast.error(result.message || "Erreur lors de la mise \xE0 jour");
      }
      isUpdating.value = false;
    };
    const isResSheetOpen = ref(false);
    const showAuthModal = ref(false);
    const resForm = ref({
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: new Date(Date.now() + 864e5).toISOString().split("T")[0],
      message: "",
      type: "VIP"
    });
    const handleStartReservation = () => {
      if (isSoldListing.value) {
        toast.info(`${isLocationTransaction.value ? "Ce bien est d\xE9j\xE0 pris" : "Ce bien est d\xE9j\xE0 vendu"} \u2014 r\xE9servation impossible.`);
        return;
      }
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      isResSheetOpen.value = true;
    };
    const submitReservation = async () => {
      if (!property.value) return;
      if (isSoldListing.value) {
        toast.error("Ce bien n\u2019est plus disponible.");
        return;
      }
      const result = await resStore.createReservation(
        property.value.type || "Standard",
        property.value.id,
        {
          ...resForm.value,
          reservationHeure: (/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour12: false })
        }
      );
      if (result.success) {
        toast.success("Votre demande de r\xE9servation a \xE9t\xE9 envoy\xE9e avec succ\xE8s !");
        isResSheetOpen.value = false;
        resForm.value.message = "";
      } else {
        toast.error(result.message || "\xC9chec de la r\xE9servation");
        if (result.code === "NOT_PREMIUM") {
          await navigateTo("/compte/abonnement");
        }
      }
    };
    const normalizedListing = computed(() => {
      const fl = foundListing.value;
      if (!fl) return null;
      try {
        return normalizeProperty(fl.raw);
      } catch {
        return null;
      }
    });
    const property = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g;
      const fl = foundListing.value;
      const n = normalizedListing.value;
      if (!fl || !n) return null;
      const raw = fl.raw;
      const addr = raw.address || {};
      const category = fl.category;
      const ent = listingEntity.value;
      if (!ent) return null;
      const priceNum = ent.price;
      const priceStr = typeof priceNum === "number" ? priceNum.toLocaleString("fr-FR") : String(priceNum != null ? priceNum : "");
      const imgs = n.imagesByCategory;
      const mainArr = ((_a = imgs.main) == null ? void 0 : _a.length) > 0 ? imgs.main : n.images.length > 0 ? [n.images[0]] : [];
      let surface = "-";
      let rooms = "-";
      let bedrooms = "-";
      let bathrooms = "-";
      let kitchens;
      let livingRooms;
      let floor = "RDC";
      let guarantee = "-";
      if (category === "property" && raw.property) {
        const p = raw.property;
        surface = p.surface != null ? String(p.surface) : "-";
        rooms = p.rooms != null ? String(p.rooms) : "-";
        bedrooms = String((_b = p.bedrooms) != null ? _b : "-");
        bathrooms = String((_c = p.bathroom) != null ? _c : "-");
        kitchens = p.kitchen;
        livingRooms = p.livingRoom;
        floor = p.floor || "RDC";
        guarantee = (_d = p.guarantee) != null ? _d : "-";
      } else if (category === "terrain" && raw.terrain) {
        const t = raw.terrain;
        surface = t.surface != null ? String(t.surface) : "-";
      } else if (category === "bureau" && raw.bureau) {
        const b = raw.bureau;
        rooms = b.numberPiece != null ? String(b.numberPiece) : "-";
      }
      const featRaw = (_e = raw.features) != null ? _e : raw.feature;
      const featuresList = Array.isArray(featRaw) ? featRaw.map((f) => f.name).filter(Boolean) : n.features;
      const entRec = ent;
      const sold = !!ent.sold;
      const activeListing = typeof entRec.status === "boolean" ? entRec.status === false : ent.available !== false && ent.active !== false;
      return {
        id: fl.entityId,
        title: n.title || "Sans titre",
        description: n.description,
        price: priceStr,
        currency: ((_f = raw.devise) == null ? void 0 : _f.code) || "USD",
        currencyLabel: ((_g = raw.devise) == null ? void 0 : _g.code) || "USD",
        status: sold ? "Sold" : activeListing ? "Active" : "Inactive",
        transactionType: ent.transactionType,
        surface,
        rooms,
        bedrooms,
        bathrooms,
        kitchens,
        livingRooms,
        floor,
        guarantee,
        category: n.type === "Apparts" ? "appartement" : n.type,
        createdAt: n.createdAt,
        capacity: n.capacity,
        electricity: n.electricity,
        electricityInfo: n.electricityInfo,
        water: n.water,
        waterInfo: n.waterInfo,
        isFestive: n.isFestive,
        isFuneraire: n.isFuneraire,
        address: {
          full: addr.address,
          commune: addr.communeValue,
          quartier: addr.quartierValue,
          city: addr.cityValue,
          country: addr.countryValue
        },
        publisher: {
          username: String(raw.postBy || "").replace("@@", "") || "Inconnu",
          id: raw.userId,
          photo: raw.image || null
        },
        type: n.type === "Apparts" ? "appartement" : n.type,
        features: featuresList,
        images: {
          main: mainArr,
          room: imgs.room || [],
          living: imgs.living || [],
          kitchen: imgs.kitchen || []
        }
      };
    });
    const showPageSkeleton = computed(() => {
      if (property.value) return false;
      if (isLoading.value) return true;
      if (authStore.isAdmin && adminPropertyPending.value) return true;
      return false;
    });
    const allPropertyImages = computed(() => {
      if (!property.value) return [];
      return [
        ...property.value.images.main,
        ...property.value.images.room,
        ...property.value.images.living,
        ...property.value.images.kitchen
      ];
    });
    const visibleRef = ref(false);
    const indexRef = ref(0);
    const currentLightboxImages = ref([]);
    const onHide = () => {
      visibleRef.value = false;
    };
    const goBack = () => router.push("/dashboard/publications?tab=properties");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" }, _attrs))}>`);
      if (showPageSkeleton.value) {
        _push(`<div class="space-y-8 animate-pulse"><div class="space-y-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-10 w-2/3 rounded-lg" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-6 w-1/3 rounded-lg" }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-[500px] w-full rounded-2xl" }, null, _parent));
        _push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-24 w-full rounded-xl" }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-40 w-full rounded-xl" }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-96 w-full rounded-2xl" }, null, _parent));
        _push(`</div></div>`);
      } else if (!property.value) {
        _push(`<div class="flex flex-col items-center justify-center py-32 text-center"><div class="bg-destructive/10 p-8 rounded-full mb-6">`);
        _push(ssrRenderComponent(unref(Home), { class: "h-16 w-16 text-destructive" }, null, _parent));
        _push(`</div><h3 class="text-3xl font-bold text-foreground mb-3">Bien introuvable</h3><p class="text-muted-foreground mb-8 max-w-md text-lg">Nous ne parvenons pas \xE0 afficher les d\xE9tails de cette propri\xE9t\xE9.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: goBack,
          size: "lg",
          class: "rounded-full px-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour aux publications`);
            } else {
              return [
                createTextVNode("Retour aux publications")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"><div class="flex flex-col gap-6 mb-8"><button class="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors w-fit">`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4 mr-2" }, null, _parent));
        _push(` Retour </button><div class="flex flex-col md:flex-row md:items-start justify-between gap-4"><div class="space-y-2"><h1 class="text-3xl md:text-5xl font-black text-foreground leading-tight tracking-tight">${ssrInterpolate((_a = property.value) == null ? void 0 : _a.title)}</h1><div class="flex flex-wrap items-center gap-3 text-muted-foreground"><span class="flex items-center gap-1.5 text-foreground font-medium">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-4 w-4 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate((_c = (_b = property.value) == null ? void 0 : _b.address) == null ? void 0 : _c.city)}, ${ssrInterpolate((_e = (_d = property.value) == null ? void 0 : _d.address) == null ? void 0 : _e.commune)}</span><span class="w-1 h-1 rounded-full bg-border"></span><span>${ssrInterpolate(((_f = property.value) == null ? void 0 : _f.category) || "Bien immobilier")}</span><span class="w-1 h-1 rounded-full bg-border"></span>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "outline",
          class: ["rounded-full px-2.5 py-0.5 text-xs border", publicationBadge.value.class]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(publicationBadge.value.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(publicationBadge.value.label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-12 h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-sm"><div class="md:col-span-2 md:row-span-2 relative group cursor-pointer h-full"><img${ssrRenderAttr("src", ((_h = (_g = property.value) == null ? void 0 : _g.images) == null ? void 0 : _h.main[0]) || "/placeholder.jpg")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div></div><div class="md:col-span-2 md:row-span-2 grid grid-cols-2 gap-3 h-full">`);
        if (allPropertyImages.value.length > 1) {
          _push(`<!--[-->`);
          ssrRenderList(allPropertyImages.value.slice(1, 5), (img, idx) => {
            _push(`<div class="relative group cursor-pointer overflow-hidden h-full"><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>`);
            if (idx === 3) {
              _push(`<div class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-[2px] group-hover:bg-black/40 transition-colors">`);
              _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-white mb-1" }, null, _parent));
              _push(`<span class="text-white font-bold text-lg">Voir toutes les photos</span>`);
              if (allPropertyImages.value.length > 5) {
                _push(`<span class="text-white/80 text-sm font-medium">+${ssrInterpolate(allPropertyImages.value.length - 5)} photos</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<div class="col-span-2 row-span-2 bg-muted flex items-center justify-center text-muted-foreground"><div class="flex flex-col items-center gap-2">`);
          _push(ssrRenderComponent(unref(Home), { class: "h-8 w-8 opacity-20" }, null, _parent));
          _push(`<span class="text-sm">Pas d&#39;autres photos</span></div></div>`);
        }
        _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative"><div class="lg:col-span-8 space-y-10"><div class="flex flex-wrap items-center gap-6 py-6 border-y border-border/50">`);
        if (((_i = property.value) == null ? void 0 : _i.surface) && property.value.surface !== "-") {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate((_j = property.value) == null ? void 0 : _j.surface)}</span><span class="text-xs text-muted-foreground uppercase">Surface</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_k = property.value) == null ? void 0 : _k.capacity) > 0) {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Users), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.capacity)} pers.</span><span class="text-xs text-muted-foreground uppercase">Capacit\xE9</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_l = property.value) == null ? void 0 : _l.rooms) && property.value.rooms !== "-") {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Home), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.rooms)}</span><span class="text-xs text-muted-foreground uppercase">Pi\xE8ces</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_m = property.value) == null ? void 0 : _m.bedrooms) && property.value.bedrooms !== "-") {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(BedDouble), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.bedrooms)}</span><span class="text-xs text-muted-foreground uppercase">Chambres</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_n = property.value) == null ? void 0 : _n.bathrooms) && property.value.bathrooms !== "-") {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Bath), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.bathrooms)}</span><span class="text-xs text-muted-foreground uppercase">Salles de bain</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_o = property.value) == null ? void 0 : _o.electricity) > 0) {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Zap), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.electricityInfo)}</span><span class="text-xs text-muted-foreground uppercase">\xC9lectricit\xE9 (${ssrInterpolate(property.value.electricity)}%)</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_p = property.value) == null ? void 0 : _p.water) > 0) {
          _push(`<div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
          _push(ssrRenderComponent(unref(Droplets), { class: "h-5 w-5 text-foreground" }, null, _parent));
          _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(property.value.waterInfo)}</span><span class="text-xs text-muted-foreground uppercase">Eau (${ssrInterpolate(property.value.water)}%)</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4"><h2 class="text-2xl font-bold tracking-tight">\xC0 propos de ce bien</h2><div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-light"><p class="whitespace-pre-line">${ssrInterpolate((_q = property.value) == null ? void 0 : _q.description)}</p></div></div>`);
        if (((_r = property.value) == null ? void 0 : _r.features) && property.value.features.length) {
          _push(`<div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">Ce que propose ce logement</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8"><!--[-->`);
          ssrRenderList(property.value.features, (feature) => {
            _push(`<div class="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">`);
            _push(ssrRenderComponent(unref(CheckCircle), { class: "h-5 w-5 text-primary shrink-0" }, null, _parent));
            _push(`<span class="text-base">${ssrInterpolate(feature)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">D\xE9tails techniques</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50"><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Type</p><p class="font-medium">${ssrInterpolate(transactionTypeLabel.value)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">\xC9tage</p><p class="font-medium">${ssrInterpolate(((_s = property.value) == null ? void 0 : _s.floor) || "RDC")}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Garantie</p><p class="font-medium">${ssrInterpolate((_t = property.value) == null ? void 0 : _t.guarantee)} mois</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">R\xE9f\xE9rence</p><p class="font-mono text-xs bg-white px-2 py-1 rounded border inline-block">${ssrInterpolate(property.value.id)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Date</p><p class="font-medium">${ssrInterpolate(property.value.createdAt)}</p></div></div></div><div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">Localisation</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-border/50 bg-card/50"><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent));
        _push(` Ville</span><p class="font-medium text-foreground">${ssrInterpolate(((_v = (_u = property.value) == null ? void 0 : _u.address) == null ? void 0 : _v.city) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Commune</span><p class="font-medium text-foreground">${ssrInterpolate(((_x = (_w = property.value) == null ? void 0 : _w.address) == null ? void 0 : _x.commune) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Quartier</span><p class="font-medium text-foreground">${ssrInterpolate(((_z = (_y = property.value) == null ? void 0 : _y.address) == null ? void 0 : _z.quartier) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Adresse compl\xE8te</span><p class="font-medium text-foreground">${ssrInterpolate(((_B = (_A = property.value) == null ? void 0 : _A.address) == null ? void 0 : _B.full) || "-")}</p></div></div></div></div><div class="lg:col-span-4 relative"><div class="sticky top-24 space-y-6"><div class="relative rounded-3xl border border-border/80 bg-card shadow-lg shadow-black/5 overflow-hidden dark:bg-slate-950 dark:border-slate-800">`);
        if (unref(isFetching) && !unref(isLoading) && property.value) {
          _push(`<div class="absolute top-0 left-0 right-0 z-20 h-0.5 bg-[#1976D2] animate-pulse"></div>`);
        } else {
          _push(`<!---->`);
        }
        if (isUpdating.value) {
          _push(`<div class="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-[2px] dark:bg-slate-950/75"><div class="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold shadow-lg">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin text-[#1976D2]" }, null, _parent));
          _push(` Mise \xE0 jour\u2026 </div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="bg-gradient-to-r from-[#1976D2] to-[#1565C0] px-5 py-4 text-white"><div class="flex items-start gap-3"><div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6 text-white" }, null, _parent));
        _push(`</div><div class="min-w-0 flex-1"><h3 class="font-bold text-base leading-tight tracking-tight">Publication &amp; visibilit\xE9</h3><div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-white/90"><span class="inline-flex items-center gap-1 rounded-md bg-black/15 px-2 py-0.5">`);
        _push(ssrRenderComponent(unref(Building2), { class: "h-3.5 w-3.5 shrink-0 opacity-90" }, null, _parent));
        _push(` ${ssrInterpolate(categoryLabel.value)}</span><span class="inline-flex rounded-md border border-white/25 bg-white/10 px-2 py-0.5 font-semibold">${ssrInterpolate(transactionTypeLabel.value)}</span><span class="tabular-nums opacity-80">#${ssrInterpolate(unref(propertyId))}</span></div></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          variant: "outline",
          class: "shrink-0 border-white/40 bg-white/10 text-white hover:bg-white/15"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(publicationBadge.value.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(publicationBadge.value.label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="space-y-4 p-5"><div class="${ssrRenderClass([lifecyclePresentation.value.cardTint, "rounded-2xl border p-4 transition-colors duration-300"])}"><div class="flex gap-3"><div class="relative mt-0.5 flex h-3 w-3 shrink-0">`);
        if (lifecycleState.value === "live") {
          _push(`<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([lifecyclePresentation.value.dotClass, "relative inline-flex h-3 w-3 rounded-full ring-2 ring-background"])}"></span></div><div class="min-w-0 flex-1"><p class="text-sm font-bold leading-tight text-foreground">${ssrInterpolate(lifecyclePresentation.value.headline)}</p><p class="mt-1 text-xs leading-relaxed text-muted-foreground">${ssrInterpolate(lifecyclePresentation.value.sub)}</p></div></div><div class="mt-4 grid grid-cols-2 gap-2"><div class="rounded-xl border border-border/60 bg-background/90 px-3 py-2.5 shadow-sm dark:bg-slate-900/80"><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"> Visibilit\xE9 site </p><p class="mt-1 flex items-center gap-2 text-sm font-bold text-foreground">`);
        if (listingAvailable.value && !isSoldListing.value && !isHotelListing.value) {
          _push(ssrRenderComponent(unref(Eye), { class: "h-4 w-4 text-emerald-600" }, null, _parent));
        } else if (!isSoldListing.value && !isHotelListing.value) {
          _push(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4 text-amber-600" }, null, _parent));
        } else if (isSoldListing.value) {
          _push(ssrRenderComponent(unref(Ban), { class: "h-4 w-4 text-slate-500" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(ShieldAlert), { class: "h-4 w-4 text-[#1976D2]" }, null, _parent));
        }
        if (isHotelListing.value) {
          _push(`<span>N/A</span>`);
        } else if (isSoldListing.value) {
          _push(`<span>${ssrInterpolate(isLocationTransaction.value ? "Masqu\xE9e (non dispo.)" : "Masqu\xE9e (vendu)")}</span>`);
        } else if (listingAvailable.value) {
          _push(`<span>Active</span>`);
        } else {
          _push(`<span>D\xE9sactiv\xE9e</span>`);
        }
        _push(`</p></div><div class="rounded-xl border border-border/60 bg-background/90 px-3 py-2.5 shadow-sm dark:bg-slate-900/80"><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"> Transaction </p><p class="mt-1 flex items-center gap-2 text-sm font-bold text-foreground">`);
        _push(ssrRenderComponent(unref(Tag), {
          class: ["h-4 w-4", isSoldListing.value ? "text-slate-600" : "text-[#1976D2]"]
        }, null, _parent));
        _push(` ${ssrInterpolate(isSoldListing.value ? isLocationTransaction.value ? "D\xE9j\xE0 pris / lou\xE9" : "Vendu" : "En cours")}</p></div></div></div><div class="space-y-2"><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"> Visibilit\xE9 (public) </p>`);
        if (!listingAvailable.value) {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            type: "button",
            onClick: toggleAvailability,
            disabled: !canToggleVisibility.value,
            class: "h-12 w-full gap-2 rounded-xl border-0 bg-emerald-600 font-bold text-white shadow-md hover:bg-emerald-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isUpdating.value) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 shrink-0 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(Eye), { class: "h-4 w-4 shrink-0" }, null, _parent2, _scopeId));
                }
                _push2(` Rendre visible sur le site `);
              } else {
                return [
                  isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "h-4 w-4 shrink-0 animate-spin"
                  })) : (openBlock(), createBlock(unref(Eye), {
                    key: 1,
                    class: "h-4 w-4 shrink-0"
                  })),
                  createTextVNode(" Rendre visible sur le site ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            type: "button",
            onClick: toggleAvailability,
            disabled: !canToggleVisibility.value,
            variant: "outline",
            class: "h-12 w-full gap-2 rounded-xl border-2 border-amber-500/80 bg-amber-50/90 font-bold text-amber-950 hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-100 dark:hover:bg-amber-950/50"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isUpdating.value) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 shrink-0 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4 shrink-0" }, null, _parent2, _scopeId));
                }
                _push2(` Retirer du site (masquer) `);
              } else {
                return [
                  isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "h-4 w-4 shrink-0 animate-spin"
                  })) : (openBlock(), createBlock(unref(EyeOff), {
                    key: 1,
                    class: "h-4 w-4 shrink-0"
                  })),
                  createTextVNode(" Retirer du site (masquer) ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        if (isSoldListing.value && !isHotelListing.value) {
          _push(`<p class="text-xs text-muted-foreground"> Retirez le statut <span class="font-semibold">Vendu / pris</span> ci-dessous pour pouvoir changer la visibilit\xE9. </p>`);
        } else {
          _push(`<!---->`);
        }
        if (isHotelListing.value) {
          _push(`<p class="text-xs text-muted-foreground"> Les h\xF4tels ne sont pas couverts par les endpoints enable/sold \xAB property \xBB sur cette API. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="h-px bg-border"></div><div class="space-y-2"><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"> Statut transaction </p>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "button",
          onClick: markAsSold,
          disabled: !canToggleSold.value,
          variant: "outline",
          class: isSoldListing.value ? "h-12 w-full justify-start gap-3 rounded-xl border-2 border-emerald-600/50 bg-emerald-50/80 font-bold text-emerald-950 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-100" : "h-12 w-full justify-start gap-3 rounded-xl border-2 border-slate-400/80 bg-slate-50/90 font-bold text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isUpdating.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 shrink-0 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(Tag), { class: "h-4 w-4 shrink-0 text-[#1976D2]" }, null, _parent2, _scopeId));
              }
              _push2(` ${ssrInterpolate(isSoldListing.value ? isLocationTransaction.value.value ? "Rendre disponible \xE0 la location" : "Rouvrir la vente" : isLocationTransaction.value.value ? "Marquer d\xE9j\xE0 pris / lou\xE9" : "Marquer comme vendu")}`);
            } else {
              return [
                isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "h-4 w-4 shrink-0 animate-spin"
                })) : (openBlock(), createBlock(unref(Tag), {
                  key: 1,
                  class: "h-4 w-4 shrink-0 text-[#1976D2]"
                })),
                createTextVNode(" " + toDisplayString(isSoldListing.value ? isLocationTransaction.value.value ? "Rendre disponible \xE0 la location" : "Rouvrir la vente" : isLocationTransaction.value.value ? "Marquer d\xE9j\xE0 pris / lou\xE9" : "Marquer comme vendu"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="h-px bg-border"></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          type: "button",
          variant: "ghost",
          disabled: "",
          class: "h-11 w-full justify-start gap-2 rounded-xl text-muted-foreground"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Supprimer l\u2019annonce (bient\xF4t) `);
            } else {
              return [
                createVNode(unref(Trash2), { class: "h-4 w-4" }),
                createTextVNode(" Supprimer l\u2019annonce (bient\xF4t) ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="rounded-3xl border bg-card shadow-xl shadow-primary/5 p-6 md:p-8 space-y-6"><div class="pb-6 border-b border-border/50"><div class="flex items-end justify-between gap-2 mb-1"><span class="text-3xl font-black text-primary">${ssrInterpolate((_C = property.value) == null ? void 0 : _C.price)} <span class="text-lg text-foreground font-bold">${ssrInterpolate((_D = property.value) == null ? void 0 : _D.currencyLabel)}</span></span>`);
        if (((_E = property.value) == null ? void 0 : _E.transactionType) === "location") {
          _push(`<span class="text-muted-foreground text-sm font-medium mb-1.5">/ mois</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (isSoldListing.value) {
          _push(`<div class="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-semibold">`);
          _push(ssrRenderComponent(unref(Tag), { class: "h-3.5 w-3.5" }, null, _parent));
          _push(` ${ssrInterpolate(isLocationTransaction.value ? "Non disponible \u2014 d\xE9j\xE0 pris / lou\xE9" : "Vendu \u2014 transaction cl\xF4tur\xE9e")}</div>`);
        } else if (listingAvailable.value) {
          _push(`<div class="flex items-center gap-2 text-[#1976D2] text-sm font-bold">`);
          _push(ssrRenderComponent(unref(CheckCircle), { class: "h-3.5 w-3.5" }, null, _parent));
          _push(` Annonce en ligne </div>`);
        } else {
          _push(`<div class="flex items-center gap-2 text-[#1565C0] text-sm font-bold">`);
          _push(ssrRenderComponent(unref(EyeOff), { class: "h-3.5 w-3.5" }, null, _parent));
          _push(` D\xE9sactiv\xE9e (visible administrateurs) </div>`);
        }
        _push(`</div><div class="flex items-center gap-4"><div class="relative group cursor-pointer">`);
        if ((_G = (_F = property.value) == null ? void 0 : _F.publisher) == null ? void 0 : _G.photo) {
          _push(`<img${ssrRenderAttr("src", property.value.publisher.photo)} class="h-14 w-14 rounded-full object-cover border-2 border-background shadow-sm transition-transform group-hover:scale-105">`);
        } else {
          _push(`<div class="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-background shadow-sm">${ssrInterpolate((_J = (_I = (_H = property.value) == null ? void 0 : _H.publisher) == null ? void 0 : _I.username) == null ? void 0 : _J.substring(0, 2).toUpperCase())}</div>`);
        }
        if ((_L = (_K = property.value) == null ? void 0 : _K.publisher) == null ? void 0 : _L.photo) {
          _push(`<div class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-white" }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([
          lifecycleState.value === "live" ? "bg-emerald-500" : lifecycleState.value === "hidden" ? "bg-amber-500" : lifecycleState.value === "sold" ? "bg-slate-500" : "bg-[#1976D2]",
          "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card"
        ])}"></div></div><div class="flex-1 min-w-0"><p class="font-bold text-foreground truncate">${ssrInterpolate((_N = (_M = property.value) == null ? void 0 : _M.publisher) == null ? void 0 : _N.username)}</p><p class="text-xs text-muted-foreground truncate">Propri\xE9taire Certifi\xE9</p><div class="flex items-center gap-1 text-amber-500 text-xs mt-0.5">`);
        _push(ssrRenderComponent(unref(Home), { class: "h-3 w-3 fill-amber-500" }, null, _parent));
        _push(`<span class="font-bold">Pro</span></div></div></div><div class="grid gap-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          disabled: isSoldListing.value,
          title: isSoldListing.value ? isLocationTransaction.value.value ? "Ce bien est d\xE9j\xE0 pris" : "Ce bien est d\xE9j\xE0 vendu" : void 0,
          onClick: handleStartReservation,
          class: "w-full h-14 text-base font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl group transition-all disabled:opacity-50 disabled:pointer-events-none"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 mr-2 group-hover:scale-110 transition-transform" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(isSoldListing.value ? isLocationTransaction.value ? "Indisponible" : "D\xE9j\xE0 vendu" : "R\xE9server ce bien")}`);
            } else {
              return [
                createVNode(unref(Calendar), { class: "h-5 w-5 mr-2 group-hover:scale-110 transition-transform" }),
                createTextVNode(" " + toDisplayString(isSoldListing.value ? isLocationTransaction.value ? "Indisponible" : "D\xE9j\xE0 vendu" : "R\xE9server ce bien"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid grid-cols-2 gap-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          class: "h-12 text-sm font-bold border-border hover:bg-muted rounded-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(MessageSquare), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
              _push2(` Message `);
            } else {
              return [
                createVNode(unref(MessageSquare), { class: "h-4 w-4 mr-2" }),
                createTextVNode(" Message ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          class: "h-12 text-sm font-bold border-border hover:bg-muted rounded-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Contacter `);
            } else {
              return [
                createTextVNode(" Contacter ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="text-center"><span class="text-xs text-muted-foreground">R\xE9ponse moyenne: <span class="font-semibold text-foreground">1 heure</span></span></div></div><div class="bg-muted/30 rounded-2xl p-4 flex items-start gap-3 border border-border/50"><div class="p-1.5 bg-background rounded-full shadow-sm shrink-0">`);
        _push(ssrRenderComponent(unref(Home), { class: "h-4 w-4 text-foreground" }, null, _parent));
        _push(`</div><p class="text-xs text-muted-foreground leading-relaxed"><span class="font-semibold text-foreground">Garantie CasaNayo</span> : Ne payez jamais avant d&#39;avoir visit\xE9 le bien. Signalez toute annonce suspecte. </p></div></div></div></div>`);
        _push(ssrRenderComponent(unref(VueEasyLightbox), {
          visible: visibleRef.value,
          imgs: currentLightboxImages.value,
          index: indexRef.value,
          onHide
        }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          open: isResSheetOpen.value,
          "onUpdate:open": ($event) => isResSheetOpen.value = $event
        }, {
          content: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
            if (_push2) {
              _push2(`<div class="flex flex-col h-full bg-white dark:bg-slate-950"${_scopeId}><div class="p-8 border-b border-border/50"${_scopeId}><div class="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Calendar), { class: "size-6 text-primary" }, null, _parent2, _scopeId));
              _push2(`</div><h2 class="text-3xl font-black tracking-tight italic"${_scopeId}>Demande de r\xE9servation</h2><p class="text-muted-foreground font-medium mt-1"${_scopeId}>Planifiez votre visite pour ce bien.</p></div><div class="flex-1 overflow-y-auto p-8 space-y-8"${_scopeId}><div class="space-y-4"${_scopeId}><div class="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50"${_scopeId}><img${ssrRenderAttr("src", ((_b2 = (_a2 = property.value) == null ? void 0 : _a2.images) == null ? void 0 : _b2.main[0]) || "/placeholder.jpg")} class="size-16 rounded-xl object-cover shadow-sm"${_scopeId}><div${_scopeId}><p class="font-bold text-foreground leading-tight"${_scopeId}>${ssrInterpolate((_c2 = property.value) == null ? void 0 : _c2.title)}</p><p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate((_d2 = property.value) == null ? void 0 : _d2.price)} ${ssrInterpolate((_e2 = property.value) == null ? void 0 : _e2.currencyLabel)}</p></div></div></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div class="space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Date d&#39;arriv\xE9e`);
                  } else {
                    return [
                      createTextVNode("Date d'arriv\xE9e")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$6), {
                modelValue: resForm.value.startDate,
                "onUpdate:modelValue": ($event) => resForm.value.startDate = $event,
                type: "date",
                class: "h-12 rounded-xl"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Date de d\xE9part`);
                  } else {
                    return [
                      createTextVNode("Date de d\xE9part")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$6), {
                modelValue: resForm.value.endDate,
                "onUpdate:modelValue": ($event) => resForm.value.endDate = $event,
                type: "date",
                class: "h-12 rounded-xl"
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Type de service`);
                  } else {
                    return [
                      createTextVNode("Type de service")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(["STANDARD", "VIP", "PREMIUM"], (t) => {
                _push2(`<button class="${ssrRenderClass([resForm.value.type === t ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-transparent border-border text-muted-foreground hover:border-primary/50", "h-10 rounded-xl text-[10px] font-black tracking-tighter transition-all border-2"])}"${_scopeId}>${ssrInterpolate(t)}</button>`);
              });
              _push2(`<!--]--></div></div><div class="space-y-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Message (Optionnel)`);
                  } else {
                    return [
                      createTextVNode("Message (Optionnel)")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<textarea placeholder="Avez-vous des pr\xE9cisions \xE0 apporter ?" class="w-full min-h-[120px] p-4 rounded-2xl bg-muted/20 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all placeholder:text-muted-foreground/50"${_scopeId}>${ssrInterpolate(resForm.value.message)}</textarea></div><div class="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 italic"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Info), { class: "h-4 w-4 text-primary shrink-0 mt-0.5" }, null, _parent2, _scopeId));
              _push2(`<p class="text-[10px] text-primary/80 font-medium leading-relaxed"${_scopeId}> Votre demande sera transmise directement au propri\xE9taire. Vous recevrez une notification d\xE8s qu&#39;elle sera trait\xE9e. </p></div></div><div class="p-8 border-t border-border/50 bg-slate-50/50 dark:bg-white/5 mt-auto"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$2), {
                onClick: submitReservation,
                disabled: unref(resStore).isSubmitting || isSoldListing.value,
                class: "w-full h-14 rounded-2xl font-black text-base shadow-2xl shadow-primary/20 group relative overflow-hidden"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="relative z-10 flex items-center justify-center"${_scopeId2}>`);
                    if (unref(resStore).isSubmitting) {
                      _push3(ssrRenderComponent(unref(Loader2), { class: "h-5 w-5 mr-3 animate-spin" }, null, _parent3, _scopeId2));
                    } else {
                      _push3(ssrRenderComponent(unref(ShieldCheck), { class: "h-5 w-5 mr-3 group-hover:scale-110 transition-transform" }, null, _parent3, _scopeId2));
                    }
                    _push3(` ${ssrInterpolate(unref(resStore).isSubmitting ? "Envoi en cours..." : "Confirmer ma demande")}</span>`);
                  } else {
                    return [
                      createVNode("span", { class: "relative z-10 flex items-center justify-center" }, [
                        unref(resStore).isSubmitting ? (openBlock(), createBlock(unref(Loader2), {
                          key: 0,
                          class: "h-5 w-5 mr-3 animate-spin"
                        })) : (openBlock(), createBlock(unref(ShieldCheck), {
                          key: 1,
                          class: "h-5 w-5 mr-3 group-hover:scale-110 transition-transform"
                        })),
                        createTextVNode(" " + toDisplayString(unref(resStore).isSubmitting ? "Envoi en cours..." : "Confirmer ma demande"), 1)
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col h-full bg-white dark:bg-slate-950" }, [
                  createVNode("div", { class: "p-8 border-b border-border/50" }, [
                    createVNode("div", { class: "size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4" }, [
                      createVNode(unref(Calendar), { class: "size-6 text-primary" })
                    ]),
                    createVNode("h2", { class: "text-3xl font-black tracking-tight italic" }, "Demande de r\xE9servation"),
                    createVNode("p", { class: "text-muted-foreground font-medium mt-1" }, "Planifiez votre visite pour ce bien.")
                  ]),
                  createVNode("div", { class: "flex-1 overflow-y-auto p-8 space-y-8" }, [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50" }, [
                        createVNode("img", {
                          src: ((_g2 = (_f2 = property.value) == null ? void 0 : _f2.images) == null ? void 0 : _g2.main[0]) || "/placeholder.jpg",
                          class: "size-16 rounded-xl object-cover shadow-sm"
                        }, null, 8, ["src"]),
                        createVNode("div", null, [
                          createVNode("p", { class: "font-bold text-foreground leading-tight" }, toDisplayString((_h2 = property.value) == null ? void 0 : _h2.title), 1),
                          createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString((_i2 = property.value) == null ? void 0 : _i2.price) + " " + toDisplayString((_j2 = property.value) == null ? void 0 : _j2.currencyLabel), 1)
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("Date d'arriv\xE9e")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          modelValue: resForm.value.startDate,
                          "onUpdate:modelValue": ($event) => resForm.value.startDate = $event,
                          type: "date",
                          class: "h-12 rounded-xl"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                          default: withCtx(() => [
                            createTextVNode("Date de d\xE9part")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$6), {
                          modelValue: resForm.value.endDate,
                          "onUpdate:modelValue": ($event) => resForm.value.endDate = $event,
                          type: "date",
                          class: "h-12 rounded-xl"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                        default: withCtx(() => [
                          createTextVNode("Type de service")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(["STANDARD", "VIP", "PREMIUM"], (t) => {
                          return createVNode("button", {
                            key: t,
                            onClick: ($event) => resForm.value.type = t,
                            class: ["h-10 rounded-xl text-[10px] font-black tracking-tighter transition-all border-2", resForm.value.type === t ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-transparent border-border text-muted-foreground hover:border-primary/50"]
                          }, toDisplayString(t), 11, ["onClick"]);
                        }), 64))
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$5), { class: "text-xs font-black uppercase tracking-widest ml-1 text-muted-foreground" }, {
                        default: withCtx(() => [
                          createTextVNode("Message (Optionnel)")
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => resForm.value.message = $event,
                        placeholder: "Avez-vous des pr\xE9cisions \xE0 apporter ?",
                        class: "w-full min-h-[120px] p-4 rounded-2xl bg-muted/20 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all placeholder:text-muted-foreground/50"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, resForm.value.message]
                      ])
                    ]),
                    createVNode("div", { class: "p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 italic" }, [
                      createVNode(unref(Info), { class: "h-4 w-4 text-primary shrink-0 mt-0.5" }),
                      createVNode("p", { class: "text-[10px] text-primary/80 font-medium leading-relaxed" }, " Votre demande sera transmise directement au propri\xE9taire. Vous recevrez une notification d\xE8s qu'elle sera trait\xE9e. ")
                    ])
                  ]),
                  createVNode("div", { class: "p-8 border-t border-border/50 bg-slate-50/50 dark:bg-white/5 mt-auto" }, [
                    createVNode(unref(_sfc_main$2), {
                      onClick: submitReservation,
                      disabled: unref(resStore).isSubmitting || isSoldListing.value,
                      class: "w-full h-14 rounded-2xl font-black text-base shadow-2xl shadow-primary/20 group relative overflow-hidden"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "relative z-10 flex items-center justify-center" }, [
                          unref(resStore).isSubmitting ? (openBlock(), createBlock(unref(Loader2), {
                            key: 0,
                            class: "h-5 w-5 mr-3 animate-spin"
                          })) : (openBlock(), createBlock(unref(ShieldCheck), {
                            key: 1,
                            class: "h-5 w-5 mr-3 group-hover:scale-110 transition-transform"
                          })),
                          createTextVNode(" " + toDisplayString(unref(resStore).isSubmitting ? "Envoi en cours..." : "Confirmer ma demande"), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        if (showAuthModal.value) {
          _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"><div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"><div class="p-10 text-center"><div class="relative size-24 mx-auto mb-8"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div><div class="relative size-full rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-2xl shadow-primary/40">`);
          _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-12 text-white" }, null, _parent));
          _push(`</div></div><h3 class="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic">Acc\xE8s R\xE9serv\xE9</h3><p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-8 px-4"> Pour effectuer une r\xE9servation, vous devez \xEAtre connect\xE9 \xE0 votre compte CasaNayo. <span class="block mt-2 text-primary">Un abonnement annuel de <span class="text-2xl font-black italic">$4</span> est requis pour acc\xE9der aux services exclusifs.</span></p><div class="grid grid-cols-1 gap-3">`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            onClick: ($event) => unref(router).push("/login"),
            class: "h-14 rounded-2xl font-black text-base uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Se connecter maintenant `);
              } else {
                return [
                  createTextVNode(" Se connecter maintenant ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "ghost",
            onClick: ($event) => showAuthModal.value = false,
            class: "h-14 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Continuer la lecture `);
              } else {
                return [
                  createTextVNode(" Continuer la lecture ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/publications/properties/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-5nUS2Vzr.mjs.map
