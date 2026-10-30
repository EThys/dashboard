import { defineComponent, mergeProps, ref, computed, resolveComponent, withCtx, createVNode, unref, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link-kZaXe760.mjs';
import { l as useAuthStore, o as _imports_0 } from './server.mjs';
import { _ as _imports_1, a as _imports_2 } from './playStore-CtjIKwbQ.mjs';
import { ChevronDown, Palmtree, Building2, LayoutDashboard, Bell, Calendar, Wrench, Compass, CreditCard, Receipt, User, LogOut, Menu, X, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-vue-next';
import { _ as _sfc_main$4 } from './Button-B_RLy27J.mjs';
import { u as useNotificationStore } from './notifications-CjQTCppy.mjs';
import { onClickOutside } from '@vueuse/core';
import { useRoute } from 'vue-router';
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
import '@tanstack/vue-query';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';

const navPillBase = "relative px-4 py-2.5 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 border border-transparent";
const navPillIdle = "text-stone-600 hover:text-stone-900 hover:bg-stone-100/90 hover:border-stone-200/60";
const navPillActive = "text-stone-50 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 border-amber-900/20 shadow-md shadow-stone-900/20 ring-1 ring-white/10";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Navbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isMobileMenuOpen = ref(false);
    const isDropdownOpen = ref(false);
    const dropdownRef = ref(null);
    const discoverNavRef = ref(null);
    const navDiscoverOpen = ref(false);
    const mobileDiscoverOpen = ref(false);
    const auth = useAuthStore();
    const notifStore = useNotificationStore();
    const unreadCount = computed(() => notifStore.unreadCount);
    const handleLogoClick = (e) => {
      if (route.path === "/") {
        e.preventDefault();
        (void 0).scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    onClickOutside(dropdownRef, () => isDropdownOpen.value = false);
    onClickOutside(discoverNavRef, () => navDiscoverOpen.value = false);
    function isNavActive(path) {
      if (path === "/") return route.path === "/";
      return route.path === path || route.path.startsWith(`${path}/`);
    }
    const isDiscoverActive = computed(
      () => {
        var _a;
        return route.path.startsWith("/agences") || route.path.startsWith("/properties") && String((_a = route.query.type) != null ? _a : "") === "H\xF4tel";
      }
    );
    const isAuthenticated = computed(() => auth.isAuthenticated);
    const isAdmin = computed(() => auth.isAdmin);
    const isGerant = computed(() => auth.isGerant);
    const userProfile = computed(() => auth.profile);
    const username = computed(() => {
      var _a;
      return ((_a = auth.user) == null ? void 0 : _a.username) || "Utilisateur";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Badge = resolveComponent("Badge");
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100" }, _attrs))}><div class="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8"><div class="flex items-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        onClick: handleLogoClick,
        class: "flex items-center gap-2 group shrink-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-10 w-10 object-contain transition-transform group-hover:scale-105"${_scopeId}><div class="hidden sm:block"${_scopeId}><span class="text-xl font-black tracking-tight text-slate-800"${_scopeId}>Casa</span><span class="text-xl font-black tracking-tight text-primary"${_scopeId}>Nayo</span></div>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-10 w-10 object-contain transition-transform group-hover:scale-105"
              }),
              createVNode("div", { class: "hidden sm:block" }, [
                createVNode("span", { class: "text-xl font-black tracking-tight text-slate-800" }, "Casa"),
                createVNode("span", { class: "text-xl font-black tracking-tight text-primary" }, "Nayo")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="hidden lg:flex flex-1 min-w-0 justify-center items-center gap-0.5 px-2" aria-label="Navigation principale"><div class="inline-flex items-center gap-0.5 rounded-full border border-stone-200/80 bg-gradient-to-b from-stone-50/95 to-white p-1 shadow-sm shadow-stone-200/40 ring-1 ring-stone-100/80">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: ["shrink-0", [navPillBase, unref(route).path === "/" ? navPillActive : navPillIdle]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Accueil `);
          } else {
            return [
              createTextVNode(" Accueil ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/properties",
        class: ["shrink-0", [navPillBase, isNavActive("/properties") ? navPillActive : navPillIdle]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Propri\xE9t\xE9s `);
          } else {
            return [
              createTextVNode(" Propri\xE9t\xE9s ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: ["shrink-0", [navPillBase, isNavActive("/services") ? navPillActive : navPillIdle]]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Services `);
          } else {
            return [
              createTextVNode(" Services ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative shrink-0"><button type="button" class="${ssrRenderClass([
        isDiscoverActive.value ? [navPillActive, "border-amber-900/25"] : [navPillIdle, "border-transparent"],
        "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 border"
      ])}"${ssrRenderAttr("aria-expanded", navDiscoverOpen.value)} aria-haspopup="true"> Vacances `);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["size-3.5 opacity-80 transition-transform duration-300", { "rotate-180": navDiscoverOpen.value }]
      }, null, _parent));
      _push(`</button>`);
      if (navDiscoverOpen.value) {
        _push(`<div class="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 py-2 shadow-2xl shadow-stone-300/30 backdrop-blur-xl ring-1 ring-stone-100"><p class="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400"> Explorer </p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/agences",
          class: "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950",
          onClick: ($event) => navDiscoverOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Palmtree), { class: "size-4 text-amber-700/90" }, null, _parent2, _scopeId));
              _push2(` Tourisme `);
            } else {
              return [
                createVNode(unref(Palmtree), { class: "size-4 text-amber-700/90" }),
                createTextVNode(" Tourisme ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/properties?type=H\xF4tel",
          class: "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 hover:text-stone-950",
          onClick: ($event) => navDiscoverOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Building2), { class: "size-4 text-stone-600" }, null, _parent2, _scopeId));
              _push2(` H\xF4tels `);
            } else {
              return [
                createVNode(unref(Building2), { class: "size-4 text-stone-600" }),
                createTextVNode(" H\xF4tels ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></nav><div class="flex items-center gap-4">`);
      if (isAuthenticated.value && isAdmin.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "hidden md:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "size-4" }, null, _parent3, _scopeId2));
                    _push3(` Dashboard ADMIN `);
                  } else {
                    return [
                      createVNode(unref(LayoutDashboard), { class: "size-4" }),
                      createTextVNode(" Dashboard ADMIN ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                  default: withCtx(() => [
                    createVNode(unref(LayoutDashboard), { class: "size-4" }),
                    createTextVNode(" Dashboard ADMIN ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (isAuthenticated.value && isGerant.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard/hotel",
          class: "hidden md:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "size-4" }, null, _parent3, _scopeId2));
                    _push3(` Dashboard `);
                  } else {
                    return [
                      createVNode(unref(LayoutDashboard), { class: "size-4" }),
                      createTextVNode(" Dashboard ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), { class: "h-11 px-6 font-black text-sm bg-blue-600 border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white transition-all rounded-xl shadow-lg flex items-center gap-2" }, {
                  default: withCtx(() => [
                    createVNode(unref(LayoutDashboard), { class: "size-4" }),
                    createTextVNode(" Dashboard ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isAuthenticated.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/compte/notifications",
          class: "relative hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#1976D2]/30 hover:bg-blue-50 hover:text-[#1976D2] group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Bell), { class: "size-5 transition-transform group-hover:scale-110" }, null, _parent2, _scopeId));
              if (unreadCount.value > 0) {
                _push2(`<span class="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in-50"${_scopeId}>${ssrInterpolate(unreadCount.value > 9 ? "9+" : unreadCount.value)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(Bell), { class: "size-5 transition-transform group-hover:scale-110" }),
                unreadCount.value > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white ring-2 ring-white animate-in zoom-in-50"
                }, toDisplayString(unreadCount.value > 9 ? "9+" : unreadCount.value), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isAuthenticated.value && !isAdmin.value) {
        _push(`<div class="relative"><button class="flex items-center gap-2 p-1 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-all group"><div class="size-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden">`);
        if ((_a = userProfile.value) == null ? void 0 : _a.images) {
          _push(`<img${ssrRenderAttr("src", userProfile.value.images)} class="size-full object-cover">`);
        } else {
          _push(`<div class="size-full flex items-center justify-center text-primary font-black text-xs">${ssrInterpolate(username.value.substring(0, 2).toUpperCase())}</div>`);
        }
        _push(`</div><span class="text-sm font-black text-slate-700 max-w-[100px] truncate">${ssrInterpolate(username.value)}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), {
          class: ["size-4 text-slate-400 group-hover:text-primary transition-colors", { "rotate-180": isDropdownOpen.value }]
        }, null, _parent));
        _push(`</button>`);
        if (isDropdownOpen.value) {
          _push(`<div class="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2"><div class="p-4 border-b border-slate-50"><p class="text-[10px] font-black tracking-widest text-primary uppercase">Mon Espace Personnel</p><p class="text-lg font-black text-slate-900">${ssrInterpolate(username.value)}</p><p class="text-xs text-slate-400 truncate">${ssrInterpolate((_b = unref(auth).user) == null ? void 0 : _b.email)}</p></div><div class="p-2 space-y-1">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/compte/notifications",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="flex items-center gap-3"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Bell), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` Notifications </div>`);
                if (unreadCount.value > 0) {
                  _push2(ssrRenderComponent(_component_Badge, {
                    variant: "destructive",
                    class: "h-5 px-1.5 text-[10px] font-black"
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(unreadCount.value)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unreadCount.value), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode(unref(Bell), { class: "size-4" }),
                    createTextVNode(" Notifications ")
                  ]),
                  unreadCount.value > 0 ? (openBlock(), createBlock(_component_Badge, {
                    key: 0,
                    variant: "destructive",
                    class: "h-5 px-1.5 text-[10px] font-black"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unreadCount.value), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/compte/reservations",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Calendar), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` R\xE9servations (biens) `);
              } else {
                return [
                  createVNode(unref(Calendar), { class: "size-4" }),
                  createTextVNode(" R\xE9servations (biens) ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/compte/sollicitations",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Wrench), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` Sollicitations (services) `);
              } else {
                return [
                  createVNode(unref(Wrench), { class: "size-4" }),
                  createTextVNode(" Sollicitations (services) ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (isGerant.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/compte/agences",
              onClick: ($event) => isDropdownOpen.value = false,
              class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Compass), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(` Mes agences (tourisme) `);
                } else {
                  return [
                    createVNode(unref(Compass), { class: "size-4" }),
                    createTextVNode(" Mes agences (tourisme) ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (!((_c = unref(auth).user) == null ? void 0 : _c.premium)) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/compte/abonnement",
              onClick: ($event) => isDropdownOpen.value = false,
              class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(CreditCard), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(` Abonnement Premium `);
                } else {
                  return [
                    createVNode(unref(CreditCard), { class: "size-4" }),
                    createTextVNode(" Abonnement Premium ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/compte/paiements",
              onClick: ($event) => isDropdownOpen.value = false,
              class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Receipt), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(` Historique des paiements `);
                } else {
                  return [
                    createVNode(unref(Receipt), { class: "size-4" }),
                    createTextVNode(" Historique des paiements ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/compte/profile",
            onClick: ($event) => isDropdownOpen.value = false,
            class: "flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl transition-all"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "size-4" }, null, _parent2, _scopeId));
                _push2(` Mon Profil `);
              } else {
                return [
                  createVNode(unref(User), { class: "size-4" }),
                  createTextVNode(" Mon Profil ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="${ssrRenderClass([isGerant.value ? "text-blue-600 hover:bg-blue-50" : "text-red-500 hover:bg-red-50", "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all"])}">`);
          _push(ssrRenderComponent(unref(LogOut), { class: "size-4" }, null, _parent));
          _push(` Se d\xE9connecter </button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="hidden lg:flex items-center gap-4 border-r border-slate-200 pr-6 mr-2"><span class="text-xs font-black uppercase tracking-wider text-slate-500">T\xE9l\xE9charger sur</span><a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="hover:opacity-80 transition-opacity" title="App Store"><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-8 w-auto"></a><a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="hover:opacity-80 transition-opacity" title="Play Store"><img${ssrRenderAttr("src", _imports_2)} alt="Play Store" class="h-8 w-auto"></a></div>`);
      if (!isAuthenticated.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "hidden md:block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Se connecter `);
                  } else {
                    return [
                      createTextVNode(" Se connecter ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$4), { class: "h-11 px-8 font-black text-sm bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95" }, {
                  default: withCtx(() => [
                    createTextVNode(" Se connecter ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex lg:hidden flex-col items-end gap-0.5 mr-2"><span class="text-[8px] font-black uppercase tracking-tighter text-slate-400 leading-none">T\xE9l\xE9charger</span><div class="flex items-center gap-1"><a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="hover:opacity-80 transition-opacity"><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-6 w-auto rounded-md shadow-sm"></a><a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="hover:opacity-80 transition-opacity"><img${ssrRenderAttr("src", _imports_2)} alt="Play Store" class="h-6 w-auto rounded-md shadow-sm"></a></div></div><button class="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">`);
      _push(ssrRenderComponent(unref(Menu), { class: "h-6 w-6" }, null, _parent));
      _push(`</button></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        var _a2;
        if (isMobileMenuOpen.value) {
          _push2(`<div class="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto"><div class="flex items-center justify-between p-6"><div class="flex items-center gap-2"><img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-10 w-10 object-contain"><span class="text-xl font-black tracking-tight text-slate-800">Casa<span class="text-primary">Nayo</span></span></div><button class="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">`);
          _push2(ssrRenderComponent(unref(X), { class: "h-6 w-6 text-slate-600" }, null, _parent));
          _push2(`</button></div><div class="flex-1 flex flex-col px-8 pt-4 gap-4">`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "text-2xl font-black text-slate-800 hover:text-primary transition-colors",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Accueil `);
              } else {
                return [
                  createTextVNode(" Accueil ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/properties",
            class: "text-2xl font-black text-slate-800 hover:text-primary transition-colors",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Propri\xE9t\xE9s `);
              } else {
                return [
                  createTextVNode(" Propri\xE9t\xE9s ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/services",
            class: "text-2xl font-black text-slate-800 hover:text-primary transition-colors",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(` Services `);
              } else {
                return [
                  createTextVNode(" Services ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div><button type="button" class="flex w-full items-center justify-between text-2xl font-black text-slate-800"> Vacances `);
          _push2(ssrRenderComponent(unref(ChevronDown), {
            class: ["size-6 transition-transform", { "rotate-180": mobileDiscoverOpen.value }]
          }, null, _parent));
          _push2(`</button><div class="mt-4 flex flex-col gap-3 border-l-2 border-amber-200/80 pl-4" style="${ssrRenderStyle(mobileDiscoverOpen.value ? null : { display: "none" })}">`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/agences",
            class: "flex items-center gap-3 text-lg font-bold text-slate-600",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(unref(Palmtree), { class: "size-5 text-amber-700" }, null, _parent2, _scopeId));
                _push3(` Tourisme `);
              } else {
                return [
                  createVNode(unref(Palmtree), { class: "size-5 text-amber-700" }),
                  createTextVNode(" Tourisme ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/properties?type=H\xF4tel",
            class: "flex items-center gap-3 text-lg font-bold text-slate-600",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(unref(Building2), { class: "size-5 text-slate-600" }, null, _parent2, _scopeId));
                _push3(` H\xF4tels `);
              } else {
                return [
                  createVNode(unref(Building2), { class: "size-5 text-slate-600" }),
                  createTextVNode(" H\xF4tels ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div><div class="border-t border-slate-100 my-4 w-10"></div>`);
          if (isAuthenticated.value) {
            _push2(`<!--[-->`);
            if (isAdmin.value) {
              _push2(`<div class="space-y-4">`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/dashboard",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "bg-blue-600 text-white rounded-2xl h-14 flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-600/20 w-full block"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-center gap-2 w-full h-full"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(` Dashboard Admin </div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-center gap-2 w-full h-full" }, [
                        createVNode(unref(LayoutDashboard), { class: "w-5 h-5" }),
                        createTextVNode(" Dashboard Admin ")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent));
              _push2(`</div>`);
            } else if (isGerant.value) {
              _push2(`<div class="space-y-4">`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/dashboard/hotel",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "bg-blue-600 text-white rounded-2xl h-14 flex items-center justify-center gap-3 font-bold shadow-lg shadow-blue-600/20 w-full block"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center justify-center gap-2 w-full h-full"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(LayoutDashboard), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(` Dashboard </div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-center gap-2 w-full h-full" }, [
                        createVNode(unref(LayoutDashboard), { class: "w-5 h-5" }),
                        createTextVNode(" Dashboard ")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!isAdmin.value) {
              _push2(`<div class="space-y-4">`);
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/compte/notifications",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "flex items-center justify-between text-lg font-bold text-slate-600"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="flex items-center gap-4"${_scopeId}><div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(Bell), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(`</div> Notifications </div>`);
                    if (unreadCount.value > 0) {
                      _push3(ssrRenderComponent(_component_Badge, {
                        variant: "destructive",
                        class: "h-6 px-2 text-xs font-black"
                      }, {
                        default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(unreadCount.value)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(unreadCount.value), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent2, _scopeId));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode("div", { class: "size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" }, [
                          createVNode(unref(Bell), { class: "w-5 h-5" })
                        ]),
                        createTextVNode(" Notifications ")
                      ]),
                      unreadCount.value > 0 ? (openBlock(), createBlock(_component_Badge, {
                        key: 0,
                        variant: "destructive",
                        class: "h-6 px-2 text-xs font-black"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unreadCount.value), 1)
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent));
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/compte/reservations",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "flex items-center gap-4 text-lg font-bold text-slate-600"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(Calendar), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(`</div> R\xE9servations (biens) `);
                  } else {
                    return [
                      createVNode("div", { class: "size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" }, [
                        createVNode(unref(Calendar), { class: "w-5 h-5" })
                      ]),
                      createTextVNode(" R\xE9servations (biens) ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/compte/sollicitations",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "flex items-center gap-4 text-lg font-bold text-slate-600"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(Wrench), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(`</div> Sollicitations (services) `);
                  } else {
                    return [
                      createVNode("div", { class: "size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" }, [
                        createVNode(unref(Wrench), { class: "w-5 h-5" })
                      ]),
                      createTextVNode(" Sollicitations (services) ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
              if (!((_a2 = unref(auth).user) == null ? void 0 : _a2.premium)) {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: "/compte/abonnement",
                  onClick: ($event) => isMobileMenuOpen.value = false,
                  class: "flex items-center gap-4 text-lg font-bold text-slate-600"
                }, {
                  default: withCtx((_, _push3, _parent2, _scopeId) => {
                    if (_push3) {
                      _push3(`<div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"${_scopeId}>`);
                      _push3(ssrRenderComponent(unref(CreditCard), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                      _push3(`</div> Abonnement Premium `);
                    } else {
                      return [
                        createVNode("div", { class: "size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" }, [
                          createVNode(unref(CreditCard), { class: "w-5 h-5" })
                        ]),
                        createTextVNode(" Abonnement Premium ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent));
              } else {
                _push2(ssrRenderComponent(_component_NuxtLink, {
                  to: "/compte/paiements",
                  onClick: ($event) => isMobileMenuOpen.value = false,
                  class: "flex items-center gap-4 text-lg font-bold text-slate-600"
                }, {
                  default: withCtx((_, _push3, _parent2, _scopeId) => {
                    if (_push3) {
                      _push3(`<div class="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"${_scopeId}>`);
                      _push3(ssrRenderComponent(unref(Receipt), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                      _push3(`</div> Historique des paiements `);
                    } else {
                      return [
                        createVNode("div", { class: "size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center" }, [
                          createVNode(unref(Receipt), { class: "w-5 h-5" })
                        ]),
                        createTextVNode(" Historique des paiements ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent));
              }
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/compte/profile",
                onClick: ($event) => isMobileMenuOpen.value = false,
                class: "flex items-center gap-4 text-lg font-bold text-slate-600"
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(`<div class="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"${_scopeId}>`);
                    _push3(ssrRenderComponent(unref(User), { class: "w-5 h-5" }, null, _parent2, _scopeId));
                    _push3(`</div> Mon Profil `);
                  } else {
                    return [
                      createVNode("div", { class: "size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center" }, [
                        createVNode(unref(User), { class: "w-5 h-5" })
                      ]),
                      createTextVNode(" Mon Profil ")
                    ];
                  }
                }),
                _: 1
              }, _parent));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button class="${ssrRenderClass([isGerant.value ? "text-blue-600" : "text-red-500", "flex items-center gap-4 text-lg font-bold mt-2"])}"><div class="${ssrRenderClass([isGerant.value ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500", "size-10 rounded-xl flex items-center justify-center"])}">`);
            _push2(ssrRenderComponent(unref(LogOut), { class: "w-5 h-5" }, null, _parent));
            _push2(`</div> Se d\xE9connecter </button><!--]-->`);
          } else {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/login",
              onClick: ($event) => isMobileMenuOpen.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4), { class: "w-full h-14 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 text-lg" }, {
                    default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                      if (_push4) {
                        _push4(` Se connecter `);
                      } else {
                        return [
                          createTextVNode(" Se connecter ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(unref(_sfc_main$4), { class: "w-full h-14 font-black bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 text-lg" }, {
                      default: withCtx(() => [
                        createTextVNode(" Se connecter ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent));
          }
          _push2(`</div><div class="p-8 bg-slate-50 mt-auto"><p class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 text-center">T\xE9l\xE9charger l&#39;application</p><div class="grid grid-cols-2 gap-4"><a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all"><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-6 w-auto"></a><a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all"><img${ssrRenderAttr("src", _imports_2)} alt="Play Store" class="h-6 w-auto"></a></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Navbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-white text-slate-900 pt-24 pb-12 overflow-hidden relative border-t border-slate-100" }, _attrs))}><div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-sky-400 opacity-20"></div><div class="absolute -top-24 -right-24 size-96 bg-primary/5 rounded-full blur-[100px]"></div><div class="absolute -bottom-24 -left-24 size-96 bg-blue-600/5 rounded-full blur-[100px]"></div><div class="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16"><div class="lg:col-span-4 space-y-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="CasaNayo" class="h-12 w-12 object-contain rounded-2xl transition-transform group-hover:scale-105"${_scopeId}><div class="flex flex-col"${_scopeId}><span class="text-2xl font-black tracking-tight leading-none text-slate-900"${_scopeId}>CasaNayo</span><span class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1"${_scopeId}>Immobilier &amp; Services</span></div>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "CasaNayo",
                class: "h-12 w-12 object-contain rounded-2xl transition-transform group-hover:scale-105"
              }),
              createVNode("div", { class: "flex flex-col" }, [
                createVNode("span", { class: "text-2xl font-black tracking-tight leading-none text-slate-900" }, "CasaNayo"),
                createVNode("span", { class: "text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1" }, "Immobilier & Services")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-slate-500 text-base leading-relaxed max-w-sm"> CasaNayo red\xE9finit l&#39;exp\xE9rience immobili\xE8re en Afrique. Nous connectons les propri\xE9taires, les acheteurs et les professionnels de service sur une plateforme unique, s\xE9curis\xE9e et intuitive. </p><div class="flex gap-4"><a href="https://www.facebook.com/profile.php?id=61583613054158&amp;mibextid=rS40aB7S9Ucbxw6v" target="_blank" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Facebook), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Twitter), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Instagram), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a><a href="#" class="group size-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary hover:border-primary transition-all duration-300">`);
      _push(ssrRenderComponent(unref(Linkedin), { class: "size-5 text-slate-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</a></div></div><div class="lg:col-span-2 text-left"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> Menu <span class="absolute -bottom-2 left-0 w-8 h-1 bg-primary rounded-full"></span></h3><ul class="space-y-4"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Accueil`);
          } else {
            return [
              createTextVNode(" Accueil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/properties",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Propri\xE9t\xE9s`);
          } else {
            return [
              createTextVNode(" Propri\xE9t\xE9s")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/services",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Services`);
          } else {
            return [
              createTextVNode(" Services")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact`);
          } else {
            return [
              createTextVNode(" Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="lg:col-span-2 text-left"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> L\xE9gal <span class="absolute -bottom-2 left-0 w-8 h-1 bg-blue-500 rounded-full"></span></h3><ul class="space-y-4 font-bold text-left"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terms",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Conditions d&#39;utilisation`);
          } else {
            return [
              createTextVNode(" Conditions d'utilisation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Confidentialit\xE9`);
          } else {
            return [
              createTextVNode(" Confidentialit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/booking-policy",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Politique de R\xE9servation`);
          } else {
            return [
              createTextVNode(" Politique de R\xE9servation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/legal",
        class: "text-slate-500 hover:text-primary hover:translate-x-1 flex items-center gap-2 transition-all group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mentions l\xE9gales`);
          } else {
            return [
              createTextVNode(" Mentions l\xE9gales")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div class="lg:col-span-4 space-y-8"><h3 class="text-lg font-bold text-slate-900 mb-8 relative inline-block"> T\xE9l\xE9charger l&#39;App <span class="absolute -bottom-2 left-0 w-8 h-1 bg-sky-400 rounded-full"></span></h3><div class="flex flex-col sm:flex-row gap-4"><a href="https://apps.apple.com/fr/app/casanayo/id6757759953?l=en-GB" target="_blank" class="flex items-center gap-3 px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md group"><img${ssrRenderAttr("src", _imports_1)} alt="App Store" class="h-6 w-auto"><div class="text-left"><div class="text-[0.6rem] font-medium opacity-60 leading-none">T\xE9l\xE9charger sur</div><div class="text-xs font-bold leading-tight">App Store</div></div></a><a href="https://play.google.com/store/apps/details?id=com.casa.casa.casa&amp;pcampaignid=web_share" target="_blank" class="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-50 transition-all shadow-md group"><img${ssrRenderAttr("src", _imports_2)} alt="Play Store" class="h-6 w-auto"><div class="text-left"><div class="text-[0.6rem] font-medium opacity-60 leading-none">DISPONIBLE SUR</div><div class="text-xs font-bold leading-tight">Google Play</div></div></a></div></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-slate-100 mt-8"><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "size-5 text-primary group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Si\xE8ge Social</p><p class="text-sm font-bold text-slate-800 leading-snug"> Av. S\xE9n\xE9galais, Gare Centrale<br> Kinshasa Gombe, RDC </p></div></div><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Phone), { class: "size-5 text-blue-500 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Contact</p><p class="text-sm font-bold text-slate-800">+243 836 323 805</p></div></div><div class="flex items-center gap-4 group"><div class="size-12 rounded-2xl bg-sky-400/5 border border-sky-400/10 flex items-center justify-center group-hover:bg-sky-400 group-hover:border-sky-400 transition-all duration-500">`);
      _push(ssrRenderComponent(unref(Mail), { class: "size-5 text-sky-400 group-hover:text-white transition-colors" }, null, _parent));
      _push(`</div><div><p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Support</p><p class="text-sm font-bold text-slate-800">contact@casanayo.com</p></div></div></div><div class="pt-8 text-center sm:flex sm:justify-between sm:text-left"><p class="text-sm text-slate-400 font-medium"> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} <span class="text-slate-900 font-bold">CasaNayo</span>. Fi\xE8rement d\xE9velopp\xE9 pour l&#39;excellence. </p><div class="mt-4 sm:mt-0 flex gap-6 justify-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Confidentialit\xE9`);
          } else {
            return [
              createTextVNode("Confidentialit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/booking-policy",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`R\xE9servation`);
          } else {
            return [
              createTextVNode("R\xE9servation")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cookies",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cookies`);
          } else {
            return [
              createTextVNode("Cookies")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/security",
        class: "text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`S\xE9curit\xE9`);
          } else {
            return [
              createTextVNode("S\xE9curit\xE9")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/front/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CustomCursor",
  __ssrInlineRender: true,
  setup(__props) {
    const cursorX = ref(0);
    const cursorY = ref(0);
    const cursorOutlineX = ref(0);
    const cursorOutlineY = ref(0);
    const isHovering = ref(false);
    const isClicking = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 pointer-events-none z-[9999] hidden lg:block" }, _attrs))}><div style="${ssrRenderStyle({ left: `${cursorX.value}px`, top: `${cursorY.value}px` })}" class="${ssrRenderClass([{ "scale-0": isHovering.value }, "fixed w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"])}"></div><div style="${ssrRenderStyle({
        left: `${cursorOutlineX.value}px`,
        top: `${cursorOutlineY.value}px`,
        width: isHovering.value ? "60px" : "40px",
        height: isHovering.value ? "60px" : "40px",
        opacity: isHovering.value ? "0.5" : "0.3",
        backgroundColor: isHovering.value ? "rgba(var(--primary-rgb), 0.1)" : "transparent"
      })}" class="${ssrRenderClass([{ "scale-90": isClicking.value }, "fixed border-2 border-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"])}"></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CustomCursor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-background font-sans antialiased text-foreground" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CkzZfEfA.mjs.map
