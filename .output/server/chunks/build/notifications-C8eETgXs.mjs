import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { defineComponent, computed, ref, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';
import { ArrowLeft, Bell, Inbox, Circle, Trash2, ChevronRight, Loader2, CreditCard, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Badge-CZaU8sYj.mjs';
import { u as useNotificationStore } from './notifications-DclMFsCw.mjs';
import { t as toast } from './index-DJGQOf1Z.mjs';
import { _ as _export_sfc, u as useHead } from './server.mjs';
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
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import '@tanstack/vue-query';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notifications",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Mes Notifications | CasaNayo"
    });
    const notifStore = useNotificationStore();
    const loading = computed(() => notifStore.loading);
    const notifications2 = computed(() => notifStore.notifications);
    const unreadCount = computed(() => notifStore.unreadCount);
    const hasMore = computed(() => notifStore.hasMore);
    const loadingMore = ref(false);
    function getIcon(type, tag) {
      const t = type.toUpperCase();
      const g = (tag || "").toUpperCase();
      if (g.includes("PAYMENT") || g.includes("SUBSCRIPTION")) return CreditCard;
      if (g.includes("RESERVATION") || g.includes("APPOINTMENT")) return Calendar;
      if (t === "SUCCESS") return CheckCircle2;
      if (t === "ERROR" || t === "DANGER") return XCircle;
      if (t === "WARNING") return Clock;
      return Bell;
    }
    function getIconColor(type, tag) {
      const t = type.toUpperCase();
      const g = (tag || "").toUpperCase();
      if (g.includes("CANCELED") || t === "ERROR") return "text-red-500 bg-red-50 border-red-100";
      if (g.includes("SUCCESS") || t === "SUCCESS") return "text-emerald-500 bg-emerald-50 border-emerald-100";
      if (g.includes("PAYMENT") || g.includes("SUBSCRIPTION")) return "text-blue-500 bg-blue-50 border-blue-100";
      if (t === "WARNING") return "text-amber-500 bg-amber-50 border-amber-100";
      return "text-slate-500 bg-slate-50 border-slate-100";
    }
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const now = /* @__PURE__ */ new Date();
      const diff = now.getTime() - date.getTime();
      if (diff < 3e4) return "\xC0 l'instant";
      if (diff < 6e4) return "Il y a moins d'une minute";
      const minutes = Math.floor(diff / 6e4);
      if (minutes < 60) return `Il y a ${minutes} min`;
      const hours = Math.floor(diff / 36e5);
      if (hours < 24) return `Il y a ${hours} h`;
      const days = Math.floor(diff / 864e5);
      if (days === 1) return `Hier`;
      if (days < 7) return `Il y a ${days} j`;
      const weeks = Math.floor(days / 7);
      if (weeks < 4) return `Il y a ${weeks} sem`;
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    }
    async function handleMarkAllRead() {
      await notifStore.markAllRead();
      toast.success("Toutes les notifications ont \xE9t\xE9 marqu\xE9es comme lues");
    }
    async function handleLoadMore() {
      loadingMore.value = true;
      await notifStore.fetchNotifications();
      loadingMore.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#F8FAFC] pb-20" }, _attrs))} data-v-cf5e388b><header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md" data-v-cf5e388b><div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6" data-v-cf5e388b><div class="flex items-center gap-4" data-v-cf5e388b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
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
      _push(`<h1 class="text-xl font-black tracking-tight text-slate-900" data-v-cf5e388b>Notifications</h1></div>`);
      if (unref(unreadCount) > 0) {
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "ghost",
          size: "sm",
          class: "text-xs font-bold text-[#1976D2] hover:bg-blue-50",
          onClick: handleMarkAllRead
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Tout marquer comme lu `);
            } else {
              return [
                createTextVNode(" Tout marquer comme lu ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><main class="mx-auto mt-8 max-w-4xl px-4 sm:px-6" data-v-cf5e388b>`);
      if (unref(loading) && unref(notifications2).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-20" data-v-cf5e388b><div class="relative mb-6" data-v-cf5e388b><div class="absolute inset-0 animate-ping rounded-full bg-blue-100 opacity-75" data-v-cf5e388b></div><div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-blue-50" data-v-cf5e388b>`);
        _push(ssrRenderComponent(unref(Bell), { class: "size-8 animate-bounce text-[#1976D2]" }, null, _parent));
        _push(`</div></div><p class="font-bold text-slate-600" data-v-cf5e388b>Recherche de nouvelles notifications...</p></div>`);
      } else if (unref(notifications2).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-24 text-center" data-v-cf5e388b><div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50" data-v-cf5e388b>`);
        _push(ssrRenderComponent(unref(Inbox), { class: "size-10 text-slate-300" }, null, _parent));
        _push(`</div><h2 class="text-xl font-bold text-slate-900" data-v-cf5e388b>Votre bo\xEEte est vide</h2><p class="mx-auto mt-2 max-w-xs text-sm text-slate-500" data-v-cf5e388b> Vous n&#39;avez pas encore de notifications. Les activit\xE9s importantes s&#39;afficheront ici. </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/properties",
          class: "mt-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1), { class: "rounded-xl bg-[#1976D2] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Explorer les propri\xE9t\xE9s `);
                  } else {
                    return [
                      createTextVNode(" Explorer les propri\xE9t\xE9s ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1), { class: "rounded-xl bg-[#1976D2] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700" }, {
                  default: withCtx(() => [
                    createTextVNode(" Explorer les propri\xE9t\xE9s ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-3" data-v-cf5e388b>`);
        if (unref(unreadCount) > 0) {
          _push(`<div class="mb-4 px-2" data-v-cf5e388b>`);
          _push(ssrRenderComponent(unref(_sfc_main$2), {
            variant: "secondary",
            class: "bg-blue-50 font-bold text-[#1976D2]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(unreadCount))} nouvelle${ssrInterpolate(unref(unreadCount) > 1 ? "s" : "")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(unreadCount)) + " nouvelle" + toDisplayString(unref(unreadCount) > 1 ? "s" : ""), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(notifications2), (notif) => {
          _push(`<div class="${ssrRenderClass([{ "bg-blue-50/30 border-blue-100/50 shadow-sm": !notif.read }, "group relative flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5"])}" data-v-cf5e388b>`);
          if (!notif.read) {
            _push(`<div class="absolute left-2 top-1/2 -translate-y-1/2" data-v-cf5e388b>`);
            _push(ssrRenderComponent(unref(Circle), { class: "size-2 fill-[#1976D2] text-[#1976D2]" }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="${ssrRenderClass([getIconColor(notif.type, notif.tag), "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-110"])}" data-v-cf5e388b>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(getIcon(notif.type, notif.tag)), { class: "size-6" }, null), _parent);
          _push(`</div><div class="flex-1 min-w-0" data-v-cf5e388b><div class="flex items-start justify-between gap-2" data-v-cf5e388b><h3 class="${ssrRenderClass([{ "text-[#1976D2]": !notif.read }, "text-base font-extrabold text-slate-900 leading-tight"])}" data-v-cf5e388b>${ssrInterpolate(notif.title)}</h3><span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap" data-v-cf5e388b>${ssrInterpolate(formatDate(notif.createdAt))}</span></div><p class="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-2" data-v-cf5e388b>${ssrInterpolate(notif.content || notif.description)}</p><div class="mt-4 flex items-center gap-3" data-v-cf5e388b>`);
          if (notif.tag) {
            _push(ssrRenderComponent(unref(_sfc_main$2), {
              variant: "outline",
              class: "text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(notif.tag)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(notif.tag), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="ml-auto opacity-0 transition-opacity group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500" data-v-cf5e388b>`);
          _push(ssrRenderComponent(unref(Trash2), { class: "size-4" }, null, _parent));
          _push(`</button></div></div><div class="flex items-center self-center pl-2" data-v-cf5e388b>`);
          _push(ssrRenderComponent(unref(ChevronRight), { class: "size-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#1976D2]" }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(hasMore) && unref(notifications2).length > 0) {
        _push(`<div class="mt-10 flex justify-center pb-10" data-v-cf5e388b>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          class: "rounded-2xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all hover:px-8",
          disabled: unref(loadingMore),
          onClick: handleLoadMore
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(loadingMore)) {
                _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` Afficher plus de notifications `);
            } else {
              return [
                unref(loadingMore) ? (openBlock(), createBlock(unref(Loader2), {
                  key: 0,
                  class: "mr-2 size-4 animate-spin"
                })) : createCommentVNode("", true),
                createTextVNode(" Afficher plus de notifications ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else if (unref(notifications2).length > 0) {
        _push(`<div class="mt-10 pb-10 text-center" data-v-cf5e388b><p class="text-xs font-bold uppercase tracking-widest text-slate-400" data-v-cf5e388b>Fin des notifications</p></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/compte/notifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const notifications = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cf5e388b"]]);

export { notifications as default };
//# sourceMappingURL=notifications-C8eETgXs.mjs.map
