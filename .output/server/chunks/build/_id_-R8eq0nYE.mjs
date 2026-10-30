import { defineComponent, computed, withAsyncContext, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { ArrowLeft, Loader2, Building2, MapPin, BedDouble } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Badge-CZaU8sYj.mjs';
import { m as useRoute, a as useRouter, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { u as useAsyncData } from './asyncData-BvsKIpkL.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const id = computed(() => Number(route.params.id));
    const { data, pending, error, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "admin-hotel-publication-detail",
      async () => {
        var _a, _b;
        const apiBase = config.public.apiBase;
        const h = { Authorization: `Bearer ${auth.token}` };
        const url = joinApi(apiBase, ApiEndpoints.protectedPropertyHotels);
        const res = await $fetch(url, { headers: h });
        const list = Array.isArray(res) ? res : (_b = (_a = res == null ? void 0 : res.data) != null ? _a : res == null ? void 0 : res.hotels) != null ? _b : [];
        const arr = Array.isArray(list) ? list : [];
        const found = arr.find((row) => {
          var _a2, _b2, _c, _d;
          const hid = (_d = (_c = (_a2 = row == null ? void 0 : row.hotel) == null ? void 0 : _a2.id) != null ? _c : (_b2 = row == null ? void 0 : row.hotel) == null ? void 0 : _b2.hotelId) != null ? _d : row == null ? void 0 : row.id;
          return Number(hid) === id.value;
        });
        return found != null ? found : null;
      },
      { watch: [id] }
    )), __temp = await __temp, __restore(), __temp);
    const { data: roomsRes, pending: pendingRooms } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "admin-hotel-rooms",
      async () => {
        var _a, _b, _c, _d;
        const apiBase = config.public.apiBase;
        const url = joinApi(apiBase, ApiEndpoints.propertyHotelRoomsPublic);
        const res = await $fetch(url).catch(() => null);
        const list = (_d = (_c = (_b = (_a = res == null ? void 0 : res.data) != null ? _a : res == null ? void 0 : res.chambre) != null ? _b : res == null ? void 0 : res.chambres) != null ? _c : res) != null ? _d : [];
        const arr = Array.isArray(list) ? list : [];
        return arr.map((x) => {
          var _a2;
          return (_a2 = x.chambre) != null ? _a2 : x;
        }).filter((ch) => {
          var _a2, _b2;
          return Number((_b2 = ch.hotelId) != null ? _b2 : (_a2 = ch.hotel) == null ? void 0 : _a2.id) === id.value;
        });
      },
      { watch: [id] }
    )), __temp = await __temp, __restore(), __temp);
    const hotel = computed(() => {
      var _a, _b;
      return (_b = (_a = data.value) == null ? void 0 : _a.hotel) != null ? _b : data.value;
    });
    const title = computed(() => {
      var _a, _b;
      return (_b = (_a = hotel.value) == null ? void 0 : _a.title) != null ? _b : "H\xF4tel";
    });
    const address = computed(() => {
      const h = hotel.value;
      if (!h) return "";
      return [h.address, h.communeValue, h.cityValue].filter(Boolean).join(", ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "ghost",
        size: "icon",
        class: "rounded-full",
        onClick: ($event) => unref(router).push("/dashboard/publications?tab=hotels")
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
      _push(`<div><h1 class="text-2xl font-black tracking-tight md:text-3xl">${ssrInterpolate(title.value)}</h1><p class="text-sm text-muted-foreground">Fiche h\xF4tel (admin)</p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        size: "sm",
        class: "ml-auto",
        disabled: unref(pending),
        onClick: unref(refresh)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Actualiser `);
          } else {
            return [
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(pending)) {
        _push(`<div class="flex items-center justify-center gap-2 py-24 text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-6 w-6 animate-spin" }, null, _parent));
        _push(` Chargement\u2026 </div>`);
      } else if (unref(error) || !unref(data)) {
        _push(`<div class="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm"> H\xF4tel introuvable ou acc\xE8s refus\xE9. </div>`);
      } else {
        _push(`<div class="grid gap-8 lg:grid-cols-3"><div class="lg:col-span-2 overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div class="aspect-[21/9] bg-muted">`);
        if ((_a = hotel.value) == null ? void 0 : _a.image) {
          _push(`<img${ssrRenderAttr("src", hotel.value.image)}${ssrRenderAttr("alt", title.value)} class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex h-full items-center justify-center text-muted-foreground">`);
          _push(ssrRenderComponent(unref(Building2), { class: "h-16 w-16 opacity-30" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div><div class="p-6 space-y-4"><div class="flex flex-wrap gap-2">`);
        if (((_b = hotel.value) == null ? void 0 : _b.isAvailable) !== false) {
          _push(ssrRenderComponent(unref(_sfc_main$2), { variant: "default" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Disponible`);
              } else {
                return [
                  createTextVNode("Disponible")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(unref(_sfc_main$2), { variant: "secondary" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Indisponible`);
              } else {
                return [
                  createTextVNode("Indisponible")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div><p class="text-muted-foreground leading-relaxed">${ssrInterpolate(((_c = hotel.value) == null ? void 0 : _c.description) || "\u2014")}</p><div class="flex items-start gap-2 text-sm">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent));
        _push(`<span>${ssrInterpolate(address.value || "\u2014")}</span></div></div></div><div class="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-3 text-sm"><h3 class="font-bold text-foreground">M\xE9tadonn\xE9es</h3><dl class="space-y-2"><div class="flex justify-between gap-4"><dt class="text-muted-foreground">ID</dt><dd class="font-mono">${ssrInterpolate((_d = hotel.value) == null ? void 0 : _d.id)}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Type</dt><dd>${ssrInterpolate((_f = (_e = hotel.value) == null ? void 0 : _e.propertyTypeId) != null ? _f : "\u2014")}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Ville</dt><dd>${ssrInterpolate((_h = (_g = hotel.value) == null ? void 0 : _g.cityValue) != null ? _h : "\u2014")}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Pays</dt><dd>${ssrInterpolate((_j = (_i = hotel.value) == null ? void 0 : _i.countryValue) != null ? _j : "\u2014")}</dd></div></dl></div></div>`);
      }
      if (!unref(pending) && unref(data)) {
        _push(`<div class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-xl font-black">Chambres disponibles</h2>`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          variant: "outline",
          class: "rounded-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`${ssrInterpolate(((_a2 = unref(roomsRes)) == null ? void 0 : _a2.length) || 0)} type(s)`);
            } else {
              return [
                createTextVNode(toDisplayString(((_b2 = unref(roomsRes)) == null ? void 0 : _b2.length) || 0) + " type(s)", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(pendingRooms)) {
          _push(`<div class="flex justify-center py-12">`);
          _push(ssrRenderComponent(unref(Loader2), { class: "h-6 w-6 animate-spin text-muted-foreground" }, null, _parent));
          _push(`</div>`);
        } else if (!((_k = unref(roomsRes)) == null ? void 0 : _k.length)) {
          _push(`<div class="rounded-3xl border border-dashed p-12 text-center text-sm text-muted-foreground"> Aucune chambre enregistr\xE9e pour cet h\xF4tel. </div>`);
        } else {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
          ssrRenderList(unref(roomsRes), (r) => {
            _push(`<div class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"><div class="aspect-[4/3] bg-muted relative overflow-hidden">`);
            if (r.image) {
              _push(`<img${ssrRenderAttr("src", r.image)} class="h-full w-full object-cover transition group-hover:scale-105">`);
            } else {
              _push(`<div class="flex h-full items-center justify-center text-muted-foreground/30">`);
              _push(ssrRenderComponent(unref(BedDouble), { class: "h-10 w-10" }, null, _parent));
              _push(`</div>`);
            }
            _push(`<div class="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">${ssrInterpolate(r.price)} ${ssrInterpolate(r.deviseId === 1 ? "CDF" : "USD")}</div></div><div class="p-4 space-y-1"><h4 class="font-bold text-sm truncate">${ssrInterpolate(r.title)}</h4><p class="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">${ssrInterpolate(r.description || "Pas de description.")}</p></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/publications/hotels/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-R8eq0nYE.mjs.map
