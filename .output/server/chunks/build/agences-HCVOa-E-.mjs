import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { Compass, MapPin, Phone } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { h as useSeoMeta, l as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "agences",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Mes agences \u2014 tourisme" });
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const ownerRows = ref([]);
    const pendingOwner = ref(true);
    async function loadOwnerAgences() {
      var _a, _b;
      if (!auth.token || ((_a = auth.user) == null ? void 0 : _a.userId) == null) {
        ownerRows.value = [];
        pendingOwner.value = false;
        return;
      }
      pendingOwner.value = true;
      try {
        const r = await $fetch(
          joinApi(
            config.public.apiBase,
            `${ApiEndpoints.agencesByOwner}${auth.user.userId}`
          ),
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        ownerRows.value = (_b = r == null ? void 0 : r.data) != null ? _b : [];
      } catch {
        ownerRows.value = [];
      } finally {
        pendingOwner.value = false;
      }
    }
    watch(
      () => {
        var _a;
        return { token: auth.token, uid: (_a = auth.user) == null ? void 0 : _a.userId };
      },
      loadOwnerAgences
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-muted/20 pb-20 pt-10" }, _attrs))}><div class="container mx-auto max-w-3xl px-4"><div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-3xl font-black tracking-tight">Mes agences</h1><p class="mt-1 text-muted-foreground"> Agences de tourisme li\xE9es \xE0 votre compte. Le public les voit aussi sur la page Tourisme. </p></div>`);
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
                  _push3(` Voir toutes les agences `);
                } else {
                  return [
                    createVNode(unref(Compass), { class: "mr-2 h-4 w-4" }),
                    createTextVNode(" Voir toutes les agences ")
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
                  createTextVNode(" Voir toutes les agences ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (pendingOwner.value) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(2, (n) => {
          _push(`<div class="h-28 animate-pulse rounded-2xl bg-muted"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!ownerRows.value.length) {
        _push(`<div class="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground"> Aucune agence n\u2019est encore associ\xE9e \xE0 votre compte. </div>`);
      } else {
        _push(`<ul class="space-y-4"><!--[-->`);
        ssrRenderList(ownerRows.value, (row) => {
          _push(`<li class="flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row"><img${ssrRenderAttr("src", row.agence.logo)} alt="" class="h-32 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"><div class="min-w-0 flex-1"><h2 class="text-xl font-black">${ssrInterpolate(row.agence.name)}</h2><p class="mt-1 text-sm text-muted-foreground">${ssrInterpolate(row.agence.description)}</p><p class="mt-2 inline-flex items-start gap-2 text-sm font-semibold text-muted-foreground">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "mt-0.5 h-4 w-4 shrink-0 text-primary" }, null, _parent));
          _push(` ${ssrInterpolate(row.agence.address)}</p>`);
          if (row.agence.phone1) {
            _push(`<p class="mt-1 flex items-center gap-2 text-sm font-semibold">`);
            _push(ssrRenderComponent(unref(Phone), { class: "h-4 w-4 text-primary" }, null, _parent));
            _push(` ${ssrInterpolate(row.agence.phone1)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/agences/${row.agence.id}`,
            class: "mt-3 inline-block text-sm font-bold text-primary hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Voir la fiche publique `);
              } else {
                return [
                  createTextVNode(" Voir la fiche publique ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/agences.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=agences-HCVOa-E-.mjs.map
