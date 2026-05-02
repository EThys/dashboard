import { _ as __nuxt_component_0 } from './nuxt-link-DJ2lb7hQ.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, Fragment, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { ArrowLeft, MapPin, Heart, Share2, Info, Phone } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _export_sfc, m as useRoute, a as useRouter, h as useSeoMeta, j as joinApi, A as ApiEndpoints, c as useRuntimeConfig } from './server.mjs';
import { e as encodeId } from './urlObfuscator-B34PnJ0V.mjs';
import { D as DetailShimmer } from './DetailShimmer-rdBM6wYW.mjs';
import { u as useFetch } from './fetch-DhOZ-2Hb.mjs';
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
import '@vue/shared';
import './asyncData-cMiNwecB.mjs';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const config = useRuntimeConfig();
    const { data: payload, pending: isLoading, error } = useFetch(
      () => joinApi(
        config.public.apiBase,
        `${ApiEndpoints.agences}/${String(route.params.id)}`
      ),
      "$zCC86Ad86r"
      /* nuxt-injected */
    );
    const agence = computed(() => {
      var _a;
      const p = payload.value;
      if (!p) return null;
      if ("data" in p && Array.isArray(p.data) && p.data.length > 0) {
        return p.data[0].agence;
      }
      if ("data" in p && ((_a = p.data) == null ? void 0 : _a.agence)) return p.data.agence;
      if ("agence" in p && p.agence) return p.agence;
      return null;
    });
    const sites = computed(() => {
      var _a;
      const p = payload.value;
      if (!p) return [];
      if ("data" in p && Array.isArray(p.data) && p.data.length > 0) {
        return p.data[0].site || [];
      }
      if ("data" in p && Array.isArray((_a = p.data) == null ? void 0 : _a.site)) return p.data.site;
      if ("site" in p && Array.isArray(p.site)) return p.site;
      return [];
    });
    useSeoMeta({
      title: () => {
        var _a;
        return ((_a = agence.value) == null ? void 0 : _a.name) || "Agence";
      },
      description: () => {
        var _a;
        return ((_a = agence.value) == null ? void 0 : _a.description) || "Agence partenaire CasaNayo";
      }
    });
    const goBack = () => router.back();
    const isFavorite = ref(false);
    const toggleFavorite = () => isFavorite.value = !isFavorite.value;
    const shareAgency = async () => {
      var _a;
      const title = ((_a = agence.value) == null ? void 0 : _a.name) || "";
      const url = (void 0).location.href;
      const shareText = `D\xE9couvrez l'agence ${title} sur CasaNayo. ${url}`;
      if ((void 0).share) {
        try {
          await (void 0).share({ title, text: shareText, url });
        } catch {
        }
      } else {
        (void 0).clipboard.writeText(shareText);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background" }, _attrs))} data-v-655bb94b>`);
      if (unref(isLoading) && !unref(agence)) {
        _push(`<div data-v-655bb94b>`);
        _push(ssrRenderComponent(DetailShimmer, { type: "property" }, null, _parent));
        _push(`</div>`);
      } else if (unref(agence)) {
        _push(`<div class="min-h-screen" data-v-655bb94b><div class="relative h-[45vh] md:h-[55vh] group bg-slate-900 border-b border-white/10 overflow-hidden" data-v-655bb94b><button class="absolute top-4 md:top-8 left-4 md:left-8 z-30 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-all" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(ArrowLeft), { class: "h-6 w-6" }, null, _parent));
        _push(`</button><div class="absolute inset-0 z-0 bg-slate-800" data-v-655bb94b><img${ssrRenderAttr("src", unref(agence).logo)} class="w-full h-full object-cover opacity-30 blur-sm scale-110" data-v-655bb94b><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" data-v-655bb94b></div></div><div class="absolute bottom-0 left-0 right-0 z-20 pb-12" data-v-655bb94b><div class="container mx-auto px-4 md:px-8" data-v-655bb94b><div class="flex flex-col md:flex-row items-center md:items-end gap-8" data-v-655bb94b><div class="relative group" data-v-655bb94b><div class="size-32 md:size-44 rounded-[2.5rem] bg-white p-2 shadow-2xl border-4 border-white/10 overflow-hidden transform md:-mb-10 transition-transform hover:scale-105" data-v-655bb94b><img${ssrRenderAttr("src", unref(agence).logo)}${ssrRenderAttr("alt", unref(agence).name)} class="w-full h-full object-cover rounded-[2rem]" data-v-655bb94b></div></div><div class="flex-1 space-y-3 text-center md:text-left" data-v-655bb94b><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black tracking-[3px] uppercase" data-v-655bb94b> Agence Partenaire </div><h1 class="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl uppercase" data-v-655bb94b>${ssrInterpolate(unref(agence).name)}</h1><div class="flex flex-wrap justify-center md:justify-start items-center gap-4 text-white/70 text-sm font-bold" data-v-655bb94b><span class="flex items-center gap-1.5" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "size-4 text-primary" }, null, _parent));
        _push(` ${ssrInterpolate(unref(agence).address)}</span></div></div><div class="flex gap-3" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: toggleFavorite,
          size: "icon",
          variant: "secondary",
          class: "rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Heart), {
                class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Heart), {
                  class: ["h-5 w-5", { "fill-red-500 text-red-500": unref(isFavorite) }]
                }, null, 8, ["class"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: shareAgency,
          size: "icon",
          variant: "secondary",
          class: "rounded-2xl h-12 w-12 bg-white/5 hover:bg-white/10 text-white border-white/10 backdrop-blur-xl"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Share2), { class: "h-5 w-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Share2), { class: "h-5 w-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div><div class="container mx-auto px-4 md:px-8 pt-20 pb-24 max-w-7xl" data-v-655bb94b><div class="grid grid-cols-1 lg:grid-cols-3 gap-12" data-v-655bb94b><div class="lg:col-span-2 space-y-12" data-v-655bb94b><div class="bg-white rounded-[2.5rem] border border-border/40 shadow-sm p-8 md:p-10 relative overflow-hidden group" data-v-655bb94b><div class="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" data-v-655bb94b></div><h2 class="text-3xl font-black mb-6 flex items-center gap-4 text-slate-800" data-v-655bb94b><div class="size-10 rounded-xl bg-primary flex items-center justify-center" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(Info), { class: "h-6 w-6 text-white" }, null, _parent));
        _push(`</div> \xC0 propos de l&#39;agence </h2><p class="text-slate-600 text-xl leading-relaxed font-medium" data-v-655bb94b>${ssrInterpolate(unref(agence).description)}</p></div>`);
        if (unref(sites).length) {
          _push(`<div class="space-y-8" data-v-655bb94b><div class="flex items-end justify-between px-2" data-v-655bb94b><h2 class="text-3xl font-black text-slate-800" data-v-655bb94b>Nos Offres &amp; S\xE9jours</h2><span class="text-sm font-bold text-muted-foreground bg-muted px-4 py-1.5 rounded-full" data-v-655bb94b>${ssrInterpolate(unref(sites).length)} s\xE9jours disponibles</span></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8" data-v-655bb94b><!--[-->`);
          ssrRenderList(unref(sites), (s, idx) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: idx,
              to: `/vacances/${unref(encodeId)(s.vacance.id)}`,
              class: "group bg-white rounded-[2.5rem] border border-border/40 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-primary/20 flex flex-col"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  if (s && typeof s === "object" && "vacance" in s && s.vacance) {
                    _push2(`<!--[--><div class="h-56 relative overflow-hidden bg-muted" data-v-655bb94b${_scopeId}>`);
                    if (Array.isArray(s.image) && s.image[0]) {
                      _push2(`<img${ssrRenderAttr("src", s.image[0].path)} alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-v-655bb94b${_scopeId}>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" data-v-655bb94b${_scopeId}></div><div class="absolute bottom-4 left-4" data-v-655bb94b${_scopeId}><div class="bg-primary px-3 py-1 rounded-lg text-white text-[10px] font-black tracking-widest uppercase" data-v-655bb94b${_scopeId}>${ssrInterpolate(s.vacance.cityValue)}</div></div></div><div class="p-6 flex-1 flex flex-col gap-4" data-v-655bb94b${_scopeId}><div class="flex-1 space-y-2" data-v-655bb94b${_scopeId}><h3 class="text-xl font-black leading-tight text-slate-800 group-hover:text-primary transition-colors uppercase" data-v-655bb94b${_scopeId}>${ssrInterpolate(s.vacance.title)}</h3><p class="line-clamp-2 text-sm text-slate-500 font-medium" data-v-655bb94b${_scopeId}>${ssrInterpolate(s.vacance.description)}</p></div><div class="flex items-center justify-between pt-4 border-t border-slate-50" data-v-655bb94b${_scopeId}><div data-v-655bb94b${_scopeId}><p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5" data-v-655bb94b${_scopeId}>\xC0 partir de</p><p class="text-2xl font-black text-primary" data-v-655bb94b${_scopeId}>${ssrInterpolate(s.vacance.price)}<span class="text-base ml-0.5" data-v-655bb94b${_scopeId}>$</span><span class="text-[10px] font-bold text-slate-400 ml-1 uppercase" data-v-655bb94b${_scopeId}>/ ${ssrInterpolate(s.vacance.priceCombo)}</span></p></div><div class="size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400" data-v-655bb94b${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(ArrowLeft), { class: "size-5 rotate-180" }, null, _parent2, _scopeId));
                    _push2(`</div></div></div><!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                } else {
                  return [
                    s && typeof s === "object" && "vacance" in s && s.vacance ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createVNode("div", { class: "h-56 relative overflow-hidden bg-muted" }, [
                        Array.isArray(s.image) && s.image[0] ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: s.image[0].path,
                          alt: "",
                          class: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        }, null, 8, ["src"])) : createCommentVNode("", true),
                        createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
                        createVNode("div", { class: "absolute bottom-4 left-4" }, [
                          createVNode("div", { class: "bg-primary px-3 py-1 rounded-lg text-white text-[10px] font-black tracking-widest uppercase" }, toDisplayString(s.vacance.cityValue), 1)
                        ])
                      ]),
                      createVNode("div", { class: "p-6 flex-1 flex flex-col gap-4" }, [
                        createVNode("div", { class: "flex-1 space-y-2" }, [
                          createVNode("h3", { class: "text-xl font-black leading-tight text-slate-800 group-hover:text-primary transition-colors uppercase" }, toDisplayString(s.vacance.title), 1),
                          createVNode("p", { class: "line-clamp-2 text-sm text-slate-500 font-medium" }, toDisplayString(s.vacance.description), 1)
                        ]),
                        createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-slate-50" }, [
                          createVNode("div", null, [
                            createVNode("p", { class: "text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5" }, "\xC0 partir de"),
                            createVNode("p", { class: "text-2xl font-black text-primary" }, [
                              createTextVNode(toDisplayString(s.vacance.price), 1),
                              createVNode("span", { class: "text-base ml-0.5" }, "$"),
                              createVNode("span", { class: "text-[10px] font-bold text-slate-400 ml-1 uppercase" }, "/ " + toDisplayString(s.vacance.priceCombo), 1)
                            ])
                          ]),
                          createVNode("div", { class: "size-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-400" }, [
                            createVNode(unref(ArrowLeft), { class: "size-5 rotate-180" })
                          ])
                        ])
                      ])
                    ], 64)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-655bb94b><div class="sticky top-32 space-y-6" data-v-655bb94b><div class="bg-white rounded-2xl p-8 border border-slate-100 shadow-xl text-slate-800 relative overflow-hidden group" data-v-655bb94b><div class="absolute -right-8 -top-8 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" data-v-655bb94b></div><h3 class="text-2xl font-black mb-8 relative z-10" data-v-655bb94b>Contact Direct</h3><div class="space-y-6 relative z-10" data-v-655bb94b>`);
        if (unref(agence).phone1) {
          _push(`<div class="flex items-center gap-4 group/item" data-v-655bb94b><div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors" data-v-655bb94b>`);
          _push(ssrRenderComponent(unref(Phone), { class: "size-6 text-primary group-hover/item:text-white" }, null, _parent));
          _push(`</div><div class="flex-1" data-v-655bb94b><p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5" data-v-655bb94b>T\xE9l\xE9phone Principal</p><a${ssrRenderAttr("href", `tel:${unref(agence).phone1}`)} class="font-bold text-lg hover:text-primary transition-colors" data-v-655bb94b>${ssrInterpolate(unref(agence).phone1)}</a></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(agence).phone2) {
          _push(`<div class="flex items-center gap-4 group/item" data-v-655bb94b><div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors" data-v-655bb94b>`);
          _push(ssrRenderComponent(unref(Phone), { class: "size-6 text-primary group-hover/item:text-white" }, null, _parent));
          _push(`</div><div class="flex-1" data-v-655bb94b><p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5" data-v-655bb94b>T\xE9l\xE9phone Secondaire</p><a${ssrRenderAttr("href", `tel:${unref(agence).phone2}`)} class="font-bold text-lg hover:text-primary transition-colors" data-v-655bb94b>${ssrInterpolate(unref(agence).phone2)}</a></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-start gap-4 group/item" data-v-655bb94b><div class="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-primary transition-colors" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(MapPin), { class: "size-6 text-primary group-hover/item:text-white" }, null, _parent));
        _push(`</div><div class="flex-1" data-v-655bb94b><p class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5" data-v-655bb94b>Localisation</p><p class="font-bold text-sm leading-relaxed text-slate-600" data-v-655bb94b>${ssrInterpolate(unref(agence).address)}</p></div></div></div><div class="mt-10 pt-8 border-t border-slate-50 relative z-10" data-v-655bb94b>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), { class: "w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Contacter l&#39;agence `);
            } else {
              return [
                createTextVNode(" Contacter l'agence ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div></div></div>`);
      } else if (unref(error)) {
        _push(`<div class="min-h-screen flex items-center justify-center px-4 bg-slate-50" data-v-655bb94b><div class="max-w-md w-full p-12 bg-white rounded-[3rem] border border-border shadow-2xl text-center" data-v-655bb94b><h2 class="text-3xl font-black mb-3 text-slate-800" data-v-655bb94b>Oups !</h2><p class="text-slate-500 mb-8 font-medium leading-relaxed" data-v-655bb94b>Impossible de charger les informations de cette agence pour le moment. Veuillez r\xE9essayer plus tard.</p>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          onClick: goBack,
          class: "w-full h-14 rounded-2xl font-black"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retourner \xE0 la liste`);
            } else {
              return [
                createTextVNode("Retourner \xE0 la liste")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agences/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-655bb94b"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-D0Wbrdei.mjs.map
