import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CasaListCardShimmer",
  __ssrInlineRender: true,
  props: {
    variant: { default: "card" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm" }, _attrs))}><div class="${ssrRenderClass([__props.variant === "blue" ? "casa-shimmer-blue" : "casa-shimmer-slate", "aspect-[16/10]"])}"></div><div class="space-y-3 p-5"><div class="h-4 w-2/3 rounded-lg casa-shimmer-slate"></div><div class="h-3 w-full rounded-lg casa-shimmer-slate"></div><div class="h-3 w-4/5 rounded-lg casa-shimmer-slate"></div><div class="flex gap-2 pt-2"><div class="h-10 flex-1 rounded-xl casa-shimmer-slate"></div><div class="h-10 flex-1 rounded-xl casa-shimmer-slate"></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CasaListCardShimmer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CasaListCardShimmer-D0zSGUKF.mjs.map
