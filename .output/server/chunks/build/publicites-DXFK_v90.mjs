import { defineComponent, ref, computed, mergeProps, unref, withCtx, openBlock, createBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
import { Loader2, Megaphone, ImagePlus, Power } from 'lucide-vue-next';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { m as useAuthStore, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "publicites",
  __ssrInlineRender: true,
  setup(__props) {
    var _a, _b;
    const auth = useAuthStore();
    const config = useRuntimeConfig();
    const ads = ref([]);
    const clients = ref([]);
    const loading = ref(true);
    const saving = ref(false);
    const togglingId = ref(null);
    const userId = ref((_b = (_a = auth.user) == null ? void 0 : _a.userId) != null ? _b : null);
    const clientQuery = ref("");
    const title = ref("");
    const description = ref("");
    const imageDataUrl = ref("");
    const imageName = ref("");
    const filteredClients = computed(() => {
      const query = clientQuery.value.trim().toLowerCase();
      const list = query ? clients.value.filter((client) => client.label.toLowerCase().includes(query)) : clients.value;
      const visible = list.slice(0, 40);
      const selected = clients.value.find((client) => client.userId === userId.value);
      if (selected && !visible.some((client) => client.userId === selected.userId)) {
        visible.unshift(selected);
      }
      return visible;
    });
    const activeCount = computed(() => ads.value.filter((ad) => ad.isActive).length);
    async function toggle(ad) {
      if (!auth.token || ad.id == null) return;
      togglingId.value = ad.id;
      try {
        await $fetch(joinApi(config.public.apiBase, `${ApiEndpoints.updateActiveAds}${ad.id}`), {
          method: "PUT",
          headers: { Authorization: `Bearer ${auth.token}` },
          body: !ad.isActive
        });
        ad.isActive = !ad.isActive;
        toast.success(ad.isActive ? "Publicit\xE9 en ligne." : "Publicit\xE9 retir\xE9e.");
      } catch {
        toast.error("Impossible de changer le statut.");
      } finally {
        togglingId.value = null;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-xs font-bold uppercase tracking-[0.18em] text-[#1976D2]">Administration</p><h1 class="text-3xl font-black tracking-tight text-slate-900">Publicit\xE9</h1><p class="mt-2 max-w-2xl text-sm text-slate-500"> Publiez une annonce pour un client. Elle s\u2019affiche dans Offres du moment sur l\u2019application mobile et sur le site. </p></div><div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><span class="font-black text-slate-900">${ssrInterpolate(activeCount.value)}</span><span class="text-slate-500"> en ligne</span></div></div><form class="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]"><div class="space-y-4"><div class="space-y-2"><label class="text-sm font-semibold text-slate-700">Client</label><input${ssrRenderAttr("value", clientQuery.value)} type="search" placeholder="Rechercher un nom, un email ou un t\xE9l\xE9phone" class="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"><select class="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"><!--[-->`);
      ssrRenderList(filteredClients.value, (client) => {
        _push(`<option${ssrRenderAttr("value", client.userId)}${ssrIncludeBooleanAttr(Array.isArray(userId.value) ? ssrLooseContain(userId.value, client.userId) : ssrLooseEqual(userId.value, client.userId)) ? " selected" : ""}>${ssrInterpolate(client.label)}</option>`);
      });
      _push(`<!--]--></select></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-700">Titre</label><input${ssrRenderAttr("value", title.value)} maxlength="120" placeholder="Offre du client" class="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]"></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-700">Description</label><textarea rows="4" maxlength="400" placeholder="Le message qui accompagne l\u2019image" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1976D2]">${ssrInterpolate(description.value)}</textarea></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        type: "submit",
        class: "h-11 rounded-xl px-5 font-bold",
        disabled: saving.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (saving.value) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(Megaphone), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
            }
            _push2(` Publier `);
          } else {
            return [
              saving.value ? (openBlock(), createBlock(unref(Loader2), {
                key: 0,
                class: "mr-2 h-4 w-4 animate-spin"
              })) : (openBlock(), createBlock(unref(Megaphone), {
                key: 1,
                class: "mr-2 h-4 w-4"
              })),
              createTextVNode(" Publier ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><label class="flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center">`);
      if (imageDataUrl.value) {
        _push(`<img${ssrRenderAttr("src", imageDataUrl.value)} alt="" class="h-full max-h-80 w-full object-cover">`);
      } else {
        _push(`<div class="space-y-2 px-6 py-10 text-slate-500">`);
        _push(ssrRenderComponent(unref(ImagePlus), { class: "mx-auto h-8 w-8 text-[#1976D2]" }, null, _parent));
        _push(`<p class="text-sm font-semibold text-slate-800">Image de la publicit\xE9</p><p class="text-xs">JPG ou PNG, 4 Mo maximum. Ce champ est d\xE9j\xE0 pr\xE9vu par l\u2019API.</p></div>`);
      }
      _push(`<input type="file" accept="image/*" class="hidden">`);
      if (imageName.value) {
        _push(`<p class="w-full truncate bg-white/90 px-3 py-2 text-xs text-slate-500">${ssrInterpolate(imageName.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label></form>`);
      if (loading.value) {
        _push(`<div class="flex items-center gap-2 py-10 text-sm text-slate-500">`);
        _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
        _push(` Chargement des publicit\xE9s\u2026 </div>`);
      } else if (!ads.value.length) {
        _push(`<div class="rounded-3xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500"> Aucune publicit\xE9 pour le moment. </div>`);
      } else {
        _push(`<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><!--[-->`);
        ssrRenderList(ads.value, (ad) => {
          var _a2;
          _push(`<article class="overflow-hidden rounded-3xl border border-slate-200 bg-white"><div class="h-40 bg-slate-100">`);
          if (ad.imageUrl) {
            _push(`<img${ssrRenderAttr("src", ad.imageUrl)}${ssrRenderAttr("alt", ad.title)} class="h-full w-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="space-y-3 p-4"><div class="flex items-start justify-between gap-3"><div><h2 class="line-clamp-1 font-extrabold text-slate-900">${ssrInterpolate(ad.title)}</h2><p class="text-xs text-slate-400">${ssrInterpolate(ad.createdAt || "Client " + ((_a2 = ad.userId) != null ? _a2 : "\u2014"))}</p></div><span class="${ssrRenderClass([ad.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500", "rounded-full px-2 py-1 text-[10px] font-black"])}">${ssrInterpolate(ad.isActive ? "En ligne" : "Retir\xE9e")}</span></div><p class="line-clamp-2 text-sm text-slate-500">${ssrInterpolate(ad.description)}</p>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            type: "button",
            variant: "outline",
            class: "h-9 rounded-xl",
            disabled: togglingId.value === ad.id || ad.id == null,
            onClick: ($event) => toggle(ad)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (togglingId.value === ad.id) {
                  _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 h-4 w-4 animate-spin" }, null, _parent2, _scopeId));
                } else {
                  _push2(ssrRenderComponent(unref(Power), { class: "mr-2 h-4 w-4" }, null, _parent2, _scopeId));
                }
                _push2(` ${ssrInterpolate(ad.isActive ? "Retirer" : "Remettre en ligne")}`);
              } else {
                return [
                  togglingId.value === ad.id ? (openBlock(), createBlock(unref(Loader2), {
                    key: 0,
                    class: "mr-2 h-4 w-4 animate-spin"
                  })) : (openBlock(), createBlock(unref(Power), {
                    key: 1,
                    class: "mr-2 h-4 w-4"
                  })),
                  createTextVNode(" " + toDisplayString(ad.isActive ? "Retirer" : "Remettre en ligne"), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/publicites.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=publicites-DXFK_v90.mjs.map
