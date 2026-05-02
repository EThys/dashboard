import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { ArrowLeft, Receipt, RefreshCw, CheckCircle, Clock, XCircle, Loader2, Download } from 'lucide-vue-next';
import { u as useHead, l as useAuthStore } from './server.mjs';
import { u as usePaymentStore } from './payment-BKkNHW3M.mjs';
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
  __name: "paiements",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Historique des paiements"
    });
    const auth = useAuthStore();
    usePaymentStore();
    const payments = ref([]);
    const pending = ref(true);
    const downloadingId = ref(null);
    const totals = computed(() => {
      let usd = 0;
      let cdf = 0;
      let pendingCount = 0;
      for (const p of payments.value) {
        const st = (p.status || "").toUpperCase();
        if (st === "SUCCESS") {
          const amt = Number(p.amount) || 0;
          if (p.devise === "USD") usd += amt;
          if (p.devise === "CDF") cdf += amt;
        } else if (st === "PENDING") pendingCount++;
      }
      return { usd, cdf, pendingCount };
    });
    function statusMeta(status) {
      const s = (status || "").toUpperCase();
      if (s === "SUCCESS")
        return { label: "R\xE9ussi", class: "text-emerald-700 bg-emerald-50 border-emerald-200" };
      if (s === "PENDING")
        return { label: "En cours", class: "text-[#1565C0] bg-[#E3F2FD] border-[#BBDEFB]" };
      return { label: "\xC9chou\xE9", class: "text-red-800 bg-red-50 border-red-200" };
    }
    function formatDate(iso) {
      if (!iso) return "\u2014";
      try {
        return new Date(iso).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return iso;
      }
    }
    function amountLabel(p) {
      var _a;
      const sym = p.devise === "CDF" ? "FC" : p.devise === "USD" ? "$" : p.devise || "";
      return `${(_a = p.amount) != null ? _a : "\u2014"} ${sym}`.trim();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#F5F6FA] text-slate-900" }, _attrs))}><header class="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md"><div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6"><div class="flex items-center gap-3">`);
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
      _push(`<div class="flex items-center gap-2"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3F2FD] text-[#1976D2]">`);
      _push(ssrRenderComponent(unref(Receipt), { class: "size-5" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-bold uppercase tracking-wider text-[#1976D2]">Transactions</p><h1 class="text-lg font-bold sm:text-xl">Paiements &amp; re\xE7us</h1></div></div></div><div class="flex flex-wrap gap-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/compte/abonnement",
        class: "rounded-full border border-[#1976D2]/30 bg-[#E3F2FD] px-4 py-2 text-xs font-bold text-[#1565C0] transition hover:bg-[#BBDEFB]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Abonnement `);
          } else {
            return [
              createTextVNode(" Abonnement ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-[#1976D2]/30"${ssrIncludeBooleanAttr(unref(pending)) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(unref(RefreshCw), {
        class: ["size-3.5", { "animate-spin": unref(pending) }]
      }, null, _parent));
      _push(` Actualiser </button></div></div></header><main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10"><div class="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1976D2] to-[#1565C0] p-6 text-white shadow-lg sm:p-8"><div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-xs font-bold uppercase tracking-wider text-blue-100">Total pay\xE9 (succ\xE8s)</p><div class="mt-1 flex flex-wrap items-baseline gap-2"><span class="text-4xl font-black sm:text-5xl">${ssrInterpolate(unref(totals).usd.toFixed(0))}</span><span class="text-xl font-bold text-blue-100">USD</span>`);
      if (unref(totals).cdf > 0) {
        _push(`<span class="text-lg font-semibold text-blue-100"> \xB7 ${ssrInterpolate(Math.round(unref(totals).cdf).toLocaleString("fr-FR"))} FC </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-2xl border border-white/25 bg-black/10 px-4 py-3 backdrop-blur-sm"><p class="text-[10px] font-bold uppercase text-blue-200">Compte</p><p class="text-sm font-bold">${ssrInterpolate(((_a = unref(auth).user) == null ? void 0 : _a.premium) ? "Premium actif" : "Standard")}</p>`);
      if (unref(totals).pendingCount > 0) {
        _push(`<p class="mt-1 text-xs text-amber-200">${ssrInterpolate(unref(totals).pendingCount)} en attente </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><p class="mt-6 max-w-2xl text-sm text-blue-50/95"> T\xE9l\xE9chargez le <strong>re\xE7u PDF</strong> pour chaque paiement r\xE9ussi \u2014 m\xEAme structure que sur l\u2019application mobile (en-t\xEAte bleu CasaNayo, d\xE9tails, tableau, pied de page). </p></div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-20"><div class="size-12 rounded-full border-2 border-[#1976D2] border-t-transparent animate-spin"></div></div>`);
      } else if (!unref(payments).length) {
        _push(`<div class="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">`);
        _push(ssrRenderComponent(unref(Receipt), { class: "mx-auto mb-4 size-14 text-slate-300" }, null, _parent));
        _push(`<p class="text-lg font-bold text-slate-800">Aucun paiement</p><p class="mx-auto mt-2 max-w-sm text-sm text-slate-500"> Apr\xE8s souscription, vos transactions et re\xE7us appara\xEEtront ici. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/compte/abonnement",
          class: "mt-8 inline-flex h-11 items-center rounded-xl bg-[#1976D2] px-6 text-sm font-bold text-white shadow-md hover:bg-[#1565C0]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Souscrire \u2014 5 $ / an `);
            } else {
              return [
                createTextVNode(" Souscrire \u2014 5 $ / an ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md md:block"><table class="w-full text-left text-sm"><thead><tr class="border-b border-slate-100 bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500"><th class="px-5 py-3.5">Transaction</th><th class="px-5 py-3.5">R\xE9f.</th><th class="px-5 py-3.5">Date</th><th class="px-5 py-3.5 text-right">Montant</th><th class="px-5 py-3.5 text-right">Statut</th><th class="px-5 py-3.5 text-right">Re\xE7u</th></tr></thead><tbody class="divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(unref(payments), (p) => {
          var _a2, _b, _c;
          _push(`<tr class="hover:bg-slate-50/80"><td class="px-5 py-4"><p class="font-semibold text-slate-900">${ssrInterpolate(p.description || "Abonnement CasaNayo")}</p>`);
          if (p.typePayment) {
            _push(`<p class="text-xs text-slate-500">${ssrInterpolate(p.typePayment)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-5 py-4 font-mono text-xs text-slate-500">${ssrInterpolate((_a2 = p.reference) != null ? _a2 : p.id)}</td><td class="px-5 py-4 text-slate-600">${ssrInterpolate(formatDate(p.dateCreated))}</td><td class="px-5 py-4 text-right font-bold text-slate-900">${ssrInterpolate(amountLabel(p))}</td><td class="px-5 py-4 text-right"><span class="${ssrRenderClass([statusMeta(p.status).class, "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase"])}">`);
          if ((p.status || "").toUpperCase() === "SUCCESS") {
            _push(ssrRenderComponent(unref(CheckCircle), { class: "size-3" }, null, _parent));
          } else if ((p.status || "").toUpperCase() === "PENDING") {
            _push(ssrRenderComponent(unref(Clock), { class: "size-3" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(XCircle), { class: "size-3" }, null, _parent));
          }
          _push(` ${ssrInterpolate(statusMeta(p.status).label)}</span></td><td class="px-5 py-4 text-right"><button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-[#1976D2]/40 bg-[#E3F2FD] px-3 py-1.5 text-xs font-bold text-[#1565C0] transition hover:bg-[#BBDEFB] disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr((p.status || "").toUpperCase() !== "SUCCESS" || unref(downloadingId) === ((_b = p.id) != null ? _b : p.reference)) ? " disabled" : ""}>`);
          if (unref(downloadingId) === ((_c = p.id) != null ? _c : p.reference)) {
            _push(ssrRenderComponent(unref(Loader2), { class: "size-3.5 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Download), { class: "size-3.5" }, null, _parent));
          }
          _push(` PDF </button></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      }
      if (unref(payments).length && !unref(pending)) {
        _push(`<ul class="space-y-3 md:hidden"><!--[-->`);
        ssrRenderList(unref(payments), (p) => {
          var _a2, _b, _c;
          _push(`<li class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><p class="font-bold text-slate-900">${ssrInterpolate(p.description || "Abonnement")}</p><p class="mt-0.5 font-mono text-[10px] text-slate-500">${ssrInterpolate((_a2 = p.reference) != null ? _a2 : p.id)}</p></div><span class="${ssrRenderClass([statusMeta(p.status).class, "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase"])}">${ssrInterpolate(statusMeta(p.status).label)}</span></div><p class="mt-3 text-xs text-slate-500">${ssrInterpolate(formatDate(p.dateCreated))}</p><p class="mt-1 text-lg font-black text-[#1976D2]">${ssrInterpolate(amountLabel(p))}</p><button type="button" class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1976D2]/40 bg-[#E3F2FD] py-2.5 text-sm font-bold text-[#1565C0] disabled:opacity-40"${ssrIncludeBooleanAttr((p.status || "").toUpperCase() !== "SUCCESS" || unref(downloadingId) === ((_b = p.id) != null ? _b : p.reference)) ? " disabled" : ""}>`);
          if (unref(downloadingId) === ((_c = p.id) != null ? _c : p.reference)) {
            _push(ssrRenderComponent(unref(Loader2), { class: "size-4 animate-spin" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Download), { class: "size-4" }, null, _parent));
          }
          _push(` T\xE9l\xE9charger le re\xE7u PDF </button></li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/paiements.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=paiements-B7NxiwJW.mjs.map
