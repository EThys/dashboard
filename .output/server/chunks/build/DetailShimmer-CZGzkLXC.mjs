import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DetailShimmer",
  __ssrInlineRender: true,
  props: {
    type: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background overflow-hidden" }, _attrs))} data-v-0086d353><div class="relative h-[60vh] md:h-[70vh] bg-slate-100 dark:bg-slate-800/50 overflow-hidden" data-v-0086d353><div class="absolute inset-0 shimmer bg-slate-200 dark:bg-slate-800" data-v-0086d353></div><div class="absolute bottom-0 left-0 right-0 z-20 pb-12 pt-32" data-v-0086d353><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-0086d353><div class="flex flex-col md:flex-row items-end justify-between gap-6" data-v-0086d353><div class="space-y-4 max-w-3xl w-full" data-v-0086d353><div class="flex flex-wrap items-center gap-3" data-v-0086d353><div class="w-24 h-8 rounded-full shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div><div class="w-36 h-8 rounded-full shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div></div><div class="w-4/5 h-12 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div><div class="w-2/5 h-6 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div></div><div class="flex flex-col items-end gap-3 min-w-[200px]" data-v-0086d353><div class="w-32 h-10 rounded-lg shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div><div class="flex gap-3" data-v-0086d353><div class="w-12 h-12 rounded-full shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div><div class="w-12 h-12 rounded-full shimmer bg-slate-200 dark:bg-slate-700" data-v-0086d353></div></div></div></div></div></div></div><section class="py-16 relative z-30" data-v-0086d353><div class="container mx-auto px-4 sm:px-6 lg:px-8" data-v-0086d353><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-0086d353><div class="lg:col-span-2 space-y-12" data-v-0086d353>`);
      if (__props.type === "property") {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-0086d353><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="h-24 rounded-2xl shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-card rounded-3xl p-8 border border-border/50" data-v-0086d353><div class="w-36 h-8 rounded mb-6 shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div><div class="space-y-3" data-v-0086d353><div class="w-full h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" data-v-0086d353></div><div class="w-[95%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" data-v-0086d353></div><div class="w-[98%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" data-v-0086d353></div><div class="w-[80%] h-4 rounded shimmer bg-slate-100 dark:bg-slate-800/20" data-v-0086d353></div></div></div><div class="space-y-6" data-v-0086d353><div class="w-48 h-8 rounded shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div><div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-0086d353><!--[-->`);
      ssrRenderList(4, (i) => {
        _push(`<div class="aspect-square rounded-2xl shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div>`);
      });
      _push(`<!--]--></div></div></div><div data-v-0086d353><div class="bg-card rounded-3xl p-6 border border-border/50 shadow-lg space-y-6" data-v-0086d353><div class="flex flex-col items-center gap-4 py-4" data-v-0086d353><div class="w-24 h-24 rounded-full shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div><div class="w-36 h-6 rounded shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div></div><div class="space-y-4" data-v-0086d353><!--[-->`);
      ssrRenderList(2, (i) => {
        _push(`<div class="w-full h-14 rounded-xl shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div>`);
      });
      _push(`<!--]--></div><div class="w-full h-14 rounded-xl shimmer bg-slate-100 dark:bg-slate-800/50" data-v-0086d353></div></div></div></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/DetailShimmer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DetailShimmer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0086d353"]]);

export { DetailShimmer as D };
//# sourceMappingURL=DetailShimmer-CZGzkLXC.mjs.map
