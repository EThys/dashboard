import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, resolveDynamicComponent, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderVNode, ssrRenderClass } from 'vue/server-renderer';
import { ArrowLeft, CheckCircle2, Loader2, FileText, Infinity, Shield, Smartphone, CreditCard } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$1 } from './Label-DssVEliA.mjs';
import { u as useHead, l as useAuthStore, c as useRuntimeConfig } from './server.mjs';
import { u as usePaymentStore } from './payment-BKkNHW3M.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import '../nitro/nitro.mjs';
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
      { icon: Shield, text: "Acc\xE8s complet apr\xE8s profil certifi\xE9 + abonnement actif" },
      { icon: FileText, text: "Re\xE7u PDF t\xE9l\xE9chargeable depuis l\u2019historique des paiements" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#F5F6FA] text-slate-900" }, _attrs))}><header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"><div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#1976D2]/40 hover:text-[#1976D2]",
        "aria-label": "Retour"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "size-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "size-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1976D2]">CasaNayo</p><h1 class="text-lg font-bold text-slate-900 sm:text-xl">Abonnement Premium</h1></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/compte/paiements",
        class: "rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-[#1976D2] shadow-sm transition hover:border-[#1976D2]/50 hover:bg-[#E3F2FD]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Historique &amp; re\xE7us `);
          } else {
            return [
              createTextVNode(" Historique & re\xE7us ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><main class="mx-auto max-w-5xl px-4 py-8 pb-40 sm:px-6 sm:py-12"><div class="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] via-[#1E88E5] to-[#1565C0] p-8 text-white shadow-xl sm:p-10"><p class="text-sm font-medium text-blue-100">Offre annuelle</p><p class="mt-2 text-3xl font-black tracking-tight sm:text-4xl"> 5 $ US <span class="text-xl font-bold text-blue-100">/ an</span></p><p class="mt-4 max-w-xl text-sm leading-relaxed text-blue-50/95"> Publiez vos biens, vos services et r\xE9servez sans limite. Paiement Mobile Money r\xE9el ; carte bancaire en d\xE9monstration (comme sur l\u2019app). </p>`);
      if (((_a = unref(auth).user) == null ? void 0 : _a.premium) && !latestPayment.value) {
        _push(`<div class="mt-6 inline-flex rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm"> Vous \xEAtes d\xE9j\xE0 Premium \u2014 consultez vos re\xE7us dans l\u2019historique. </div>`);
      } else if (latestPayment.value) {
        _push(`<div class="mt-6 inline-flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/15 px-6 py-5 backdrop-blur-sm shadow-xl"><div class="flex items-center gap-3">`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "text-white size-8" }, null, _parent));
        _push(`<div><p class="font-black text-lg">Paiement valid\xE9 !</p><p class="text-sm text-blue-50/90">Transaction #${ssrInterpolate((_b = latestPayment.value.reference) != null ? _b : latestPayment.value.id)}</p></div></div><button${ssrIncludeBooleanAttr(isDownloading.value) ? " disabled" : ""} class="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#1976D2] font-bold py-2.5 px-6 shadow-md transition hover:bg-blue-50 disabled:opacity-50">`);
        if (isDownloading.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(FileText), { class: "size-4" }, null, _parent));
        }
        _push(` T\xE9l\xE9charger ma facture pro </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="grid gap-10 lg:grid-cols-5 lg:gap-12"><div class="space-y-4 lg:col-span-2"><h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">Inclus</h2><ul class="space-y-3"><!--[-->`);
      ssrRenderList(perks, (item, i) => {
        _push(`<li class="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), { class: "size-5" }, null), _parent);
        _push(`</div><p class="text-sm font-medium leading-snug text-slate-700">${ssrInterpolate(item.text)}</p></li>`);
      });
      _push(`<!--]--></ul></div><div class="lg:col-span-3"><div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"><div class="border-b border-slate-100 bg-slate-50/80 px-6 py-4 sm:px-8"><p class="text-xs font-bold uppercase tracking-wider text-slate-500">Paiement</p><p class="font-bold text-slate-900">Choisir le mode</p></div><div class="p-6 sm:p-8"><div class="mb-8 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5"><button type="button" class="${ssrRenderClass([
        selectedMethod.value === "mobile" ? "bg-white text-[#1976D2] shadow-md" : "text-slate-500 hover:text-slate-800",
        "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all"
      ])}">`);
      _push(ssrRenderComponent(unref(Smartphone), { class: "size-4" }, null, _parent));
      _push(` Mobile Money </button><button type="button" class="${ssrRenderClass([
        selectedMethod.value === "card" ? "bg-white text-[#1976D2] shadow-md" : "text-slate-500 hover:text-slate-800",
        "flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all"
      ])}">`);
      _push(ssrRenderComponent(unref(CreditCard), { class: "size-4" }, null, _parent));
      _push(` Carte </button></div>`);
      if (isProcessing.value) {
        _push(`<div class="flex flex-col items-center gap-4 py-12">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "size-11 animate-spin text-[#1976D2]" }, null, _parent));
        _push(`<p class="text-center font-bold text-slate-900">${ssrInterpolate(paymentStep.value === 1 ? "Connexion s\xE9curis\xE9e\u2026" : paymentStep.value === 2 ? "Validation op\xE9rateur\u2026" : "Confirmation")}</p><p class="text-center text-sm text-slate-500"> Validez sur votre t\xE9l\xE9phone si une demande s\u2019affiche. </p></div>`);
      } else {
        _push(`<div class="space-y-6">`);
        if (selectedMethod.value === "mobile") {
          _push(`<div class="space-y-2"><div class="flex justify-between">`);
          _push(ssrRenderComponent(unref(_sfc_main$1), { class: "text-xs font-bold uppercase text-slate-500" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Num\xE9ro`);
              } else {
                return [
                  createTextVNode("Num\xE9ro")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<span class="text-[10px] font-bold text-[#1976D2]">${ssrInterpolate(detectedNetwork.value)}</span></div><div class="${ssrRenderClass([isPhoneValid.value ? "border-[#1976D2]" : "border-slate-200", "flex overflow-hidden rounded-2xl border-2 bg-white transition-colors"])}"><span class="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold"> \u{1F1E8}\u{1F1E9} +243 </span>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            modelValue: phoneLocal.value,
            "onUpdate:modelValue": ($event) => phoneLocal.value = $event,
            type: "tel",
            class: "border-0 text-lg font-semibold focus-visible:ring-0",
            placeholder: "*********"
          }, null, _parent));
          _push(`</div><p class="text-xs text-slate-500">9 chiffres sans le 0 initial.</p></div>`);
        } else {
          _push(`<div class="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white p-6 text-center shadow-sm"><div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100/50 shadow-inner">`);
          _push(ssrRenderComponent(unref(CreditCard), { class: "h-6 w-6 text-[#1976D2]" }, null, _parent));
          _push(`</div><h3 class="mb-2 text-sm font-extrabold text-slate-800 uppercase tracking-tight">Environnement s\xE9curis\xE9</h3><p class="mx-auto max-w-sm text-xs leading-relaxed text-slate-500"> Pour garantir la protection de vos donn\xE9es bancaires, le paiement s&#39;effectue directement sur la plateforme de notre partenaire financier certifi\xE9. <br><br><b>Vous y acc\xE8derez \xE0 l&#39;\xE9tape suivante.</b></p></div>`);
        }
        _push(`</div>`);
      }
      _push(`</div></div></div></div></main><div class="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(25,118,210,0.08)] backdrop-blur-md sm:px-6"><div class="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div class="flex flex-wrap items-end gap-6"><div><p class="text-[10px] font-bold uppercase text-slate-500">Total</p><p class="text-2xl font-black text-[#1976D2]">${ssrInterpolate(formattedTotal.value)}</p></div><div class="flex gap-6 text-xs text-slate-600"><div><span class="block text-[10px] font-bold uppercase text-slate-400">Sous-total</span> ${ssrInterpolate(formattedSubtotal.value)}</div><div><span class="block text-[10px] font-bold uppercase text-slate-400">Frais</span> ${ssrInterpolate(formattedFee.value)}</div></div><div class="flex rounded-xl border border-slate-200 bg-slate-50 p-1"><button type="button" class="${ssrRenderClass([selectedCurrency.value === "USD" ? "bg-[#1976D2] text-white" : "text-slate-500", "rounded-lg px-3 py-1.5 text-xs font-bold transition"])}"> USD </button><button type="button" class="${ssrRenderClass([selectedCurrency.value === "CDF" ? "bg-[#1976D2] text-white" : "text-slate-500", "rounded-lg px-3 py-1.5 text-xs font-bold transition"])}"> CDF </button></div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        class: "h-12 w-full shrink-0 rounded-2xl bg-[#1976D2] text-base font-bold hover:bg-[#1565C0] sm:w-auto sm:min-w-[200px]",
        disabled: isProcessing.value || (selectedMethod.value === "mobile" ? !isPhoneValid.value : false) || unref(payment).isLoadingDevises,
        onClick: processPayment
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Payer ${ssrInterpolate(formattedTotal.value)}`);
          } else {
            return [
              createTextVNode(" Payer " + toDisplayString(formattedTotal.value), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/abonnement.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=abonnement-DBgt9auZ.mjs.map
