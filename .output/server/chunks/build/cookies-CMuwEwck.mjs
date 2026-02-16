import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, Cookie, Info, Clock, ShieldCheck } from 'lucide-vue-next';
import { u as useHead } from './server.mjs';
import '../nitro/nitro.mjs';
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
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'vue-sonner';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cookies",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Politique des Cookies | CasaNayo",
      meta: [
        { name: "description", content: "Informations sur l'utilisation des cookies sur la plateforme CasaNayo." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50/50 pt-24 pb-20" }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl"><nav class="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "hover:text-primary transition-colors flex items-center gap-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Home), { class: "size-4" }, null, _parent2, _scopeId));
            _push2(`<span${_scopeId}>Accueil</span>`);
          } else {
            return [
              createVNode(unref(Home), { class: "size-4" }),
              createVNode("span", null, "Accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(ChevronRight), { class: "size-3 opacity-50" }, null, _parent));
      _push(`<span class="text-slate-900 font-bold">Cookies</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(Cookie), { class: "size-64" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 text-amber-600 text-xs font-bold uppercase tracking-widest">`);
      _push(ssrRenderComponent(unref(Info), { class: "size-4" }, null, _parent));
      _push(` Information Navigation </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Politique des Cookies </h1><div class="flex items-center gap-3 text-slate-500 font-medium">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Derni\xE8re mise \xE0 jour : 05/11/2025</span></div></div></div><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none"><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">`);
      _push(ssrRenderComponent(unref(Cookie), { class: "size-6 text-amber-600" }, null, _parent));
      _push(` Qu&#39;est-ce qu&#39;un cookie ? </h2><p class="text-slate-600 text-lg leading-relaxed"> Un cookie est un petit fichier texte stock\xE9 sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d&#39;un site ou de l&#39;utilisation d&#39;une application. Il permet au site de m\xE9moriser vos actions et pr\xE9f\xE9rences pour une p\xE9riode donn\xE9e. </p></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 italic">Pourquoi utilisons-nous des cookies ?</h2><div class="space-y-4"><div class="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50"><h4 class="font-bold text-slate-900 mb-2">Cookies Essentiels</h4><p class="text-sm text-slate-600">Ces cookies sont n\xE9cessaires au fonctionnement de CasaNayo. Ils vous permettent de rester connect\xE9 \xE0 votre compte et d&#39;acc\xE9der aux zones s\xE9curis\xE9es.</p></div><div class="p-6 rounded-2xl border border-slate-100"><h4 class="font-bold text-slate-900 mb-2">Cookies Analytiques</h4><p class="text-sm text-slate-600">Ils nous aident \xE0 comprendre comment les utilisateurs interagissent avec la plateforme, nous permettant ainsi d&#39;optimiser l&#39;exp\xE9rience et la navigation.</p></div><div class="p-6 rounded-2xl border border-slate-100"><h4 class="font-bold text-slate-900 mb-2">Cookies de Pr\xE9f\xE9rences</h4><p class="text-sm text-slate-600">Ils permettent de m\xE9moriser vos choix (comme votre langue ou votre ville de recherche favorite).</p></div></div></section><section><h2 class="text-2xl font-black text-slate-900 mb-6 italic">Gestion de vos choix</h2><p class="text-slate-600 text-lg mb-6"> Vous pouvez \xE0 tout moment configurer votre navigateur pour bloquer les cookies ou \xEAtre inform\xE9 de leur installation. Notez cependant que la d\xE9sactivation de certains cookies peut alt\xE9rer votre exp\xE9rience sur CasaNayo. </p><div class="flex items-center gap-4 p-6 bg-slate-900 rounded-2xl text-white">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-8 text-primary shrink-0" }, null, _parent));
      _push(`<div><p class="font-bold">Confidentialit\xE9 garantie</p><p class="text-xs text-slate-400">Aucun cookie publicitaire tiers n&#39;est utilis\xE9 sans votre consentement explicite.</p></div></div></section></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cookies.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cookies-CMuwEwck.mjs.map
