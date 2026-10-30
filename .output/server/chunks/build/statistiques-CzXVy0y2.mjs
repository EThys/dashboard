import { defineComponent, computed, ref, mergeProps, unref, withCtx, openBlock, createBlock, createTextVNode, createVNode, toDisplayString, Fragment, resolveDynamicComponent, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { BarChart3, CalendarDays, Building2, MapPin, Loader2, RefreshCw, ExternalLink, Coins } from 'lucide-vue-next';
import { Bar } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$2 } from './CardContent-C5j1ijQX.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$3 } from './CardTitle-CY-VC8BI.mjs';
import { _ as _sfc_main$4 } from './Skeleton-BgOY-K4r.mjs';
import { u as useDashboardStore } from './dashboard-BK2yFE1H.mjs';
import { u as useReservationStore } from './reservations-DwuL3whZ.mjs';
import { g as gaMeasurementId } from './useGoogleAnalytics-DUKqbrzA.mjs';
import { u as useHead, c as useRuntimeConfig } from './server.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import './partyExtract-LSdOdPXy.mjs';
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

function asRecord(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function text(value) {
  if (typeof value === "string" || typeof value === "number") return String(value).trim();
  return "";
}
function num(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = parseInt(String(value != null ? value : ""), 10);
  return Number.isFinite(n) ? n : 0;
}
function entityOf(item) {
  return asRecord(item.property) || asRecord(item.terrain) || asRecord(item.funeraire) || asRecord(item.festive) || asRecord(item.bureau) || asRecord(item.hotel) || item;
}
function placePart(source, key) {
  if (!source) return "";
  const direct = text(source[key]);
  if (direct) return direct;
  const nested = asRecord(source[key.replace(/Value$/, "")]);
  return text(nested == null ? void 0 : nested.name);
}
function parseDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
function dayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function monthKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
function deviseCode(item, entity) {
  var _a, _b;
  const devise = asRecord(item.devise) || asRecord(entity.devise);
  const code = text(devise == null ? void 0 : devise.code).toUpperCase();
  if (code) return code;
  const id = num((_b = (_a = entity.deviseId) != null ? _a : item.deviseId) != null ? _b : devise == null ? void 0 : devise.id);
  if (id === 1) return "CDF";
  if (id === 2) return "USD";
  return "Non pr\xE9cis\xE9e";
}
function transactionOf(entity) {
  const t = text(entity.transactionType).toLowerCase();
  if (t.includes("locat") || t === "louer" || t === "location") return "Location";
  if (t.includes("vent") || t === "acheter" || t === "vente") return "Vente";
  return "Autre";
}
function listingFromRaw(raw) {
  var _a, _b, _c, _d, _e;
  const item = asRecord(raw);
  if (!item) return null;
  const entity = entityOf(item);
  const address = asRecord(item.address) || asRecord(entity.address);
  const city = placePart(address, "cityValue") || placePart(entity, "cityValue") || text(entity.city);
  const commune = placePart(address, "communeValue") || placePart(entity, "communeValue") || text(entity.commune);
  const place = [commune, city].filter(Boolean).join(", ") || "Non pr\xE9cis\xE9";
  const views = num((_c = (_b = (_a = item.viewCount) != null ? _a : entity.viewCount) != null ? _b : item.views) != null ? _c : entity.views);
  return {
    views,
    devise: deviseCode(item, entity),
    city: city || "Non pr\xE9cis\xE9e",
    commune: commune || "",
    place,
    transaction: transactionOf(entity),
    createdAt: parseDate((_e = (_d = entity.createdAt) != null ? _d : entity.dateCreated) != null ? _e : item.createdAt)
  };
}
function listingsFromRaw(items) {
  return items.map(listingFromRaw).filter((row) => !!row);
}
function visitFromReservation(raw) {
  const at = parseDate(raw.createdAt) || parseDate(raw.startDate);
  if (!at) return null;
  const status = String(raw.status || "").toUpperCase();
  return {
    at,
    cancelled: status === "CANCELLED" || status === "REJECTED"
  };
}
function sumViews(rows) {
  return rows.reduce((total, row) => total + row.views, 0);
}
function groupListings(rows, labelOf) {
  const map = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const label = labelOf(row) || "Non pr\xE9cis\xE9";
    const current = map.get(label) || { label, count: 0, views: 0 };
    current.count += 1;
    current.views += row.views;
    map.set(label, current);
  }
  return [...map.values()].sort((a, b) => b.views - a.views || b.count - a.count);
}
function lastDays(count, now = /* @__PURE__ */ new Date()) {
  const keys = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}
function lastMonths(count, now = /* @__PURE__ */ new Date()) {
  const keys = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}
function countByKey(dates, keys, keyOf) {
  const totals = new Map(keys.map((key) => [key, 0]));
  for (const date of dates) {
    const key = keyOf(date);
    if (totals.has(key)) totals.set(key, (totals.get(key) || 0) + 1);
  }
  return keys.map((key) => totals.get(key) || 0);
}
function formatDayLabel(key) {
  const d = /* @__PURE__ */ new Date(`${key}T12:00:00`);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function formatMonthLabel(key) {
  const d = /* @__PURE__ */ new Date(`${key}-01T12:00:00`);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}
function sameDay(a, b) {
  return dayKey(a) === dayKey(b);
}
function sameMonth(a, b) {
  return monthKey(a) === monthKey(b);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "statistiques",
  __ssrInlineRender: true,
  setup(__props) {
    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    useHead({ title: "Statistiques \u2014 CasaNayo" });
    const config = useRuntimeConfig();
    const gaId = computed(() => gaMeasurementId());
    const dashboard = useDashboardStore();
    const reservations = useReservationStore();
    const loadingVisits = ref(false);
    const listings = computed(() => listingsFromRaw(dashboard.properties));
    const visits = computed(
      () => reservations.platformReservations.map(visitFromReservation).filter((row) => !!row)
    );
    const activeVisits = computed(() => visits.value.filter((row) => !row.cancelled));
    const today = /* @__PURE__ */ new Date();
    const viewsTotal = computed(() => sumViews(listings.value));
    const visitsToday = computed(() => activeVisits.value.filter((row) => sameDay(row.at, today)).length);
    const visitsMonth = computed(() => activeVisits.value.filter((row) => sameMonth(row.at, today)).length);
    const byDevise = computed(() => groupListings(listings.value, (row) => row.devise));
    const places = computed(() => groupListings(listings.value, (row) => row.place));
    const byPlace = computed(() => places.value.slice(0, 8));
    const placeScale = computed(() => {
      const rows = byPlace.value;
      const views = Math.max(...rows.map((row) => row.views), 0);
      if (views > 0) return { mode: "views", max: views };
      return { mode: "count", max: Math.max(...rows.map((row) => row.count), 1) };
    });
    function placeBar(row) {
      const value = placeScale.value.mode === "views" ? row.views : row.count;
      return Math.max(6, value / placeScale.value.max * 100);
    }
    const byTransaction = computed(() => groupListings(listings.value, (row) => row.transaction));
    const membersByCity = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const user of dashboard.users) {
        const city = String((user == null ? void 0 : user.city) || (user == null ? void 0 : user.country) || "Non pr\xE9cis\xE9e").trim() || "Non pr\xE9cis\xE9e";
        map.set(city, (map.get(city) || 0) + 1);
      }
      return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 8);
    });
    const dayKeys = computed(() => lastDays(14, today));
    const monthKeys = computed(() => lastMonths(12, today));
    const dayCounts = computed(() => countByKey(activeVisits.value.map((row) => row.at), dayKeys.value, (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }));
    const monthCounts = computed(() => countByKey(activeVisits.value.map((row) => row.at), monthKeys.value, (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    }));
    function barData(labels, values, color) {
      return {
        labels,
        datasets: [{
          label: "Demandes",
          data: values,
          backgroundColor: color,
          borderRadius: 6,
          maxBarThickness: 28
        }]
      };
    }
    const dayChart = computed(() => barData(dayKeys.value.map(formatDayLabel), dayCounts.value, "#0ea5e9"));
    const monthChart = computed(() => barData(monthKeys.value.map(formatMonthLabel), monthCounts.value, "#10b981"));
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 }, border: { display: false } },
        x: { grid: { display: false } }
      }
    };
    const paymentByDevise = computed(() => {
      const totals = {};
      for (const row of dashboard.flatPayments) {
        const payment = row.payment;
        const status = String((payment == null ? void 0 : payment.status) || "").toUpperCase();
        if (status !== "SUCCESS" && status !== "COMPLETED" && status !== "PAID") continue;
        const code = String((payment == null ? void 0 : payment.devise) || "USD");
        const amount = typeof (payment == null ? void 0 : payment.amount) === "string" ? parseFloat(payment.amount) : Number(payment == null ? void 0 : payment.amount);
        if (!Number.isNaN(amount)) totals[code] = (totals[code] || 0) + amount;
      }
      return totals;
    });
    const kpis = computed(() => [
      {
        title: "Vues des annonces",
        value: viewsTotal.value.toLocaleString("fr-FR"),
        hint: "Cumul viewCount sur les biens charg\xE9s",
        icon: BarChart3,
        color: "text-sky-600",
        bg: "bg-sky-50"
      },
      {
        title: "Visites aujourd\u2019hui",
        value: visitsToday.value.toLocaleString("fr-FR"),
        hint: "Demandes de visite ou de r\xE9servation",
        icon: CalendarDays,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
      },
      {
        title: "Visites ce mois",
        value: visitsMonth.value.toLocaleString("fr-FR"),
        hint: `${activeVisits.value.length.toLocaleString("fr-FR")} demandes actives au total`,
        icon: Building2,
        color: "text-amber-600",
        bg: "bg-amber-50"
      },
      {
        title: "Lieux recens\xE9s",
        value: places.value.length.toLocaleString("fr-FR"),
        hint: `${byDevise.value.length.toLocaleString("fr-FR")} devise(s) sur les annonces`,
        icon: MapPin,
        color: "text-violet-600",
        bg: "bg-violet-50"
      }
    ]);
    async function load(force = false) {
      loadingVisits.value = true;
      const apiBase = config.public.apiBase;
      await Promise.all([
        dashboard.fetchStats(apiBase, force),
        reservations.fetchPlatformReservations(force)
      ]);
      loadingVisits.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8 pb-10" }, _attrs))}><div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h2 class="text-4xl font-black tracking-tight text-foreground">Statistiques du site</h2><p class="mt-1 max-w-2xl text-muted-foreground"> Vues des annonces, demandes de visite par jour et par mois, devises et lieux. </p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "outline",
        class: "h-11 gap-2 px-5 shadow-sm",
        onClick: ($event) => load(true)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(dashboard).isLoading || loadingVisits.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(RefreshCw), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }
            _push2(` Actualiser `);
          } else {
            return [
              unref(dashboard).isLoading || loadingVisits.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "h-4 w-4 animate-spin"
              })) : (openBlock(), createBlock(unref(RefreshCw), {
                key: 1,
                class: "h-4 w-4"
              })),
              createTextVNode(" Actualiser ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div${_scopeId2}><p class="text-xs font-black uppercase tracking-widest text-muted-foreground"${_scopeId2}>Google Analytics 4</p><p class="mt-1 text-lg font-black"${_scopeId2}>${ssrInterpolate(gaId.value ? `Suivi actif \xB7 ${gaId.value}` : "Suivi pas encore branch\xE9")}</p><p class="mt-1 max-w-2xl text-sm text-muted-foreground"${_scopeId2}>`);
                  if (gaId.value) {
                    _push3(`<!--[--> Les visites par jour, par mois, par pays et par ville se lisent dans Google Analytics. La devise et le lieu d\u2019une annonce partent quand un visiteur ouvre la fiche. Les premiers chiffres apparaissent en g\xE9n\xE9ral sous 24 \xE0 48 heures. <!--]-->`);
                  } else {
                    _push3(`<!--[--> Cr\xE9e une propri\xE9t\xE9 GA4, copie l\u2019ID de mesure (G-XXXXXXXX), puis ajoute <span class="font-mono text-xs"${_scopeId2}>NUXT_PUBLIC_GA_MEASUREMENT_ID</span> dans le fichier <span class="font-mono text-xs"${_scopeId2}>.env</span> du dossier dashboard et red\xE9marre le site. <!--]-->`);
                  }
                  _push3(`</p></div><a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" class="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"${_scopeId2}> Ouvrir Google Analytics `);
                  _push3(ssrRenderComponent(unref(ExternalLink), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(`</a>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, "Google Analytics 4"),
                      createVNode("p", { class: "mt-1 text-lg font-black" }, toDisplayString(gaId.value ? `Suivi actif \xB7 ${gaId.value}` : "Suivi pas encore branch\xE9"), 1),
                      createVNode("p", { class: "mt-1 max-w-2xl text-sm text-muted-foreground" }, [
                        gaId.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createTextVNode(" Les visites par jour, par mois, par pays et par ville se lisent dans Google Analytics. La devise et le lieu d\u2019une annonce partent quand un visiteur ouvre la fiche. Les premiers chiffres apparaissent en g\xE9n\xE9ral sous 24 \xE0 48 heures. ")
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createTextVNode(" Cr\xE9e une propri\xE9t\xE9 GA4, copie l\u2019ID de mesure (G-XXXXXXXX), puis ajoute "),
                          createVNode("span", { class: "font-mono text-xs" }, "NUXT_PUBLIC_GA_MEASUREMENT_ID"),
                          createTextVNode(" dans le fichier "),
                          createVNode("span", { class: "font-mono text-xs" }, ".env"),
                          createTextVNode(" du dossier dashboard et red\xE9marre le site. ")
                        ], 64))
                      ])
                    ]),
                    createVNode("a", {
                      href: "https://analytics.google.com/",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      class: "inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    }, [
                      createTextVNode(" Ouvrir Google Analytics "),
                      createVNode(unref(ExternalLink), { class: "h-4 w-4" })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), { class: "flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between" }, {
                default: withCtx(() => [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, "Google Analytics 4"),
                    createVNode("p", { class: "mt-1 text-lg font-black" }, toDisplayString(gaId.value ? `Suivi actif \xB7 ${gaId.value}` : "Suivi pas encore branch\xE9"), 1),
                    createVNode("p", { class: "mt-1 max-w-2xl text-sm text-muted-foreground" }, [
                      gaId.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(" Les visites par jour, par mois, par pays et par ville se lisent dans Google Analytics. La devise et le lieu d\u2019une annonce partent quand un visiteur ouvre la fiche. Les premiers chiffres apparaissent en g\xE9n\xE9ral sous 24 \xE0 48 heures. ")
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode(" Cr\xE9e une propri\xE9t\xE9 GA4, copie l\u2019ID de mesure (G-XXXXXXXX), puis ajoute "),
                        createVNode("span", { class: "font-mono text-xs" }, "NUXT_PUBLIC_GA_MEASUREMENT_ID"),
                        createTextVNode(" dans le fichier "),
                        createVNode("span", { class: "font-mono text-xs" }, ".env"),
                        createTextVNode(" du dossier dashboard et red\xE9marre le site. ")
                      ], 64))
                    ])
                  ]),
                  createVNode("a", {
                    href: "https://analytics.google.com/",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                  }, [
                    createTextVNode(" Ouvrir Google Analytics "),
                    createVNode(unref(ExternalLink), { class: "h-4 w-4" })
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(kpis.value, (kpi) => {
        _push(ssrRenderComponent(unref(_sfc_main$1$1), {
          key: kpi.title,
          class: "border-none shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "flex flex-row items-center justify-between space-y-0 pb-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(kpi.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(kpi.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`<div class="${ssrRenderClass(["rounded-xl p-2", kpi.bg, kpi.color])}"${_scopeId2}>`);
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(kpi.icon), { class: "h-5 w-5" }, null), _parent3, _scopeId2);
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(unref(_sfc_main$3), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(kpi.title), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode("div", {
                        class: ["rounded-xl p-2", kpi.bg, kpi.color]
                      }, [
                        (openBlock(), createBlock(resolveDynamicComponent(kpi.icon), { class: "h-5 w-5" }))
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (unref(dashboard).isLoading && !listings.value.length) {
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "mb-2 h-10 w-24" }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<div class="text-3xl font-black"${_scopeId2}>${ssrInterpolate(kpi.value)}</div>`);
                    }
                    _push3(`<p class="mt-1 text-xs italic text-muted-foreground"${_scopeId2}>${ssrInterpolate(kpi.hint)}</p>`);
                  } else {
                    return [
                      unref(dashboard).isLoading && !listings.value.length ? (openBlock(), createBlock(unref(_sfc_main$4), {
                        key: 0,
                        class: "mb-2 h-10 w-24"
                      })) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "text-3xl font-black"
                      }, toDisplayString(kpi.value), 1)),
                      createVNode("p", { class: "mt-1 text-xs italic text-muted-foreground" }, toDisplayString(kpi.hint), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1$2), { class: "flex flex-row items-center justify-between space-y-0 pb-2" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), { class: "text-xs font-black uppercase tracking-widest text-muted-foreground" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(kpi.title), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode("div", {
                      class: ["rounded-xl p-2", kpi.bg, kpi.color]
                    }, [
                      (openBlock(), createBlock(resolveDynamicComponent(kpi.icon), { class: "h-5 w-5" }))
                    ], 2)
                  ]),
                  _: 2
                }, 1024),
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    unref(dashboard).isLoading && !listings.value.length ? (openBlock(), createBlock(unref(_sfc_main$4), {
                      key: 0,
                      class: "mb-2 h-10 w-24"
                    })) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-3xl font-black"
                    }, toDisplayString(kpi.value), 1)),
                    createVNode("p", { class: "mt-1 text-xs italic text-muted-foreground" }, toDisplayString(kpi.hint), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="grid gap-6 lg:grid-cols-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Visites par jour`);
                      } else {
                        return [
                          createTextVNode("Visites par jour")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>14 derniers jours, hors demandes annul\xE9es.</p>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                      default: withCtx(() => [
                        createTextVNode("Visites par jour")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "14 derniers jours, hors demandes annul\xE9es.")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "p-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="h-[280px]"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Bar), {
                    data: dayChart.value,
                    options: chartOptions
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "h-[280px]" }, [
                      createVNode(unref(Bar), {
                        data: dayChart.value,
                        options: chartOptions
                      }, null, 8, ["data"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx(() => [
                      createTextVNode("Visites par jour")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "14 derniers jours, hors demandes annul\xE9es.")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), { class: "p-6" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "h-[280px]" }, [
                    createVNode(unref(Bar), {
                      data: dayChart.value,
                      options: chartOptions
                    }, null, 8, ["data"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Visites par mois`);
                      } else {
                        return [
                          createTextVNode("Visites par mois")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>12 derniers mois, date d\u2019enregistrement de la demande.</p>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                      default: withCtx(() => [
                        createTextVNode("Visites par mois")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "12 derniers mois, date d\u2019enregistrement de la demande.")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "p-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="h-[280px]"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(Bar), {
                    data: monthChart.value,
                    options: chartOptions
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "h-[280px]" }, [
                      createVNode(unref(Bar), {
                        data: monthChart.value,
                        options: chartOptions
                      }, null, 8, ["data"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx(() => [
                      createTextVNode("Visites par mois")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "12 derniers mois, date d\u2019enregistrement de la demande.")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), { class: "p-6" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "h-[280px]" }, [
                    createVNode(unref(Bar), {
                      data: monthChart.value,
                      options: chartOptions
                    }, null, 8, ["data"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid gap-6 lg:grid-cols-12">`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm lg:col-span-5" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Coins), { class: "h-5 w-5 text-emerald-600" }, null, _parent4, _scopeId3));
                        _push4(` Devises `);
                      } else {
                        return [
                          createVNode(unref(Coins), { class: "h-5 w-5 text-emerald-600" }),
                          createTextVNode(" Devises ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Annonces, vues et encaissements r\xE9ussis.</p>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                      default: withCtx(() => [
                        createVNode(unref(Coins), { class: "h-5 w-5 text-emerald-600" }),
                        createTextVNode(" Devises ")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "Annonces, vues et encaissements r\xE9ussis.")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "p-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<table class="w-full text-sm"${_scopeId2}><thead class="text-left text-[11px] uppercase tracking-wider text-muted-foreground"${_scopeId2}><tr${_scopeId2}><th class="px-6 py-3 font-bold"${_scopeId2}>Code</th><th class="px-3 py-3 font-bold"${_scopeId2}>Annonces</th><th class="px-3 py-3 font-bold"${_scopeId2}>Vues</th><th class="px-6 py-3 text-right font-bold"${_scopeId2}>Encaiss\xE9</th></tr></thead><tbody${_scopeId2}><!--[-->`);
                  ssrRenderList(byDevise.value, (row) => {
                    _push3(`<tr class="border-t"${_scopeId2}><td class="px-6 py-3 font-black"${_scopeId2}>${ssrInterpolate(row.label)}</td><td class="px-3 py-3"${_scopeId2}>${ssrInterpolate(row.count.toLocaleString("fr-FR"))}</td><td class="px-3 py-3"${_scopeId2}>${ssrInterpolate(row.views.toLocaleString("fr-FR"))}</td><td class="px-6 py-3 text-right font-medium"${_scopeId2}>${ssrInterpolate((paymentByDevise.value[row.label] || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 }))}</td></tr>`);
                  });
                  _push3(`<!--]-->`);
                  if (!byDevise.value.length) {
                    _push3(`<tr${_scopeId2}><td colspan="4" class="px-6 py-8 text-center text-muted-foreground"${_scopeId2}>Aucune annonce charg\xE9e.</td></tr>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</tbody></table>`);
                  if (unref(dashboard).devises.length) {
                    _push3(`<div class="border-t px-6 py-4 text-xs text-muted-foreground"${_scopeId2}><!--[-->`);
                    ssrRenderList(unref(dashboard).devises, (devise) => {
                      _push3(`<span class="mr-4 inline-block"${_scopeId2}>${ssrInterpolate(devise.code)} `);
                      if (devise.taux || devise.tauxLocal) {
                        _push3(`<!--[--> \xB7 taux ${ssrInterpolate(devise.taux || devise.tauxLocal)}<!--]-->`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</span>`);
                    });
                    _push3(`<!--]--></div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("table", { class: "w-full text-sm" }, [
                      createVNode("thead", { class: "text-left text-[11px] uppercase tracking-wider text-muted-foreground" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-6 py-3 font-bold" }, "Code"),
                          createVNode("th", { class: "px-3 py-3 font-bold" }, "Annonces"),
                          createVNode("th", { class: "px-3 py-3 font-bold" }, "Vues"),
                          createVNode("th", { class: "px-6 py-3 text-right font-bold" }, "Encaiss\xE9")
                        ])
                      ]),
                      createVNode("tbody", null, [
                        (openBlock(true), createBlock(Fragment, null, renderList(byDevise.value, (row) => {
                          return openBlock(), createBlock("tr", {
                            key: row.label,
                            class: "border-t"
                          }, [
                            createVNode("td", { class: "px-6 py-3 font-black" }, toDisplayString(row.label), 1),
                            createVNode("td", { class: "px-3 py-3" }, toDisplayString(row.count.toLocaleString("fr-FR")), 1),
                            createVNode("td", { class: "px-3 py-3" }, toDisplayString(row.views.toLocaleString("fr-FR")), 1),
                            createVNode("td", { class: "px-6 py-3 text-right font-medium" }, toDisplayString((paymentByDevise.value[row.label] || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })), 1)
                          ]);
                        }), 128)),
                        !byDevise.value.length ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "4",
                            class: "px-6 py-8 text-center text-muted-foreground"
                          }, "Aucune annonce charg\xE9e.")
                        ])) : createCommentVNode("", true)
                      ])
                    ]),
                    unref(dashboard).devises.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "border-t px-6 py-4 text-xs text-muted-foreground"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).devises, (devise) => {
                        return openBlock(), createBlock("span", {
                          key: devise.code,
                          class: "mr-4 inline-block"
                        }, [
                          createTextVNode(toDisplayString(devise.code) + " ", 1),
                          devise.taux || devise.tauxLocal ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createTextVNode(" \xB7 taux " + toDisplayString(devise.taux || devise.tauxLocal), 1)
                          ], 64)) : createCommentVNode("", true)
                        ]);
                      }), 128))
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                    default: withCtx(() => [
                      createVNode(unref(Coins), { class: "h-5 w-5 text-emerald-600" }),
                      createTextVNode(" Devises ")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "Annonces, vues et encaissements r\xE9ussis.")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), { class: "p-0" }, {
                default: withCtx(() => [
                  createVNode("table", { class: "w-full text-sm" }, [
                    createVNode("thead", { class: "text-left text-[11px] uppercase tracking-wider text-muted-foreground" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-6 py-3 font-bold" }, "Code"),
                        createVNode("th", { class: "px-3 py-3 font-bold" }, "Annonces"),
                        createVNode("th", { class: "px-3 py-3 font-bold" }, "Vues"),
                        createVNode("th", { class: "px-6 py-3 text-right font-bold" }, "Encaiss\xE9")
                      ])
                    ]),
                    createVNode("tbody", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(byDevise.value, (row) => {
                        return openBlock(), createBlock("tr", {
                          key: row.label,
                          class: "border-t"
                        }, [
                          createVNode("td", { class: "px-6 py-3 font-black" }, toDisplayString(row.label), 1),
                          createVNode("td", { class: "px-3 py-3" }, toDisplayString(row.count.toLocaleString("fr-FR")), 1),
                          createVNode("td", { class: "px-3 py-3" }, toDisplayString(row.views.toLocaleString("fr-FR")), 1),
                          createVNode("td", { class: "px-6 py-3 text-right font-medium" }, toDisplayString((paymentByDevise.value[row.label] || 0).toLocaleString("fr-FR", { maximumFractionDigits: 0 })), 1)
                        ]);
                      }), 128)),
                      !byDevise.value.length ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "4",
                          class: "px-6 py-8 text-center text-muted-foreground"
                        }, "Aucune annonce charg\xE9e.")
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  unref(dashboard).devises.length ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "border-t px-6 py-4 text-xs text-muted-foreground"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(dashboard).devises, (devise) => {
                      return openBlock(), createBlock("span", {
                        key: devise.code,
                        class: "mr-4 inline-block"
                      }, [
                        createTextVNode(toDisplayString(devise.code) + " ", 1),
                        devise.taux || devise.tauxLocal ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createTextVNode(" \xB7 taux " + toDisplayString(devise.taux || devise.tauxLocal), 1)
                        ], 64)) : createCommentVNode("", true)
                      ]);
                    }), 128))
                  ])) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm lg:col-span-7" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 text-violet-600" }, null, _parent4, _scopeId3));
                        _push4(` Lieux des annonces `);
                      } else {
                        return [
                          createVNode(unref(MapPin), { class: "h-5 w-5 text-violet-600" }),
                          createTextVNode(" Lieux des annonces ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Commune et ville, class\xE9es par nombre de vues.</p>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                      default: withCtx(() => [
                        createVNode(unref(MapPin), { class: "h-5 w-5 text-violet-600" }),
                        createTextVNode(" Lieux des annonces ")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "Commune et ville, class\xE9es par nombre de vues.")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "space-y-4 p-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(byPlace.value, (row) => {
                    _push3(`<div class="space-y-1"${_scopeId2}><div class="flex items-center justify-between text-sm"${_scopeId2}><span class="font-bold"${_scopeId2}>${ssrInterpolate(row.label)}</span><span class="text-muted-foreground"${_scopeId2}>${ssrInterpolate(row.views.toLocaleString("fr-FR"))} vues \xB7 ${ssrInterpolate(row.count)} annonce${ssrInterpolate(row.count > 1 ? "s" : "")}</span></div><div class="h-2 overflow-hidden rounded-full bg-muted"${_scopeId2}><div class="h-full rounded-full bg-violet-500" style="${ssrRenderStyle({ width: `${placeBar(row)}%` })}"${_scopeId2}></div></div></div>`);
                  });
                  _push3(`<!--]-->`);
                  if (!byPlace.value.length) {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Aucun lieu disponible.</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="grid gap-3 border-t pt-4 sm:grid-cols-3"${_scopeId2}><!--[-->`);
                  ssrRenderList(byTransaction.value, (row) => {
                    _push3(`<div class="rounded-2xl bg-muted/40 p-4"${_scopeId2}><p class="text-[11px] font-black uppercase tracking-widest text-muted-foreground"${_scopeId2}>${ssrInterpolate(row.label)}</p><p class="mt-1 text-2xl font-black"${_scopeId2}>${ssrInterpolate(row.count.toLocaleString("fr-FR"))}</p><p class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(row.views.toLocaleString("fr-FR"))} vues</p></div>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(byPlace.value, (row) => {
                      return openBlock(), createBlock("div", {
                        key: row.label,
                        class: "space-y-1"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                          createVNode("span", { class: "font-bold" }, toDisplayString(row.label), 1),
                          createVNode("span", { class: "text-muted-foreground" }, toDisplayString(row.views.toLocaleString("fr-FR")) + " vues \xB7 " + toDisplayString(row.count) + " annonce" + toDisplayString(row.count > 1 ? "s" : ""), 1)
                        ]),
                        createVNode("div", { class: "h-2 overflow-hidden rounded-full bg-muted" }, [
                          createVNode("div", {
                            class: "h-full rounded-full bg-violet-500",
                            style: { width: `${placeBar(row)}%` }
                          }, null, 4)
                        ])
                      ]);
                    }), 128)),
                    !byPlace.value.length ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, "Aucun lieu disponible.")) : createCommentVNode("", true),
                    createVNode("div", { class: "grid gap-3 border-t pt-4 sm:grid-cols-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(byTransaction.value, (row) => {
                        return openBlock(), createBlock("div", {
                          key: row.label,
                          class: "rounded-2xl bg-muted/40 p-4"
                        }, [
                          createVNode("p", { class: "text-[11px] font-black uppercase tracking-widest text-muted-foreground" }, toDisplayString(row.label), 1),
                          createVNode("p", { class: "mt-1 text-2xl font-black" }, toDisplayString(row.count.toLocaleString("fr-FR")), 1),
                          createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(row.views.toLocaleString("fr-FR")) + " vues", 1)
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "flex items-center gap-2 text-xl font-black" }, {
                    default: withCtx(() => [
                      createVNode(unref(MapPin), { class: "h-5 w-5 text-violet-600" }),
                      createTextVNode(" Lieux des annonces ")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "Commune et ville, class\xE9es par nombre de vues.")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), { class: "space-y-4 p-6" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(byPlace.value, (row) => {
                    return openBlock(), createBlock("div", {
                      key: row.label,
                      class: "space-y-1"
                    }, [
                      createVNode("div", { class: "flex items-center justify-between text-sm" }, [
                        createVNode("span", { class: "font-bold" }, toDisplayString(row.label), 1),
                        createVNode("span", { class: "text-muted-foreground" }, toDisplayString(row.views.toLocaleString("fr-FR")) + " vues \xB7 " + toDisplayString(row.count) + " annonce" + toDisplayString(row.count > 1 ? "s" : ""), 1)
                      ]),
                      createVNode("div", { class: "h-2 overflow-hidden rounded-full bg-muted" }, [
                        createVNode("div", {
                          class: "h-full rounded-full bg-violet-500",
                          style: { width: `${placeBar(row)}%` }
                        }, null, 4)
                      ])
                    ]);
                  }), 128)),
                  !byPlace.value.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-muted-foreground"
                  }, "Aucun lieu disponible.")) : createCommentVNode("", true),
                  createVNode("div", { class: "grid gap-3 border-t pt-4 sm:grid-cols-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(byTransaction.value, (row) => {
                      return openBlock(), createBlock("div", {
                        key: row.label,
                        class: "rounded-2xl bg-muted/40 p-4"
                      }, [
                        createVNode("p", { class: "text-[11px] font-black uppercase tracking-widest text-muted-foreground" }, toDisplayString(row.label), 1),
                        createVNode("p", { class: "mt-1 text-2xl font-black" }, toDisplayString(row.count.toLocaleString("fr-FR")), 1),
                        createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(row.views.toLocaleString("fr-FR")) + " vues", 1)
                      ]);
                    }), 128))
                  ])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1$1), { class: "rounded-3xl border-none shadow-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Membres par ville`);
                      } else {
                        return [
                          createTextVNode("Membres par ville")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Ville indiqu\xE9e sur le profil utilisateur.</p>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                      default: withCtx(() => [
                        createTextVNode("Membres par ville")
                      ]),
                      _: 1
                    }),
                    createVNode("p", { class: "text-sm text-muted-foreground" }, "Ville indiqu\xE9e sur le profil utilisateur.")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(membersByCity.value, (row) => {
                    _push3(`<div class="rounded-2xl border px-4 py-3"${_scopeId2}><p class="truncate font-bold"${_scopeId2}>${ssrInterpolate(row.label)}</p><p class="text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(row.count.toLocaleString("fr-FR"))} membre${ssrInterpolate(row.count > 1 ? "s" : "")}</p></div>`);
                  });
                  _push3(`<!--]-->`);
                  if (!membersByCity.value.length) {
                    _push3(`<p class="text-sm text-muted-foreground"${_scopeId2}>Aucun membre charg\xE9.</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(membersByCity.value, (row) => {
                      return openBlock(), createBlock("div", {
                        key: row.label,
                        class: "rounded-2xl border px-4 py-3"
                      }, [
                        createVNode("p", { class: "truncate font-bold" }, toDisplayString(row.label), 1),
                        createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(row.count.toLocaleString("fr-FR")) + " membre" + toDisplayString(row.count > 1 ? "s" : ""), 1)
                      ]);
                    }), 128)),
                    !membersByCity.value.length ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-muted-foreground"
                    }, "Aucun membre charg\xE9.")) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$2), { class: "border-b bg-muted/20 pb-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "text-xl font-black" }, {
                    default: withCtx(() => [
                      createTextVNode("Membres par ville")
                    ]),
                    _: 1
                  }),
                  createVNode("p", { class: "text-sm text-muted-foreground" }, "Ville indiqu\xE9e sur le profil utilisateur.")
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$2), { class: "grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-4" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(membersByCity.value, (row) => {
                    return openBlock(), createBlock("div", {
                      key: row.label,
                      class: "rounded-2xl border px-4 py-3"
                    }, [
                      createVNode("p", { class: "truncate font-bold" }, toDisplayString(row.label), 1),
                      createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(row.count.toLocaleString("fr-FR")) + " membre" + toDisplayString(row.count > 1 ? "s" : ""), 1)
                    ]);
                  }), 128)),
                  !membersByCity.value.length ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-sm text-muted-foreground"
                  }, "Aucun membre charg\xE9.")) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/statistiques.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=statistiques-CzXVy0y2.mjs.map
