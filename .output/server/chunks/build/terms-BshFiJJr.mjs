import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, Gavel, ShieldCheck, Clock } from 'lucide-vue-next';
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
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Conditions d'utilisation | CasaNayo",
      meta: [
        { name: "description", content: "D\xE9couvrez les conditions d'utilisation de la plateforme CasaNayo." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ArrowRight = resolveComponent("ArrowRight");
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
      _push(`<span class="text-slate-900 font-bold">Conditions d&#39;utilisation</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(Gavel), { class: "size-64" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-4" }, null, _parent));
      _push(` Document Officiel </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Conditions d&#39;Utilisation </h1><div class="flex items-center gap-3 text-slate-500 font-medium">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Derni\xE8re mise \xE0 jour : 05/11/2025</span></div></div></div><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none"><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">1</span> Acceptation des conditions </h2><div class="space-y-4 text-slate-600 leading-relaxed text-lg"><p>En utilisant l&#39;application CasaNayo, vous acceptez pleinement et sans r\xE9serve les pr\xE9sentes conditions d&#39;utilisation.</p><p>Votre acc\xE8s et votre utilisation continus du service valent acceptation de toute modification ou mise \xE0 jour future des pr\xE9sentes conditions.</p></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">2</span> Description du service </h2><div class="space-y-6 text-slate-600 leading-relaxed text-lg"><p>CasaNayo est une plateforme num\xE9rique tout-en-un d\xE9di\xE9e :</p><ul class="list-disc pl-6 space-y-2 marker:text-primary"><li>\xC0 l\u2019immobilier (location, vente, mise en relation)</li><li>Et aux services du quotidien \xE0 domicile</li></ul><p>Pens\xE9e pour \xEAtre intuitive, rapide et efficace, CasaNayo centralise l\u2019ensemble du parcours immobilier et des services de proximit\xE9 dans une seule application moderne et accessible.</p><div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-base"><p class="font-bold text-slate-900 uppercase text-xs tracking-widest text-primary">La plateforme met en relation :</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Propri\xE9taires</div><div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Locataires ou acheteurs</div><div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Agents immobiliers</div><div class="flex items-center gap-2"><div class="size-1.5 rounded-full bg-primary font-bold"></div> Prestataires de services</div></div></div><p class="font-bold text-slate-900">Les services propos\xE9s incluent notamment :</p><ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0"><li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-5 text-primary shrink-0 mt-1" }, null, _parent));
      _push(`<span>Recherche intelligente de biens</span></li><li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-5 text-primary shrink-0 mt-1" }, null, _parent));
      _push(`<span>Gestion simplifi\xE9e d&#39;annonces</span></li><li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-5 text-primary shrink-0 mt-1" }, null, _parent));
      _push(`<span>V\xE9rification d\u2019identit\xE9 (KYC)</span></li><li class="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-5 text-primary shrink-0 mt-1" }, null, _parent));
      _push(`<span>Contact direct avec pros (plombiers, \xE9lectriciens...)</span></li></ul></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">3</span> Compte utilisateur </h2><div class="space-y-4 text-slate-600 leading-relaxed text-lg"><p>L\u2019acc\xE8s \xE0 certaines fonctionnalit\xE9s n\xE9cessite la cr\xE9ation d\u2019un compte utilisateur. Vous vous engagez \xE0 fournir des informations exactes, compl\xE8tes et \xE0 jour.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"><div class="p-6 border border-slate-100 rounded-2xl bg-slate-50/50"><h4 class="font-bold text-slate-900 mb-2">Conditions d&#39;acc\xE8s</h4><ul class="text-sm space-y-2"><li class="flex items-center gap-2">\u2713 \xC2ge minimum : 18 ans</li><li class="flex items-center gap-2">\u2713 Un seul compte par personne</li><li class="flex items-center gap-2">\u2713 V\xE9rification d&#39;identit\xE9 (KYC)</li></ul></div><div class="p-6 border border-slate-100 rounded-2xl bg-slate-50/50"><h4 class="font-bold text-slate-900 mb-2">Responsabilit\xE9</h4><ul class="text-sm space-y-2 text-slate-500"><li>Toute activit\xE9 effectu\xE9e depuis votre compte est r\xE9put\xE9e \xEAtre r\xE9alis\xE9e par vous. Veillez \xE0 la confidentialit\xE9 de vos identifiants.</li></ul></div></div></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">4</span> Responsabilit\xE9s des utilisateurs </h2><div class="space-y-4 text-slate-600 leading-relaxed text-lg text-left"><p>Les utilisateurs sont seuls responsables du contenu qu\u2019ils publient et des transactions r\xE9alis\xE9es.</p><div class="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 text-base italic"> &quot;Cela inclut la v\xE9racit\xE9 des annonces, le respect des lois en RDC et les \xE9changes entre membres, qu&#39;ils soient conclus sur ou en dehors de la plateforme.&quot; </div></div></section><section class="mb-12"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">5</span> Propri\xE9t\xE9 intellectuelle </h2><p class="text-slate-600 leading-relaxed text-lg"> L\u2019ensemble des \xE9l\xE9ments composant l\u2019application CasaNayo (logos, marques, interfaces, fonctionnalit\xE9s) est la propri\xE9t\xE9 exclusive de <strong>Casanayo SARL</strong>. Toute reproduction sans autorisation \xE9crite pr\xE9alable est strictement interdite. </p></section><section><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="flex items-center justify-center size-8 rounded-lg bg-slate-900 text-white text-sm">6</span> Limitations de responsabilit\xE9 </h2><p class="text-slate-600 leading-relaxed text-lg mb-6"> CasaNayo agit exclusivement en tant qu\u2019interm\xE9diaire technique de mise en relation. </p><div class="space-y-3"><div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors"><div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div><p class="text-sm">CasaNayo n&#39;est pas responsable des litiges entre utilisateurs ou prestataires.</p></div><div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors"><div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div><p class="text-sm">CasaNayo ne garantit pas la qualit\xE9 ou la l\xE9galit\xE9 des annonces propos\xE9es.</p></div><div class="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors"><div class="size-2 rounded-full bg-primary mt-2 flex-shrink-0"></div><p class="text-sm">CasaNayo n&#39;est pas tenue pour responsable de l\u2019\xE9chec d\u2019une transaction.</p></div></div></section></div><div class="mt-12 text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/#contact",
        class: "inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all underline decoration-2 underline-offset-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Une question ? Contactez notre support `);
            _push2(ssrRenderComponent(_component_ArrowRight, { class: "size-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Une question ? Contactez notre support "),
              createVNode(_component_ArrowRight, { class: "size-4" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=terms-BshFiJJr.mjs.map
