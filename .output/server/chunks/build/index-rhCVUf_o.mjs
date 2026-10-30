import { defineComponent, computed, resolveComponent, mergeProps, unref, withCtx, openBlock, createBlock, createTextVNode, toDisplayString, createVNode, resolveDynamicComponent, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderAttr } from 'vue/server-renderer';
import { a as useRouter, l as useAuthStore, c as useRuntimeConfig } from './server.mjs';
import { Users, Building2, Wrench, Package, Loader2, Clock, ArrowUpRight, Activity, UserPlus, ArrowRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$3 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$2 } from './CardTitle-CY-VC8BI.mjs';
import { _ as _sfc_main$5 } from './Badge-CZaU8sYj.mjs';
import { _ as _sfc_main$4 } from './Skeleton-BgOY-K4r.mjs';
import { u as useDashboardStore } from './dashboard-BK2yFE1H.mjs';
import { Bar } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    const router = useRouter();
    useAuthStore();
    const config = useRuntimeConfig();
    const dashboard = useDashboardStore();
    const statsData = computed(() => ({
      users: dashboard.users,
      properties: dashboard.properties,
      services: dashboard.services,
      isLoading: dashboard.isLoading,
      payments: dashboard.payments,
      flatPayments: dashboard.flatPayments,
      devises: dashboard.devises
    }));
    const fetchDashboardStats = async () => {
      const apiBase = config.public.apiBase;
      await dashboard.fetchStats(apiBase, true);
    };
    const recentUsers = computed(() => {
      return [...statsData.value.users].sort((a, b) => b.userId - a.userId).slice(0, 5);
    });
    const stats = computed(() => [
      {
        title: "Utilisateurs Totaux",
        value: statsData.value.users.length.toLocaleString(),
        icon: Users,
        description: `${statsData.value.users.filter((u) => u.certified).length} profils certifi\xE9s`,
        color: "text-blue-500",
        bg: "bg-blue-50"
      },
      {
        title: "Propri\xE9t\xE9s",
        value: statsData.value.properties.length.toLocaleString(),
        icon: Building2,
        description: "Annonces immobili\xE8res actives",
        color: "text-emerald-500",
        bg: "bg-emerald-50"
      },
      {
        title: "Prestations",
        value: statsData.value.services.length.toLocaleString(),
        icon: Wrench,
        description: "Services et m\xE9tiers propos\xE9s",
        color: "text-amber-500",
        bg: "bg-amber-50"
      },
      {
        title: "Total Publications",
        value: (statsData.value.properties.length + statsData.value.services.length).toLocaleString(),
        icon: Package,
        description: "Flux total de la plateforme",
        color: "text-purple-500",
        bg: "bg-purple-50"
      }
    ]);
    const revenueData = computed(() => {
      const totals = {};
      statsData.value.flatPayments.forEach((fp) => {
        const p = fp.payment;
        const status = (p.status || "").toUpperCase();
        if (status === "SUCCESS" || status === "COMPLETED" || status === "PAID") {
          const cur = p.devise || "USD";
          const val = typeof p.amount === "string" ? parseFloat(p.amount) : Number(p.amount);
          if (!Number.isNaN(val)) {
            totals[cur] = (totals[cur] || 0) + val;
          }
        }
      });
      return totals;
    });
    const chartData = computed(() => {
      var _a, _b;
      const devises = statsData.value.devises || [];
      const cdfRate = ((_a = devises.find((d) => d.code === "CDF")) == null ? void 0 : _a.taux) || ((_b = devises.find((d) => d.code === "CDF")) == null ? void 0 : _b.tauxLocal) || 2200;
      const dailyTotals = {};
      statsData.value.flatPayments.forEach((fp) => {
        const p = fp.payment;
        const status = (p.status || "").toUpperCase();
        if (status === "SUCCESS" || status === "COMPLETED" || status === "PAID") {
          const dateStr = p.dateCreated ? String(p.dateCreated).substring(0, 10) : "Inconnu";
          const cur = p.devise || "USD";
          const val = typeof p.amount === "string" ? parseFloat(p.amount) : Number(p.amount);
          if (!Number.isNaN(val)) {
            let amountInUsd = val;
            if (cur === "CDF") {
              amountInUsd = val / cdfRate;
            }
            dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + amountInUsd;
          }
        }
      });
      let dates = Object.keys(dailyTotals).sort();
      if (dates.length > 0 && dates[0] === "Inconnu") {
        const elem = dates.shift();
        dates.push(elem);
      }
      const recentDates = dates.slice(-14);
      if (recentDates.length === 0) return { data: [], max: 1 };
      let maxAmount = 0;
      const res = recentDates.map((date) => {
        maxAmount = Math.max(maxAmount, dailyTotals[date]);
        let label = date;
        if (date !== "Inconnu") {
          label = new Date(date).toLocaleDateString("fr-CD", { day: "numeric", month: "short" });
        }
        return {
          date,
          amount: dailyTotals[date],
          label
        };
      });
      return { data: res, max: maxAmount || 1 };
    });
    const chartDataObj = computed(() => {
      return {
        labels: chartData.value.data.map((d) => d.label),
        datasets: [{
          label: "Volume (USD)",
          data: chartData.value.data.map((d) => d.amount),
          backgroundColor: "#10b981",
          borderRadius: 6,
          hoverBackgroundColor: "#059669"
        }]
      };
    });
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.raw.toFixed(2)} USD`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, border: { display: false } },
        x: { grid: { display: false } }
      }
    };
    computed(() => {
      const entries = Object.entries(revenueData.value);
      if (entries.length === 0) return "0,00 $";
      return entries.map(([cur, val]) => {
        return val.toLocaleString("fr-CD", {
          style: "currency",
          currency: cur === "CDF" ? "CDF" : "USD"
        }).replace("CDF", "FC");
      }).join(" / ");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Check = resolveComponent("Check");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 pb-10" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h2 class="text-4xl font-black tracking-tight text-foreground flex items-center gap-3"> Tableau de bord </h2><p class="text-muted-foreground mt-1">Bienvenue dans notre centre de commande CasaNayo.</p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: fetchDashboardStats,
        variant: "outline",
        class: "shadow-sm gap-2 h-11 px-5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (statsData.value.isLoading) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Clock), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }
            _push2(` Actualiser les donn\xE9es `);
          } else {
            return [
              statsData.value.isLoading ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "h-4 w-4 animate-spin"
              })) : (openBlock(), createBlock(unref(Clock), {
                key: 1,
                class: "h-4 w-4"
              })),
              createTextVNode(" Actualiser les donn\xE9es ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 font-sans"><!--[-->`);
      ssrRenderList(stats.value, (stat, index) => {
        _push(ssrRenderComponent(unref(_sfc_main$1$1), {
          key: index,
          class: "relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass(["absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-10 group-hover:scale-110 transition-transform duration-500", stat.bg])}"${_scopeId}></div>`);
              _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "flex flex-row items-center justify-between space-y-0 pb-2 relative" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(stat.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(stat.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`<div class="${ssrRenderClass(["p-2 rounded-xl transition-colors duration-300", stat.bg, stat.color])}"${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(stat.icon), { class: "h-5 w-5" }, null), _parent3, _scopeId2);
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(unref(_sfc_main$2), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(stat.title), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("div", {
                        class: ["p-2 rounded-xl transition-colors duration-300", stat.bg, stat.color]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(stat.icon), { class: "h-5 w-5" }))
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "relative" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (statsData.value.isLoading) {
                      _push3(`<div${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "h-10 w-24 mb-2" }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-32" }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    } else {
                      _push3(`<!--[--><div class="text-3xl font-black text-foreground"${_scopeId2}>${ssrInterpolate(stat.value)}</div><p class="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic"${_scopeId2}>${ssrInterpolate(stat.description)}</p><!--]-->`);
                    }
                  } else {
                    return [
                      statsData.value.isLoading ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode(unref(_sfc_main$4), { class: "h-10 w-24 mb-2" }),
                        createVNode(unref(_sfc_main$4), { class: "h-4 w-32" })
                      ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createVNode("div", { class: "text-3xl font-black text-foreground" }, toDisplayString(stat.value), 1),
                        createVNode("p", { class: "text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic" }, toDisplayString(stat.description), 1)
                      ], 64))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", {
                  class: ["absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 opacity-10 group-hover:scale-110 transition-transform duration-500", stat.bg]
                }, null, 2),
                createVNode(unref(_sfc_main$1$2), { class: "flex flex-row items-center justify-between space-y-0 pb-2 relative" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$2), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(stat.title), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode("div", {
                      class: ["p-2 rounded-xl transition-colors duration-300", stat.bg, stat.color]
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(stat.icon), { class: "h-5 w-5" }))
                    ], 2)
                  ]),
                  _: 2
                }, 1024),
                createVNode(unref(_sfc_main$3), { class: "relative" }, {
                  default: withCtx(() => [
                    statsData.value.isLoading ? (openBlock(), createBlock("div", { key: 0 }, [
                      createVNode(unref(_sfc_main$4), { class: "h-10 w-24 mb-2" }),
                      createVNode(unref(_sfc_main$4), { class: "h-4 w-32" })
                    ])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createVNode("div", { class: "text-3xl font-black text-foreground" }, toDisplayString(stat.value), 1),
                      createVNode("p", { class: "text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic" }, toDisplayString(stat.description), 1)
                    ], 64))
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><p class="text-xs font-black uppercase tracking-widest text-muted-foreground"${_scopeId2}>Activit\xE9 du site</p><p class="mt-1 text-lg font-black"${_scopeId2}>Visites, devises et lieux</p><p class="mt-1 max-w-xl text-sm text-muted-foreground"${_scopeId2}> Demandes de visite par jour et par mois, r\xE9partition des annonces par devise, par ville et par type (vente ou location). </p></div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$1), {
                    class: "h-11 shrink-0 gap-2",
                    onClick: ($event) => unref(router).push("/dashboard/statistiques")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Voir les statistiques `);
                        _push4(ssrRenderComponent(unref(ArrowUpRight), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" Voir les statistiques "),
                          createVNode(unref(ArrowUpRight), { class: "h-4 w-4" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, "Activit\xE9 du site"),
                      createVNode("p", { class: "mt-1 text-lg font-black" }, "Visites, devises et lieux"),
                      createVNode("p", { class: "mt-1 max-w-xl text-sm text-muted-foreground" }, " Demandes de visite par jour et par mois, r\xE9partition des annonces par devise, par ville et par type (vente ou location). ")
                    ]),
                    createVNode(unref(_sfc_main$1), {
                      class: "h-11 shrink-0 gap-2",
                      onClick: ($event) => unref(router).push("/dashboard/statistiques")
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Voir les statistiques "),
                        createVNode(unref(ArrowUpRight), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$3), { class: "flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" }, {
                default: withCtx(() => [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, "Activit\xE9 du site"),
                    createVNode("p", { class: "mt-1 text-lg font-black" }, "Visites, devises et lieux"),
                    createVNode("p", { class: "mt-1 max-w-xl text-sm text-muted-foreground" }, " Demandes de visite par jour et par mois, r\xE9partition des annonces par devise, par ville et par type (vente ou location). ")
                  ]),
                  createVNode(unref(_sfc_main$1), {
                    class: "h-11 shrink-0 gap-2",
                    onClick: ($event) => unref(router).push("/dashboard/statistiques")
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Voir les statistiques "),
                      createVNode(unref(ArrowUpRight), { class: "h-4 w-4" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-12">`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "lg:col-span-8 rounded-3xl border-none shadow-sm overflow-hidden bg-card" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between"${_scopeId2}><div${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Performance Financi\xE8re`);
                      } else {
                        return [
                          createTextVNode("Performance Financi\xE8re")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Estimation bas\xE9e sur les abonnements Premium actifs.</p></div><div class="text-right"${_scopeId2}><p class="text-xs font-bold text-muted-foreground uppercase tracking-tighter"${_scopeId2}>Volume R\xE9el encaiss\xE9 (Reussite)</p><div class="flex flex-col items-end gap-1"${_scopeId2}><p class="text-2xl font-black text-emerald-600 dark:text-emerald-400"${_scopeId2}>${ssrInterpolate((revenueData.value["USD"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 2 }))} USD </p><p class="text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md"${_scopeId2}>${ssrInterpolate((revenueData.value["CDF"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 0 }))} FC </p></div></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode(unref(_sfc_main$2), { class: "text-xl font-black" }, {
                          default: withCtx(() => [
                            createTextVNode("Performance Financi\xE8re")
                          ]),
                          _: 1
                        }),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, "Estimation bas\xE9e sur les abonnements Premium actifs.")
                      ]),
                      createVNode("div", { class: "text-right" }, [
                        createVNode("p", { class: "text-xs font-bold text-muted-foreground uppercase tracking-tighter" }, "Volume R\xE9el encaiss\xE9 (Reussite)"),
                        createVNode("div", { class: "flex flex-col items-end gap-1" }, [
                          createVNode("p", { class: "text-2xl font-black text-emerald-600 dark:text-emerald-400" }, toDisplayString((revenueData.value["USD"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })) + " USD ", 1),
                          createVNode("p", { class: "text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md" }, toDisplayString((revenueData.value["CDF"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 0 })) + " FC ", 1)
                        ])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "p-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (chartData.value.data.length === 0) {
                    _push3(`<div class="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10 rounded-xl"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Activity), { class: "h-16 w-16 text-primary/20 mb-4 animate-bounce" }, null, _parent3, _scopeId2));
                    _push3(`<div class="text-center px-10"${_scopeId2}><p class="font-black text-foreground text-lg mb-1"${_scopeId2}>Aucune donn\xE9e disponible</p><p class="text-sm max-w-sm mx-auto italic"${_scopeId2}>Les paiements appara\xEEtront ici pour former un graphique de vos performances.</p></div></div>`);
                  } else {
                    _push3(`<div class="h-[300px] pt-4"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(Bar), {
                      data: chartDataObj.value,
                      options: chartOptions
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  }
                } else {
                  return [
                    chartData.value.data.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10 rounded-xl"
                    }, [
                      createVNode(unref(Activity), { class: "h-16 w-16 text-primary/20 mb-4 animate-bounce" }),
                      createVNode("div", { class: "text-center px-10" }, [
                        createVNode("p", { class: "font-black text-foreground text-lg mb-1" }, "Aucune donn\xE9e disponible"),
                        createVNode("p", { class: "text-sm max-w-sm mx-auto italic" }, "Les paiements appara\xEEtront ici pour former un graphique de vos performances.")
                      ])
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "h-[300px] pt-4"
                    }, [
                      createVNode(unref(Bar), {
                        data: chartDataObj.value,
                        options: chartOptions
                      }, null, 8, ["data"])
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", null, [
                      createVNode(unref(_sfc_main$2), { class: "text-xl font-black" }, {
                        default: withCtx(() => [
                          createTextVNode("Performance Financi\xE8re")
                        ]),
                        _: 1
                      }),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, "Estimation bas\xE9e sur les abonnements Premium actifs.")
                    ]),
                    createVNode("div", { class: "text-right" }, [
                      createVNode("p", { class: "text-xs font-bold text-muted-foreground uppercase tracking-tighter" }, "Volume R\xE9el encaiss\xE9 (Reussite)"),
                      createVNode("div", { class: "flex flex-col items-end gap-1" }, [
                        createVNode("p", { class: "text-2xl font-black text-emerald-600 dark:text-emerald-400" }, toDisplayString((revenueData.value["USD"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })) + " USD ", 1),
                        createVNode("p", { class: "text-sm font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md" }, toDisplayString((revenueData.value["CDF"] || 0).toLocaleString("fr-CD", { minimumFractionDigits: 0, maximumFractionDigits: 0 })) + " FC ", 1)
                      ])
                    ])
                  ])
                ]),
                _: 2
              }, 1024),
              createVNode(unref(_sfc_main$3), { class: "p-6" }, {
                default: withCtx(() => [
                  chartData.value.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-b from-transparent to-muted/10 rounded-xl"
                  }, [
                    createVNode(unref(Activity), { class: "h-16 w-16 text-primary/20 mb-4 animate-bounce" }),
                    createVNode("div", { class: "text-center px-10" }, [
                      createVNode("p", { class: "font-black text-foreground text-lg mb-1" }, "Aucune donn\xE9e disponible"),
                      createVNode("p", { class: "text-sm max-w-sm mx-auto italic" }, "Les paiements appara\xEEtront ici pour former un graphique de vos performances.")
                    ])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "h-[300px] pt-4"
                  }, [
                    createVNode(unref(Bar), {
                      data: chartDataObj.value,
                      options: chartOptions
                    }, null, 8, ["data"])
                  ]))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "lg:col-span-4 rounded-3xl border-none shadow-md overflow-hidden flex flex-col" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "pb-4 bg-primary text-primary-foreground relative overflow-hidden" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="absolute top-0 right-0 p-8 opacity-10"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(UserPlus), { class: "h-32 w-32" }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "text-xl font-black relative z-10 flex items-center gap-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Derniers Inscrits `);
                      } else {
                        return [
                          createTextVNode(" Derniers Inscrits ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-xs font-medium opacity-80 relative z-10 hover:underline cursor-help"${_scopeId2}> Mise \xE0 jour en temps r\xE9el via CasaNayo API </p>`);
                } else {
                  return [
                    createVNode("div", { class: "absolute top-0 right-0 p-8 opacity-10" }, [
                      createVNode(unref(UserPlus), { class: "h-32 w-32" })
                    ]),
                    createVNode(unref(_sfc_main$2), { class: "text-xl font-black relative z-10 flex items-center gap-2" }, {
                      default: withCtx(() => [
                        createTextVNode(" Derniers Inscrits ")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-xs font-medium opacity-80 relative z-10 hover:underline cursor-help" }, " Mise \xE0 jour en temps r\xE9el via CasaNayo API ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "p-6 flex-1" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-6"${_scopeId2}>`);
                  if (statsData.value.isLoading) {
                    _push3(`<!--[-->`);
                    ssrRenderList(5, (i) => {
                      _push3(`<div class="flex items-center gap-4"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "h-12 w-12 rounded-2xl" }, null, _parent3, _scopeId2));
                      _push3(`<div class="space-y-2 flex-1"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "h-4 w-32" }, null, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "h-3 w-48" }, null, _parent3, _scopeId2));
                      _push3(`</div></div>`);
                    });
                    _push3(`<!--]-->`);
                  } else {
                    _push3(`<!--[-->`);
                    ssrRenderList(recentUsers.value, (user) => {
                      _push3(`<div class="flex items-center group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-2xl transition-all border-b border-muted/50 last:border-0"${_scopeId2}><div class="relative"${_scopeId2}><div class="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white border border-primary/20 overflow-hidden shadow-md group-hover:scale-105 transition-transform"${_scopeId2}><img${ssrRenderAttr("src", `https://ui-avatars.com/api/?name=${user.username}&background=0F172A&color=fff`)} class="h-full w-full object-cover"${_scopeId2}></div>`);
                      if (user.certified) {
                        _push3(`<div class="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm"${_scopeId2}>`);
                        _push3(ssrRenderComponent(_component_Check, { class: "h-2 w-2 text-white" }, null, _parent3, _scopeId2));
                        _push3(`</div>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div><div class="ml-4 space-y-0.5 flex-1 min-w-0"${_scopeId2}><p class="text-sm font-black leading-none truncate group-hover:text-primary transition-colors"${_scopeId2}>${ssrInterpolate(user.username)}</p><p class="text-[10px] text-muted-foreground truncate"${_scopeId2}>${ssrInterpolate(user.email || user.phone)}</p><div class="flex items-center gap-2 mt-1"${_scopeId2}>`);
                      if (user.premium) {
                        _push3(ssrRenderComponent(unref(_sfc_main$5), { class: "text-[8px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-1.5 h-4" }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`PREMIUM`);
                            } else {
                              return [
                                createTextVNode("PREMIUM")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<span class="text-[9px] font-mono text-muted-foreground/60"${_scopeId2}>#${ssrInterpolate(user.userId)}</span></div></div>`);
                      _push3(ssrRenderComponent(unref(ArrowRight), { class: "h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" }, null, _parent3, _scopeId2));
                      _push3(`</div>`);
                    });
                    _push3(`<!--]-->`);
                  }
                  _push3(`</div><div class="mt-8 pt-4 border-t border-muted/50"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$1), {
                    onClick: ($event) => unref(router).push("/dashboard/users"),
                    variant: "ghost",
                    class: "w-full font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Voir tout l&#39;annuaire `);
                        _push4(ssrRenderComponent(unref(ArrowUpRight), { class: "ml-2 h-3 w-3" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" Voir tout l'annuaire "),
                          createVNode(unref(ArrowUpRight), { class: "ml-2 h-3 w-3" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-6" }, [
                      statsData.value.isLoading ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(5, (i) => {
                        return createVNode("div", {
                          key: i,
                          class: "flex items-center gap-4"
                        }, [
                          createVNode(unref(_sfc_main$4), { class: "h-12 w-12 rounded-2xl" }),
                          createVNode("div", { class: "space-y-2 flex-1" }, [
                            createVNode(unref(_sfc_main$4), { class: "h-4 w-32" }),
                            createVNode(unref(_sfc_main$4), { class: "h-3 w-48" })
                          ])
                        ]);
                      }), 64)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(recentUsers.value, (user) => {
                        return openBlock(), createBlock("div", {
                          key: user.userId,
                          class: "flex items-center group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-2xl transition-all border-b border-muted/50 last:border-0",
                          onClick: ($event) => unref(router).push(`/dashboard/users/${user.userId}`)
                        }, [
                          createVNode("div", { class: "relative" }, [
                            createVNode("div", { class: "h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white border border-primary/20 overflow-hidden shadow-md group-hover:scale-105 transition-transform" }, [
                              createVNode("img", {
                                src: `https://ui-avatars.com/api/?name=${user.username}&background=0F172A&color=fff`,
                                class: "h-full w-full object-cover"
                              }, null, 8, ["src"])
                            ]),
                            user.certified ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm"
                            }, [
                              createVNode(_component_Check, { class: "h-2 w-2 text-white" })
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "ml-4 space-y-0.5 flex-1 min-w-0" }, [
                            createVNode("p", { class: "text-sm font-black leading-none truncate group-hover:text-primary transition-colors" }, toDisplayString(user.username), 1),
                            createVNode("p", { class: "text-[10px] text-muted-foreground truncate" }, toDisplayString(user.email || user.phone), 1),
                            createVNode("div", { class: "flex items-center gap-2 mt-1" }, [
                              user.premium ? (openBlock(), createBlock(unref(_sfc_main$5), {
                                key: 0,
                                class: "text-[8px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-1.5 h-4"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("PREMIUM")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode("span", { class: "text-[9px] font-mono text-muted-foreground/60" }, "#" + toDisplayString(user.userId), 1)
                            ])
                          ]),
                          createVNode(unref(ArrowRight), { class: "h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" })
                        ], 8, ["onClick"]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-8 pt-4 border-t border-muted/50" }, [
                      createVNode(unref(_sfc_main$1), {
                        onClick: ($event) => unref(router).push("/dashboard/users"),
                        variant: "ghost",
                        class: "w-full font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Voir tout l'annuaire "),
                          createVNode(unref(ArrowUpRight), { class: "ml-2 h-3 w-3" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "pb-4 bg-primary text-primary-foreground relative overflow-hidden" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "absolute top-0 right-0 p-8 opacity-10" }, [
                    createVNode(unref(UserPlus), { class: "h-32 w-32" })
                  ]),
                  createVNode(unref(_sfc_main$2), { class: "text-xl font-black relative z-10 flex items-center gap-2" }, {
                    default: withCtx(() => [
                      createTextVNode(" Derniers Inscrits ")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-xs font-medium opacity-80 relative z-10 hover:underline cursor-help" }, " Mise \xE0 jour en temps r\xE9el via CasaNayo API ")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), { class: "p-6 flex-1" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-6" }, [
                    statsData.value.isLoading ? (openBlock(), createBlock(Fragment, { key: 0 }, renderList(5, (i) => {
                      return createVNode("div", {
                        key: i,
                        class: "flex items-center gap-4"
                      }, [
                        createVNode(unref(_sfc_main$4), { class: "h-12 w-12 rounded-2xl" }),
                        createVNode("div", { class: "space-y-2 flex-1" }, [
                          createVNode(unref(_sfc_main$4), { class: "h-4 w-32" }),
                          createVNode(unref(_sfc_main$4), { class: "h-3 w-48" })
                        ])
                      ]);
                    }), 64)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(recentUsers.value, (user) => {
                      return openBlock(), createBlock("div", {
                        key: user.userId,
                        class: "flex items-center group cursor-pointer hover:bg-muted/50 p-2 -mx-2 rounded-2xl transition-all border-b border-muted/50 last:border-0",
                        onClick: ($event) => unref(router).push(`/dashboard/users/${user.userId}`)
                      }, [
                        createVNode("div", { class: "relative" }, [
                          createVNode("div", { class: "h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white border border-primary/20 overflow-hidden shadow-md group-hover:scale-105 transition-transform" }, [
                            createVNode("img", {
                              src: `https://ui-avatars.com/api/?name=${user.username}&background=0F172A&color=fff`,
                              class: "h-full w-full object-cover"
                            }, null, 8, ["src"])
                          ]),
                          user.certified ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-card flex items-center justify-center shadow-sm"
                          }, [
                            createVNode(_component_Check, { class: "h-2 w-2 text-white" })
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "ml-4 space-y-0.5 flex-1 min-w-0" }, [
                          createVNode("p", { class: "text-sm font-black leading-none truncate group-hover:text-primary transition-colors" }, toDisplayString(user.username), 1),
                          createVNode("p", { class: "text-[10px] text-muted-foreground truncate" }, toDisplayString(user.email || user.phone), 1),
                          createVNode("div", { class: "flex items-center gap-2 mt-1" }, [
                            user.premium ? (openBlock(), createBlock(unref(_sfc_main$5), {
                              key: 0,
                              class: "text-[8px] bg-amber-500/10 text-amber-600 border-amber-500/20 px-1.5 h-4"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("PREMIUM")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true),
                            createVNode("span", { class: "text-[9px] font-mono text-muted-foreground/60" }, "#" + toDisplayString(user.userId), 1)
                          ])
                        ]),
                        createVNode(unref(ArrowRight), { class: "h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all ml-2" })
                      ], 8, ["onClick"]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "mt-8 pt-4 border-t border-muted/50" }, [
                    createVNode(unref(_sfc_main$1), {
                      onClick: ($event) => unref(router).push("/dashboard/users"),
                      variant: "ghost",
                      class: "w-full font-black text-xs uppercase tracking-widest text-primary hover:bg-primary/5"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Voir tout l'annuaire "),
                        createVNode(unref(ArrowUpRight), { class: "ml-2 h-3 w-3" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-rhCVUf_o.mjs.map
