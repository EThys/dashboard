import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { i as isLocationTransactionType } from './transactionDisplay-By5m3AMp.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-card rounded-3xl overflow-hidden border border-border/50 flex flex-col h-full animate-pulse shadow-sm" }, _attrs))} data-v-7da11478><div class="relative h-56 bg-slate-200 dark:bg-slate-800 overflow-hidden" data-v-7da11478><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" data-v-7da11478></div><div class="absolute top-3 left-3 w-16 h-5 bg-white/40 dark:bg-slate-700/40 rounded-full" data-v-7da11478></div><div class="absolute top-3 right-3 w-20 h-5 bg-white/40 dark:bg-slate-700/40 rounded-full" data-v-7da11478></div><div class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/20 dark:bg-slate-700/20 border-2 border-white/50" data-v-7da11478></div></div><div class="p-5 flex-1 flex flex-col gap-3" data-v-7da11478><div class="flex items-center gap-2" data-v-7da11478><div class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" data-v-7da11478></div><div class="w-32 h-3 bg-slate-100 dark:bg-slate-900 rounded" data-v-7da11478></div></div><div class="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" data-v-7da11478></div><div class="w-2/3 h-6 bg-slate-100 dark:bg-slate-900 rounded-lg" data-v-7da11478></div><div class="grid grid-cols-3 gap-2 py-4 border-y border-border/50" data-v-7da11478><div class="h-4 bg-slate-100 dark:bg-slate-900 rounded" data-v-7da11478></div><div class="h-4 bg-slate-100 dark:bg-slate-900 rounded" data-v-7da11478></div><div class="h-4 bg-slate-100 dark:bg-slate-900 rounded" data-v-7da11478></div></div><div class="mt-auto flex items-center justify-between" data-v-7da11478><div class="space-y-1" data-v-7da11478><div class="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded" data-v-7da11478></div><div class="w-16 h-3 bg-slate-100 dark:bg-slate-900 rounded" data-v-7da11478></div></div><div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" data-v-7da11478></div></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/PropertyCardShimmer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PropertyCardShimmer = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-7da11478"]]);
function resolveTransactionType(entity, transactionType) {
  if (transactionType != null && String(transactionType).trim() !== "") return String(transactionType);
  const t = entity.transactionType;
  if (typeof t === "string") return t;
  return null;
}
function getPublicListingStatus(entity, transactionType) {
  if (!entity || typeof entity !== "object") {
    return {
      kind: "available",
      label: "Disponible",
      badgeClass: "bg-emerald-600/90 text-white"
    };
  }
  const tx = resolveTransactionType(entity, transactionType);
  if (entity.sold === true) {
    const loc = isLocationTransactionType(tx);
    return {
      kind: "sold",
      label: loc ? "D\xE9j\xE0 pris" : "Vendu",
      badgeClass: loc ? "bg-rose-600/95 text-white" : "bg-red-600/95 text-white"
    };
  }
  const available = entity.available !== false;
  const active = entity.active !== false;
  if (!available || !active) {
    return {
      kind: "unlisted",
      label: "Non disponible",
      badgeClass: "bg-slate-700/95 text-white"
    };
  }
  return {
    kind: "available",
    label: "Disponible",
    badgeClass: "bg-emerald-600/90 text-white"
  };
}

export { PropertyCardShimmer as P, getPublicListingStatus as g };
//# sourceMappingURL=listingAvailability-Dih21AIj.mjs.map
