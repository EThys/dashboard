import { defineComponent, withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Plus, Loader2, Building2, ChevronRight, MapPin } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Badge-CZaU8sYj.mjs';
import { a as useRouter, l as useAuthStore, j as joinApi, A as ApiEndpoints, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { u as useAsyncData } from './asyncData-cMiNwecB.mjs';
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
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    function handleNewHotel() {
      var _a;
      if (!((_a = auth.user) == null ? void 0 : _a.premium)) {
        toast.info("Abonnement requis", {
          description: "Un abonnement Premium est n\xE9cessaire pour publier un h\xF4tel."
        });
        return navigateTo("/compte/abonnement");
      }
      router.push("/dashboard/hotel/hotels/new");
    }
    const { data: rows, pending, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      "my-hotels-list",
      async () => {
        var _a, _b, _c;
        const apiBase = config.public.apiBase;
        const uid = (_a = auth.user) == null ? void 0 : _a.userId;
        if (!uid || !auth.token) return [];
        const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`);
        const res = await $fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const list = (_c = (_b = res == null ? void 0 : res.data) != null ? _b : res) != null ? _c : [];
        return Array.isArray(list) ? list : [];
      },
      { server: false }
    )), __temp = await __temp, __restore(), __temp);
    const hotels = computed(() => {
      var _a;
      return (_a = rows.value) != null ? _a : [];
    });
    function hotelCard(row) {
      var _a, _b, _c, _d, _e, _f, _g;
      const h = (_a = row == null ? void 0 : row.hotel) != null ? _a : row;
      return {
        id: (_b = h == null ? void 0 : h.id) != null ? _b : h == null ? void 0 : h.hotelId,
        title: (_c = h == null ? void 0 : h.title) != null ? _c : "Sans titre",
        image: h == null ? void 0 : h.image,
        city: (_f = (_e = h == null ? void 0 : h.cityValue) != null ? _e : (_d = row == null ? void 0 : row.address) == null ? void 0 : _d.cityValue) != null ? _f : "",
        commune: (_g = h == null ? void 0 : h.communeValue) != null ? _g : ""
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-black md:text-3xl">Mes \xE9tablissements</h1><p class="text-sm text-muted-foreground">G\xE9rez vos h\xF4tels et ouvrez une fiche pour ajouter des chambres.</p></div><div class="flex gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        size: "sm",
        disabled: unref(pending),
        onClick: ($event) => unref(refresh)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Actualiser`);
          } else {
            return [
              createTextVNode("Actualiser")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "rounded-full",
        onClick: handleNewHotel
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Nouvel h\xF4tel `);
          } else {
            return [
              createVNode(unref(Plus), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Nouvel h\xF4tel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-24 text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-8 w-8 animate-spin" }, null, _parent));
        _push(`</div>`);
      } else if (!hotels.value.length) {
        _push(`<div class="rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">`);
        _push(ssrRenderComponent(unref(Building2), { class: "mx-auto h-12 w-12 text-muted-foreground opacity-40" }, null, _parent));
        _push(`<p class="mt-4 font-medium text-foreground">Aucun h\xF4tel pour l\u2019instant</p><p class="mt-1 text-sm text-muted-foreground">Cr\xE9ez votre premier \xE9tablissement pour proposer des chambres.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          class: "mt-6 rounded-full",
          onClick: handleNewHotel
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Cr\xE9er un h\xF4tel`);
            } else {
              return [
                createTextVNode("Cr\xE9er un h\xF4tel")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(hotels.value, (row, idx) => {
          _push(`<button type="button" class="group flex overflow-hidden rounded-3xl border border-border bg-card text-left shadow-sm transition hover:border-primary/40 hover:shadow-md"><div class="relative h-36 w-40 shrink-0 bg-muted">`);
          if (hotelCard(row).image) {
            _push(`<img${ssrRenderAttr("src", hotelCard(row).image)} class="h-full w-full object-cover transition group-hover:scale-105" alt="">`);
          } else {
            _push(`<div class="flex h-full w-full items-center justify-center text-muted-foreground">`);
            _push(ssrRenderComponent(unref(Building2), { class: "h-10 w-10 opacity-30" }, null, _parent));
            _push(`</div>`);
          }
          _push(`</div><div class="flex flex-1 flex-col justify-center gap-2 p-4"><div class="flex items-start justify-between gap-2"><span class="font-bold leading-tight line-clamp-2">${ssrInterpolate(hotelCard(row).title)}</span>`);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" }, null, _parent));
          _push(`</div><span class="inline-flex items-center gap-1 text-xs text-muted-foreground">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "h-3.5 w-3.5" }, null, _parent));
          _push(` ${ssrInterpolate(hotelCard(row).commune || hotelCard(row).city || "\u2014")}</span>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "secondary",
            class: "w-fit text-[10px]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`ID ${ssrInterpolate(hotelCard(row).id)}`);
              } else {
                return [
                  createTextVNode("ID " + toDisplayString(hotelCard(row).id), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/hotels/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BGPxZCX8.mjs.map
