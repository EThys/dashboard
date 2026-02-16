import { _ as __nuxt_component_0 } from './nuxt-link-CJda3bhc.mjs';
import { defineComponent, ref, watch, computed, mergeProps, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, unref, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderVNode, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { LayoutDashboard, FileText, Calendar, Users, Settings, LogOut, Menu, Search, Bell, AlertOctagon } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Button-B_RLy27J.mjs';
import { _ as _sfc_main$2 } from './Sheet-vFmJ4Ba5.mjs';
import { f as useRoute, a as useRouter, e as useAuthStore } from './server.mjs';
import { onClickOutside } from '@vueuse/core';
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
import 'radix-vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';
import '@tanstack/vue-query';
import 'vue-sonner';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const auth = useAuthStore();
    const isMobileMenuOpen = ref(false);
    const openDropdown = ref("");
    const isUserMenuOpen = ref(false);
    const sidebarRef = ref(null);
    const userMenuRef = ref(null);
    const showLogoutModal = ref(false);
    const mainContentRef = ref(null);
    watch(() => route.path, () => {
      if (mainContentRef.value) {
        mainContentRef.value.scrollTop = 0;
      }
    });
    const sidebarItems = [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      {
        name: "Publications",
        icon: FileText,
        children: [
          { name: "Propri\xE9t\xE9s", path: "/dashboard/publications?tab=properties" },
          { name: "Services", path: "/dashboard/publications?tab=services" }
        ]
      },
      { name: "Mes R\xE9servations", path: "/dashboard/my-reservations", icon: Calendar },
      { name: "Utilisateurs", path: "/dashboard/users", icon: Users },
      { name: "Param\xE8tres", path: "/dashboard/settings", icon: Settings }
    ];
    onClickOutside(sidebarRef, () => {
      openDropdown.value = "";
    });
    onClickOutside(userMenuRef, () => {
      isUserMenuOpen.value = false;
    });
    function isItemActive(path) {
      if (path === "/dashboard" && route.path === "/dashboard") return true;
      if (path !== "/dashboard" && route.path.startsWith(path)) return true;
      return false;
    }
    const currentTime = ref("");
    const userProfile = computed(() => {
      var _a, _b, _c, _d, _e;
      return {
        name: ((_a = auth.profile) == null ? void 0 : _a.fullName) || ((_b = auth.user) == null ? void 0 : _b.username) || "Utilisateur",
        role: ((_c = auth.user) == null ? void 0 : _c.premium) ? "Membre Premium" : "Administrateur",
        avatar: ((_d = auth.profile) == null ? void 0 : _d.images) || `https://ui-avatars.com/api/?name=${((_e = auth.user) == null ? void 0 : _e.username) || "U"}&background=0F172A&color=fff`
      };
    });
    const handleLogout = () => {
      auth.logout();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-screen bg-background font-sans overflow-hidden" }, _attrs))}><aside class="w-64 min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 border-r border-border shadow-xl hidden md:flex flex-col z-30 transition-all duration-300"><div class="p-6 flex items-center gap-3 border-b border-border h-20 bg-white/80 backdrop-blur-md shadow-sm cursor-pointer hover:bg-slate-50/80 transition-colors"><div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center shadow"><span class="text-primary font-black text-xl text-center flex items-center justify-center">C</span></div><div class="flex flex-col"><span class="font-bold text-lg tracking-tight leading-none">CasaNayo</span><span class="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Dashboard</span></div></div><nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2"><!--[-->`);
      ssrRenderList(sidebarItems, (item) => {
        _push(`<!--[-->`);
        if (item.children) {
          _push(`<div class="relative"><button class="${ssrRenderClass([openDropdown.value === item.name ? "bg-primary/10 text-primary ring-2 ring-primary/30" : "text-muted-foreground hover:bg-primary/5 hover:text-primary", "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-bold transition-all duration-200 group w-full text-left shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"])}"${ssrRenderAttr("aria-expanded", openDropdown.value === item.name)}>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
            class: ["size-5", openDropdown.value === item.name ? "text-primary" : "text-muted-foreground group-hover:text-primary"]
          }, null), _parent);
          _push(` ${ssrInterpolate(item.name)} <svg class="${ssrRenderClass(["ml-auto transition-transform", openDropdown.value === item.name ? "rotate-90" : ""])}" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>`);
          if (openDropdown.value === item.name) {
            _push(`<div class="ml-2 mt-1 space-y-1 bg-white/90 rounded-xl shadow-lg border border-border py-2 animate-in fade-in slide-in-from-left-2"><!--[-->`);
            ssrRenderList(item.children, (child) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: child.path,
                to: child.path,
                class: ["block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary", isItemActive(child.path) ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"],
                onClick: ($event) => openDropdown.value = ""
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(child.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(child.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: item.path,
            onClick: ($event) => openDropdown.value = "",
            class: [
              "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-bold transition-all duration-200 group relative shadow-sm hover:shadow-md",
              isItemActive(item.path) ? "bg-primary/10 text-primary ring-2 ring-primary/30" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isItemActive(item.path)) {
                  _push2(`<div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"${_scopeId}></div>`);
                } else {
                  _push2(`<!---->`);
                }
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                  class: ["size-5", isItemActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-primary"]
                }, null), _parent2, _scopeId);
                _push2(` ${ssrInterpolate(item.name)}`);
              } else {
                return [
                  isItemActive(item.path) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"
                  })) : createCommentVNode("", true),
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                    class: ["size-5", isItemActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-primary"]
                  }, null, 8, ["class"])),
                  createTextVNode(" " + toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></nav><div class="p-4 border-t border-border bg-muted/10 mt-auto">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        onClick: ($event) => showLogoutModal.value = true,
        variant: "ghost",
        class: "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LogOut), { class: "size-5" }, null, _parent2, _scopeId));
            _push2(` D\xE9connexion `);
          } else {
            return [
              createVNode(unref(LogOut), { class: "size-5" }),
              createTextVNode(" D\xE9connexion ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside><div class="flex-1 flex flex-col min-w-0 bg-muted/20"><header class="h-20 border-b border-border bg-card/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all"><div class="md:hidden flex items-center gap-3">`);
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        open: isMobileMenuOpen.value,
        "onUpdate:open": ($event) => isMobileMenuOpen.value = $event
      }, {
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col h-full"${_scopeId}><div class="flex items-center gap-3 mb-8"${_scopeId}><div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center"${_scopeId}><span class="text-primary font-black text-xl"${_scopeId}>C</span></div><span class="font-bold text-lg tracking-tight"${_scopeId}>CasaNayo</span></div><nav class="flex-1 space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(sidebarItems, (item) => {
              _push2(`<!--[-->`);
              if (!item.children && item.path) {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: item.path,
                  onClick: ($event) => isMobileMenuOpen.value = false,
                  class: [
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                    isItemActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  ]
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "size-5" }, null), _parent3, _scopeId2);
                      _push3(` ${ssrInterpolate(item.name)}`);
                    } else {
                      return [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "size-5" })),
                        createTextVNode(" " + toDisplayString(item.name), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></nav><div class="mt-auto pt-4 border-t border-border"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              onClick: handleLogout,
              variant: "ghost",
              class: "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(LogOut), { class: "size-5" }, null, _parent3, _scopeId2));
                  _push3(` D\xE9connexion `);
                } else {
                  return [
                    createVNode(unref(LogOut), { class: "size-5" }),
                    createTextVNode(" D\xE9connexion ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col h-full" }, [
                createVNode("div", { class: "flex items-center gap-3 mb-8" }, [
                  createVNode("div", { class: "size-10 rounded-xl bg-primary/10 flex items-center justify-center" }, [
                    createVNode("span", { class: "text-primary font-black text-xl" }, "C")
                  ]),
                  createVNode("span", { class: "font-bold text-lg tracking-tight" }, "CasaNayo")
                ]),
                createVNode("nav", { class: "flex-1 space-y-2" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(sidebarItems, (item) => {
                    return openBlock(), createBlock(Fragment, {
                      key: item.name
                    }, [
                      !item.children && item.path ? (openBlock(), createBlock(_component_NuxtLink, {
                        key: 0,
                        to: item.path,
                        onClick: ($event) => isMobileMenuOpen.value = false,
                        class: [
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                          isItemActive(item.path) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        ]
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "size-5" })),
                          createTextVNode(" " + toDisplayString(item.name), 1)
                        ]),
                        _: 2
                      }, 1032, ["to", "onClick", "class"])) : createCommentVNode("", true)
                    ], 64);
                  }), 64))
                ]),
                createVNode("div", { class: "mt-auto pt-4 border-t border-border" }, [
                  createVNode(unref(_sfc_main$1), {
                    onClick: handleLogout,
                    variant: "ghost",
                    class: "w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-12 rounded-xl font-bold"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(LogOut), { class: "size-5" }),
                      createTextVNode(" D\xE9connexion ")
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), {
              variant: "ghost",
              size: "icon",
              onClick: ($event) => isMobileMenuOpen.value = true
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Menu), { class: "size-6 text-muted-foreground" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Menu), { class: "size-6 text-muted-foreground" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), {
                variant: "ghost",
                size: "icon",
                onClick: ($event) => isMobileMenuOpen.value = true
              }, {
                default: withCtx(() => [
                  createVNode(unref(Menu), { class: "size-6 text-muted-foreground" })
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="font-bold text-lg">CasaNayo</span></div><div class="hidden md:flex items-center gap-4 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border/50">`);
      _push(ssrRenderComponent(unref(Search), { class: "size-4" }, null, _parent));
      _push(`<input type="text" placeholder="Rechercher..." class="bg-transparent border-none outline-none text-sm font-medium w-64 placeholder:text-muted-foreground/70"></div><div class="flex items-center gap-6 ml-auto"><div class="hidden lg:flex flex-col items-end mr-2"><span class="text-2xl font-black text-foreground leading-none tracking-tight">${ssrInterpolate(currentTime.value)}</span><span class="text-[10px] font-bold text-primary uppercase tracking-widest">${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { weekday: "long", month: "long", day: "numeric" }))}</span></div><div class="h-8 w-[1px] bg-border hidden lg:block"></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        variant: "ghost",
        size: "icon",
        class: "relative rounded-full hover:bg-muted"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Bell), { class: "size-5 text-muted-foreground" }, null, _parent2, _scopeId));
            _push2(`<span class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card"${_scopeId}></span>`);
          } else {
            return [
              createVNode(unref(Bell), { class: "size-5 text-muted-foreground" }),
              createVNode("span", { class: "absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative"><div class="flex items-center gap-3 pl-2 group cursor-pointer"><div class="flex flex-col items-end md:flex"><span class="text-sm font-bold text-foreground group-hover:text-primary transition-colors text-right">${ssrInterpolate(userProfile.value.name)}</span><span class="text-[10px] font-medium text-muted-foreground">${ssrInterpolate(userProfile.value.role)}</span></div><div class="size-10 rounded-full bg-primary/20 p-1 ring-2 ring-primary/20 ring-offset-2 ring-offset-card transition-all group-hover:ring-primary/50 overflow-hidden"><img${ssrRenderAttr("src", userProfile.value.avatar)} alt="Avatar" class="h-full w-full rounded-full object-cover"></div></div>`);
      if (isUserMenuOpen.value) {
        _push(`<div class="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"><button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors">`);
        _push(ssrRenderComponent(unref(Settings), { class: "size-4" }, null, _parent));
        _push(` Param\xE8tres </button><div class="h-[1px] bg-border my-1"></div><button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">`);
        _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
        _push(` Se d\xE9connecter </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth"><div class="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main></div>`);
      if (showLogoutModal.value) {
        _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"><div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"><div class="p-12 text-center"><div class="relative size-24 mx-auto mb-10"><div class="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div><div class="relative size-full rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center shadow-2xl shadow-red-500/40">`);
        _push(ssrRenderComponent(unref(AlertOctagon), { class: "size-12 text-white" }, null, _parent));
        _push(`</div></div><h3 class="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter italic">Quitter d\xE9j\xE0 ?</h3><p class="text-slate-500 dark:text-slate-400 font-bold text-base leading-relaxed mb-12"> Votre session CasaNayo est pr\xE9cieuse. Souhaitez-vous vraiment vous d\xE9connecter maintenant ? </p><div class="grid grid-cols-2 gap-4">`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          onClick: ($event) => showLogoutModal.value = false,
          class: "h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Rester `);
            } else {
              return [
                createTextVNode(" Rester ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "destructive",
          onClick: handleLogout,
          class: "h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all active:scale-95"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` D\xE9connexion `);
            } else {
              return [
                createTextVNode(" D\xE9connexion ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-DFrBl5kA.mjs.map
