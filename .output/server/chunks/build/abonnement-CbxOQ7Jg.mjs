import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { CheckCircle2, Loader2, FileText, Infinity, Shield, Smartphone, CreditCard } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { u as useHead, l as useAuthStore, c as useRuntimeConfig } from './server.mjs';
import { u as usePaymentStore } from './payment-ypX8e7MU.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const SUBSCRIPTION_USD = 5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "abonnement",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Abonnement Premium"
    });
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const payment = usePaymentStore();
    const latestPayment = ref(null);
    const isDownloading = ref(false);
    const selectedMethod = ref("mobile");
    const selectedCurrency = ref("USD");
    const phoneLocal = ref("");
    ref("");
    ref("");
    ref("");
    const paymentStep = ref(0);
    const isProcessing = ref(false);
    ref(null);
    const detectedNetwork = computed(() => {
      let text = phoneLocal.value.replace(/\D/g, "");
      if (text.startsWith("0") && text.length > 1) text = text.slice(1);
      if (text.length < 2) return "Inconnu";
      const p2 = text.slice(0, 2);
      if (["81", "82", "83", "86"].includes(p2)) return "Vodacom";
      if (["84", "85", "89", "80"].includes(p2)) return "Orange";
      if (["97", "98", "99", "96"].includes(p2)) return "Airtel";
      if (["90", "91"].includes(p2)) return "Africell";
      return "Inconnu";
    });
    const isPhoneValid = computed(() => {
      const digits = phoneLocal.value.replace(/\D/g, "");
      return digits.length === 9 && detectedNetwork.value !== "Inconnu";
    });
    const fee = computed(() => selectedCurrency.value === "USD" ? 0.13 : 275);
    const subtotalConverted = computed(
      () => payment.convert(SUBSCRIPTION_USD, "USD", selectedCurrency.value)
    );
    const totalConverted = computed(() => subtotalConverted.value + fee.value);
    function formatMoney(val, code) {
      if (code === "CDF") {
        const n = Math.round(val);
        return `${n.toLocaleString("fr-FR")} FC`;
      }
      return `$${val.toFixed(2)}`;
    }
    const formattedSubtotal = computed(() => formatMoney(subtotalConverted.value, selectedCurrency.value));
    const formattedFee = computed(() => formatMoney(fee.value, selectedCurrency.value));
    const formattedTotal = computed(() => formatMoney(totalConverted.value, selectedCurrency.value));
    watch(phoneLocal, (v) => {
      let d = v.replace(/\D/g, "");
      if (d.startsWith("0") && d.length > 1) {
        d = d.slice(1);
        if (d !== phoneLocal.value.replace(/\D/g, "")) phoneLocal.value = d;
      }
    });
    async function processPayment() {
      var _a, _b, _c, _d, _e, _f;
      if (isProcessing.value) return;
      if (selectedMethod.value === "mobile" && !isPhoneValid.value) {
        toast.error("Num\xE9ro invalide");
        return;
      }
      isProcessing.value = true;
      paymentStep.value = 1;
      try {
        const deviseId = payment.resolveDeviseId(selectedCurrency.value);
        if (selectedMethod.value === "mobile") {
          const finalPhone = `243${phoneLocal.value.replace(/\D/g, "")}`;
          const res = await payment.subscribe(config.public.apiBase, finalPhone, deviseId);
          if (res.success) {
            paymentStep.value = 2;
            toast.info("Validation requise", { description: "Validez le message push sur votre t\xE9l\xE9phone." });
          } else {
            toast.error("Erreur", { description: res.message });
            paymentStep.value = 0;
            isProcessing.value = false;
          }
        } else {
          const res = await payment.payWithCard(config.public.apiBase, deviseId);
          if (res.success && (((_a = res.data) == null ? void 0 : _a.url) || ((_c = (_b = res.data) == null ? void 0 : _b.data) == null ? void 0 : _c.url))) {
            (void 0).location.href = ((_d = res.data) == null ? void 0 : _d.url) || ((_f = (_e = res.data) == null ? void 0 : _e.data) == null ? void 0 : _f.url);
          } else {
            toast.error("Erreur technique");
            paymentStep.value = 0;
            isProcessing.value = false;
          }
        }
      } catch (e) {
        toast.error("Erreur de connexion");
        paymentStep.value = 0;
        isProcessing.value = false;
      }
    }
    const perks = [
      { icon: Infinity, text: "R\xE9servations et annonces illimit\xE9es pendant 12 mois" },
      { icon: Shield, text: "Acc\xE8s complet apr\xE8s profil certifi\xE9 et abonnement actif" },
      { icon: FileText, text: "Re\xE7u PDF t\xE9l\xE9chargeable depuis l\u2019historique des paiements" }
    ];
    const networkClass = computed(() => {
      if (detectedNetwork.value === "Vodacom") return "bg-red-50 text-red-600";
      if (detectedNetwork.value === "Orange") return "bg-orange-50 text-orange-600";
      if (detectedNetwork.value === "Airtel") return "bg-rose-50 text-rose-700";
      if (detectedNetwork.value === "Africell") return "bg-violet-50 text-violet-700";
      return "bg-slate-100 text-slate-500";
    });
    const isPremium = computed(() => {
      var _a;
      return !!((_a = auth.user) == null ? void 0 : _a.premium);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-slate-900" }, _attrs))}><div><div class="mb-8 flex flex-wrap items-center justify-between gap-3"><div><p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1976D2]">CasaNayo</p><h1 class="text-2xl font-black text-slate-900">Abonnement Premium</h1></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/compte/paiements",
        class: "rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#1976D2] shadow-sm transition hover:bg-[#E3F2FD]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Historique et re\xE7us `);
          } else {
            return [
              createTextVNode(" Historique et re\xE7us ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid items-stretch gap-6 lg:grid-cols-2"><section class="flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#42A5F5] text-white shadow-xl"><div class="p-7 sm:p-8"><p class="text-sm font-medium text-blue-100">${ssrInterpolate(isPremium.value ? "Abonnement en cours" : "Offre annuelle")}</p><p class="mt-3 text-4xl font-black tracking-tight">5 $ <span class="text-lg font-semibold text-blue-100">/ an</span></p><p class="mt-3 text-sm leading-relaxed text-blue-50"> Publiez, r\xE9servez et g\xE9rez vos biens pendant un an. Le montant s\u2019affiche dans la devise choisie. </p><div class="mt-6 inline-flex rounded-2xl bg-white/15 p-1"><button type="button" class="${ssrRenderClass([selectedCurrency.value === "USD" ? "bg-white text-[#1565C0]" : "text-white/80", "rounded-xl px-4 py-2 text-sm font-bold transition"])}"> USD </button><button type="button" class="${ssrRenderClass([selectedCurrency.value === "CDF" ? "bg-white text-[#1565C0]" : "text-white/80", "rounded-xl px-4 py-2 text-sm font-bold transition"])}"> FC </button></div>`);
      if (isPremium.value && !latestPayment.value) {
        _push(`<div class="mt-6 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold"> Vous \xEAtes d\xE9j\xE0 Premium. Vous pouvez renouveler ou consulter vos re\xE7us. </div>`);
      } else if (latestPayment.value) {
        _push(`<div class="mt-6 rounded-2xl bg-white/15 px-4 py-4"><div class="flex items-center gap-3">`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "size-7" }, null, _parent));
        _push(`<div><p class="font-black">Paiement valid\xE9</p><p class="text-sm text-blue-50">Transaction #${ssrInterpolate((_a = latestPayment.value.reference) != null ? _a : latestPayment.value.id)}</p></div></div><button type="button" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#1565C0] disabled:opacity-50"${ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""}>`);
        if (isDownloading.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(FileText), { class: "size-4" }, null, _parent));
        }
        _push(` T\xE9l\xE9charger le re\xE7u </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="mt-auto flex-1 space-y-3 bg-white px-6 py-6 text-slate-700 sm:px-8"><!--[-->`);
      ssrRenderList(perks, (item, i) => {
        _push(`<li class="flex items-start gap-3"><span class="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "size-4" }, null), _parent);
        _push(`</span><span class="text-sm font-medium leading-snug">${ssrInterpolate(item.text)}</span></li>`);
      });
      _push(`<!--]--></ul></section><section class="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"><div class="border-b border-slate-100 px-6 py-5 sm:px-8"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Paiement</p><h2 class="text-lg font-black text-slate-900">${ssrInterpolate(isPremium.value ? "Renouveler" : "Activer Premium")}</h2></div><div class="flex flex-1 flex-col p-6 sm:p-8">`);
      if (isProcessing.value) {
        _push(`<div class="py-10 text-center">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "mx-auto size-11 animate-spin text-[#1976D2]" }, null, _parent));
        _push(`<p class="mt-4 font-black text-slate-900">${ssrInterpolate(paymentStep.value === 1 ? "Connexion au paiement\u2026" : paymentStep.value === 2 ? "En attente de votre validation" : "Activation du compte")}</p><ol class="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm"><li class="${ssrRenderClass(paymentStep.value >= 1 ? "font-bold text-[#1976D2]" : "text-slate-400")}">1. Envoi de la demande</li><li class="${ssrRenderClass(paymentStep.value >= 2 ? "font-bold text-[#1976D2]" : "text-slate-400")}">2. Validation sur le t\xE9l\xE9phone</li><li class="${ssrRenderClass(paymentStep.value >= 3 ? "font-bold text-[#1976D2]" : "text-slate-400")}">3. Premium activ\xE9</li></ol></div>`);
      } else {
        _push(`<div class="flex flex-1 flex-col gap-6"><div class="grid gap-3 sm:grid-cols-2"><button type="button" class="${ssrRenderClass([selectedMethod.value === "mobile" ? "border-[#1976D2] bg-[#E3F2FD]" : "border-slate-200 hover:border-slate-300", "rounded-2xl border-2 p-4 text-left transition"])}">`);
        _push(ssrRenderComponent(unref(Smartphone), { class: "size-5 text-[#1976D2]" }, null, _parent));
        _push(`<p class="mt-3 font-black text-slate-900">Mobile Money</p><p class="mt-1 text-xs text-slate-500">Vodacom, Orange, Airtel, Africell</p></button><button type="button" class="${ssrRenderClass([selectedMethod.value === "card" ? "border-[#1976D2] bg-[#E3F2FD]" : "border-slate-200 hover:border-slate-300", "rounded-2xl border-2 p-4 text-left transition"])}">`);
        _push(ssrRenderComponent(unref(CreditCard), { class: "size-5 text-[#1976D2]" }, null, _parent));
        _push(`<p class="mt-3 font-black text-slate-900">Carte bancaire</p><p class="mt-1 text-xs text-slate-500">Page s\xE9curis\xE9e du partenaire</p></button></div>`);
        if (selectedMethod.value === "mobile") {
          _push(`<div class="space-y-2"><div class="flex items-center justify-between">`);
          _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-xs font-bold uppercase text-slate-500" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Num\xE9ro Mobile Money`);
              } else {
                return [
                  createTextVNode("Num\xE9ro Mobile Money")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="${ssrRenderClass([networkClass.value, "rounded-full px-2.5 py-1 text-[10px] font-black uppercase"])}">${ssrInterpolate(detectedNetwork.value)}</span></div><div class="${ssrRenderClass([isPhoneValid.value ? "border-[#1976D2]" : "border-slate-200", "flex overflow-hidden rounded-2xl border-2 bg-white transition-colors"])}"><span class="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold">+243</span>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            modelValue: phoneLocal.value,
            "onUpdate:modelValue": ($event) => phoneLocal.value = $event,
            type: "tel",
            inputmode: "numeric",
            class: "border-0 text-lg font-semibold focus-visible:ring-0",
            placeholder: "812 345 678"
          }, null, _parent));
          _push(`</div><p class="text-xs text-slate-500">9 chiffres, sans le 0. Un message de confirmation s\u2019affiche sur le t\xE9l\xE9phone.</p></div>`);
        } else {
          _push(`<div class="rounded-2xl border border-blue-100 bg-blue-50/60 p-5"><div class="flex items-start gap-3">`);
          _push(ssrRenderComponent(unref(Shield), { class: "mt-0.5 size-5 shrink-0 text-[#1976D2]" }, null, _parent));
          _push(`<p class="text-sm leading-relaxed text-slate-600"> Le num\xE9ro de carte se saisit sur la page du partenaire, apr\xE8s le bouton Payer. CasaNayo ne conserve pas ces donn\xE9es. </p></div></div>`);
        }
        _push(`<div class="mt-auto rounded-2xl bg-slate-50 px-4 py-4 text-sm"><div class="flex justify-between text-slate-500"><span>Abonnement</span><span>${ssrInterpolate(formattedSubtotal.value)}</span></div><div class="mt-2 flex justify-between text-slate-500"><span>Frais</span><span>${ssrInterpolate(formattedFee.value)}</span></div><div class="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900"><span>Total</span><span class="text-[#1976D2]">${ssrInterpolate(formattedTotal.value)}</span></div></div></div>`);
      }
      _push(`</div></section></div><div class="sticky bottom-0 z-20 mt-6 rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md sm:px-6"><div class="flex items-center justify-between gap-4"><div><p class="text-[10px] font-bold uppercase text-slate-400">\xC0 payer</p><p class="text-2xl font-black text-[#1976D2]">${ssrInterpolate(formattedTotal.value)}</p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        class: "h-12 min-w-[180px] rounded-2xl bg-[#1976D2] text-base font-bold hover:bg-[#1565C0]",
        disabled: isProcessing.value || selectedMethod.value === "mobile" && !isPhoneValid.value || unref(payment).isLoadingDevises,
        onClick: processPayment
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (isProcessing.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(isPremium.value ? "Renouveler" : "Payer")} ${ssrInterpolate(formattedTotal.value)}`);
          } else {
            return [
              isProcessing.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 size-4 animate-spin"
              })) : createCommentVNode("", true),
              createTextVNode(" " + toDisplayString(isPremium.value ? "Renouveler" : "Payer") + " " + toDisplayString(formattedTotal.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/abonnement.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=abonnement-CbxOQ7Jg.mjs.map
