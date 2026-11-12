import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import { ArrowLeft, MapPin, RefreshCw, Loader2, Pencil, Plus, ImageIcon, ZoomIn, BedDouble, ZoomOut, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$4 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$3 } from './Label-DssVEliA.mjs';
import { o as useRoute, a as useRouter, m as useAuthStore, f as usePropertyStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { f as formatListingPlace } from './propertyNormalizer-DiijNhdR.mjs';
import { l as lowestHotelRoomOffer } from './hotelStartingPrice-TSwrGxRW.mjs';
import { h as hotelTimeline } from './hotelTimeline-Kaah3oiT.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { u as useAsyncData } from './asyncData-DaMIbxNX.mjs';
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
import 'vue-router';
import '@tanstack/vue-query';
import './transactionDisplay-GAAD372w.mjs';
import './currency-BoakoUK-.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ImageLightbox",
  __ssrInlineRender: true,
  props: {
    images: {},
    index: {}
  },
  emits: ["close", "update:index"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const zoom = ref(1);
    watch(
      () => props.index,
      () => {
        zoom.value = 1;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "fixed inset-0 z-[120] flex flex-col bg-black/90 text-white",
        role: "dialog",
        "aria-modal": "true"
      }, _attrs))}><div class="flex items-center justify-between gap-3 px-4 py-3"><p class="text-sm font-semibold">${ssrInterpolate(__props.index + 1)} / ${ssrInterpolate(__props.images.length)}</p><div class="flex items-center gap-2"><button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Zoom arri\xE8re">`);
      _push(ssrRenderComponent(unref(ZoomOut), { class: "size-5" }, null, _parent));
      _push(`</button><button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Zoom avant">`);
      _push(ssrRenderComponent(unref(ZoomIn), { class: "size-5" }, null, _parent));
      _push(`</button><button type="button" class="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Fermer">`);
      _push(ssrRenderComponent(unref(X), { class: "size-5" }, null, _parent));
      _push(`</button></div></div><div class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">`);
      if (__props.images.length > 1) {
        _push(`<button type="button" class="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Photo pr\xE9c\xE9dente">`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "size-6" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.images[__props.index]) {
        _push(`<img${ssrRenderAttr("src", __props.images[__props.index])} alt="" class="max-h-full max-w-full object-contain transition-transform duration-150" style="${ssrRenderStyle({ transform: `scale(${zoom.value})` })}">`);
      } else {
        _push(`<!---->`);
      }
      if (__props.images.length > 1) {
        _push(`<button type="button" class="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Photo suivante">`);
        _push(ssrRenderComponent(unref(ChevronRight), { class: "size-6" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.images.length > 1) {
        _push(`<div class="flex gap-2 overflow-x-auto px-4 py-3"><!--[-->`);
        ssrRenderList(__props.images, (src, thumb) => {
          _push(`<button type="button" class="${ssrRenderClass([thumb === __props.index ? "border-white" : "border-white/20 opacity-70", "h-14 w-20 shrink-0 overflow-hidden rounded-lg border"])}"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/dashboard/ImageLightbox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const propertyStore = usePropertyStore();
    const hotelId = computed(() => Number(route.params.id));
    const { data: hotelRow, pending: pendingHotel, refresh: refreshHotel } = useAsyncData(
      "manager-hotel-detail",
      async () => {
        var _a, _b, _c;
        const apiBase = config.public.apiBase;
        const uid = (_a = auth.user) == null ? void 0 : _a.userId;
        if (!uid || !auth.token) return null;
        const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`);
        const res = await $fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } });
        const list = (_c = (_b = res == null ? void 0 : res.data) != null ? _b : res) != null ? _c : [];
        const arr = Array.isArray(list) ? list : [];
        return arr.find((row) => {
          var _a2, _b2;
          const h = (_a2 = row == null ? void 0 : row.hotel) != null ? _a2 : row;
          const hid = (_b2 = h == null ? void 0 : h.id) != null ? _b2 : h == null ? void 0 : h.hotelId;
          return Number(hid) === hotelId.value;
        });
      },
      { watch: [hotelId], server: false }
    );
    const hotel = computed(() => {
      var _a, _b;
      return (_b = (_a = hotelRow.value) == null ? void 0 : _a.hotel) != null ? _b : hotelRow.value;
    });
    const { data: roomsRes, pending: pendingRooms, refresh: refreshRooms } = useAsyncData(
      "manager-hotel-rooms",
      async () => {
        const apiBase = config.public.apiBase;
        const url = joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic);
        return $fetch(url).catch(() => null);
      },
      { watch: [hotelId], server: false }
    );
    function parseRooms(raw) {
      var _a, _b, _c, _d;
      const list = (_d = (_c = (_b = (_a = raw == null ? void 0 : raw.data) != null ? _a : raw == null ? void 0 : raw.chambre) != null ? _b : raw == null ? void 0 : raw.chambres) != null ? _c : raw) != null ? _d : [];
      const arr = Array.isArray(list) ? list : [];
      return arr.map((x) => {
        var _a2;
        return (_a2 = x.chambre) != null ? _a2 : x;
      }).filter((ch) => {
        var _a2, _b2;
        return Number((_b2 = ch.hotelId) != null ? _b2 : (_a2 = ch.hotel) == null ? void 0 : _a2.id) === hotelId.value;
      });
    }
    function roomsFromStructure(row) {
      const structure = row == null ? void 0 : row.structure;
      if (!Array.isArray(structure) || !structure.length) return [];
      const out = [];
      for (const s of structure) {
        const c = s.chambre;
        if (!c) continue;
        if (Number(c.hotelId) !== hotelId.value) continue;
        const rawImgs = s.image;
        const paths = Array.isArray(rawImgs) ? rawImgs.map((im) => im.path || im.publicPath).filter(Boolean) : [];
        out.push({
          ...c,
          _cover: paths[0] || "",
          _paths: paths
        });
      }
      return out;
    }
    const startingPrice = computed(() => lowestHotelRoomOffer(rooms.value));
    const activity = computed(() => {
      const current = hotel.value;
      const roomDates = rooms.value.flatMap((room) => [room.createdAt, room.updatedAt]);
      const roomPhotos = rooms.value.flatMap((room) => {
        const paths = room._paths;
        return Array.isArray(paths) ? paths.filter((path) => typeof path === "string") : [];
      });
      return hotelTimeline({
        createdAt: current == null ? void 0 : current.createdAt,
        updatedAt: current == null ? void 0 : current.updatedAt,
        imageUrls: [...gallery.value, ...roomPhotos],
        roomDates
      });
    });
    const hotelOnline = computed(() => {
      const current = hotel.value;
      return (current == null ? void 0 : current.sold) !== true && (current == null ? void 0 : current.available) !== false;
    });
    function roomCover(r) {
      var _a, _b, _c, _d;
      return r._cover || r.image || ((_b = (_a = r.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.path) || ((_d = (_c = r.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.image) || "";
    }
    const gallery = computed(() => {
      const row = hotelRow.value;
      const current = hotel.value;
      const paths = [];
      const push = (value) => {
        const url = String(value != null ? value : "").trim();
        if (url && !paths.includes(url)) paths.push(url);
      };
      push(current == null ? void 0 : current.image);
      push(row == null ? void 0 : row.image);
      const images = row == null ? void 0 : row.images;
      if (Array.isArray(images)) {
        for (const image of images) {
          if (image && typeof image === "object") {
            const file = image;
            push(file.path || file.publicPath);
          } else {
            push(image);
          }
        }
      }
      return paths;
    });
    const placeLabel = computed(() => {
      const current = hotel.value;
      if (!current) return "";
      return formatListingPlace({
        address: current.address,
        quartierValue: current.quartierValue,
        communeValue: current.communeValue,
        cityValue: current.cityValue,
        countryValue: current.countryValue
      });
    });
    const rooms = computed(() => {
      const row = hotelRow.value;
      const fromStruct = roomsFromStructure(row);
      if (fromStruct.length) return fromStruct;
      return parseRooms(roomsRes.value).map((r) => {
        var _a, _b, _c, _d;
        return {
          ...r,
          _cover: ((_b = (_a = r.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.path) || ((_d = (_c = r.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.image) || r.image || "",
          _paths: Array.isArray(r.images) ? r.images.map((x) => x.path || x.image).filter(Boolean) : []
        };
      });
    });
    const showRoomModal = ref(false);
    const roomDetailOpen = ref(false);
    const selectedRoom = ref(null);
    const roomSubmitting = ref(false);
    const roomImageFiles = ref([]);
    const roomPreviewUrls = ref([]);
    const roomFileInputRef = ref(null);
    const roomForm = ref({
      title: "",
      description: "",
      numberPiece: 1,
      price: 0,
      priceHeure: "",
      deviseId: 2,
      isAvailable: true,
      available: true
    });
    function revokeRoomPreviews() {
      roomPreviewUrls.value.forEach((u) => URL.revokeObjectURL(u));
      roomPreviewUrls.value = [];
    }
    function clearRoomImages() {
      revokeRoomPreviews();
      roomImageFiles.value = [];
      if (roomFileInputRef.value) roomFileInputRef.value.value = "";
    }
    function closeRoomDetail() {
      roomDetailOpen.value = false;
      selectedRoom.value = null;
    }
    function roomImageUrls(r) {
      const out = [];
      const paths = r._paths;
      if (Array.isArray(paths)) {
        for (const p of paths) if (typeof p === "string" && p) out.push(p);
      }
      const cover = roomCover(r);
      if (cover) out.unshift(cover);
      return [...new Set(out.filter(Boolean))];
    }
    watch(showRoomModal, (open) => {
      if (!open) {
        clearRoomImages();
        roomForm.value = {
          title: "",
          description: "",
          numberPiece: 1,
          price: 0,
          priceHeure: "",
          deviseId: 2,
          isAvailable: true,
          available: true
        };
      }
    });
    const activePhoto = ref(0);
    const viewerOpen = ref(false);
    const viewerImages = ref([]);
    const viewerIndex = ref(0);
    const editOpen = ref(false);
    const editSaving = ref(false);
    const availabilitySaving = ref(false);
    const roomAvailabilityId = ref(null);
    const editFiles = ref([]);
    const editPreviews = ref([]);
    ref(null);
    const editForm = ref({
      title: "",
      description: "",
      address: "",
      communeValue: "",
      quartierValue: "",
      cityValue: "",
      countryValue: "RDC",
      postalCode: ""
    });
    watch(hotelId, () => {
      activePhoto.value = 0;
    });
    watch(gallery, (photos) => {
      if (activePhoto.value >= photos.length) activePhoto.value = 0;
    });
    function openEdit() {
      const current = hotel.value || {};
      editForm.value = {
        title: String(current.title || ""),
        description: String(current.description || ""),
        address: String(current.address || ""),
        communeValue: String(current.communeValue || ""),
        quartierValue: String(current.quartierValue || ""),
        cityValue: String(current.cityValue || ""),
        countryValue: String(current.countryValue || "RDC"),
        postalCode: String(current.postalCode || "")
      };
      editFiles.value = [];
      editPreviews.value.forEach((url) => URL.revokeObjectURL(url));
      editPreviews.value = [];
      editOpen.value = true;
    }
    async function toggleHotelListing() {
      if (!auth.token) return;
      availabilitySaving.value = true;
      const nextSold = hotelOnline.value;
      const result = await propertyStore.putPublicationSold(
        config.public.apiBase,
        auth.token,
        "hotel",
        hotelId.value,
        nextSold
      );
      availabilitySaving.value = false;
      if (!result.success) {
        toast.error(result.message || "Impossible de changer la visibilit\xE9.");
        return;
      }
      toast.success(nextSold ? "H\xF4tel retir\xE9 du site." : "H\xF4tel remis en ligne.");
      await refreshHotel();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "ghost",
        size: "icon",
        class: "shrink-0 rounded-full",
        onClick: ($event) => unref(router).push("/dashboard/hotel/hotels")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-5 w-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "h-5 w-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1976D2]">\xC9tablissement</p><h1 class="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">${ssrInterpolate(((_a = hotel.value) == null ? void 0 : _a.title) || "Chargement\u2026")}</h1>`);
      if (placeLabel.value) {
        _push(`<p class="mt-1 flex items-start gap-1.5 text-sm text-slate-500">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-[#1976D2]" }, null, _parent));
        _push(` ${ssrInterpolate(placeLabel.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        class: "rounded-full",
        disabled: unref(pendingHotel),
        onClick: ($event) => unref(refreshHotel)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCw), {
              class: ["mr-2 h-4 w-4", { "animate-spin": unref(pendingHotel) }]
            }, null, _parent2, _scopeId));
            _push2(` Actualiser `);
          } else {
            return [
              createVNode(unref(RefreshCw), {
                class: ["mr-2 h-4 w-4", { "animate-spin": unref(pendingHotel) }]
              }, null, 8, ["class"]),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        class: "rounded-full",
        disabled: !hotel.value || availabilitySaving.value,
        onClick: toggleHotelListing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (availabilitySaving.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(hotelOnline.value ? "Rendre hors ligne" : "Remettre en ligne")}`);
          } else {
            return [
              availabilitySaving.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(hotelOnline.value ? "Rendre hors ligne" : "Remettre en ligne"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        class: "rounded-full",
        disabled: !hotel.value,
        onClick: openEdit
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Pencil), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Modifier `);
          } else {
            return [
              createVNode(unref(Pencil), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Modifier ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        class: "rounded-full bg-[#1976D2] hover:bg-[#1565C0]",
        onClick: ($event) => showRoomModal.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Nouvelle chambre `);
          } else {
            return [
              createVNode(unref(Plus), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Nouvelle chambre ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(pendingHotel) && !hotel.value) {
        _push(`<div class="space-y-4"><div class="aspect-[16/7] rounded-3xl casa-shimmer-slate"></div><div class="grid gap-4 lg:grid-cols-3"><div class="h-36 rounded-3xl casa-shimmer-slate lg:col-span-2"></div><div class="h-36 rounded-3xl casa-shimmer-slate"></div></div></div>`);
      } else if (!hotel.value) {
        _push(`<div class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-sm text-slate-600"> H\xF4tel introuvable pour votre compte. </div>`);
      } else {
        _push(`<!--[--><section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div class="relative aspect-[16/7] bg-slate-100">`);
        if (gallery.value.length) {
          _push(`<button type="button" class="absolute inset-0 cursor-zoom-in" aria-label="Agrandir les photos"><img${ssrRenderAttr("src", gallery.value[activePhoto.value] || gallery.value[0])}${ssrRenderAttr("alt", hotel.value.title)} class="h-full w-full object-cover"></button>`);
        } else {
          _push(`<div class="flex h-full items-center justify-center text-slate-300">`);
          _push(ssrRenderComponent(unref(ImageIcon), { class: "h-16 w-16" }, null, _parent));
          _push(`</div>`);
        }
        if (gallery.value.length) {
          _push(`<span class="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white">`);
          _push(ssrRenderComponent(unref(ZoomIn), { class: "h-3.5 w-3.5" }, null, _parent));
          _push(` ${ssrInterpolate(activePhoto.value + 1)}/${ssrInterpolate(gallery.value.length)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="${ssrRenderClass([hotelOnline.value ? "bg-emerald-600" : "bg-slate-600", "absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"])}">${ssrInterpolate(hotelOnline.value ? "En ligne" : "Hors ligne")}</span><span class="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#1565C0] shadow">${ssrInterpolate(((_b = startingPrice.value) == null ? void 0 : _b.label) || "Tarifs par chambre")}</span></div>`);
        if (gallery.value.length > 1) {
          _push(`<div class="flex gap-2 overflow-x-auto p-3"><!--[-->`);
          ssrRenderList(gallery.value, (src, index) => {
            _push(`<button type="button" class="${ssrRenderClass([index === activePhoto.value ? "ring-2 ring-[#1976D2]" : "", "h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200"])}"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><div class="grid gap-4 lg:grid-cols-3"><section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Description</p><p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">${ssrInterpolate(hotel.value.description || "Aucune description pour cet \xE9tablissement.")}</p></section><section class="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm shadow-sm"><div class="flex items-center justify-between gap-3"><span class="text-slate-500">Chambres</span><span class="font-black text-slate-900">${ssrInterpolate(rooms.value.length)}</span></div><div class="flex items-center justify-between gap-3"><span class="text-slate-500">Photos</span><span class="font-black text-slate-900">${ssrInterpolate(gallery.value.length)}</span></div><div class="flex items-center justify-between gap-3"><span class="text-slate-500">Cr\xE9\xE9</span><span class="font-semibold text-slate-900">${ssrInterpolate(activity.value.createdLabel || "\u2014")}</span></div>`);
        if (activity.value.updatedLabel) {
          _push(`<div class="flex items-center justify-between gap-3"><span class="text-slate-500">Mis \xE0 jour</span><span class="font-semibold text-slate-900">${ssrInterpolate(activity.value.updatedLabel)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div><div><div class="mb-4 flex items-center justify-between"><h2 class="text-xl font-black text-slate-900">Chambres</h2><span class="text-sm text-slate-500">${ssrInterpolate(rooms.value.length)} offre${ssrInterpolate(rooms.value.length > 1 ? "s" : "")}</span></div>`);
        if (unref(pendingRooms) && !rooms.value.length) {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(2, (i) => {
            _push(`<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white"><div class="aspect-[5/3] casa-shimmer-slate"></div><div class="space-y-2 p-4"><div class="h-4 w-1/2 rounded-lg casa-shimmer-slate"></div><div class="h-3 w-full rounded-lg casa-shimmer-slate"></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (!rooms.value.length) {
          _push(`<div class="rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-500"> Aucune chambre \u2014 ajoutez votre premi\xE8re offre. </div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(rooms.value, (r, i) => {
            _push(`<article class="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#1976D2]/40 hover:shadow-md" role="button" tabindex="0"><div class="relative aspect-[5/3] bg-slate-100">`);
            if (roomCover(r)) {
              _push(`<img${ssrRenderAttr("src", roomCover(r))} class="h-full w-full object-cover transition duration-300 group-hover:scale-105" alt="">`);
            } else {
              _push(`<div class="flex h-full items-center justify-center text-slate-300">`);
              _push(ssrRenderComponent(unref(BedDouble), { class: "h-10 w-10" }, null, _parent));
              _push(`</div>`);
            }
            if (roomImageUrls(r).length) {
              _push(`<button type="button" class="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/55 text-white" aria-label="Voir les photos de la chambre">`);
              _push(ssrRenderComponent(unref(ZoomIn), { class: "h-4 w-4" }, null, _parent));
              _push(`</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="${ssrRenderClass([r.available === false ? "bg-slate-600" : "bg-emerald-600", "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white"])}">${ssrInterpolate(r.available === false ? "Indisponible" : "Disponible")}</span><span class="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#1565C0] shadow">${ssrInterpolate(Number(r.price) > 0 ? r.deviseId === 1 ? `${r.price} FC` : `${r.price}$` : "Tarif \xE0 d\xE9finir")} `);
            if (r.priceHeure) {
              _push(`<span class="font-semibold text-slate-500"> \xB7 ${ssrInterpolate(r.priceHeure)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></div><div class="space-y-1 p-4"><h3 class="font-bold leading-snug text-slate-900">${ssrInterpolate(r.title)}</h3>`);
            if (r.description) {
              _push(`<p class="truncate text-xs text-slate-500">${ssrInterpolate(r.description)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="text-[11px] text-slate-400">${ssrInterpolate(r.numberPiece || 0)} pi\xE8ce${ssrInterpolate(Number(r.numberPiece) > 1 ? "s" : "")}</p><button type="button" class="mt-2 text-xs font-bold text-[#1565C0] disabled:opacity-50"${ssrIncludeBooleanAttr(roomAvailabilityId.value === Number(r.id)) ? " disabled" : ""}>${ssrInterpolate(r.available === false ? "Remettre la chambre en ligne" : "Rendre la chambre hors ligne")}</button></div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><!--]-->`);
      }
      if (viewerOpen.value) {
        _push(ssrRenderComponent(_sfc_main$1, {
          images: viewerImages.value,
          index: viewerIndex.value,
          "onUpdate:index": ($event) => viewerIndex.value = $event,
          onClose: ($event) => viewerOpen.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (editOpen.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"><form class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl"><h3 class="text-lg font-bold">Modifier l\u2019\xE9tablissement</h3><p class="mt-1 text-sm text-muted-foreground">Nom, description, adresse et photos d\xE9j\xE0 publi\xE9s.</p><div class="mt-6 space-y-4"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "edit-title" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Nom *`);
              } else {
                return [
                  createTextVNode("Nom *")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            id: "edit-title",
            modelValue: editForm.value.title,
            "onUpdate:modelValue": ($event) => editForm.value.title = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "edit-desc" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Description`);
              } else {
                return [
                  createTextVNode("Description")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<textarea id="edit-desc" rows="4" class="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">${ssrInterpolate(editForm.value.description)}</textarea></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "edit-address" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Adresse *`);
              } else {
                return [
                  createTextVNode("Adresse *")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            id: "edit-address",
            modelValue: editForm.value.address,
            "onUpdate:modelValue": ($event) => editForm.value.address = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="grid grid-cols-2 gap-3"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Quartier`);
              } else {
                return [
                  createTextVNode("Quartier")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: editForm.value.quartierValue,
            "onUpdate:modelValue": ($event) => editForm.value.quartierValue = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Commune`);
              } else {
                return [
                  createTextVNode("Commune")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: editForm.value.communeValue,
            "onUpdate:modelValue": ($event) => editForm.value.communeValue = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Ville`);
              } else {
                return [
                  createTextVNode("Ville")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: editForm.value.cityValue,
            "onUpdate:modelValue": ($event) => editForm.value.cityValue = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Pays`);
              } else {
                return [
                  createTextVNode("Pays")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: editForm.value.countryValue,
            "onUpdate:modelValue": ($event) => editForm.value.countryValue = $event,
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "edit-photos" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Nouvelles photos`);
              } else {
                return [
                  createTextVNode("Nouvelles photos")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<p class="text-xs text-muted-foreground">Sans nouveau fichier, les photos actuelles sont conserv\xE9es.</p><label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-3 py-2 text-sm font-medium">`);
          _push2(ssrRenderComponent(unref(ImageIcon), { class: "h-4 w-4" }, null, _parent));
          _push2(` Choisir des images <input id="edit-photos" type="file" accept="image/*" multiple class="sr-only"></label>`);
          if (editPreviews.value.length) {
            _push2(`<div class="grid grid-cols-3 gap-2"><!--[-->`);
            ssrRenderList(editPreviews.value, (src, index) => {
              _push2(`<img${ssrRenderAttr("src", src)} alt="" class="aspect-[4/3] rounded-lg object-cover">`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="mt-6 flex justify-end gap-2 border-t pt-4">`);
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            type: "button",
            variant: "outline",
            class: "rounded-full",
            onClick: ($event) => editOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            type: "submit",
            class: "rounded-full",
            disabled: editSaving.value
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                if (editSaving.value) {
                  _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push3(`<!---->`);
                }
                _push3(` Enregistrer `);
              } else {
                return [
                  editSaving.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 h-4 w-4 animate-spin"
                  })) : createCommentVNode("", true),
                  createTextVNode(" Enregistrer ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></form></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        var _a2;
        if (roomDetailOpen.value && selectedRoom.value) {
          _push2(`<div class="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog" aria-modal="true"><div class="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"><div class="flex items-center justify-between gap-4 border-b border-border px-6 py-4"><div class="min-w-0"><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chambre</p><h3 class="truncate text-lg font-black">${ssrInterpolate(selectedRoom.value.title)}</h3></div>`);
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "outline",
            size: "sm",
            class: "rounded-full",
            onClick: closeRoomDetail
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div><div class="space-y-6 p-6">`);
          if (roomImageUrls(selectedRoom.value).length) {
            _push2(`<div class="grid gap-3 sm:grid-cols-2"><!--[-->`);
            ssrRenderList(roomImageUrls(selectedRoom.value), (src, idx) => {
              _push2(`<button type="button" class="aspect-[16/10] cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-muted"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 text-sm sm:grid-cols-2"><div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix / nuit</p><p class="mt-1 text-2xl font-black text-primary">${ssrInterpolate(selectedRoom.value.price)} ${ssrInterpolate(selectedRoom.value.deviseId === 1 ? "CDF" : "USD")}</p></div>`);
          if (selectedRoom.value.priceHeure) {
            _push2(`<div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Infos horaires</p><p class="mt-1 text-foreground">${ssrInterpolate(selectedRoom.value.priceHeure)}</p></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pi\xE8ces</p><p class="mt-1 text-foreground">${ssrInterpolate((_a2 = selectedRoom.value.numberPiece) != null ? _a2 : "\u2014")}</p></div><div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">ID</p><p class="mt-1 font-mono text-foreground">#${ssrInterpolate(selectedRoom.value.id)}</p></div></div><div class="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm"><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</p><p class="mt-2 whitespace-pre-line text-foreground">${ssrInterpolate(selectedRoom.value.description || "\u2014")}</p></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (showRoomModal.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"><div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl"><h3 class="text-lg font-bold">Nouvelle chambre</h3><p class="text-sm text-muted-foreground">Tarif nuit, capacit\xE9 et visuel \u2014 comme sur les meilleures plateformes.</p><form class="mt-6 space-y-4"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "rt" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Titre *`);
              } else {
                return [
                  createTextVNode("Titre *")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            id: "rt",
            modelValue: roomForm.value.title,
            "onUpdate:modelValue": ($event) => roomForm.value.title = $event,
            class: "h-11 rounded-xl",
            placeholder: "Suite vue jardin"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "rd" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Description`);
              } else {
                return [
                  createTextVNode("Description")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<textarea id="rd" rows="3" class="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm">${ssrInterpolate(roomForm.value.description)}</textarea></div><div class="grid grid-cols-2 gap-3"><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Prix / nuit`);
              } else {
                return [
                  createTextVNode("Prix / nuit")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.price,
            "onUpdate:modelValue": ($event) => roomForm.value.price = $event,
            modelModifiers: { number: true },
            type: "number",
            step: "0.01",
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Pi\xE8ces / couchage`);
              } else {
                return [
                  createTextVNode("Pi\xE8ces / couchage")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.numberPiece,
            "onUpdate:modelValue": ($event) => roomForm.value.numberPiece = $event,
            modelModifiers: { number: true },
            type: "number",
            min: "1",
            class: "h-11 rounded-xl"
          }, null, _parent));
          _push2(`</div></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Info horaire (optionnel)`);
              } else {
                return [
                  createTextVNode("Info horaire (optionnel)")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$4), {
            modelValue: roomForm.value.priceHeure,
            "onUpdate:modelValue": ($event) => roomForm.value.priceHeure = $event,
            class: "h-11 rounded-xl",
            placeholder: "ex. Check-in 14h"
          }, null, _parent));
          _push2(`</div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Devise`);
              } else {
                return [
                  createTextVNode("Devise")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<select class="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"><option${ssrRenderAttr("value", 2)}${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.deviseId) ? ssrLooseContain(roomForm.value.deviseId, 2) : ssrLooseEqual(roomForm.value.deviseId, 2)) ? " selected" : ""}>USD</option><option${ssrRenderAttr("value", 1)}${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.deviseId) ? ssrLooseContain(roomForm.value.deviseId, 1) : ssrLooseEqual(roomForm.value.deviseId, 1)) ? " selected" : ""}>CDF</option></select></div><div class="space-y-2">`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), { for: "room-files" }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Photos`);
              } else {
                return [
                  createTextVNode("Photos")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<p class="text-xs text-muted-foreground">Plusieurs fichiers possibles \u2014 envoy\xE9s en base64 (data URL) \xE0 la cr\xE9ation.</p><div class="flex flex-wrap items-center gap-2"><label class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-input bg-muted/30 px-3 py-2 text-sm font-medium hover:bg-muted/50">`);
          _push2(ssrRenderComponent(unref(ImageIcon), { class: "h-4 w-4 text-muted-foreground" }, null, _parent));
          _push2(` Choisir des images <input id="room-files" type="file" accept="image/*" multiple class="sr-only"></label>`);
          if (roomImageFiles.value.length) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              type: "button",
              variant: "ghost",
              size: "sm",
              class: "rounded-full",
              onClick: clearRoomImages
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(` Tout retirer `);
                } else {
                  return [
                    createTextVNode(" Tout retirer ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (roomPreviewUrls.value.length) {
            _push2(`<div class="mt-2 grid grid-cols-3 gap-2"><!--[-->`);
            ssrRenderList(roomPreviewUrls.value, (src, i) => {
              _push2(`<div class="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"><img${ssrRenderAttr("src", src)} alt="" class="h-full w-full object-cover"></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="flex gap-4 pt-2"><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.isAvailable) ? ssrLooseContain(roomForm.value.isAvailable, null) : roomForm.value.isAvailable) ? " checked" : ""} type="checkbox" class="rounded"> Disponible </label><label class="flex items-center gap-2 text-sm"><input${ssrIncludeBooleanAttr(Array.isArray(roomForm.value.available) ? ssrLooseContain(roomForm.value.available, null) : roomForm.value.available) ? " checked" : ""} type="checkbox" class="rounded"> Publi\xE9e </label></div><div class="flex justify-end gap-2 pt-4 border-t">`);
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            type: "button",
            variant: "outline",
            class: "rounded-full",
            onClick: ($event) => showRoomModal.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            type: "submit",
            class: "rounded-full",
            disabled: roomSubmitting.value
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                if (roomSubmitting.value) {
                  _push3(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push3(`<!---->`);
                }
                _push3(` Cr\xE9er `);
              } else {
                return [
                  roomSubmitting.value ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 h-4 w-4 animate-spin"
                  })) : createCommentVNode("", true),
                  createTextVNode(" Cr\xE9er ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/hotels/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DMeMTpmP.mjs.map
