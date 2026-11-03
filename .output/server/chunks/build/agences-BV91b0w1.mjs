import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, withAsyncContext, ref, computed, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Compass, MapPin, Phone } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { h as useSeoMeta, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { p as parseApiDay, d as dateFromMediaUrl } from './hotelTimeline-Kaah3oiT.mjs';
import { _ as _sfc_main$2 } from './ListPagination-BYvyA4ig.mjs';
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

const agencyPageSize = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "agences",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({ title: "Tourisme & agences" });
    const config = useRuntimeConfig();
    useAuthStore();
    const { data: publicRows, pending: pendingPublic } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "dashboard-agences-public",
      () => $fetch(
        joinApi(config.public.apiBase, ApiEndpoints.agences)
      ).then((r) => {
        var _a;
        return (_a = r == null ? void 0 : r.data) != null ? _a : [];
      })
    )), __temp = await __temp, __restore(), __temp);
    const agencyPage = ref(1);
    function agencyListed(row) {
      const agence = row.agence;
      return agence.available !== false && agence.active !== false;
    }
    function agencyStamp(row) {
      const agence = row.agence;
      const parsed = parseApiDay(agence.createdAt) || parseApiDay(agence.dateCreated);
      if (parsed) return parsed.getTime();
      const media = dateFromMediaUrl(agence.logo || "");
      return media ? media.getTime() : 0;
    }
    const agencyRows = computed(() => {
      var _a;
      const rows = [...(_a = publicRows.value) != null ? _a : []];
      rows.sort((a, b) => {
        const rankA = agencyListed(a) ? 0 : 1;
        const rankB = agencyListed(b) ? 0 : 1;
        if (rankA !== rankB) return rankA - rankB;
        const delta = agencyStamp(b) - agencyStamp(a);
        if (delta !== 0) return delta;
        return b.agence.id - a.agence.id;
      });
      return rows;
    });
    const pagedAgencies = computed(() => {
      const start = (agencyPage.value - 1) * agencyPageSize;
      return agencyRows.value.slice(start, start + agencyPageSize);
    });
    watch(agencyRows, () => {
      agencyPage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-10" }, _attrs))}><div class="flex flex-col gap-2 border-b border-border pb-8 md:flex-row md:items-end md:justify-between"><div><p class="text-xs font-black uppercase tracking-widest text-primary">Tourisme</p><h1 class="text-3xl font-black tracking-tight md:text-4xl">Agences partenaires</h1><p class="mt-2 max-w-2xl text-muted-foreground"> Explorez les lieux id\xE9aux : le Congo est vaste et beau. Retrouvez ici les agences r\xE9f\xE9renc\xE9es sur CasaNayo. </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/agences" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              variant: "outline",
              class: "rounded-full font-bold"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Compass), { class: "mr-2 h-4 w-4" }, null, _parent3, _scopeId2));
                  _push3(` Voir le site public `);
                } else {
                  return [
                    createVNode(unref(Compass), { class: "mr-2 h-4 w-4" }),
                    createTextVNode(" Voir le site public ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), {
                variant: "outline",
                class: "rounded-full font-bold"
              }, {
                default: withCtx(() => [
                  createVNode(unref(Compass), { class: "mr-2 h-4 w-4" }),
                  createTextVNode(" Voir le site public ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><section><h2 class="mb-6 text-xl font-black">Toutes les agences</h2>`);
      if (unref(pendingPublic)) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(6, (n) => {
          _push(`<div class="h-64 animate-pulse rounded-3xl bg-muted"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(pagedAgencies.value, (row) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: row.agence.id,
            to: `/agences/${unref(encodeId)(row.agence.id)}`,
            class: "group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative h-44 overflow-hidden bg-muted"${_scopeId}><img${ssrRenderAttr("src", row.agence.logo)}${ssrRenderAttr("alt", row.agence.name)} class="h-full w-full object-cover transition group-hover:scale-105"${_scopeId}></div><div class="space-y-2 p-5"${_scopeId}><h3 class="text-lg font-black"${_scopeId}>${ssrInterpolate(row.agence.name)}</h3><p class="line-clamp-2 text-sm text-muted-foreground"${_scopeId}>${ssrInterpolate(row.agence.description)}</p><span class="inline-flex items-start gap-2 text-xs font-semibold text-muted-foreground"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(row.agence.address)}</span>`);
                if (row.agence.phone1) {
                  _push2(`<span class="flex items-center gap-2 text-xs font-semibold"${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 text-primary" }, null, _parent2, _scopeId));
                  _push2(` ${ssrInterpolate(row.agence.phone1)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", { class: "relative h-44 overflow-hidden bg-muted" }, [
                    createVNode("img", {
                      src: row.agence.logo,
                      alt: row.agence.name,
                      class: "h-full w-full object-cover transition group-hover:scale-105"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("div", { class: "space-y-2 p-5" }, [
                    createVNode("h3", { class: "text-lg font-black" }, toDisplayString(row.agence.name), 1),
                    createVNode("p", { class: "line-clamp-2 text-sm text-muted-foreground" }, toDisplayString(row.agence.description), 1),
                    createVNode("span", { class: "inline-flex items-start gap-2 text-xs font-semibold text-muted-foreground" }, [
                      createVNode(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
                      createTextVNode(" " + toDisplayString(row.agence.address), 1)
                    ]),
                    row.agence.phone1 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "flex items-center gap-2 text-xs font-semibold"
                    }, [
                      createVNode(unref(Phone), { class: "h-4 w-4 text-primary" }),
                      createTextVNode(" " + toDisplayString(row.agence.phone1), 1)
                    ])) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(ssrRenderComponent(_sfc_main$2, {
        class: "mt-8",
        page: agencyPage.value,
        total: agencyRows.value.length,
        "page-size": agencyPageSize,
        "onUpdate:page": ($event) => agencyPage.value = $event
      }, null, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/agences.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=agences-BV91b0w1.mjs.map
