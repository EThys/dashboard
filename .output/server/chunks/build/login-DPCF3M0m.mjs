import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, computed, watch, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, isRef, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'vue/server-renderer';
import { l as useAuthStore, m as useRoute, o as _imports_0 } from './server.mjs';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1 } from './Input-CIBjNfXj.mjs';
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
import 'vue-router';
import '@tanstack/vue-query';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRoute();
    const identifier = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const isLoading = ref(false);
    const showPremiumModal = ref(false);
    const selectedCallingCode = ref("+243");
    const countryCodes = [
      { code: "+243", flag: "\u{1F1E8}\u{1F1E9}", name: "RDC" },
      { code: "+242", flag: "\u{1F1E8}\u{1F1EC}", name: "Congo-Brazzaville" },
      { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", name: "France" },
      { code: "+32", flag: "\u{1F1E7}\u{1F1EA}", name: "Belgique" },
      { code: "+221", flag: "\u{1F1F8}\u{1F1F3}", name: "S\xE9n\xE9gal" },
      { code: "+225", flag: "\u{1F1E8}\u{1F1EE}", name: "C\xF4te d'Ivoire" },
      { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "USA/Canada" },
      { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "UK" }
    ];
    const isPhoneMode = computed(() => {
      return /^\d/.test(identifier.value);
    });
    watch(identifier, (newVal) => {
      if (isPhoneMode.value && newVal.startsWith("0")) {
        identifier.value = newVal.substring(1);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Label = resolveComponent("Label");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden bg-background" }, _attrs))}><div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative z-10 border-r-4 border-primary/20"><div class="mx-auto grid w-[350px] gap-6"><div class="grid gap-2 text-center"><div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-full w-full object-contain"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-full w-full object-contain"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><h1 class="text-3xl font-bold tracking-tight text-foreground">Bon retour !</h1><p class="text-muted-foreground text-sm">Entrez vos coordonn\xE9es pour acc\xE9der \xE0 votre espace</p></div><form class="grid gap-4"><div class="grid gap-2">`);
      _push(ssrRenderComponent(_component_Label, {
        for: "identifier",
        class: "sr-only"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Email ou T\xE9l\xE9phone`);
          } else {
            return [
              createTextVNode("Email ou T\xE9l\xE9phone")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative flex gap-2">`);
      if (unref(isPhoneMode)) {
        _push(`<div class="relative min-w-[80px]"><select class="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-xl text-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"><!--[-->`);
        ssrRenderList(countryCodes, (c) => {
          _push(`<option${ssrRenderAttr("value", c.code)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedCallingCode)) ? ssrLooseContain(unref(selectedCallingCode), c.code) : ssrLooseEqual(unref(selectedCallingCode), c.code)) ? " selected" : ""}>${ssrInterpolate(c.flag)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative flex-1">`);
      if (unref(isPhoneMode)) {
        _push(`<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><span class="text-sm text-muted-foreground">${ssrInterpolate(unref(selectedCallingCode))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        id: "identifier",
        type: "text",
        placeholder: unref(isPhoneMode) ? "81..." : "votre@email.com",
        modelValue: unref(identifier),
        "onUpdate:modelValue": ($event) => isRef(identifier) ? identifier.value = $event : null,
        required: "",
        class: `h-11 shadow-sm w-full transition-all ${unref(isPhoneMode) ? "pl-12" : "pl-3"}`
      }, null, _parent));
      _push(`</div></div></div><div class="grid gap-2"><div class="flex items-center">`);
      _push(ssrRenderComponent(_component_Label, {
        for: "password",
        class: "sr-only"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Mot de passe`);
          } else {
            return [
              createTextVNode("Mot de passe")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative w-full">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        id: "password",
        type: unref(showPassword) ? "text" : "password",
        placeholder: "Mot de passe",
        modelValue: unref(password),
        "onUpdate:modelValue": ($event) => isRef(password) ? password.value = $event : null,
        required: "",
        class: "h-11 shadow-sm pr-10"
      }, null, _parent));
      _push(`<button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">`);
      if (!unref(showPassword)) {
        _push(ssrRenderComponent(unref(Eye), { class: "h-5 w-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOff), { class: "h-5 w-5" }, null, _parent));
      }
      _push(`</button></div></div><a href="#" class="ml-auto inline-block text-xs font-medium text-primary hover:underline"> Mot de passe oubli\xE9 ? </a></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        type: "submit",
        class: "w-full h-11 text-base shadow-soft-blue",
        disabled: unref(isLoading)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(isLoading)) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(isLoading) ? "Connexion en cours..." : "Se connecter")}`);
          } else {
            return [
              unref(isLoading) ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(unref(isLoading) ? "Connexion en cours..." : "Se connecter"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-4 text-center text-sm"> Pas encore de compte ? <a href="/register" class="font-bold text-primary hover:underline">Cr\xE9er un compte</a></div><div class="text-center text-xs text-muted-foreground mt-4"> En continuant, vous acceptez nos <a href="/terms" class="underline hover:text-primary">Conditions d&#39;utilisation</a>. </div></div></div><div class="hidden bg-muted lg:block relative overflow-hidden"><div class="absolute inset-0 bg-primary/90 mix-blend-multiply z-10"></div><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&amp;w=2653&amp;auto=format&amp;fit=crop" alt="Modern Architecture" class="absolute inset-0 h-full w-full object-cover grayscale opacity-60"><div class="relative z-20 flex h-full flex-col justify-between p-12 text-white">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-bold text-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-8 w-8 object-contain"${_scopeId}> CasaNayo `);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-8 w-8 object-contain"
              }),
              createTextVNode(" CasaNayo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="space-y-4 max-w-lg"><blockquote class="text-2xl font-medium leading-snug"> \u201CCasaNayo centralise l\u2019ensemble du parcours immobilier dans une seule application : recherche de biens, vente, location et services \xE0 domicile.\u201D </blockquote><div class="flex items-center gap-4"><div class="font-semibold text-sm">L&#39;\xE9quipe CasaNayo</div></div></div></div></div>`);
      if (unref(showPremiumModal)) {
        _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"><div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"><div class="p-10 text-center"><div class="relative size-24 mx-auto mb-8"><div class="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div><div class="relative size-full rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-2xl shadow-primary/40">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "size-12 text-white" }, null, _parent));
        _push(`</div></div><h3 class="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic">Acc\xE8s R\xE9serv\xE9</h3><p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-8 px-4"> Pour effectuer une r\xE9servation, vous devez \xEAtre connect\xE9 \xE0 votre compte CasaNayo. <span class="block mt-2 text-primary">Un abonnement annuel de <span class="text-2xl font-black italic">$4</span> est requis pour acc\xE9der aux services exclusifs.</span></p><div class="grid grid-cols-1 gap-3">`);
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          onClick: ($event) => showPremiumModal.value = false,
          class: "h-14 rounded-2xl font-black text-base uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` J&#39;ai compris `);
            } else {
              return [
                createTextVNode(" J'ai compris ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DPCF3M0m.mjs.map
