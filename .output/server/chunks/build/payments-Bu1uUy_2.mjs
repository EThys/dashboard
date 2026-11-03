import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { FileText, RefreshCw, TrendingUp, DollarSign, Check, Loader2, Receipt, X } from 'lucide-vue-next';
import { _ as _sfc_main$2 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$3 } from './Badge-CZaU8sYj.mjs';
import { p as process } from './array.operators-CqYfjdq6.mjs';
import { u as useDashboardStore } from './dashboard-BK2yFE1H.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { jsPDF } from 'jspdf';
import { c as useRuntimeConfig } from './server.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
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
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "KendoGrid",
  __ssrInlineRender: true,
  props: {
    dataItems: {},
    columns: {},
    total: {},
    skip: {},
    take: {},
    sort: {},
    filter: {},
    pageable: {},
    sortable: { type: Boolean },
    filterable: { type: Boolean },
    resizable: { type: Boolean },
    reorderable: { type: Boolean }
  },
  emits: ["datastatechange", "rowclick"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    ref(null);
    const mountError = ref("");
    function sync() {
      return;
    }
    watch(
      () => [props.dataItems, props.columns, props.total, props.skip, props.take, props.sort, props.filter, props.pageable],
      () => sync()
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="kendo-host"></div>`);
      if (mountError.value) {
        _push(`<p class="mt-2 text-sm text-destructive">${ssrInterpolate(mountError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/KendoGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const BRAND_BLUE = [25, 118, 210];
async function loadImageDataUrl(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
async function downloadPaymentReportPdf(rows) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 40;
  let y = M;
  const dateStr = (/* @__PURE__ */ new Date()).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.setFillColor(...BRAND_BLUE);
  doc.roundedRect(M, y, W - 2 * M, 76, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("RAPPORT DES PAIEMENTS", M + 20, y + 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(230, 240, 255);
  doc.text("Liste compl\xE8te des transactions globales CasaNayo", M + 20, y + 52);
  doc.text(`G\xE9n\xE9r\xE9 le : ${dateStr}`, W - M - 20, y + 52, { align: "right" });
  const origin = "https://casanayo.com";
  const logoData = await loadImageDataUrl(`${origin}/logoCasa.png`);
  if (logoData) {
    try {
      doc.addImage(logoData, "PNG", W - M - 52, y + 12, 40, 40);
    } catch {
    }
  }
  y += 96;
  const drawTableHeader = (yy) => {
    doc.setFillColor(245, 245, 245);
    doc.rect(M, yy, W - 2 * M, 25, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text("ID", M + 10, yy + 16);
    doc.text("Utilisateur", M + 60, yy + 16);
    doc.text("Montant", M + 180, yy + 16);
    doc.text("R\xE9f\xE9rence", M + 280, yy + 16);
    doc.text("Date", M + 400, yy + 16);
    doc.text("Statut", W - M - 10, yy + 16, { align: "right" });
  };
  drawTableHeader(y);
  y += 25;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  for (const row of rows) {
    if (y > H - 100) {
      doc.addPage();
      y = M;
      drawTableHeader(y);
      y += 25;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
    }
    const p = row.payment;
    const u = row.user;
    const amount = `${p.amount} ${p.devise || ""}`;
    const user = u.username || u.email || String(u.userId);
    const ref2 = p.reference ? p.reference.length > 20 ? p.reference.slice(0, 18) + "..." : p.reference : "-";
    const date = p.dateCreated ? p.dateCreated.split("T")[0] : "-";
    const status = (p.status || "-").toUpperCase();
    doc.text(String(p.id), M + 10, y + 15);
    doc.text(user.length > 25 ? user.slice(0, 23) + "..." : user, M + 60, y + 15);
    doc.text(amount, M + 180, y + 15);
    doc.text(ref2, M + 280, y + 15);
    doc.text(date, M + 400, y + 15);
    if (status === "SUCCESS" || status === "COMPLETED" || status === "PAID") {
      doc.setTextColor(16, 185, 129);
    } else if (status === "CANCELLED" || status === "FAILED") {
      doc.setTextColor(239, 68, 68);
    } else {
      doc.setTextColor(100, 100, 100);
    }
    doc.text(status, W - M - 10, y + 15, { align: "right" });
    doc.setTextColor(0, 0, 0);
    y += 20;
    doc.setDrawColor(230, 230, 230);
    doc.line(M, y, W - M, y);
  }
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(1);
    doc.line(M, H - 60, W - M, H - 60);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("CasaNayo Support : +243 836 323 805", M, H - 46);
    doc.text("Email : contact@casanayo.com", M, H - 34);
    doc.text("Adresse : 14 Avenue Pumbu, Gombe, Kinshasa - RDC", W - M, H - 46, { align: "right" });
    doc.text("\xA9 CasaNayo - Rapport Interne", W - M, H - 34, { align: "right" });
    doc.text(`Page ${i} sur ${pageCount}`, W / 2, H - 20, { align: "center" });
  }
  const filename = `Rapport_Paiements_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "payments",
  __ssrInlineRender: true,
  setup(__props) {
    const dashboard = useDashboardStore();
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;
    const pending = computed(() => dashboard.isLoading);
    const errorMsg = ref(null);
    const flatRows = computed(() => dashboard.flatPayments);
    const devises = computed(() => dashboard.devises);
    const dataState = ref({
      skip: 0,
      take: 10,
      sort: [{ field: "id", dir: "desc" }]
    });
    const selected = ref(null);
    const load = async (force = false) => {
      var _a;
      errorMsg.value = null;
      try {
        await dashboard.fetchStats(apiBase, force);
      } catch (e) {
        console.error(e);
        errorMsg.value = ((_a = e == null ? void 0 : e.data) == null ? void 0 : _a.message) || (e == null ? void 0 : e.message) || "Impossible de charger les paiements";
        toast.error("Erreur lors du chargement des paiements");
      }
    };
    const gridSource = computed(
      () => (Array.isArray(flatRows.value) ? flatRows.value : []).flatMap((row) => {
        var _a;
        if (!(row == null ? void 0 : row.payment)) return [];
        const user = row.user || {};
        const amount = typeof row.payment.amount === "string" ? parseFloat(row.payment.amount) : Number(row.payment.amount);
        return [{
          user,
          payment: row.payment,
          id: Number((_a = row.payment.id) != null ? _a : 0),
          dateCreated: row.payment.dateCreated || "\u2014",
          username: user.username || "\u2014",
          contact: user.email || user.phone || "",
          amount: Number.isNaN(amount) ? 0 : amount,
          devise: row.payment.devise || "",
          status: row.payment.status || "\u2014",
          reference: row.payment.reference || ""
        }];
      })
    );
    const gridData = computed(() => process(gridSource.value, dataState.value));
    const filteredItems = computed(
      () => process(gridSource.value, { filter: dataState.value.filter, sort: dataState.value.sort }).data
    );
    function onDataStateChange(event) {
      dataState.value = event.data;
    }
    const amountCell = (h, _defaultRendering, cellProps) => {
      const item = cellProps.dataItem;
      return h("td", { class: cellProps.className }, formatAmount(item.payment.amount, item.payment.devise));
    };
    const detailCell = (h, _defaultRendering, cellProps) => {
      return h("td", { class: cellProps.className }, [
        h("button", {
          class: "k-button",
          attrs: { type: "button" },
          on: {
            click: (clickEvent) => {
              clickEvent.stopPropagation();
              selected.value = cellProps.dataItem;
            }
          }
        }, "Voir")
      ]);
    };
    const columns = [
      { field: "id", title: "ID", width: "90px", filter: "numeric" },
      { field: "dateCreated", title: "Date", width: "180px" },
      { field: "username", title: "Utilisateur" },
      { field: "contact", title: "Contact" },
      { field: "amount", title: "Montant", width: "140px", filter: "numeric", cell: amountCell },
      { field: "status", title: "Statut", width: "140px" },
      { field: "reference", title: "R\xE9f\xE9rence" },
      { title: "D\xE9tail", width: "110px", filterable: false, sortable: false, cell: detailCell }
    ];
    function statusBadgeVariant(st) {
      const v = (st || "").toUpperCase();
      if (v === "PENDING" || v === "PROCESSING") return "default";
      if (v === "SUCCESS" || v === "COMPLETED" || v === "PAID") return "success";
      if (v === "CANCELLED" || v === "FAILED") return "destructive";
      return "secondary";
    }
    const successTotals = computed(() => {
      const totals = {};
      for (const r of filteredItems.value) {
        const p = r.payment;
        const st = (p.status || "").toUpperCase();
        if (st === "SUCCESS" || st === "COMPLETED" || st === "PAID") {
          const cur = p.devise || "USD";
          const val = typeof p.amount === "string" ? parseFloat(p.amount) : Number(p.amount);
          if (!Number.isNaN(val)) {
            totals[cur] = (totals[cur] || 0) + val;
          }
        }
      }
      return totals;
    });
    function formatAmount(amount, code) {
      const n = typeof amount === "string" ? parseFloat(amount) : Number(amount);
      if (Number.isNaN(n)) return "\u2014";
      const cur = code || "";
      if (cur === "CDF") return `${n.toLocaleString("fr-CD")} CDF`;
      return `${n.toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${cur}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_KendoGrid = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 p-4 md:p-8" }, _attrs))}><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 class="text-2xl font-black tracking-tight md:text-3xl">Paiements (tous les utilisateurs)</h1><p class="mt-1 text-sm text-muted-foreground"> Donn\xE9es issues de l\u2019API prot\xE9g\xE9e \u2014 r\xE9f\xE9rences, statuts et utilisateurs associ\xE9s. </p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        size: "sm",
        disabled: pending.value,
        class: "shrink-0 gap-2",
        onClick: () => unref(downloadPaymentReportPdf)(filteredItems.value)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(FileText), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            _push2(` T\xE9l\xE9charger PDF `);
          } else {
            return [
              createVNode(unref(FileText), { class: "h-4 w-4" }),
              createTextVNode(" T\xE9l\xE9charger PDF ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        variant: "outline",
        size: "sm",
        disabled: pending.value,
        class: "shrink-0 gap-2",
        onClick: () => load(true)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCw), {
              class: ["h-4 w-4", { "animate-spin": pending.value }]
            }, null, _parent2, _scopeId));
            _push2(` Actualiser `);
          } else {
            return [
              createVNode(unref(RefreshCw), {
                class: ["h-4 w-4", { "animate-spin": pending.value }]
              }, null, 8, ["class"]),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid items-start gap-3 sm:grid-cols-2"><div class="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><div class="flex items-center justify-between gap-3"><div class="flex min-w-0 items-center gap-2">`);
      _push(ssrRenderComponent(unref(TrendingUp), { class: "h-4 w-4 shrink-0 text-primary" }, null, _parent));
      _push(`<h2 class="truncate text-sm font-bold">Taux de r\xE9f\xE9rence</h2></div><p class="shrink-0 text-base font-black text-primary"> 1 USD = ${ssrInterpolate(((_a = devises.value.find((d) => d.code === "CDF")) == null ? void 0 : _a.taux) || ((_b = devises.value.find((d) => d.code === "CDF")) == null ? void 0 : _b.tauxLocal) || 2200)} FC </p></div>`);
      if (!devises.value.length && !pending.value) {
        _push(`<p class="mt-1 text-xs text-muted-foreground"> Aucune devise charg\xE9e. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="rounded-xl border border-border bg-card px-4 py-3 shadow-sm"><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(DollarSign), { class: "h-4 w-4 shrink-0 text-emerald-500" }, null, _parent));
      _push(`<h2 class="text-sm font-bold">Volume encaiss\xE9</h2></div>`);
      if (Object.keys(successTotals.value).length > 0) {
        _push(`<div class="mt-2 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(successTotals.value, (val, cur) => {
          _push(`<div class="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-1.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">`);
          _push(ssrRenderComponent(unref(Check), { class: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" }, null, _parent));
          _push(`<span class="text-sm font-black text-emerald-600 dark:text-emerald-400">${ssrInterpolate(val.toLocaleString("fr-CD"))} ${ssrInterpolate(cur)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="mt-1 text-xs text-muted-foreground"> Aucun paiement r\xE9ussi avec les filtres actuels. </p>`);
      }
      _push(`</div></div>`);
      if (pending.value) {
        _push(`<div class="flex items-center justify-center gap-2 py-20 text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-6 w-6 animate-spin" }, null, _parent));
        _push(` Chargement\u2026 </div>`);
      } else if (errorMsg.value) {
        _push(`<div class="p-8 text-center text-sm text-destructive">${ssrInterpolate(errorMsg.value)}</div>`);
      } else if (!flatRows.value.length) {
        _push(`<div class="flex flex-col items-center gap-2 py-16 text-muted-foreground">`);
        _push(ssrRenderComponent(unref(Receipt), { class: "h-10 w-10 opacity-40" }, null, _parent));
        _push(` Aucun paiement \xE0 afficher. </div>`);
      } else {
        _push(ssrRenderComponent(_component_KendoGrid, {
          "data-items": gridData.value.data,
          total: gridData.value.total,
          skip: dataState.value.skip,
          take: dataState.value.take,
          sort: dataState.value.sort,
          filter: dataState.value.filter,
          columns,
          pageable: { buttonCount: 5, pageSizes: [10, 20, 50], info: true },
          sortable: true,
          filterable: true,
          resizable: true,
          reorderable: true,
          onDatastatechange: onDataStateChange
        }, null, _parent));
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (selected.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center"><div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"><div class="mb-4 flex items-start justify-between gap-4"><h3 class="text-lg font-bold">D\xE9tail du paiement</h3><button type="button" class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Fermer">`);
          _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
          _push2(`</button></div><div class="space-y-4 text-sm"><div class="rounded-xl bg-muted/50 p-4"><div class="text-xs font-semibold uppercase text-muted-foreground">Utilisateur</div><div class="mt-2 space-y-1"><div><span class="text-muted-foreground">ID :</span> ${ssrInterpolate(selected.value.user.userId)}</div><div><span class="text-muted-foreground">Pseudo :</span> ${ssrInterpolate(selected.value.user.username || "\u2014")}</div><div><span class="text-muted-foreground">Email :</span> ${ssrInterpolate(selected.value.user.email || "\u2014")}</div><div><span class="text-muted-foreground">T\xE9l\xE9phone :</span> ${ssrInterpolate(selected.value.user.phone || "\u2014")}</div><div><span class="text-muted-foreground">Ville / pays :</span> ${ssrInterpolate(selected.value.user.city || "\u2014")} \xB7 ${ssrInterpolate(selected.value.user.country || "\u2014")}</div><div class="flex flex-wrap gap-2 pt-2">`);
          if (selected.value.user.certified) {
            _push2(ssrRenderComponent(unref(_sfc_main$3), { variant: "default" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Certifi\xE9`);
                } else {
                  return [
                    createTextVNode("Certifi\xE9")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (selected.value.user.premium) {
            _push2(ssrRenderComponent(unref(_sfc_main$3), { variant: "secondary" }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`Premium`);
                } else {
                  return [
                    createTextVNode("Premium")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div><div class="rounded-xl border border-border p-4"><div class="text-xs font-semibold uppercase text-muted-foreground">Transaction</div><dl class="mt-3 space-y-2"><div class="flex justify-between gap-4"><dt class="text-muted-foreground">ID paiement</dt><dd class="font-mono">${ssrInterpolate(selected.value.payment.id)}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">R\xE9f\xE9rence</dt><dd class="break-all text-right font-mono text-xs">${ssrInterpolate(selected.value.payment.reference)}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Montant</dt><dd>${ssrInterpolate(formatAmount(selected.value.payment.amount, selected.value.payment.devise))}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Type</dt><dd>${ssrInterpolate(selected.value.payment.typePayment || "\u2014")}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Statut</dt><dd>`);
          _push2(ssrRenderComponent(unref(_sfc_main$3), {
            variant: statusBadgeVariant(selected.value.payment.status)
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`${ssrInterpolate(selected.value.payment.status)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(selected.value.payment.status), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Description</dt><dd class="text-right">${ssrInterpolate(selected.value.payment.description || "\u2014")}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Cr\xE9\xE9</dt><dd>${ssrInterpolate(selected.value.payment.dateCreated || "\u2014")}</dd></div><div class="flex justify-between gap-4"><dt class="text-muted-foreground">Mis \xE0 jour</dt><dd>${ssrInterpolate(selected.value.payment.dateUpdated || "\u2014")}</dd></div></dl></div></div>`);
          _push2(ssrRenderComponent(unref(_sfc_main$2), {
            class: "mt-6 w-full",
            variant: "outline",
            onClick: ($event) => selected.value = null
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`Fermer`);
              } else {
                return [
                  createTextVNode("Fermer")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/payments.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=payments-Bu1uUy_2.mjs.map
