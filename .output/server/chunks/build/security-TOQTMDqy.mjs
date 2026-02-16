import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, resolveComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, ShieldAlert, ShieldCheck, Clock, Key, EyeOff, Server } from 'lucide-vue-next';
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
  __name: "security",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "S\xE9curit\xE9 | CasaNayo",
      meta: [
        { name: "description", content: "D\xE9couvrez les mesures de s\xE9curit\xE9 mises en \u0153uvre par CasaNayo pour prot\xE9ger vos \xE9changes et vos donn\xE9es." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Lock = resolveComponent("Lock");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50/50 pt-24 pb-20 font-sans" }, _attrs))}><div class="container mx-auto px-6 sm:px-8 lg:px-12 max-w-4xl"><nav class="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">`);
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
      _push(`<span class="text-slate-900 font-bold">S\xE9curit\xE9</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(ShieldAlert), { class: "size-64 text-red-600" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-4" }, null, _parent));
      _push(` Infrastructure S\xE9curis\xE9e </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Transparence &amp; S\xE9curit\xE9 </h1><div class="flex items-center gap-3 text-slate-500 font-medium">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Mis \xE0 jour le 05/11/2025</span></div></div></div><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none"><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 italic">Notre Engagement</h2><p class="text-slate-600 text-lg leading-relaxed"> La protection de vos informations est notre priorit\xE9 absolue. CasaNayo utilise des technologies de pointe pour garantir que chaque donn\xE9e stock\xE9e et chaque transaction effectu\xE9e sur notre plateforme est prot\xE9g\xE9e contre tout acc\xE8s non autoris\xE9. </p></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 italic">Mesures de protection</h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-6"><div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left"><div class="size-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:scale-110">`);
      _push(ssrRenderComponent(_component_Lock, { class: "size-6" }, null, _parent));
      _push(`</div><h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Chiffrement</h4><p class="font-bold text-slate-900 text-lg">AES-256</p><p class="text-sm text-slate-500 leading-relaxed font-medium">Toutes vos donn\xE9es sensibles et documents KYC sont chiffr\xE9s \xE0 l&#39;aide des standards militaires les plus rigoureux.</p></div><div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left"><div class="size-14 rounded-2xl bg-primary flex items-center justify-center text-white transition-transform group-hover:scale-110">`);
      _push(ssrRenderComponent(unref(Key), { class: "size-6" }, null, _parent));
      _push(`</div><h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Acc\xE8s</h4><p class="font-bold text-slate-900 text-lg">S\xE9curis\xE9 &amp; Restreint</p><p class="text-sm text-slate-500 leading-relaxed font-medium">Nous proposons l&#39;authentification \xE0 deux facteurs pour garantir que vous seul puissiez acc\xE9der \xE0 votre compte.</p></div><div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left"><div class="size-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white transition-transform group-hover:scale-110">`);
      _push(ssrRenderComponent(unref(EyeOff), { class: "size-6" }, null, _parent));
      _push(`</div><h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Audit</h4><p class="font-bold text-slate-900 text-lg">R\xE9gulier &amp; Transparent</p><p class="text-sm text-slate-500 leading-relaxed font-medium">L&#39;acc\xE8s aux donn\xE9es des utilisateurs est strictement limit\xE9 aux personnels autoris\xE9s sous protocoles stricts.</p></div><div class="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-4 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-100 group text-left"><div class="size-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white transition-transform group-hover:scale-110">`);
      _push(ssrRenderComponent(unref(Server), { class: "size-6" }, null, _parent));
      _push(`</div><h4 class="font-black text-[10px] uppercase tracking-widest text-slate-400">Infrastructure</h4><p class="font-bold text-slate-900 text-lg">Redondante</p><p class="text-sm text-slate-500 leading-relaxed font-medium">Vos donn\xE9es sont sauvegard\xE9es quotidiennement sur des serveurs s\xE9curis\xE9s et g\xE9ographiquement redondants.</p></div></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 italic">Culture de l&#39;Audit</h2><p class="text-slate-600 text-lg leading-relaxed mb-6 font-bold"> Nous r\xE9alisons des tests de p\xE9n\xE9tration et des audits de s\xE9curit\xE9 r\xE9guliers pour identifier et corriger proactivement toute vuln\xE9rabilit\xE9 potentielle. </p><div class="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-sm"><p class="font-black uppercase tracking-widest text-xs mb-2">Signaler une faille</p><p>Si vous pensez avoir identifi\xE9 un probl\xE8me de s\xE9curit\xE9, veuillez contacter notre \xE9quipe d\xE9di\xE9e imm\xE9diatement \xE0 : <span class="font-bold">security@casanayo.cd</span></p></div></section></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/security.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=security-TOQTMDqy.mjs.map
