import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _imports_0 = "" + buildAssetsURL("lingwala.B2iyDj-g.jpg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const formData = ref({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    const isSubmitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50" }, _attrs))}><section class="relative py-24 overflow-hidden bg-slate-900 border-b border-white/5"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Contact background"><div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div><div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div><div class="absolute -top-24 -right-24 size-96 bg-primary/20 rounded-full blur-[120px]"></div></div><div class="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center"><h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"> Contactez <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">CasaNayo</span></h1><p class="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"> Une question ? Un projet immobilier ? Notre \xE9quipe d&#39;experts est \xE0 votre \xE9coute pour vous accompagner dans toutes vos d\xE9marches. </p></div></section><section class="py-20"><div class="container mx-auto px-4 sm:px-6 lg:px-12"><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"><div class="lg:col-span-12 xl:col-span-5 space-y-8"><div class="space-y-6"><h2 class="text-3xl font-black text-slate-900 leading-tight">Nos coordonn\xE9es</h2><p class="text-slate-500 font-medium">N&#39;h\xE9sitez pas \xE0 nous rendre visite ou \xE0 nous contacter directement par t\xE9l\xE9phone ou email.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-6"><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-6 text-primary group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Si\xE8ge Social</h3><p class="text-base font-bold text-slate-800 leading-relaxed"> Av. S\xE9n\xE9galais, Gare Centrale<br> Kinshasa Gombe, RDC </p></div></div></div><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-6 text-blue-500 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">T\xE9l\xE9phone</h3><p class="text-base font-bold text-slate-800">+243 836 323 805</p><p class="text-sm text-slate-400 font-medium mt-1">Disponible 24h/24 par WhatsApp</p></div></div></div><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-400/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center shrink-0 group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-6 text-sky-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Support</h3><p class="text-base font-bold text-slate-800">contact@casanayo.com</p><p class="text-sm text-slate-400 font-medium mt-1">R\xE9ponse sous 24h ouvr\xE9es</p></div></div></div></div><div class="p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative group"><div class="absolute -right-12 -bottom-12 size-48 bg-primary/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110"></div><div class="relative z-10 space-y-6"><div class="flex items-center gap-3"><div class="size-8 rounded-lg bg-white/10 flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Clock), { class: "size-4 text-primary-foreground" }, null, _parent));
      _push(`</div><h4 class="text-lg font-bold">Heures d&#39;ouverture</h4></div><div class="space-y-3 font-medium text-slate-300"><div class="flex justify-between items-center py-2 border-b border-white/5"><span>Lundi - Vendredi</span><span class="text-white font-bold text-sm">08:00 - 18:00</span></div><div class="flex justify-between items-center py-2 border-b border-white/5"><span>Samedi</span><span class="text-white font-bold text-sm">09:00 - 15:00</span></div><div class="flex justify-between items-center pt-2"><span>Dimanche</span><span class="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase">Ferm\xE9</span></div></div></div></div></div><div class="lg:col-span-12 xl:col-span-7"><div class="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50"><div class="mb-10"><h3 class="text-2xl font-black text-slate-900 mb-4">Envoyez-nous un message</h3><p class="text-slate-500 font-medium">Remplissez ce formulaire et un consultant prendra contact avec vous.</p></div><form class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label><input${ssrRenderAttr("value", unref(formData).name)} required type="text" placeholder="Ebaka Phambu" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label><input${ssrRenderAttr("value", unref(formData).email)} required type="email" placeholder="ebaka.phambu@email.com" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="md:col-span-2 space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sujet</label><input${ssrRenderAttr("value", unref(formData).subject)} required type="text" placeholder="Demande d&#39;information pour une villa" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="md:col-span-2 space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label><textarea required rows="5" placeholder="Comment pouvons-nous vous aider ?" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 resize-none">${ssrInterpolate(unref(formData).message)}</textarea></div><div class="md:col-span-2 pt-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        type: "submit",
        disabled: unref(isSubmitting),
        class: "w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!unref(isSubmitting)) {
              _push2(`<span${_scopeId}>Envoyer le message</span>`);
            } else {
              _push2(`<span${_scopeId}>Envoi en cours...</span>`);
            }
            if (!unref(isSubmitting)) {
              _push2(ssrRenderComponent(unref(Send), { class: "size-5" }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"${_scopeId}></div>`);
            }
          } else {
            return [
              !unref(isSubmitting) ? (openBlock(), createBlock("span", { key: 0 }, "Envoyer le message")) : (openBlock(), createBlock("span", { key: 1 }, "Envoi en cours...")),
              !unref(isSubmitting) ? (openBlock(), createBlock(unref(Send), {
                key: 2,
                class: "size-5"
              })) : (openBlock(), createBlock("div", {
                key: 3,
                class: "size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div></div></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-DfC_8phu.mjs.map
