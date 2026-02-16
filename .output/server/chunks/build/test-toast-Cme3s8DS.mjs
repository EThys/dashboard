import { defineComponent, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { toast } from 'vue-sonner';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "test-toast",
  __ssrInlineRender: true,
  setup(__props) {
    const testSuccess = () => {
      console.log("Test success toast");
      toast.success("Test de succ\xE8s", {
        description: "Ce toast devrait \xEAtre vert",
        duration: 5e3
      });
    };
    const testError = () => {
      console.log("Test error toast");
      toast.error("Test d'erreur", {
        description: "Ce toast devrait \xEAtre rouge",
        duration: 5e3
      });
    };
    const testInfo = () => {
      console.log("Test info toast");
      toast.info("Test d'info", {
        description: "Ce toast devrait \xEAtre bleu",
        duration: 5e3
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-background" }, _attrs))}><div class="space-y-4"><h1 class="text-2xl font-bold">Test des Toasts</h1><div class="flex flex-col gap-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: testSuccess,
        class: "bg-green-600 hover:bg-green-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Test Success Toast `);
          } else {
            return [
              createTextVNode(" Test Success Toast ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: testError,
        variant: "destructive"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Test Error Toast `);
          } else {
            return [
              createTextVNode(" Test Error Toast ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: testInfo,
        variant: "outline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Test Info Toast `);
          } else {
            return [
              createTextVNode(" Test Info Toast ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/test-toast.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=test-toast-Cme3s8DS.mjs.map
