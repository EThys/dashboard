import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, computed, withAsyncContext, ref, reactive, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowLeft, BedDouble, MapPin, Calendar, Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$4 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { _ as _sfc_main$3 } from './ClockTimePicker-CLJj4QYt.mjs';
import { d as decodeId, e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { d as normalizeHotel } from './propertyNormalizer-DGbw4ATn.mjs';
import { f as formatCurrency } from './currency-BoakoUK-.mjs';
import { m as useRoute, l as useAuthStore, f as usePropertyStore, h as useSeoMeta, c as useRuntimeConfig } from './server.mjs';
import { u as useReservationStore } from './reservations-DwuL3whZ.mjs';
import { u as useAsyncData } from './asyncData-BvsKIpkL.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import './transactionDisplay-GAAD372w.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import './partyExtract-LSdOdPXy.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[chambreId]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = useRuntimeConfig();
    useAuthStore();
    const propertyStore = usePropertyStore();
    useReservationStore();
    const hotelId = computed(() => decodeId(String(route.params.id)));
    const roomId = computed(() => decodeId(String(route.params.chambreId)));
    const { data, pending } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `hotel-room-${route.params.id}-${route.params.chambreId}`,
      async () => {
        var _a, _b;
        await propertyStore.fetchHotels(config.public.apiBase);
        const row = propertyStore.hotels.find((item) => {
          var _a2;
          return Number((_a2 = item.hotel) == null ? void 0 : _a2.id) === hotelId.value;
        });
        if (!(row == null ? void 0 : row.hotel)) return null;
        const hotel2 = normalizeHotel(row);
        const room2 = (_b = (_a = hotel2.hotelChambres) == null ? void 0 : _a.find((chambre) => chambre.id === roomId.value)) != null ? _b : null;
        return { hotel: hotel2, room: room2 };
      },
      { server: false }
    )), __temp = await __temp, __restore(), __temp);
    const hotel = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.hotel) != null ? _b : null;
    });
    const room = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.room) != null ? _b : null;
    });
    const galleryIndex = ref(0);
    const images = computed(() => {
      var _a, _b, _c;
      return ((_b = (_a = room.value) == null ? void 0 : _a.images) == null ? void 0 : _b.length) ? room.value.images : ((_c = room.value) == null ? void 0 : _c.image) ? [room.value.image] : [];
    });
    const hotelPath = computed(() => `/properties/${encodeId(hotelId.value)}`);
    const place = computed(() => {
      var _a, _b;
      return ((_a = hotel.value) == null ? void 0 : _a.fullAddress) || ((_b = hotel.value) == null ? void 0 : _b.location) || "";
    });
    const isSending = ref(false);
    const form = reactive({
      startDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      endDate: "",
      arrivalTime: "14:00:00",
      message: ""
    });
    useSeoMeta({
      title: () => {
        var _a;
        return room.value ? `${room.value.title} \u2014 ${((_a = hotel.value) == null ? void 0 : _a.title) || "H\xF4tel"}` : "Chambre";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))}>`);
      if (unref(pending)) {
        _push(`<div class="mx-auto max-w-5xl px-4 py-16"><div class="h-80 animate-pulse rounded-3xl bg-muted"></div></div>`);
      } else if (!unref(hotel) || !unref(room)) {
        _push(`<div class="mx-auto max-w-xl px-4 py-24 text-center"><h1 class="text-2xl font-black">Chambre introuvable</h1><p class="mt-2 text-muted-foreground">Cette chambre n\u2019est plus publi\xE9e.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(hotelPath),
          class: "mt-6 inline-block text-sm font-bold text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour \xE0 l\u2019h\xF4tel`);
            } else {
              return [
                createTextVNode("Retour \xE0 l\u2019h\xF4tel")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(hotelPath),
          class: "mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(unref(hotel).title)}`);
            } else {
              return [
                createVNode(unref(ArrowLeft), { class: "h-4 w-4" }),
                createTextVNode(" " + toDisplayString(unref(hotel).title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"><div class="space-y-6"><div class="overflow-hidden rounded-3xl border border-border/50 bg-muted"><div class="aspect-[16/10]">`);
        if (unref(images)[unref(galleryIndex)]) {
          _push(`<img${ssrRenderAttr("src", unref(images)[unref(galleryIndex)])}${ssrRenderAttr("alt", unref(room).title)} class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex h-full items-center justify-center text-muted-foreground/40">`);
          _push(ssrRenderComponent(unref(BedDouble), { class: "h-16 w-16" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div></div>`);
        if (unref(images).length > 1) {
          _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(images), (url, index) => {
            _push(`<button type="button" class="${ssrRenderClass([index === unref(galleryIndex) ? "border-primary" : "border-transparent opacity-80", "h-16 w-16 overflow-hidden rounded-xl border-2"])}"><img${ssrRenderAttr("src", url)} alt="" class="h-full w-full object-cover"></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><p class="text-xs font-bold uppercase tracking-widest text-primary">Chambre</p><h1 class="mt-1 text-3xl font-black tracking-tight">${ssrInterpolate(unref(room).title)}</h1>`);
        if (unref(place)) {
          _push(`<p class="mt-2 flex items-start gap-2 text-sm text-muted-foreground">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent));
          _push(` ${ssrInterpolate(unref(place))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-wrap gap-2"><span class="${ssrRenderClass([unref(room).available === false ? "bg-amber-500/15 text-amber-900" : "bg-emerald-500/15 text-emerald-800", "rounded-full px-3 py-1 text-xs font-bold"])}">${ssrInterpolate(unref(room).available === false ? "Indisponible" : "Disponible")}</span>`);
        if (unref(room).numberPiece != null) {
          _push(`<span class="rounded-full bg-muted px-3 py-1 text-xs font-medium">${ssrInterpolate(unref(room).numberPiece)} pi\xE8ce(s) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-3xl border border-border/50 bg-card p-6"><h2 class="text-lg font-bold">Description</h2><p class="mt-3 whitespace-pre-line text-muted-foreground">${ssrInterpolate(unref(room).description || "Aucune description.")}</p></div></div><aside class="h-fit rounded-3xl border border-border/50 bg-card p-6 shadow-lg lg:sticky lg:top-24"><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix / nuit</p><p class="mt-1 text-3xl font-black text-primary">${ssrInterpolate(unref(formatCurrency)(unref(room).price, unref(room).currencyLabel))}</p>`);
        if (unref(room).priceHeure) {
          _push(`<p class="mt-2 text-sm text-muted-foreground">${ssrInterpolate(unref(room).priceHeure)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<form class="mt-6 space-y-5"><div class="grid grid-cols-2 gap-3"><div class="space-y-1.5">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-muted-foreground" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Arriv\xE9e`);
            } else {
              return [
                createTextVNode("Arriv\xE9e")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          modelValue: unref(form).startDate,
          "onUpdate:modelValue": ($event) => unref(form).startDate = $event,
          type: "date",
          required: "",
          class: "h-11 rounded-xl"
        }, null, _parent));
        _push(`</div><div class="space-y-1.5">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-muted-foreground" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`D\xE9part`);
            } else {
              return [
                createTextVNode("D\xE9part")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          modelValue: unref(form).endDate,
          "onUpdate:modelValue": ($event) => unref(form).endDate = $event,
          type: "date",
          min: unref(form).startDate,
          class: "h-11 rounded-xl"
        }, null, _parent));
        _push(`</div></div><div class="space-y-2"><p class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Calendar), { class: "size-3" }, null, _parent));
        _push(` Heure d\u2019arriv\xE9e </p>`);
        _push(ssrRenderComponent(_sfc_main$3, {
          modelValue: unref(form).arrivalTime,
          "onUpdate:modelValue": ($event) => unref(form).arrivalTime = $event
        }, null, _parent));
        _push(`</div><div class="space-y-1.5">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-[10px] font-black uppercase tracking-widest text-muted-foreground" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Message`);
            } else {
              return [
                createTextVNode("Message")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<textarea class="min-h-[88px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" placeholder="Pr\xE9cisez un besoin particulier...">${ssrInterpolate(unref(form).message)}</textarea></div>`);
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          type: "submit",
          class: "h-12 w-full rounded-xl font-bold",
          disabled: unref(isSending) || unref(room).available === false || unref(hotel).sold
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(isSending)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` R\xE9server cette chambre `);
            } else {
              return [
                unref(isSending) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 h-4 w-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" R\xE9server cette chambre ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</form></aside></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/properties/[id]/chambres/[chambreId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_chambreId_-CHIThIcy.mjs.map
