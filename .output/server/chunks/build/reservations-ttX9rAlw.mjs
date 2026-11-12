import { _ as _sfc_main$1 } from './ReservationsBookingView-CWv8trWL.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
import './reservations-DMpUain_.mjs';
import 'pinia';
import './partyExtract-C97-iyVh.mjs';
import './apiListResponse-BRFNgDZl.mjs';
import './index-DJGQOf1Z.mjs';
import './propertyLink-DjylkIdD.mjs';
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
  __name: "reservations",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "R\xE9servations re\xE7ues \u2014 H\xF4tel"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ReservationsBookingView = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-2" }, _attrs))}><div class="mb-6"><h1 class="text-2xl font-black md:text-3xl">R\xE9servations sur vos chambres</h1><p class="text-sm text-muted-foreground"> G\xE9rez l&#39;ensemble des demandes de r\xE9servation re\xE7ues pour vos h\xF4tels. </p></div>`);
      _push(ssrRenderComponent(_component_ReservationsBookingView, {
        embedded: "",
        searchable: "",
        "initial-perspective": "host",
        "host-reservation-scope": "chambre"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/hotel/reservations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reservations-ttX9rAlw.mjs.map
