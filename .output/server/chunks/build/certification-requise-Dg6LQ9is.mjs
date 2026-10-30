import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ShieldAlert, Check } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, l as useAuthStore } from './server.mjs';
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
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "certification-requise",
  __ssrInlineRender: true,
  props: {
    reason: {}
  },
  setup(__props) {
    const props = __props;
    useRouter();
    const reasonText = computed(() => props.reason || "Votre certification a \xE9t\xE9 suspendue car vos documents ne sont pas valides ou ne respectent pas nos r\xE8gles de s\xE9curit\xE9 actuelles.");
    const benefits = [
      "Publier des annonces immobili\xE8res",
      "Proposer des services professionnels",
      "Effectuer des r\xE9servations"
    ];
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "google-wrapper" }, _attrs))} data-v-1b027ace><div class="google-container animate-fade-in" data-v-1b027ace><div class="icon-section" data-v-1b027ace>`);
      _push(ssrRenderComponent(unref(ShieldAlert), {
        class: "google-icon",
        size: 48,
        "stroke-width": 1.5
      }, null, _parent));
      _push(`</div><h1 class="google-title" data-v-1b027ace> Mise \xE0 jour requise </h1><p class="google-subtitle" data-v-1b027ace>${ssrInterpolate(reasonText.value)}</p><div class="benefits-card" data-v-1b027ace><h2 class="benefits-label" data-v-1b027ace>Pourquoi se certifier</h2><ul class="benefits-list" data-v-1b027ace><!--[-->`);
      ssrRenderList(benefits, (benefit, index) => {
        _push(`<li class="benefit-item" data-v-1b027ace>`);
        _push(ssrRenderComponent(unref(Check), {
          class: "check-icon",
          size: 20,
          "stroke-width": 2
        }, null, _parent));
        _push(`<span class="benefit-text" data-v-1b027ace>${ssrInterpolate(benefit)}</span></li>`);
      });
      _push(`<!--]--></ul></div><div class="actions-section" data-v-1b027ace><button class="google-btn-primary" data-v-1b027ace> Mettre \xE0 jour mes documents </button><button class="google-btn-secondary" data-v-1b027ace> Plus tard </button></div><div class="footer-section" data-v-1b027ace><p data-v-1b027ace>Un probl\xE8me ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "google-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contacter le support`);
          } else {
            return [
              createTextVNode("Contacter le support")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/certification-requise.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const certificationRequise = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1b027ace"]]);

export { certificationRequise as default };
//# sourceMappingURL=certification-requise-Dg6LQ9is.mjs.map
