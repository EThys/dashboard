import { c as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { MapPin, Phone, Mail, Send, ChevronDown } from 'lucide-vue-next';
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
import 'unhead/plugins';
import 'unhead/utils';
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
    const activeFaq = ref(0);
    const faqs = [
      {
        question: "Comment fonctionne la r\xE9servation sur l'application CasaNayo ?",
        answer: "C'est tr\xE8s simple ! Une fois que vous avez trouv\xE9 le bien qui vous int\xE9resse, cliquez sur 'R\xE9server' ou 'Demander une visite'. Pour valider votre premi\xE8re r\xE9servation, un abonnement annuel de seulement 4$ est requis, vous offrant un acc\xE8s illimit\xE9 \xE0 toutes les opportunit\xE9s du r\xE9seau pendant un an."
      },
      {
        question: "Quels sont les avantages d'utiliser votre plateforme web ?",
        answer: "CasaNayo centralise les meilleures offres immobili\xE8res de Kinshasa et de la RDC. Vous profitez d'une interface ultra-rapide, de filtres intelligents, et d'un syst\xE8me de messagerie s\xE9curis\xE9 pour communiquer en toute transparence."
      },
      {
        question: "Comment garantissez-vous la v\xE9racit\xE9 des annonces ?",
        answer: "Chaque annonce publi\xE9e sur notre application web et mobile passe par un processus de mod\xE9ration. Nous v\xE9rifions les documents de propri\xE9t\xE9 et l'identit\xE9 des annonceurs pour vous garantir une exp\xE9rience s\xE9curis\xE9e et sans mauvaises surprises."
      },
      {
        question: "Puis-je lister mon propre bien sur CasaNayo ?",
        answer: "Absolument ! Cr\xE9ez un compte 'Propri\xE9taire' pour commencer \xE0 publier vos biens. Pour activer la mise en ligne de vos annonces, un abonnement de 4$ par an est n\xE9cessaire, incluant des outils de gestion avanc\xE9s pour suivre vos r\xE9servations en temps r\xE9el."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50" }, _attrs))}><section class="relative overflow-hidden bg-slate-800"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="w-full h-full object-cover opacity-40" alt="Contact" loading="eager" fetchpriority="high" decoding="async"><div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div><div class="absolute -top-24 -right-24 size-96 bg-primary/15 rounded-full blur-[120px]"></div></div><div class="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center"><div class="py-10 md:py-16 max-w-2xl mx-auto"><h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"> Contactez <span class="text-primary"> CasaNayo</span></h1><p class="mt-3 text-slate-300/80 text-sm md:text-base max-w-xl mx-auto"> Une question, un projet immobilier ? Notre \xE9quipe est disponible 24h/24 sur WhatsApp. </p></div></div></section><section class="py-20"><div class="container mx-auto px-4 sm:px-6 lg:px-12"><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16"><div class="lg:col-span-12 xl:col-span-5 space-y-8"><div class="space-y-6"><h2 class="text-3xl font-black text-slate-900 leading-tight">Nos coordonn\xE9es</h2><p class="text-slate-500 font-medium">N&#39;h\xE9sitez pas \xE0 nous rendre visite ou \xE0 nous contacter directement par t\xE9l\xE9phone ou email.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 gap-6"><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-500">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-6 text-primary group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Si\xE8ge Social</h3><p class="text-base font-bold text-slate-800 leading-relaxed"> Av. S\xE9n\xE9galais, Gare Centrale<br> Kinshasa Gombe, RDC </p></div></div></div><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-6 text-blue-500 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">T\xE9l\xE9phone</h3><p class="text-base font-bold text-slate-800">+243 836 323 805</p><p class="text-sm text-slate-400 font-medium mt-1">Disponible 24h/24 par WhatsApp</p></div></div></div><div class="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-400/5 transition-all duration-500"><div class="flex items-start gap-5"><div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center shrink-0 group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-6 text-sky-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Support</h3><p class="text-base font-bold text-slate-800">contact@casanayo.com</p><p class="text-sm text-slate-400 font-medium mt-1">R\xE9ponse sous 24h ouvr\xE9es</p></div></div></div></div></div><div class="lg:col-span-12 xl:col-span-7"><div class="bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50"><div class="mb-10"><h3 class="text-2xl font-black text-slate-900 mb-4">Envoyez-nous un message</h3><p class="text-slate-500 font-medium">Remplissez ce formulaire et un consultant prendra contact avec vous.</p></div><form class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom complet</label><input${ssrRenderAttr("value", unref(formData).name)} required type="text" placeholder="Ebaka Phambu" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label><input${ssrRenderAttr("value", unref(formData).email)} required type="email" placeholder="ebaka.phambu@email.com" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="md:col-span-2 space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sujet</label><input${ssrRenderAttr("value", unref(formData).subject)} required type="text" placeholder="Demande d&#39;information pour une villa" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700"></div><div class="md:col-span-2 space-y-2"><label class="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label><textarea required rows="5" placeholder="Comment pouvons-nous vous aider ?" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 resize-none">${ssrInterpolate(unref(formData).message)}</textarea></div><div class="md:col-span-2 pt-4">`);
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
      _push(`</div></form></div></div></div></div></section><section class="py-24 bg-white border-t border-slate-100"><div class="container mx-auto px-4 sm:px-6 lg:px-12"><div class="max-w-4xl mx-auto"><div class="text-center mb-16 space-y-4"><span class="text-primary font-bold tracking-widest uppercase text-[10px]">Questions Fr\xE9quentes</span><h2 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Tout ce que vous devez savoir</h2><p class="text-slate-500 font-medium">Vous avez des questions sur l&#39;utilisation de notre application ? Voici les r\xE9ponses aux interrogations les plus fr\xE9quentes.</p></div><div class="space-y-4"><!--[-->`);
      ssrRenderList(faqs, (item, index) => {
        _push(`<div class="${ssrRenderClass([{ "border-primary/30 shadow-xl shadow-primary/5": unref(activeFaq) === index }, "group rounded-[32px] bg-white border border-slate-100 transition-all duration-500 overflow-hidden"])}"><button class="w-full p-6 md:p-8 flex items-center justify-between text-left"><h3 class="text-lg font-black text-slate-900 flex items-center gap-4"><span class="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">${ssrInterpolate(index + 1)}</span> ${ssrInterpolate(item.question)}</h3>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: ["size-5 text-slate-400 transition-transform duration-500", { "rotate-180 text-primary": unref(activeFaq) === index }]
        }, null, _parent));
        _push(`</button><div class="${ssrRenderClass([unref(activeFaq) === index ? "grid-rows-[1fr] opacity-100 pb-8 px-8 md:px-12 ml-4" : "grid-rows-[0fr] opacity-0 pb-0", "grid transition-all duration-500 ease-in-out"])}"><div class="overflow-hidden"><p class="text-slate-600 leading-relaxed font-medium pl-12 border-l-2 border-primary/20">${ssrInterpolate(item.answer)}</p></div></div></div>`);
      });
      _push(`<!--]--></div></div></div></section></div>`);
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
//# sourceMappingURL=contact-qW-p1gbr.mjs.map
