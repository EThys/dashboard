import { defineComponent, computed, withAsyncContext, ref, resolveComponent, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, createTextVNode, reactive, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderVNode, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { ArrowLeft, Maximize, MapPin, Home, Heart, Share2, BedDouble, Bath, ChefHat, Briefcase, Users, CheckCircle2, XCircle, Zap, Droplets, Calendar, X, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { f as useRoute, a as useRouter, b as usePropertyStore, e as useAuthStore, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useReservationStore } from './reservations-V2THLnve.mjs';
import VueEasyLightbox from 'vue-easy-lightbox';
import { _ as _sfc_main$2 } from './CasaLoader-BMTTq4Tc.mjs';
import { _ as _sfc_main$5 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$4 } from './Label-DssVEliA.mjs';
import { u as useAsyncData } from './asyncData-B0whOYVl.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import '@tanstack/vue-query';
import 'vue-sonner';
import 'perfect-debounce';

function getQualityIndicator(value) {
  if (value >= 80) return "Excellent";
  if (value >= 60) return "Bon";
  if (value >= 40) return "Moyen";
  if (value >= 20) return "Faible";
  return "Tr\xE8s faible";
}
function getQualityColor(value) {
  if (value >= 80) return "text-green-600";
  if (value >= 60) return "text-blue-600";
  if (value >= 40) return "text-yellow-600";
  if (value >= 20) return "text-orange-600";
  return "text-red-600";
}
function extractLocation(item) {
  var _a, _b;
  const localAddr = item.localAddress;
  const addr = item.address;
  if (((_a = localAddr == null ? void 0 : localAddr.commune) == null ? void 0 : _a.name) && ((_b = localAddr == null ? void 0 : localAddr.city) == null ? void 0 : _b.name)) {
    return `${localAddr.commune.name}, ${localAddr.city.name}`;
  }
  if (addr) {
    if (addr.communeValue && addr.cityValue) {
      return `${addr.communeValue}, ${addr.cityValue}`;
    }
    if (addr.cityValue) {
      return `${addr.cityValue}, RDC`;
    }
  }
  if ("funeraire" in item) {
    const f = item.funeraire;
    if (f.communeValue && f.cityValue) {
      return `${f.communeValue}, ${f.cityValue}`;
    }
  }
  if ("terrain" in item) {
    const t = item.terrain;
    if (t.communeValue && t.cityValue) {
      return `${t.communeValue}, ${t.cityValue}`;
    }
  }
  if ("hotel" in item) {
    const h = item.hotel;
    if (h.communeValue && h.cityValue) {
      return `${h.communeValue}, ${h.cityValue}`;
    }
  }
  return "RDC";
}
function extractImages(item) {
  const images = [];
  if ("images" in item && Array.isArray(item.images)) {
    item.images.forEach((img) => {
      if (img.path) images.push(img.path);
      if (img.publicPath) images.push(img.publicPath);
    });
  }
  if ("images" in item && item.images && typeof item.images === "object" && !Array.isArray(item.images)) {
    const propImages = item.images;
    if (propImages.main) propImages.main.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.room) propImages.room.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.living) propImages.living.forEach((img) => img.publicPath && images.push(img.publicPath));
    if (propImages.kitchen) propImages.kitchen.forEach((img) => img.publicPath && images.push(img.publicPath));
  }
  if ("hotel" in item && item.hotel.image) {
    images.push(item.hotel.image);
  }
  return [...new Set(images)].filter(Boolean);
}
function normalizeBureau(item) {
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.bureau.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  if (item.bureau.equip) features.push("\xC9quip\xE9");
  return {
    id: item.bureau.id,
    title: item.bureau.title,
    location,
    fullAddress: `${item.address.address}, ${location}`,
    price: priceDisplay,
    frequency: item.bureau.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: true,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: item.bureau.roomMeet,
    numberPiece: item.bureau.numberPiece,
    isEquipped: item.bureau.equip,
    area: "",
    type: "Bureau",
    status: item.bureau.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.bureau.description,
    electricity: item.bureau.electric,
    electricityInfo: getQualityIndicator(item.bureau.electric),
    electricityColor: getQualityColor(item.bureau.electric),
    water: item.bureau.water,
    waterInfo: getQualityIndicator(item.bureau.water),
    waterColor: getQualityColor(item.bureau.water),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.bureau.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeFestive(item) {
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.festive.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  if (item.festive.pisteDanse) features.push("Piste de danse");
  if (item.festive.decore) features.push("D\xE9cor\xE9");
  return {
    id: item.festive.id,
    title: item.festive.title,
    location,
    fullAddress: `${item.address.address}, ${location}`,
    price: priceDisplay,
    frequency: item.festive.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: true,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: true,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: item.festive.capacityPeople,
    roomMeet: 0,
    numberPiece: 0,
    area: "",
    type: "Salle de f\xEAte",
    status: item.festive.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.festive.description,
    electricity: item.festive.electric,
    electricityInfo: getQualityIndicator(item.festive.electric),
    electricityColor: getQualityColor(item.festive.electric),
    water: item.festive.water,
    waterInfo: getQualityIndicator(item.festive.water),
    waterColor: getQualityColor(item.festive.water),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.festive.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeFuneraire(item) {
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.funeraire.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = item.feature.map((f) => f.name);
  const capacity = typeof item.funeraire.capacityPeople === "string" ? parseInt(item.funeraire.capacityPeople) || 0 : item.funeraire.capacityPeople || 0;
  return {
    id: item.funeraire.id,
    title: item.funeraire.title,
    location,
    fullAddress: `${item.address.address}, ${location}`,
    price: priceDisplay,
    frequency: item.funeraire.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: true,
    isHotel: false,
    isTerrain: false,
    isEvent: true,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity,
    roomMeet: 0,
    numberPiece: 0,
    area: "",
    type: "Espace fun\xE9raire",
    status: item.funeraire.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.funeraire.description,
    electricity: item.funeraire.electric,
    electricityInfo: getQualityIndicator(item.funeraire.electric),
    electricityColor: getQualityColor(item.funeraire.electric),
    water: item.funeraire.water,
    waterInfo: getQualityIndicator(item.funeraire.water),
    waterColor: getQualityColor(item.funeraire.water),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1519167758481-83f29da8fd14?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.funeraire.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeTerrain(item) {
  var _a;
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.terrain.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = ((_a = item.feature) == null ? void 0 : _a.map((f) => f.name)) || [];
  return {
    id: item.terrain.id,
    title: item.terrain.title,
    location,
    fullAddress: `${item.address.address}, ${location}`,
    price: priceDisplay,
    frequency: item.terrain.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: true,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    area: `${item.terrain.surface} m\xB2`,
    type: "Terrain",
    status: item.terrain.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.terrain.description,
    electricity: 0,
    electricityInfo: "Non applicable",
    electricityColor: "text-muted-foreground",
    water: 0,
    waterInfo: "Non applicable",
    waterColor: "text-muted-foreground",
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.terrain.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeHotel(item) {
  var _a, _b;
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.hotel.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = ((_a = item.feature) == null ? void 0 : _a.map((f) => f.name)) || [];
  return {
    id: item.hotel.id,
    title: item.hotel.title,
    location,
    fullAddress: `${item.hotel.address || ((_b = item.address) == null ? void 0 : _b.address) || ""}, ${location}`,
    price: priceDisplay,
    frequency: item.hotel.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: true,
    isTerrain: false,
    isEvent: false,
    isResidential: false,
    beds: 0,
    baths: 0,
    kitchen: 0,
    livingRoom: 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    area: "",
    type: "H\xF4tel",
    status: item.hotel.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.hotel.description,
    electricity: 0,
    electricityInfo: "Non applicable",
    electricityColor: "text-muted-foreground",
    water: 0,
    waterInfo: "Non applicable",
    waterColor: "text-muted-foreground",
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.hotel.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
function normalizeStandardProperty(item) {
  var _a, _b;
  const location = extractLocation(item);
  const images = extractImages(item);
  const currencyCode = item.devise.code;
  const symbol = currencyCode === "USD" ? "$" : "FC";
  const formattedPrice = item.property.price.toLocaleString("fr-FR");
  const priceDisplay = currencyCode === "USD" ? `${formattedPrice}${symbol}` : `${formattedPrice}${symbol}`;
  const features = ((_a = item.features) == null ? void 0 : _a.map((f) => f.name)) || [];
  return {
    id: item.property.propertyId,
    title: item.property.title,
    location,
    fullAddress: `${item.address.address}, ${location}`,
    price: priceDisplay,
    frequency: item.property.transactionType === "location" ? "/mois" : "",
    currencyCode,
    currencySymbol: symbol,
    currencyLabel: currencyCode === "USD" ? "Dollars am\xE9ricains" : "Franc congolais",
    isBureau: false,
    isFestive: false,
    isFuneraire: false,
    isHotel: false,
    isTerrain: false,
    isEvent: false,
    isResidential: true,
    beds: item.property.bedrooms || 0,
    baths: item.property.bathroom || 0,
    kitchen: item.property.kitchen || 0,
    livingRoom: item.property.livingRoom || 0,
    capacity: 0,
    roomMeet: 0,
    numberPiece: 0,
    area: item.property.surface && item.property.surface > 0 ? `${item.property.surface} m\xB2` : item.property.livingRoom ? `${item.property.livingRoom} salon(s)` : "",
    type: ((_b = item.typeProperty) == null ? void 0 : _b.name) || "Propri\xE9t\xE9",
    status: item.property.transactionType === "location" ? "\xC0 Louer" : "\xC0 Vendre",
    description: item.property.description,
    electricity: item.property.electricity || 0,
    electricityInfo: getQualityIndicator(item.property.electricity || 0),
    electricityColor: getQualityColor(item.property.electricity || 0),
    water: item.property.water || 0,
    waterInfo: getQualityIndicator(item.property.water || 0),
    waterColor: getQualityColor(item.property.water || 0),
    features,
    images: images.length ? images : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80"],
    imagesByCategory: {
      main: images,
      room: [],
      living: [],
      kitchen: []
    },
    agent: {
      name: item.postBy.replace("@@", "@") || "Agent CasaNayo",
      phone: "+243 81 234 56 78",
      email: "contact@casanayo.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      profileImage: item.image
    },
    publisherImage: item.image,
    createdAt: new Date(item.property.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PropertyVisitModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    propertyId: {},
    propertyTitle: {},
    propertyType: {}
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    useReservationStore();
    useAuthStore();
    const isLoading = ref(false);
    const availableHours = Array.from({ length: 12 }, (_, i) => {
      const h2 = i + 7;
      return `${h2.toString().padStart(2, "0")}:00:00`;
    });
    const form = reactive({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      time: "10:00:00",
      message: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4" }, _attrs))}><div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in transition-opacity"></div><div class="relative bg-white dark:bg-slate-950 w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200"><button class="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">`);
        _push(ssrRenderComponent(unref(X), { class: "h-4 w-4" }, null, _parent));
        _push(`</button><h2 class="text-xl font-bold mb-1">Programmer une visite</h2><p class="text-sm text-muted-foreground mb-6">Pour : ${ssrInterpolate(__props.propertyTitle)}</p><form class="space-y-4"><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$4), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Date souhait\xE9e`);
            } else {
              return [
                createTextVNode("Date souhait\xE9e")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$5), {
          type: "date",
          modelValue: unref(form).date,
          "onUpdate:modelValue": ($event) => unref(form).date = $event,
          required: ""
        }, null, _parent));
        _push(`</div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$4), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Heure (07h - 18h)`);
            } else {
              return [
                createTextVNode("Heure (07h - 18h)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"><!--[-->`);
        ssrRenderList(unref(availableHours), (h2) => {
          _push(`<option${ssrRenderAttr("value", h2)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).time) ? ssrLooseContain(unref(form).time, h2) : ssrLooseEqual(unref(form).time, h2)) ? " selected" : ""}>${ssrInterpolate(h2.slice(0, 5))}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$4), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Message (Optionnel)`);
            } else {
              return [
                createTextVNode("Message (Optionnel)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Je souhaite visiter ce bien...">${ssrInterpolate(unref(form).message)}</textarea></div><div class="flex justify-end gap-3 pt-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          type: "button",
          variant: "ghost",
          onClick: ($event) => _ctx.$emit("close")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Annuler`);
            } else {
              return [
                createTextVNode("Annuler")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          type: "submit",
          disabled: unref(isLoading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isLoading)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` Valider la visite `);
            } else {
              return [
                unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-4 w-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" Valider la visite ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modals/PropertyVisitModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const config = useRuntimeConfig();
    const propertyStore = usePropertyStore();
    const authStore = useAuthStore();
    useReservationStore();
    const propertyId = Number(route.params.id);
    const rawProperty = computed(
      () => propertyStore.getPropertyById(propertyId)
    );
    const { data: fetchComplete, pending: isLoading } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `property-${propertyId}`,
      async () => {
        await Promise.all([
          propertyStore.bureaux.length === 0 ? propertyStore.fetchBureaux(config.public.apiBase) : Promise.resolve(),
          propertyStore.festives.length === 0 ? propertyStore.fetchFestives(config.public.apiBase) : Promise.resolve(),
          propertyStore.funeraires.length === 0 ? propertyStore.fetchFuneraires(config.public.apiBase) : Promise.resolve(),
          propertyStore.terrains.length === 0 ? propertyStore.fetchTerrains(config.public.apiBase) : Promise.resolve(),
          propertyStore.hotels.length === 0 ? propertyStore.fetchHotels(config.public.apiBase) : Promise.resolve(),
          propertyStore.properties.length === 0 ? propertyStore.fetchProperties(config.public.apiBase) : Promise.resolve()
        ]);
        return true;
      },
      {
        lazy: true,
        server: false
      }
    )), __temp = await __temp, __restore(), __temp);
    const property = computed(() => {
      const raw = rawProperty.value;
      if (!raw) return null;
      try {
        if ("bureau" in raw) return normalizeBureau(raw);
        if ("festive" in raw) return normalizeFestive(raw);
        if ("funeraire" in raw) return normalizeFuneraire(raw);
        if ("terrain" in raw) return normalizeTerrain(raw);
        if ("hotel" in raw) return normalizeHotel(raw);
        if ("property" in raw) return normalizeStandardProperty(raw);
        return null;
      } catch (error) {
        console.error("Failed to normalize property:", error);
        return null;
      }
    });
    const currentImageIndex = ref(0);
    const lightboxVisible = ref(false);
    const lightboxIndex = ref(0);
    const lightboxImgs = ref([]);
    const isFavorite = ref(false);
    const toggleFavorite = () => isFavorite.value = !isFavorite.value;
    const shareProperty = async () => {
      var _a, _b;
      if ((void 0).share) {
        try {
          await (void 0).share({
            title: (_a = property.value) == null ? void 0 : _a.title,
            text: `D\xE9couvrez cette propri\xE9t\xE9 : ${(_b = property.value) == null ? void 0 : _b.title}`,
            url: (void 0).location.href
          });
        } catch (err) {
          console.log("Share canceled");
        }
      } else {
        (void 0).clipboard.writeText((void 0).location.href);
        alert("Lien copi\xE9 !");
      }
    };
    const contactAgent = () => {
      if (!authStore.isAuthenticated) {
        return navigateTo(`/login?reason=reservation&redirect=${route.fullPath}`);
      }
      isVisitModalOpen.value = true;
    };
    const isVisitModalOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_FileText = resolveComponent("FileText");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-4a536fb3>`);
      if (!unref(property) && unref(isLoading)) {
        _push(`<div class="min-h-screen flex items-center justify-center" data-v-4a536fb3>`);
        _push(ssrRenderComponent(_sfc_main$2, { size: "lg" }, null, _parent));
        _push(`</div>`);
      } else if (unref(property)) {
        _push(`<div class="min-h-screen" data-v-4a536fb3><div class="relative h-[60vh] md:h-[70vh] group bg-slate-900 border-b border-white/10 overflow-hidden" data-v-4a536fb3><button class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/back" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 group-hover/back:-translate-x-1 transition-transform" }, null, _parent));
        _push(`</button><button class="absolute top-4 md:top-8 right-4 md:right-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all group/zoom" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 group-hover/zoom:scale-110 transition-transform" }, null, _parent));
        _push(`</button><div class="absolute inset-0 z-0" data-v-4a536fb3><!--[-->`);
        ssrRenderList(unref(property).images, (img, idx) => {
          _push(`<div class="${ssrRenderClass([idx === unref(currentImageIndex) ? "opacity-100" : "opacity-0", "absolute inset-0 transition-opacity duration-700 ease-in-out"])}" data-v-4a536fb3><div class="absolute inset-0 scale-110 blur-xl brightness-50" data-v-4a536fb3><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover opacity-80" data-v-4a536fb3></div><div class="absolute inset-0 flex items-center justify-center" data-v-4a536fb3><img${ssrRenderAttr("src", img)} class="w-full h-full object-contain shadow-2xl" data-v-4a536fb3></div><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" data-v-4a536fb3></div></div>`);
        });
        _push(`<!--]--></div>`);
        if (unref(property).images.length > 1) {
          _push(`<div class="absolute inset-0 z-10 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" data-v-4a536fb3><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
          _push(`</button><button class="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all pointer-events-auto" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6 rotate-180" }, null, _parent));
          _push(`</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32" data-v-4a536fb3><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-4a536fb3><div class="flex flex-col md:flex-row items-end justify-between gap-6" data-v-4a536fb3><div class="space-y-4 max-w-3xl" data-v-4a536fb3><div class="flex flex-wrap items-center gap-3" data-v-4a536fb3><span class="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/25" data-v-4a536fb3>${ssrInterpolate(unref(property).status)}</span><span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).location)}</span><span class="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium flex items-center gap-2" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Home), { class: "h-3.5 w-3.5" }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).type)}</span></div><h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg" data-v-4a536fb3>${ssrInterpolate(unref(property).title)}</h1><p class="text-white/80 max-w-xl line-clamp-2 text-lg" data-v-4a536fb3> Une opportunit\xE9 unique \xE0 ne pas manquer. </p></div><div class="flex flex-col gap-3 min-w-[200px]" data-v-4a536fb3><div class="text-right text-white mb-2" data-v-4a536fb3><div class="text-sm opacity-80 mb-1" data-v-4a536fb3>Prix</div><div class="text-3xl font-black text-primary drop-shadow-sm filter brightness-110" data-v-4a536fb3>${ssrInterpolate(unref(property).price)} <span class="text-lg text-white/80 font-normal" data-v-4a536fb3>${ssrInterpolate(unref(property).frequency)}</span></div><div class="text-xs opacity-70 mt-1" data-v-4a536fb3>${ssrInterpolate(unref(property).currencyLabel)}</div></div><div class="flex gap-3 justify-end" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          onClick: toggleFavorite,
          size: "icon",
          variant: "secondary",
          class: "rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Heart), {
                class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Heart), {
                  class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
                }, null, 8, ["class"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          onClick: shareProperty,
          size: "icon",
          variant: "secondary",
          class: "rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Share2), { class: "h-5 w-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Share2), { class: "h-5 w-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div></div><section class="py-16 -mt-8 relative z-30" data-v-4a536fb3><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-4a536fb3><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-4a536fb3><div class="lg:col-span-2 space-y-12" data-v-4a536fb3><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-4a536fb3>`);
        if (unref(property).isResidential) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(BedDouble), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).beds)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Chambres</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Bath), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).baths)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Salles de bain</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(ChefHat), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).kitchen)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Cuisines</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).area)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Surface</span></div><!--]-->`);
        } else if (unref(property).isBureau) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Briefcase), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).numberPiece)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Pi\xE8ces</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Users), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).roomMeet)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>R\xE9unions</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(property).isEquipped ? unref(CheckCircle2) : unref(XCircle)), {
            class: ["h-6 w-6 group-hover:scale-110 transition-transform", unref(property).isEquipped ? "text-green-500" : "text-muted-foreground"]
          }, null), _parent);
          _push(`<span class="text-xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).isEquipped ? "Oui" : "Non")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Meubl\xE9</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-lg font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).area || "-")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Surface</span></div><!--]-->`);
        } else if (unref(property).isHotel) {
          _push(`<div class="col-span-4 bg-muted/20 p-6 rounded-2xl text-center" data-v-4a536fb3><p class="text-muted-foreground" data-v-4a536fb3>Voir les d\xE9tails de l&#39;h\xE9bergement dans la description ci-dessous.</p></div>`);
        } else if (unref(property).isEvent || unref(property).isFuneraire || unref(property).isFestive) {
          _push(`<!--[--><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Users), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).capacity)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Capacit\xE9</span></div><div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).area || "-")}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Surface</span></div><!--]-->`);
        } else if (unref(property).isTerrain) {
          _push(`<div class="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 transition-colors group" data-v-4a536fb3>`);
          _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-primary group-hover:scale-110 transition-transform" }, null, _parent));
          _push(`<span class="text-2xl font-black" data-v-4a536fb3>${ssrInterpolate(unref(property).area)}</span><span class="text-xs text-muted-foreground uppercase tracking-wide" data-v-4a536fb3>Surface Totale</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="bg-card rounded-3xl p-8 border border-border/50 shadow-sm" data-v-4a536fb3><h2 class="text-2xl font-bold mb-6 flex items-center gap-2" data-v-4a536fb3>`);
        _push(ssrRenderComponent(_component_FileText, { class: "h-6 w-6 text-primary" }, null, _parent));
        _push(` Description </h2><div class="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line" data-v-4a536fb3>${ssrInterpolate(unref(property).description)}</div></div>`);
        if (unref(property).features && unref(property).features.length > 0) {
          _push(`<div data-v-4a536fb3><h2 class="text-2xl font-bold mb-6" data-v-4a536fb3>Caract\xE9ristiques</h2><div class="grid grid-cols-2 md:grid-cols-3 gap-4" data-v-4a536fb3><!--[-->`);
          ssrRenderList(unref(property).features, (feature) => {
            _push(`<div class="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50" data-v-4a536fb3>`);
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-5 w-5 text-primary flex-shrink-0" }, null, _parent));
            _push(`<span class="font-medium" data-v-4a536fb3>${ssrInterpolate(feature)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-4a536fb3><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4" data-v-4a536fb3><div class="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Zap), { class: "h-7 w-7 text-yellow-600" }, null, _parent));
        _push(`</div><div data-v-4a536fb3><p class="text-sm text-muted-foreground font-medium uppercase tracking-wide" data-v-4a536fb3>\xC9LECTRICIT\xC9</p><p class="${ssrRenderClass([unref(property).electricityColor, "text-lg font-bold"])}" data-v-4a536fb3>${ssrInterpolate(unref(property).electricityInfo)}</p></div></div><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4" data-v-4a536fb3><div class="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Droplets), { class: "h-7 w-7 text-blue-600" }, null, _parent));
        _push(`</div><div data-v-4a536fb3><p class="text-sm text-muted-foreground font-medium uppercase tracking-wide" data-v-4a536fb3>EAU</p><p class="${ssrRenderClass([unref(property).waterColor, "text-lg font-bold"])}" data-v-4a536fb3>${ssrInterpolate(unref(property).waterInfo)}</p></div></div></div>`);
        if (unref(property).images.length > 0) {
          _push(`<div data-v-4a536fb3><h2 class="text-2xl font-bold mb-6" data-v-4a536fb3>Galerie Photos</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-4a536fb3><!--[-->`);
          ssrRenderList(unref(property).images, (img, idx) => {
            _push(`<div class="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group" data-v-4a536fb3><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-4a536fb3><div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" data-v-4a536fb3></div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" data-v-4a536fb3>`);
            _push(ssrRenderComponent(unref(Maximize), { class: "h-8 w-8 text-white drop-shadow-lg" }, null, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-4a536fb3><div class="sticky top-32 space-y-6" data-v-4a536fb3><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg" data-v-4a536fb3><div class="text-center mb-6" data-v-4a536fb3><div class="w-24 h-24 mx-auto rounded-full p-1 border-2 border-primary mb-3 relative cursor-pointer hover:scale-105 transition-transform group/profile" data-v-4a536fb3><img${ssrRenderAttr("src", unref(property).agent.profileImage || unref(property).agent.avatar)} class="w-full h-full rounded-full object-cover" data-v-4a536fb3><div class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Maximize), { class: "h-6 w-6 text-white drop-shadow-md" }, null, _parent));
        _push(`</div><div class="absolute bottom-1 right-1 bg-green-500 rounded-full p-1 border-2 border-card text-white" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3 w-3" }, null, _parent));
        _push(`</div></div><h3 class="text-xl font-bold mb-1" data-v-4a536fb3>${ssrInterpolate(unref(property).agent.name)}</h3></div><div class="space-y-4" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), {
          onClick: contactAgent,
          class: "w-full rounded-xl h-14 font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Calendar), { class: "mr-2 h-5 w-5" }, null, _parent2, _scopeId));
              _push2(` Programmer une visite `);
            } else {
              return [
                createVNode(unref(Calendar), { class: "mr-2 h-5 w-5" }),
                createTextVNode(" Programmer une visite ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mt-8 pt-6 border-t border-border/50" data-v-4a536fb3><div class="flex items-center justify-between text-sm text-muted-foreground" data-v-4a536fb3><div class="flex items-center gap-2" data-v-4a536fb3>`);
        _push(ssrRenderComponent(unref(Calendar), { class: "h-4 w-4" }, null, _parent));
        _push(`<span data-v-4a536fb3>Publi\xE9 le</span></div><span class="font-medium text-foreground" data-v-4a536fb3>${ssrInterpolate(unref(property).createdAt)}</span></div></div></div></div></div></div></div></section></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(property)) {
        _push(ssrRenderComponent(unref(VueEasyLightbox), {
          visible: unref(lightboxVisible),
          imgs: unref(lightboxImgs),
          index: unref(lightboxIndex),
          onHide: ($event) => lightboxVisible.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$1, {
        isOpen: unref(isVisitModalOpen),
        propertyId: unref(propertyId),
        propertyTitle: ((_a = unref(property)) == null ? void 0 : _a.title) || "",
        propertyType: ((_b = unref(property)) == null ? void 0 : _b.type) || "",
        onClose: ($event) => isVisitModalOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/properties/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4a536fb3"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-BUOdoPk1.mjs.map
