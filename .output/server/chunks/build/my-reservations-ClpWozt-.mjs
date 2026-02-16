import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useReservationStore } from './reservations-V2THLnve.mjs';
import { Loader2, Calendar, Home, Clock, ArrowRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Badge-DOGV3Qys.mjs';
import { u as useAsyncData } from './asyncData-B0whOYVl.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
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
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "my-reservations",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const resStore = useReservationStore();
    const { data: reservations, pending: isLoading, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "my-reservations",
      () => resStore.fetchUserReservations(),
      { server: false }
    )), __temp = await __temp, __restore(), __temp);
    const getStatusColor = (status) => {
      switch (status == null ? void 0 : status.toUpperCase()) {
        case "PENDING":
          return "bg-amber-100 text-amber-700 border-amber-200";
        case "CONFIRMED":
          return "bg-green-100 text-green-700 border-green-200";
        case "CANCELLED":
          return "bg-red-100 text-red-700 border-red-200";
        default:
          return "bg-slate-100 text-slate-700 border-slate-200";
      }
    };
    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      } catch (e) {
        return dateStr;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-end justify-between gap-4"><div class="space-y-1"><h1 class="text-4xl font-black tracking-tight italic text-foreground">Mes R\xE9servations</h1><p class="text-muted-foreground font-medium text-lg">G\xE9rez vos visites et r\xE9servations CasaNayo.</p></div><button class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-border shadow-sm hover:shadow-md transition-all font-bold text-sm">`);
      if (unref(isLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin text-primary" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` Actualiser la liste </button></div>`);
      if (unref(isLoading) && !unref(reservations)) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
        ssrRenderList(3, (i) => {
          _push(`<div class="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-border"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(reservations) || unref(reservations).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-border/50 text-center px-6"><div class="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">`);
        _push(ssrRenderComponent(unref(Calendar), { class: "size-10 text-primary opacity-40" }, null, _parent));
        _push(`</div><h3 class="text-2xl font-black text-foreground mb-2 italic">Aucune r\xE9servation pour le moment</h3><p class="text-muted-foreground max-w-sm font-medium mb-8">Parcourez nos propri\xE9t\xE9s et r\xE9servez votre prochaine visite en un clic.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/properties" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1), { class: "rounded-2xl h-14 px-8 font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Explorer les biens`);
                  } else {
                    return [
                      createTextVNode("Explorer les biens")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1), { class: "rounded-2xl h-14 px-8 font-black uppercase tracking-widest bg-primary shadow-xl shadow-primary/20" }, {
                  default: withCtx(() => [
                    createTextVNode("Explorer les biens")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"><!--[-->`);
        ssrRenderList(unref(reservations), (res) => {
          _push(`<div class="group relative bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"><div class="absolute top-6 right-6 z-10">`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            class: `rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase border-2 ${getStatusColor(res.status)}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(res.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(res.status), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="p-8 space-y-6"><div class="flex items-center gap-4"><div class="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">`);
          if (res.propertyId) {
            _push(ssrRenderComponent(unref(Home), { class: "size-6" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Clock), { class: "size-6" }, null, _parent));
          }
          _push(`</div><div><p class="text-[10px] font-black text-primary uppercase tracking-widest">Type: ${ssrInterpolate(res.type)}</p><h3 class="text-xl font-bold text-foreground leading-tight line-clamp-1">Ref: #${ssrInterpolate(res.id)}</h3></div></div><div class="space-y-4 pt-2"><div class="flex items-center gap-3 text-sm text-slate-600 font-medium"><div class="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">`);
          _push(ssrRenderComponent(unref(Calendar), { class: "size-4 text-slate-500" }, null, _parent));
          _push(`</div><span>Du ${ssrInterpolate(formatDate(res.startDate))}</span></div><div class="flex items-center gap-3 text-sm text-slate-600 font-medium"><div class="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">`);
          _push(ssrRenderComponent(unref(Clock), { class: "size-4 text-slate-500" }, null, _parent));
          _push(`</div><span>${ssrInterpolate(res.reservationHeure || "Heure non pr\xE9cis\xE9e")}</span></div></div><div class="bg-slate-50/80 rounded-2xl p-4 border border-slate-100"><p class="text-xs text-slate-500 font-medium italic line-clamp-2">&quot;${ssrInterpolate(res.message || "Aucun message particulier.")}&quot;</p></div><div class="pt-4"><button class="w-full h-12 rounded-xl border-2 border-slate-100 font-bold text-sm text-slate-400 group-hover:border-primary/20 group-hover:text-primary transition-all flex items-center justify-center gap-2"> Voir plus de d\xE9tails `);
          _push(ssrRenderComponent(unref(ArrowRight), { class: "size-4 group-hover:translate-x-1 transition-transform" }, null, _parent));
          _push(`</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/my-reservations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=my-reservations-ClpWozt-.mjs.map
