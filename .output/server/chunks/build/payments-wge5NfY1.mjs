import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { FileText, RefreshCw, TrendingUp, DollarSign, Check, Loader2, Receipt, Eye, X } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Input-CIBjNfXj.mjs';
import { _ as _sfc_main$7 } from './Badge-CZaU8sYj.mjs';
import { _ as _sfc_main$5, a as _sfc_main$4, b as _sfc_main$2$1, c as _sfc_main$1$1, d as _sfc_main$3, e as _sfc_main$6 } from './TableCell-aM2uE8ea.mjs';
import { l as useAuthStore, c as useRuntimeConfig } from './server.mjs';
import { u as useDashboardStore } from './dashboard-BK2yFE1H.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { jsPDF } from 'jspdf';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
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
const itemsPerPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "payments",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const dashboard = useDashboardStore();
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase;
    const pending = computed(() => dashboard.isLoading);
    const errorMsg = ref(null);
    const flatRows = computed(() => dashboard.flatPayments);
    const devises = computed(() => dashboard.devises);
    const searchQuery = ref("");
    const statusFilter = ref("all");
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
    const statusOptions = computed(() => {
      const s = /* @__PURE__ */ new Set();
      for (const r of flatRows.value) {
        if (r.payment.status) s.add(String(r.payment.status));
      }
      return Array.from(s).sort();
    });
    const filteredRows = computed(() => {
      let list = flatRows.value;
      if (statusFilter.value !== "all") {
        list = list.filter((r) => String(r.payment.status) === statusFilter.value);
      }
      const q = searchQuery.value.trim().toLowerCase();
      if (q) {
        list = list.filter((r) => {
          var _a;
          const u = r.user;
          const p = r.payment;
          return (u.username || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || "").toLowerCase().includes(q) || String(p.reference || "").toLowerCase().includes(q) || String((_a = p.id) != null ? _a : "").includes(q);
        });
      }
      return list;
    });
    const currentPage = ref(1);
    const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage));
    const paginatedRows = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredRows.value.slice(start, end);
    });
    watch(filteredRows, () => {
      currentPage.value = 1;
    });
    function statusBadgeVariant(st) {
      const v = (st || "").toUpperCase();
      if (v === "PENDING" || v === "PROCESSING") return "default";
      if (v === "SUCCESS" || v === "COMPLETED" || v === "PAID") return "success";
      if (v === "CANCELLED" || v === "FAILED") return "destructive";
      return "secondary";
    }
    const successTotals = computed(() => {
      const totals = {};
      for (const r of filteredRows.value) {
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 p-4 md:p-8" }, _attrs))}><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h1 class="text-2xl font-black tracking-tight md:text-3xl">Paiements (tous les utilisateurs)</h1><p class="mt-1 text-sm text-muted-foreground"> Donn\xE9es issues de l\u2019API prot\xE9g\xE9e \u2014 r\xE9f\xE9rences, statuts et utilisateurs associ\xE9s. </p></div><div class="flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        size: "sm",
        disabled: pending.value,
        class: "shrink-0 gap-2",
        onClick: () => unref(downloadPaymentReportPdf)(filteredRows.value)
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
      _push(ssrRenderComponent(unref(_sfc_main$1), {
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
      _push(`</div></div><div class="grid gap-4 lg:grid-cols-2"><div class="rounded-2xl border border-border bg-card p-6 shadow-sm"><div class="mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(TrendingUp), { class: "h-5 w-5 text-primary" }, null, _parent));
      _push(`<h2 class="text-lg font-bold">Taux de r\xE9f\xE9rence</h2></div><p class="mb-4 text-sm text-muted-foreground"> Le champ <span class="font-medium">taux</span> sert de base aux conversions c\xF4t\xE9 application. </p>`);
      if (!devises.value.length && !pending.value) {
        _push(`<div class="text-sm text-muted-foreground"> Aucune devise charg\xE9e. </div>`);
      } else {
        _push(`<div class="space-y-3">`);
        if (devises.value.length > 0) {
          _push(`<div class="flex flex-col items-center justify-center rounded-xl bg-primary/10 p-6 text-center shadow-inner"><p class="text-xs font-semibold uppercase text-muted-foreground mb-2">Conversion courante de la plateforme</p><span class="text-2xl font-black text-primary"> 1 USD = ${ssrInterpolate(((_a = devises.value.find((d) => d.code === "CDF")) == null ? void 0 : _a.taux) || ((_b = devises.value.find((d) => d.code === "CDF")) == null ? void 0 : _b.tauxLocal) || 2200)} FC </span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div><div class="rounded-2xl border border-border bg-card p-6 shadow-sm"><div class="mb-4 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(DollarSign), { class: "h-5 w-5 text-emerald-500" }, null, _parent));
      _push(`<h2 class="text-lg font-bold">Volume Total Encaiss\xE9 (Succ\xE8s)</h2></div>`);
      if (Object.keys(successTotals.value).length > 0) {
        _push(`<div class="grid gap-4 sm:grid-cols-2"><!--[-->`);
        ssrRenderList(successTotals.value, (val, cur) => {
          _push(`<div class="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20"><div><p class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total ${ssrInterpolate(cur)}</p><p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${ssrInterpolate(val.toLocaleString("fr-CD"))} <span class="text-sm font-bold">${ssrInterpolate(cur)}</span></p></div><div class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">`);
          _push(ssrRenderComponent(unref(Check), { class: "h-5 w-5" }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-sm text-muted-foreground py-4"> Aucun paiement r\xE9ussi pour l&#39;instant avec les filtres actuels. </div>`);
      }
      _push(`</div></div><div class="rounded-2xl border border-border bg-card p-6 shadow-sm"><div class="grid gap-4 md:grid-cols-12 md:items-end"><div class="md:col-span-6"><label class="mb-1 block text-xs font-semibold text-muted-foreground">Recherche</label>`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        placeholder: "Utilisateur, email, t\xE9l\xE9phone, r\xE9f\xE9rence\u2026",
        class: "h-11"
      }, null, _parent));
      _push(`</div><div class="md:col-span-4"><label class="mb-1 block text-xs font-semibold text-muted-foreground">Statut</label><select class="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}>Tous les statuts</option><!--[-->`);
      ssrRenderList(statusOptions.value, (st) => {
        _push(`<option${ssrRenderAttr("value", st)}${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, st) : ssrLooseEqual(statusFilter.value, st)) ? " selected" : ""}>${ssrInterpolate(st)}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-2 text-right text-sm text-muted-foreground md:pt-6">${ssrInterpolate(filteredRows.value.length)} ligne(s) </div></div></div><div class="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">`);
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
        _push(ssrRenderComponent(unref(_sfc_main$5), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$2$1), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`ID`);
                              } else {
                                return [
                                  createTextVNode("ID")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Date`);
                              } else {
                                return [
                                  createTextVNode("Date")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Utilisateur`);
                              } else {
                                return [
                                  createTextVNode("Utilisateur")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Montant`);
                              } else {
                                return [
                                  createTextVNode("Montant")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Statut`);
                              } else {
                                return [
                                  createTextVNode("Statut")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), { class: "hidden lg:table-cell" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`R\xE9f\xE9rence`);
                              } else {
                                return [
                                  createTextVNode("R\xE9f\xE9rence")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$1$1), { class: "w-[100px] text-right" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`D\xE9tail`);
                              } else {
                                return [
                                  createTextVNode("D\xE9tail")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                              default: withCtx(() => [
                                createTextVNode("ID")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), null, {
                              default: withCtx(() => [
                                createTextVNode("Date")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), null, {
                              default: withCtx(() => [
                                createTextVNode("Utilisateur")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), null, {
                              default: withCtx(() => [
                                createTextVNode("Montant")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), null, {
                              default: withCtx(() => [
                                createTextVNode("Statut")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), { class: "hidden lg:table-cell" }, {
                              default: withCtx(() => [
                                createTextVNode("R\xE9f\xE9rence")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), { class: "w-[100px] text-right" }, {
                              default: withCtx(() => [
                                createTextVNode("D\xE9tail")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$2$1), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                            default: withCtx(() => [
                              createTextVNode("ID")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Date")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Utilisateur")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Montant")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), null, {
                            default: withCtx(() => [
                              createTextVNode("Statut")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), { class: "hidden lg:table-cell" }, {
                            default: withCtx(() => [
                              createTextVNode("R\xE9f\xE9rence")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), { class: "w-[100px] text-right" }, {
                            default: withCtx(() => [
                              createTextVNode("D\xE9tail")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(paginatedRows.value, (row) => {
                      _push3(ssrRenderComponent(unref(_sfc_main$2$1), {
                        key: `${row.payment.userId}-${row.payment.id}`,
                        class: "hover:bg-muted/40"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "font-mono text-xs" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(row.payment.id)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(row.payment.id), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "whitespace-nowrap text-sm" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(row.payment.dateCreated || "\u2014")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(row.payment.dateCreated || "\u2014"), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="font-semibold"${_scopeId4}>${ssrInterpolate(row.user.username || "\u2014")}</div><div class="text-xs text-muted-foreground"${_scopeId4}>${ssrInterpolate(row.user.email || row.user.phone || "")}</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "font-semibold" }, toDisplayString(row.user.username || "\u2014"), 1),
                                    createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(row.user.email || row.user.phone || ""), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "font-medium" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(formatAmount(row.payment.amount, row.payment.devise))}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(formatAmount(row.payment.amount, row.payment.devise)), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$7), {
                                    variant: statusBadgeVariant(row.payment.status)
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(row.payment.status || "\u2014")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(row.payment.status || "\u2014"), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$7), {
                                      variant: statusBadgeVariant(row.payment.status)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(row.payment.status || "\u2014"), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["variant"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "hidden max-w-[200px] truncate font-mono text-xs lg:table-cell" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(row.payment.reference)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(row.payment.reference), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(_sfc_main$6), { class: "text-right" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                    size: "sm",
                                    variant: "ghost",
                                    class: "gap-1",
                                    onClick: ($event) => selected.value = row
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Eye), { class: "h-4 w-4" }, null, _parent6, _scopeId5));
                                        _push6(` Voir `);
                                      } else {
                                        return [
                                          createVNode(unref(Eye), { class: "h-4 w-4" }),
                                          createTextVNode(" Voir ")
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$1), {
                                      size: "sm",
                                      variant: "ghost",
                                      class: "gap-1",
                                      onClick: ($event) => selected.value = row
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(Eye), { class: "h-4 w-4" }),
                                        createTextVNode(" Voir ")
                                      ]),
                                      _: 1
                                    }, 8, ["onClick"])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$6), { class: "font-mono text-xs" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(row.payment.id), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "whitespace-nowrap text-sm" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(row.payment.dateCreated || "\u2014"), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "font-semibold" }, toDisplayString(row.user.username || "\u2014"), 1),
                                  createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(row.user.email || row.user.phone || ""), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "font-medium" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(formatAmount(row.payment.amount, row.payment.devise)), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$7), {
                                    variant: statusBadgeVariant(row.payment.status)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(row.payment.status || "\u2014"), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant"])
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "hidden max-w-[200px] truncate font-mono text-xs lg:table-cell" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(row.payment.reference), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$6), { class: "text-right" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$1), {
                                    size: "sm",
                                    variant: "ghost",
                                    class: "gap-1",
                                    onClick: ($event) => selected.value = row
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Eye), { class: "h-4 w-4" }),
                                      createTextVNode(" Voir ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ]),
                                _: 2
                              }, 1024)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(paginatedRows.value, (row) => {
                        return openBlock(), createBlock(unref(_sfc_main$2$1), {
                          key: `${row.payment.userId}-${row.payment.id}`,
                          class: "hover:bg-muted/40"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$6), { class: "font-mono text-xs" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(row.payment.id), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "whitespace-nowrap text-sm" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(row.payment.dateCreated || "\u2014"), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "font-semibold" }, toDisplayString(row.user.username || "\u2014"), 1),
                                createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(row.user.email || row.user.phone || ""), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "font-medium" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(formatAmount(row.payment.amount, row.payment.devise)), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$7), {
                                  variant: statusBadgeVariant(row.payment.status)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(row.payment.status || "\u2014"), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["variant"])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "hidden max-w-[200px] truncate font-mono text-xs lg:table-cell" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(row.payment.reference), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$6), { class: "text-right" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$1), {
                                  size: "sm",
                                  variant: "ghost",
                                  class: "gap-1",
                                  onClick: ($event) => selected.value = row
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Eye), { class: "h-4 w-4" }),
                                    createTextVNode(" Voir ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$2$1), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$1$1), { class: "w-[100px]" }, {
                          default: withCtx(() => [
                            createTextVNode("ID")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Date")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Utilisateur")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Montant")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), null, {
                          default: withCtx(() => [
                            createTextVNode("Statut")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), { class: "hidden lg:table-cell" }, {
                          default: withCtx(() => [
                            createTextVNode("R\xE9f\xE9rence")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$1), { class: "w-[100px] text-right" }, {
                          default: withCtx(() => [
                            createTextVNode("D\xE9tail")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$3), null, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(paginatedRows.value, (row) => {
                      return openBlock(), createBlock(unref(_sfc_main$2$1), {
                        key: `${row.payment.userId}-${row.payment.id}`,
                        class: "hover:bg-muted/40"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), { class: "font-mono text-xs" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(row.payment.id), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), { class: "whitespace-nowrap text-sm" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(row.payment.dateCreated || "\u2014"), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "font-semibold" }, toDisplayString(row.user.username || "\u2014"), 1),
                              createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(row.user.email || row.user.phone || ""), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), { class: "font-medium" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatAmount(row.payment.amount, row.payment.devise)), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$7), {
                                variant: statusBadgeVariant(row.payment.status)
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(row.payment.status || "\u2014"), 1)
                                ]),
                                _: 2
                              }, 1032, ["variant"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), { class: "hidden max-w-[200px] truncate font-mono text-xs lg:table-cell" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(row.payment.reference), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$6), { class: "text-right" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$1), {
                                size: "sm",
                                variant: "ghost",
                                class: "gap-1",
                                onClick: ($event) => selected.value = row
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Eye), { class: "h-4 w-4" }),
                                  createTextVNode(" Voir ")
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
      if (totalPages.value > 1) {
        _push(`<div class="flex items-center justify-between gap-4"><div class="text-sm text-muted-foreground"> Page ${ssrInterpolate(currentPage.value)} sur ${ssrInterpolate(totalPages.value)}</div><div class="flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          disabled: currentPage.value === 1,
          onClick: ($event) => currentPage.value--
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Pr\xE9c\xE9dent `);
            } else {
              return [
                createTextVNode(" Pr\xE9c\xE9dent ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          disabled: currentPage.value === totalPages.value,
          onClick: ($event) => currentPage.value++
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
            } else {
              return [
                createTextVNode(" Suivant ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (selected.value) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 sm:items-center"><div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"><div class="mb-4 flex items-start justify-between gap-4"><h3 class="text-lg font-bold">D\xE9tail du paiement</h3><button type="button" class="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Fermer">`);
          _push2(ssrRenderComponent(unref(X), { class: "h-5 w-5" }, null, _parent));
          _push2(`</button></div><div class="space-y-4 text-sm"><div class="rounded-xl bg-muted/50 p-4"><div class="text-xs font-semibold uppercase text-muted-foreground">Utilisateur</div><div class="mt-2 space-y-1"><div><span class="text-muted-foreground">ID :</span> ${ssrInterpolate(selected.value.user.userId)}</div><div><span class="text-muted-foreground">Pseudo :</span> ${ssrInterpolate(selected.value.user.username || "\u2014")}</div><div><span class="text-muted-foreground">Email :</span> ${ssrInterpolate(selected.value.user.email || "\u2014")}</div><div><span class="text-muted-foreground">T\xE9l\xE9phone :</span> ${ssrInterpolate(selected.value.user.phone || "\u2014")}</div><div><span class="text-muted-foreground">Ville / pays :</span> ${ssrInterpolate(selected.value.user.city || "\u2014")} \xB7 ${ssrInterpolate(selected.value.user.country || "\u2014")}</div><div class="flex flex-wrap gap-2 pt-2">`);
          if (selected.value.user.certified) {
            _push2(ssrRenderComponent(unref(_sfc_main$7), { variant: "default" }, {
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
            _push2(ssrRenderComponent(unref(_sfc_main$7), { variant: "secondary" }, {
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
          _push2(ssrRenderComponent(unref(_sfc_main$7), {
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
          _push2(ssrRenderComponent(unref(_sfc_main$1), {
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
//# sourceMappingURL=payments-wge5NfY1.mjs.map
