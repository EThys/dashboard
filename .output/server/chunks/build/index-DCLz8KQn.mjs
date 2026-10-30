import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _imports_0 } from './congo-DR1txCxA.mjs';
import { Search, MapPin, ChevronDown, Phone } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { h as useSeoMeta, u as useHead, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { u as useAsyncData } from './asyncData-BvsKIpkL.mjs';
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
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';

const itemsPerPage = 9;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Agences de tourisme",
      description: "D\xE9couvrez les agences partenaires CasaNayo et leurs s\xE9jours au Congo : circuits, escapades et exp\xE9riences locales."
    });
    useHead({
      link: [{ rel: "canonical", href: "https://casanayo.com/agences" }]
    });
    const config = useRuntimeConfig();
    const { data: rows, pending, error } = useAsyncData(
      "public-agences-list",
      () => $fetch(
        joinApi(config.public.apiBase, ApiEndpoints.agences)
      ).then((r) => {
        var _a;
        return (_a = r == null ? void 0 : r.data) != null ? _a : [];
      })
    );
    const searchQuery = ref("");
    const sortOrder = ref("name");
    const filteredRows = computed(() => {
      var _a;
      let list = [...(_a = rows.value) != null ? _a : []];
      const q = searchQuery.value.trim().toLowerCase();
      if (q) {
        list = list.filter((row) => {
          const a = row.agence;
          return (a.name || "").toLowerCase().includes(q) || (a.description || "").toLowerCase().includes(q) || (a.address || "").toLowerCase().includes(q) || (a.phone1 || "").toLowerCase().includes(q);
        });
      }
      if (sortOrder.value === "name") {
        list.sort((x, y) => (x.agence.name || "").localeCompare(y.agence.name || "", "fr"));
      } else {
        list.sort((x, y) => {
          var _a2, _b;
          return ((_a2 = y.agence.id) != null ? _a2 : 0) - ((_b = x.agence.id) != null ? _b : 0);
        });
      }
      return list;
    });
    const currentPage = ref(1);
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / itemsPerPage)));
    const paginatedRows = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredRows.value.slice(start, start + itemsPerPage);
    });
    watch([searchQuery, sortOrder], () => {
      currentPage.value = 1;
    });
    watch(totalPages, (tp) => {
      if (currentPage.value > tp) currentPage.value = Math.max(1, tp);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><section class="relative overflow-hidden bg-slate-800"><div class="absolute inset-0 z-0"><img${ssrRenderAttr("src", _imports_0)} class="h-full w-full object-cover opacity-40" alt="Tourisme Congo" loading="eager" fetchpriority="high" decoding="async"><div class="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-800/70 to-transparent"></div></div><div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center"><div class="max-w-2xl mx-auto mb-6"><h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"> \xC9vasion &amp; D\xE9couverte <span class="block text-primary">Le Congo \xE0 port\xE9e de main</span></h1><p class="mt-3 text-slate-300/80 text-sm md:text-base"> Des agences de confiance pour imaginer votre prochain voyage au Congo. </p></div><div class="max-w-2xl mx-auto"><div class="flex items-center bg-white rounded-2xl shadow-xl overflow-hidden">`);
      _push(ssrRenderComponent(unref(Search), { class: "ml-4 h-5 w-5 shrink-0 text-slate-400" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Nom d&#39;agence, ville..." class="h-12 flex-1 border-none bg-transparent px-3 text-sm font-medium text-slate-800 focus:ring-0 placeholder:text-slate-400">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), { class: "h-10 m-1 shrink-0 rounded-xl px-5 font-bold text-sm" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Rechercher`);
          } else {
            return [
              createTextVNode("Rechercher")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section><div class="container relative z-20 mx-auto mt-8 px-4"><div class="mx-auto mb-12 max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-xl"><div class="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end"><div class="md:col-span-8"><label class="mb-1 block text-left text-xs font-semibold text-muted-foreground">Tri</label><div class="relative group"><div class="pointer-events-none absolute inset-y-0 left-4 flex items-center">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" }, null, _parent));
      _push(`</div><select class="h-12 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pl-12 pr-8 text-foreground focus:ring-2 focus:ring-primary"><option value="name"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "name") : ssrLooseEqual(sortOrder.value, "name")) ? " selected" : ""}>Nom (A \u2192 Z)</option><option value="recent"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "recent") : ssrLooseEqual(sortOrder.value, "recent")) ? " selected" : ""}>Plus r\xE9centes</option></select><div class="pointer-events-none absolute inset-y-0 right-4 flex items-center">`);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 opacity-50" }, null, _parent));
      _push(`</div></div></div><div class="text-right text-sm text-muted-foreground md:col-span-4 md:pb-3">${ssrInterpolate(filteredRows.value.length)} agence(s) </div></div></div>`);
      if (unref(pending)) {
        _push(`<div class="grid gap-8 pb-24 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(6, (n) => {
          _push(`<div class="h-80 animate-pulse rounded-[2rem] bg-slate-200/80 dark:bg-slate-800"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(error)) {
        _push(`<div class="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm"> Impossible de charger les agences pour le moment. </div>`);
      } else if (!((_a = unref(rows)) == null ? void 0 : _a.length)) {
        _push(`<div class="rounded-2xl border border-dashed p-12 text-center text-muted-foreground"> Aucune agence publi\xE9e. </div>`);
      } else {
        _push(`<!--[--><div id="agences-grid" class="mx-auto grid max-w-7xl gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(paginatedRows.value, (row) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: row.agence.id,
            to: `/agences/${unref(encodeId)(row.agence.id)}`,
            class: "group flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-52 overflow-hidden bg-muted"${_scopeId}><img${ssrRenderAttr("src", row.agence.logo)}${ssrRenderAttr("alt", row.agence.name)} class="h-full w-full object-cover transition duration-500 group-hover:scale-105"${_scopeId}></div><div class="flex flex-1 flex-col gap-3 p-6"${_scopeId}><h2 class="text-xl font-black leading-tight"${_scopeId}>${ssrInterpolate(row.agence.name)}</h2><p class="line-clamp-3 text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(row.agence.description)}</p><div class="mt-auto flex flex-col gap-2 text-xs font-semibold text-muted-foreground"${_scopeId}><span class="inline-flex items-start gap-2"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(row.agence.address)}</span>`);
                if (row.agence.phone1) {
                  _push2(`<span class="inline-flex items-center gap-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 shrink-0 text-primary" }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(row.agence.phone1)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-52 overflow-hidden bg-muted" }, [
                    createVNode("img", {
                      src: row.agence.logo,
                      alt: row.agence.name,
                      class: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("div", { class: "flex flex-1 flex-col gap-3 p-6" }, [
                    createVNode("h2", { class: "text-xl font-black leading-tight" }, toDisplayString(row.agence.name), 1),
                    createVNode("p", { class: "line-clamp-3 text-sm text-muted-foreground" }, toDisplayString(row.agence.description), 1),
                    createVNode("div", { class: "mt-auto flex flex-col gap-2 text-xs font-semibold text-muted-foreground" }, [
                      createVNode("span", { class: "inline-flex items-start gap-2" }, [
                        createVNode(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
                        createTextVNode(" " + toDisplayString(row.agence.address), 1)
                      ]),
                      row.agence.phone1 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex items-center gap-2"
                      }, [
                        createVNode(unref(Phone), { class: "h-4 w-4 shrink-0 text-primary" }),
                        createTextVNode(" " + toDisplayString(row.agence.phone1), 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
        if (totalPages.value > 1) {
          _push(`<div class="mx-auto flex max-w-7xl items-center justify-center gap-4 pb-24 pt-4">`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            disabled: currentPage.value <= 1,
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
          _push(`<span class="text-sm text-muted-foreground"> Page ${ssrInterpolate(currentPage.value)} / ${ssrInterpolate(totalPages.value)}</span>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            disabled: currentPage.value >= totalPages.value,
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
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agences/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DCLz8KQn.mjs.map
