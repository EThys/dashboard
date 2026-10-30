import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Plus, LayoutGrid, Building2, Sparkles } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { a as useRouter, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const { data: stats, pending } = useAsyncData(
      "hotel-dashboard-stats",
      async () => {
        var _a, _b, _c;
        const apiBase = config.public.apiBase;
        const uid = (_a = auth.user) == null ? void 0 : _a.userId;
        if (!uid || !auth.token) return { count: 0 };
        const url = joinApi(apiBase, `${ApiEndpoints.propertyHotelsByOwner}${uid}`);
        const res = await $fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        }).catch(() => null);
        const list = (_c = (_b = res == null ? void 0 : res.data) != null ? _b : res) != null ? _c : [];
        const n = Array.isArray(list) ? list.length : 0;
        return { count: n };
      },
      { server: false }
    );
    const hotelCount = computed(() => {
      var _a, _b;
      return (_b = (_a = stats.value) == null ? void 0 : _a.count) != null ? _b : 0;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-10" }, _attrs))}><div class="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 text-white shadow-xl"><div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl"></div><div class="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl"></div><div class="relative z-10 max-w-2xl"><p class="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Espace gestionnaire</p><h1 class="mt-3 text-3xl font-black md:text-4xl">Pilotez vos h\xF4tels avec CasaNayo</h1><p class="mt-4 text-sm leading-relaxed text-white/80"> Cr\xE9ez votre \xE9tablissement, ajoutez des chambres avec photos et tarifs, et gardez le contr\xF4le sur la disponibilit\xE9. </p><div class="mt-8 flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        class: "rounded-full bg-white text-slate-900 hover:bg-white/90",
        onClick: ($event) => unref(router).push("/dashboard/hotel/hotels/new")
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
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        class: "rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20",
        onClick: ($event) => unref(router).push("/dashboard/hotel/hotels")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LayoutGrid), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` Mes \xE9tablissements `);
          } else {
            return [
              createVNode(unref(LayoutGrid), { class: "mr-2 h-4 w-4" }),
              createTextVNode(" Mes \xE9tablissements ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><div class="grid gap-6 md:grid-cols-3"><div class="rounded-2xl border border-border bg-card p-6 shadow-sm"><div class="flex items-center gap-3"><div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">`);
      _push(ssrRenderComponent(unref(Building2), { class: "h-6 w-6" }, null, _parent));
      _push(`</div><div><p class="text-xs font-bold uppercase tracking-wider text-muted-foreground">H\xF4tels</p><p class="text-3xl font-black">${ssrInterpolate(unref(pending) ? "\u2014" : hotelCount.value)}</p></div></div></div><div class="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-2"><div class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "h-5 w-5 shrink-0 text-amber-500 mt-0.5" }, null, _parent));
      _push(`<div><p class="font-bold">Conseil</p><p class="text-sm text-muted-foreground mt-1"> Des photos nettes et une description pr\xE9cise augmentent les r\xE9servations. Les voyageurs filtrent souvent par quartier et par prix. </p></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B_p9DMdm.mjs.map
