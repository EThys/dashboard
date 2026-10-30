import { _ as _sfc_main$1 } from './ReservationsBookingView-CZ3EdvKE.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './server.mjs';
import './CasaListCardShimmer-D0zSGUKF.mjs';
import './nuxt-link-kZaXe760.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'lucide-vue-next';
import './Button-B_RLy27J.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import './Badge-CZaU8sYj.mjs';
import './reservations-DwuL3whZ.mjs';
import 'pinia';
import './partyExtract-LSdOdPXy.mjs';
import './index-DJGQOf1Z.mjs';
import './urlObfuscator-B34PnJ0V.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "my-reservations",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Mes R\xE9servations"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ReservationsBookingView = _sfc_main$1;
      _push(ssrRenderComponent(_component_ReservationsBookingView, mergeProps({ embedded: "" }, _attrs), null, _parent));
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
//# sourceMappingURL=my-reservations-CkGJO_Gq.mjs.map
