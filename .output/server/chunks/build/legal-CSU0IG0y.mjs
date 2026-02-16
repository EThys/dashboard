import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, resolveComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, Building2, Gavel, Clock, MapPin, Phone, Mail } from 'lucide-vue-next';
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
  __name: "legal",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Mentions L\xE9gales | CasaNayo",
      meta: [
        { name: "description", content: "Mentions l\xE9gales et informations corporatives de Casanayo SARL." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ShieldCheck = resolveComponent("ShieldCheck");
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
      _push(`<span class="text-slate-900 font-bold">Mentions l\xE9gales</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(Building2), { class: "size-64 text-slate-900" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest border border-slate-200">`);
      _push(ssrRenderComponent(unref(Gavel), { class: "size-4" }, null, _parent));
      _push(` Informations L\xE9gales </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Mentions L\xE9gales </h1><div class="flex items-center gap-3 text-slate-500 font-medium">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Mis \xE0 jour le 05/11/2025</span></div></div></div><div class="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-sm border border-slate-100 space-y-16"><section><h2 class="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4 italic tracking-tighter"> L&#39;\xC9diteur </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-6"><div class="flex items-start gap-4">`);
      _push(ssrRenderComponent(unref(Building2), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Soci\xE9t\xE9</p><p class="font-bold text-slate-900 text-lg">Casanayo SARL</p></div></div><div class="flex items-start gap-4">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Si\xE8ge Social</p><p class="font-bold text-slate-900 text-lg">Gombe, Kinshasa,<br>R\xE9publique D\xE9mocratique du Congo</p></div></div></div><div class="space-y-6"><div class="flex items-start gap-4">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">T\xE9l\xE9phone</p><p class="font-bold text-slate-900 text-lg">+243 810 000 000</p></div></div><div class="flex items-start gap-4">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<div><p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</p><p class="font-bold text-slate-900 text-lg">contact@casanayo.cd</p></div></div></div></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter"> Direction </h2><div class="bg-slate-50 rounded-3xl p-8 border border-slate-100"><p class="text-sm text-slate-500 font-bold uppercase tracking-widest mb-2">Directeur de la publication</p><p class="text-xl font-black text-slate-900">Le G\xE9rant statutaire de Casanayo SARL</p></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter"> H\xE9bergement </h2><p class="text-slate-600 text-lg leading-relaxed mb-6 font-bold"> La plateforme CasaNayo est h\xE9berg\xE9e sur des serveurs s\xE9curis\xE9s garantissant une haute disponibilit\xE9 et une protection optimale des donn\xE9es. </p><div class="p-6 rounded-2xl bg-slate-900 text-white flex items-center justify-between"><div><p class="font-black text-lg">Infrastructure Cloud Native</p><p class="text-xs text-slate-400 font-bold">Localisation : Global &amp; S\xE9curis\xE9</p></div>`);
      _push(ssrRenderComponent(_component_ShieldCheck, { class: "size-10 text-primary" }, null, _parent));
      _push(`</div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 italic tracking-tighter"> Protection des Donn\xE9es (DPD) </h2><p class="text-slate-600 text-lg leading-relaxed mb-6"> Pour toute demande relative \xE0 vos donn\xE9es personnelles, vous pouvez contacter notre d\xE9l\xE9gu\xE9 \xE0 la protection des donn\xE9es : </p><a href="mailto:dpd@casanayo.cd" class="inline-flex items-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-5" }, null, _parent));
      _push(` dpd@casanayo.cd </a></section></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/legal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=legal-CSU0IG0y.mjs.map
