import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, Lock, ShieldCheck, Clock, CheckCircle2 } from 'lucide-vue-next';
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
  __name: "privacy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Politique de Confidentialit\xE9 | CasaNayo",
      meta: [
        { name: "description", content: "D\xE9couvrez comment CasaNayo prot\xE8ge et g\xE8re vos donn\xE9es personnelles." }
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
      _push(`<span class="text-slate-900 font-bold">Confidentialit\xE9</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(Lock), { class: "size-64" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 text-xs font-bold uppercase tracking-widest">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-4" }, null, _parent));
      _push(` Protection des donn\xE9es </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Politique de Confidentialit\xE9 </h1><div class="flex items-center gap-3 text-slate-500 font-medium font-bold">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Derni\xE8re mise \xE0 jour : 05/11/2025</span></div></div></div><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none"><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic"><span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">1</span> Donn\xE9es collect\xE9es </h2><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(CheckCircle2), { class: "size-5 text-blue-600 shrink-0" }, null, _parent));
      _push(`<span class="text-sm font-bold text-slate-700">Informations de compte</span></div><div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(CheckCircle2), { class: "size-5 text-blue-600 shrink-0" }, null, _parent));
      _push(`<span class="text-sm font-bold text-slate-700">Documents d\u2019identit\xE9 (KYC)</span></div><div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(CheckCircle2), { class: "size-5 text-blue-600 shrink-0" }, null, _parent));
      _push(`<span class="text-sm font-bold text-slate-700">Annonces et services</span></div><div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">`);
      _push(ssrRenderComponent(unref(CheckCircle2), { class: "size-5 text-blue-600 shrink-0" }, null, _parent));
      _push(`<span class="text-sm font-bold text-slate-700">Donn\xE9es de navigation</span></div></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic"><span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">2</span> Utilisation des donn\xE9es </h2><div class="space-y-4 text-slate-600 text-lg leading-relaxed text-left"><p>Les donn\xE9es collect\xE9es sont utilis\xE9es afin de :</p><ul class="list-none pl-0 space-y-4 font-bold"><li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100"><div class="size-2 rounded-full bg-blue-600 mt-2"></div><span>Fournir, exploiter et am\xE9liorer les services CasaNayo</span></li><li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100"><div class="size-2 rounded-full bg-blue-600 mt-2"></div><span>V\xE9rifier l\u2019identit\xE9 des utilisateurs et pr\xE9venir la fraude</span></li><li class="flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100"><div class="size-2 rounded-full bg-blue-600 mt-2"></div><span>Faciliter la mise en relation entre utilisateurs</span></li></ul></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic"><span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">3</span> Partage des donn\xE9es </h2><p class="text-slate-600 text-lg mb-6">Vos donn\xE9es personnelles peuvent \xEAtre partag\xE9es uniquement avec :</p><div class="space-y-3"><div class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 font-bold"><div class="size-2 rounded-full bg-slate-300"></div><p class="text-sm">Les utilisateurs concern\xE9s par vos demandes</p></div><div class="flex items-center gap-4 p-4 rounded-xl border border-slate-100 font-bold"><div class="size-2 rounded-full bg-slate-300"></div><p class="text-sm">Les autorit\xE9s administratives si la loi l\u2019exige</p></div></div><div class="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 text-green-800 font-black text-center text-lg italic"> &quot;CasaNayo ne vend jamais vos donn\xE9es personnelles.&quot; </div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic"><span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">4</span> S\xE9curit\xE9 des donn\xE9es </h2><p class="text-slate-600 text-lg mb-6">CasaNayo met en \u0153uvre des mesures techniques appropri\xE9es :</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50"><span class="block text-2xl mb-2">\u{1F510}</span><span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Chiffrement</span><p class="text-sm font-bold mt-1">AES-256</p></div><div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50"><span class="block text-2xl mb-2">\u{1F6E1}\uFE0F</span><span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Acc\xE8s</span><p class="text-sm font-bold mt-1">Restreint</p></div><div class="p-6 text-center border border-slate-100 rounded-3xl bg-slate-50"><span class="block text-2xl mb-2">\u{1F50E}</span><span class="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Audit</span><p class="text-sm font-bold mt-1">R\xE9gulier</p></div></div></section><section><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 tracking-tighter italic"><span class="flex items-center justify-center size-8 rounded-lg bg-blue-600 text-white text-sm">5</span> Vos droits (RDC) </h2><p class="text-slate-600 text-lg mb-6 font-bold">Conform\xE9ment \xE0 la loi n\xB019/002 en RDC, vous disposez des droits suivants :</p><div class="flex flex-wrap gap-2"><span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Acc\xE8s</span><span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Rectification</span><span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Suppression</span><span class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold">Opposition</span></div></section></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/privacy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=privacy-DN4fkSD0.mjs.map
