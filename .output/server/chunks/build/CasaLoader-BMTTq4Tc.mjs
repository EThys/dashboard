import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CasaLoader",
  __ssrInlineRender: true,
  props: {
    size: {}
  },
  setup(__props) {
    const props = __props;
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16"
    };
    const currentSize = computed(() => props.size || "md");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center justify-center gap-3" }, _attrs))}><div class="${ssrRenderClass(["relative flex items-center justify-center", sizeClasses[unref(currentSize)]])}"><div class="absolute inset-0 rounded-full border-2 border-primary/20"></div><div class="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div><div class="absolute inset-0 flex items-center justify-center"><div class="w-[40%] h-[40%] bg-primary rounded-sm animate-pulse"></div></div></div><div class="flex flex-col items-center animate-pulse"><span class="text-sm font-bold text-primary tracking-widest uppercase">CasaNayo</span></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CasaLoader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CasaLoader-BMTTq4Tc.mjs.map
