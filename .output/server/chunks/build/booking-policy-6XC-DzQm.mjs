import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { Home, ChevronRight, CalendarCheck, Info, Clock, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-vue-next';
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
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "booking-policy",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Politique de R\xE9servation & No-Show | CasaNayo",
      meta: [
        { name: "description", content: "Consultez notre politique de r\xE9servation, paiement et conditions de No-Show." }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
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
      _push(`<span class="text-slate-900 font-bold">Politique de R\xE9servation</span></nav><div class="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 mb-10 relative overflow-hidden"><div class="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">`);
      _push(ssrRenderComponent(unref(CalendarCheck), { class: "size-64 text-slate-900" }, null, _parent));
      _push(`</div><div class="relative z-10 space-y-4"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">`);
      _push(ssrRenderComponent(unref(Info), { class: "size-4" }, null, _parent));
      _push(` Paiement &amp; Annulation </div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"> Politique de R\xE9servation<br>&amp; No-Show </h1><div class="flex items-center gap-3 text-slate-500 font-medium font-bold">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4" }, null, _parent));
      _push(`<span>Mis \xE0 jour le 05/11/2025</span></div></div></div><div class="bg-white rounded-[2.5rem] p-8 sm:p-16 shadow-sm border border-slate-100 space-y-16"><section><div class="flex items-center gap-4 mb-8"><div class="size-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">`);
      _push(ssrRenderComponent(unref(AlertCircle), { class: "size-6" }, null, _parent));
      _push(`</div><h2 class="text-3xl font-black text-slate-900 tracking-tighter">D\xE9finition</h2></div><div class="prose prose-slate max-w-none space-y-4 text-slate-600 leading-relaxed text-lg"><p>Le <strong>No-Show</strong> d\xE9signe la situation o\xF9 le client, ayant effectu\xE9 une r\xE9servation et un paiement via la plateforme FlexPaie, ne se pr\xE9sente pas \xE0 la date pr\xE9vue sans avoir annul\xE9 sa r\xE9servation conform\xE9ment \xE0 la politique d\u2019annulation d\xE9finie par le marchand.</p><p class="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-base font-medium"> Cette non-pr\xE9sentation peut constituer un incident de non-conformit\xE9, pouvant entra\xEEner l\u2019application des mesures pr\xE9vues par la pr\xE9sente politique. </p></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3"><span class="size-2 rounded-full bg-primary"></span> Port\xE9e </h2><div class="space-y-4 text-slate-600 text-lg leading-relaxed"><p>Cette politique s\u2019applique \xE0 toutes les r\xE9servations effectu\xE9es via la plateforme de paiement FlexPaie pour les services num\xE9riques ou physiques \xE9ligibles, que le paiement soit effectu\xE9 \xE0 l\u2019avance ou au moment de la r\xE9servation.</p><p>Elle s&#39;applique aussi bien pour les r\xE9servations en ligne que via les canaux partenaires (sites affili\xE9s, applications mobiles, etc.).</p></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Conditions G\xE9n\xE9rales</h2><div class="grid grid-cols-1 gap-4"><div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<p class="text-slate-700 font-medium">Toute r\xE9servation avec paiement sans annulation pr\xE9alable est consid\xE9r\xE9e comme un no-show.</p></div><div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<p class="text-slate-700 font-medium">Les termes et conditions du no-show doivent \xEAtre accept\xE9s explicitement par les clients lors de la r\xE9servation (case \xE0 cocher).</p></div><div class="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-6 text-primary shrink-0" }, null, _parent));
      _push(`<p class="text-slate-700 font-medium">Le marchand doit exiger la copie d\u2019une pi\xE8ce d\u2019identit\xE9 valide pour toute r\xE9servation en ligne.</p></div></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Description de la Proc\xE9dure</h2><div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent"><div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"><div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"><span class="text-xs font-bold">01</span></div><div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm"><h4 class="font-black text-slate-900 mb-2">R\xE9servation et paiement</h4><p class="text-sm text-slate-500 leading-relaxed">Le client accepte les conditions sur FlexPaie et fournit sa pi\xE8ce d&#39;identit\xE9.</p></div></div><div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"><div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"><span class="text-xs font-bold">02</span></div><div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm"><h4 class="font-black text-slate-900 mb-2">V\xE9rification</h4><p class="text-sm text-slate-500 leading-relaxed">V\xE9rification de l&#39;identit\xE9 du client et du statut du paiement.</p></div></div><div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"><div class="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"><span class="text-xs font-bold">03</span></div><div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-white shadow-sm"><h4 class="font-black text-slate-900 mb-2">Arriv\xE9e ou No-show</h4><p class="text-sm text-slate-500 leading-relaxed">Si no-show : d\xE9tection imm\xE9diate et application de la politique.</p></div></div></div></section><section class="pt-8 border-t border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Responsabilit\xE9 du Marchand</h2><div class="bg-blue-600 rounded-3xl p-8 text-white space-y-6"><p class="font-medium text-blue-100 leading-relaxed">Le marchand s&#39;engage \xE0 :</p><ul class="space-y-4"><li class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(ArrowRight), { class: "size-5 shrink-0 mt-0.5" }, null, _parent));
      _push(`<span class="text-sm font-bold">Communiquer les termes et conditions sur chaque offre.</span></li><li class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(ArrowRight), { class: "size-5 shrink-0 mt-0.5" }, null, _parent));
      _push(`<span class="text-sm font-bold">Informer imm\xE9diatement Infoset en cas de no-show via les canaux pr\xE9vus.</span></li><li class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(ArrowRight), { class: "size-5 shrink-0 mt-0.5" }, null, _parent));
      _push(`<span class="text-sm font-bold">Fournir un support et des m\xE9canismes de contestation accessibles.</span></li></ul></div></section><div class="flex justify-center pt-8"><div class="text-center italic text-slate-400 text-xs"> Fait \xE0 Kinshasa le 05/11/2025 </div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/booking-policy.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=booking-policy-6XC-DzQm.mjs.map
