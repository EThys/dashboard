import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { _ as _sfc_main$1 } from './SolicitationsServiceView-CW41nXN7.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './CasaListCardShimmer-D0zSGUKF.mjs';
import 'lucide-vue-next';
import './Button-B_RLy27J.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import './Badge-CZaU8sYj.mjs';
import './solicitations-lIuisKuL.mjs';
import 'pinia';
import './partyExtract-C97-iyVh.mjs';
import './index-DJGQOf1Z.mjs';
import './currency-BoakoUK-.mjs';
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
  __name: "sollicitations",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Mes sollicitations"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_SolicitationsServiceView = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-4" }, _attrs))}><div class="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-sm font-semibold text-[#1976D2] hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2190 Retour \xE0 l\u2019accueil `);
          } else {
            return [
              createTextVNode(" \u2190 Retour \xE0 l\u2019accueil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap items-center gap-4 text-sm font-semibold">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/compte/reservations",
        class: "text-slate-600 hover:text-[#1976D2]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` R\xE9servations (biens) `);
          } else {
            return [
              createTextVNode(" R\xE9servations (biens) ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/compte/abonnement",
        class: "text-slate-600 hover:text-[#1976D2]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mon abonnement `);
          } else {
            return [
              createTextVNode(" Mon abonnement ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_SolicitationsServiceView, { embedded: false }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/sollicitations.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sollicitations-DtnXLB6Y.mjs.map
