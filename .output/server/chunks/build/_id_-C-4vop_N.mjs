import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, createVNode, renderList, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import VueEasyLightbox from 'vue-easy-lightbox';
import { Home, ArrowLeft, MapPin, Maximize, BedDouble, Bath, CheckCircle, ShieldCheck, Loader2, EyeOff, Tag, Trash2, Calendar, MessageSquare, Info } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$6 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$5 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$3 } from './Badge-DOGV3Qys.mjs';
import { _ as _sfc_main$1 } from './Skeleton-BgOY-K4r.mjs';
import { _ as _sfc_main$4 } from './Sheet-vFmJ4Ba5.mjs';
import { e as useAuthStore, b as usePropertyStore, c as useRuntimeConfig } from './server.mjs';
import { u as useReservationStore } from './reservations-V2THLnve.mjs';
import { toast } from 'vue-sonner';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
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
    const propertyId = String(route.params.id);
    const isUpdating = ref(false);
    const toggleAvailability = async () => {
      var _a;
      if (!property.value) return;
      isUpdating.value = true;
      const newStatus = !((_a = foundProperty.value.property) == null ? void 0 : _a.available);
      const result = await propertyStore.updateProperty(
        Number(propertyId),
        property.value.type,
        { available: newStatus },
        config.public.apiBase
      );
      if (result.success) {
        toast.success(newStatus ? "Bien rendu disponible" : "Bien rendu indisponible");
      } else {
        toast.error("Erreur lors de la mise \xE0 jour");
      }
      isUpdating.value = false;
    };
    const markAsSold = async () => {
      if (!property.value) return;
      const confirmSold = confirm("Voulez-vous marquer ce bien comme vendu ? Cela le rendra indisponible.");
      if (!confirmSold) return;
      isUpdating.value = true;
      const result = await propertyStore.updateProperty(
        Number(propertyId),
        property.value.type,
        { available: false },
        // Sold means not available
        config.public.apiBase
      );
      if (result.success) {
        toast.success("Bien marqu\xE9 comme vendu");
      } else {
        toast.error("Erreur lors de la mise \xE0 jour");
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
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      isResSheetOpen.value = true;
    };
    const submitReservation = async () => {
      if (!property.value) return;
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
      }
    };
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
    const foundProperty = computed(() => {
      var _a;
      if (!((_a = propertiesData.value) == null ? void 0 : _a.properties)) return null;
      return propertiesData.value.properties.find(
        (item) => String(item.property.propertyId) === propertyId
      );
    });
    const property = computed(() => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const rawRoot = foundProperty.value;
      if (!rawRoot) return null;
      const p = rawRoot.property;
      const addr = rawRoot.address;
      const images = rawRoot.images || {};
      return {
        id: p.propertyId,
        title: p.title || "Sans titre",
        description: p.description,
        price: typeof p.price === "number" ? p.price.toLocaleString() : p.price,
        currency: ((_a = rawRoot.devise) == null ? void 0 : _a.code) || "USD",
        currencyLabel: ((_b = rawRoot.devise) == null ? void 0 : _b.code) || "USD",
        status: p.available ? "Active" : "Pending",
        transactionType: p.transactionType,
        surface: p.surface,
        rooms: p.rooms,
        bedrooms: p.bedrooms,
        bathrooms: p.bathroom,
        kitchens: p.kitchen,
        livingRooms: p.livingRoom,
        floor: p.floor,
        guarantee: p.guarantee,
        category: (_c = rawRoot.typeProperty) == null ? void 0 : _c.name,
        createdAt: new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
        address: {
          full: addr == null ? void 0 : addr.address,
          commune: addr == null ? void 0 : addr.communeValue,
          quartier: addr == null ? void 0 : addr.quartierValue,
          city: addr == null ? void 0 : addr.cityValue,
          country: addr == null ? void 0 : addr.countryValue
        },
        publisher: {
          username: ((_d = rawRoot.postBy) == null ? void 0 : _d.replace("@@", "")) || "Inconnu",
          id: rawRoot.userId,
          photo: rawRoot.image || null
        },
        type: (_e = rawRoot.typeProperty) == null ? void 0 : _e.name,
        features: ((_f = rawRoot.features) == null ? void 0 : _f.map((f) => f.name)) || [],
        images: {
          main: ((_g = images.main) == null ? void 0 : _g.map((i) => i.publicPath)) || [],
          room: ((_h = images.room) == null ? void 0 : _h.map((i) => i.publicPath)) || [],
          living: ((_i = images.living) == null ? void 0 : _i.map((i) => i.publicPath)) || [],
          kitchen: ((_j = images.kitchen) == null ? void 0 : _j.map((i) => i.publicPath)) || []
        }
      };
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
      if (unref(isLoading) && !property.value) {
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
          variant: ((_g = property.value) == null ? void 0 : _g.status) === "Active" ? "default" : "outline",
          class: ["rounded-full px-2.5 py-0.5 text-xs font-semibold", ((_h = property.value) == null ? void 0 : _h.status) === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-orange-50 text-orange-600 border-orange-200"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate(((_a2 = property.value) == null ? void 0 : _a2.status) === "Active" ? "Valid\xE9" : "En attente")}`);
            } else {
              return [
                createTextVNode(toDisplayString(((_b2 = property.value) == null ? void 0 : _b2.status) === "Active" ? "Valid\xE9" : "En attente"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div><div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-12 h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-sm"><div class="md:col-span-2 md:row-span-2 relative group cursor-pointer h-full"><img${ssrRenderAttr("src", ((_j = (_i = property.value) == null ? void 0 : _i.images) == null ? void 0 : _j.main[0]) || "/placeholder.jpg")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"><div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div></div><div class="md:col-span-2 md:row-span-2 grid grid-cols-2 gap-3 h-full">`);
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
        _push(`</div></div><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 relative"><div class="lg:col-span-8 space-y-10"><div class="flex flex-wrap items-center gap-6 py-6 border-y border-border/50"><div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-5 w-5 text-foreground" }, null, _parent));
        _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(((_k = property.value) == null ? void 0 : _k.surface) || "-")} m\xB2</span><span class="text-xs text-muted-foreground uppercase">Surface</span></div></div><div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
        _push(ssrRenderComponent(unref(Home), { class: "h-5 w-5 text-foreground" }, null, _parent));
        _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(((_l = property.value) == null ? void 0 : _l.rooms) || "-")}</span><span class="text-xs text-muted-foreground uppercase">Pi\xE8ces</span></div></div><div class="flex items-center gap-3 pr-6 border-r border-border/50 last:border-0 lg:last:border-0 last:pr-0">`);
        _push(ssrRenderComponent(unref(BedDouble), { class: "h-5 w-5 text-foreground" }, null, _parent));
        _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(((_m = property.value) == null ? void 0 : _m.bedrooms) || "-")}</span><span class="text-xs text-muted-foreground uppercase">Chambres</span></div></div><div class="flex items-center gap-3 pr-6 border-r-0 lg:border-r border-border/50 last:border-0 last:pr-0">`);
        _push(ssrRenderComponent(unref(Bath), { class: "h-5 w-5 text-foreground" }, null, _parent));
        _push(`<div><span class="block font-bold text-lg leading-none">${ssrInterpolate(((_n = property.value) == null ? void 0 : _n.bathrooms) || "-")}</span><span class="text-xs text-muted-foreground uppercase">Salles de bain</span></div></div></div><div class="space-y-4"><h2 class="text-2xl font-bold tracking-tight">\xC0 propos de ce bien</h2><div class="prose prose-lg prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed font-light"><p class="whitespace-pre-line">${ssrInterpolate((_o = property.value) == null ? void 0 : _o.description)}</p></div></div>`);
        if (((_p = property.value) == null ? void 0 : _p.features) && property.value.features.length) {
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
        _push(`<div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">D\xE9tails techniques</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/30 p-6 rounded-2xl border border-border/50"><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Type</p><p class="font-medium">${ssrInterpolate(((_q = property.value) == null ? void 0 : _q.transactionType) === "vente" ? "Vente" : "Location")}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">\xC9tage</p><p class="font-medium">${ssrInterpolate(((_r = property.value) == null ? void 0 : _r.floor) || "RDC")}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Garantie</p><p class="font-medium">${ssrInterpolate((_s = property.value) == null ? void 0 : _s.guarantee)} mois</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">R\xE9f\xE9rence</p><p class="font-mono text-xs bg-white px-2 py-1 rounded border inline-block">${ssrInterpolate(property.value.id)}</p></div><div class="space-y-1"><p class="text-xs text-muted-foreground uppercase font-semibold">Date</p><p class="font-medium">${ssrInterpolate(property.value.createdAt)}</p></div></div></div><div class="space-y-6"><h2 class="text-2xl font-bold tracking-tight">Localisation</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-border/50 bg-card/50"><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3 w-3" }, null, _parent));
        _push(` Ville</span><p class="font-medium text-foreground">${ssrInterpolate(((_u = (_t = property.value) == null ? void 0 : _t.address) == null ? void 0 : _u.city) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Commune</span><p class="font-medium text-foreground">${ssrInterpolate(((_w = (_v = property.value) == null ? void 0 : _v.address) == null ? void 0 : _w.commune) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Quartier</span><p class="font-medium text-foreground">${ssrInterpolate(((_y = (_x = property.value) == null ? void 0 : _x.address) == null ? void 0 : _y.quartier) || "-")}</p></div><div class="space-y-1"><span class="text-xs text-muted-foreground uppercase font-semibold">Adresse compl\xE8te</span><p class="font-medium text-foreground">${ssrInterpolate(((_A = (_z = property.value) == null ? void 0 : _z.address) == null ? void 0 : _A.full) || "-")}</p></div></div></div></div><div class="lg:col-span-4 relative"><div class="sticky top-24 space-y-6"><div class="rounded-3xl border bg-slate-900 text-white p-6 md:p-8 space-y-6 shadow-xl shadow-slate-200"><div class="flex items-center gap-3 pb-4 border-b border-white/10"><div class="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(`</div><div><h3 class="font-bold text-lg">Actions Admin</h3><p class="text-xs text-white/50">Gestion de la publication</p></div></div><div class="space-y-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: toggleAvailability,
          variant: "secondary",
          disabled: isUpdating.value,
          class: "w-full h-12 rounded-xl font-bold justify-start gap-3 bg-white/10 hover:bg-white/20 border-none text-white transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2, _c2, _d2;
            if (_push2) {
              if (isUpdating.value) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!--[-->`);
                if (((_a2 = property.value) == null ? void 0 : _a2.status) === "Active") {
                  _push2(ssrRenderComponent(unref(EyeOff), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(CheckCircle), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                }
                _push2(`<!--]-->`);
              }
              _push2(` ${ssrInterpolate(((_b2 = property.value) == null ? void 0 : _b2.status) === "Active" ? "Rendre indisponible" : "Rendre disponible")}`);
            } else {
              return [
                isUpdating.value ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "h-4 w-4 animate-spin"
                })) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                  ((_c2 = property.value) == null ? void 0 : _c2.status) === "Active" ? (openBlock(), createBlock(unref(EyeOff), {
                    key: 0,
                    class: "h-4 w-4"
                  })) : (openBlock(), createBlock(unref(CheckCircle), {
                    key: 1,
                    class: "h-4 w-4"
                  }))
                ], 64)),
                createTextVNode(" " + toDisplayString(((_d2 = property.value) == null ? void 0 : _d2.status) === "Active" ? "Rendre indisponible" : "Rendre disponible"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (((_B = property.value) == null ? void 0 : _B.status) === "Active") {
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            onClick: markAsSold,
            disabled: isUpdating.value,
            variant: "outline",
            class: "w-full h-12 rounded-xl font-bold justify-start gap-3 border-white/20 hover:bg-white/5 text-white"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Tag), { class: "h-4 w-4" }, null, _parent2, _scopeId));
                _push2(` Marquer comme vendu `);
              } else {
                return [
                  createVNode(unref(Tag), { class: "h-4 w-4" }),
                  createTextVNode(" Marquer comme vendu ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "destructive",
          class: "w-full h-12 rounded-xl font-bold justify-start gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` Supprimer l&#39;annonce `);
            } else {
              return [
                createVNode(unref(Trash2), { class: "h-4 w-4" }),
                createTextVNode(" Supprimer l'annonce ")
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
        _push(`</div><div class="flex items-center gap-2 text-green-600 text-sm font-medium">`);
        _push(ssrRenderComponent(unref(CheckCircle), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` Disponible imm\xE9diatement </div></div><div class="flex items-center gap-4"><div class="relative group cursor-pointer">`);
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
        _push(`<div class="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card"></div></div><div class="flex-1 min-w-0"><p class="font-bold text-foreground truncate">${ssrInterpolate((_N = (_M = property.value) == null ? void 0 : _M.publisher) == null ? void 0 : _N.username)}</p><p class="text-xs text-muted-foreground truncate">Propri\xE9taire Certifi\xE9</p><div class="flex items-center gap-1 text-amber-500 text-xs mt-0.5">`);
        _push(ssrRenderComponent(unref(Home), { class: "h-3 w-3 fill-amber-500" }, null, _parent));
        _push(`<span class="font-bold">Pro</span></div></div></div><div class="grid gap-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: handleStartReservation,
          class: "w-full h-14 text-base font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-2xl group transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { class: "h-5 w-5 mr-2 group-hover:scale-110 transition-transform" }, null, _parent2, _scopeId));
              _push2(` R\xE9server ce bien `);
            } else {
              return [
                createVNode(unref(Calendar), { class: "h-5 w-5 mr-2 group-hover:scale-110 transition-transform" }),
                createTextVNode(" R\xE9server ce bien ")
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
                disabled: unref(resStore).isSubmitting,
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
                      disabled: unref(resStore).isSubmitting,
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
//# sourceMappingURL=_id_-C-4vop_N.mjs.map
